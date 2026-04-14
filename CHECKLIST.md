# QA Checklist

## Funkčnost

- [x] Všechny routy jsou vytvořeny a funkční
- [x] Klik na nabídku → externí web (target="_blank", rel="noopener nofollow sponsored")
- [x] Žádné 404 chyby (všechny routy jsou staticky generované)
- [x] Build projde bez backendu
- [x] Statická generace všech stránek funguje

## SEO

- [x] Canonical URLs na všech stránkách
- [x] Sitemap.xml obsahuje pouze indexovatelné stránky
- [x] Robots.txt správně nastaven
- [x] Open Graph meta tagy na všech stránkách
- [x] JSON-LD strukturovaná data:
  - [x] WebSite (hlavní stránka)
  - [x] Place (destinace)
  - [x] ItemList (seznamy)
  - [x] FAQPage (destinace)
  - [x] BreadcrumbList (destinace)
- [x] Destinace mají dost obsahu (nejsou "thin")
- [x] Nabídky nejsou hlavní obsah (jsou sekundární)

## WCAG

- [x] Kontrast barev (minimálně 4.5:1)
- [x] Focus states na všech interaktivních prvcích
- [x] Klávesová navigace funguje
- [x] `<a>` místo `<button>` pro odkazy
- [x] Alt texty na všech obrázcích
- [x] ARIA labely kde je potřeba
- [x] Sémantické HTML elementy

## UX

- [x] Web funguje bez JS (statický HTML)
- [x] Placeholder obrázky mají správné alt texty
- [x] Responzivní design
- [x] Loading="lazy" na obrázcích

## Data layer

- [x] Všechna data přes abstrakční vrstvu (`src/lib/data.ts`)
- [x] Žádné přímé importy JSON po stránkách
- [x] Struktura dat odpovídá budoucímu backendu
- [x] Snadné nahrazení fetch voláním

## Komponenty

- [x] Header - navigace
- [x] Footer - patička
- [x] CountryCard - karta destinace
- [x] OfferCard - karta nabídky (bez detail stránky, CTA ven)
- [x] FAQSection - FAQ sekce

## Routy

- [x] `/` - Hlavní stránka
- [x] `/destinace/` - Seznam destinací
- [x] `/destinace/{zeme}/` - Detail destinace (10 zemí, staticky generované)
- [x] `/nabidky/` - Globální výpis
- [x] `/pruvodce/` - Průvodce
- [x] `/o-projektu/` - O projektu

## Poznámky

- Placeholder obrázky je potřeba přidat do `public/images/placeholders/` a `public/images/hero/`
- OG obrázek je potřeba přidat jako `public/images/og-default.jpg`
- Před nasazením upravit `astro.config.mjs` (site a base URL)
- Před nasazením upravit `public/robots.txt` (sitemap URL)

