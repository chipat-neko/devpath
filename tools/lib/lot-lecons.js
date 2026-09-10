'use strict';
/**
 * tools/lib/lot-lecons.js — CHOISIR LES LEÇONS QU'UNE PREUVE PAR NAVIGATEUR VA OUVRIR.
 *
 * POURQUOI CE FICHIER EXISTE (2026-09-10, chantier V17, point B4)
 * --------------------------------------------------------------
 * Les deux preuves du seul fonctionnement qui compte — l'apprenant qui écrit sa
 * réponse et clique « Vérifier » — étaient hors de tous les modes de `verif.js`, et
 * pour une raison honnête, écrite dans `tools/hors-chaine.json` : lancées nues, elles
 * n'ouvrent RIEN, et leur passe complète ouvre 265 puis 447 leçons dans Chrome, une
 * par une. Les brancher telles quelles aurait mis une heure et demie dans une chaîne
 * qui en dure déjà quatre en `--complet`.
 *
 * CE QUE FAIT CE MODULE, ET RIEN D'AUTRE : il rend la liste des leçons ÉLIGIBLES
 * (celles qui portent vraiment le type d'exercice visé), triées de la plus récemment
 * modifiée à la plus ancienne, tronquée à N. C'est le « lot tournant » que la dette
 * écrite dans `hors-chaine.json` réclamait.
 *
 * POURQUOI LA DATE DE MODIFICATION, ET PAS UN TIRAGE AU SORT NI LE JOUR DU MOIS.
 * Un échantillon tiré au hasard rend le verdict non reproductible : rouge aujourd'hui,
 * vert demain sans qu'une ligne ait changé, ce qui est exactement le défaut mesuré au
 * point A9. Une rotation sur la date du jour a le même vice. La date de modification,
 * elle, désigne CE QU'ON VIENT DE TOUCHER — c'est-à-dire là où une régression a une
 * chance d'être, et la réponse est la même tant que le dépôt ne bouge pas.
 * ⚠️ SA LIMITE, ÉCRITE ICI PLUTÔT QUE DÉCOUVERTE PLUS TARD : après un `git clone`, tous
 * les fichiers portent la même date, et le lot se réduit alors à l'ordre alphabétique.
 * Il reste déterministe et utile ; il ne cible plus rien de particulier. La passe
 * `--tout` reste la couverture réelle, et c'est elle qu'une fin de chantier lance.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');

/* Toutes les leçons du site, chemins relatifs à la racine, séparateur `/`. */
function toutesLesLecons() {
  var out = [];
  var base = path.join(RACINE, 'pages');
  fs.readdirSync(base).forEach(function (d) {
    var dir = path.join(base, d);
    var st;
    try { st = fs.statSync(dir); } catch (e) { return; }
    if (!st.isDirectory()) return;
    fs.readdirSync(dir).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      out.push(path.relative(RACINE, path.join(dir, f)).replace(/\\/g, '/'));
    });
  });
  return out;
}

/**
 * eligibles(predicat) — les leçons dont le SOURCE satisfait `predicat(html, chemin)`.
 * Le prédicat lit le fichier tel quel : c'est à l'appelant de dire ce qu'il cherche
 * (`"type":"code"`, `"type":"text"`…), et il n'y a donc aucune règle recopiée ici.
 */
function eligibles(predicat) {
  return toutesLesLecons().filter(function (rel) {
    var h;
    try { h = fs.readFileSync(path.join(RACINE, rel), 'utf8'); } catch (e) { return false; }
    return !!predicat(h, rel);
  });
}

/**
 * lot(liste, n) — les `n` plus récemment modifiées, à égalité de date l'ordre des
 * chemins (donc stable). `n` ≤ 0 ou absent : la liste entière, triée pareil.
 */
function lot(liste, n) {
  var avecDate = liste.map(function (rel) {
    var t = 0;
    try { t = fs.statSync(path.join(RACINE, rel)).mtimeMs; } catch (e) { t = 0; }
    return { rel: rel, t: t };
  });
  avecDate.sort(function (a, b) { return b.t - a.t || (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0); });
  var pris = (n && n > 0) ? avecDate.slice(0, n) : avecDate;
  return pris.map(function (x) { return x.rel; });
}

/** Lit `--echantillon=N` dans une liste d'arguments. Rend 0 si absent ou illisible. */
function tailleDemandee(args) {
  var a = (args || []).filter(function (x) { return String(x).indexOf('--echantillon=') === 0; })[0];
  if (!a) return 0;
  var n = Number(String(a).split('=')[1]);
  return isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

module.exports = { RACINE: RACINE, toutesLesLecons: toutesLesLecons, eligibles: eligibles,
                   lot: lot, tailleDemandee: tailleDemandee };
