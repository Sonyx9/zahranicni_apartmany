# Status implementace - COASTAL SIGNATURE

## ✅ Dokončené fáze

### FÁZE 1: Struktura projektu
- ✅ Nová struktura komponent (seo/, layout/, home/)
- ✅ Content Collections nastaveny (destinations, guides)
- ✅ Všechny stránky přepracované podle nového designu

### FÁZE 2: Content Collections
- ✅ Schéma pro destinations (title, countrySlug, summary, heroImage, faq)
- ✅ Schéma pro guides (title, description, published, topic)
- ✅ Markdown soubory vytvořeny pro všechny 10 destinací
- ✅ 3 průvodce vytvořeny (proces-koupe, naklady-a-dane, jak-vybirame)

### FÁZE 3: SEO & AI-SEO
- ✅ SEOHead komponenta s kompletními meta tagy
- ✅ JsonLd komponenta pro strukturovaná data
- ✅ JSON-LD implementováno na všech stránkách:
  - Organization + WebSite (homepage)
  - FAQPage (homepage, destinace)
  - ItemList (destinace, nabídky, průvodce)
  - Article (průvodce)
  - Place (destinace)
  - BreadcrumbList (destinace)

### FÁZE 4: Komponenty
- ✅ SiteLayout - hlavní layout s globálními styly
- ✅ Header - minimalistický, navy, bez efektů
- ✅ Footer - tmavá navy, minimum textu, disclosure
- ✅ Hero - fullscreen s mořským horizontem
- ✅ DestinationGrid - 5 sloupců, responsivní
- ✅ Methodology - 3 kroky bez ikon
- ✅ FAQ - details/summary, bez boxů
- ✅ GuideTeasers - grid průvodců
- ✅ FeaturedOffers - grid nabídek

### FÁZE 5: Stránky
- ✅ index.astro - kompletní homepage s všemi sekcemi
- ✅ destinace/index.astro - seznam destinací
- ✅ destinace/[country].astro - detail destinace s Content Collections
- ✅ nabidky/index.astro - galerie inspirace
- ✅ pruvodce/index.astro - seznam průvodců z Content Collections
- ✅ pruvodce/[slug].astro - detail průvodce
- ✅ o-projektu.astro - o projektu

### FÁZE 6: Design systém
- ✅ CSS proměnné (--navy, --ivory, --sand, --slate, --line)
- ✅ Playfair Display pro nadpisy
- ✅ Inter pro texty
- ✅ Tabulární číslice pro ceny
- ✅ Konzistentní spacing (64px/42px desktop, 48px mobile)
- ✅ Max-width: 1240px
- ✅ Žádné agresivní stíny, jen jemné linky

## 📝 Poznámky

### Content Collections
- Destinace: Všechny 10 zemí mají markdown soubory v `src/content/destinations/`
- Průvodce: 3 průvodce vytvořeny v `src/content/guides/`
- Stránka destinace automaticky používá Content Collection, pokud existuje
- Fallback na hardcoded data, pokud markdown neexistuje

### SEO
- Všechny stránky mají canonical URLs
- JSON-LD strukturovaná data na všech stránkách
- Externí odkazy mají `rel="nofollow sponsored noopener"`
- FAQPage JSON-LD pouze tam, kde je FAQ skutečně na stránce

### Design
- Design je podle COASTAL SIGNATURE konceptu
- Klidný, prémiový, minimalistický
- 80-15-5 pravidlo (80% světlé plochy, 15% navy, 5% sand)
- Žádné ikonky, žádné agresivní efekty

## 📋 Plán: Nemovitosti z XML feedu

Detailní plán implementace (XML feed Softreal, affiliate kód, denní fetch v 1:00, filtr ceny ≥ 50k EUR):  
**[docs/XML_FEED_IMPLEMENTATION.md](docs/XML_FEED_IMPLEMENTATION.md)**

- Feed: `https://s1.system.softreal.cz/mojenemovitostumore/softreal/publicExportFacebook/index/1002/`
- Affiliate: `aff=l4todz91fb` u každého prokliku
- Cron: denně 1:00; při prázdném feedu zůstanou původní data

---

## 🔄 Co zbývá (volitelné)

1. **Obrázky** - Přidat skutečné obrázky:
   - `/public/images/hero/ocean-horizon.jpg` - hero homepage
   - `/public/images/hero/{country}.jpg` - pro každou destinaci
   - `/public/images/placeholders/property-1.jpg` až `property-6.jpg`
   - `/public/images/og-default.jpg` - Open Graph obrázek

2. **Další markdown soubory** - Vytvořit markdown pro zbývající destinace (pokud chcete více obsahu)

3. **Testování** - Otestovat build a všechny routy

4. **GitHub Pages** - Nastavit deployment workflow

## 🚀 Jak spustit

```bash
npm install
npm run dev
```

Web běží na `https://localhost:4321`

## 📦 Build

```bash
npm run build
```

Výstup: `dist/` složka
