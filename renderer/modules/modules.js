/* =====================================================================
   Modules de « PSE en jeux » dans Cours PSE
   - L'élève choisit sa classe (pas d'identifiant) et ne voit que les modules
     ouverts pour elle ; ses résultats sont enregistrés pour la classe.
   - Espace enseignant (sans mot de passe) : classes, modules accessibles, résultats.
   Moteur des jeux repris de pse-jeux.html ; données (GAMES, TH, LEVELS) dans
   data.js, généré par tools/importer-jeux.js. Stockage : jeux-donnees.js.
   ===================================================================== */
'use strict';

const TYPE_INFO = { quiz:{ico:"❓",lbl:"Quiz"}, vf:{ico:"✅",lbl:"Vrai ou faux"}, match:{ico:"🔗",lbl:"Association"}, tri:{ico:"🗂️",lbl:"Classement"} };
const DIFFS = {
  facile:   {lbl:"🟢 Facile",   nom:"Facile",   desc:"Moins de choix dans les quiz, 2 essais pour les classements, erreurs peu pénalisées, pas de chrono."},
  moyen:    {lbl:"🟡 Moyen",    nom:"Moyen",    desc:"Règles normales, sans chronomètre."},
  difficile:{lbl:"🔴 Difficile",nom:"Difficile",desc:"Chronomètre (20 s par question, 12 s en vrai/faux, 10 s par classement, 90 s pour les associations) et erreurs plus pénalisées."}
};
const $ = s => document.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const fmtNote = n => (Math.round(n*10)/10).toString().replace(".",",");
const fmtDate = d => { try { return new Date(d).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}); } catch(e){ return d; } };
function fmtDuree(s){ if (s == null || s === "") return "—"; s = Number(s); const m = Math.floor(s / 60); return m ? `${m} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`; }
function toast(msg, ms){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove("show"), ms||2600); }

