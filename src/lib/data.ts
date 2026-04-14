/**
 * Data layer abstraction
 * 
 * This module provides a unified interface for accessing data.
 * When backend is connected, only this file needs to be updated.
 */

import countriesData from '../data/countries.json';
import offersFeedData from '../data/offers-feed.json';
import offersLuxuryData from '../data/offers-luxury.json';
import offersGlobalData from '../data/offers-global.json';
import offersByCountryData from '../data/offers-by-country.json';
import featuredPropertyData from '../data/featured-property.json';

export interface Country {
  slug: string;
  name: string;
  heroImage: string;
  /** Externí odkaz na výpis nabídek u partnera (např. Moje nemovitost u moře) */
  partnerOffersUrl?: string;
}

export interface Offer {
  id: string;
  title: string;
  country: string;
  price: string;
  image: string;
  url: string;
}

export interface FeaturedProperty {
  title: string;
  image: string;
  url: string;
  price?: string;
  state: string;
  date?: string;
  nextChangeAt?: string;
}

/** Jedna položka karuselu (bez date/nextChangeAt – ty jsou na kořeni). */
export interface FeaturedPropertyItem {
  title: string;
  image: string;
  url: string;
  price?: string;
  state: string;
}

export interface FeaturedPropertiesPayload {
  properties: FeaturedPropertyItem[];
  date: string;
  nextChangeAt: string;
}

/**
 * Get all countries
 */
export function getCountries(): Country[] {
  return countriesData as Country[];
}

/**
 * Get country by slug
 */
export function getCountry(slug: string): Country | undefined {
  return getCountries().find(country => country.slug === slug);
}

/**
 * Get all global offers (from feed if available and non-empty, else fallback)
 */
export function getOffers(): Offer[] {
  const feed = offersFeedData as Offer[];
  return Array.isArray(feed) && feed.length > 0 ? feed : (offersGlobalData as Offer[]);
}

/**
 * Normalizuje název pro sérii: nahradí pouze dispoziční varianty (1+1, 4+1, 3+kk) placeholderem,
 * aby "Projekt 1+1 v Alanya..." a "Projekt 4+1 v Alanya..." měly stejný klíč. Čísla v textu (např. 400m) zůstanou.
 */
function getSeriesKey(title: string): string {
  return title.replace(/\d+\+\d+|\d+kk/gi, '#').trim();
}

/**
 * Nabídky s deduplikací po sérii – u názvů, které se liší jen čísly (1+1 vs 4+1),
 * zobrazí se jen jedna nemovitost ze série (první v pořadí).
 * Pořadí z feedu se zachovává (feed typicky nejnovější první).
 */
export function getOffersDeduplicatedBySeries(): Offer[] {
  const offers = getOffers();
  const seen = new Set<string>();
  return offers.filter((o) => {
    const key = getSeriesKey(o.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Nabídky pro sekci „Vybrané nemovitosti“ na homepage:
 * z feedu (50k–130k EUR), deduplikované po sérii, v pořadí z feedu = nejnovější první.
 */
export function getOffersForHomepage(): Offer[] {
  return getOffersDeduplicatedBySeries();
}

/**
 * Luxusní nemovitosti (vily, domy) od 150k EUR z feedu.
 */
export function getOffersLuxury(): Offer[] {
  const data = offersLuxuryData as Offer[];
  return Array.isArray(data) ? data : [];
}

/**
 * Luxusní nabídky s deduplikací po sérii pro sekci „Luxusní nemovitosti“ na homepage.
 */
export function getOffersLuxuryForHomepage(): Offer[] {
  const offers = getOffersLuxury();
  const seen = new Set<string>();
  return offers.filter((o) => {
    const key = getSeriesKey(o.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get offers by country slug
 */
export function getOffersByCountry(countrySlug: string): Offer[] {
  const offers = offersByCountryData[countrySlug as keyof typeof offersByCountryData];
  return offers ? (offers as Offer[]) : [];
}

/**
 * Get offers for a country (limited to 24 for display)
 */
export function getOffersByCountryLimited(countrySlug: string, limit: number = 24): Offer[] {
  return getOffersByCountry(countrySlug).slice(0, limit);
}

/**
 * Featured properties for Hero carousel (Kypr feed, condition=new, rotates every 24h).
 * Supports legacy format (single object) and new format (properties array).
 * Returns null if no valid data.
 */
export function getFeaturedProperties(): FeaturedPropertiesPayload | null {
  const data = featuredPropertyData as FeaturedProperty | FeaturedPropertiesPayload;
  if (!data) return null;

  const hasArray = 'properties' in data && Array.isArray((data as FeaturedPropertiesPayload).properties);
  if (hasArray) {
    const payload = data as FeaturedPropertiesPayload;
    const list = payload.properties.filter((p) => p && p.title && p.url);
    if (list.length === 0 || !payload.nextChangeAt) return null;
    return { properties: list, date: payload.date ?? '', nextChangeAt: payload.nextChangeAt };
  }

  const single = data as FeaturedProperty;
  if (!single.title || !single.url) return null;
  return {
    properties: [{ title: single.title, image: single.image ?? '', url: single.url, price: single.price, state: single.state ?? 'Kypr' }],
    date: single.date ?? '',
    nextChangeAt: single.nextChangeAt ?? '',
  };
}
