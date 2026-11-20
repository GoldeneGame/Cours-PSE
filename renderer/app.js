// Cours PSE — interface
'use strict';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---------------------------------------------------------------- icônes (traits, 24×24)

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/>',
  back: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><path d="M15.5 12h.01M18 13.5h.01"/>',
  expand: '<path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  open: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
};

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}
function fillIcons(root) {
  for (const n of root.querySelectorAll('i[data-i]')) n.innerHTML = svgIcon(n.dataset.i);
}
// Contenu d'un bouton : icône + libellé, centrés.
function setButton(btn, icon, label) {
  btn.replaceChildren();
  if (icon) {
    const i = el('i', 'i');
    i.innerHTML = svgIcon(icon);
    btn.append(i);
  }
  btn.append(el('span', null, label));
  return btn;
}
fillIcons(document);

const S = {
  root: null,      // { id, name }
  stack: [],       // dossier courant [{ id, name }]
  items: [],       // contenu du dossier courant
  loading: false,
  error: null,
  query: '',
  index: null,
  hits: [],
  current: null,   // cours affiché
  openSeq: 0,
  listSeq: 0,
};

// ---------------------------------------------------------------- types de fichiers

const TYPES = [
  { ext: ['pdf'], c: 'A', e: '📕', kind: 'PDF' },
  { ext: ['doc', 'docx', 'docm', 'dot', 'dotx', 'odt', 'rtf'], c: 'C', e: '📘', kind: 'Word' },
  { ext: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'pot', 'potx', 'odp'], c: 'D', e: '📙', kind: 'PowerPoint' },
  { ext: ['xls', 'xlsx', 'xlsm', 'ods', 'csv'], c: 'B', e: '📗', kind: 'Excel' },
  { ext: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'], c: 'E', e: '🖼️', kind: 'Image' },
  { ext: ['mp4', 'webm', 'mov', 'm4v'], c: 'E', e: '🎬', kind: 'Vidéo' },
  { ext: ['mp3', 'wav', 'ogg', 'm4a'], c: 'E', e: '🎧', kind: 'Audio' },
];
const GOOGLE_TYPES = {
  'application/vnd.google-apps.document': { c: 'C', e: '📄', kind: 'Google Docs' },
  'application/vnd.google-apps.presentation': { c: 'D', e: '📽️', kind: 'Google Slides' },
  'application/vnd.google-apps.spreadsheet': { c: 'B', e: '📊', kind: 'Google Sheets' },
  'application/vnd.google-apps.drawing': { c: 'E', e: '✏️', kind: 'Google Dessins' },
};

function typeOf(f) {
  return GOOGLE_TYPES[f.mime]
    || TYPES.find((t) => t.ext.includes(f.ext))
    || { c: 'G', e: '📎', kind: (f.ext || 'Fichier').toUpperCase() };
}

// Nom sans l'extension quand le type est déjà indiqué par la pastille.
function prettyName(f) {
  if (f.dir || !f.ext) return f.name;
  const suffix = '.' + f.ext;
  return f.name.toLowerCase().endsWith(suffix) ? f.name.slice(0, -suffix.length) : f.name;
}

// Tous les dossiers, présents et futurs, sont en rose pâle.
function folderColor() {
  return 'F';
}
function initial(name) {
  const m = name.normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]/i);
  return m ? m[0].toUpperCase() : '•';
}

function visual(f, i) {
  if (f.dir) {
    const v = el('span', 'let', initial(f.name));
    return { node: v, color: folderColor(f, i) };
  }
  const t = typeOf(f);
  return { node: el('span', 'ico', t.e), color: t.c };
}

// ---------------------------------------------------------------- utilitaires

function show(screen) {
  document.body.classList.toggle('welcome-mode', screen === 'welcome');
  $('screen-welcome').hidden = screen !== 'welcome';
  $('screen-setup').hidden = screen !== 'setup';
  $('screen-app').hidden = screen !== 'app';
  $('search-box').hidden = screen !== 'app';
  $('head-actions').hidden = screen !== 'app';
}

