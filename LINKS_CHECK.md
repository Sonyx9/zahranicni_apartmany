# Kontrola odkazů - COASTAL SIGNATURE

## ✅ Interní odkazy (všechny správně propojené)

### Navigace (Header)
- ✅ `/` - Homepage (logo)
- ✅ `/destinace/` - Seznam destinací
- ✅ `/pruvodce/` - Seznam průvodců
- ✅ `/nabidky/` - Globální výpis nabídek
- ✅ `/o-projektu/` - O projektu

### Homepage odkazy
- ✅ Hero CTA: `/destinace/` → Seznam destinací
- ✅ DestinationGrid: `/destinace/` → "Zobrazit všechny"
- ✅ DestinationGrid: `/destinace/{slug}/` → Detail destinace (10 zemí)
- ✅ GuideTeasers: `/pruvodce/` → "Všechny články"
- ✅ GuideTeasers: `/pruvodce/{slug}/` → Detail průvodce (3 průvodce)
- ✅ FeaturedOffers: `/nabidky/` → "Zobrazit výpis"
- ✅ FeaturedOffers: `{offer.url}` → Externí odkazy na nemovitosti

### Stránka destinace
- ✅ `/destinace/{slug}/` → Detail destinace
- ✅ `{offer.url}` → Externí odkazy na nemovitosti (target="_blank", rel="noopener nofollow sponsored")

### Stránka nabídky
- ✅ `{offer.url}` → Externí odkazy na nemovitosti (target="_blank", rel="noopener nofollow sponsored")

### Stránka průvodce
- ✅ Breadcrumb: `/` → Domů
- ✅ Breadcrumb: `/pruvodce/` → Průvodce
- ✅ `/pruvodce/{slug}/` → Detail průvodce

### Footer
- ✅ `/o-projektu/` → O projektu

### Skip link (accessibility)
- ✅ `#content` → Přeskočit na obsah

## ✅ Externí odkazy

### Nabídky nemovitostí
- ✅ Všechny odkazy mají `target="_blank"`
- ✅ Všechny odkazy mají `rel="noopener nofollow sponsored"`
- ✅ Odkazy vedou na `{offer.url}` z JSON dat

### Email
- ✅ `mailto:info@coastalsignature.cz` → Email kontakt

## ✅ SEO odkazy

### Canonical URLs
- ✅ Všechny stránky mají canonical URL
- ✅ Canonical URLs jsou správně nastavené

### Sitemap
- ✅ `/sitemap.xml` → Dynamicky generovaná sitemap
- ✅ Obsahuje všechny indexovatelné stránky

## 📊 Statistiky odkazů

- **Interní odkazy**: ~25+ odkazů
- **Externí odkazy**: Dynamické (z JSON dat)
- **Navigační odkazy**: 5 hlavních sekcí
- **Breadcrumbs**: Implementovány na stránce průvodce

## ✅ Závěr

Všechny odkazy jsou správně propojené:
- ✅ Navigace funguje
- ✅ Interní odkazy vedou na správné stránky
- ✅ Externí odkazy mají správné atributy
- ✅ Breadcrumbs jsou implementovány
- ✅ Skip link pro accessibility
- ✅ Všechny cesty jsou konzistentní (s trailing slash)

## 🔍 Poznámky

- Všechny odkazy používají trailing slash (`/`) pro konzistenci
- Externí odkazy mají správné bezpečnostní atributy
- Žádné chybějící nebo nefunkční odkazy
- Staré komponenty (Header.astro, Footer.astro, CountryCard.astro, OfferCard.astro) existují, ale nejsou používané - lze smazat pro úklid
