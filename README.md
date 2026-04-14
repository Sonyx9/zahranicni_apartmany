# Coastal Signature

Kurátorovaný průvodce pobřežním bydlením. Prémiový, klidný rozcestník pro pobřežní bydlení: destinace, kontext a vybrané nabídky.

## 🎨 Design koncept

**COASTAL SIGNATURE** - Klid. Jistota. Výběr pro lidi, kteří nemusí spěchat a chtějí kvalitu.

- **Barevná paleta**: Deep Ocean Navy, Warm Sand, Ivory White, Slate Grey
- **Typografie**: Playfair Display (nadpisy), Inter (texty)
- **Filozofie**: Méně prvků, víc prostoru. Prémiový klid.

## 🚀 Rychlý start

```bash
# Instalace závislostí
npm install

# Vývojový server
npm run dev

# Build pro produkci
npm run build

# Preview build
npm run preview
```

## 📁 Struktura projektu

```
src/
├── components/
│   ├── layout/        # SiteLayout, Header, Footer
│   ├── home/          # Homepage komponenty
│   └── seo/           # SEO komponenty
├── content/
│   ├── destinations/  # Markdown soubory pro destinace
│   └── guides/        # Markdown soubory pro průvodce
├── data/              # JSON data (dočasné, před backendem)
├── lib/               # Utility funkce (data layer)
└── pages/             # Astro stránky (routy)
```

## 📄 Routy

- `/` - Hlavní stránka
- `/destinace/` - Seznam destinací
- `/destinace/{zeme}/` - Detail destinace (10 zemí)
- `/nabidky/` - Globální výpis nabídek
- `/pruvodce/` - Seznam průvodců
- `/pruvodce/{slug}/` - Detail průvodce
- `/o-projektu/` - O projektu

## 🛠️ Technologie

- **Astro** - Static Site Generation
- **TypeScript** - Type safety
- **Content Collections** - Správa obsahu
- **GitHub Pages** – Automatické nasazení z `main` přes workflow `.github/workflows/deploy.yml`

## 📦 Build

Projekt generuje statický HTML výstup do `dist/` složky.

```bash
npm run build
```

### GitHub Pages (repo `Sonyx9/zahranicni_apartmany`)

- Produkční URL: `https://zahranicniapartmany.cz/`
- Push do `main` automaticky spustí build + deploy na GitHub Pages.
- Workflow před buildem aktualizuje feedy (`fetch-featured`, `fetch-offers`), takže se nasadí i nové nemovitosti.

---

## 🚀 Nasazení na GitHub Pages

Používáme pouze GitHub Pages (bez FTP).

### Jednorázové nastavení repozitáře

1. V GitHub repozitáři otevřete **Settings → Pages**.
2. V části **Build and deployment** nastavte **Source = GitHub Actions**.
3. Workflow v `.github/workflows/deploy.yml` se postará o build i deploy.

### Jak nasadit změny

1. Commit + push do větve `main`.
2. GitHub Actions automaticky:
   - stáhne aktuální feedy (`fetch-featured`, `fetch-offers`),
   - zbuildí web,
   - nasadí na GitHub Pages.

### Lokální test před push

```bash
npm run build:pages
```

Tento příkaz udělá totéž co CI build (feedy + build).

## 🔄 Příprava na backend

Data layer je připraven tak, že při napojení backendu stačí:
1. Upravit `src/lib/data.ts`
2. Nahradit importy JSON fetch voláním
3. Žádné další změny v UI, routách nebo komponentách

## 📝 Content Collections

### Destinace
Markdown soubory v `src/content/destinations/` s frontmatter:
- `title` - Název destinace
- `countrySlug` - Slug země
- `summary` - Shrnutí (50-220 znaků)
- `heroImage` - Cesta k hero obrázku
- `faq` - Pole FAQ (4-10 otázek)

### Průvodce
Markdown soubory v `src/content/guides/` s frontmatter:
- `title` - Název průvodce
- `description` - Popis (50-200 znaků)
- `published` - Datum publikace
- `topic` - Téma (např. "koupě", "daně")

## 🎯 SEO

- ✅ Canonical URLs na všech stránkách
- ✅ Sitemap.xml (dynamicky generovaná)
- ✅ Robots.txt
- ✅ Open Graph meta tagy
- ✅ JSON-LD strukturovaná data (Organization, WebSite, FAQPage, ItemList, Article, Place, BreadcrumbList)

## ♿ WCAG

- ✅ Kontrast barev (minimálně 4.5:1)
- ✅ Focus states na všech interaktivních prvcích
- ✅ Klávesová navigace
- ✅ Sémantické HTML elementy
- ✅ Alt texty na obrázcích
- ✅ ARIA labely kde je potřeba

## 📚 Dokumentace

- `PROJECT_STRUCTURE.md` - Detailní struktura projektu
- `IMPLEMENTATION_STATUS.md` - Status implementace
- `CHECKLIST.md` - QA checklist
- `NEXT_STEPS.md` - Další kroky
- `DEPLOYMENT.md` - Instrukce pro nasazení

## ⚡ Výkon (Lighthouse)

- **Fonty**: načítání Google Fonts asynchronně (`media="print"` + `onload`), `display=swap`, preload – méně blokování vykreslování.
- **Cache**: `public/_headers` (Netlify), `public/.htaccess` (Apache), `vercel.json` (Vercel) – dlouhá platnost cache pro assety a obrázky.
- **Obrázky**: u všech `<img>` jsou `width`/`height`, `decoding="async"`, `loading="lazy"` (kromě LCP); logo a hero mají `fetchpriority="high"` tam, kde je to vhodné – menší CLS a rychlejší LCP.

Pro další zlepšení: zmenšit soubory v `public/images/hero/*.webp` (např. mobilní rozlišení nebo WebP s menší kvalitou) a nasadit po změně cache hlaviček.

## 📄 Licence

Tento projekt je soukromý.