let toastTimer;
function toast(text, isError) {
  const t = $('toast');
  t.textContent = text;
  t.className = 'toast' + (isError ? ' err' : '');
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, isError ? 6000 : 2500);
}

async function call(fn, ...args) {
  const r = await window.pse[fn](...args);
  if (r.ok) return r.data;
  throw new Error(r.error);
}

const here = () => S.stack[S.stack.length - 1];
const folderUrl = (id) => `https://drive.google.com/drive/folders/${id}`;
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

// ---------------------------------------------------------------- démarrage

// Page d'accueil à chaque démarrage ; les cours se chargent pendant ce temps.
// « #cours » (retour depuis les modules) ouvre directement les cours.
let ready = null;
async function boot() {
  const direct = location.hash === '#cours';
  if (!direct) show('welcome');
  // Entrée lance aussi l'accès aux cours
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Enter' && !$('screen-welcome').hidden) { document.removeEventListener('keydown', onKey); letsGo(); }
  });
  ready = call('state').then((st) => { if (st.root) startBrowse(st.root, true); });
  await ready;
  if (direct) letsGo();
}

async function letsGo() {
  try { await ready; } catch {}
  if (S.root) show('app');
  else showSetup(false);
}

function showSetup(cancellable) {
  show('setup');
  $('link-error').hidden = true;
  $('link-input').value = '';
  $('btn-cancel-link').hidden = !cancellable;
  $('link-input').focus();
}

function startBrowse(root, inBackground) {
  if (!inBackground) show('app');
  S.root = root;
  S.index = null;
  S.query = '';
  $('search').value = '';
  $('root-name').textContent = 'Prévention Santé Environnement';
  let stack = [{ id: root.id, name: root.name }];
  try {
    const saved = JSON.parse(localStorage.getItem('pse.stack') || 'null');
    if (Array.isArray(saved) && saved[0] && saved[0].id === root.id) stack = saved;
  } catch {}
  S.stack = stack;
  goHome();
  loadFolder();
}

// ---------------------------------------------------------------- navigation

async function loadFolder() {
  const seq = ++S.listSeq;
  S.loading = true;
  S.error = null;
  render();
  try {
    const items = await call('list', here().id);
    if (seq !== S.listSeq) return;
    S.items = items;
    localStorage.setItem('pse.stack', JSON.stringify(S.stack));
  } catch (e) {
    if (seq !== S.listSeq) return;
    S.items = [];
    S.error = e.message;
  }
  S.loading = false;
  render();
}

function enterFolder(f) {
  if (S.query) clearSearch();
  S.stack.push({ id: f.id, name: f.name });
  goHome();
  loadFolder();
}

function goTo(i) {
  S.stack = S.stack.slice(0, i + 1);
  loadFolder();
}

function goHome() {
  $('reader').hidden = true;
  $('home').hidden = false;
  $('viewer-content').replaceChildren();
  S.openSeq++;
  S.current = null;
  render();
}

// Ce qu'on affiche : le dossier courant, ou les résultats de recherche.
function listing() {
  return S.query ? S.hits : S.items;
}

function render() {
  renderHome();
  if (!$('reader').hidden) renderSide();
}

function renderCrumbs() {
  const nav = $('crumbs');
  nav.replaceChildren();
  if (S.query) {
    const b = setButton(el('button'), 'back', 'Retour au dossier');
    b.onclick = clearSearch;
    nav.append(b);
    return;
  }
  S.stack.forEach((c, i) => {
    if (i) nav.append(el('span', 'sep', '›'));
    const last = i === S.stack.length - 1;
    const b = el('button', last ? 'here' : null, i === 0 ? '🏠 ' + c.name : c.name);
    b.title = c.name;
    if (!last) b.onclick = () => goTo(i);
    nav.append(b);
  });
}

