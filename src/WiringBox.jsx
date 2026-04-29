import { ALPHA, ROTOR_NAMES } from './enigma.js';

function WiringRow({ label, notch, wiring }) {
  return (
    <div className="wr-row">
      <div className="wr-row-label">
        {label}
        {notch && <span className="wr-notch-badge">Notch: {notch}</span>}
      </div>
      <div className="wr-cells">
        {ALPHA.split('').map((ch, i) => (
          <div key={ch} className={`wr-cell${notch === ch ? ' wr-cell-notch' : ''}`}>
            <span className="wr-src">{ch}</span>
            <span className="wr-dst">{wiring[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WiringBox({ rotorData, reflector, onShuffle, onReset }) {
  return (
    <div className="wiring-box">
      <div className="wiring-box-hdr">
        <span className="wiring-box-title">Verdrahtung — Wiring &amp; Notch</span>
        <button className="shuffle-btn" onClick={onShuffle}>⇌ Shuffle Wiring</button>
        <button className="reset-btn" onClick={onReset}>↺ Reset</button>
      </div>
      {ROTOR_NAMES.map(r => (
        <WiringRow key={r} label={`Walze ${r}`} notch={rotorData[r].notch} wiring={rotorData[r].wiring} />
      ))}
      <WiringRow label="UKW-B" notch={null} wiring={reflector} />
    </div>
  );
}
