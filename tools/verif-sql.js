'use strict';
/**
 * tools/verif-sql.js — Exécuter POUR DE VRAI les blocs SQL du site.
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * Depuis le 2026-08-26, `js/runner.js` pose un bouton « ▶ Exécuter » sur les blocs
 * `language-sql` et SQLite tourne en `file://`. Un bouton qui rend une erreur est pire
 * que pas de bouton : il faut donc savoir, pour chaque bloc, s'il aboutit contre la
 * base de démonstration que `runner.js` précharge.
 *
 * Le premier passage a montré à quoi sert ce contrôle : les leçons interrogent
 * `produits(nom, prix)` alors que la base de démonstration déclarait
 * `produits(id, libelle, prix, categorie)`. Le schéma avait été écrit dans `runner.js`
 * sans jamais être confronté aux leçons — il ne pouvait pas l'être, SQL ne s'exécutant
 * nulle part.
 *
 * Ce script utilise le MÊME moteur et le MÊME jeu de données que le navigateur : sql.js
 * embarqué dans `assets/vendor/sqljs/`, dont il décode le base64, et le bloc SEED_SQL
 * lu directement dans `js/runner.js` — pour qu'un écart entre les deux soit impossible.
 *
 *   node tools/verif-sql.js               # tous les blocs SQL du site
 *   node tools/verif-sql.js pages/sql     # un dossier
 *   node tools/verif-sql.js --erreurs     # ne lister que les blocs en échec
 * Code de sortie : 1 si la part de blocs aboutis passe sous le seuil (voir SEUIL).
 */
var fs = require('fs');
var path = require('path');

var RACINE = path.resolve(__dirname, '..');
/* Part minimale de blocs devant aboutir. On ne vise pas 100 % : beaucoup de blocs
   DÉMONTRENT une erreur (violation de contrainte, colonne absente) ou décrivent un
   schéma propre à leur leçon. Le seuil protège contre une régression du moteur ou de
   la base de démonstration, pas contre l'imperfection éditoriale. */
var SEUIL = 0.55;

var args = process.argv.slice(2);
var SEULEMENT_ERREURS = args.indexOf('--erreurs') !== -1;
var FIXER = args.indexOf('--fixer') !== -1;
var cibles = args.filter(function (a) { return a.indexOf('--') !== 0; });

/* --- LE CLIQUET, et pourquoi le seuil ne suffisait pas -------------------- *
 * Le point A3 du chantier V16 a eprouve cet outil par injection : une colonne
 * inexistante posee dans un bloc SELECT d'une lecon, et l'outil est reste VERT.
 * La raison est structurelle : il ne juge qu'une PROPORTION (seuil 55 %) et le
 * site est a 59,1 % — il faudrait casser treize blocs d'un coup pour le faire
 * rougir. Un tel outil mesure ; il ne verifie pas.
 * Le cliquet corrige cela sans toucher au seuil : le NOMBRE de blocs en erreur
 * ne doit jamais AUGMENTER. Ajouter une lecon dont les blocs aboutissent ne le
 * bouge pas ; en casser un seul le fait rougir. Quand des blocs sont repares,
 * `--fixer` redescend la reference — elle ne remonte jamais toute seule.
 * Le cliquet ne s'applique pas quand des cibles sont passees en argument : un
 * sous-ensemble n'est pas comparable a la reference du site entier. */
var ATTENDU = path.join(__dirname, 'verif-sql-attendu.json');

/* --- LES DÉMONSTRATIONS D'ERREUR, et pourquoi elles ne sont pas une exemption ------
 * Quatre blocs du cours bdd échouent PARCE QUE C'EST LA LEÇON : deux violations de
 * contrainte UNIQUE annoncées mot pour mot sous la requête, la table créée deux fois
 * pour comparer deux écritures d'une clé étrangère, et le « Cannot add a NOT NULL
 * column » du piège de migration. Les compter comme des pannes serait faux ; les
 * masquer serait pire.
 * Ce fichier de déclaration fait donc l'inverse d'une exemption : il CONTRAINT ces
 * blocs. Chacun doit échouer, et échouer AVEC LE MESSAGE DÉCLARÉ. S'il se met à
 * aboutir, ou à échouer autrement, l'outil sort en 1 — un contrôle que le cliquet ne
 * pouvait pas rendre, puisqu'il ne rougit qu'à la HAUSSE du nombre d'erreurs : une
 * démonstration qui cesse de démontrer FAIT BAISSER ce nombre, et passait donc pour
 * une bonne nouvelle. Ces blocs restent comptés dans « en erreur » et dans le cliquet. */
