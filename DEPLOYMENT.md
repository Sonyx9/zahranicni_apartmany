# Nasazení na GitHub Pages

Projekt je nasazený přes **GitHub Pages** (bez FTP).

---

## 1. Build s aktuálními daty z feedů

Před nasazením je vhodné obnovit data z feedů (nabídky + karusel „Nepropásněte“ pro Kypr), aby na webu byly aktuální nemovitosti.

**Jedním příkazem (doporučeno):**

```bash
npm run build:pages
```

Toto postupně:
1. stáhne z feedu Kypru 3 nemovitosti do karuselu a zapíše je do `src/data/featured-property.json`,
2. stáhne výpis nabídek do `src/data/offers-feed.json` a `offers-luxury.json`,
3. spustí `npm run build` a vygeneruje `dist/`.

**Pouze karusel (Kypr), bez výpisu nabídek:**

```bash
npm run fetch-featured
npm run build
```

**Pouze build bez aktualizace dat:**

```bash
npm run build
```

---

## 2. Automatický deploy přes GitHub Actions

1. Pushněte změny do větve `main`.
2. Workflow `.github/workflows/deploy.yml` automaticky:
   - stáhne feedy (`fetch-featured`, `fetch-offers`),
   - spustí build,
   - nasadí `dist/` na GitHub Pages.
3. Výsledná adresa: `https://sonyx9.github.io/zahranicni_apartmany/`.

---

## 3. Volitelně: build pro konkrétní doménu

Chcete-li mít v buildu správnou URL webu (sitemap, OG tagy, canonical):

```bash
SITE=https://zahranicniapartmany.cz BASE= npm run build
```

Pro web v podadresáři:

```bash
SITE=https://zahranicniapartmany.cz BASE=/cesta npm run build
```

Stejné proměnné můžete nastavit před `npm run build:pages`:

```bash
SITE=https://zahranicniapartmany.cz BASE= npm run build:pages
```

---

## 4. Jak často aktualizovat

- **Karusel „Nepropásněte“ (Kypr)** – aktualizuje se při každém deploy běhu.
- **Výpis nabídek** – aktualizuje se při každém deploy běhu.

---

## 5. Jednorázové nastavení v GitHubu

1. Otevřete repozitář: `Sonyx9/zahranicni_apartmany`.
2. V **Settings → Pages** nastavte **Source = GitHub Actions**.
3. Volitelně ve **Settings → Variables** můžete nastavit:
   - `SITE` (např. `https://sonyx9.github.io`)
   - `BASE` (pro tento projekt `/zahranicni_apartmany`)

Pak už stačí pouze push do `main`.
