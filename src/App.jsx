import { useState } from 'react';
import RotorControl from './RotorControl.jsx';
import PlugboardVisual from './PlugboardVisual.jsx';
import { encrypt, group5, parsePlugboard, ci, ALPHA } from './enigma.js';
import './App.css';

const ni = ch => ch.charCodeAt(0) - 65;

export default function App() {
  const [rotors, setRotors]     = useState(['I', 'II', 'III']);
  const [startPos, setStartPos] = useState(['A', 'A', 'A']);
  const [rings, setRings]       = useState(['A', 'A', 'A']);
  const [plugboard, setPlugboard] = useState('');
  const [input, setInput]       = useState('');
  const [mode, setMode]         = useState('encrypt');

  const updateRotor = (i, v) => { const r = [...rotors]; r[i] = v; setRotors(r); };
  const updatePos   = (i, v) => { const p = [...startPos]; p[i] = v; setStartPos(p); };
  const updateRing  = (i, v) => { const r = [...rings]; r[i] = v; setRings(r); };

  const output    = encrypt(input, rotors, startPos, rings, plugboard);
  const displayed = mode === 'encrypt' ? group5(output) : output;

  const plugPairs = parsePlugboard(plugboard);
  const plugCount = Object.keys(plugPairs).length / 2;

  const plugList = Object.entries(plugPairs)
    .filter(([a, b]) => a < b);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ENIGMA MACHINE</h1>
        <span className="badge">Wehrmacht M3 · UKW-B</span>
      </header>

      <section>
        <div className="section-title">Rotoren — Walzen</div>
        <div className="rotors-grid">
          <RotorControl label="Links (L)"  rotor={rotors[0]} pos={startPos[0]} ring={rings[0]}
            onRotor={v => updateRotor(0, v)} onPos={v => updatePos(0, v)} onRing={v => updateRing(0, v)} />
          <RotorControl label="Mitte (M)" rotor={rotors[1]} pos={startPos[1]} ring={rings[1]}
            onRotor={v => updateRotor(1, v)} onPos={v => updatePos(1, v)} onRing={v => updateRing(1, v)} />
          <RotorControl label="Rechts (R)" rotor={rotors[2]} pos={startPos[2]} ring={rings[2]}
            onRotor={v => updateRotor(2, v)} onPos={v => updatePos(2, v)} onRing={v => updateRing(2, v)} />
        </div>
      </section>

      <section>
        <div className="section-title">Steckerbrett — Plugboard</div>
        <PlugboardVisual value={plugboard} onChange={setPlugboard} />
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