var DEMOS = path.join(__dirname, 'verif-sql-demonstrations.json');
function lireDemonstrations() {
  var brut;
  try { brut = JSON.parse(fs.readFileSync(DEMOS, 'utf8')); }
  catch (e) { console.error('verif-sql-demonstrations.json illisible : ' + e.message); process.exit(1); }
  var index = {};
  (brut.blocs || []).forEach(function (d) { index[d.fichier + '#' + d.bloc] = d; });
  return index;
}
var DEMONSTRATIONS = lireDemonstrations();

/* --- le SEED, lu dans runner.js pour qu'il ne puisse pas diverger ---------- */
function lireSeed() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('var SEED_SQL = [');
  if (i < 0) throw new Error('SEED_SQL introuvable dans js/runner.js');
  var j = src.indexOf('].join("\\n");', i);
  if (j < 0) throw new Error('fin de SEED_SQL introuvable');
  var corps = src.slice(i + 'var SEED_SQL = ['.length, j);
  var lignes = [];
  var re = /"((?:[^"\\]|\\.)*)"/g, m;
  while ((m = re.exec(corps))) lignes.push(JSON.parse('"' + m[1] + '"'));
  return lignes.join('\n');
}

/* Le filtre de dialecte est LU dans runner.js, jamais recopié : deux exemplaires
   d'une même règle finissent toujours par diverger, et ce vérificateur mesurerait
   alors autre chose que ce que voit l'apprenant. */
function lireFiltreDialecte() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/var AUTRE_SGBD = (\/[\s\S]*?\/i);/);
  if (!m) throw new Error('AUTRE_SGBD introuvable dans js/runner.js');
  return eval(m[1]); // une littérale d'expression régulière lue dans notre propre dépôt
}

/* Même principe pour la règle du seed : le motif qui repère les tables créées par un
   bloc est LU dans runner.js. Recopié, il aurait divergé au premier ajustement. */
function lireMotifTableCreee() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/var TABLE_CREEE = (\/[\s\S]*?\/i);/);
  if (!m) throw new Error('TABLE_CREEE introuvable dans js/runner.js');
  return eval(m[1]);
}

/* Et le motif des VUES : le Worker ne pose une vue du décor que si le bloc écrit son
   nom sans la définir (voir VUE_CREEE et SEED_VUES dans runner.js). Le motif ET la
   liste sont LUS, jamais recopiés — seul le geste est répété ici. */
function lireMotifVueCreee() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/var VUE_CREEE = (\/[\s\S]*?\/i);/);
  if (!m) throw new Error('VUE_CREEE introuvable dans js/runner.js');
  return eval(m[1]);
}
/* Et le motif des colonnes ajoutées : une leçon qui écrit `ALTER TABLE … ADD COLUMN c`
   voit `c` retirée du décor juste avant (voir COLONNE_AJOUTEE dans runner.js). */
function lireMotifColonneAjoutee() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/var COLONNE_AJOUTEE = (\/[\s\S]*?\/i);/);
  if (!m) throw new Error('COLONNE_AJOUTEE introuvable dans js/runner.js');
  return eval(m[1]);
}
function lireVuesDecor() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var i = src.indexOf('var SEED_VUES = [');
  if (i < 0) throw new Error('SEED_VUES introuvable dans js/runner.js');
  var j = src.indexOf('\n  ];', i);
  if (j < 0) throw new Error('fin de SEED_VUES introuvable');
  return eval('(' + src.slice(i + 'var SEED_VUES = '.length, j + 4) + ')');
}

/* Et le motif des commentaires SQL, pour la même raison : un `-- CREATE TABLE client`
   cité en rappel dans une leçon n'est pas une création de table. */
