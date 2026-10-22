// Member counts for the State Chapters map (demo).
//
// Two groups make up each area's count:
//  - the existing membership (the baseline), which has no recorded location, so it is spread over LGAs in
//    proportion to population and then evenly over each LGA's wards;
//  - the registration form's sign-ups, which fill the officials structure top-down: OFFICIALS.perState in every
//    state, then OFFICIALS.perLga in every LGA, then OFFICIALS.perWard in every ward, until they run out. Each round
//    goes across all states before the next, so a partly filled level is spread evenly rather than bunched up.

export const OFFICIALS = { perState: 10, perLga: 1, perWard: 1 };

/** Splits `total` over `weights` in proportion, keeping whole numbers that add up exactly (largest remainder). */
function apportion(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const shares = weights.map((w, i) => {
    const exact = (total * w) / sum;
    return { i, n: Math.floor(exact), rest: exact - Math.floor(exact) };
  });
  const left = total - shares.reduce((a, s) => a + s.n, 0);
  [...shares].sort((a, b) => b.rest - a.rest).slice(0, left).forEach((s) => s.n++);
  return shares.map((s) => s.n);
}

/** The officials structure as an ordered list of slots: { level, state, lga, ward } (P-codes). */
export function officialSlots(geo) {
  const slots = [];
  const lgasOf = geo.states.map((s) => geo.lgas.filter((l) => l.state === s.id));
  for (let r = 0; r < OFFICIALS.perState; r++) {
    for (const s of geo.states) slots.push({ level: 'state', state: s.id, lga: null, ward: null });
  }
  const maxLgas = Math.max(...lgasOf.map((l) => l.length));
  for (let r = 0; r < OFFICIALS.perLga; r++) {
    for (let i = 0; i < maxLgas; i++) {
      for (const lgas of lgasOf) {
        const l = lgas[i];
        if (l) slots.push({ level: 'lga', state: l.state, lga: l.id, ward: null });
      }
    }
  }
  const maxWards = Math.max(...geo.lgas.map((l) => geo.wardsByLga[l.id]?.length ?? 0));
  for (let r = 0; r < OFFICIALS.perWard; r++) {
    for (let w = 0; w < maxWards; w++) {
      for (let i = 0; i < maxLgas; i++) {
        for (const lgas of lgasOf) {
          const ward = lgas[i] && geo.wardsByLga[lgas[i].id]?.[w];
          if (ward) slots.push({ level: 'ward', state: ward.state, lga: ward.lga, ward: ward.id });
        }
      }
    }
  }
  return slots;
}

const add = (map, key, n) => {
  if (key) map[key] = (map[key] ?? 0) + n;
};

/**
 * Counts per zone, state, LGA and ward. `officials` is how many form registrations there are; slots beyond the
 * structure's size are reported as `unplaced` rather than invented.
 */
export function countMembers(geo, slots, baseline, officials) {
  const members = { zone: {}, state: {}, lga: {}, ward: {} };
  const off = { zone: {}, state: {}, lga: {}, ward: {}, stateLevel: {}, lgaLevel: {}, wardLevel: {} };

  // Existing members: LGAs by population, then each LGA's wards evenly
  apportion(baseline, geo.lgas.map((l) => l.population)).forEach((n, i) => {
    const l = geo.lgas[i];
    const wards = geo.wardsByLga[l.id] ?? [];
    if (wards.length) apportion(n, wards.map(() => 1)).forEach((m, j) => add(members.ward, wards[j].id, m));
    add(members.lga, l.id, n);
    add(members.state, l.state, n);
    add(members.zone, geo.stateById[l.state].zone, n);
  });

  const placed = Math.min(officials, slots.length);
  for (const slot of slots.slice(0, placed)) {
    const zone = geo.stateById[slot.state].zone;
    for (const m of [members, off]) {
      add(m.zone, zone, 1);
      add(m.state, slot.state, 1);
      add(m.lga, slot.lga, 1);
      add(m.ward, slot.ward, 1);
    }
    add(off[`${slot.level}Level`], slot.state, 1);
  }

  return { total: baseline + officials, officials, unplaced: officials - placed, members, off };
}

const fmt = (n) => (n ?? 0).toLocaleString('en-NG');

/** Label points for every state, LGA and ward, carrying the area's member count as text. */
export function countLabels(geo, counts) {
  const feature = (level, area, extra) => ({
    type: 'Feature',
    properties: { id: area.id, level, name: area.name, count: fmt(counts.members[level][area.id]), ...extra },
    geometry: { type: 'Point', coordinates: area.label },
  });
  return {
    type: 'FeatureCollection',
    features: [
      ...geo.states.map((s) => feature('state', s, { state: s.id, lga: '' })),
      ...geo.lgas.map((l) => feature('lga', l, { state: l.state, lga: l.id })),
      ...geo.wards.map((w) => feature('ward', w, { state: w.state, lga: w.lga })),
    ],
  };
}

/** Where the slot for a registration is, for the "new sign-up" pulse. */
export function slotPoint(geo, slot) {
  const area = slot.ward ? geo.wardById[slot.ward] : slot.lga ? geo.lgaById[slot.lga] : geo.stateById[slot.state];
  return area.label;
}
