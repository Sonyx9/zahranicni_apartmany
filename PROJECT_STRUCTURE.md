# Struktura projektu

## Přehled

Tento projekt je statický web postavený na Astro pro prezentaci nemovitostí u moře. Všechny fáze podle specifikace jsou implementovány.

## Struktura adresářů

```
/
├── public/
│   ├── images/
│   │   ├── placeholders/     # Placeholder obrázky nemovitostí
│   │   ├── hero/             # Hero obrázky destinací
│   │   └── og-default.jpg    # Open Graph obrázek
│   └── robots.txt
├── src/
│   ├── components/           # UI komponenty
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── CountryCard.astro
│   │   ├── OfferCard.astro
│   │   └── FAQSection.astro
│   ├── content/             # Content Collections
│   │   ├── config.ts
│   │   └── destinace/       # Markdown soubory pro destinace
│   ├── data/                # Data layer (JSON)
│   │   ├── countries.json
│   │   ├── offers-global.json
│   │   └── offers-by-country.json
│   ├── layouts/             # Layout komponenty
│   │   └── Layout.astro
│   ├── lib/                 # Utility funkce
│   │   └── data.ts          # Data layer abstrakce
│   └── pages/               # Astro stránky (routy)
│       ├── index.astro
│       ├── destinace/
│       │   ├── index.astro
│       │   └── [country].astro
│       ├── nabidky/
│       │   └── index.astro
│       ├── pruvodce/
│       │   └── index.astro
│       ├── o-projektu.astro
│       └── sitemap.xml.ts
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Routy

### Indexovatelné stránky

- `/` - Hlavní stránka
- `/destinace/` - Seznam destinací
- `/destinace/{zeme}/` - Detail destinace (10 zemí)
- `/nabidky/` - Globální výpis nabídek
- `/pruvodce/` - Průvodce nákupem
- `/o-projektu/` - O projektu

### Neindexovatelné

Žádné (podle specifikace)

## Data layer

Všechna data jsou v `src/lib/data.ts` - abstrakční vrstva, která umožní snadné nahrazení JSON souborů backend API voláním.

### Funkce

- `getCountries()` - Všechny země
- `getCountry(slug)` - Konkrétní země
- `getOffers()` - Všechny globální nabídky
- `getOffersByCountry(slug)` - Nabídky pro zemi
- `getOffersByCountryLimited(slug, limit)` - Nabídky pro zemi (omezené)

## Komponenty

### Header
Hlavní navigace s odkazy na všechny sekce.

### Footer
Patička s navigací a kontaktními informacemi.

### CountryCard
Karta destinace s obrázkem a odkazem.

### OfferCard
Karta nabídky nemovitosti s CTA odkazem na externí web.

### FAQSection
Sekce s často kladenými otázkami.

## SEO

- ✅ Canonical URLs na všech stránkách
- ✅ Sitemap.xml (dynamicky generovaná)
- ✅ Robots.txt
- ✅ Open Graph meta tagy
- ✅ JSON-LD strukturovaná data:
  - WebSite (hlavní stránka)
  - Place (destinace)
  - ItemList (seznamy)
  - FAQPage (destinace)
  - BreadcrumbList (destinace)

## WCAG

- ✅ Kontrast barev
- ✅ Focus states na všech interaktivních prvcích
- ✅ Klávesová navigace
- ✅ `<a>` místo `<button>` pro odkazy
- ✅ Alt texty na obrázcích
- ✅ ARIA labely kde je potřeba

## Příprava na backend

Data layer je připraven tak, že při napojení backendu stačí:

1. Upravit `src/lib/data.ts`
2. Nahradit importy JSON fetch voláním
3. Žádné další změny v UI, routách nebo komponentách

## Build

```bash
npm install
npm run build
```

Výstup: `dist/` složka

## Vývoj

```bash
npm run dev
```

Web běží na `https://localhost:4321`