function lireMotifCommentaire() {
  var src = fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8');
  var m = src.match(/var COMMENTAIRE_SQL = (\/[\s\S]*?\/g);/);
  if (!m) throw new Error('COMMENTAIRE_SQL introuvable dans js/runner.js');
  return eval(m[1]);
}
var MOTIF_COMMENTAIRE = lireMotifCommentaire();
/* Un dialecte CITÉ dans un commentaire ne rend pas le bloc inexécutable : les deux
   décisions — poser un bouton, précharger la base — se prennent sur le code nu. */
function sansCommentaires(sql) {
  return String(sql).replace(new RegExp(MOTIF_COMMENTAIRE.source, 'g'), ' ');
}

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}

function blocsSql(fichier) {
  var src = fs.readFileSync(fichier, 'utf8');
  var out = [], re = /<code class="language-sql">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) out.push(dec(m[1]).trim());
  return out;
}

function lecons(cible) {
  var out = [];
  var base = cible ? path.resolve(RACINE, cible) : path.join(RACINE, 'pages');
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(base);
  return out.filter(function (f) { return /lecon-\d+\.html$/.test(f); });
}

/* La même règle que le Worker de runner.js, écrite une seule fois ici à partir du motif
   qui y est lu : la base de démonstration est posée SAUF si le bloc crée une table dont
   elle porte déjà le nom (auquel cas « table already exists » serait garanti). */
function faireRegleDuSeed(motif, seed) {
  var tablesSeed = [], re = new RegExp(motif.source, 'gi'), m;
  while ((m = re.exec(sansCommentaires(seed)))) tablesSeed.push(m[1].toLowerCase());
  return function (code) {
    var r = new RegExp(motif.source, 'gi'), x, c = sansCommentaires(code);
    while ((x = r.exec(c))) { if (tablesSeed.indexOf(x[1].toLowerCase()) !== -1) return false; }
    return true;
  };
}

var initSqlJs = require(path.join(RACINE, 'assets', 'vendor', 'sqljs', 'sql-wasm.js'));

/* Le binaire est décodé depuis le base64 du dépôt : pas de second exemplaire du .wasm
   à maintenir, et l'on vérifie du même coup que ce base64 est intact. */
var b64src = fs.readFileSync(path.join(RACINE, 'assets', 'vendor', 'sqljs', 'sql-wasm-base64.js'), 'utf8');
var mb = b64src.match(/self\.SQL_WASM_BASE64\s*=\s*"([A-Za-z0-9+/=]+)"/);
if (!mb) { console.error('base64 illisible dans sql-wasm-base64.js'); process.exit(1); }
var wasmBinary = Buffer.from(mb[1], 'base64');

