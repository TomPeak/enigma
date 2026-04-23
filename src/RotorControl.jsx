import { ROTOR_NAMES, ROTOR_DATA, ALPHA, ci } from './enigma.js';

const ni = ch => ch.charCodeAt(0) - 65;

export default function RotorControl({ label, rotor, pos, ring, onRotor, onPos, onRing }) {
  return (
    <div className="rotor-card">
      <div className="rotor-label">{label}</div>
      <button className="rotor-btn" onClick={() => onPos(ci(ni(pos) + 1))}>▲</button>
      <div className="rotor-letter">{pos}</div>
      <button className="rotor-btn" onClick={() => onPos(ci(ni(pos) - 1))}>▼</button>

      <label className="field-label">Walze</label>
      <select value={rotor} onChange={e => onRotor(e.target.value)}>
        {ROTOR_NAMES.map(r => <option key={r} value={r}>Rotor {r}</option>)}
      </select>

      <label className="field-label">Ringstellung</label>
      <select value={ring} onChange={e => onRing(e.target.value)}>
        {ALPHA.split('').map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      <div className="notch-info">
        <span className="notch-dot" />
        Notch: {ROTOR_DATA[rotor].notch}
      </div>
    </div>
  );
}
