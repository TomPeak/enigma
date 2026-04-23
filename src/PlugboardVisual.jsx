import { useState, useRef, useEffect, useCallback } from 'react';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ROW1  = 'QWERTYUIOP';
const ROW2  = 'ASDFGHJKL';
const ROW3  = 'ZXCVBNM';

// 10 distinct cable colors
const CABLE_COLORS = [
  '#8B4513', '#A0522D', '#CD853F', '#6B3A2A',
  '#C68642', '#7B3F00', '#D2691E', '#5C3317',
  '#B8860B', '#9A6324',
];

function parsePlugs(str) {
  const pairs = {};
  (str.toUpperCase().match(/[A-Z]{2}/g) || []).forEach(pair => {
    if (pair[0] !== pair[1] && !pairs[pair[0]] && !pairs[pair[1]]) {
      pairs[pair[0]] = pair[1];
      pairs[pair[1]] = pair[0];
    }
  });
  return pairs;
}

function pairsToString(pairs) {
  const seen = new Set();
  const parts = [];
  Object.entries(pairs).forEach(([a, b]) => {
    const key = [a, b].sort().join('');
    if (!seen.has(key)) { seen.add(key); parts.push(key); }
  });
  return parts.join(' ');
}

export default function PlugboardVisual({ value, onChange }) {
  const svgRef    = useRef(null);
  const socketRef = useRef({});
  const [pending, setPending]   = useState(null);   // letter waiting for partner
  const [positions, setPositions] = useState({});   // letter -> {x,y}

  const pairs = parsePlugs(value);
  const usedLetters = new Set(Object.keys(pairs));
  const pairList = Object.entries(pairs).filter(([a, b]) => a < b);

  // Measure socket positions after render
  const measureSockets = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svgRect = svgEl.getBoundingClientRect();
    const pos = {};
    Object.entries(socketRef.current).forEach(([letter, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      pos[letter] = {
        x: r.left - svgRect.left + r.width / 2,
        y: r.top  - svgRect.top  + r.height,
      };
    });
    setPositions(pos);
  }, []);

  useEffect(() => {
    measureSockets();
    const ro = new ResizeObserver(measureSockets);
    if (svgRef.current) ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, [measureSockets]);

  function handleClick(letter) {
    // If already connected → disconnect
    if (usedLetters.has(letter)) {
      const partner = pairs[letter];
      const newPairs = { ...pairs };
      delete newPairs[letter];
      delete newPairs[partner];
      onChange(pairsToString(newPairs));
      setPending(null);
      return;
    }
    // Pending: complete the pair
    if (pending && pending !== letter) {
      if (Object.keys(pairs).length / 2 >= 10) { setPending(null); return; }
      const newPairs = { ...pairs, [pending]: letter, [letter]: pending };
      onChange(pairsToString(newPairs));
      setPending(null);
      return;
    }
    // Start pending
    setPending(letter === pending ? null : letter);
  }

  // Assign a color index per pair (stable: sort pair, use pairList index)
  const pairColor = {};
  pairList.forEach(([a, b], i) => {
    pairColor[a] = CABLE_COLORS[i % CABLE_COLORS.length];
    pairColor[b] = CABLE_COLORS[i % CABLE_COLORS.length];
  });

  const svgH = 120; // px, enough for cables

  function Cable({ a, b, color }) {
    const pa = positions[a];
    const pb = positions[b];
    if (!pa || !pb) return null;
    const mx = (pa.x + pb.x) / 2;
    const sag = 38 + Math.abs(pa.x - pb.x) * 0.08;
    const cy = Math.max(pa.y, pb.y) + sag;
    const d = `M ${pa.x} ${pa.y} Q ${mx} ${cy} ${pb.x} ${pb.y}`;
    return (
      <>
        <path d={d} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.25" />
        <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9"
          strokeDasharray="none" />
        {/* plug ends */}
        <circle cx={pa.x} cy={pa.y} r="4" fill={color} />
        <circle cx={pb.x} cy={pb.y} r="4" fill={color} />
      </>
    );
  }

  function SocketRow({ letters }) {
    return (
      <div className="pb-row">
        {letters.split('').map(letter => {
          const connected = usedLetters.has(letter);
          const isPending = pending === letter;
          const color = pairColor[letter] || null;
          return (
            <button
              key={letter}
              ref={el => { socketRef.current[letter] = el; }}
              className={[
                'pb-socket',
                connected ? 'pb-connected' : 'pb-free',
                isPending ? 'pb-pending' : '',
              ].join(' ')}
              style={connected ? { '--cable-color': color, borderColor: color, color: color } : {}}
              onClick={() => handleClick(letter)}
              title={
                connected
                  ? `${letter} ↔ ${pairs[letter]} (klick zum Trennen)`
                  : isPending
                  ? `${letter} wartet… klick auf Partner`
                  : `${letter} verbinden`
              }
            >
              {letter}
              <span className="pb-plug" style={{ background: color }} />
            </button>
          );
        })}
      </div>
    );
  }

  const freeCount = 26 - usedLetters.size;
  const pairCount = pairList.length;

  return (
    <div>
    <div className="pb-wrap">
      <div className="pb-info-row">
        <span className="pb-stat free">{freeCount} frei</span>
        <span className="pb-stat used">{pairCount}/10 Paare</span>
        {pending && <span className="pb-stat pending">⚡ {pending} — wähle Partner</span>}
        {!pending && pairCount < 10 && freeCount > 1 && (
          <span className="pb-hint">Buchstaben anklicken zum Verbinden</span>
        )}
        {pairCount > 0 && (
          <button className="pb-reset" onClick={() => { onChange(''); setPending(null); }}>
            Alle trennen
          </button>
        )}
      </div>

      {/* SVG cable layer */}
      <div className="pb-canvas-wrap" ref={svgRef}>
        <svg
          className="pb-svg"
          style={{ height: svgH }}
          aria-hidden="true"
        >
          {pairList.map(([a, b]) => (
            <Cable key={a + b} a={a} b={b} color={pairColor[a]} />
          ))}
          {/* pending dotted line to center */}
          {pending && positions[pending] && (
            <line
              x1={positions[pending].x} y1={positions[pending].y}
              x2={positions[pending].x} y2={positions[pending].y + 20}
              stroke="#EF9F27" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"
            />
          )}
        </svg>

        {/* Keyboard layout */}
        <div className="pb-keyboard">
          <SocketRow letters={ROW1} />
          <SocketRow letters={ROW2} />
          <SocketRow letters={ROW3} />
        </div>
      </div>
      
    </div>
    <div className="pb-wrap">
      <div className="pb-info-row">
        {/* Pair summary */}
      {pairCount > 0 && (
        <div className="pb-pairs">
          {pairList.map(([a, b]) => (
            <span
              key={a + b}
              className="pb-pair-tag"
              style={{ borderColor: pairColor[a], color: pairColor[a] }}
              onClick={() => handleClick(a)}
              title="Klick zum Trennen"
            >
              {a}↔{b} ✕
            </span>
          ))}
        </div>
      )}
    </div>
    </div>
  </div>
  );
}
