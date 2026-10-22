import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { createMatcher } from '../../lib/matchPlace';

// Registrations for the State Chapters map. Reads the sheet the registration form writes to and returns only
// where each registration is (state and LGA P-codes) and the day it came in: never names, emails or phone numbers.
//
// Environment:
//   REGISTRATIONS_SHEET_ID     the spreadsheet ID (from its URL), shared with GOOGLE_SERVICE_ACCOUNT_EMAIL as Viewer
//   REGISTRATIONS_SHEET_RANGE  optional tab or range, e.g. "Form Responses" (default: that tab, else the first tab)
//   REGISTRATIONS_STATE_COLUMN / REGISTRATIONS_LGA_COLUMN / REGISTRATIONS_TIME_COLUMN
//                              optional column letters, when the header row doesn't name them

const CACHE_MS = 30 * 1000; // keeps well inside the Sheets API read quota however many people have the map open
let cache = { at: 0, body: null };
let matcher = null;
let defaultRange = null;

const headerKey = (h) => String(h ?? '').toLowerCase().replace(/[^a-z]/g, '');
// Dates come back as Sheets serial numbers (days since 30 Dec 1899) or, when the form wrote text, as strings
const toDay = (v) => {
  const t = typeof v === 'number' ? new Date(Date.UTC(1899, 11, 30) + v * 864e5) : new Date(v);
  return isNaN(t) ? null : t.toISOString().slice(0, 10);
};
const letterIndex = (l) => [...l.toUpperCase()].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;

function findColumns(header) {
  const keys = header.map(headerKey);
  const find = (env, ...tests) => {
    if (process.env[env]) return letterIndex(process.env[env]);
    for (const test of tests) {
      const i = keys.findIndex(test);
      if (i >= 0) return i;
    }
    return -1;
  };
  return {
    state: find('REGISTRATIONS_STATE_COLUMN', (k) => k.includes('residence'), (k) => k === 'state'),
    lga: find('REGISTRATIONS_LGA_COLUMN', (k) => k.includes('lga') || k.includes('localgovernment')),
    time: find('REGISTRATIONS_TIME_COLUMN', (k) => k.includes('timestamp') || (k.includes('date') && !k.includes('birth'))),
  };
}

function sheetsClient() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  );
  return google.sheets({ version: 'v4', auth });
}

async function load() {
  const spreadsheetId = process.env.REGISTRATIONS_SHEET_ID;
  const sheets = sheetsClient();

  if (!process.env.REGISTRATIONS_SHEET_RANGE && !defaultRange) {
    const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' });
    const titles = meta.data.sheets.map((s) => s.properties.title);
    const title = titles.includes('Form Responses') ? 'Form Responses' : titles[0];
    defaultRange = `'${title.replace(/'/g, "''")}'`;
  }
  const range = process.env.REGISTRATIONS_SHEET_RANGE || defaultRange;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'SERIAL_NUMBER',
  });
  const [header = [], ...rows] = res.data.values ?? [];
  const col = findColumns(header);
  if (col.state < 0) throw new Error('No "State of Residence" column found; set REGISTRATIONS_STATE_COLUMN');

  if (!matcher) {
    const admin = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/maps/northern-nigeria/admin.json'), 'utf8'));
    matcher = createMatcher(admin);
  }

  const points = [];
  let outside = 0;
  rows.forEach((row, i) => {
    if (!row.some((v) => String(v).trim())) return;
    const place = matcher(row[col.state], col.lga >= 0 ? row[col.lga] : '');
    if (!place) outside++;
    // [sheet row, state P-code, LGA P-code (null when not recognised), day registered or null];
    // state is null for answers outside the 19 northern states
    points.push([i + 2, place?.state ?? null, place?.lga ?? null, col.time >= 0 ? toDay(row[col.time]) : null]);
  });

  return { updated: new Date().toISOString(), total: points.length, outside, points };
}

export default async function handler(req, res) {
  if (!process.env.REGISTRATIONS_SHEET_ID) {
    return res.status(503).json({ error: 'REGISTRATIONS_SHEET_ID is not set' });
  }
  try {
    if (!cache.body || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), body: await load() };
    }
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(cache.body);
  } catch (error) {
    console.error('Failed to read registrations:', error.message);
    // Serve the last good result rather than emptying the map
    if (cache.body) return res.status(200).json(cache.body);
    return res.status(502).json({ error: 'Could not read registrations' });
  }
}
