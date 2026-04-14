# Plán implementace nemovitostí z XML feedu

## Cíl

- Tahat nemovitosti z XML feedu **Softreal** (Moje nemovitost u moře).
- Zobrazovat je na homepage v sekci **Vybrané nemovitosti**.
- Ke každému prokliku na nemovitost přidat **affiliate kód** `aff=l4todz91fb`.
- Automatická denní aktualizace v **1:00**; při prázdném/chybném feedu ponechat stávající data.

---

## 1. Zdroj dat

- **URL feedu:**  
  `https://s1.system.softreal.cz/mojenemovitostumore/softreal/publicExportFacebook/index/1002/`
- Formát: XML, položky v `<item>`:
  - `<id>`, `<title>`, `<description>`, `<link>`, `<price>` (např. `755000.00 EUR`), `<image_link>`, `<country>` (např. `CZ`), `<availability>`, `<condition>`, `<brand>`.
- **Poznámka:** Načtení feedu může trvat i 30–60 s; skript používá timeout 90 s.

---

## 2. Pravidla zpracování

| Pravidlo | Popis |
|----------|--------|
| **Cena** | Zobrazovat jen nemovitosti **s cenou** v rozsahu **50 000–130 000 EUR** (dolní i horní strop). |
| **Typ** | Jen **apartmány u moře** (v názvu nebo popisu: apartmán/byt/studio + moře/pláž/pobřeží nebo „X m od moře“). **Vyloučeny** domy a vily (dům, vila, villa, house). |
| **Affiliate** | Ke každému URL nemovitosti (odkaz na detail) přidat parametr `aff=l4todz91fb`. Pokud URL už obsahuje query string, použít `&aff=l4todz91fb`, jinak `?aff=l4todz91fb`. |
| **Fallback** | Pokud žádné nové nemovitosti (feed prázdný, chyba, nebo vše pod 50k EUR), **nezapisovat** nový soubor – zůstanou původní data v `offers-global.json` (nebo v novém souboru pro feed). |

---

## 3. Architektura řešení

### 3.1 Kde data skladovat

- **Možnost A:** Přepsat/aktualizovat `src/data/offers-global.json` (build pak čte přímo tento soubor).
- **Možnost B:** Nový soubor např. `src/data/offers-feed.json` generovaný skriptem; build čte z něj a při chybě/prázdnu fallback na `offers-global.json`.

Doporučení: **Možnost B** – oddělit „feed“ od záložních/placeholder dat. Při buildu na CI vždy běží jen `astro build`, bez fetchu; fetch běží v samostatném kroku (cron / scheduled workflow).

### 3.2 Skript pro fetch a zápis

- **Úložiště:** např. `scripts/fetch-offers-feed.mjs` (nebo `.ts` s `ts-node`).
- **Kroky:**
  1. Stáhnout XML z výše uvedené URL.
  2. Parsovat XML (v Node bez závislosti na prohlížeči: např. `fast-xml-parser` nebo vestavěný import např. z jiného modulu).
  3. Filtrovat: pouze položky s cenou ≥ 50 000 EUR (jednotka může být v XML uvedena; pokud jen číslo, předpokládat EUR).
  4. Ke každému odkazu na detail přidat `aff=l4todz91fb`.
  5. Mapovat na strukturu očekávanou v `FeaturedOffers` (id, title, country, price, image, url).
  6. Pokud je výsledný seznam neprázdný: zapsat do `src/data/offers-feed.json`. Pokud prázdný nebo chyba: **nic nezápisovat** (zůstanou stará data).

### 3.3 Build (Astro)

- V `index.astro` (nebo v `data.ts`) načíst:
  - pokud existuje `offers-feed.json` a má délku > 0 → použít ho pro sekci „Vybrané nemovitosti“;
  - jinak použít `offers-global.json`.
- `FeaturedOffers.astro` už očekává pole objektů `{ id, title, country, price?, image, url }` – stačí zajistit, že výstup skriptu této struktuře vyhovuje (včetně volitelného `price`).

