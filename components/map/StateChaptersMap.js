import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '../ThemeContext';
import { MAP_ROOT, ZONE_COLORS, buildStyle, updateStyle } from './style';
import { countToday, useRegistrations } from './registrations';
import { OFFICIALS, countLabels, countMembers, officialSlots, slotPoint } from './members';
import styles from '../../styles/StateChaptersMap.module.css';

const REGION = { level: 'region', zoneId: null, stateId: null, lgaId: null, wardId: null };
const fmt = (n) => (n ?? 0).toLocaleString('en-NG');
const byName = (a, b) => a.name.localeCompare(b.name);

// Pan limit: the region's bbox plus a margin, wide enough that the region can sit clear of the floating cards
const maxBounds = ([x0, y0, x1, y1]) => [[x0 - 5, y0 - 2], [x1 + 5, y1 + 4]];

let protocolAdded = false;

/**
 * Full-page drill-down map of the Northern Nigeria state chapters: Region → Zone → State → LGA → Ward,
 * with each area's member count on the map.
 * chapters: [{ name, capital }] keyed by state name as it appears in admin.json.
 * memberBaseline: existing members counted before the form's registrations (demo; spread by population).
 */
export default function StateChaptersMap({ chapters, memberBaseline = 0 }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const panelRef = useRef(null);
  const mapRef = useRef(null);
  const styleRef = useRef(null);
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState(REGION);
  const [query, setQuery] = useState('');
  const selRef = useRef(sel);
  selRef.current = sel;
  const { data: regData, fresh } = useRegistrations();

  const geo = useMemo(() => {
    if (!admin) return null;
    const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
    const wards = admin.wards.map(([id, name, label, bbox]) => ({
      id,
      name,
      label,
      bbox,
      lga: id.slice(0, 8),
      state: id.slice(0, 5),
    }));
    const wardsByLga = {};
    for (const w of wards) (wardsByLga[w.lga] ??= []).push(w);
    return {
      ...admin,
      wards,
      wardsByLga,
      zoneById: byId(admin.zones),
      stateById: byId(admin.states),
      lgaById: byId(admin.lgas),
      wardById: byId(wards),
      chapterByState: Object.fromEntries(
        admin.states.map((s) => [s.id, chapters.find((c) => c.name.toLowerCase() === s.name.toLowerCase())]),
      ),
    };
  }, [admin, chapters]);

  const slots = useMemo(() => geo && officialSlots(geo), [geo]);
  const officials = regData?.total ?? 0;
  const counts = useMemo(
    () => geo && countMembers(geo, slots, memberBaseline, officials),
    [geo, slots, memberBaseline, officials],
  );
  const labels = useMemo(() => geo && countLabels(geo, counts), [geo, counts]);
  const today = countToday(regData);

  const selectState = (id) => {
    const s = geo.stateById[id];
    if (s) setSel({ level: 'state', zoneId: s.zone, stateId: id, lgaId: null, wardId: null });
  };
  const selectLga = (id) => {
    const l = geo.lgaById[id];
    if (l) setSel({ level: 'lga', zoneId: geo.stateById[l.state].zone, stateId: l.state, lgaId: id, wardId: null });
  };
  const selectWard = (id) => {
    const w = geo.wardById[id];
    if (w) setSel({ level: 'ward', zoneId: geo.stateById[w.state].zone, stateId: w.state, lgaId: w.lga, wardId: id });
  };
  const selectZone = (id) => setSel({ level: 'zone', zoneId: id, stateId: null, lgaId: null, wardId: null });

  useEffect(() => {
    Promise.all(
      ['admin', 'wards'].map((f) => fetch(`${MAP_ROOT}/northern-nigeria/${f}.json`).then((r) => r.json())),
    )
      .then(([a, w]) => setAdmin({ ...a, wards: w.wards }))
      .catch((err) => console.error('Failed to load map data:', err));
  }, []);

  // Create the map once the hierarchy is loaded
  useEffect(() => {
    if (!geo || mapRef.current) return;
    if (!protocolAdded) {
      maplibregl.addProtocol('pmtiles', new Protocol().tile);
      protocolAdded = true;
    }
    styleRef.current = buildStyle({ theme, sel: selRef.current, zones: geo.zones });
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleRef.current,
      bounds: geo.region.bbox,
      fitBoundsOptions: { padding: fitPadding() },
      maxBounds: maxBounds(geo.region.bbox),
      minZoom: 4,
      maxZoom: 13,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left');
    mapRef.current = map;

    const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12, className: styles.popup });
    let hoverKey = null;
    const clearHover = () => {
      if (hoverKey) map.setFeatureState(hoverKey, { hover: false });
      hoverKey = null;
      popup.remove();
      map.getCanvas().style.cursor = '';
    };

    map.on('mousemove', 'active-fill', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const key = { source: 'admin', sourceLayer: f.sourceLayer, id: f.id };
      if (!hoverKey || hoverKey.id !== key.id) {
        if (hoverKey) map.setFeatureState(hoverKey, { hover: false });
        hoverKey = key;
        map.setFeatureState(hoverKey, { hover: true });
      }
      map.getCanvas().style.cursor = 'pointer';
      popup.setLngLat(e.lngLat).setText(f.properties.name).addTo(map);
    });
    map.on('mouseleave', 'active-fill', clearHover);

    // Resolve a click to the next level down inside the current area, or to the clicked area alongside it
    map.on('click', (e) => {
      const cur = selRef.current;
      const hit = (layer) => map.queryRenderedFeatures(e.point, { layers: [layer] })[0]?.properties;
      const state = hit('hit-states');
      if (!state) return;
      const s = geo.stateById[state.id];
      if (!s) return;
      const pick = (next) => setSel({ zoneId: s.zone, stateId: s.id, lgaId: null, wardId: null, ...next });
      if (cur.level === 'region' || cur.level === 'zone' || state.id !== cur.stateId) return pick({ level: 'state' });
      const lga = hit('hit-lgas');
      if (!lga || lga.state !== s.id) return;
      if (cur.level === 'state' || lga.id !== cur.lgaId) return pick({ level: 'lga', lgaId: lga.id });
      const ward = hit('hit-wards');
      if (ward && ward.lga === lga.id) pick({ level: 'ward', lgaId: lga.id, wardId: ward.id });
    });

    map.on('load', () => setReady(true));
    map.on('styledata', clearHover);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; theme and selection changes go through updateStyle below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  // Theme and drill-down changes become cheap filter/paint updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const next = buildStyle({ theme, sel, zones: geo.zones });
    updateStyle(map, styleRef.current, next);
    styleRef.current = next;
  }, [theme, sel, ready, geo]);

  // Counts go straight to their source whenever they change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !labels) return;
    map.getSource('counts')?.setData(labels);
  }, [labels, ready]);

  // New registrations take the next official slots; each one pulses for a few seconds where its slot is
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || fresh.length === 0) return;
    const first = Math.max(0, officials - fresh.length);
    const markers = slots.slice(first, Math.min(officials, first + 50)).map((slot) => {
      const el = document.createElement('div');
      el.className = styles.pulse;
      return new maplibregl.Marker({ element: el }).setLngLat(slotPoint(geo, slot)).addTo(map);
    });
    const timer = setTimeout(() => markers.forEach((m) => m.remove()), 8000);
    return () => {
      clearTimeout(timer);
      markers.forEach((m) => m.remove());
    };
    // Only a new poll result starts a pulse
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh, ready]);

  // Fit the camera to the selected area
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const [bbox, maxZoom] =
      sel.level === 'ward'
        ? [geo.wardById[sel.wardId].bbox, 13]
        : sel.level === 'lga'
          ? [geo.lgaById[sel.lgaId].bbox, 12]
          : sel.level === 'state'
            ? [geo.stateById[sel.stateId].bbox, 9]
            : sel.level === 'zone'
              ? [geo.zoneById[sel.zoneId].bbox, 9]
              : [geo.region.bbox, 9];
    map.fitBounds(bbox, { padding: fitPadding(), duration: 800, maxZoom });
  }, [sel, ready, geo]);

  // Keep the selected area clear of the floating toolbar and panel (desktop); on phones they sit outside the map
  function fitPadding() {
    const map = containerRef.current.getBoundingClientRect();
    const pad = { top: 30, right: 30, bottom: 40, left: 30 };
    const toolbar = toolbarRef.current?.getBoundingClientRect();
    const panel = panelRef.current?.getBoundingClientRect();
    if (toolbar && toolbar.bottom > map.top && toolbar.top < map.bottom) pad.top = toolbar.bottom - map.top + 20;
    if (panel && panel.left > map.left && panel.top < map.bottom) pad.right = map.right - panel.left + 20;
    return pad;
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!geo || q.length < 2) return [];
    const match = (list, kind, sub) =>
      list.filter((x) => x.name.toLowerCase().includes(q)).map((x) => ({ kind, id: x.id, name: x.name, sub: sub(x) }));
    const rank = (r) => (r.name.toLowerCase().startsWith(q) ? 0 : 1) + { state: 0, lga: 0.1, ward: 0.2 }[r.kind];
    return [
      ...match(geo.states, 'state', (s) => `${geo.zoneById[s.zone].name} zone`),
      ...match(geo.lgas, 'lga', (l) => `LGA, ${geo.stateById[l.state].name}`),
      ...match(geo.wards, 'ward', (w) => `Ward, ${geo.lgaById[w.lga].name}, ${geo.stateById[w.state].name}`),
    ]
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, 8);
  }, [query, geo]);

  const pick = (r) => {
    setQuery('');
    ({ state: selectState, lga: selectLga, ward: selectWard })[r.kind](r.id);
  };

  const zone = sel.zoneId && geo?.zoneById[sel.zoneId];
  const state = sel.stateId && geo?.stateById[sel.stateId];
  const lga = sel.lgaId && geo?.lgaById[sel.lgaId];
  const ward = sel.wardId && geo?.wardById[sel.wardId];
  const chapter = state && geo.chapterByState[state.id];
  const zoneColors = ZONE_COLORS[theme] ?? ZONE_COLORS.light;
  const m = counts?.members;
  const off = counts?.off;
  const statesOf = (zoneId) => geo.states.filter((s) => s.zone === zoneId).sort(byName);
  const crumb = (label, onClick) => (
    <>
      <span aria-hidden="true">›</span>
      {onClick ? <button type="button" onClick={onClick}>{label}</button> : <span className={styles.crumbCurrent}>{label}</span>}
    </>
  );
  const memberStats = (level, id) => (
    <>
      <div><dt>Members</dt><dd>{fmt(m[level][id])}</dd></div>
      <div><dt>Officials</dt><dd>{fmt(off[level][id])}</dd></div>
    </>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.map} ref={containerRef}>
        {!ready && <div className={styles.loading}>Loading map…</div>}
      </div>

      <div className={styles.toolbar} ref={toolbarRef}>
        <div className={styles.toolbarTop}>
          <a href="/" className={styles.logo} aria-label="Arewa19 home">
            <img src={theme === 'dark' ? '/assets/img/logolight.png' : '/assets/img/logodark.png'} alt="Arewa19" />
          </a>
          <div className={styles.titleBlock}>
            <h1>State Chapters</h1>
            <nav className={styles.crumbs} aria-label="Map location">
              <button type="button" onClick={() => setSel(REGION)}>Northern Nigeria</button>
              {zone && crumb(zone.name, () => selectZone(zone.id))}
              {state && crumb(state.name, lga ? () => selectState(state.id) : null)}
              {lga && crumb(lga.name, ward ? () => selectLga(lga.id) : null)}
              {ward && crumb(ward.name)}
            </nav>
          </div>
        </div>
        {counts && (
          <p className={styles.live}>
            <span className={styles.liveDot} aria-hidden="true"></span>
            <strong>{fmt(counts.total)}</strong> members
            {today > 0 && <span className={styles.today}>+{fmt(today)} today</span>}
          </p>
        )}
        {memberBaseline > 0 && (
          <p className={styles.demoNote}>
            <span>Demo</span> {fmt(memberBaseline)} existing members estimated by population. Form registrations fill
            the officials structure: {OFFICIALS.perState} per state, then {OFFICIALS.perLga} per LGA, then{' '}
            {OFFICIALS.perWard} per ward.
          </p>
        )}
        <div className={styles.search}>
          <i className="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            placeholder="Find a state, LGA or ward"
            aria-label="Find a state, LGA or ward"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && results[0] && pick(results[0])}
          />
          {results.length > 0 && (
            <ul className={styles.results} role="listbox">
              {results.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => pick(r)}>
                    <strong>{r.name}</strong>
                    <span>{r.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.legend}>
          {geo?.zones.map((z) => (
            <button key={z.id} type="button" onClick={() => selectZone(z.id)} aria-pressed={sel.zoneId === z.id}>
              <span className={styles.swatch} style={{ background: zoneColors[z.id] }}></span>
              {z.name}
            </button>
          ))}
        </div>
      </div>

      <aside className={styles.panel} ref={panelRef} aria-live="polite">
        {!counts && <p className="text-muted">Loading chapters…</p>}

        {counts && sel.level === 'region' && (
          <>
            <p className={styles.kicker}>Arewa19 network</p>
            <h4>19 states + FCT</h4>
            <p className={styles.lead}>
              Click a state on the map, or pick a zone, to see its members down to every local government and ward.
            </p>
            <dl className={styles.stats}>
              <div><dt>Members</dt><dd>{fmt(counts.total)}</dd></div>
              <div><dt>Officials</dt><dd>{fmt(counts.officials)}</dd></div>
              <div><dt>States</dt><dd>{geo.states.length}</dd></div>
              <div><dt>LGAs</dt><dd>{geo.lgas.length}</dd></div>
            </dl>
            {counts.unplaced > 0 && (
              <p className="small">{fmt(counts.unplaced)} registrations are beyond the officials structure.</p>
            )}
            {geo.zones.map((z) => (
              <button key={z.id} type="button" className={styles.zoneRow} onClick={() => selectZone(z.id)}>
                <span className={styles.swatch} style={{ background: zoneColors[z.id] }}></span>
                <span>{z.name}</span>
                <small>{fmt(m.zone[z.id])} members</small>
              </button>
            ))}
          </>
        )}

        {counts && sel.level === 'zone' && zone && (
          <>
            <p className={styles.kicker}>Geopolitical zone</p>
            <h4>{zone.name}</h4>
            <dl className={styles.stats}>
              {memberStats('zone', zone.id)}
              <div><dt>States</dt><dd>{zone.states.length}</dd></div>
            </dl>
            <ul className={styles.list}>
              {statesOf(zone.id).map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => selectState(s.id)}>
                    <span>{s.name}</span>
                    <small>{fmt(m.state[s.id])} members</small>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {counts && state && (
          <>
            <p className={styles.kicker}>
              <span className={styles.swatch} style={{ background: zoneColors[state.zone] }}></span>
              {geo.zoneById[state.zone].name} zone
            </p>
            <h4>{state.name === 'FCT' ? 'FCT Chapter' : `${state.name} State Chapter`}</h4>
            {chapter && <p className={styles.lead}><i className="bi bi-geo-alt-fill"></i> Hub in {chapter.capital}</p>}

            {sel.level === 'state' && (
              <>
                <dl className={styles.stats}>
                  {memberStats('state', state.id)}
                  <div><dt>LGAs</dt><dd>{state.lgaCount}</dd></div>
                  <div><dt>Wards</dt><dd>{state.wardCount}</dd></div>
                </dl>
                <p className="small">
                  Officials: {fmt(off.stateLevel[state.id])} state, {fmt(off.lgaLevel[state.id])} LGA,{' '}
                  {fmt(off.wardLevel[state.id])} ward.
                </p>
              </>
            )}

            {lga && (
              <div className={styles.lgaBox}>
                <p className={styles.kicker}>Local government area</p>
                <h5>{lga.name}</h5>
                <dl className={styles.stats}>
                  {memberStats('lga', lga.id)}
                  <div><dt>Wards</dt><dd>{lga.wardCount}</dd></div>
                </dl>
                {ward && (
                  <>
                    <p className={styles.kicker}>Ward</p>
                    <h5>{ward.name}</h5>
                    <dl className={`${styles.stats} mb-0`}>{memberStats('ward', ward.id)}</dl>
                  </>
                )}
              </div>
            )}

            <div className="d-flex gap-2 my-3">
              <a href="/get-involved" className="btn btn-sm btn-enhanced">Join Chapter</a>
              <a href="/community#contact" className="btn btn-sm btn-outline-enhanced">Contact</a>
            </div>

            {lga ? (
              <>
                <p className={styles.listTitle}>Wards ({lga.wardCount})</p>
                <ul className={`${styles.list} ${styles.lgaList}`}>
                  {[...(geo.wardsByLga[lga.id] ?? [])].sort(byName).map((w) => (
                    <li key={w.id}>
                      <button type="button" aria-current={w.id === sel.wardId} onClick={() => selectWard(w.id)}>
                        <span>{w.name}</span>
                        <small>{fmt(m.ward[w.id])}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className={styles.listTitle}>Local governments ({state.lgaCount})</p>
                <ul className={`${styles.list} ${styles.lgaList}`}>
                  {geo.lgas
                    .filter((l) => l.state === state.id)
                    .sort(byName)
                    .map((l) => (
                      <li key={l.id}>
                        <button type="button" onClick={() => selectLga(l.id)}>
                          <span>{l.name}</span>
                          <small>{fmt(m.lga[l.id])}</small>
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
