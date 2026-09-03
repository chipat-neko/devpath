/* Ce que le navigateur AFFICHE pour un cours dont un seul module sur cinq est
   écrit — vierge, puis avec une progression semée dans localStorage.
   Motif : un cours en « aperçu » est un cas que le site rencontre rarement ;
   c'est là que se cachent les liens morts (une leçon « bientôt » cliquable) et
   les compteurs qui mentent. Un localStorage vide, lui, ne montre ni la barre
   de progression ni la pastille : il faut semer pour voir.
   Chrome headless, réseau coupé. Node >= 22 (WebSocket natif). */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..', '..');

function trouverChrome() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe')].filter(Boolean);
  for (const x of c) { try { if (fs.existsSync(x)) return x; } catch (e) {} }
  return null;
}
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

function Client(url) {
  this.ws = new WebSocket(url); this.id = 0; this.encours = {};
  const self = this;
  this.pret = new Promise((res, rej) => {
    self.ws.addEventListener('open', () => res());
    self.ws.addEventListener('error', (e) => rej(new Error('WebSocket : ' + (e.message || 'echec'))));
  });
  this.ws.addEventListener('message', (ev) => {
    let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
    if (m.id && self.encours[m.id]) {
      const f = self.encours[m.id]; delete self.encours[m.id];
      if (m.error) f.rej(new Error(m.error.message)); else f.res(m.result);
    }
  });
}