### 3.4 Affiliate kód

- Přidávat **vždy** v místě, kde se sestavuje `url` pro kartu nemovitosti (ve skriptu při generování `offers-feed.json`).
- Pomocná funkce typu:  
  `appendAffiliate(url, 'l4todz91fb')` → pokud `url` obsahuje `?`, přidat `&aff=l4todz91fb`, jinak `?aff=l4todz91fb`.

---

## 4. Automatická aktualizace každý den v 1:00

- **GitHub Actions:** scheduled workflow `schedule: cron('0 1 * * *')` (1:00 UTC; pro 2:00 SELČ použít např. `0 0 * * *` v zimě a `0 23 * * *` den předtím v létě, nebo nechat 1:00 UTC a uživateli říct).
- Workflow:
  1. Checkout repo.
  2. Setup Node.
  3. `npm ci`.
  4. Spustit `node scripts/fetch-offers-feed.mjs` (nebo `npm run fetch-offers`).
  5. Pokud se `offers-feed.json` změnil, commit + push do stejné větve (nebo vytvořit commit a push, aby další build na `main` už měl nová data).  
  Případně: workflow může přímo spustit build a nasadit (např. GitHub Pages), aby deploy byl hned po aktualizaci dat.

Doporučení:  
- V jednom workflow nejdřív **jen** fetch a commit+push změn v `offers-feed.json`.  
- Klasický deploy na push do `main` (včetně tohoto commitu) pak sám zbuildí a nasadí stránky.

---

## 5. Kroky implementace (checklist)

1. **Získat vzorový XML**  
   - Ručně stáhnout feed z uvedené URL (nebo přidat do skriptu logování prvního úspěšného response).  
   - Zapsat skutečné názvy tagů/atributů pro: odkaz na detail, cena, obrázek, název, lokalita/země.

2. **Implementovat skript**  
   - `scripts/fetch-offers-feed.mjs` (nebo `.ts`): fetch, parse, filtr ≥ 50k EUR, append `aff=l4todz91fb`, mapování do formátu pro `FeaturedOffers`, zápis `offers-feed.json` jen při neprázdném výsledku.

3. **Napojit build na data**  
   - V `src/lib/data.ts` (nebo přímo v `index.astro`): načíst `offers-feed.json` s fallbackem na `offers-global.json`.  
   - Homepage předat tato data do `FeaturedOffers`.

4. **Přidat affiliate kód všude**  
   - Zajistit, že v rámci feedu se affiliate přidává ve skriptu; u odkazů z `offers-global.json` (placeholder) lze buď přidat `aff=l4todz91fb` už v JSON, nebo v komponentě při renderu (doporučeno jednotně ve skriptu pro feed a v komponentě pro fallback).

5. **Scheduled workflow**  
   - V `.github/workflows/` nový soubor např. `fetch-offers.yml`:  
     - `schedule: cron('0 1 * * *')`  
     - kroky: checkout, npm ci, run fetch skript, commit & push pokud se změnil `offers-feed.json`.

6. **Dokumentace a údržba**  
   - Do README nebo do tohoto dokumentu doplnit: jak spustit fetch lokálně (`npm run fetch-offers`), že 1:00 je UTC, a že nemovitosti bez ceny nebo pod 50k EUR se nezobrazují.

---

## 6. Shrnutí

- **Feed:** Softreal XML z dané URL.  
- **Filtry:** pouze s cenou ≥ 50 000 EUR.  
- **Affiliate:** `aff=l4todz91fb` u každého prokliku na nemovitost.  
- **Aktualizace:** denně v 1:00 (cron); při prázdném/chybném feedu zůstanou původní data.  
- **Zobrazení:** homepage, sekce „Vybrané nemovitosti“, data z `offers-feed.json` s fallbackem na `offers-global.json`.

Po dokončení těchto kroků bude implementace nemovitostí z XML feedu včetně affiliate kódu a denní aktualizace hotová.
