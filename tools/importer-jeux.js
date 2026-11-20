// Importe les modules et les jeux de « PSE en jeux » dans Cours PSE.
//
//   node tools/importer-jeux.js ["chemin/vers/pse-jeux.html"]
//
// Récupère, sans les modifier :
//   - le style de l'application        → renderer/modules/jeux.css
//   - les jeux (GAMES) et les programmes (TH, LEVELS) → renderer/modules/data.js
// Les évaluations (EVALS), la connexion et l'espace enseignant ne sont pas repris.
// Si le fichier source est introuvable, les fichiers déjà importés sont conservés.

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SOURCE = process.argv[2] || path.join(ROOT, '..', 'Logiciel PSE en jeux', 'pse-jeux.html');
const OUT = path.join(ROOT, 'renderer', 'modules');

function fail(msg) {
  console.error('✘ ' + msg);
  process.exit(1);
}

if (!fs.existsSync(SOURCE)) {
  const kept = fs.existsSync(path.join(OUT, 'data.js'));
  console.warn(`! Fichier introuvable : ${SOURCE}`);
  console.warn(kept ? '  Les modules déjà importés sont conservés.' : '  Aucun module importé pour le moment.');
  process.exit(kept ? 0 : 1);
}

const html = fs.readFileSync(SOURCE, 'utf8');

// Extrait le texte compris entre deux repères (début inclus, fin exclue).
function between(startMark, endMark, from = 0) {
  const a = html.indexOf(startMark, from);
  if (a < 0) fail(`repère « ${startMark} » introuvable dans pse-jeux.html`);
  const b = html.indexOf(endMark, a + startMark.length);
  if (b < 0) fail(`repère « ${endMark} » introuvable dans pse-jeux.html`);
  return { text: html.slice(a, b), end: b };
}
// Recule jusqu'au début du bloc de commentaire qui précède une position.
function commentStartBefore(pos) {
  const c = html.lastIndexOf('/* ====', pos);
  return c > 0 ? c : pos;
}

// 1. Style
const css = between('<style>', '</style>').text.slice('<style>'.length).trim();

// 2. Jeux : de « const GAMES = { » jusqu'au commentaire qui annonce les évaluations
const gStart = html.indexOf('const GAMES = {');
const eStart = html.indexOf('const EVALS = {');
if (gStart < 0 || eStart < 0) fail('bloc GAMES ou EVALS introuvable');
const games = html.slice(gStart, commentStartBefore(eStart)).trim();

// 3. Programmes : de « const TH = { » jusqu'au commentaire du moteur
const tStart = html.indexOf('const TH = {');
const mStart = html.indexOf('MOTEUR DE L', tStart);
if (tStart < 0 || mStart < 0) fail('bloc TH / LEVELS introuvable');
const levels = html.slice(tStart, commentStartBefore(mStart)).trim();

const data = `// Généré automatiquement par tools/importer-jeux.js — ne pas modifier à la main.
// Source : pse-jeux.html (${new Date().toLocaleString('fr-FR')})
'use strict';

${games}

${levels}
`;

// Vérification : le code doit s'exécuter et chaque module doit pointer vers des jeux existants.
let check;
try {
  check = vm.runInNewContext(data + '\n;({ GAMES, LEVELS });', {});
} catch (e) {
  fail('les données importées ne sont pas valides : ' + e.message);
}
const nbGames = Object.keys(check.GAMES).length;
let nbModules = 0;
const missing = new Set();
for (const l of check.LEVELS) for (const t of l.themes) for (const m of t.modules) {
  nbModules++;
  for (const g of m.g) if (!check.GAMES[g]) missing.add(g);
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'data.js'), data, 'utf8');
fs.writeFileSync(path.join(OUT, 'jeux.css'),
  `/* Style de « PSE en jeux », importé par tools/importer-jeux.js — ne pas modifier à la main. */\n${css}\n`, 'utf8');

console.log(`✔ ${check.LEVELS.length} niveaux, ${nbModules} modules, ${nbGames} jeux importés depuis ${path.basename(SOURCE)}`);
if (missing.size) console.warn(`! Jeux cités dans les programmes mais absents : ${[...missing].join(', ')}`);
