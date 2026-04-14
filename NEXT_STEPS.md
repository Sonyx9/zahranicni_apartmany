# Další kroky - COASTAL SIGNATURE

## ✅ Dokončené fáze

Všechny hlavní fáze jsou dokončeny:
- ✅ Struktura projektu a komponenty
- ✅ Content Collections (destinace + průvodce)
- ✅ SEO & AI-SEO (JSON-LD, meta tagy)
- ✅ Design systém (COASTAL SIGNATURE)
- ✅ Všechny stránky a routy
- ✅ Build proces funguje

## 🎯 Co zbývá (volitelné vylepšení)

### 1. Obrázky
Přidejte skutečné obrázky do:
- `/public/images/hero/home.jpg` - hero homepage
- `/public/images/hero/{country}.jpg` - pro každou destinaci (10 obrázků)
- `/public/images/placeholders/property-1.jpg` až `property-6.jpg` - placeholder nemovitosti
- `/public/images/og-default.jpg` - Open Graph obrázek (1200x630px)

### 2. Konfigurace pro produkci
Před nasazením upravte:
- `astro.config.mjs` - nastavte `site` a `base` URL
- `src/pages/index.astro` - upravte `canonical` URL (řádek ~60)
- `public/robots.txt` - upravte sitemap URL
- `src/pages/sitemap.xml.ts` - upravte `siteUrl` a `base` (pokud je potřeba)

### 3. GitHub Pages deployment
Workflow je připraven v `.github/workflows/deploy.yml`. Stačí:
1. Pushnout kód do GitHub repozitáře
2. Nastavit GitHub Pages v nastavení repozitáře
3. Workflow se spustí automaticky

### 4. Testování
Otestujte:
- ✅ Build projde (`npm run build`)
- ✅ Všechny routy jsou dostupné
- ✅ Responzivní design na různých zařízeních
- ✅ SEO meta tagy jsou správně
- ✅ JSON-LD strukturovaná data jsou validní

## 📊 Statistiky projektu

- **Stránky**: 18 statických stránek
- **Destinace**: 10 zemí s markdown obsahem
- **Průvodce**: 3 průvodce
- **Komponenty**: 9 hlavních komponent
- **Content Collections**: 2 kolekce (destinations, guides)

## 🚀 Spuštění

```bash
# Vývoj
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## 📝 Poznámky

- Všechny data jsou přes abstrakční vrstvu (`src/lib/data.ts`)
- Backend připraven - stačí nahradit importy fetch voláním
- Design je podle COASTAL SIGNATURE konceptu
- SEO optimalizováno pro Google i AI vyhledávání

## 🔗 Užitečné odkazy

- [Astro dokumentace](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages deployment](https://docs.github.com/en/pages)