function tile(f, i, withPath) {
  const v = visual(f, i);
  const b = el('button', `tile c-${v.color}` + (f.dir ? ' folder' : ''));
  b.title = f.name;
  b.append(v.node);
  const text = el('div', 't-text');
  text.append(el('div', 't-name', prettyName(f)));
  const meta = el('div', 't-meta');
  if (f.dir) {
    meta.append(el('span', null, 'Dossier'));
  } else {
    meta.append(el('span', 'tag', typeOf(f).kind));
    if (f.modified) meta.append(el('span', null, f.modified));
  }
  text.append(meta);
  if (withPath && f.path) text.append(el('div', 't-path', [S.root.name, ...f.path.map((p) => p.name)].join(' › ')));
  b.append(text);
  b.onclick = () => (f.dir ? enterFolder(f) : openFile(f));
  return b;
}

function emptyCard(emoji, title, text, actions) {
  const d = el('div', 'empty-card');
  d.append(el('div', 'big-emoji', emoji), el('h3', null, title));
  if (text) d.append(el('p', null, text));
  if (actions && actions.length) {
    const row = el('div', 'row');
    for (const [icon, label, cls, fn] of actions) {
      const b = setButton(el('button', 'btn ' + cls), icon, label);
      b.onclick = fn;
      row.append(b);
    }
    d.append(row);
  }
  return d;
}

function renderHome() {
  renderCrumbs();
  const tiles = $('tiles');
  const items = listing();
  tiles.replaceChildren();

  if (S.query) {
    $('home-title').textContent = `Recherche : « ${$('search').value.trim()} »`;
    $('home-count').textContent = S.index ? plural(items.length, 'cours trouvé', 'cours trouvés') : '';
  } else {
    $('home-title').textContent = here() ? here().name : '';
    const nd = S.items.filter((f) => f.dir).length;
    const nf = S.items.length - nd;
    const parts = [];
    if (nd) parts.push(plural(nd, 'dossier', 'dossiers'));
    if (nf) parts.push(plural(nf, 'cours', 'cours'));
    $('home-count').textContent = S.loading ? '' : parts.join(' · ');
  }

  if (S.loading || (S.query && !S.index)) {
    for (let i = 0; i < 6; i++) tiles.append(el('div', 'skeleton'));
    return;
  }
  if (S.error && !S.query) {
    tiles.append(emptyCard('😕', 'Impossible d’afficher ce dossier', S.error, [
      ['refresh', 'Réessayer', 'navy', loadFolder],
      ['link', 'Changer de dossier', 'soft', () => showSetup(true)],
    ]));
    return;
  }
  if (!items.length) {
    if (S.query) {
      tiles.append(emptyCard('🔍', 'Aucun cours trouvé', 'Essaie avec un autre mot (le titre du cours, un chapitre, un niveau…).', [
        ['back', 'Effacer la recherche', 'soft', clearSearch],
      ]));
    } else {
      tiles.append(emptyCard('🗂️', 'Ce dossier est encore vide',
        'Dépose tes cours (PDF, Word, PowerPoint…) dans ce dossier Google Drive, puis clique sur « Actualiser ».', [
          ['refresh', 'Actualiser', 'navy', refresh],
          ['external', 'Ouvrir dans Google Drive', 'soft', () => window.pse.openExternal(folderUrl(here().id))],
        ]));
    }
    return;
  }

  const folders = items.filter((f) => f.dir);
  const files = items.filter((f) => !f.dir);
  if (folders.length && files.length) tiles.append(el('div', 'section-title', 'Dossiers'));
  folders.forEach((f, i) => tiles.append(tile(f, i)));
  if (folders.length && files.length) tiles.append(el('div', 'section-title', 'Cours'));
  files.forEach((f) => tiles.append(tile(f, null, !!S.query)));
}

