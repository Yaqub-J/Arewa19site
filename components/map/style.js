// Map style for the State Chapters map: a slimmed version of the Impact Observatory's buildStyle().
// Boundaries only (no basemap), drawn from the admin.pmtiles vector tiles with the region mask on top.

export const MAP_ROOT = '/maps';

// Tiles can be moved to object storage (R2, S3…) by setting NEXT_PUBLIC_MAP_TILES_URL to the file's address.
export const tilesUrl = () =>
  process.env.NEXT_PUBLIC_MAP_TILES_URL ||
  `${window.location.origin}${MAP_ROOT}/northern-nigeria/admin.pmtiles`;

export const MAP_ATTRIBUTION = 'GRID3 (CIESIN) CC BY-SA · OCHA COD-AB';

export const FONTS = { medium: 'Poppins-Medium', semibold: 'Poppins-SemiBold' };

// One colour per geopolitical zone, in the site's gold-led palette
export const ZONE_COLORS = {
  light: { NW: '#c89d42', NE: '#b8613a', NC: '#5f8a5a' },
  dark: { NW: '#ffa200', NE: '#e07a4a', NC: '#7fb377' },
};

export const MAP_COLORS = {
  light: {
    background: '#eef0f3',
    mask: '#eef0f3',
    maskOpacity: 0.85,
    stateLine: '#394047',
    lgaLine: '#7a5e22',
    selection: '#1f2429',
    hover: '#1f2429',
    label: '#1f2429',
    labelHalo: '#ffffff',
    dot: '#b8400f',
    memberDot: '#5a3a12',
    dotStroke: '#ffffff',
  },
  dark: {
    background: '#121212',
    mask: '#121212',
    maskOpacity: 0.85,
    stateLine: '#e0e0e0',
    lgaLine: '#ffd27a',
    selection: '#ffffff',
    hover: '#ffffff',
    label: '#ffffff',
    labelHalo: '#121212',
    dot: '#fff4d6',
    memberDot: '#f3d9a4',
    dotStroke: '#121212',
  },
};

const ADMIN = 'admin';
const NONE = ['==', ['get', 'id'], '__none__'];
const hovered = ['boolean', ['feature-state', 'hover'], false];

/** The admin layer that is clickable and highlights on hover at each drill-down level. */
export function activeLayer(sel) {
  if (sel.level === 'state' || sel.level === 'lga') {
    return { layer: 'lgas', filter: ['==', ['get', 'state'], sel.stateId] };
  }
  return { layer: 'states', filter: ['has', 'id'] };
}

/**
 * Builds the whole style for a theme and drill-down position.
 * sel: { level: 'region' | 'zone' | 'state' | 'lga', zoneId, stateId, lgaId }
 * zones: the zones from admin.json; lgaLabels: GeoJSON points for LGA names.
 * The registrations source starts empty: its points are pushed with setData, so restyling never diffs them.
 */