/* ---------- Stockage ---------- */
const store = {
  get(k, def){ try { const v = localStorage.getItem(k); return v==null ? def : JSON.parse(v); } catch(e){ return def; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  del(k){ try { localStorage.removeItem(k); } catch(e){} }
};
// Session : effacée à la fermeture du logiciel (utile sur les PC partagés)
const sess = {
  get(k){ try { const v = sessionStorage.getItem(k); return v==null ? null : JSON.parse(v); } catch(e){ return null; } },
  set(k, v){ try { sessionStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  del(k){ try { sessionStorage.removeItem(k); } catch(e){} }
};

/* Données partagées (dossier « Donnees PSE ») via le logiciel */
const API = req => window.pse.jeux(req).catch(e => ({ok:false, erreur:e.message}));

let CLASSES = [];                       // [{nom, acces}]
let CLASSE = sess.get("pse-classe");    // classe choisie par l'élève
let PROF = sess.get("pse-prof");        // {jeton} si l'enseignant est connecté
let PROF_JEUX = !!sess.get("pse-prof-jeux"); // l'enseignant regarde les jeux (rien n'est enregistré)
let VIEW = "games";
let PROG = store.get("pse-modules-progression", {});
function cleProg(){ return PROF && PROF_JEUX ? "_prof" : "c:" + (CLASSE || ""); }
function myProg(){ const k = cleProg(); if (!PROG[k] || !PROG[k].g) PROG[k] = {g:{}}; return PROG[k]; }
function saveProg(){ store.set("pse-modules-progression", PROG); }

let state = Object.assign({lvl:"seconde", th:"A", diff:"moyen"}, store.get("pse-modules-etat", {}));

const starsOf = p => p==null ? 0 : p>=90 ? 3 : p>=70 ? 2 : p>=50 ? 1 : 0;
const starHTML = n => "<b>"+"★".repeat(n)+"</b>"+"★".repeat(3-n);

/* ---------- Accès des classes aux modules (comme dans PSE en jeux) ----------
   acces d'une classe = { idNiveau: true (tous les modules) | ["A1","B2",…] } ; absent = tout est ouvert */
const classeDe = nom => CLASSES.find(c => c.nom === nom) || null;
const accesDe = nom => { const k = classeDe(nom); return (k && k.acces) || null; };
function moduleOuvert(acces, lvlId, code){ if (!acces) return true; const a = acces[lvlId]; return a === true || (Array.isArray(a) && a.includes(code)); }
function accesCourant(){ return (PROF && PROF_JEUX) || !CLASSE ? null : accesDe(CLASSE); }
function niveauxVisibles(){
  const acces = accesCourant();
  if (!acces) return LEVELS;
  return LEVELS.map(l => Object.assign({}, l, {themes: l.themes
      .map(t => Object.assign({}, t, {modules: t.modules.filter(m => moduleOuvert(acces, l.id, m.c))}))
      .filter(t => t.modules.length)}))
    .filter(l => l.themes.length);
}
function resumeAcces(acces){
  if (!acces) return "tous les modules";
  const p = LEVELS.filter(l => acces[l.id]).map(l => { const n = l.themes.reduce((s,t)=>s+t.modules.length,0), a = acces[l.id]; return l.label + (a === true || a.length === n ? "" : ` (${a.length}/${n})`); });
  return p.length ? p.join(", ") : "aucun module";
}
function devinerNiveau(nom){
  const n = String(nom||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase().replace(/[^A-Z0-9]/g,"");
  if (/CAP/.test(n)) return "cap";
  if (/^(2|SECONDE|SEC)/.test(n)) return "seconde";
  if (/^(1|PREMIERE|PREM)/.test(n)) return "premiere";
  if (/^(T|TERM)/.test(n)) return "terminale";
  return "";
}

async function chargerClasses(){
  const r = await API({action:"classes_liste"});
  CLASSES = r && r.ok ? r.classes : [];
  if (CLASSE && !classeDe(CLASSE)){ CLASSE = null; sess.del("pse-classe"); }
}

/* =====================================================================
   RENDU GÉNÉRAL
   ===================================================================== */
function render(){
  for (const v of ["classView","loginView","teacherView","gameView"]) $("#"+v).hidden = true;
  const vue = {classe:"classView", login:"loginView", teacher:"teacherView", games:"gameView"}[VIEW];
  $("#"+vue).hidden = false;
  $("#topHeader").classList.toggle("slim", VIEW !== "games");
  renderHeadActions();
  if (VIEW === "classe") return renderClasseChoix();
  if (VIEW === "login") return renderLogin();
  if (VIEW === "teacher") return renderTeacher();
  renderGames();
}

function renderHeadActions(){
  const h = $("#headActions");
  const nav = `<button class="pill" id="toHome" title="Revenir à la page d’accueil">🏠 Accueil</button><button class="pill" id="toCours" title="Ouvrir les cours">📚 Mes cours</button>`;
  let a = "";
  if (VIEW === "teacher") a = `<button class="pill" id="toGames">🎮 Voir les jeux</button><button class="pill" id="logout">⏏ Déconnexion</button>`;
  else if (VIEW === "login") a = `<button class="pill" id="backGames">← Retour</button>`;
  else if (PROF && PROF_JEUX) a = `<button class="pill who" id="toTeacher">👩‍🏫 Espace enseignant</button>`;
  else {
    if (VIEW === "games" && CLASSES.length && CLASSE) a += `<button class="pill who" id="chgClasse" title="Changer de classe">🎓 ${esc(CLASSE)} · changer</button>`;
    a += PROF ? `<button class="pill" id="toTeacher">👩‍🏫 Espace enseignant</button>` : `<button class="pill" id="toLogin">👩‍🏫 Enseignant</button>`;
  }
  h.innerHTML = a + nav;
  const b = id => document.getElementById(id);
  b("toHome").onclick = () => { location.href = "../index.html#accueil"; };
  b("toCours").onclick = () => { location.href = "../index.html#cours"; };
  if (b("toGames")) b("toGames").onclick = () => { PROF_JEUX = true; sess.set("pse-prof-jeux", true); VIEW = "games"; render(); };
  if (b("toTeacher")) b("toTeacher").onclick = () => { PROF_JEUX = false; sess.del("pse-prof-jeux"); VIEW = "teacher"; render(); };
  if (b("logout")) b("logout").onclick = deconnexion;
  if (b("toLogin")) b("toLogin").onclick = () => { VIEW = "login"; render(); };
  if (b("backGames")) b("backGames").onclick = () => { VIEW = CLASSES.length && !CLASSE ? "classe" : "games"; render(); };
  if (b("chgClasse")) b("chgClasse").onclick = () => { VIEW = "classe"; render(); };
}

function deconnexion(){
  if (PROF) API({action:"prof_deconnexion", jeton:PROF.jeton});
  PROF = null; PROF_JEUX = false; RESULTATS = null;
  sess.del("pse-prof"); sess.del("pse-prof-jeux");
  VIEW = CLASSES.length && !CLASSE ? "classe" : "games";
  render();
}

/* ---------- Choix de la classe (élève) ---------- */
function renderClasseChoix(){
  const v = $("#classView");
  v.innerHTML = `<div class="lcard pick-card">
    <div class="logo">🎓</div>
    <h2>Choisis ta classe</h2>
    <p class="sub">Tu verras les modules de ta classe, et tes résultats seront enregistrés pour elle.</p>
    <div class="cls-pick">${CLASSES.map(c => `<button class="cls-big${c.nom === CLASSE ? " on" : ""}" data-c="${esc(c.nom)}"><b>${esc(c.nom)}</b><small>📚 ${esc(resumeAcces(c.acces))}</small></button>`).join("")}</div>
  </div>`;
  v.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
    CLASSE = b.dataset.c; sess.set("pse-classe", CLASSE); VIEW = "games"; render();
    toast(`Classe ${CLASSE} : c'est parti !`);
  });
}

/* ---------- Grille des modules ---------- */
function renderGames(){
  const VIS = niveauxVisibles();
  if (!VIS.length){
    $("#levels").innerHTML = ""; $("#themes").innerHTML = ""; $("#lvlTitle").textContent = "Aucun module pour le moment";
    $("#lvlPct").textContent = ""; $("#lvlBar").style.width = "0%"; $("#diffSeg").innerHTML = ""; $("#diffDesc").textContent = "";
    $("#grid").innerHTML = `<div class="hint">Ton professeur n'a pas encore ouvert de module pour la classe ${esc(CLASSE)}.</div>`;
    return;
  }
  const lvl = VIS.find(l=>l.id===state.lvl) || VIS[0];
  state.lvl = lvl.id;
  if (!lvl.themes.some(t=>t.k===state.th)) state.th = lvl.themes[0].k;
  if (!DIFFS[state.diff]) state.diff = "moyen";
  store.set("pse-modules-etat", state);
  const P = myProg();

  $("#levels").innerHTML = VIS.map(l=>`<button class="lvl ${l.id===lvl.id?"on":""}" role="tab" aria-selected="${l.id===lvl.id}" data-l="${l.id}">${l.label}<small>${l.sub}</small></button>`).join("");
  const mods = lvl.themes.flatMap(t=>t.modules);
  const ids = [...new Set(mods.flatMap(m=>m.g))].filter(id=>GAMES[id]);
  const earned = ids.reduce((s,id)=>s+starsOf(P.g[id+"|"+state.diff]),0);
  $("#lvlTitle").textContent = lvl.label + (lvl.sub==="Bac Pro" ? " Bac Pro" : " – CAP");
  $("#lvlBar").style.width = Math.round(earned/(ids.length*3||1)*100) + "%";
  $("#lvlPct").textContent = `${earned}/${ids.length*3} ★`;
  $("#diffSeg").innerHTML = Object.keys(DIFFS).map(k=>`<button role="radio" aria-checked="${k===state.diff}" class="${k===state.diff?"on":""}" data-d="${k}">${DIFFS[k].lbl}</button>`).join("");
  $("#diffDesc").textContent = DIFFS[state.diff].desc;
  $("#themes").innerHTML = lvl.themes.map(t=>`<button class="th ${t.k===state.th?"on":""}" role="tab" aria-selected="${t.k===state.th}" data-k="${t.k}"><span class="let">${t.k}</span><span class="t">${esc(t.t)}</span></button>`).join("");

  const th = lvl.themes.find(t=>t.k===state.th);
  $("#grid").innerHTML = th.modules.map(m=>{
    const label = `${m.c} · ${m.t}`;
    const games = m.g.filter(id=>GAMES[id]).map(id=>{
      const g = GAMES[id], ti = TYPE_INFO[g.type], st = starsOf(P.g[id+"|"+state.diff]);
      return `<button class="gbtn" data-g="${id}" data-c="${esc(m.c)}" data-m="${esc(label)}"><span class="gico">${ti.ico}</span><span class="gt">${esc(g.title)}<small>${ti.lbl} · ${DIFFS[state.diff].nom}</small></span><span class="stars" aria-label="${st} étoiles sur 3">${starHTML(st)}</span></button>`;
    }).join("");
    return `<article class="mod">
      <div class="mod-top"><span class="code" style="background:var(--${th.k})">${m.c}</span><h3>${esc(m.t)}</h3></div>
      <div class="games">${games || `<div class="hint">Jeux à venir…</div>`}</div>
    </article>`;
  }).join("");
}

document.addEventListener("click", e=>{
  if (VIEW !== "games") return;
  const l = e.target.closest(".lvl"); if (l){ state.lvl = l.dataset.l; render(); return; }
  const t = e.target.closest(".th");  if (t){ state.th = t.dataset.k; render(); return; }
  const d = e.target.closest("#diffSeg button"); if (d){ state.diff = d.dataset.d; render(); return; }
  const g = e.target.closest(".gbtn[data-g]"); if (g){ openGame(g.dataset.g, g.dataset.m, g.dataset.c); return; }
});

/* ---------- Fenêtre ---------- */
const overlay = $("#overlay"), pBody = $("#pBody");
function openPanel(title, opts){
  opts = opts || {};
  stopTimer();
  $("#pTitle").innerHTML = title;
  $("#panel").classList.toggle("wide", !!opts.wide);
  overlay.classList.add("open"); document.body.style.overflow = "hidden";
  pBody.scrollTop = 0; $("#panel").scrollTop = 0;
}
function closePanel(){
  stopTimer();
  overlay.classList.remove("open"); document.body.style.overflow = ""; if (VIEW === "games") render();
}
$("#pClose").onclick = () => closePanel();
overlay.addEventListener("click", e=>{ if (e.target === overlay) closePanel(); });
document.addEventListener("keydown", e=>{ if (e.key === "Escape" && overlay.classList.contains("open")) closePanel(); });

/* ---------- Chronomètre ---------- */
let TIMER = null;
function stopTimer(){ if (TIMER){ clearInterval(TIMER); TIMER = null; } }
function startTimer(sec, onEnd){
  stopTimer(); let left = sec;
  const upd = () => { const a=$("#tmLbl"), b=$("#tmBar"); if (a) a.textContent = "⏱ " + left + " s"; if (b) b.style.width = (left/sec*100) + "%"; };
  upd();
  TIMER = setInterval(()=>{ left--; upd(); if (left <= 0){ stopTimer(); onEnd(); } }, 1000);
}
const timerHTML = on => on ? `<div class="tbar"><i id="tmBar" style="width:100%"></i></div>` : "";

/* =====================================================================
   JEUX D'ENTRAÎNEMENT
   ===================================================================== */
let current = null;
function openGame(id, modLabel, code){
  const g = GAMES[id]; const diff = state.diff, lvl = LEVELS.find(l=>l.id===state.lvl) || LEVELS[0];
  current = {id, modLabel, code, diff, lvlId:lvl.id, lvl:lvl.label + " " + lvl.sub, t0:Date.now()};
  openPanel(`${esc(g.title)}<small>${esc(modLabel)} · ${TYPE_INFO[g.type].lbl} · ${DIFFS[diff].nom}</small>`);
  ({quiz:playQuiz, vf:playVF, match:playMatch, tri:playTri})[g.type](g, diff);
}
function header(i, n, score, chrono){
  return `<div class="step"><span>${i+1} / ${n}</span>${chrono?`<span class="timer" id="tmLbl"></span>`:""}<span>Score : ${score}</span></div><div class="pbar"><i style="width:${i/n*100}%"></i></div>` + timerHTML(chrono);
}

/* QCM et Vrai/Faux */
function runQuestions(list, isVF, chrono){
  let i = 0, score = 0; const missed = [];
  const step = () => {
    if (i >= list.length) return finish(Math.round(score/list.length*100), `${score} bonne(s) réponse(s) sur ${list.length}`, missed);
    const it = list[i]; let answered = false;
    pBody.innerHTML = header(i, list.length, score, chrono) +
      `<p class="question">${esc(it.q)}</p>
       <div class="choices ${isVF?"vf":""}">${it.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o.t)}</button>`).join("")}</div>
       <div class="explain" id="exp"></div>
       <button class="btn pri next" id="nx">${i+1<list.length?"Question suivante →":"Voir mon résultat"}</button>`;
    const answer = k => {
      if (answered) return; answered = true; stopTimer();
      const good = k != null && it.opts[k].ok;
      pBody.querySelectorAll(".choice").forEach((x,j)=>{ x.disabled = true; if (it.opts[j].ok) x.classList.add("ok"); if (j===k && !good) x.classList.add("ko"); });
      if (good) score++; else missed.push(`${it.q} → ${it.opts.find(o=>o.ok).t}`);
      const ex = $("#exp"); ex.innerHTML = `<b>${good ? "✔ Bravo !" : k==null ? "⏱ Temps écoulé !" : "✘ Pas tout à fait."}</b> ${esc(it.e||"")}`; ex.classList.add("show");
      $("#nx").classList.add("show"); $("#nx").focus();
    };
    pBody.querySelectorAll(".choice").forEach(b => b.onclick = () => answer(+b.dataset.k));
    $("#nx").onclick = () => { i++; step(); };
    if (chrono) startTimer(chrono, () => answer(null));
  };
  step();
}
function playQuiz(g, diff){
  const list = shuffle(g.questions).map(q=>{
    let opts = q.c.map((t,k)=>({t, ok:k===q.a}));
    if (diff === "facile" && opts.length >= 3){ const wrong = shuffle(opts.filter(o=>!o.ok))[0]; opts = opts.filter(o=>o!==wrong); }
    return {q:q.q, e:q.e, opts:shuffle(opts)};
  });
  runQuestions(list, false, diff==="difficile" ? 20 : 0);
}
function playVF(g, diff){
  runQuestions(shuffle(g.items).map(it=>({q:it.s, e:it.e, opts:[{t:"Vrai",ok:it.v===true},{t:"Faux",ok:it.v===false}]})), true, diff==="difficile" ? 12 : 0);
}

/* Association */
function playMatch(g, diff){
  const pairs = g.pairs.map((p,i)=>({l:p[0], r:p[1], i}));
  const L = shuffle(pairs), R = shuffle(pairs);
  const k = diff==="facile" ? 0.5 : diff==="difficile" ? 1.5 : 1;
  const chrono = diff==="difficile" ? 90 : 0;
  let sel = null, found = 0, errors = 0, over = false;
  const end = () => {
    if (over) return; over = true; stopTimer();
    const pct = Math.round(found/pairs.length * pairs.length/(pairs.length + errors*k) * 100);
    setTimeout(()=>finish(pct, `${found} paire(s) sur ${pairs.length}, ${errors} erreur(s)`, found<pairs.length ? pairs.map(p=>`${p.l} → ${p.r}`) : []), 400);
  };
  pBody.innerHTML = `<p class="hint">Touche un élément à gauche, puis sa correspondance à droite.</p>
    <div class="step"><span id="mf">0 / ${pairs.length} paires</span>${chrono?`<span class="timer" id="tmLbl"></span>`:""}<span id="me">Erreurs : 0</span></div>${timerHTML(chrono)}
    <div class="match"><div class="col">${L.map(p=>`<button class="tile" data-s="l" data-i="${p.i}">${esc(p.l)}</button>`).join("")}</div>
    <div class="col">${R.map(p=>`<button class="tile" data-s="r" data-i="${p.i}">${esc(p.r)}</button>`).join("")}</div></div>`;
  pBody.querySelectorAll(".tile").forEach(t => t.onclick = () => {
    if (over || t.classList.contains("done")) return;
    if (!sel || sel.dataset.s === t.dataset.s){
      if (sel) sel.classList.remove("sel");
      sel = (sel === t) ? null : t; if (sel) sel.classList.add("sel"); return;
    }
    if (sel.dataset.i === t.dataset.i){
      [sel,t].forEach(x=>{ x.classList.remove("sel"); x.classList.add("done"); x.disabled = true; });
      found++; $("#mf").textContent = `${found} / ${pairs.length} paires`;
      if (found === pairs.length) end();
    } else {
      errors++; $("#me").textContent = `Erreurs : ${errors}`;
      const a = sel; [a,t].forEach(x=>x.classList.add("shake"));
      setTimeout(()=>[a,t].forEach(x=>x.classList.remove("shake","sel")), 400);
    }
    sel = null;
  });
  if (chrono) startTimer(chrono, end);
}

/* Classement */
const BIN_COLORS = ["#3d6fd8","#e0566f","#2f9e6e","#e08a1e"];
function playTri(g, diff){
  const items = shuffle(g.items); let i = 0, score = 0; const missed = [];
  const chrono = diff==="difficile" ? 10 : 0, essais = diff==="facile" ? 2 : 1;
  const step = () => {
    if (i >= items.length) return finish(Math.round(score/items.length*100), `${String(score).replace(".",",")} point(s) sur ${items.length}`, missed);
    const it = items[i]; let tries = 0, done = false;
    pBody.innerHTML = header(i, items.length, String(score).replace(".",","), chrono) +
      `<p class="hint">Dans quelle catégorie ranger cet élément ?${essais>1?" (2 essais)":""}</p>
       <div class="card-item">${esc(it.t)}</div>
       <div class="bins">${g.cats.map((c,k)=>`<button class="bin" data-k="${k}" style="background:${BIN_COLORS[k%4]}">${esc(c)}</button>`).join("")}</div>
       <div class="explain" id="exp"></div>
       <button class="btn pri next" id="nx">${i+1<items.length?"Suivant →":"Voir mon résultat"}</button>`;
    const conclude = (good, msg) => {
      done = true; stopTimer();
      pBody.querySelectorAll(".bin").forEach(x=>{ x.disabled = true; if (+x.dataset.k === it.c) x.style.outline = "4px solid var(--ink)"; });
      if (good) score += (tries === 1 ? 1 : 0.5); else missed.push(`${it.t} → ${g.cats[it.c]}`);
      const ex = $("#exp"); ex.innerHTML = `<b>${msg}</b> ${esc(it.e||"")}`; ex.classList.add("show");
      $("#nx").classList.add("show"); $("#nx").focus();
    };
    pBody.querySelectorAll(".bin").forEach(b => b.onclick = () => {
      if (done) return; tries++;
      const good = +b.dataset.k === it.c;
      if (good) return conclude(true, tries===1 ? "✔ Bien classé !" : "✔ Bien classé au 2e essai (½ point).");
      if (tries < essais){ b.classList.add("wrong"); b.disabled = true; const ex=$("#exp"); ex.innerHTML="<b>✘ Essaie encore !</b>"; ex.classList.add("show"); return; }
      conclude(false, "✘ Non : « " + esc(g.cats[it.c]) + " ».");
    });
    $("#nx").onclick = () => { i++; step(); };
    if (chrono) startTimer(chrono, () => { if (!done) conclude(false, "⏱ Temps écoulé ! C'était « " + esc(g.cats[it.c]) + " »."); });
  };
  step();
}

/* Fin d'un jeu : étoiles sur ce PC + résultat enregistré pour la classe */
function finish(pct, detail, missed){
  stopTimer();
  const P = myProg(), key = current.id + "|" + current.diff;
  if (!(key in P.g) || pct > P.g[key]) P.g[key] = pct; saveProg();
  const n = starsOf(pct);
  const msg = n===3 ? "Excellent !" : n===2 ? "Très bien !" : n===1 ? "Pas mal !" : "Continue, tu vas progresser !";
  pBody.innerHTML = `<div class="result">
    <div class="big-stars">${starHTML(n)}</div>
    <h2>${msg}</h2><p>${pct} % · ${detail} · ${DIFFS[current.diff].nom}</p>
    <div class="actions"><button class="btn pri" id="again">↻ Rejouer</button>${current.diff!=="difficile" && n>=2 ? `<button class="btn gold" id="harder">Niveau supérieur ↑</button>` : ""}<button class="btn sec" id="back">Retour aux modules</button></div>
    <div class="sendstate" id="sendstate"></div>
    ${missed.length ? `<div class="recap"><h4>À retenir</h4><ul>${missed.map(m=>`<li>${esc(m)}</li>`).join("")}</ul></div>` : ""}
  </div>`;
  $("#again").onclick = () => openGame(current.id, current.modLabel, current.code);
  $("#back").onclick = () => closePanel();
  const h = $("#harder"); if (h) h.onclick = () => { state.diff = current.diff==="facile" ? "moyen" : "difficile"; openGame(current.id, current.modLabel, current.code); };
  const el = $("#sendstate");
  if (PROF && PROF_JEUX){ el.textContent = "Mode enseignant : le résultat n'est pas enregistré."; return; }
  const g = GAMES[current.id];
  API({action:"resultat_ajout", ligne:{
    classe:CLASSE || "", niveauId:current.lvlId, niveau:current.lvl, code:current.code, module:current.modLabel,
    jeu:current.id, activite:g.title, type:"Entraînement", difficulte:DIFFS[current.diff].nom,
    note:pct, sur:100, duree:Math.max(1, Math.round((Date.now() - current.t0) / 1000))
  }}).then(r => {
    const e2 = $("#sendstate"); if (!e2) return;
    e2.textContent = r && r.ok ? `✓ Résultat enregistré${CLASSE ? " pour la classe " + CLASSE : ""}.` : "⚠ Résultat non enregistré : " + ((r && r.erreur) || "erreur");
  });
}

/* =====================================================================
   CONNEXION ENSEIGNANT
   ===================================================================== */
function renderLogin(){
  const v = $("#loginView");
  v.innerHTML = `<div class="lcard"><div class="logo">👩‍🏫</div><h2>Espace enseignant</h2><p class="sub">Prévention Santé Environnement</p><div id="lBody"><p class="hint">Chargement…</p></div></div>`;
  const root = $("#lBody");
  // Plus de mot de passe : on ouvre directement l'espace enseignant.
  API({action:"prof_entrer"}).then(r => {
    if (!r || !r.ok){ root.innerHTML = `<p class="err">Erreur : ${esc(r && r.erreur)}</p>`; return; }
    PROF = {jeton:r.jeton}; sess.set("pse-prof", PROF); PROF_JEUX = false; sess.del("pse-prof-jeux");
    VIEW = "teacher"; tTab = "classes"; RESULTATS = null; render();
  });
}

/* =====================================================================
   ESPACE ENSEIGNANT
   ===================================================================== */
let tTab = "classes";
let RESULTATS = null;
const jeton = () => PROF ? PROF.jeton : "";
function sessionExpiree(r){
  if (r && !r.ok && r.expire){ toast("Session enseignant expirée : réouverture…", 3000); PROF = null; sess.del("pse-prof"); VIEW = "login"; render(); return true; }
  return false;
}
function copier(texte){
  try { navigator.clipboard.writeText(texte).then(()=>toast("Copié ! Collez dans Excel ou un document."), ()=>toast("Copie impossible.")); } catch(e){ toast("Copie impossible."); }
}
function telecharger(nom, texte){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿"+texte], {type:"text/csv;charset=utf-8"}));
  a.download = nom; document.body.appendChild(a); a.click(); a.remove();
  toast("Fichier enregistré dans Téléchargements.");
}

function renderTeacher(){
  const v = $("#teacherView");
  const tabs = {classes:"🏫 Classes", resultats:"📊 Résultats", reglages:"⚙️ Réglages"};
  v.innerHTML = `<div class="tv-head"><h2>👩‍🏫 Espace enseignant</h2><span class="status on">● Données dans le dossier « Donnees PSE »</span></div>
    <div class="tabs">${Object.keys(tabs).map(k=>`<button class="tab ${k===tTab?"on":""}" data-t="${k}">${tabs[k]}</button>`).join("")}</div>
    <div class="tv-card" id="tBody"></div>`;
  v.querySelectorAll(".tab[data-t]").forEach(b => b.onclick = () => {
    tTab = b.dataset.t;
    if (tTab === "resultats") RESULTATS = null;   // rechargé à chaque ouverture de l'onglet
    renderTeacher();
  });
  ({classes:tabClasses, resultats:tabResultats, reglages:tabReglages})[tTab]($("#tBody"));
}

let sauvegarde = Promise.resolve();
function saveClasses(){
  const copie = CLASSES.map(c => Object.assign({}, c));
  sauvegarde = sauvegarde.then(() => API({action:"classes_enregistrer", jeton:jeton(), classes:copie}))
    .then(r => { if (!sessionExpiree(r) && (!r || !r.ok)) toast("✘ Enregistrement impossible : " + ((r && r.erreur) || "erreur"), 5000); });
  return sauvegarde;
}

/* ----- Classes (comme l'onglet « Élèves » de PSE en jeux, sans les élèves) ----- */
let classeSel = "", renommage = "", accesOuvert = "";
const triClasses = () => CLASSES.map(c => c.nom).sort((a,b) => a.localeCompare(b, "fr", {numeric:true}));
function tabClasses(root){
  const classes = triClasses();
  if (!classes.includes(classeSel)) classeSel = classes[0] || "";
  const c = classeSel;
  root.innerHTML = `
  <div class="section"><h4>1. Les classes</h4>
    <form class="form" id="clsF">
      <label>Nom de la nouvelle classe<input class="inp" id="cN" maxlength="30" placeholder="ex. CAP, 2CSR, 1AGORA" required></label>
      <label>Programme suivi<select class="inp" id="cNiv"><option value="">Tous les niveaux</option>${LEVELS.map(l=>`<option value="${l.id}">${esc(l.label)} ${esc(l.sub)}</option>`).join("")}</select></label>
      <button class="btn pri">+ Créer la classe</button>
    </form>
    <p class="hint">Les élèves choisissent leur classe en ouvrant les modules : ils ne voient que les modules ouverts pour elle, et leurs résultats sont enregistrés pour la classe.</p>
    ${classes.length ? `<div class="cls-grid">${classes.map(k => `<button class="cls ${k===c?"on":""}" data-cls="${esc(k)}"><b>${esc(k)}</b><small>📚 ${esc(resumeAcces(accesDe(k)))}</small></button>`).join("")}</div>`
      : `<p class="hint">Aucune classe pour l'instant : commencez par en créer une. Tant qu'il n'y a pas de classe, les élèves voient tous les modules.</p>`}
  </div>
  ${c ? `
  <div class="section">
    <div class="row" style="justify-content:space-between;margin-bottom:10px">
      <h4 style="margin:0">2. Classe ${esc(c)}</h4>
      <div class="row">
        <button class="btn sec sm" id="accC">📚 Modules accessibles</button>
        <button class="btn sec sm" id="renC">✏️ Renommer la classe</button>
        <button class="btn sec sm" id="resC">📊 Voir les notes</button>
        <button class="btn danger sm" id="delC">Supprimer la classe</button>
      </div>
    </div>
    ${renommage === c ? `
    <form class="form" id="renF" style="background:var(--bg);padding:12px;border-radius:12px">
      <label>Nouveau nom de la classe<input class="inp" id="rN" maxlength="30" value="${esc(c)}" required></label>
      <div class="row"><button class="btn pri sm">Valider</button><button type="button" class="btn sec sm" id="rAnn">Annuler</button></div>
      <p class="hint" style="grid-column:1/-1;margin:0">Les résultats déjà enregistrés suivront le nouveau nom.</p>
    </form>` : ""}
    <p class="hint">📚 Modules visibles par les élèves : <b>${esc(resumeAcces(accesDe(c)))}</b></p>
    ${accesOuvert === c ? `
    <form id="accF" style="background:var(--bg);padding:12px;border-radius:12px;margin-bottom:14px">
      <p class="hint">Cochez les modules que les élèves de la classe <b>${esc(c)}</b> peuvent voir. Les modules sont rangés selon les programmes officiels de PSE (Bac Pro : Seconde, Première, Terminale ; CAP). Cocher un niveau coche tous ses modules.</p>
      ${LEVELS.map(l => { const a = (accesDe(c) || {})[l.id], tout = !accesDe(c); return `<fieldset class="acc-lvl"><legend><label><input type="checkbox" data-lvl="${l.id}"> ${esc(l.label)} ${esc(l.sub)}</label><small data-cpt="${l.id}"></small></legend>
        ${l.themes.map(t => `<div class="acc-th">${esc(t.k.replace("cap",""))} · ${esc(t.t)}</div><div class="acc-mods">${t.modules.map(m => `<label><input type="checkbox" data-mod="${l.id}" value="${esc(m.c)}" ${tout || a === true || (Array.isArray(a) && a.includes(m.c)) ? "checked" : ""}> <span><b>${esc(m.c)}</b> · ${esc(m.t)}</span></label>`).join("")}</div>`).join("")}
      </fieldset>`; }).join("")}
      <div class="row"><button class="btn pri sm">Enregistrer</button><button type="button" class="btn sec sm" id="aAnn">Annuler</button></div>
    </form>` : ""}
  </div>` : ""}`;

  $("#clsF").onsubmit = e => {
    e.preventDefault();
    const nom = $("#cN").value.trim().replace(/\s+/g, " ");
    if (!nom) return;
    if (CLASSES.some(k => k.nom.toLowerCase() === nom.toLowerCase())) return toast("Cette classe existe déjà.");
    const niv = $("#cNiv").value, cl = {nom};
    if (niv) cl.acces = {[niv]: true};
    CLASSES.push(cl); saveClasses(); classeSel = nom; toast(`Classe ${nom} créée.`); tabClasses(root);
  };
  { let choisiMain = false;
    $("#cNiv").onchange = () => { choisiMain = true; };
    $("#cN").oninput = () => { if (!choisiMain) $("#cNiv").value = devinerNiveau($("#cN").value); }; }
  root.querySelectorAll("[data-cls]").forEach(b => b.onclick = () => { classeSel = b.dataset.cls; renommage = ""; accesOuvert = ""; tabClasses(root); });
  if (!c) return;

  $("#accC").onclick = () => { accesOuvert = accesOuvert === c ? "" : c; renommage = ""; tabClasses(root); };
  $("#resC").onclick = () => { fRes.classe = c; tTab = "resultats"; RESULTATS = null; renderTeacher(); };
  if (accesOuvert === c){
    const f = $("#accF");
    const maj = () => LEVELS.forEach(l => {
      const mods = [...f.querySelectorAll(`[data-mod="${l.id}"]`)], n = mods.filter(x => x.checked).length;
      const lc = f.querySelector(`[data-lvl="${l.id}"]`);
      lc.checked = n === mods.length; lc.indeterminate = n > 0 && n < mods.length;
      f.querySelector(`[data-cpt="${l.id}"]`).textContent = `${n}/${mods.length} module${mods.length>1?"s":""}`;
    });
    f.querySelectorAll("[data-lvl]").forEach(lc => lc.onchange = () => { f.querySelectorAll(`[data-mod="${lc.dataset.lvl}"]`).forEach(x => x.checked = lc.checked); maj(); });
    f.querySelectorAll("[data-mod]").forEach(x => x.onchange = maj);
    maj();
    $("#aAnn").onclick = () => { accesOuvert = ""; tabClasses(root); };
    f.onsubmit = e => {
      e.preventDefault();
      const acces = {};
      LEVELS.forEach(l => {
        const mods = [...f.querySelectorAll(`[data-mod="${l.id}"]`)], oui = mods.filter(x => x.checked).map(x => x.value);
        if (oui.length) acces[l.id] = oui.length === mods.length ? true : oui;
      });
      classeDe(c).acces = acces; saveClasses(); accesOuvert = "";
      toast(Object.keys(acces).length ? `Modules de la classe ${c} enregistrés.` : `Attention : aucun module ouvert, les élèves de ${c} ne verront aucun jeu.`, 4000);
      tabClasses(root);
    };
  }

  $("#renC").onclick = () => { renommage = renommage === c ? "" : c; accesOuvert = ""; tabClasses(root); setTimeout(()=>{ const r = $("#rN"); if (r){ r.focus(); r.select(); } }, 30); };
  if (renommage === c){
    $("#rAnn").onclick = () => { renommage = ""; tabClasses(root); };
    $("#renF").onsubmit = async e => {
      e.preventDefault();
      const nom = $("#rN").value.trim().replace(/\s+/g, " ");
      if (!nom || nom === c){ renommage = ""; return tabClasses(root); }
      if (CLASSES.some(k => k.nom !== c && k.nom.toLowerCase() === nom.toLowerCase())) return toast("Une autre classe porte déjà ce nom.");
      classeDe(c).nom = nom;
      await saveClasses();
      const r = await API({action:"resultats_renommer_classe", jeton:jeton(), ancienne:c, nouvelle:nom});
      if (!sessionExpiree(r) && (!r || !r.ok)) toast("✘ Mise à jour des résultats impossible : " + ((r && r.erreur) || "erreur"), 5000);
      if (CLASSE === c){ CLASSE = nom; sess.set("pse-classe", nom); }
      RESULTATS = null; classeSel = nom; renommage = "";
      toast(`Classe renommée en ${nom}.`); tabClasses(root);
    };
  }

  $("#delC").onclick = () => {
    const b = $("#delC");
    if (b.dataset.confirm !== "1"){ b.dataset.confirm = "1"; b.textContent = "Confirmer la suppression ?"; return; }
    CLASSES = CLASSES.filter(k => k.nom !== c);
    if (CLASSE === c){ CLASSE = null; sess.del("pse-classe"); }
    saveClasses(); toast(`Classe ${c} supprimée (ses résultats sont conservés).`, 4000); classeSel = ""; tabClasses(root);
  };
}

/* ----- Résultats : notes de chaque module, pour chaque classe ----- */
let fRes = {classe:"", diff:""};
const SANS = "Sans classe";
function tabResultats(root){
  if (RESULTATS === null){
    root.innerHTML = `<p class="hint">Chargement des résultats…</p>`;
    RESULTATS = [];
    API({action:"resultats_liste", jeton:jeton()}).then(r => {
      if (sessionExpiree(r)) return;
      if (r && r.ok) RESULTATS = r.resultats; else toast("Erreur : " + ((r && r.erreur) || ""));
      if (VIEW === "teacher" && tTab === "resultats") tabResultats(root);
    });
    return;
  }
  const sur10 = r => Number(r.note) / Number(r.sur || 100) * 10;
  const cls = v => v == null ? "" : v < 5 ? "lo" : v >= 8 ? "hi" : "";
  const nomC = r => r.classe || SANS;
  const rows = RESULTATS.filter(r => !fRes.diff || r.difficulte === fRes.diff);

  // classes en colonnes : celles qui existent, puis celles qui n'ont plus que des résultats
  const colonnes = triClasses();
  [...new Set(rows.map(nomC))].sort((a,b)=>a.localeCompare(b,"fr",{numeric:true})).forEach(k => { if (!colonnes.includes(k)) colonnes.push(k); });

  // modules en lignes : ceux ouverts pour au moins une classe, ou qui ont des résultats
  const modKey = (lvlId, code) => lvlId + "|" + code;
  const stats = {};   // modKey → classe → {n, somme, best, last}
  rows.forEach(r => {
    const k = modKey(r.niveauId, r.code), c = nomC(r);
    const s = ((stats[k] = stats[k] || {})[c] = stats[k][c] || {n:0, somme:0, best:0, last:""});
    const v = sur10(r); s.n++; s.somme += v; s.best = Math.max(s.best, v); if (String(r.date) > s.last) s.last = String(r.date);
  });
  const ouvertPour = (l, m, c) => { const k = classeDe(c); return k ? moduleOuvert(k.acces || null, l.id, m.c) : false; };
  const lignes = [];
  LEVELS.forEach(l => l.themes.forEach(t => t.modules.forEach(m => {
    const k = modKey(l.id, m.c);
    if (colonnes.some(c => ouvertPour(l, m, c)) || stats[k]) lignes.push({l, m, k});
  })));

  const cellule = (x, c) => {
    const s = stats[x.k] && stats[x.k][c];
    if (s) return `<td class="cell-note ${cls(s.somme/s.n)}" title="${s.n} partie(s) · meilleure : ${fmtNote(s.best)}/10">${fmtNote(s.somme/s.n)}<small class="nb">${s.n}</small></td>`;
    return ouvertPour(x.l, x.m, c) ? `<td class="cell-vide" title="Module ouvert, pas encore joué">·</td>` : `<td class="cell-na" title="Module non ouvert pour cette classe">—</td>`;
  };
  const groupes = [];
  lignes.forEach(x => { const g = groupes[groupes.length-1]; if (!g || g.l !== x.l) groupes.push({l:x.l, lignes:[x]}); else g.lignes.push(x); });

  // détail d'une classe
  const cSel = fRes.classe && colonnes.includes(fRes.classe) ? fRes.classe : (colonnes[0] || "");
  fRes.classe = cSel;
  const rowsC = rows.filter(r => nomC(r) === cSel);
  const modsC = lignes.filter(x => ouvertPour(x.l, x.m, cSel) || (stats[x.k] && stats[x.k][cSel]));
  const moyC = rowsC.length ? rowsC.reduce((a,r)=>a+sur10(r),0)/rowsC.length : null;
  const travailles = modsC.filter(x => stats[x.k] && stats[x.k][cSel]).length;
  const detail = rowsC.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));

  root.innerHTML = `
  <div class="section">
    <div class="row" style="justify-content:space-between">
      <div class="row">
        <select class="inp" id="rD" style="width:auto"><option value="">Toutes les difficultés</option>${Object.values(DIFFS).map(d=>`<option ${d.nom===fRes.diff?"selected":""}>${d.nom}</option>`).join("")}</select>
      </div>
      <button class="btn gold sm" id="refresh">↻ Actualiser</button>
    </div>
  </div>

  <div class="section">
    <div class="row" style="justify-content:space-between;margin-bottom:8px"><h4 style="margin:0">📒 Notes par module et par classe (moyenne /10)</h4>
      <div class="row"><button class="btn sec sm" id="cpM">📋 Copier (Excel)</button><button class="btn sec sm" id="dlM">⬇ CSV</button></div></div>
    ${colonnes.length && lignes.length ? `<div class="tbl-wrap"><table class="matrix"><thead><tr><th>Module</th>${colonnes.map(c=>`<th class="c">${esc(c)}</th>`).join("")}</tr></thead><tbody>
      ${groupes.map(g => `<tr class="grp"><th colspan="${colonnes.length+1}">${esc(g.l.label)} ${esc(g.l.sub)}</th></tr>` +
        g.lignes.map(x => `<tr><td class="wrap"><b>${esc(x.m.c)}</b> · ${esc(x.m.t)}</td>${colonnes.map(c => cellule(x, c)).join("")}</tr>`).join("")).join("")}
    </tbody></table></div>
    <p class="hint">Chaque case donne la moyenne des parties jouées par la classe sur ce module (le petit nombre = nombre de parties). « · » : module ouvert mais pas encore joué. « — » : module non ouvert pour la classe.</p>`
    : `<p class="hint">${CLASSES.length ? "Aucun module ouvert ni aucun résultat pour l'instant." : "Créez d'abord une classe dans l'onglet « Classes »."}</p>`}
  </div>

  ${cSel ? `<div class="section">
    <div class="row" style="justify-content:space-between;margin-bottom:8px">
      <h4 style="margin:0">🏫 Détail de la classe</h4>
      <select class="inp" id="rC" style="width:auto">${colonnes.map(c=>`<option ${c===cSel?"selected":""}>${esc(c)}</option>`).join("")}</select>
    </div>
    <div class="kpis">
      <div class="kpi"><b>${rowsC.length}</b><span>parties jouées</span></div>
      <div class="kpi"><b>${moyC==null?"—":fmtNote(moyC)}</b><span>moyenne /10</span></div>
      <div class="kpi"><b>${travailles}/${modsC.length}</b><span>modules travaillés</span></div>
      <div class="kpi"><b>${detail.length ? fmtDate(detail[0].date) : "—"}</b><span>dernière activité</span></div>
    </div>
    <div class="row" style="justify-content:flex-end;margin-bottom:8px"><button class="btn sec sm" id="cpC">📋 Copier (Excel)</button><button class="btn sec sm" id="dlC">⬇ CSV</button></div>
    <div class="tbl-wrap"><table><thead><tr><th>Niveau</th><th>Module</th><th>Parties</th><th>Moyenne /10</th><th>Meilleure /10</th><th>Dernière partie</th></tr></thead><tbody>
      ${modsC.length ? modsC.map(x => { const s = stats[x.k] && stats[x.k][cSel]; return `<tr><td>${esc(x.l.label)}</td><td class="wrap"><b>${esc(x.m.c)}</b> · ${esc(x.m.t)}</td><td>${s ? s.n : 0}</td><td class="cell-note ${s ? cls(s.somme/s.n) : ""}">${s ? fmtNote(s.somme/s.n) : "—"}</td><td class="cell-note">${s ? fmtNote(s.best) : "—"}</td><td>${s ? fmtDate(s.last) : "—"}</td></tr>`; }).join("")
        : `<tr><td colspan="6" class="hint">Aucun module ouvert pour cette classe.</td></tr>`}
    </tbody></table></div>
  </div>

  <div class="section">
    <div class="row" style="justify-content:space-between;margin-bottom:8px"><h4 style="margin:0">Dernières parties de la classe ${esc(cSel)} (${detail.length})</h4>
      <div class="row"><button class="btn sec sm" id="cpD">📋 Copier (Excel)</button><button class="btn sec sm" id="dlD">⬇ CSV</button></div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Niveau</th><th>Module</th><th>Jeu</th><th>Difficulté</th><th>Note /10</th><th>Durée</th></tr></thead><tbody>
      ${detail.length ? detail.slice(0,500).map(r=>`<tr><td>${fmtDate(r.date)}</td><td>${esc(r.niveau)}</td><td class="wrap">${esc(r.module)}</td><td class="wrap">${esc(r.activite)}</td><td>${esc(r.difficulte)}</td><td class="cell-note ${cls(sur10(r))}"><b>${fmtNote(sur10(r))}</b></td><td>${fmtDuree(r.duree)}</td></tr>`).join("") : `<tr><td colspan="7" class="hint">Aucune partie pour l'instant.</td></tr>`}
    </tbody></table></div>
    ${detail.length>500 ? `<p class="hint">Seules les 500 parties les plus récentes sont affichées ; l'export contient tout.</p>` : ""}
  </div>` : ""}`;

  const clean = x => String(x==null?"":x).replace(/[\t;\n]/g," ");
  const matT = sep => ["Niveau","Module"].concat(colonnes).map(clean).join(sep) + "\n" + lignes.map(x => [x.l.label + " " + x.l.sub, x.m.c + " · " + x.m.t].concat(colonnes.map(c => { const s = stats[x.k] && stats[x.k][c]; return s ? fmtNote(s.somme/s.n) : ouvertPour(x.l, x.m, c) ? "" : "non ouvert"; })).map(clean).join(sep)).join("\n");
  const clsT = sep => ["Niveau","Module","Parties","Moyenne /10","Meilleure /10","Dernière partie"].join(sep) + "\n" + modsC.map(x => { const s = stats[x.k] && stats[x.k][cSel]; return [x.l.label, x.m.c + " · " + x.m.t, s ? s.n : 0, s ? fmtNote(s.somme/s.n) : "", s ? fmtNote(s.best) : "", s ? fmtDate(s.last) : ""].map(clean).join(sep); }).join("\n");
  const detT = sep => ["Date","Classe","Niveau","Module","Jeu","Difficulté","Note /10","Durée","Poste"].join(sep) + "\n" + detail.map(r => [fmtDate(r.date), nomC(r), r.niveau, r.module, r.activite, r.difficulte, fmtNote(sur10(r)), fmtDuree(r.duree), r.poste].map(clean).join(sep)).join("\n");
  const fic = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^\w-]+/g,"-");
  $("#rD").onchange = e => { fRes.diff = e.target.value; tabResultats(root); };
  $("#refresh").onclick = () => { RESULTATS = null; tabResultats(root); };
  const on = (id, fn) => { const b = $(id); if (b) b.onclick = fn; };
  on("#cpM", () => copier(matT("\t")));
  on("#dlM", () => telecharger("notes-modules-classes.csv", matT(";")));
  if (cSel){
    $("#rC").onchange = e => { fRes.classe = e.target.value; tabResultats(root); };
    on("#cpC", () => copier(clsT("\t")));
    on("#dlC", () => telecharger(`notes-${fic(cSel)}.csv`, clsT(";")));
    on("#cpD", () => copier(detT("\t")));
    on("#dlD", () => telecharger(`parties-${fic(cSel)}.csv`, detT(";")));
  }
}

/* ----- Réglages ----- */
function tabReglages(root){
  root.innerHTML = `
  <div class="section"><h4>Où sont enregistrées les données ?</h4>
    <p id="dossierInfo" class="hint">Chargement…</p>
    <ul class="help">
      <li>Les classes et tous les résultats sont dans le dossier « Donnees PSE » créé à côté du logiciel (ou celui indiqué dans <code>dossier-donnees.txt</code> à côté du logiciel).</li>
      <li><b>Pour que tous les PC de la salle partagent les mêmes classes et résultats</b> : placez le logiciel dans un dossier partagé du réseau du lycée, ou créez à côté du logiciel un fichier <code>dossier-donnees.txt</code> contenant le chemin d'un dossier partagé (ex. <code>\\\\serveur\\commun\\PSE</code>).</li>
      <li>Sauvegarde : il suffit de copier le dossier de données.</li>
    </ul>
  </div>

  <div class="section"><h4>Cet ordinateur</h4>
    <button class="btn danger sm" id="clrP">Effacer les étoiles mémorisées sur cet ordinateur</button>
  </div>`;

  API({action:"infos", jeton:jeton()}).then(r => {
    if (sessionExpiree(r)) return;
    const el = $("#dossierInfo"); if (!el || !r || !r.ok) return;
    el.innerHTML = `Dossier de données : <b>${esc(r.dossier)}</b><br>${r.classes} classe(s) · ${r.resultats} résultat(s) enregistré(s) · poste : ${esc(r.poste)}`;
  });
  $("#clrP").onclick = e => { const b = e.target; if (b.dataset.c !== "1"){ b.dataset.c = "1"; b.textContent = "Confirmer ?"; return; } PROG = {}; saveProg(); toast("Étoiles effacées sur cet ordinateur."); b.dataset.c = ""; b.textContent = "Effacer les étoiles mémorisées sur cet ordinateur"; };
}

/* ---------- Démarrage ---------- */
(async () => {
  await chargerClasses();
  // En ouvrant les jeux depuis l'accueil : toujours choisir la classe (s'il en existe),
  // pour n'afficher que les modules ouverts pour elle dans l'espace enseignant.
  if (CLASSES.length){ VIEW = "classe"; PROF_JEUX = false; sess.del("pse-prof-jeux"); }
  else VIEW = PROF ? "teacher" : "games";
  render();
})();
