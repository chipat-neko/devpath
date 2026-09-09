'use strict';
/**
 * tools/preuves/sonde-heritage-navigateur.js — MESURER avant d'écrire une règle.
 *
 * Le point B2b-7 laisse 131 blocs en panne, dont les causes de tête sont des noms
 * (`bouton`, `ctx`, `form`, `element`, `canvas`) que le bloc n'a pas déclarés et que le
 * repli ne peut pas fournir : ils viennent d'un bloc PRÉCÉDENT de la leçon qui a été
 * ÉCARTÉ comme code de navigateur (`document.querySelector`, `HTMLElement`…), donc absent
 * du préambule. L'hypothèse à mesurer : « un bloc dont le nom manquant est déclaré par un
 * bloc précédent écarté comme code de navigateur est lui-même du code de navigateur ».
 *
 * Cette sonde ne modifie RIEN. Elle désigne les blocs visés par plusieurs variantes du
 * critère et, pour chacun, EXÉCUTE le bloc (avec le repli du moteur) pour dire s'il est
 * aujourd'hui VIVANT. Une variante qui vise un bloc vivant est une variante qui retire un
 * bouton qui marche : c'est le seul verdict qui compte.
 *
 *   node tools/preuves/sonde-heritage-navigateur.js            # tableau des variantes
 *   node tools/preuves/sonde-heritage-navigateur.js --liste    # le détail des visés
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var RACINE = path.resolve(__dirname, '..', '..');
var LISTE = process.argv.indexOf('--liste') !== -1;

/* Les règles sont LUES dans runner.js, jamais recopiées (même discipline que verif-js.js). */
function srcRunner() { return fs.readFileSync(path.join(RACINE, 'js', 'runner.js'), 'utf8'); }
function lireMotif(nom) {
  var m = srcRunner().match(new RegExp('var ' + nom + ' = (/[\\s\\S]*?/);'));
  if (!m) throw new Error(nom + ' introuvable dans js/runner.js');
  return eval(m[1]);
}
function lireFonction(nom) {
  var src = srcRunner();
  var i = src.indexOf('function ' + nom + '(');
  if (i < 0) throw new Error(nom + ' introuvable dans js/runner.js');
  var j = src.indexOf('\n  }', i);
  if (j < 0) throw new Error('fin de ' + nom + ' introuvable');
  return eval('(' + src.slice(i, j + 4) + ')');
}
var BROWSER_ONLY = lireMotif('BROWSER_ONLY');
var estUnFichierJson = lireFonction('estUnFichierJson');
var estUneSuiteDeTests = lireFonction('estUneSuiteDeTests');
var estUnFragmentServeur = lireFonction('estUnFragmentServeur');
var estDuDomDePage = lireFonction('estDuDomDePage');
var estUnServiceWorker = lireFonction('estUnServiceWorker');
var neCompilePas = lireFonction('neCompilePas');
var meriteUnRepli = lireFonction('meriteUnRepli');
var heriteDuNavigateur = lireFonction('heriteDuNavigateur');
var envelopperPourRepli = lireFonction('envelopperPourRepli');
var preambuleQuiCompile = lireFonction('preambuleQuiCompile');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) {
    var attrs = m[1] || '';
    var df = attrs.match(/data-file="([^"]*)"/);
    out.push({ code: dec(m[2]).trim(), fichier: df ? df[1] : '' });
  }
  return out;
}
function lecons() {
  var out = [];
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/lecon-\d+\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(path.join(RACINE, 'pages'));
  return out;
}

/* Le contexte du Worker, copié de verif-js.js (il n'est pas exportable : verif-js est un
   script, pas un module). Toute divergence rendrait la mesure incomparable. */
var GLOBALES_WORKER = ['TextEncoder', 'TextDecoder', 'performance', 'EventTarget', 'Event',
  'CustomEvent',
  'URL', 'URLSearchParams', 'Blob', 'AbortController', 'AbortSignal', 'ReadableStream',
  'WritableStream', 'TransformStream', 'FormData', 'Headers', 'Request', 'Response',
  'atob', 'btoa', 'PerformanceObserver', 'crypto', 'DOMException', 'MessageChannel',
  'BroadcastChannel', 'CompressionStream', 'DecompressionStream'];
