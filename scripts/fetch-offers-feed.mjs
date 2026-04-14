/**
 * Stáhne XML feed nemovitostí (Softreal), filtruje:
 * - cena 50k–130k EUR
 * - jen apartmány u moře (vyloučeny domy, vily)
 * Přidá affiliate kód a zapíše src/data/offers-feed.json.
 *
 * Spuštění: npm run fetch-offers
 * Timeout requestu: 90 s (feed může být pomalý).
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FEED_URL = 'https://s1.system.softreal.cz/mojenemovitostumore/softreal/publicExportFacebook/index/1002/';
const AFFILIATE_CODE = 'l4todz91fb';
const MIN_PRICE_EUR = 50_000;
const MAX_PRICE_EUR = 130_000;
const MAX_OFFERS_SAVED = 500;

// Jen apartmány u moře: musí obsahovat typ apartmán + odkaz na moře; vyloučit domy/vily
const RE_APARTMENT = /\b(apartm[aá]n|byt|studio|apartment)\b/i;
const RE_BY_SEA = /\b(mo[eř]e|more|pl[aá]ž|plaz|plaze|beach|sea|pob[eř][eí]ž[ií]?|pobrezi)\b|[\d]+\s*m\s*od\s*mo/i;
const RE_HOUSE = /\b(d[uú]m|dum|vila|villa|house)\b/i;
const LUXURY_MIN_PRICE_EUR = 150_000;
const MAX_LUXURY_SAVED = 500;
const REQUEST_TIMEOUT_MS = 90_000;
const DATA_DIR = join(__dirname, '..', 'src', 'data');
const OFFERS_FEED_PATH = join(DATA_DIR, 'offers-feed.json');
const OFFERS_LUXURY_PATH = join(DATA_DIR, 'offers-luxury.json');
const FEED_LAST_XML_PATH = join(__dirname, 'feed-last.xml');

function appendAffiliate(url, code = AFFILIATE_CODE) {
  if (!url || typeof url !== 'string') return url;
  const u = url.trim();
  return u.includes('?') ? `${u}&aff=${code}` : `${u}?aff=${code}`;
}

/** Z čísla nebo řetězce s cenou vrátí číslo (bez mezer a měny). */
function parsePrice(value) {
  if (value == null) return NaN;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const s = String(value).replace(/\s/g, '').replace(/[^\d.,]/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n;
}

/**
 * Struktura položky ve feedu (Softreal):
 * <item>
 *   <id>9314</id>
 *   <title>...</title>
 *   <link>https://...</link>
 *   <price>755000.00 EUR</price>
 *   <image_link>https://...</image_link>
 *   <country>CZ</country>
 * </item>
 */
function textVal(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object' && v['#text'] != null) return String(v['#text']).trim();
  return String(v).trim();
}

function extractItemFields(item) {
  const link = textVal(item.link ?? item.url ?? item['g:link']);
  const title = textVal(item.title ?? item['g:title'] ?? item.name);
  const description = textVal(item.description ?? item['g:description'] ?? '');
  const rawPrice = item.price ?? item['g:price'] ?? item.cena;
  const image = textVal(item.image_link ?? item['g:image_link'] ?? item.image);
  const country = textVal(item.country ?? item['g:country'] ?? item.location);
  const id = textVal(item.id);
  return { id, link, title, description, rawPrice, image, country };
}

/** True = je to apartmán u moře (ne dům/vila). Kontroluje title + description. */
function isApartmentBySea(title, description) {
  const text = `${title} ${description}`;
  if (RE_HOUSE.test(text)) return false;
  if (!RE_APARTMENT.test(text)) return false;
  if (!RE_BY_SEA.test(text)) return false;
  return true;
}

/** True = je to vila/dům (pro luxusní sekci od 150k EUR). */
function isVilaOrDum(title, description) {
  return RE_HOUSE.test(`${title} ${description}`);
}

/** Rekurzivně najde v objektu první pole objektů, které vypadají jako položky (mají link/title). */
function findItemArray(obj, depth = 0) {
  if (depth > 10) return null;
  if (!obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    const first = obj[0];
    if (first && typeof first === 'object' && (first.link || first.url || first['g:link'] || first.title)) return obj;
    return null;
  }
  for (const key of ['item', 'items', 'entry', 'product', 'listing', 'nemovitosti']) {
    const val = obj[key];
    if (Array.isArray(val) && val.length) return findItemArray(val, depth + 1) ?? val;
  }
  for (const value of Object.values(obj)) {
    const found = findItemArray(value, depth + 1);
    if (found) return found;
  }
  return null;
}

function flattenObject(obj, prefix = '') {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object' && !Array.isArray(v) && !(v['@_url'] || v['#text'])) {
      Object.assign(out, flattenObject(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
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

async function main() {
  console.log('Stahuji feed (timeout %ds)...', REQUEST_TIMEOUT_MS / 1000);
  let xmlText;
  try {
    xmlText = await fetchWithLongTimeout(FEED_URL);
  } catch (err) {
    console.error('Chyba stahování feedu:', err.message);
    process.exit(1);
  }

  // Uložit surový XML pro kontrolu struktury
  await writeFile(FEED_LAST_XML_PATH, xmlText, 'utf8');
  console.log('Soubor feed-last.xml uložen pro kontrolu.');

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
    console.log('V feedu nebyla nalezena žádná pole položek (item/entry/...). Ukázka kořene:', JSON.stringify(flattenObject(parsed), null, 2).slice(0, 1500));
    process.exit(1);
  }

  const AFF = AFFILIATE_CODE;
  const offers = [];
  const luxuryOffers = [];
  const seen = new Set();
  const seenLuxury = new Set();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { id: rawId, link, title, description, rawPrice, image, country: countryRaw } = extractItemFields(item);
    const priceNum = parsePrice(rawPrice);
    if (!link) continue;

    const priceFormatted = priceNum >= 1e6
      ? `${(priceNum / 1e6).toFixed(1)} mil. €`
      : `${Math.round(priceNum).toLocaleString('cs-CZ')} €`;
    const countrySlug = countryRaw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'evropa';
    const id = rawId || `feed-${i}`;
    const record = {
      id: `feed-${id}`,
      title: title || 'Nemovitost',
      country: countrySlug,
      price: priceFormatted,
      image: image || '/images/placeholders/property-1.jpg',
      url: appendAffiliate(link, AFF),
    };

    if (!Number.isNaN(priceNum) && priceNum >= MIN_PRICE_EUR && priceNum <= MAX_PRICE_EUR && isApartmentBySea(title, description)) {
      if (!seen.has(record.url)) {
        seen.add(record.url);
        offers.push(record);
      }
    }

    if (!Number.isNaN(priceNum) && priceNum >= LUXURY_MIN_PRICE_EUR && isVilaOrDum(title, description)) {
      if (!seenLuxury.has(record.url)) {
        seenLuxury.add(record.url);
        luxuryOffers.push(record);
      }
    }
  }

  if (offers.length === 0) {
    console.log('Po filtraci (cena %s–%s EUR, jen apartmány u moře) nezbyly žádné nemovitosti. Soubor offers-feed.json se nemění.', MIN_PRICE_EUR.toLocaleString('cs-CZ'), MAX_PRICE_EUR.toLocaleString('cs-CZ'));
    process.exit(0);
  }

  await mkdir(DATA_DIR, { recursive: true });
  const toSave = offers.slice(0, MAX_OFFERS_SAVED);
  await writeFile(OFFERS_FEED_PATH, JSON.stringify(toSave, null, 2), 'utf8');
  console.log('Zapsáno %d nemovitostí do src/data/offers-feed.json (z %d po filtraci)', toSave.length, offers.length);

  if (luxuryOffers.length > 0) {
    const toSaveLuxury = luxuryOffers.slice(0, MAX_LUXURY_SAVED);
    await writeFile(OFFERS_LUXURY_PATH, JSON.stringify(toSaveLuxury, null, 2), 'utf8');
    console.log('Zapsáno %d luxusních nemovitostí (vily) do src/data/offers-luxury.json (od %s EUR)', toSaveLuxury.length, LUXURY_MIN_PRICE_EUR.toLocaleString('cs-CZ'));
  }
}

main();