// Liste latérale pendant la lecture : les cours du dossier (ou de la recherche).
function renderSide() {
  $('back-label').textContent = S.query ? 'Résultats de recherche' : here().name;
  const list = $('side-list');
  list.replaceChildren();
  for (const f of listing().filter((x) => !x.dir)) {
    const v = visual(f);
    const b = el('button', `row-item c-${v.color}`);
    b.title = f.name;
    if (S.current && S.current.id === f.id) b.classList.add('on');
    b.append(v.node);
    const t = el('div');
    t.append(el('div', 'r-name', prettyName(f)), el('div', 'r-meta', typeOf(f).kind));
    b.append(t);
    b.onclick = () => openFile(f);
    list.append(b);
  }
}

// ---------------------------------------------------------------- recherche

let searchTimer;
function onSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, 250);
}

async function runSearch() {
  const raw = $('search').value.trim();
  const q = fold(raw);
  S.query = q;
  if (!q) { render(); return; }
  if (!$('reader').hidden && !S.current) goHome();
  if (!S.index) {
    render();
    try { S.index = await call('index', false); } catch (e) { toast(e.message, true); S.index = []; }
    if (S.query !== q) return;
  }
  const words = q.split(/\s+/);
  S.hits = S.index.filter((f) => {
    const hay = fold(f.name + ' ' + f.path.map((p) => p.name).join(' '));
    return words.every((w) => hay.includes(w));
  }).slice(0, 300);
  if (!$('reader').hidden) goHome();
  else render();
}

function clearSearch() {
  $('search').value = '';
  S.query = '';
  S.hits = [];
  render();
}

async function refresh() {
  S.index = null;
  if (S.query) await runSearch();
  else await loadFolder();
  toast('Liste actualisée');
}

// ---------------------------------------------------------------- lecture d'un cours

async function openFile(f) {
  const seq = ++S.openSeq;
  const file = { id: f.id, name: f.name, mime: f.mime, ext: f.ext, href: f.href, modified: f.modified };
  S.current = file;

  $('home').hidden = true;
  $('reader').hidden = false;
  renderSide();

  const v = visual(f);
  const ico = $('viewer-ico');
  ico.className = `ico sm c-${v.color}`;
  ico.textContent = typeOf(f).e;
  $('viewer-title').textContent = prettyName(f);
  $('viewer-sub').textContent = typeOf(f).kind + (f.modified ? ' · modifié le ' + f.modified : '');
  $('viewer-offline').hidden = true;
  $('viewer-error').hidden = true;
  $('btn-open-office').hidden = true;
  $('loading-text').textContent = 'Chargement…';
  $('viewer-loading').hidden = false;
  $('viewer-content').replaceChildren();

  try {
    const r = await call('openFile', file);
    if (seq !== S.openSeq) return;
    S.current = { ...file, ...r };
    renderContent(r);
  } catch (e) {
    if (seq !== S.openSeq) return;
    $('error-text').textContent = e.message;
    $('viewer-error').hidden = false;
  } finally {
    if (seq === S.openSeq) $('viewer-loading').hidden = true;
  }
}

function renderContent(r) {
  const box = $('viewer-content');
  $('viewer-offline').hidden = !r.offline;
  const btn = $('btn-open-office');
  const labels = { word: 'Ouvrir dans Word', powerpoint: 'Ouvrir dans PowerPoint', excel: 'Ouvrir dans Excel' };
  if (r.local) {
    setButton(btn, r.officeApp || r.kind === 'pdf' ? 'doc' : 'open',
      labels[r.officeApp] || (r.kind === 'pdf' ? 'Ouvrir dans le lecteur PDF' : 'Ouvrir'));
    btn.title = 'Ouvre une copie sur ce PC : les modifications ne sont pas enregistrées sur le Drive.';
    btn.hidden = false;
  }

  if (r.kind === 'pdf') {
    const frame = el('iframe');
    // Document seul : sans la barre d'outils ni les miniatures du lecteur PDF.
    // Diaporamas : diapo entière à l'écran ; autres documents : pleine largeur.
    const fit = r.officeApp === 'powerpoint' || /google-apps\.presentation/.test(S.current.mime || '') ? 'Fit' : 'FitH';
    frame.src = `${r.display}#toolbar=0&navpanes=0&scrollbar=1&view=${fit}`;
    frame.title = r.name;
    box.replaceChildren(frame);
  } else if (r.kind === 'image') {
    const img = el('img');
    img.src = r.display;
    img.alt = r.name;
    box.replaceChildren(img);
  } else if (r.kind === 'video') {
    const vid = el('video');
    vid.src = r.display;
    vid.controls = true;
    box.replaceChildren(vid);
  } else {
    const d = el('div', 'other');
    const inner = el('div');
    inner.append(el('div', 'big-emoji', '📎'), el('p', null, 'Ce type de fichier ne peut pas être affiché dans l’application.'));
    if (r.local) {
      const b = el('button', 'btn gold', 'Ouvrir avec l’application par défaut');
      b.onclick = openLocal;
      inner.append(b);
    }
    d.append(inner);
    box.replaceChildren(d);
  }
}