function fmtArgs(a) {
  return Array.prototype.slice.call(a).map(function (v) {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'function') return String(v);
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }).join(' ');
}
function contexteWorker(sorties) {
  var faux = function () {};
  var ctx = {
    console: {
      log: function () { sorties.push(fmtArgs(arguments)); },
      info: function () { sorties.push(fmtArgs(arguments)); },
      debug: function () { sorties.push(fmtArgs(arguments)); },
      warn: function () { sorties.push(fmtArgs(arguments)); },
      error: function () { sorties.push(fmtArgs(arguments)); },
      table: faux, group: faux, groupEnd: faux, time: faux, timeEnd: faux, dir: faux
    },
    setTimeout: function (f) { try { if (typeof f === 'function') f(); } catch (e) {} return 0; },
    setInterval: function () { return 0; },
    clearTimeout: faux, clearInterval: faux,
    queueMicrotask: function (f) { try { f(); } catch (e) {} },
    /* Le VRAI clonage structure, pas un JSON.parse(JSON.stringify) : la contrefacon
       jette sur un cycle et perd Date/Set/Map, ce qui faisait declarer en panne un bloc
       que l apprenant voit marcher (point B2b-13). Node le fournit depuis la v17. */
    structuredClone: globalThis.structuredClone,
    self: null, globalThis: null
  };
  GLOBALES_WORKER.forEach(function (n) {
    if (typeof globalThis[n] !== 'undefined') ctx[n] = globalThis[n];
  });
  ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}
/* ⚠️ CETTE SONDE MOURAIT AVANT SA DERNIÈRE LIGNE (constaté le 2026-09-09, point B2b-13),
   et sa version d'origine dans le dépôt le fait aussi — ce n'est donc pas une régression
   du jour. Un bloc qui `await fetch(...)` rejette une promesse que personne n'attend :
   Node tue alors le processus, et le `try/catch` autour de `runInContext` n'y peut rien,
   puisque le rejet survient après le tour de boucle. La sonde s'arrêtait au milieu de son
   dernier tableau, en imprimant une pile — un instrument qui meurt en route rend une
   mesure PARTIELLE avec l'air d'une panne d'outil. Un Worker de navigateur, lui, ne meurt
   pas sur un rejet non géré : ignorer ces rejets est donc aussi le comportement FIDÈLE. */
process.on('unhandledRejection', function () {});
var DELAI = 5000;
var ERREUR_ANNONCEE = /\/\/[^\n]*\b(erreur|Erreur|ERREUR|throw|lève|leve|refuse|rejett?e|échoue|echoue|plante|invalide)\b/;

/* Exécute un bloc comme le moteur : seul, puis en repli derrière son préambule. */
function etat(code, prefixe) {
  var sorties = [];
  var ctx = vm.createContext(contexteWorker(sorties));
  var msg = null;
  try { vm.runInContext(code, ctx, { timeout: DELAI, displayErrors: false }); }
  catch (e) { msg = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e)); }
  if (msg && /timed out/i.test(msg)) return { statut: 'indecis', msg: msg };
  if (msg && prefixe.length && meriteUnRepli(msg)) {
    var gardes = preambuleQuiCompile(prefixe, code);
    if (gardes.length) {
      var s2 = [], brut = contexteWorker(s2), avant = 0;
      brut.__finDuPrelude = function () { avant = s2.length; };
      var ctx2 = vm.createContext(brut);
      var msg2 = null;
      try {
        vm.runInContext(gardes.join('\n') + '\n;__finDuPrelude();\n' + envelopperPourRepli(code), ctx2,
          { timeout: DELAI, displayErrors: false });
      } catch (e2) { msg2 = (e2 && e2.name ? e2.name + ': ' : '') + (e2 && e2.message ? e2.message : String(e2)); }
      if (!msg2) return { statut: 'vivant', lignes: s2.length - avant, repli: true };
    }
  }
  if (!msg) return { statut: 'vivant', lignes: sorties.length, repli: false };
  if (ERREUR_ANNONCEE.test(code)) return { statut: 'annoncee', msg: msg };
  return { statut: 'panne', msg: msg };
}

/* --- LES NOMS QU'UN BLOC DÉCLARE À SON NIVEAU RACINE -------------------------------
 * Colonne zéro : la leçon du point B2b-3. Une déclaration indentée est locale à une
 * fonction ou à un bloc, elle ne peut rien fournir au bloc suivant de la leçon. */
