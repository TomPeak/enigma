import { useState } from 'react';
import RotorControl from './RotorControl.jsx';
import PlugboardVisual from './PlugboardVisual.jsx';
import WiringBox from './WiringBox.jsx';
import { encrypt, group5, parsePlugboard, ci, ALPHA, ROTOR_NAMES, ROTOR_DATA, REFLECTOR_B } from './enigma.js';
import './App.css';

const ni = ch => ch.charCodeAt(0) - 65;

const shuffleWiring = () => {
  const arr = ALPHA.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

export default function App() {
  const [rotors, setRotors]     = useState(['I', 'II', 'III']);
  const [startPos, setStartPos] = useState(['A', 'A', 'A']);
  const [rings, setRings]       = useState(['A', 'A', 'A']);
  const [plugboard, setPlugboard] = useState('');
  const [input, setInput]       = useState('');
  const [mode, setMode]         = useState('encrypt');
  const [isShuffled, setIsShuffled] = useState(false);
  const [customRotorData, setCustomRotorData] = useState(null);
  const [customReflector, setCustomReflector] = useState(null);

  const shuffle = () => {
    const pool = [...ROTOR_NAMES];
    const picked = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    setRotors(picked);
    setStartPos([0, 0, 0].map(() => ALPHA[Math.floor(Math.random() * 26)]));
    setRings([0, 0, 0].map(() => ALPHA[Math.floor(Math.random() * 26)]));
    setIsShuffled(true);
  };

  const shuffleWiringConfig = () => {
    const newRotors = {};
    ROTOR_NAMES.forEach(name => {
      const notches = ['Q', 'E', 'V', 'J', 'Z'];
      newRotors[name] = {
        wiring: shuffleWiring(),
        notch: ALPHA[Math.floor(Math.random() * 26)]
      };
    });
    setCustomRotorData(newRotors);
    setCustomReflector(shuffleWiring());
  };

  const resetWiring = () => {
    setCustomRotorData(null);
    setCustomReflector(null);
  };

  const updateRotor = (i, v) => { const r = [...rotors]; r[i] = v; setRotors(r); };
  const updatePos   = (i, v) => { const p = [...startPos]; p[i] = v; setStartPos(p); };
  const updateRing  = (i, v) => { const r = [...rings]; r[i] = v; setRings(r); };

  const activeRotorData = customRotorData || ROTOR_DATA;
  const activeReflector = customReflector || REFLECTOR_B;

  const output    = encrypt(input, rotors, startPos, rings, plugboard, activeRotorData, activeReflector);
  const displayed = mode === 'encrypt' ? group5(output) : output;

  const plugPairs = parsePlugboard(plugboard);
  const plugCount = Object.keys(plugPairs).length / 2;

  const plugList = Object.entries(plugPairs)
    .filter(([a, b]) => a < b);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ENIGMA MACHINE V2.71</h1>
        <span className={`badge ${customRotorData ? 'badge-dark' : 'badge-highlight'}`}>Wehrmacht M3 · UKW-B</span>
      </header>

      <div className="shuffle-box">
        <span className="shuffle-label">Zufällige Einstellung</span>
        <button className="shuffle-btn" onClick={shuffle}>⇌ Shuffle</button>
        <span className="shuffle-hint">{rotors.join(' · ')} · {startPos.join('')} · {rings.join('')}</span>
      </div>

      <section>
        <div className="section-title">Rotoren — Walzen</div>
        <div className="rotors-grid">
          <RotorControl label="Links (L)"  rotor={rotors[0]} pos={startPos[0]} ring={rings[0]}
            onRotor={v => updateRotor(0, v)} onPos={v => updatePos(0, v)} onRing={v => updateRing(0, v)}
            selectedRotors={rotors} />
          <RotorControl label="Mitte (M)" rotor={rotors[1]} pos={startPos[1]} ring={rings[1]}
            onRotor={v => updateRotor(1, v)} onPos={v => updatePos(1, v)} onRing={v => updateRing(1, v)}
            selectedRotors={rotors} />
          <RotorControl label="Rechts (R)" rotor={rotors[2]} pos={startPos[2]} ring={rings[2]}
            onRotor={v => updateRotor(2, v)} onPos={v => updatePos(2, v)} onRing={v => updateRing(2, v)}
            selectedRotors={rotors} />
        </div>
      </section>

      <section>
        <div className="section-title">Steckerbrett — Plugboard</div>
        <PlugboardVisual value={plugboard} onChange={setPlugboard} />
      </section>

      <section>
        <WiringBox
          rotorData={activeRotorData}
          reflector={activeReflector}
          onShuffle={shuffleWiringConfig}
          onReset={resetWiring}
        />
      </section>

      <section>
        <div className="mode-tabs">
          <button
            className={`tab ${mode === 'encrypt' ? 'active' : ''}`}
            onClick={() => setMode('encrypt')}
          >Verschlüsseln</button>
          <button
            className={`tab ${mode === 'decrypt' ? 'active' : ''}`}
            onClick={() => setMode('decrypt')}
          >Entschlüsseln</button>
        </div>

        <div className="section-title" style={{ marginTop: '1rem' }}>
          {mode === 'encrypt' ? 'Klartext' : 'Geheimtext (Eingabe)'}
        </div>
        <textarea
          rows={4}
          placeholder={mode === 'encrypt' ? 'Klartext eingeben…' : 'Geheimtext eingeben…'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </section>

      <section>
        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{mode === 'encrypt' ? 'Geheimtext — Ausgabe' : 'Klartext — Ausgabe'}</span>
          {output && <span className="char-count">{output.length} Zeichen</span>}
        </div>
        <div className="output-box">
          {displayed || <span className="output-placeholder">Ausgabe erscheint hier…</span>}
        </div>
        {output && (
          <p className="hint">
            Kein Buchstabe kann sich selbst verschlüsseln — das war die fundamentale Schwäche der Enigma.
          </p>
        )}
      </section>

      <footer className="app-footer">
        Enigma M3 · Rotoren I–V · UKW-B · Doppelstep-Anomalie implementiert
      </footer>
    </div>
  );
}
