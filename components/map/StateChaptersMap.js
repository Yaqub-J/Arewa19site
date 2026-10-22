import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from '../ThemeContext';
import { MAP_ROOT, ZONE_COLORS, buildStyle } from './style';
import { countRegistrations, registrationsGeoJSON, useRegistrations } from './registrations';
import styles from '../../styles/StateChaptersMap.module.css';

const REGION = { level: 'region', zoneId: null, stateId: null, lgaId: null };
const fmt = (n) => (n ?? 0).toLocaleString('en-NG');

// Pan limit: the region's bbox plus a margin, wide enough that the region can sit clear of the floating cards
const maxBounds = ([x0, y0, x1, y1]) => [[x0 - 5, y0 - 2], [x1 + 5, y1 + 4]];

let protocolAdded = false;

/**
 * Full-page drill-down map of the Northern Nigeria state chapters: Region → Zone → State → LGA.
 * chapters: [{ name, capital }] keyed by state name as it appears in admin.json.
 */
export default function StateChaptersMap({ chapters }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const panelRef = useRef(null);
  const mapRef = useRef(null);
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
    return {
      ...admin,
      zoneById: byId(admin.zones),
      stateById: byId(admin.states),
      lgaById: byId(admin.lgas),
      chapterByState: Object.fromEntries(
        admin.states.map((s) => [s.id, chapters.find((c) => c.name.toLowerCase() === s.name.toLowerCase())]),
      ),
      lgaLabels: {
        type: 'FeatureCollection',
        features: admin.lgas.map((l) => ({
          type: 'Feature',
          properties: { id: l.id, name: l.name, state: l.state },
          geometry: { type: 'Point', coordinates: l.label },
        })),
      },
    };
  }, [admin, chapters]);

  const regGeo = useMemo(() => registrationsGeoJSON(regData, geo), [regData, geo]);
  const regCount = useMemo(() => countRegistrations(regData, geo), [regData, geo]);
  const regRef = useRef(regGeo);
  regRef.current = regGeo;

  const selectState = (id) => {
    const s = geo.stateById[id];
    if (s) setSel({ level: 'state', zoneId: s.zone, stateId: id, lgaId: null });
  };
  const selectLga = (id) => {
    const l = geo.lgaById[id];
    if (l) setSel({ level: 'lga', zoneId: geo.stateById[l.state].zone, stateId: l.state, lgaId: id });
  };
  const selectZone = (id) => setSel({ level: 'zone', zoneId: id, stateId: null, lgaId: null });

  useEffect(() => {
    fetch(`${MAP_ROOT}/northern-nigeria/admin.json`)
      .then((r) => r.json())
      .then(setAdmin)
      .catch((err) => console.error('Failed to load map data:', err));
  }, []);

  // Create the map once the hierarchy is loaded
  useEffect(() => {
    if (!geo || mapRef.current) return;
    if (!protocolAdded) {
      maplibregl.addProtocol('pmtiles', new Protocol().tile);
      protocolAdded = true;
    }
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle({
        theme,
        sel: selRef.current,
        zones: geo.zones,
        lgaLabels: geo.lgaLabels,
        registrations: regRef.current,
      }),
      bounds: geo.region.bbox,
      fitBoundsOptions: { padding: fitPadding() },
      maxBounds: maxBounds(geo.region.bbox),
      minZoom: 4,
      maxZoom: 11,
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

    // Resolve a click to the deepest area that makes sense at the current level
    map.on('click', (e) => {
      const cur = selRef.current;
      const hit = (layer) => map.queryRenderedFeatures(e.point, { layers: [layer] })[0];
      const state = hit('hit-states');
      if (!state) return;
      const stateId = state.properties.id;
      if ((cur.level === 'state' || cur.level === 'lga') && stateId === cur.stateId) {
        const lga = hit('hit-lgas');
        if (lga && lga.properties.state === stateId) {
          setSel({ level: 'lga', zoneId: cur.zoneId, stateId, lgaId: lga.properties.id });
        }
        return;
      }
      const s = geo.stateById[stateId];
      if (s) setSel({ level: 'state', zoneId: s.zone, stateId, lgaId: null });
    });

    map.on('load', () => setReady(true));
    map.on('styledata', clearHover);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; theme and selection changes go through setStyle below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  // Theme and drill-down changes become cheap filter/paint updates with a style diff
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setStyle(buildStyle({ theme, sel, zones: geo.zones, lgaLabels: geo.lgaLabels, registrations: regGeo }), {
      diff: true,
    });
  }, [theme, sel, ready, geo, regGeo]);

  // New registrations since the last poll pulse for a few seconds where they landed
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || fresh.length === 0) return;
    const rows = new Set(fresh.slice(-50));
    const markers = regGeo.features
      .filter((f) => rows.has(f.properties.n))
      .map((f) => {
        const el = document.createElement('div');
        el.className = styles.pulse;
        return new maplibregl.Marker({ element: el }).setLngLat(f.geometry.coordinates).addTo(map);
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
    const bbox =
      sel.level === 'lga'
        ? geo.lgaById[sel.lgaId].bbox
        : sel.level === 'state'
          ? geo.stateById[sel.stateId].bbox
          : sel.level === 'zone'
            ? geo.zoneById[sel.zoneId].bbox
            : geo.region.bbox;
    map.fitBounds(bbox, { padding: fitPadding(), duration: 800, maxZoom: 9 });
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
    const states = geo.states
      .filter((s) => s.name.toLowerCase().includes(q))
      .map((s) => ({ kind: 'state', id: s.id, name: s.name, sub: `${geo.zoneById[s.zone].name} zone` }));
    const lgas = geo.lgas
      .filter((l) => l.name.toLowerCase().includes(q))
      .map((l) => ({ kind: 'lga', id: l.id, name: l.name, sub: `LGA, ${geo.stateById[l.state].name}` }));
    const rank = (r) => (r.name.toLowerCase().startsWith(q) ? 0 : 1);
    return [...states, ...lgas].sort((a, b) => rank(a) - rank(b)).slice(0, 8);
  }, [query, geo]);

  const pick = (r) => {
    setQuery('');
    if (r.kind === 'state') selectState(r.id);
    else selectLga(r.id);
  };

  const zone = sel.zoneId && geo?.zoneById[sel.zoneId];
  const state = sel.stateId && geo?.stateById[sel.stateId];
  const lga = sel.lgaId && geo?.lgaById[sel.lgaId];
  const chapter = state && geo.chapterByState[state.id];
  const zoneColors = ZONE_COLORS[theme] ?? ZONE_COLORS.light;
  const statesOf = (zoneId) =>
    geo.states.filter((s) => s.zone === zoneId).sort((a, b) => a.name.localeCompare(b.name));

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
              {zone && (
                <>
                  <span aria-hidden="true">›</span>
                  <button type="button" onClick={() => selectZone(zone.id)}>{zone.name}</button>
                </>
              )}
              {state && (
                <>
                  <span aria-hidden="true">›</span>
                  <button type="button" onClick={() => selectState(state.id)}>{state.name}</button>
                </>
              )}
              {lga && (
                <>
                  <span aria-hidden="true">›</span>
                  <span className={styles.crumbCurrent}>{lga.name}</span>
                </>
              )}
            </nav>
          </div>
        </div>
        {regData && (
          <p className={styles.live}>
            <span className={styles.liveDot} aria-hidden="true"></span>
            <strong>{fmt(regCount.all)}</strong> registered
            {regCount.today > 0 && <span className={styles.today}>+{fmt(regCount.today)} today</span>}
          </p>
        )}
        <div className={styles.search}>
          <i className="bi bi-search" aria-hidden="true"></i>
          <input
            type="search"
            placeholder="Find a state or LGA"
            aria-label="Find a state or LGA"
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
        {!geo && <p className="text-muted">Loading chapters…</p>}

        {geo && sel.level === 'region' && (
          <>
            <p className={styles.kicker}>Arewa19 network</p>
            <h4>19 states + FCT</h4>
            <p className={styles.lead}>
              Click a state on the map, or pick a zone, to find its chapter and the local governments it covers.
            </p>
            <dl className={styles.stats}>
              {regData && <div><dt>Registered</dt><dd>{fmt(regCount.all)}</dd></div>}
              <div><dt>Zones</dt><dd>{geo.zones.length}</dd></div>
              <div><dt>States</dt><dd>{geo.states.length}</dd></div>
              <div><dt>LGAs</dt><dd>{geo.lgas.length}</dd></div>
            </dl>
            {geo.zones.map((z) => (
              <button key={z.id} type="button" className={styles.zoneRow} onClick={() => selectZone(z.id)}>
                <span className={styles.swatch} style={{ background: zoneColors[z.id] }}></span>
                <span>{z.name}</span>
                <small>{regData ? `${fmt(regCount.zone[z.id] ?? 0)} registered` : `${z.states.length} states`}</small>
              </button>
            ))}
          </>
        )}

        {geo && sel.level === 'zone' && zone && (
          <>
            <p className={styles.kicker}>Geopolitical zone</p>
            <h4>{zone.name}</h4>
            <dl className={styles.stats}>
              {regData && <div><dt>Registered</dt><dd>{fmt(regCount.zone[zone.id] ?? 0)}</dd></div>}
              <div><dt>States</dt><dd>{zone.states.length}</dd></div>
              <div><dt>Population (est.)</dt><dd>{fmt(zone.population)}</dd></div>
            </dl>
            <ul className={styles.list}>
              {statesOf(zone.id).map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => selectState(s.id)}>
                    <span>{s.name}</span>
                    <small>
                      {regData ? `${fmt(regCount.state[s.id] ?? 0)} registered` : geo.chapterByState[s.id]?.capital}
                    </small>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {geo && (sel.level === 'state' || sel.level === 'lga') && state && (
          <>
            <p className={styles.kicker}>
              <span className={styles.swatch} style={{ background: zoneColors[state.zone] }}></span>
              {geo.zoneById[state.zone].name} zone
            </p>
            <h4>{state.name === 'FCT' ? 'FCT Chapter' : `${state.name} State Chapter`}</h4>
            {chapter && <p className={styles.lead}><i className="bi bi-geo-alt-fill"></i> Hub in {chapter.capital}</p>}

            {lga ? (
              <div className={styles.lgaBox}>
                <p className={styles.kicker}>Local government area</p>
                <h5>{lga.name}</h5>
                <dl className={styles.stats}>
                  {regData && <div><dt>Registered</dt><dd>{fmt(regCount.lga[lga.id] ?? 0)}</dd></div>}
                  <div><dt>Wards</dt><dd>{lga.wardCount}</dd></div>
                  <div><dt>Population (est.)</dt><dd>{fmt(lga.population)}</dd></div>
                </dl>
                <p className="small mb-0">
                  Community cells in {lga.name} are organised through the {state.name} chapter.
                </p>
              </div>
            ) : (
              <>
                <p className="small">
                  Community cell active in {chapter?.capital ?? state.name} and local government areas. Join our
                  grassroots network mobilizing for change.
                </p>
                <dl className={styles.stats}>
                  {regData && <div><dt>Registered</dt><dd>{fmt(regCount.state[state.id] ?? 0)}</dd></div>}
                  <div><dt>LGAs</dt><dd>{state.lgaCount}</dd></div>
                  <div><dt>Wards</dt><dd>{state.wardCount}</dd></div>
                  <div><dt>Population (est.)</dt><dd>{fmt(state.population)}</dd></div>
                </dl>
              </>
            )}

            <div className="d-flex gap-2 my-3">
              <a href="/get-involved" className="btn btn-sm btn-enhanced">Join Chapter</a>
              <a href="/community#contact" className="btn btn-sm btn-outline-enhanced">Contact</a>
            </div>

            <p className={styles.listTitle}>Local governments ({state.lgaCount})</p>
            <ul className={`${styles.list} ${styles.lgaList}`}>
              {geo.lgas
                .filter((l) => l.state === state.id)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((l) => (
                  <li key={l.id}>
                    <button type="button" aria-current={l.id === sel.lgaId} onClick={() => selectLga(l.id)}>
                      <span>{l.name}</span>
                      {regCount.lga[l.id] > 0 && <small>{fmt(regCount.lga[l.id])}</small>}
                    </button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