export function buildStyle({ theme, sel, zones, lgaLabels }) {
  const c = MAP_COLORS[theme];
  const zc = ZONE_COLORS[theme];
  const lvl = sel.level;
  const active = activeLayer(sel);

  // Colour each state by its zone, looking its P-code up in the zone lists
  const zoneColor = ['match', ['get', 'id']];
  for (const z of zones) zoneColor.push(z.states, zc[z.id]);
  zoneColor.push('#999999');

  const inZone = sel.zoneId
    ? ['in', ['get', 'id'], ['literal', zones.find((z) => z.id === sel.zoneId)?.states ?? []]]
    : true;
  const isState = ['==', ['get', 'id'], sel.stateId ?? ''];

  // Strong colour for the area in focus, faint for the rest
  const zoneFillOpacity =
    lvl === 'region'
      ? 0.5
      : lvl === 'zone'
        ? ['case', inZone, 0.6, 0.12]
        : ['case', isState, 0.18, 0.08];

  const selectedId = sel.lgaId ?? sel.stateId;
  const selectedLayer = sel.lgaId ? 'lgas' : 'states';

  const layers = [
    { id: 'background', type: 'background', paint: { 'background-color': c.background } },

    // Invisible hit-testing layers used to resolve clicks at any level
    ...['states', 'lgas'].map((l) => ({
      id: `hit-${l}`,
      type: 'fill',
      source: ADMIN,
      'source-layer': l,
      paint: { 'fill-color': '#000', 'fill-opacity': 0 },
    })),

    {
      id: 'zone-fill',
      type: 'fill',
      source: ADMIN,
      'source-layer': 'states',
      paint: { 'fill-color': zoneColor, 'fill-opacity': zoneFillOpacity },
    },
    {
      id: 'selected-lga-fill',
      type: 'fill',
      source: ADMIN,
      'source-layer': 'lgas',
      filter: sel.lgaId ? ['==', ['get', 'id'], sel.lgaId] : NONE,
      paint: { 'fill-color': zc[sel.zoneId] ?? zc.NW, 'fill-opacity': 0.55 },
    },
    {
      id: 'active-fill',
      type: 'fill',
      source: ADMIN,
      'source-layer': active.layer,
      filter: active.filter,
      paint: { 'fill-color': c.hover, 'fill-opacity': ['case', hovered, theme === 'light' ? 0.14 : 0.2, 0] },
    },

    { id: 'region-mask', type: 'fill', source: 'mask', paint: { 'fill-color': c.mask, 'fill-opacity': c.maskOpacity } },

    {
      id: 'lgas-line',
      type: 'line',
      source: ADMIN,
      'source-layer': 'lgas',
      filter: lvl === 'state' || lvl === 'lga' ? ['==', ['get', 'state'], sel.stateId ?? ''] : NONE,
      paint: {
        'line-color': c.lgaLine,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 9, 1.2, 12, 2],
        'line-opacity': 0.8,
      },
    },
    {
      id: 'states-line-casing',
      type: 'line',
      source: ADMIN,
      'source-layer': 'states',
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': c.labelHalo,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 3, 10, 5.5],
        'line-opacity': 0.7,
      },
    },
    {
      id: 'states-line',
      type: 'line',
      source: ADMIN,
      'source-layer': 'states',
      layout: { 'line-join': 'round' },
      paint: { 'line-color': c.stateLine, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1.1, 10, 2.4] },
    },
    {
      id: 'selection-line',
      type: 'line',
      source: ADMIN,
      'source-layer': selectedLayer,
      filter: selectedId ? ['==', ['get', 'id'], selectedId] : NONE,
      layout: { 'line-join': 'round' },
      paint: { 'line-color': c.selection, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 12, 4] },
    },
    {
      id: 'hover-line',
      type: 'line',
      source: ADMIN,
      'source-layer': active.layer,
      filter: active.filter,
      paint: { 'line-color': c.hover, 'line-width': 2, 'line-opacity': ['case', hovered, 1, 0] },
    },

    // One dot per member, placed in its LGA (or its state when the LGA wasn't recognised)
    {
      id: 'registration-dots',
      type: 'circle',
      source: 'registrations',
      // Existing members (the demo baseline) underneath, live form registrations on top
      filter: ['!', ['get', 'live']],
      paint: {
        'circle-color': c.memberDot,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 7, 1.2, 10, 2.5],
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 4, 0.35, 8, 0.6],
      },
    },
    {
      id: 'registration-dots-live',
      type: 'circle',
      source: 'registrations',
      filter: ['get', 'live'],
      paint: {
        'circle-color': c.dot,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 2.2, 7, 3.5, 10, 5.5],
        'circle-opacity': 0.9,
        'circle-stroke-color': c.dotStroke,
        'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 10, 1],
        'circle-stroke-opacity': 0.8,
      },
    },

    // State names come from the tiles; LGA names from admin.json so they show at any zoom
    {
      id: 'state-labels',
      type: 'symbol',
      source: ADMIN,
      'source-layer': 'labels',
      filter:
        lvl === 'region'
          ? ['==', ['get', 'level'], 'state']
          : lvl === 'zone'
            ? ['all', ['==', ['get', 'level'], 'state'], inZone]
            : NONE,
      layout: {
        'text-field': ['upcase', ['get', 'name']],
        'text-font': [FONTS.semibold],
        'text-size': 12,
        'text-letter-spacing': 0.1,
        'text-max-width': 8,
        'text-padding': 4,
      },
      paint: { 'text-color': c.label, 'text-halo-color': c.labelHalo, 'text-halo-width': 1.6, 'text-halo-blur': 0.5 },
    },
    {
      id: 'lga-labels',
      type: 'symbol',
      source: 'lga-labels',
      filter: lvl === 'state' || lvl === 'lga' ? ['==', ['get', 'state'], sel.stateId ?? ''] : NONE,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': [FONTS.medium],
        'text-size': 11,
        'text-max-width': 8,
        'text-padding': 3,
      },
      paint: { 'text-color': c.label, 'text-halo-color': c.labelHalo, 'text-halo-width': 1.4, 'text-halo-blur': 0.5 },
    },
  ];

  return {
    version: 8,
    glyphs: `${window.location.origin}${MAP_ROOT}/fonts/{fontstack}/{range}.pbf`,
    sources: {
      [ADMIN]: {
        type: 'vector',
        url: `pmtiles://${tilesUrl()}`,
        promoteId: { states: 'id', lgas: 'id' },
        attribution: MAP_ATTRIBUTION,
      },
      mask: { type: 'geojson', data: `${window.location.origin}${MAP_ROOT}/northern-nigeria/region-mask.geojson` },
      'lga-labels': { type: 'geojson', data: lgaLabels },
      registrations: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    },
    layers,
  };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Applies the differences between two styles from buildStyle() layer by layer. Used instead of
 * setStyle(…, { diff: true }), which would compare (and reset) the 100k+ registration points on every change.
 */
export function updateStyle(map, prev, next) {
  next.layers.forEach((layer, i) => {
    const old = prev.layers.find((l) => l.id === layer.id);
    if (!old) return;
    // A layer that switches source layer (states ↔ lgas) has to be re-added in its place
    if (old['source-layer'] !== layer['source-layer']) {
      map.removeLayer(layer.id);
      map.addLayer(layer, next.layers.slice(i + 1).find((l) => map.getLayer(l.id))?.id);
      return;
    }
    if (!same(old.filter, layer.filter)) map.setFilter(layer.id, layer.filter ?? null);
    for (const [kind, set] of [['paint', 'setPaintProperty'], ['layout', 'setLayoutProperty']]) {
      const a = old[kind] ?? {};
      const b = layer[kind] ?? {};
      for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (!same(a[key], b[key])) map[set](layer.id, key, b[key]);
      }
    }
  });
}
