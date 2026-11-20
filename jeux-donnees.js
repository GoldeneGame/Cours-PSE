// Cours PSE — données de la partie « Modules » (comme le logiciel « PSE en jeux »)
//
// Dossier de données « Donnees PSE », à côté du logiciel (ou celui écrit dans
// « dossier-donnees.txt » à côté du logiciel, par exemple un dossier partagé du lycée) :
//   classes.json        les classes et leurs modules accessibles
//   resultats\<poste>.json   les résultats des jeux, un fichier par ordinateur
// S'il n'est pas possible d'écrire à côté du logiciel, le dossier est créé dans %APPDATA%\Cours PSE.

'use strict';
const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const os = require('os');
const crypto = require('crypto');

let DOSSIER = null;
const JETONS = new Set(); // sessions enseignant ouvertes (perdues à la fermeture du logiciel)

function dossierLogiciel() {
  if (process.env.PORTABLE_EXECUTABLE_DIR) return process.env.PORTABLE_EXECUTABLE_DIR; // .exe portable
  if (app.isPackaged) return path.dirname(process.execPath);
  return null; // développement (npm start)
}

function inscriptible(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const t = path.join(dir, `.test-${process.pid}`);
    fs.writeFileSync(t, 'ok');
    fs.unlinkSync(t);
    return true;
  } catch { return false; }
}

function dossier() {
  if (DOSSIER) return DOSSIER;
  const base = dossierLogiciel();
  const candidats = [];
  if (base) {
    try {
      const txt = fs.readFileSync(path.join(base, 'dossier-donnees.txt'), 'utf8').split(/\r?\n/).map((l) => l.trim()).find(Boolean);
      if (txt) candidats.push(path.resolve(base, txt));
    } catch {}
    candidats.push(path.join(base, 'Donnees PSE'));
  }
  candidats.push(path.join(app.getPath('userData'), 'Donnees PSE'));
  DOSSIER = candidats.find(inscriptible) || candidats[candidats.length - 1];
  fs.mkdirSync(path.join(DOSSIER, 'resultats'), { recursive: true });
  return DOSSIER;
}

const fichier = (nom) => path.join(dossier(), nom);

async function lire(file, defaut) {
  try { return JSON.parse(await fsp.readFile(file, 'utf8')); } catch { return defaut; }
}
async function ecrire(file, valeur) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(valeur, null, 1), 'utf8');
  await fsp.rename(tmp, file);
}

const poste = () => String(os.hostname() || 'poste').replace(/[^\w.-]/g, '_').slice(0, 60);
const fichierResultats = () => path.join(dossier(), 'resultats', `${poste()}.json`);

async function tousResultats() {
  const dir = path.join(dossier(), 'resultats');
  let noms = [];
  try { noms = (await fsp.readdir(dir)).filter((n) => n.endsWith('.json')); } catch {}
  const out = [];
  for (const n of noms) {
    const l = await lire(path.join(dir, n), []);
    if (Array.isArray(l)) out.push(...l);
  }
  return out;
}

// ---------------------------------------------------------------- session enseignant

function nouveauJeton() {
  const j = crypto.randomBytes(24).toString('hex');
  JETONS.add(j);
  return j;
}
function verifierJeton(j) {
  if (!j || !JETONS.has(j)) throw Object.assign(new Error('Session enseignant expirée : reconnectez-vous.'), { expire: true });
}

// ---------------------------------------------------------------- actions

const ACTIONS = {
  async etat() {
    return { dossier: dossier() };
  },

  // Plus de mot de passe enseignant : l'accès à l'espace enseignant est libre.
  async prof_entrer() {
    return { jeton: nouveauJeton() };
  },

  async prof_deconnexion({ jeton }) {
    JETONS.delete(jeton);
    return {};
  },

  // Les classes sont lisibles par tous (l'élève choisit la sienne), modifiables par l'enseignant.
  async classes_liste() {
    const c = await lire(fichier('classes.json'), []);
    return { classes: Array.isArray(c) ? c : [] };
  },

  async classes_enregistrer({ jeton, classes }) {
    verifierJeton(jeton);
    if (!Array.isArray(classes)) throw new Error('Liste de classes invalide.');
    const propres = classes
      .filter((c) => c && typeof c.nom === 'string' && c.nom.trim())
      .map((c) => ({ nom: c.nom.trim().slice(0, 40), ...(c.acces && typeof c.acces === 'object' ? { acces: c.acces } : {}) }));
    await ecrire(fichier('classes.json'), propres);
    return {};
  },

  async resultat_ajout({ ligne }) {
    if (!ligne || typeof ligne !== 'object') throw new Error('Résultat invalide.');
    const f = fichierResultats();
    const l = await lire(f, []);
    const liste = Array.isArray(l) ? l : [];
    liste.push({ ...ligne, date: new Date().toISOString(), poste: poste() });
    await ecrire(f, liste);
    return {};
  },

  async resultats_liste({ jeton }) {
    verifierJeton(jeton);
    return { resultats: await tousResultats() };
  },

  // Après le renommage d'une classe, ses résultats suivent le nouveau nom.
  async resultats_renommer_classe({ jeton, ancienne, nouvelle }) {
    verifierJeton(jeton);
    const dir = path.join(dossier(), 'resultats');
    let n = 0;
    for (const nom of (await fsp.readdir(dir)).filter((x) => x.endsWith('.json'))) {
      const f = path.join(dir, nom);
      const l = await lire(f, null);
      if (!Array.isArray(l) || !l.some((r) => r.classe === ancienne)) continue;
      await ecrire(f, l.map((r) => (r.classe === ancienne ? { ...r, classe: nouvelle } : r)));
      n++;
    }
    return { fichiers: n };
  },

  async infos({ jeton }) {
    verifierJeton(jeton);
    const classes = (await ACTIONS.classes_liste()).classes;
    const res = await tousResultats();
    return { dossier: dossier(), classes: classes.length, resultats: res.length, poste: poste() };
  },
};

function installer() {
  ipcMain.handle('jeux-api', async (_e, req) => {
    const action = req && ACTIONS[req.action];
    if (!action) return { ok: false, erreur: 'Action inconnue.' };
    try {
      return { ok: true, ...(await action(req)) };
    } catch (e) {
      return { ok: false, erreur: e.message || String(e), expire: !!e.expire };
    }
  });
}

module.exports = { installer, dossier };