async function openLocal() {
  try { await call('openLocal', S.current.local); } catch (e) { toast(e.message, true); }
}

// ---------------------------------------------------------------- événements

window.pse.onStatus(({ id, text }) => {
  if (S.current && S.current.id === id) $('loading-text').textContent = text;
});

for (const a of document.querySelectorAll('a[data-ext]')) {
  a.addEventListener('click', (e) => { e.preventDefault(); window.pse.openExternal(a.href); });
}

$('link-form').onsubmit = async (e) => {
  e.preventDefault();
  const link = $('link-input').value.trim();
  if (!link) return;
  const btn = $('btn-link');
  btn.disabled = true;
  btn.textContent = 'Vérification…';
  $('link-error').hidden = true;
  try {
    const root = await call('setRoot', link);
    localStorage.removeItem('pse.stack');
    startBrowse(root);
    toast(`Dossier des cours : ${root.name}`);
  } catch (err) {
    $('link-error').textContent = err.message;
    $('link-error').hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Valider';
  }
};
$('btn-cancel-link').onclick = () => show('app');

$('search').addEventListener('input', onSearch);
$('search').addEventListener('keydown', (e) => { if (e.key === 'Escape') { clearSearch(); $('search').blur(); } });
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'f' && !$('screen-app').hidden) { e.preventDefault(); $('search').focus(); }
  if (e.key === 'Escape' && !$('reader').hidden && !document.fullscreenElement && document.activeElement !== $('search')) goHome();
});

$('btn-back').onclick = goHome;
$('btn-refresh').onclick = () => refresh().catch((e) => toast(e.message, true));
$('btn-open-office').onclick = openLocal;
$('btn-open-drive').onclick = () => {
  const c = S.current;
  if (c) window.pse.openExternal(c.href && /^https:/.test(c.href) ? c.href : `https://drive.google.com/file/d/${c.id}/view`);
};
$('btn-fullscreen').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $('viewer-body').requestFullscreen();
};
$('btn-retry').onclick = () => { if (S.current) openFile(S.current); };

// menu réglages
$('btn-menu').onclick = async (e) => {
  e.stopPropagation();
  const menu = $('menu');
  menu.hidden = !menu.hidden;
  if (!menu.hidden) {
    const r = await window.pse.cacheSize();
    $('cache-size').textContent = r.ok ? `(${(r.data / 1048576).toFixed(1)} Mo)` : '';
  }
};
document.addEventListener('click', () => { $('menu').hidden = true; });
$('menu').onclick = async (e) => {
  const btn = e.target.closest('button');
  const act = btn && btn.dataset.act;
  if (!act) return;
  $('menu').hidden = true;
  try {
    if (act === 'open-root') window.pse.openExternal(folderUrl(here().id));
    if (act === 'change-root') showSetup(true);
    if (act === 'clear-cache') { await call('clearCache'); toast('Cache vidé'); }
  } catch (err) { toast(err.message, true); }
};

$('btn-start').onclick = letsGo;
$('btn-modules').onclick = () => { location.href = 'modules/index.html'; };
$('btn-to-modules').onclick = () => { location.href = 'modules/index.html'; };

boot().catch((e) => toast(e.message, true));
