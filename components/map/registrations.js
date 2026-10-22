import { useEffect, useRef, useState } from 'react';

const POLL_MS = 30 * 1000;

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

/** Registrations dated today (the sheet's day, UTC). */
export function countToday(data) {
  const today = new Date().toISOString().slice(0, 10);
  return data ? data.points.filter((p) => p[3] === today).length : 0;
}
