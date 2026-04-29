export const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const ROTOR_DATA = {
  I:   { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II:  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV:  { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V:   { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
};

export const REFLECTOR_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
export const ROTOR_NAMES = ['I', 'II', 'III', 'IV', 'V'];

const ni = ch => ch.charCodeAt(0) - 65;
export const ci = i => String.fromCharCode(65 + ((i % 26 + 26) % 26));

export function rotorFwd(wiring, sig, pos, ring) {
  const shift = (ni(pos) - ni(ring) + 26) % 26;
  const contact = (sig + shift + 26) % 26;
  const out = ni(wiring[contact]);
  return (out - shift + 26) % 26;
}

export function rotorBwd(wiring, sig, pos, ring) {
  const shift = (ni(pos) - ni(ring) + 26) % 26;
  const contact = (sig + shift + 26) % 26;
  const inv = wiring.split('').findIndex(ch => ni(ch) === contact);
  return (inv - shift + 26) % 26;
}

export function stepRotors(pos, rotors, rotorData = ROTOR_DATA) {
  const p = [...pos];
  const nm = rotorData[rotors[1]].notch;
  const nr = rotorData[rotors[2]].notch;
  if (p[1] === nm) {
    p[0] = ci(ni(p[0]) + 1);
    p[1] = ci(ni(p[1]) + 1);
  } else if (p[2] === nr) {
    p[1] = ci(ni(p[1]) + 1);
  }
  p[2] = ci(ni(p[2]) + 1);
  return p;
}

export function parsePlugboard(str) {
  const pairs = {};
  (str.toUpperCase().match(/[A-Z]{2}/g) || []).forEach(pair => {
    if (pair[0] !== pair[1] && !pairs[pair[0]] && !pairs[pair[1]]) {
      pairs[pair[0]] = pair[1];
      pairs[pair[1]] = pair[0];
    }
  });
  return pairs;
}

export function encrypt(text, rotors, startPos, rings, plugStr, rotorData = ROTOR_DATA, reflector = REFLECTOR_B) {
  const plug = parsePlugboard(plugStr);
  let pos = [...startPos];
  return text.toUpperCase().split('').map(ch => {
    if (!ALPHA.includes(ch)) return '';
    pos = stepRotors(pos, rotors, rotorData);
    let s = ni(plug[ch] || ch);
    for (let i = 2; i >= 0; i--) s = rotorFwd(rotorData[rotors[i]].wiring, s, pos[i], rings[i]);
    s = ni(reflector[s]);
    for (let i = 0; i <= 2; i++) s = rotorBwd(rotorData[rotors[i]].wiring, s, pos[i], rings[i]);
    const out = ALPHA[s];
    return plug[out] || out;
  }).join('');
}

export function group5(str) {
  return str.replace(/(.{5})/g, '$1 ').trim();
}
