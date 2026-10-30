# State Chapters map data

Copied from the Impact Observatory's `northern-nigeria` pack (`public/packs/northern-nigeria/` and
`public/map-assets/fonts/` in that repository). Rebuild them there with `scripts/pipeline.py`, then copy them here.

| File | Contents |
|---|---|
| `northern-nigeria/admin.pmtiles` | Vector tiles (z3–12), layers `states`, `lgas`, `wards`, `labels` |
| `northern-nigeria/admin.json` | Zones, states and LGAs with bbox, label point and population (trimmed from the pack's `admin.json`: no wards or age bands) |
| `northern-nigeria/region-mask.geojson` | Shading for the area outside the 19 states + FCT |
| `fonts/` | Poppins glyphs for map labels |

The `.pmtiles` file is read with HTTP range requests, so any static host that supports them works. To serve it from
object storage instead, set `NEXT_PUBLIC_MAP_TILES_URL` to its address (the host must allow CORS and range requests,
and must not add `Content-Encoding: gzip`).

## Licences

- Ward, LGA and state boundaries: GRID3 NGA Operational Wards v3.0 (CC BY-SA; Benue, Plateau and Taraba from v1.0,
  CC BY 4.0), credit GRID3 / CIESIN. Files derived from them keep the CC BY-SA licence.
- Names, P-codes and population estimates: OCHA COD-AB and COD-PS (CC BY-IGO).
- Fonts: Poppins, SIL Open Font License (`fonts/OFL-Poppins-Lora.txt`).

The map shows the attribution "GRID3 (CIESIN) CC BY-SA · OCHA COD-AB".
