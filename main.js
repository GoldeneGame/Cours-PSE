// Cours PSE — processus principal Electron
// Lit un dossier Google Drive partagé par lien (« Tous les utilisateurs disposant du lien »),
// sans compte, sans Google Cloud et sans logiciel Google sur le poste.
// PDF affichés directement ; Word / PowerPoint / Excel convertis en PDF via Microsoft Office.

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const crypto = require('crypto');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const jeuxDonnees = require('./jeux-donnees');

const DATA = app.getPath('userData');
const FILES = {
  settings: path.join(DATA, 'settings.json'),
  script: path.join(DATA, 'convert.ps1'),
};
const CACHE = path.join(DATA, 'cache');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

// Dossier des cours utilisé tant qu'aucun autre n'a été choisi.
const DEFAULT_ROOT = { id: '1VnqrIfWtTyR_XuuZa-oUs6Z9ZQWz9BK1', name: 'Cours PSE' };

let win = null;

// ---------------------------------------------------------------- réglages

function readJSON(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
const getSettings = () => readJSON(FILES.settings, {});
const setSettings = (patch) => writeJSON(FILES.settings, { ...getSettings(), ...patch });
const exists = (p) => fsp.access(p).then(() => true, () => false);

// ---------------------------------------------------------------- Google Drive public

class NetError extends Error {}

async function get(url) {
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9' }, redirect: 'follow' });
  } catch {
    throw new NetError('Pas de connexion Internet (ou Google Drive injoignable).');
  }
  return res;
}

function parseFolderId(text) {
  const s = String(text || '').trim();
  const m = s.match(/folders\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/) || s.match(/^([\w-]{10,})$/);
  return m ? m[1] : null;
}

function decode(s) {
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

const collator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

const MIME_EXT = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'video/mp4': 'mp4',
};

