#!/usr/bin/env node
// Lit l'utilisation REELLE de l'abonnement, celle qu'affiche /usage dans Claude Code.
//
// Source : GET https://api.anthropic.com/api/oauth/usage, avec le jeton OAuth deja
// present sur la machine (~/.claude/.credentials.json, cle claudeAiOauth). C'est le
// meme appel que fait le binaire (fonction fetchUtilization). Le jeton ne part que
// vers l'API d'Anthropic, son destinataire legitime, et n'est jamais journalise.
//
//   node tools/usage-anthropic.js pct     -> le pourcentage hebdomadaire, seul (pour le wrapper)
//   node tools/usage-anthropic.js reset   -> la date ISO de remise a zero hebdomadaire
//   node tools/usage-anthropic.js etat    -> lecture humaine
//
// Code de sortie : 0 si la lecture a abouti, 1 sinon. UN ECHEC NE DOIT JAMAIS BLOQUER
// L'AUTONOMIE : le jeton peut etre expire entre deux passes (claude.exe le rafraichit
// lui-meme a chaque lancement), et une panne reseau ne doit pas etre lue comme un quota
// epuise. L'appelant traite le code 1 comme une absence d'information, pas comme un stop.

const fs = require('fs');
const https = require('https');
const path = require('path');
const CRED  = 'C:/Users/chipat/.claude/.credentials.json';
const CACHE = path.resolve(__dirname, '..', '.autonomie', 'usage-cache.json');
const FRAIS_MIN = 10;      // en dessous, on se contente du cache : inutile de rappeler l'API
const SECOURS_H = 6;       // au dela, un cache est trop vieux pour decider quoi que ce soit

// L'API repond HTTP 429 si on l'interroge trop souvent — constate le 2026-08-26 apres
// sept appels en quelques minutes. Le verrou ne doit ni marteler l'API, ni rester aveugle
// quand elle refuse : d'ou ce cache disque, lu avant l'appel et servi en secours apres.
function litCache() {
  try {
    const c = JSON.parse(fs.readFileSync(CACHE, 'utf8'));
    if (!c || typeof c.pct !== 'number' || !c.t) return null;
    return { ...c, ageMin: (Date.now() - c.t) / 60000 };
  } catch { return null; }
}
function ecritCache(pct, reset) {
  try {
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    fs.writeFileSync(CACHE, JSON.stringify({ t: Date.now(), pct, reset }), 'utf8');
  } catch {}
}

function jeton() {
  const c = JSON.parse(fs.readFileSync(CRED, 'utf8')).claudeAiOauth;
  if (!c || !c.accessToken) throw new Error('aucun jeton claudeAiOauth');
  if (c.expiresAt && c.expiresAt <= Date.now()) throw new Error('jeton expire');
  return c;
}

function lit() {
  return new Promise((ok, ko) => {
    let c; try { c = jeton(); } catch (e) { return ko(e); }
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/api/oauth/usage', method: 'GET', timeout: 15000,
      headers: { Authorization: 'Bearer ' + c.accessToken, 'Content-Type': 'application/json', 'anthropic-beta': 'oauth-2025-04-20' },
    }, res => {
      let d = '';
      res.on('data', x => d += x);
      res.on('end', () => {
        if (res.statusCode !== 200) return ko(new Error('HTTP ' + res.statusCode));
        try { ok(JSON.parse(d)); } catch (e) { ko(new Error('reponse illisible')); }
      });
    });
    req.on('timeout', () => { req.destroy(); ko(new Error('delai depasse')); });
    req.on('error', e => ko(new Error(e.message)));
    req.end();
  });
}

(async () => {
  const cmd = process.argv[2] || 'etat';

  // Cache tout frais : on repond sans toucher au reseau.
  const c0 = litCache();
  if (c0 && c0.ageMin < FRAIS_MIN && cmd !== 'etat') {
    if (cmd === 'pct')   { console.log(c0.pct); return; }
    if (cmd === 'reset') { console.log(c0.reset || ''); return; }
    if (cmd === 'duo')   { console.log(c0.pct + '|' + (c0.reset || '')); return; }
  }

  let u;
  try {
    u = await lit();
  } catch (e) {
    // L'API a refuse (429, jeton expire, reseau). Un cache recent vaut mieux que rien ;
    // au dela de SECOURS_H, on prefere avouer qu'on ne sait pas.
    const c = litCache();
    if (c && c.ageMin < SECOURS_H * 60) {
      const min = Math.round(c.ageMin);
      if (cmd === 'pct')   { console.log(c.pct); return; }
      if (cmd === 'reset') { console.log(c.reset || ''); return; }
      if (cmd === 'duo')   { console.log(c.pct + '|' + (c.reset || '')); return; }
      console.log(`  (API indisponible : ${e.message}) dernier releve il y a ${min} min : ${c.pct} %`);
      return;
    }
    throw e;
  }
  ecritCache(Math.round((u.seven_day || {}).utilization ?? -1), (u.seven_day || {}).resets_at || '');
  const sept = u.seven_day || {};
  const cinq = u.five_hour || {};

  if (cmd === 'pct')   { console.log(Math.round(sept.utilization ?? -1)); return; }
  if (cmd === 'reset') { console.log(sept.resets_at || ''); return; }
  if (cmd === 'duo')   { console.log(Math.round(sept.utilization ?? -1) + '|' + (sept.resets_at || '')); return; }

  const fr = iso => iso ? new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '?';
  console.log(`  abonnement        : ${JSON.parse(fs.readFileSync(CRED,'utf8')).claudeAiOauth.subscriptionType}`);
  console.log(`  HEBDOMADAIRE      : ${sept.utilization} %   remise a zero le ${fr(sept.resets_at)}`);
  console.log(`  fenetre de 5 h    : ${cinq.utilization} %   remise a zero le ${fr(cinq.resets_at)}`);
  for (const l of u.limits || []) {
    if (l.percent == null) continue;
    console.log(`  [${l.kind}] ${l.percent} % — ${l.severity}${l.is_active ? ' — ACTIVE' : ''}`);
  }
})().catch(e => { console.error('usage-anthropic : ' + e.message); process.exit(1); });
