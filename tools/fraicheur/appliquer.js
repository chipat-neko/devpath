/* appliquer.js — POSER LES MARQUES DE FRAÎCHEUR, SANS MOTIF TROP LARGE.

   POURQUOI CET OUTIL. La règle du chantier dit qu'« un motif de remplacement
   trop large casse ce qui était juste » : un même segment de texte apparaît
   souvent plusieurs fois dans une page pour des raisons différentes. Cet outil
   refuse donc de travailler dès que l'ancre n'est pas trouvée EXACTEMENT UNE
   FOIS, et il refuse d'écrire quoi que ce soit si un seul remplacement du lot
   est douteux : c'est tout le lot ou rien.

   IL REFUSE AUSSI, et c'est le plus utile :
     – une ancre qui tombe dans un bloc de code, un <pre>, un <code>, un
       <script> ou un bloc JSON (data-quiz, data-exos, data-quiz-bilan) ;
     – une ancre qui tombe dans un attribut HTML (title=, content=, alt=) ;
     – une ancre à cheval sur une balise (balises non appariées à l'intérieur) ;
     – une date au mauvais format, ou dans le futur.

   USAGE :  node tools/fraicheur/appliquer.js <lot.json> [--write]
   Le lot est un tableau d'objets { fichier, ancre, arrete, duree? }.
   Sans --write, il ne fait que le contrôle (mode par défaut, comme
   tools/build-index.js).                                                    */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', '..');

/* Les zones où une balise n'a rien à faire : on y refuse toute marque.
   ⚠ DEUX contrôles distincts, et la première version les confondait : elle
   traitait « toute balise » comme une zone à ne pas CHEVAUCHER, et refusait
   donc l'ancre parfaitement légitime « … sont <strong>Next.js</strong> et
   <strong>React Router</strong> ». Une ancre peut CONTENIR des balises entières
   (si elles sont appariées) ; ce qu'elle ne peut pas, c'est COMMENCER ou FINIR
   au milieu d'une balise — c'est-à-dire dans un attribut. */
function zonesInterdites(html) {
  const zones = [];
  const motifs = [
    /<figure class="code-block"[\s\S]*?<\/figure>/gi,
    /<pre[\s\S]*?<\/pre>/gi,
    /<script[\s\S]*?<\/script>/gi,
    /<head[\s\S]*?<\/head>/i,
    /data-(?:quiz|exos|quiz-bilan|flashcards)="[\s\S]*?"/gi,
  ];
  for (const re of motifs) {
    let m;
    const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    while ((m = r.exec(html))) zones.push([m.index, m.index + m[0].length]);
  }
  return zones;
}

/* Le code INLINE (<code>…</code> dans une phrase) est un cas à part, et la
   première version le traitait comme un bloc de code : elle refusait donc
   « La plupart des applications React ont ainsi un <code>ThemeContext</code> »,
   qui est de la PROSE contenant un identifiant. La bonne règle : on refuse une
   ancre CONTENUE dans un <code> (marquer l'intérieur d'un identifiant n'a pas
   de sens et se battrait avec la coloration syntaxique), on accepte une ancre
   qui en CONTIENT un. */
function codesInline(html) {
  const out = [];
  let m;
  const re = /<code[\s\S]*?<\/code>/gi;
  while ((m = re.exec(html))) out.push([m.index, m.index + m[0].length]);
  return out;
}

/* Une marque DEJA posee : y reposer une marque produirait une imbrication
   silencieuse (<span class="fraicheur"><span class="fraicheur">…) que le rendu
   compterait deux fois. Cas rencontre des la premiere application : l'ancre
   proposee etait une sous-chaine d'une marque existante. */
function marquesExistantes(html) {
  const out = [];
  let m;
  const re = /<span class="fraicheur"[^>]*>[\s\S]*?<\/span>/gi;
  while ((m = re.exec(html))) out.push([m.index, m.index + m[0].length]);
  return out;
}

function contenuDans(zones, deb, fin) {
  return zones.some(function (z) { return deb >= z[0] && fin <= z[1]; });
}

/* Les balises elles-mêmes : une BORNE d'ancre posée dedans casserait le HTML. */
function balises(html) {
  const out = [];
  let t;
  const re = /<\/?[a-zA-Z][^>]*>/g;
  while ((t = re.exec(html))) out.push([t.index, t.index + t[0].length]);
  return out;
}

function dansZone(zones, deb, fin) {
  return zones.some(function (z) { return deb < z[1] && fin > z[0]; });
}

function borneDansBalise(bals, deb, fin) {
  return bals.some(function (z) {
    return (deb > z[0] && deb < z[1]) || (fin > z[0] && fin < z[1]);
  });
}

/* Une ancre à cheval sur une balise produirait du HTML invalide. */
function balisesAppariees(fragment) {
  const pile = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let m;
  const auto = /^(br|img|hr|input|meta|link|source|wbr)$/i;
  while ((m = re.exec(fragment))) {
    const nom = m[2].toLowerCase();
    if (auto.test(nom) || /\/\s*$/.test(m[3])) continue;
    if (m[1]) { if (pile.pop() !== nom) return false; }
    else pile.push(nom);
  }
  return pile.length === 0;
}

function verifierDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return 'format attendu AAAA-MM-JJ';
  const d = new Date(iso + 'T12:00:00Z');
  if (isNaN(d.getTime())) return 'date impossible';
  if (d.getTime() > Date.now() + 86400000) return 'date dans le futur';
  /* « 2026-02-31 » donne une date VALIDE décalée au 3 mars : on le refuse. */
  if (d.toISOString().slice(0, 10) !== iso) return 'jour inexistant dans ce mois';
  return null;
}

function appliquer(lot, ecrire) {
  const parFichier = {};
  for (const e of lot) (parFichier[e.fichier] = parFichier[e.fichier] || []).push(e);

  const erreurs = [];
  const sorties = {};
  let poses = 0;

  for (const rel of Object.keys(parFichier)) {
    const abs = path.join(RACINE, rel);
    if (!fs.existsSync(abs)) { erreurs.push(rel + ' : fichier introuvable'); continue; }
    let html = fs.readFileSync(abs, 'utf8');
    const zones = zonesInterdites(html);
    const bals = balises(html);
    const codes = codesInline(html);
    const deja = marquesExistantes(html);
    /* Hors de l'article, la marque est bien rendue mais le BILAN de fin de page
       ne peut pas la lister : elle devient invisible à qui ne survole pas. Vu
       une fois, sur un objectif pédagogique du <header> (react/lecon-19). */
    const art = /<article class="prose"[\s\S]*?<\/article>/.exec(html);
    /* On applique de la fin vers le début : les index restent valables. */
    const trouves = [];
    for (const e of parFichier[rel]) {
      const pbDate = verifierDate(e.arrete);
      if (pbDate) { erreurs.push(rel + ' : « ' + e.ancre.slice(0, 40) + ' » — ' + pbDate); continue; }
      if (e.duree !== undefined && !(Number.isInteger(e.duree) && e.duree > 0)) {
        erreurs.push(rel + ' : « ' + e.ancre.slice(0, 40) + ' » — data-duree doit être un entier positif');
        continue;
      }
      const n = html.split(e.ancre).length - 1;
      if (n !== 1) {
        erreurs.push(rel + ' : ancre trouvée ' + n + ' fois (il en faut exactement 1) — « ' +
          e.ancre.slice(0, 60) + ' »');
        continue;
      }
      const deb = html.indexOf(e.ancre);
      const fin = deb + e.ancre.length;
      if (dansZone(zones, deb, fin)) {
        erreurs.push(rel + ' : ancre dans un bloc de code, un <head> ou un bloc JSON — « ' +
          e.ancre.slice(0, 60) + ' »');
        continue;
      }
      if (art && (deb < art.index || fin > art.index + art[0].length)) {
        erreurs.push(rel + ' : ancre hors de <article class="prose"> — le bilan de fin de page ' +
          'ne pourrait pas la lister — « ' + e.ancre.slice(0, 60) + ' »');
        continue;
      }
      if (dansZone(deja, deb, fin)) {
        erreurs.push(rel + ' : ancre qui recoupe une marque deja posee — « ' + e.ancre.slice(0, 60) + ' »');
        continue;
      }
      if (contenuDans(codes, deb, fin)) {
        erreurs.push(rel + ' : ancre à l’intérieur d’un <code> — « ' + e.ancre.slice(0, 60) + ' »');
        continue;
      }
      if (borneDansBalise(bals, deb, fin)) {
        erreurs.push(rel + ' : ancre qui commence ou finit à l’intérieur d’une balise (attribut) — « ' +
          e.ancre.slice(0, 60) + ' »');
        continue;
      }
      if (!balisesAppariees(e.ancre)) {
        erreurs.push(rel + ' : ancre à cheval sur une balise — « ' + e.ancre.slice(0, 60) + ' »');
        continue;
      }
      trouves.push({ deb: deb, fin: fin, e: e });
    }
    trouves.sort(function (a, b) { return b.deb - a.deb; });
    for (const t of trouves) {
      const attrs = ' class="fraicheur" data-arrete="' + t.e.arrete + '"' +
        (t.e.duree ? ' data-duree="' + t.e.duree + '"' : '');
      html = html.slice(0, t.deb) + '<span' + attrs + '>' + t.e.ancre + '</span>' + html.slice(t.fin);
      poses++;
    }
    sorties[abs] = html;
  }

  if (erreurs.length) {
    console.log('REFUSÉ — ' + erreurs.length + ' problème(s), RIEN n’a été écrit :');
    for (const x of erreurs) console.log('  · ' + x);
    return { ok: false, poses: 0, erreurs: erreurs.length };
  }
  if (ecrire) {
    for (const abs of Object.keys(sorties)) fs.writeFileSync(abs, sorties[abs]);
  }
  console.log((ecrire ? 'ÉCRIT' : 'CONTRÔLE OK (ajoute --write pour écrire)') + ' — ' +
    poses + ' marque(s) sur ' + Object.keys(sorties).length + ' fichier(s).');
  return { ok: true, poses: poses, erreurs: 0 };
}

if (require.main === module) {
  const f = process.argv[2];
  if (!f) { console.error('usage : node tools/fraicheur/appliquer.js <lot.json> [--write]'); process.exit(2); }
  const lot = JSON.parse(fs.readFileSync(f, 'utf8'));
  const r = appliquer(lot, process.argv.includes('--write'));
  process.exit(r.ok ? 0 : 1);
}

module.exports = { appliquer, zonesInterdites, balises, codesInline, marquesExistantes, balisesAppariees, verifierDate };