// Liste un dossier via la vue publique intégrable de Google Drive.
async function listFolder(id) {
  const res = await get(`https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(id)}`);
  const html = res.ok ? await res.text() : '';
  if (!res.ok || !/flip-entries|flip-entry/.test(html)) {
    if (res.ok && /accounts\.google\.com|ServiceLogin/.test(res.url + html.slice(0, 3000))) {
      throw new Error('Ce dossier n’est pas partagé publiquement. Dans Google Drive : clic droit sur le dossier → Partager → Accès général : « Tous les utilisateurs disposant du lien ».');
    }
    throw new Error('Dossier introuvable, ou pas partagé avec « Tous les utilisateurs disposant du lien ».');
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const name = titleMatch ? decode(titleMatch[1]) : 'Dossier';

  const items = [];
  for (const block of html.split(/<div class="flip-entry"/).slice(1)) {
    const fid = (block.match(/id="entry-([\w-]+)"/) || [])[1];
    if (!fid) continue;
    const href = decode((block.match(/<a href="([^"]+)"/) || [])[1] || '');
    const title = decode((block.match(/class="flip-entry-title">([^<]*)</) || [])[1] || '');
    const mime = decode((block.match(/\/type\/([^"?]+)/) || [])[1] || '');
    const modified = decode((block.match(/flip-entry-last-modified"><div>([^<]*)</) || [])[1] || '');
    const dir = /google-apps\.folder/.test(mime) || /\/folders\//.test(href);
    const ext = dir ? '' : (path.extname(title).slice(1).toLowerCase() || MIME_EXT[mime] || '');
    items.push({ id: fid, name: title || '(sans nom)', dir, mime, ext, modified, href });
  }
  items.sort((a, b) => (a.dir !== b.dir ? (a.dir ? -1 : 1) : collator.compare(a.name, b.name)));
  return { name, items };
}

async function folderFromLink(text) {
  const id = parseFolderId(text);
  if (!id) throw new Error('Lien non reconnu. Colle le lien du dossier, du type https://drive.google.com/drive/folders/…');
  const { name } = await listFolder(id);
  return { id, name };
}

// Index de tout le dossier des cours (sous-dossiers compris) pour la recherche.
let index = null;

async function buildIndex(force) {
  const root = getSettings().root;
  if (!root) return [];
  if (!force && index && index.root === root.id && Date.now() - index.at < 10 * 60 * 1000) return index.items;
  const items = [];
  const seen = new Set([root.id]);
  let level = [{ id: root.id, path: [] }];
  while (level.length) {
    const next = [];
    for (let i = 0; i < level.length; i += 4) {
      const chunk = level.slice(i, i + 4);
      const results = await Promise.all(chunk.map((d) => listFolder(d.id).catch(() => ({ items: [] }))));
      results.forEach(({ items: children }, k) => {
        const parent = chunk[k];
        for (const c of children) {
          if (c.dir) {
            if (!seen.has(c.id)) { seen.add(c.id); next.push({ id: c.id, path: [...parent.path, { id: c.id, name: c.name }] }); }
          } else {
            items.push({ ...c, path: parent.path });
          }
        }
      });
    }
    level = next;
  }
  items.sort((a, b) => collator.compare(a.name, b.name));
  index = { root: root.id, at: Date.now(), items };
  return items;
}

// ---------------------------------------------------------------- ouverture d'un fichier

const OFFICE = {
  word: ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf'],
  powerpoint: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'pot', 'potx', 'odp'],
  excel: ['xls', 'xlsx', 'xlsm', 'ods', 'csv'],
};
const GOOGLE_EXPORT = {
  'application/vnd.google-apps.document': (id) => `https://docs.google.com/document/d/${id}/export?format=pdf`,
  'application/vnd.google-apps.presentation': (id) => `https://docs.google.com/presentation/d/${id}/export/pdf`,
  'application/vnd.google-apps.spreadsheet': (id) => `https://docs.google.com/spreadsheets/d/${id}/export?format=pdf`,
  'application/vnd.google-apps.drawing': (id) => `https://docs.google.com/drawings/d/${id}/export/pdf`,
};
const IMAGES = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];
const VIDEOS = ['mp4', 'webm', 'mov', 'm4v', 'mp3', 'wav', 'ogg', 'm4a'];
const LABEL = { word: 'Word', powerpoint: 'PowerPoint', excel: 'Excel' };
const officeAppFor = (ext) => Object.keys(OFFICE).find((k) => OFFICE[k].includes(ext)) || null;

async function fetchFile(url) {
  const res = await get(url);
  if (!res.ok) {
    throw new Error(res.status === 404
      ? 'Fichier introuvable sur le Drive (supprimé ou déplacé ?).'
      : `Téléchargement refusé par Google (${res.status}). Le fichier est-il bien partagé par lien ?`);
  }
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  if (type.startsWith('text/html')) {
    throw new Error('Google n’a pas fourni le fichier : vérifie qu’il est partagé avec « Tous les utilisateurs disposant du lien ».');
  }
  return buf;
}

// Cache : CACHE/<id du fichier>/<empreinte du contenu>/<vrai nom du fichier>
// (le vrai nom s'affiche ainsi dans le lecteur PDF et dans Word / PowerPoint).
async function cachedFor(id) {
  const dir = path.join(CACHE, id);
  const out = [];
  try {
    for (const h of await fsp.readdir(dir)) {
      for (const f of await fsp.readdir(path.join(dir, h))) {
        if (!f.includes('.part') && !f.startsWith('src.')) out.push(path.join(dir, h, f));
      }
    }
  } catch {}
  return out;
}

function safeName(name) {
  const s = String(name || 'cours').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').replace(/[. ]+$/, '').trim();
  return (s || 'cours').slice(0, 120);
}

async function dirSize(dir) {
  let total = 0;
  try {
    for (const e of await fsp.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      total += e.isDirectory() ? await dirSize(p) : (await fsp.stat(p)).size;
    }
  } catch {}
  return total;
}

function display(kind, file, extra) {
  return { kind, display: pathToFileURL(file).href, ...extra };
}

async function openFile(f, status) {
  await fsp.mkdir(CACHE, { recursive: true });
  const id = String(f.id);
  if (!/^[\w-]+$/.test(id)) throw new Error('Identifiant de fichier invalide.');
  const google = GOOGLE_EXPORT[f.mime];
  const ext = google ? 'pdf' : (f.ext || 'bin');
  const officeApp = google ? null : officeAppFor(ext);
  const base = { id, name: f.name, href: f.href, officeApp };

  // 1. Téléchargement (à chaque ouverture : on récupère toujours la dernière version).
  let buf;
  try {
    status('Téléchargement depuis Google Drive…');
    buf = await fetchFile(google ? google(id) : `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`);
  } catch (e) {
    // Hors ligne : on affiche la dernière version gardée en cache.
    if (e instanceof NetError) {
      const old = await cachedFor(id);
      const pdf = old.find((p) => p.toLowerCase().endsWith('.pdf'));
      const orig = old.find((p) => p.toLowerCase().endsWith('.' + ext));
      if (pdf) return { ...base, ...display('pdf', pdf, { local: orig, offline: true }) };
      if (orig) return { ...base, ...display(IMAGES.includes(ext) ? 'image' : VIDEOS.includes(ext) ? 'video' : 'other', orig, { local: orig, offline: true }) };
    }
    throw e;
  }

  // 2. Mise en cache, indexée par le contenu : une conversion ne se refait que si le fichier a changé.
  const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  const idDir = path.join(CACHE, id);
  const dir = path.join(idDir, hash);
  try {
    for (const h of await fsp.readdir(idDir)) if (h !== hash) await fsp.rm(path.join(idDir, h), { recursive: true, force: true });
  } catch {}
  await fsp.mkdir(dir, { recursive: true });
  const name = safeName(f.name);
  const stem = name.toLowerCase().endsWith('.' + ext) ? name.slice(0, -(ext.length + 1)) : name;
  const original = path.join(dir, `${stem}.${ext}`);
  if (!(await exists(original))) await fsp.writeFile(original, buf);
  base.local = original;

  if (ext === 'pdf') return { ...base, ...display('pdf', original) };
  if (IMAGES.includes(ext)) return { ...base, ...display('image', original) };
  if (VIDEOS.includes(ext)) return { ...base, ...display('video', original) };
  if (!officeApp) return { ...base, kind: 'other' };

  const pdf = path.join(dir, `${stem}.pdf`);
  if (!(await exists(pdf))) {
    status(`Conversion avec ${LABEL[officeApp]}…`);
    // Conversion depuis une copie au nom simple (évite tout souci d'accents avec Office).
    const src = path.join(dir, `src.${ext}`);
    const out = path.join(dir, 'src.out.pdf');
    await fsp.copyFile(original, src);
    try {
      await convert(officeApp, src, out);
      await fsp.rename(out, pdf);
    } finally {
      await fsp.rm(src, { force: true });
    }
  }
  return { ...base, ...display('pdf', pdf) };
}

// ---------------------------------------------------------------- conversion Office -> PDF

const CONVERT_PS1 = String.raw`param([string]$Kind, [string]$In, [string]$Out)
$ErrorActionPreference = 'Stop'
try {
  switch ($Kind) {
    'word' {
      $app = New-Object -ComObject Word.Application
      $app.Visible = $false
      $app.DisplayAlerts = 0
      try {
        $doc = $app.Documents.Open($In, $false, $true, $false)
        $doc.ExportAsFixedFormat($Out, 17)
        $doc.Close(0)
      } finally { if ($app.Documents.Count -eq 0) { $app.Quit() } }
    }
    'powerpoint' {
      $app = New-Object -ComObject PowerPoint.Application
      try {
        $pres = $app.Presentations.Open($In, -1, 0, 0)
        $pres.SaveAs($Out, 32)
        $pres.Close()
      } finally { if ($app.Presentations.Count -eq 0) { $app.Quit() } }
    }
    'excel' {
      $app = New-Object -ComObject Excel.Application
      $app.Visible = $false
      $app.DisplayAlerts = $false
      try {
        $wb = $app.Workbooks.Open($In, 0, $true)
        $wb.ExportAsFixedFormat(0, $Out)
        $wb.Close($false)
      } finally { if ($app.Workbooks.Count -eq 0) { $app.Quit() } }
    }
    default { throw "Type inconnu : $Kind" }
  }
  exit 0
} catch {
  [Console]::Error.WriteLine($_.Exception.Message)
  exit 1
}
`;

let convertQueue = Promise.resolve();

function convert(kind, input, output) {
  const run = () => new Promise((resolve, reject) => {
    const tmp = output + '.part.pdf';
    const ps = spawn('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-File', FILES.script, kind, input, tmp,
    ], { windowsHide: true });
    let err = '';
    ps.stderr.on('data', (d) => { err += d; });
    const timer = setTimeout(() => { ps.kill(); reject(new Error('La conversion a pris trop de temps.')); }, 3 * 60 * 1000);
    ps.on('error', (e) => { clearTimeout(timer); reject(e); });
    ps.on('close', async (code) => {
      clearTimeout(timer);
      if (code === 0 && (await exists(tmp))) {
        await fsp.rename(tmp, output);
        resolve();
      } else {
        reject(new Error(`Conversion impossible avec ${LABEL[kind]} (Office est-il installé ?). ${err.trim()}`.trim()));
      }
    });
  });
  const p = convertQueue.then(run, run);
  convertQueue = p.catch(() => {});
  return p;
}

// ---------------------------------------------------------------- IPC

function handle(name, fn) {
  ipcMain.handle(name, async (event, ...args) => {
    try {
      return { ok: true, data: await fn(event, ...args) };
    } catch (e) {
      return { ok: false, error: e.message || String(e), offline: e instanceof NetError };
    }
  });
}

handle('state', async () => ({ root: getSettings().root || DEFAULT_ROOT }));
handle('set-root', async (_e, link) => {
  const root = await folderFromLink(link);
  setSettings({ root });
  index = null;
  return root;
});
handle('list', async (_e, id) => (await listFolder(id)).items);
handle('index', (_e, force) => buildIndex(force));
handle('open-file', (e, f) => openFile(f, (text) => e.sender.send('status', { id: f.id, text })));
handle('open-local', async (_e, p) => {
  const abs = path.resolve(String(p || ''));
  if (!abs.startsWith(path.resolve(CACHE) + path.sep)) throw new Error('Fichier non disponible.');
  const err = await shell.openPath(abs);
  if (err) throw new Error(err);
});
handle('open-external', async (_e, url) => {
  if (!/^https:\/\//.test(url)) throw new Error('Lien refusé.');
  await shell.openExternal(url);
});
handle('clear-cache', async () => { await fsp.rm(CACHE, { recursive: true, force: true }); });
handle('cache-size', async () => {
  return dirSize(CACHE);
});

// Classes, mot de passe enseignant et résultats de la partie « Modules ».
jeuxDonnees.installer();

// ---------------------------------------------------------------- fenêtre

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Cours PSE',
    backgroundColor: '#f6f3ee',
    autoHideMenuBar: true,
    // Barre de titre intégrée à l'en-tête bleu marine (boutons Windows conservés).
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#1d2b4f', symbolColor: '#ffffff', height: 64 },
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      plugins: true,
    },
  });
  win.removeMenu();
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); if (/^https:\/\//.test(url)) shell.openExternal(url); }
  });
  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') win.webContents.toggleDevTools();
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(FILES.script, CONVERT_PS1, 'utf8');
    createWindow();
  });
  app.on('window-all-closed', () => app.quit());
}
