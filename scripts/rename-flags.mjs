/**
 * Přejmenuje vlajky v public/images/flags/ na vlajka-{slug}.webp
 * Spuštění z kořene projektu: node scripts/rename-flags.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const flagsDir = path.join(__dirname, '..', 'public', 'images', 'flags');

// Část názvu (bez diakritiky) -> slug
const slugFromName = (norm) => {
  if (norm.includes('alban')) return 'albanie';
  if (norm.includes('bulhar')) return 'bulharsko';
  if (norm.includes('cypr') || norm.includes('kypr')) return 'cyprus';
  if (norm.includes('chorvat')) return 'chorvatsko';
  if (norm.includes('ital')) return 'italie';
  if (norm.includes('spanel')) return 'spanelsko';
  if (norm.includes('reck')) return 'recko';
  if (norm.includes('cerna') || norm.includes('montenegro')) return 'cerna-hora';
  if (norm.includes('thaj')) return 'thajsko';
  if (norm.includes('tureck')) return 'turecko';
  if (norm.includes('kapverd')) return 'kapverdy';
  if (norm.includes('egypt')) return 'egypt';
  return null;
};

const normalize = (s) => {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');
};

if (!fs.existsSync(flagsDir)) {
  console.error('Složka', flagsDir, 'neexistuje.');
  process.exit(1);
}

const files = fs.readdirSync(flagsDir);
const skip = ['README.md', '.gitkeep'];
let renamed = 0;

for (const name of files) {
  if (skip.includes(name)) continue;
  if (/^vlajka-[a-z-]+\.(webp|png|jpg)$/.test(name)) continue;

  const baseName = path.basename(name, path.extname(name));
  const ext = path.extname(name);
  const norm = normalize(baseName);
  const slug = slugFromName(norm);

  if (!slug) {
    console.log('Přeskočeno (neznámý stát):', name);
    continue;
  }

  const targetName = `vlajka-${slug}${ext}`;
  if (name === targetName) continue;

  const targetPath = path.join(flagsDir, targetName);
  if (fs.existsSync(targetPath)) {
    console.log('Cíl již existuje, přeskočeno:', name, '->', targetName);
    continue;
  }

  const srcPath = path.join(flagsDir, name);
  fs.renameSync(srcPath, targetPath);
  console.log('Přejmenováno:', name, '->', targetName);
  renamed++;
}

console.log('Hotovo. Přejmenováno souborů:', renamed);