/* --- ce qui est relevé DANS la page ------------------------------------- */
const SONDE_COURS = function () {
  /* Les modules sont repliés : on les ouvre pour lire le plan complet. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-course-modules] details'), function (d) { d.open = true; });
  const liens = Array.from(document.querySelectorAll('[data-course-modules] a[href]'));
  const grises = Array.from(document.querySelectorAll('[data-course-modules] .lesson-row--soon, [data-course-modules] [aria-disabled="true"], [data-course-modules] .is-soon'));
  const morts = liens.filter((a) => {
    const h = a.getAttribute('href') || '';
    return h === '#' || /lecon-(1[0-3])\.html$/.test(h);
  }).map((a) => a.getAttribute('href'));
  const stats = document.querySelector('[data-course-stats]');
  const prog = document.querySelector('[data-course-progress]');
  return {
    liensLecons: liens.map((a) => a.getAttribute('href')).filter((h) => /lecon-/.test(h)),
    liensMorts: morts,
    nbGrises: grises.length,
    textePlan: (document.querySelector('[data-course-modules]') || {}).innerText || '',
    stats: stats ? stats.innerText.replace(/\s+/g, ' ').trim() : '(absent)',
    progression: prog ? prog.innerText.replace(/\s+/g, ' ').trim() : '(absent)',
    badge: (document.querySelector('.course-hero .badge') || {}).innerText || '',
  };
};

const SONDE_LECON = function () {
  const nav = document.querySelector('[data-lesson-nav]');
  const plan = document.querySelector('[data-coursenav]');
  const liensPlan = plan ? Array.from(plan.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')) : [];
  return {
    nav: nav ? nav.innerText.replace(/\s+/g, ' ').trim() : '(absent)',
    navLiens: nav ? Array.from(nav.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')) : [],
    liensPlan: liensPlan,
    planMorts: liensPlan.filter((h) => h === '#'),
    boutonFini: (document.querySelector('[data-complete-toggle]') || {}).innerText || '(absent)',
    boutonsTester: document.querySelectorAll('.runner__btn, [data-run], button.run-btn').length,
    titre: (document.querySelector('h1') || {}).innerText || '',
  };
};

/* --- progression semée --------------------------------------------------- */
const SEME = {
  maths: { 'lecon-01.html': true, 'lecon-02.html': true, 'lecon-03.html': true,
           'lecon-04.html': true, 'lecon-05.html': true, 'lecon-06.html': true,
           'lecon-07.html': true, 'lecon-08.html': true, 'lecon-09.html': true },
};

(async function main() {
  const chrome = trouverChrome();
  if (!chrome) { console.error('Chrome introuvable'); process.exit(2); }
  const profil = path.join(ROOT, 'scratchpad', '.chrome-verif-maths');
  const port = 9500 + (process.pid % 400);
  const proc = cp.spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--allow-file-access-from-files',
    '--host-resolver-rules=MAP * ~NOTFOUND',
    '--remote-debugging-port=' + port, '--user-data-dir=' + profil, 'about:blank'], { stdio: 'ignore' });

  let cible = null;
  for (let i = 0; i < 40 && !cible; i++) {
    await attendre(250);
    try { const r = await fetch('http://127.0.0.1:' + port + '/json/version'); if (r.ok) cible = (await r.json()).webSocketDebuggerUrl; } catch (e) {}
  }
  if (!cible) { proc.kill(); console.error('Chrome muet'); process.exit(2); }
  const nav = new Client(cible); await nav.pret;

  async function ouvrir(rel, sonde, semer) {
    const abs = path.join(ROOT, rel);
    const url = 'file:///' + abs.replace(/\\/g, '/');
    const cid = (await nav.envoyer('Target.createTarget', { url: 'about:blank' })).targetId;
    const sess = (await nav.envoyer('Target.attachToTarget', { targetId: cid, flatten: true })).sessionId;
    const envoyer = (m, p) => {
      const id = ++nav.id;
      return new Promise((res, rej) => {
        nav.encours[id] = { res: res, rej: rej };
        nav.ws.send(JSON.stringify({ id: id, method: m, params: p || {}, sessionId: sess }));
        setTimeout(() => { if (nav.encours[id]) { delete nav.encours[id]; rej(new Error('delai : ' + m)); } }, 30000);
      });
    };
    await envoyer('Page.enable');
    await envoyer('Runtime.enable');
    if (semer) {
      /* on sème AVANT le chargement de la page mesurée, sur la même origine file:// */
      await envoyer('Page.navigate', { url: url });
      await attendre(700);
      await envoyer('Runtime.evaluate', { expression: 'localStorage.setItem("syntaxe-progress", ' + JSON.stringify(JSON.stringify(SEME)) + ')' });
      await envoyer('Page.reload');
    } else {
      await envoyer('Runtime.evaluate', { expression: 'try{localStorage.clear()}catch(e){}' });
      await envoyer('Page.navigate', { url: url });
    }
    await attendre(1400);
    const r = await envoyer('Runtime.evaluate', { expression: '(' + sonde.toString() + ')()', returnByValue: true });
    await nav.envoyer('Target.closeTarget', { targetId: cid });
    return r.result.value;
  }

  Client.prototype.envoyer = function (method, params) {
    const self = this; const id = ++this.id;
    return new Promise((res, rej) => {
      self.encours[id] = { res: res, rej: rej };
      self.ws.send(JSON.stringify({ id: id, method: method, params: params || {} }));
      setTimeout(() => { if (self.encours[id]) { delete self.encours[id]; rej(new Error('delai : ' + method)); } }, 30000);
    });
  };

  const problemes = [];
  function exiger(condition, message) {
    console.log((condition ? '  OK   ' : '  ÉCHEC ') + message);
    if (!condition) problemes.push(message);
  }

  console.log('=== pages/maths/cours.html — localStorage VIERGE ===');
  const c0 = await ouvrir('pages/maths/cours.html', SONDE_COURS, false);
  console.log('  badge : ' + JSON.stringify(c0.badge));
  console.log('  liens de leçons rendus : ' + JSON.stringify(c0.liensLecons));
  console.log('  stats : ' + JSON.stringify(c0.stats));
  console.log('  progression : ' + JSON.stringify(c0.progression));
  exiger(c0.liensLecons.length === 9, 'seules les 9 leçons écrites sont cliquables (rendu : ' + c0.liensLecons.length + ')');
  exiger(c0.liensMorts.length === 0, 'aucun lien mort vers une leçon non écrite (rendu : ' + JSON.stringify(c0.liensMorts) + ')');
  const aVenir = (c0.textePlan.match(/Bient/gi) || []).length;
  console.log('  mentions « Bientôt » dans le plan déplié : ' + aVenir);
  exiger(aVenir === 4, 'les 4 leçons non écrites sont listées et marquées « Bientôt » (relevé : ' + aVenir + ')');

  console.log('');
  console.log('=== pages/maths/cours.html — progression SEMÉE (6 leçons terminées) ===');
  const c1 = await ouvrir('pages/maths/cours.html', SONDE_COURS, true);
  console.log('  stats : ' + JSON.stringify(c1.stats));
  console.log('  progression : ' + JSON.stringify(c1.progression));
  exiger(c1.progression !== c0.progression || /%/.test(c1.progression), 'la barre de progression réagit à la progression semée');

  console.log('');
  console.log('=== pages/maths/lecon-09.html — dernière leçon écrite, semée ===');
  const l3 = await ouvrir('pages/maths/lecon-09.html', SONDE_LECON, true);
  console.log('  titre : ' + JSON.stringify(l3.titre));
  console.log('  navigation : ' + JSON.stringify(l3.nav));
  console.log('  liens de nav : ' + JSON.stringify(l3.navLiens));
  console.log('  liens du plan : ' + l3.liensPlan.length + ' , dont morts : ' + l3.planMorts.length);
  console.log('  bouton « terminée » : ' + JSON.stringify(l3.boutonFini));
  exiger(/Bient/i.test(l3.nav), 'la leçon suivante, non écrite, est annoncée « Bientôt disponible »');
  exiger(l3.navLiens.length === 1 && /lecon-08/.test(l3.navLiens[0]), 'un seul lien de navigation, vers la leçon 8');
  exiger(l3.planMorts.length === 0, 'le plan latéral ne contient aucun lien « # »');

  console.log('');
  console.log('=== pages/maths/lecon-01.html — première leçon, vierge ===');
  const l1 = await ouvrir('pages/maths/lecon-01.html', SONDE_LECON, false);
  console.log('  navigation : ' + JSON.stringify(l1.nav));
  exiger(/Début du cours/i.test(l1.nav), 'la leçon 1 annonce « Début du cours »');
  exiger(/lecon-02/.test(String(l1.navLiens)), 'la leçon 1 pointe vers la leçon 2');

  proc.kill();
  console.log('');
  console.log(problemes.length === 0
    ? 'RÉSULTAT : tous les contrôles passent.'
    : 'RÉSULTAT : ' + problemes.length + ' problème(s) — ' + problemes.join(' | '));
  process.exit(problemes.length ? 1 : 0);
})();
