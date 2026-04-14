/**
 * Stáhne XML feed nemovitostí pro Kypr (Softreal 1002/53), filtruje:
 * - pouze <condition>new</condition>
 * - pouze nemovitosti s cenou
 * - vynechá nedostupné a konkrétně vyloučené ID
 * Vybere tři nemovitosti pro karusel (seed = den v UTC), uloží do src/data/featured-property.json.
 *
 * Spuštění: npm run fetch-featured
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEED_URL = 'https://s1.system.softreal.cz/mojenemovitostumore/softreal/publicExportFacebook/index/1002/53';
const AFFILIATE_CODE = 'l4todz91fb';
const REQUEST_TIMEOUT_MS = 90_000;
/** Hodina v UTC, kdy se featured nemovitost mění (1 = 1:00 UTC = 2:00 SEČ) */
const FEATURED_NEXT_CHANGE_HOUR_UTC = 1;
const DATA_DIR = join(__dirname, '..', 'src', 'data');
const FEATURED_PROPERTY_PATH = join(DATA_DIR, 'featured-property.json');

/** ID nemovitostí, které se nesmí zobrazit v karuselu (např. jiná destinace, vyřazené) */
const EXCLUDED_IDS = ['11888'];

function appendAffiliate(url, code = AFFILIATE_CODE) {
  if (!url || typeof url !== 'string') return url;
  const u = url.trim();
  return u.includes('?') ? `${u}&aff=${code}` : `${u}?aff=${code}`;
}

function parsePrice(value) {
  if (value == null) return NaN;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const s = String(value).replace(/\s/g, '').replace(/[^\d.,]/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n;
}

function textVal(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object' && v['#text'] != null) return String(v['#text']).trim();
  return String(v).trim();
}

function firstText(...candidates) {
  for (const c of candidates) {
    const t = textVal(c);
    if (t) return t;
  }
  return '';
}

function extractItemFields(item) {
  const link = firstText(item.link, item.url, item['g:link'], item['g:product_link'], item.detail_url);
  const title = firstText(item.title, item['g:title'], item.name, item['g:name']);
  const rawPrice = item.price ?? item['g:price'] ?? item.cena;
  const image = firstText(item.image_link, item['g:image_link'], item.image, item['g:image']);
  const condition = firstText(item.condition, item['g:condition']);
  const availability = firstText(item.availability, item['g:availability'], item.stock, item.stav, item.status);
  const id = textVal(item.id);
  return { id, link, title, rawPrice, image, condition, availability };
}

function isExcludedId(link, id) {
  if (!link && !id) return false;
  const raw = (link || '') + '/' + (id || '');
  return EXCLUDED_IDS.some((ex) => raw.includes('/' + ex) || raw.includes(ex + '?') || raw.endsWith(ex));
}

const UNAVAILABLE_VALUES = ['out of stock', 'out_of_stock', 'unavailable', 'nedostupné', 'preorder', 'reserved', 'rezervováno'];

function isUnavailable(availability) {
  if (!availability) return false;
  const a = availability.toLowerCase().trim();
  return UNAVAILABLE_VALUES.some((v) => a.includes(v));
}

function findItemArray(obj, depth = 0) {
  if (depth > 10) return null;
  if (!obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    const first = obj[0];
    if (first && typeof first === 'object' && (first.link || first.url || first['g:link'] || first.title)) return obj;
    return null;
  }
  for (const key of ['item', 'items', 'entry', 'product', 'listing']) {
    const val = obj[key];
    if (Array.isArray(val) && val.length) return findItemArray(val, depth + 1) ?? val;
  }
  for (const value of Object.values(obj)) {
    const found = findItemArray(value, depth + 1);
    if (found) return found;
  }
  return null;
}

async function fetchWithLongTimeout(url) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/xml, text/xml, */*' },
    });
    clearTimeout(to);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(to);
    throw e;
  }
}

/** Deterministic index from date string (same day = same index). */
function seededIndex(str, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % max;
}

async function main() {
  console.log('Stahuji feed Kypru (timeout %ds)...', REQUEST_TIMEOUT_MS / 1000);
  let xmlText;
  try {
    xmlText = await fetchWithLongTimeout(FEED_URL);
  } catch (err) {
    console.error('Chyba stahování feedu:', err.message);
    process.exit(1);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
    trimValues: true,
  });
  let parsed;
  try {
    parsed = parser.parse(xmlText);
  } catch (e) {
    console.error('Chyba parsování XML:', e.message);
    process.exit(1);
  }

  const items = findItemArray(parsed);
  if (!items || !items.length) {
    console.log('V feedu nebyla nalezena žádná pole položek.');
    process.exit(1);
  }

  const eligible = [];
  for (const item of items) {
    const { id, link, title, rawPrice, image, condition, availability } = extractItemFields(item);
    const priceNum = parsePrice(rawPrice);
    if (!link || !title) continue;
    if (condition.toLowerCase() !== 'new') continue;
    if (Number.isNaN(priceNum) || priceNum <= 0) continue;
    if (isExcludedId(link, id)) continue;
    if (isUnavailable(availability)) continue;

    const priceFormatted = priceNum >= 1e6
      ? `${(priceNum / 1e6).toFixed(1)} mil. €`
      : `${Math.round(priceNum).toLocaleString('cs-CZ')} €`;
    eligible.push({
      title: title || 'Nemovitost',
      image: image || '',
      url: appendAffiliate(link, AFFILIATE_CODE),
      price: priceFormatted,
    });
  }

  if (eligible.length === 0) {
    console.log('Žádné nemovitosti s condition=new a cenou. Soubor se nemění.');
    process.exit(0);
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const wanted = 3;
  const indicesSet = new Set();
  for (const seed of [dateStr, dateStr + '1', dateStr + '2', dateStr + '3', dateStr + '4', dateStr + '5', dateStr + '6']) {
    indicesSet.add(seededIndex(seed, eligible.length));
    if (indicesSet.size >= Math.min(wanted, eligible.length)) break;
  }
  let chosenIndices = Array.from(indicesSet).slice(0, wanted);
  if (chosenIndices.length < wanted && eligible.length >= wanted) {
    for (let i = 0; chosenIndices.length < wanted && i < eligible.length; i++) {
      if (!chosenIndices.includes(i)) chosenIndices.push(i);
    }
    chosenIndices = chosenIndices.slice(0, wanted);
  }
  const chosen = chosenIndices.map((i) => eligible[i]).filter(Boolean);

  const now = new Date();
  const nextChange = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, FEATURED_NEXT_CHANGE_HOUR_UTC, 0, 0, 0));

  const payload = {
    properties: chosen.map((c) => ({
      title: c.title,
      image: c.image,
      url: c.url,
      price: c.price || '',
      state: 'Kypr',
    })),
    date: dateStr,
    nextChangeAt: nextChange.toISOString(),
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FEATURED_PROPERTY_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Zapsány %d featured nemovitosti do src/data/featured-property.json (z %d eligible, den %s)', chosen.length, eligible.length, dateStr);
}

main();
