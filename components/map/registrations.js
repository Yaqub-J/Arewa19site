import { useEffect, useRef, useState } from 'react';

const POLL_MS = 30 * 1000;
export const EMPTY = { type: 'FeatureCollection', features: [] };

/**
 * Polls /api/registrations while the tab is visible. Returns { data, fresh }: `fresh` holds the sheet rows that
 * appeared since the previous poll (empty on the first load, so only genuinely new sign-ups pulse).
 */
export function useRegistrations() {
  const [state, setState] = useState({ data: null, fresh: [] });
  const seen = useRef(null);

  useEffect(() => {
    let stopped = false;
    let timer;
    const poll = async () => {
      try {
        const res = await fetch('/api/registrations');
        if (res.ok) {
          const data = await res.json();
          const rows = data.points.map((p) => p[0]);
          const fresh = seen.current ? rows.filter((n) => !seen.current.has(n)) : [];
          seen.current = new Set(rows);
          if (!stopped) setState({ data, fresh });
        }
      } catch (err) {
        console.error('Failed to load registrations:', err);
      }
      if (!stopped) timer = setTimeout(poll, POLL_MS);
    };
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      clearTimeout(timer);
      poll();
    };
    poll();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return state;
}

// Small deterministic PRNG so a registration's dot stays in the same place on every load
function rand(seed) {
  let t = (seed * 2654435761) >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Places each registration around its LGA's label point (or its state's, when the LGA wasn't recognised),
 * spread over part of the area so dots don't stack. Positions are indicative: nobody's address is known.
 */
export function registrationsGeoJSON(data, geo) {
  if (!data || !geo) return EMPTY;
  return {
    type: 'FeatureCollection',
    features: data.points.map(([n, stateId, lgaId]) => {
      const area = (lgaId && geo.lgaById[lgaId]) || geo.stateById[stateId];
      const [x0, y0, x1, y1] = area.bbox;
      const spread = lgaId ? 0.28 : 0.12;
      const r = rand(n);
      const angle = r() * 2 * Math.PI;
      const dist = Math.sqrt(r());
      const [lng, lat] = area.label;
      return {
        type: 'Feature',
        properties: { n, state: stateId, lga: lgaId },
        geometry: {
          type: 'Point',
          coordinates: [
            lng + Math.cos(angle) * dist * spread * (x1 - x0) * 0.5,
            lat + Math.sin(angle) * dist * spread * (y1 - y0) * 0.5,
          ],
        },
      };
    }),
  };
}

/** Registration counts per zone, state and LGA. */
export function countRegistrations(data, geo) {
  const counts = { all: 0, zone: {}, state: {}, lga: {}, today: 0 };
  if (!data || !geo) return counts;
  const today = new Date().toISOString().slice(0, 10);
  for (const [, stateId, lgaId, day] of data.points) {
    const zone = geo.stateById[stateId]?.zone;
    counts.all++;
    counts.zone[zone] = (counts.zone[zone] ?? 0) + 1;
    counts.state[stateId] = (counts.state[stateId] ?? 0) + 1;
    if (lgaId) counts.lga[lgaId] = (counts.lga[lgaId] ?? 0) + 1;
    if (day === today) counts.today++;
  }
  return counts;
}
