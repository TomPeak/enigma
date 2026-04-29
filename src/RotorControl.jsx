import { ROTOR_NAMES, ROTOR_DATA, ALPHA, ci } from './enigma.js';

const ni = ch => ch.charCodeAt(0) - 65;

export default function RotorControl({ label, rotor, pos, ring, onRotor, onPos, onRing, selectedRotors = [] }) {
  return (
    <div className="rotor-card">
      <div className="rotor-label">{label}</div>
      <button className="rotor-btn" onClick={() => onPos(ci(ni(pos) + 1))}>▲</button>
      <div className="rotor-letter">{pos}</div>
      <button className="rotor-btn" onClick={() => onPos(ci(ni(pos) - 1))}>▼</button>

    <label className="field-label">Walze</label>
    <div className="rotor-radio-group">
      {ROTOR_NAMES.map(r => {
        const isUsedElsewhere = selectedRotors.includes(r) && rotor !== r;
        return (
          <label key={r} className={`rotor-radio ${rotor === r ? 'rotor-radio-active' : ''} ${isUsedElsewhere ? 'rotor-radio-disabled' : ''}`}>
            <input
              type="radio"
              name={`rotor-${label}`}
              value={r}
              checked={rotor === r}
              disabled={isUsedElsewhere}
              onChange={() => onRotor(r)}
            />
            {r}
          </label>
        );
      })}
    </div>

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