initSqlJs({ wasmBinary: wasmBinary, locateFile: function (f) { return f; } }).then(function (SQL) {
  var SEED = lireSeed();
  var aBesoinDuSeed = faireRegleDuSeed(lireMotifTableCreee(), SEED);
  var MOTIF_VUE = lireMotifVueCreee();
  var VUES_DECOR = lireVuesDecor();
  var MOTIF_COLONNE = lireMotifColonneAjoutee();
  function colonnesAReprendre(code) {
    var re = new RegExp(MOTIF_COLONNE.source, 'gi'), m, nu = sansCommentaires(code), out = [];
    while ((m = re.exec(nu))) out.push([m[1], m[2]]);
    return out;
  }
  function vuesAPoser(code) {
    var nu = sansCommentaires(code), defini = [], re = new RegExp(MOTIF_VUE.source, 'gi'), m;
    while ((m = re.exec(nu))) defini.push(m[1].toLowerCase());
    return VUES_DECOR.filter(function (v) {
      if (defini.indexOf(v.nom.toLowerCase()) !== -1) return false;
      return new RegExp('\\b' + v.nom + '\\b', 'i').test(nu);
    });
  }
  var fichiers = [];
  if (cibles.length) cibles.forEach(function (c) { fichiers = fichiers.concat(lecons(c)); });
  else fichiers = lecons(null);

  var AUTRE_SGBD = lireFiltreDialecte();
  var total = 0, ok = 0, ko = 0, ecartes = 0;
  var demos = 0, demosCassees = [];
  var causes = {};
  var parCours = {};

  fichiers.forEach(function (f) {
    var rel = path.relative(RACINE, f).replace(/\\/g, '/');
    var cours = rel.split('/')[1];
    blocsSql(f).forEach(function (code, i) {
      /* Même filtre que runner.js : les pseudo-schémas sans verbe SQL n'ont pas de bouton. */
      if (!/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/i.test(code)) return;
      /* Un bloc écrit pour un autre SGBD ne reçoit pas de bouton : il ne compte donc
         ni dans les réussites ni dans les échecs, mais on le dénombre. */
      if (AUTRE_SGBD.test(sansCommentaires(code))) { ecartes++; return; }
      total++;
      parCours[cours] = parCours[cours] || { total: 0, ok: 0 };
      parCours[cours].total++;
      var db = new SQL.Database();
      try {
        if (aBesoinDuSeed(code)) db.exec(SEED);
        vuesAPoser(code).forEach(function (v) { try { db.exec(v.sql); } catch (e) {} });
        colonnesAReprendre(code).forEach(function (c) { try { db.exec('ALTER TABLE "' + c[0] + '" DROP COLUMN "' + c[1] + '"'); } catch (e) {} });
        db.exec(code);
        ok++; parCours[cours].ok++;
        /* Un bloc DÉCLARÉ comme démonstration d'erreur qui aboutit est une alerte, pas
           une bonne nouvelle : la page annonce un refus que la base ne produit plus. */
        if (DEMONSTRATIONS[rel + '#' + (i + 1)]) {
          demosCassees.push(rel + ' #' + (i + 1) + ' — ABOUTIT alors que la page annonce « ' +
            DEMONSTRATIONS[rel + '#' + (i + 1)].message + ' »');
          console.log('  !!  ' + rel + ' #' + (i + 1) + ' — DÉMONSTRATION MUETTE : le bloc aboutit');
        } else if (!SEULEMENT_ERREURS) console.log('  OK  ' + rel + ' #' + (i + 1));
      } catch (e) {
        ko++;
        var msg = String(e && e.message || e);
        var cle = msg.replace(/: .*/, '').replace(/"[^"]*"/g, '…');
        causes[cle] = (causes[cle] || 0) + 1;
        var demo = DEMONSTRATIONS[rel + '#' + (i + 1)];
        if (demo) {
          /* ⚠️ le compteur `demos` ne compte QUE les conformes : le premier jet
             l'incrémentait avant le test, si bien qu'un bloc dévié comptait deux fois
             (une ici, une dans `demosCassees`) et faisait rougir l'outil sur le mauvais
             message — « 5 rencontrés sur 4 déclarés » au lieu de « non conforme ».
             Trouvé en éprouvant le contrôle par injection, pas en le relisant. */
          if (msg.indexOf(demo.message) !== 0) {
            demosCassees.push(rel + ' #' + (i + 1) + ' — échoue « ' + msg.slice(0, 70) +
              ' » au lieu de « ' + demo.message + ' »');
            console.log('  !!  ' + rel + ' #' + (i + 1) + ' — DÉMONSTRATION DÉVIÉE — ' + msg.slice(0, 70));
          } else {
            demos++;
            console.log('  DEM ' + rel + ' #' + (i + 1) + ' — ' + msg.slice(0, 70) + '  (attendu)');
          }
        } else {
          console.log('  KO  ' + rel + ' #' + (i + 1) + ' — ' + msg.slice(0, 90));
        }
      }
      try { db.close(); } catch (e) {}
    });
  });

  var part = total ? ok / total : 1;
  console.log('\n=== RÉSUMÉ ===');
  console.log('  blocs SQL avec bouton ... ' + total);
  console.log('  écartés (autre SGBD) .... ' + ecartes);
  console.log('  aboutissent ............. ' + ok + '  (' + (100 * part).toFixed(1) + ' %)');
  console.log('  en erreur ............... ' + ko +
    (demos ? '  (dont ' + demos + ' demonstration(s) voulue(s))' : ''));
  console.log('\n--- par cours ---');
  Object.keys(parCours).sort(function (a, b) { return parCours[b].total - parCours[a].total; })
    .forEach(function (c) {
      var p = parCours[c];
      console.log('  ' + c.padEnd(14) + String(p.ok).padStart(4) + ' / ' + String(p.total).padStart(4) +
        '  (' + (100 * p.ok / p.total).toFixed(0) + ' %)');
    });
  console.log('\n--- causes d\'échec ---');
  Object.entries(causes).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 12)
    .forEach(function (e) { console.log('  ' + String(e[1]).padStart(4) + '  ' + e[0]); });

  /* Le contrôle des démonstrations passe AVANT le seuil et avant le cliquet : c'est le
     seul qui voie une leçon cesser de démontrer ce qu'elle annonce. */
  var declarees = Object.keys(DEMONSTRATIONS).length;
  var vues = demos + demosCassees.length;
  if (!cibles.length && vues !== declarees) {
    console.log('\nDEMONSTRATIONS : ' + vues + ' bloc(s) rencontre(s) sur ' + declarees +
      ' declare(s) dans verif-sql-demonstrations.json. Un bloc declare a disparu, change de ' +
      'numero, ou est desormais ecarte du bouton — la declaration ne correspond plus au site.');
    process.exit(1);
  }
  if (demosCassees.length) {
    console.log('\nDEMONSTRATIONS D ERREUR NON CONFORMES : ' + demosCassees.length);
    demosCassees.forEach(function (d) { console.log('  x ' + d); });
    console.log('  La page annonce un refus de la base. Si le bloc aboutit, ou echoue autrement,');
    console.log('  le bouton contredit le texte : corriger la page OU la declaration.');
    process.exit(1);
  }
  if (demos) console.log('\n  ' + demos + ' demonstration(s) d erreur conforme(s) a leur declaration.');

  if (part < SEUIL) {
    console.log('\nSOUS LE SEUIL de ' + (100 * SEUIL).toFixed(0) + ' % — le moteur ou la base de démonstration a régressé.');
    process.exit(1);
  }
  console.log('\nAu-dessus du seuil de ' + (100 * SEUIL).toFixed(0) + ' %.');

  /* le cliquet : voir le commentaire en tete de fichier */
  if (cibles.length) { console.log('  (cliquet inactif : des cibles ont ete passees en argument)'); return; }
  if (FIXER) {
    fs.writeFileSync(ATTENDU, JSON.stringify({ ko: ko, total: total,
      note: 'Nombre de blocs SQL en erreur au dernier releve. Il ne doit jamais augmenter. ' +
            'Le descendre apres une reparation : node tools/verif-sql.js --fixer' }, null, 2) + String.fromCharCode(10), 'utf8');
    console.log('  cliquet fixe a ' + ko + ' bloc(s) en erreur sur ' + total + '.');
    return;
  }
  var ref = null;
  try { ref = JSON.parse(fs.readFileSync(ATTENDU, 'utf8')); } catch (e) { ref = null; }
  if (!ref) { console.log('  (aucune reference de cliquet : node tools/verif-sql.js --fixer)'); return; }
  if (ko > ref.ko) {
    console.log(String.fromCharCode(10) +
      'CLIQUET : ' + ko + ' bloc(s) en erreur contre ' + ref.ko + ' a la reference, soit ' +
      (ko - ref.ko) + ' de plus. Un bloc SQL qui aboutissait est tombe en erreur.');
    process.exit(1);
  }
  if (ko < ref.ko) {
    console.log('  cliquet : ' + ko + ' en erreur contre ' + ref.ko + ' attendus, soit ' +
      (ref.ko - ko) + ' de moins. Descendre la reference : node tools/verif-sql.js --fixer');
    return;
  }
  console.log('  cliquet : ' + ko + ' bloc(s) en erreur, comme a la reference.');
}).catch(function (e) {
  console.error('sql.js n\'a pas pu se charger : ' + (e && e.message || e));
  process.exit(1);
});