function nomsDeclaresRacine(texte) {
  var noms = [];
  var re = /^(?:const|let|var|function|class)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm;
  var m;
  while ((m = re.exec(texte))) {
    /* colonne zéro seulement : m.index doit être un début de ligne sans indentation */
    if (m.index === 0 || texte[m.index - 1] === '\n') noms.push(m[1]);
  }
  /* `function*`/`async function` en colonne zéro */
  var re2 = /^async\s+function\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/gm;
  while ((m = re2.exec(texte))) {
    if (m.index === 0 || texte[m.index - 1] === '\n') noms.push(m[1]);
  }
  return noms;
}
/* Version large : toute déclaration, indentation permise (variante à comparer). */
function nomsDeclaresPartout(texte) {
  var noms = [], m;
  var re = /(?:^|[^\w$.À-ɏ])(?:const|let|var|function|class)\s+([A-Za-z_$À-ɏ][\w$À-ɏ]*)/g;
  while ((m = re.exec(texte))) noms.push(m[1]);
  return noms;
}

function ech(nom) { return nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function utilise(texte, nom) {
  return new RegExp('(?:^|[^\\w$.À-ɏ])' + ech(nom) + '(?![\\w$À-ɏ])').test(texte);
}
/* USAGE EN COLONNE ZÉRO : le nom ouvre une ligne, donc il est évalué au niveau racine du
   bloc — l'erreur est alors CERTAINE dès le clic. Cité dans le corps d'une fonction qui
   n'est jamais appelée, le même nom ne fait rien échouer du tout : c'est toute la
   différence entre un bouton mort et un bouton qui aboutit sans rien afficher. */
function utiliseEnColonneZero(texte, nom) {
  return new RegExp('^' + ech(nom) + '(?![\\w$À-ɏ])', 'm').test(texte);
}
/* USAGE AU NIVEAU RACINE (2026-09-09, point B2b-25) : la colonne zéro ci-dessus est SÛRE
   mais très étroite — elle ne voit que le nom qui OUVRE une ligne. Or `rendre(etat)`,
   `if (modeGomme) {` ou `const cases = grille.querySelectorAll(…)` sont eux aussi évalués
   dès le clic, et l'erreur y est tout aussi certaine ; seule la colonne les rate. Le
   critère mesuré ici est la PROFONDEUR D'ACCOLADES : le nom cité alors qu'aucune accolade
   n'est ouverte est exécuté au niveau racine du bloc. Cité dans un corps de fonction
   (profondeur ≥ 1), il ne fait rien échouer tant que la fonction n'est pas appelée — c'est
   la distinction que la mesure de B2b-8 avait imposée, et elle est conservée.
   ⚠️ Commentaires et chaînes sont neutralisés caractère par caractère, comme dans
   `estUnFragmentOrphelin` : un mot de commentaire ou de gabarit n'est pas du code. */
function neutraliser(texte) {
  var t = String(texte)
    .replace(/\/\*[\s\S]*?\*\//g, function (m) { return m.replace(/[^\n]/g, ' '); })
    .replace(/(^|[^:\\])\/\/[^\n]*/g, function (m, p) { return p + m.slice(p.length).replace(/[^\n]/g, ' '); });
  var net = '', i = 0, n = t.length;
  while (i < n) {
    var c = t[i];
    if (c === '"' || c === "'" || c === '`') {
      var q = c, prof = 0;
      net += ' '; i++;
      while (i < n) {
        if (t[i] === '\\') { net += '  '; i += 2; continue; }
        if (q === '`' && t[i] === '$' && t[i + 1] === '{') { prof++; net += '  '; i += 2; continue; }
        if (q === '`' && prof > 0 && t[i] === '}') { prof--; net += ' '; i++; continue; }
        if (prof > 0) { net += t[i]; i++; continue; }   /* le code d'un ${…} reste du code */
        if (t[i] === q) { net += ' '; i++; break; }
        net += (t[i] === '\n' ? '\n' : ' '); i++;
      }
      continue;
    }
    net += c; i++;
  }
  return net;
}
/* LES LISTES DE PARAMÈTRES (B2b-25). `function rendre(etat) { … }` cite `etat` à
   profondeur 0 d'accolades, mais ce n'est PAS une lecture : c'est une liaison, et le nom
   du dehors n'y est pour rien. Trois des dix vivants visés par la variante brute sont
   exactement cela (`projets-js/lecon-02` #3, `nodejs/lecon-09` #12, `nodejs/lecon-23` #6).
   On blanchit donc le contenu des parenthèses qui suivent `function`/`catch` et de celles
   qu'un `=>` suit. */
function neutraliserParametres(t) {
  var out = t.split(''), i;
  for (i = 0; i < t.length; i++) {
    if (t[i] !== '(') continue;
    var avant = t.slice(0, i);
    var estParam = /(?:function\s*[\w$À-ɏ]*\s*|catch\s*)$/.test(avant);
    /* la fermante correspondante */
    var prof = 0, j = i;
    for (; j < t.length; j++) {
      if (t[j] === '(') prof++;
      else if (t[j] === ')') { prof--; if (prof === 0) break; }
    }
    if (j >= t.length) continue;
    if (!estParam && /^\s*=>/.test(t.slice(j + 1))) estParam = true;
    if (!estParam) continue;
    for (var k = i + 1; k < j; k++) if (out[k] !== '\n') out[k] = ' ';
  }
  return out.join('');
}
function utiliseAuNiveauRacine(texte, nom, sansParams) {
  var t = neutraliser(texte);
  if (sansParams) t = neutraliserParametres(t);
  var re = new RegExp('(?:^|[^\\w$.À-ɏ])' + ech(nom) + '(?![\\w$À-ɏ])', 'g');
  var m;
  while ((m = re.exec(t))) {
    var pos = m.index + m[0].length - nom.length;
    var prof = 0;
    for (var k = 0; k < pos; k++) {
      if (t[k] === '{') prof++;
      else if (t[k] === '}') prof--;
    }
    if (prof <= 0) return true;
  }
  return false;
}
function declareLuiMeme(texte, nom) {
  return new RegExp('(?:const|let|var|function|class)\\s+' + nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w$À-ɏ])').test(texte) ||
         new RegExp('(?:^|[^\\w$.À-ɏ])' + nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*=(?!=)').test(texte);
}

/* Les variantes du critère. Chacune dit, pour un bloc, quels noms elle considère comme
   hérités d'un bloc navigateur précédent. */
var VARIANTES = [
  { cle: 'large', libelle: 'décl. colonne 0, usage n\'importe où', racine: true, col0: false },
  { cle: 'partout', libelle: 'décl. n\'importe où, usage n\'importe où', racine: false, col0: false },
  { cle: 'col0', libelle: 'décl. colonne 0, USAGE en colonne 0', racine: true, col0: true },
  { cle: 'col0-partout', libelle: 'décl. n\'importe où, USAGE en colonne 0', racine: false, col0: true },
  { cle: 'col0-cascade', libelle: 'idem col0, mais EN CASCADE (l\'écarté transmet)', racine: true, col0: true, cascade: true },
  /* B2b-25 : entre « n'importe où » (31 vivants) et « colonne 0 » (0 vivant), la
     profondeur d'accolades nulle. */
  { cle: 'racine0', libelle: 'décl. colonne 0, usage à PROFONDEUR 0', racine: true, prof0: true },
  { cle: 'racine0-tous-ecartes', libelle: 'idem racine0, source = TOUT bloc écarté', racine: true, prof0: true, tous: true },
  { cle: 'racine0-p', libelle: 'racine0 + paramètres neutralisés', racine: true, prof0: true, params: true },
  { cle: 'racine0-pr', libelle: 'racine0 + paramètres + hors portée du repli', racine: true, prof0: true, params: true, sansRepli: true },
  /* ⚠️ LA VARIANTE QUI COMPTE UNE FOIS LA RÈGLE ÉCRITE : celle qui est LUE dans
     `js/runner.js`. Les quatre ci-dessus sont des maquettes de cette sonde ; seule
     celle-ci prouve que la fonction RÉELLEMENT posée dans le moteur vise ce qui a été
     mesuré. Une maquette qui dit 27/0 pendant que le moteur en vise d'autres, c'est le
     défaut fondateur du chantier. */
  { cle: 'runner', libelle: 'la règle LUE dans js/runner.js', lue: true },
  /* PISTE B2b-9 : et si la source n'était pas seulement un bloc de NAVIGATEUR, mais
     n'importe quel bloc écarté (fichier JSON, suite de tests, fragment de serveur, bloc
     qui ne compile pas) ? Même critère de colonne zéro, source élargie. */
  { cle: 'col0-tous-ecartes', libelle: 'col0/col0, source = TOUT bloc écarté', racine: true, col0: true, tous: true }
];
var resultat = {};
VARIANTES.forEach(function (v) { resultat[v.cle] = { vises: [], vivants: [], pannes: 0 }; });

var fichiers = lecons();
fichiers.forEach(function (f) {
  var rel = path.relative(RACINE, f).replace(/\\/g, '/');
  var blocs = blocsJs(f).filter(function (b, i) { b.n = i + 1; return true; });
  /* Première passe : qui a un bouton, qui est écarté et pour quelle raison. */
  blocs.forEach(function (b) {
    if (!b.code) { b.raison = 'vide'; return; }
    if (BROWSER_ONLY.test(b.code)) b.raison = 'navigateur';
    else if (estDuDomDePage(b.code)) b.raison = 'navigateur';
    else if (estUnFichierJson(b.code)) b.raison = 'json';
    else if (estUneSuiteDeTests(b.code)) b.raison = 'tests';
    else if (estUnFragmentServeur(b.code)) b.raison = 'serveur';
    else if (estUnServiceWorker(b.code)) b.raison = 'sw';
    else if (neCompilePas(b.code)) b.raison = 'noncompile';
    else b.raison = 'bouton';
  });
  var aBouton = blocs.filter(function (b) { return b.raison === 'bouton'; }).map(function (b) { return b.code; });

  VARIANTES.forEach(function (v) {
    var offerts = [];   // { nom, source }
    var navAvant = [];  // les textes, pour la règle lue dans runner.js
    var vus = 0;
    blocs.forEach(function (b) {
      if (!b.code) return;
      if (b.raison === 'navigateur' || (v.tous && b.raison !== 'bouton')) {
        navAvant.push(b.code);
        (v.racine ? nomsDeclaresRacine(b.code) : nomsDeclaresPartout(b.code)).forEach(function (n) {
          offerts.push({ nom: n, source: b.n });
        });
        return;
      }
      if (b.raison !== 'bouton') return;
      var prefixe = aBouton.slice(0, vus);
      vus++;
      var herites;
      if (v.lue) {
        herites = heriteDuNavigateur(b.code, navAvant) ? [{ nom: 'lue' }] : [];
      } else {
        herites = offerts.filter(function (o) {
          var vu = v.prof0 ? utiliseAuNiveauRacine(b.code, o.nom, v.params)
                 : v.col0 ? utiliseEnColonneZero(b.code, o.nom)
                 : utilise(b.code, o.nom);
          if (!vu || declareLuiMeme(b.code, o.nom)) return false;
          /* LE REPLI PEUT LE FOURNIR (B2b-25) : un nom que déclare AUSSI un bloc à bouton
             précédent n'est pas manquant du tout — le préambule le donne, et le bloc vit.
             Trois des dix vivants de la variante brute sont là (`compilation/lecon-13`). */
          if (v.sansRepli) {
            for (var p = 0; p < prefixe.length; p++) {
              if (nomsDeclaresRacine(prefixe[p]).indexOf(o.nom) >= 0) return false;
            }
          }
          return true;
        });
      }
      if (!herites.length) return;
      /* EN CASCADE : le bloc qu'on vient d'écarter devient à son tour une source de noms
         pour les suivants. Mesuré séparément — une cascade peut gagner des blocs, mais
         elle peut aussi emporter un vivant, et c'est ce qu'il faut savoir avant. */
      if (v.cascade) {
        nomsDeclaresRacine(b.code).forEach(function (n) { offerts.push({ nom: n, source: b.n }); });
      }
      var e = etat(b.code, prefixe);
      var ligne = rel + ' #' + b.n + '  [' + herites.map(function (o) { return o.nom; }).join(', ') + ']  → ' + e.statut +
        (e.statut === 'vivant' ? ' (' + e.lignes + ' ligne(s)' + (e.repli ? ', par repli' : '') + ')' : '');
      resultat[v.cle].vises.push(ligne);
      if (e.statut === 'vivant') resultat[v.cle].vivants.push(ligne);
      if (e.statut === 'panne') resultat[v.cle].pannes++;
    });
  });
});

console.log('=== HÉRITAGE DU NAVIGATEUR : les variantes du critère ===\n');
console.log('  ' + 'variante'.padEnd(46) + 'visés  dont en panne  dont VIVANTS');
VARIANTES.forEach(function (v) {
  var r = resultat[v.cle];
  console.log('  ' + v.libelle.padEnd(46) + String(r.vises.length).padStart(5) +
    String(r.pannes).padStart(14) + String(r.vivants.length).padStart(14));
});
console.log('\n(un VIVANT visé = un bouton qui marche et qu\'on retirerait : rédhibitoire)');

VARIANTES.forEach(function (v) {
  var r = resultat[v.cle];
  if (r.vivants.length) {
    console.log('\n--- ' + v.cle + ' : LES VIVANTS VISÉS ---');
    r.vivants.forEach(function (l) { console.log('   ' + l); });
  }
});
if (LISTE) {
  VARIANTES.forEach(function (v) {
    console.log('\n--- ' + v.cle + ' : tous les visés (' + resultat[v.cle].vises.length + ') ---');
    resultat[v.cle].vises.forEach(function (l) { console.log('   ' + l); });
  });
}
