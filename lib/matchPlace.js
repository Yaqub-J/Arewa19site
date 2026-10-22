// Matches the free-text "State of Residence" and "LGA" answers from the registration form to the
// P-codes in public/maps/northern-nigeria/admin.json, so each registration can be placed on the map.

const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\b(state|local government area|local government|lga|l\.g\.a)\b/g, ' ')
    .replace(/[^a-z0-9]/g, '');

// Common spellings that differ from the boundary data's names
const STATE_ALIASES = {
  abuja: 'fct',
  fctabuja: 'fct',
  abujafct: 'fct',
  federalcapitalterritory: 'fct',
  nassarawa: 'nasarawa',
};
const LGA_ALIASES = { amac: 'abujamunicipal', abujamunicipalareacouncil: 'abujamunicipal' };

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Finds the one place whose normalised name matches `q` exactly, by prefix, or within a small typo distance. */
function findOne(q, places) {
  if (!q) return null;
  const exact = places.filter((p) => p.key === q);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return null;
  const prefix = places.filter((p) => q.length >= 4 && (p.key.startsWith(q) || q.startsWith(p.key)));
  if (prefix.length === 1) return prefix[0];
  if (q.length < 5) return null;
  const close = places.filter((p) => levenshtein(q, p.key) <= (q.length > 8 ? 2 : 1));
  return close.length === 1 ? close[0] : null;
}

export function createMatcher(admin) {
  const states = admin.states.map((s) => ({ id: s.id, key: norm(s.name) }));
  const lgas = admin.lgas.map((l) => ({ id: l.id, state: l.state, key: norm(l.name) }));

  /** Returns { state, lga } P-codes (lga may be null), or null when the answer isn't a northern state. */
  return function match(stateText, lgaText) {
    const sKey = norm(stateText);
    const state = findOne(STATE_ALIASES[sKey] ?? sKey, states);
    const lKey = LGA_ALIASES[norm(lgaText)] ?? norm(lgaText);
    if (state) {
      const lga = findOne(lKey, lgas.filter((l) => l.state === state.id));
      return { state: state.id, lga: lga?.id ?? null };
    }
    // No recognisable state: an LGA name that is unique across the region still places the registration
    const lga = findOne(lKey, lgas);
    return lga ? { state: lga.state, lga: lga.id } : null;
  };
}
