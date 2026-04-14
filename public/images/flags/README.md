# Vlajky destinací

Do této složky patří obrázky vlajek pro sekci „Vyberte si destinaci“.

## Automatické přejmenování

Máte-li soubory s názvy obsahujícími stát (např. `Itálie.webp`, `Španělsko.png`, `vlajka_bulharsko.webp`), přejmenujte je na jednotný formát spuštěním z **kořene projektu**:

```bash
npm run rename-flags
```

Skript v `scripts/rename-flags.mjs` přejmenuje soubory podle názvu státu na `vlajka-{slug}.webp` (příponu zachová). Podporované názvy: Albánie, Bulharsko, Kypr/Cyprus, Chorvatsko, Itálie, Španělsko, Řecko, Černá hora/Montenegro, Thajsko, Turecko, Kapverdy, Egypt.

Po běhu skriptu: pokud nějaký soubor zůstal s příponou `.png`, v `src/data/countries.json` u dané země změňte v poli `flag` příponu na `.png`.

## Cílové názvy (pro ruční přejmenování)

| Soubor | Destinace |
|--------|-----------|
| `vlajka-albanie.webp` | Albánie |
| `vlajka-bulharsko.webp` | Bulharsko |
| `vlajka-chorvatsko.webp` | Chorvatsko |
| `vlajka-cerna-hora.webp` | Černá hora |
| `vlajka-cyprus.webp` | Kypr |
| `vlajka-egypt.webp` | Egypt |
| `vlajka-italie.webp` | Itálie |
| `vlajka-kapverdy.webp` | Kapverdy |
| `vlajka-recko.webp` | Řecko |
| `vlajka-spanelsko.webp` | Španělsko |
| `vlajka-thajsko.webp` | Thajsko |
| `vlajka-turecko.webp` | Turecko |
