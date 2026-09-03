/* tools/maths/verite/groupe-3.js — leçons 07 et 08 recalculées par une autre méthode.
   =================================================================================
   V15 · point F2 · groupe 3.

   RÈGLE DU FICHIER. Rien de ce qui est publié dans les leçons n'est exécuté, requis
   ni recopié ici : le code du cours n'est qu'une chose à CONTREDIRE. Chaque fait est
   d'abord recalculé par un chemin volontairement différent de celui de la page —

     · primalité : essai de TOUS les diviseurs, jamais la fonction de la leçon ;
     · comptes du crible : formules fermées (somme sur les premiers de ⌊N/p⌋ − p + 1)
       là où la page raye les cases une par une ;
     · PGCD : intersection des ensembles de diviseurs pour les petits nombres, et une
       seconde implémentation d'Euclide écrite ici pour les grands ;
     · Bézout : recalcul de a·u + b·v à partir des u et v PUBLIÉS, en BigInt ;
     · inverses modulaires : balayage exhaustif de 1 à m − 1 ;
     · exponentiation modulaire : multiplication répétée en BigInt (et, pour les
       exposants de neuf chiffres, un découpage en paliers de 1000 — jamais le
       parcours binaire de l'exposant, qui est justement ce que la page enseigne) ;
     · flottants : l'arrondi au double le plus proche est refait en BigInt, bit à bit ;
     · clés de contrôle : recalculées d'après la SPÉCIFICATION que la page énonce
       (Luhn : poids alternés 1 et 2 depuis la droite, retrancher 9 au-delà de 9 ;
       ISBN-13 : poids alternés 1 et 3 ; IBAN : permutation, A = 10 … Z = 35, mod 97),
       ce qui vérifie du même coup que sa spécification et son code se rejoignent.

   La valeur de référence est TOUJOURS calculée avant d'ouvrir la page ; la valeur
   publiée est lue ensuite ; on compare. Aucun contrôle ne prend son attendu dans le
   HTML. Un contrôle qui ne retrouve pas la ligne qu'il cherche échoue : le vert par
   absence serait pire que le rouge.

   Chaque entrée rendue regroupe les vérifications d'un même fait (une table, un
   relevé, un encadré) : le compte entre crochets dit combien de comparaisons elle
   porte, et le détail nomme celles qui divergent.
*/
'use strict';
const L = require('./lib.js');

/* ================================================================
   1. OUTILS ARITHMÉTIQUES — tous écrits ici, aucun emprunt au cours
   ================================================================ */

/* Primalité par essai de tous les diviseurs. La seule méthode employée dans ce
   fichier pour décider qu'un nombre est premier. */
function premier(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/* Divisions d'essai comptées comme les compte une factorisation naïve : on
   s'arrête au premier diviseur trouvé, sinon à la racine. */
function divisionsJusquAuFacteur(n) {
  let c = 0;
  for (let d = 2; d * d <= n; d++) { c++; if (n % d === 0) break; }
  return c;
}

/* Le plus petit diviseur ≥ 2, ou n lui-même. */
function plusPetitFacteur(n) {
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
  return n;
}

function racineEntiere(n) {
  let r = Math.floor(Math.sqrt(n));
  while (r * r > n) r--;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}

/* PGCD par intersection des ensembles de diviseurs : la méthode la plus bête qui
   soit, et donc la plus difficile à contester. Réservée aux petits nombres. */
function pgcdParDiviseurs(a, b) {
  const petit = Math.min(a, b);
  let g = 1;
  for (let d = 1; d <= petit; d++) if (a % d === 0 && b % d === 0) g = d;
  return g;
}

/* Seconde implémentation d'Euclide, écrite ici, avec son compte d'étapes. */
function euclide(a, b) {
  let etapes = 0;
  while (b !== 0) { etapes++; const t = a % b; a = b; b = t; }
  return { pgcd: a, etapes: etapes };
}
function euclideBig(a, b) {
  let etapes = 0;
  while (b !== 0n) { etapes++; const t = a % b; a = b; b = t; }
  return { pgcd: a, etapes: etapes };
}
/* La version d'origine, par soustractions répétées. */
function euclideSoustraction(a, b) {
  let etapes = 0;
  while (a !== b) { etapes++; if (a > b) a -= b; else b -= a; }
  return { pgcd: a, etapes: etapes };
}

/* Inverse modulaire par BALAYAGE EXHAUSTIF de 1 à m − 1. */
function inverseBalayage(a, m) {
  const A = a % m;
  for (let x = 1; x < m; x++) if ((A * x) % m === 1) return x;
  return null;
}

/* Exponentiation modulaire par multiplication répétée, en BigInt. */
function puissanceNaive(base, exposant, m) {
  const M = BigInt(m);
  const b = BigInt(base) % M;
  let r = 1n;
  for (let i = 0; i < exposant; i++) r = (r * b) % M;
  return r;
}
/* Pour les exposants de neuf chiffres : découpage en paliers de 1000, chaque
   palier étant lui-même une multiplication répétée. Ce n'est PAS le parcours
   binaire de l'exposant qu'enseigne la leçon ; le contrôle de Diffie-Hellman
   vérifie d'ailleurs que les deux routes d'ici se rejoignent avant de s'en servir. */
function puissanceParPaliers(base, exposant, m) {
  if (exposant <= 1000) return puissanceNaive(base, exposant, m);
  const q = Math.floor(exposant / 1000);
  const r = exposant % 1000;
  const socle = puissanceNaive(base, 1000, m);
  return (puissanceParPaliers(socle, q, m) * puissanceNaive(base, r, m)) % BigInt(m);
}
/* Multiplication répétée en Number : licite tant que m² tient sous 2^53. */
function puissancePetite(a, e, m) {
  let r = 1;
  const b = a % m;
  for (let i = 0; i < e; i++) r = (r * b) % m;
  return r;
}

/* L'arrondi IEEE-754 au double le plus proche, refait en entiers exacts : on
   coupe la mantisse à 53 bits et on arrondit au plus proche, à égalité au pair.
   Aucun flottant n'intervient, donc aucun risque d'emprunter la réponse. */
function arrondiDouble(v) {
  const l = v.toString(2).length;
  if (l <= 53) return v;
  const pas = 1n << BigInt(l - 53);
  const q = v / pas, r = v % pas, moitie = pas >> 1n;
  if (r > moitie) return (q + 1n) * pas;
  if (r < moitie) return q * pas;
  return (q % 2n === 0n ? q : q + 1n) * pas;
}
function racineEntiereBig(v) {
  let x = v, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + v / x) / 2n; }
  return x;
}

/* Crible maison, uniquement pour LISTER des premiers là où la page compte des
   rayures : les comptes de rayures, eux, sont refaits par formule fermée. */
let CACHE_PREMIERS = null;
function premiersJusqua(n) {
  if (!CACHE_PREMIERS || CACHE_PREMIERS.borne < n) {
    const c = new Uint8Array(n + 1);
    const p = [];
    for (let i = 2; i <= n; i++) {
      if (!c[i]) { p.push(i); for (let j = i * i; j <= n; j += i) c[j] = 1; }
    }
    CACHE_PREMIERS = { borne: n, liste: p };
  }
  const out = [];
  for (const p of CACHE_PREMIERS.liste) { if (p > n) break; out.push(p); }
  return out;
}
function pi(n) { return premiersJusqua(n).length; }

/* Le nombre de rayures d'un crible, PAR FORMULE : pour chaque premier p ≤ √N, il
   y a ⌊N/p⌋ − p + 1 multiples rayés à partir de p² ; et ⌊N/p⌋ − 1 si l'on part
   de 2p. Aucune case n'est rayée ici : on compte. */
function rayuresDepuisPP(N) {
  let s = 0;
  for (const p of premiersJusqua(Math.floor(Math.sqrt(N)))) s += Math.floor(N / p) - p + 1;
  return s;
}
function rayuresDepuis2P(N) {
  let s = 0;
  for (const p of premiersJusqua(N)) s += Math.floor(N / p) - 1;
  return s;
}

/* Miller-Rabin, écrit ici. Il n'existe pas d'autre route pour juger un test de
   Miller-Rabin que d'en refaire un ; la confrontation, elle, se fait contre
   l'essai de tous les diviseurs, et sur TOUT l'intervalle jusqu'au premier
   désaccord — ce qui est plus fort que ce que la page mesure. */
function puissanceMR(a, e, m) {           /* m < 2^26 : les produits restent exacts */
  let r = 1; a %= m;
  while (e > 0) { if (e % 2 === 1) r = (r * a) % m; a = (a * a) % m; e = Math.floor(e / 2); }
  return r;
}
function millerRabin(n, bases) {
  if (n < 2) return false;
  let d = n - 1, s = 0;
  while (d % 2 === 0) { d /= 2; s++; }
  for (const a of bases) {
    if (a % n === 0) continue;
    let x = puissanceMR(a, d, n);
    if (x === 1 || x === n - 1) continue;
    let compose = true;
    for (let i = 1; i < s; i++) { x = (x * x) % n; if (x === n - 1) { compose = false; break; } }
    if (compose) return false;
  }
  return true;
}

/* Les nombres de Carmichael sous 20 000, par force brute : un composé qui ment
   pour TOUTES les bases premières avec lui. */
let CACHE_CARMICHAEL = null;
function carmichaelSous20000() {
  if (CACHE_CARMICHAEL) return CACHE_CARMICHAEL;
  const out = [];
  for (let n = 3; n < 20000; n += 2) {
    if (premier(n)) continue;
    let toutes = true;
    for (let a = 2; a < n && toutes; a++) {
      if (euclide(a, n).pgcd !== 1) continue;
      if (puissancePetite(a, n - 1, n) !== 1) toutes = false;
    }
    if (toutes) out.push(n);
  }
  CACHE_CARMICHAEL = out;
  return out;
}

/* Les composés sous 5 000 qui passent le test de Fermat en base 2. On énumère
   TOUS les entiers, pas seulement les impairs. */
let CACHE_MENTEURS = null;
function menteursBase2() {
  if (CACHE_MENTEURS) return CACHE_MENTEURS;
  const m = [];
  for (let n = 2; n < 5000; n++) {
    if (premier(n)) continue;
    if (puissancePetite(2, n - 1, n) === 1) m.push(n);
  }
  CACHE_MENTEURS = m;
  return m;
}

/* Les 82 premiers à partir de 1009 et les 40 clés que la page construit avec,
   reconstruits d'après la spécification qu'elle énonce. */
function clesReconstruites() {
  const p = [];
  for (let n = 1009; p.length < 82; n++) if (premier(n)) p.push(n);
  const cles = [];
  for (let i = 0; i < 40; i++) cles.push(p[2 * i] * p[2 * i + 1]);
  cles[12] = p[24] * p[80];
  cles[29] = p[24] * p[81];
  return { premiers: p, cles: cles };
}

/* Générateur déterministe maison, pour les contrôles statistiques. */
function xorshift(graine) {
  let x = graine >>> 0;
  return function () {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5; x >>>= 0;
    return x;
  };
}

/* Les poids des deux clés de contrôle, tels que la page les ÉNONCE. */
const IDENTITE = function (x) { return x; };
const DOUBLE = function (x) { const c = 2 * x; return c > 9 ? c - 9 : c; };
const TRIPLE = function (x) { return 3 * x; };

/* Un échange de deux chiffres voisins est-il vu ? On énumère les 90 échanges de
   deux chiffres DISTINCTS et on regarde si la somme pondérée bouge. */
function theorieVoisins(poidsA, poidsB) {
  let detectes = 0;
  const manquees = {};
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      if (a === b) continue;
      if ((poidsA(a) + poidsB(b)) % 10 !== (poidsA(b) + poidsB(a)) % 10) detectes++;
      else manquees[[a, b].sort().join('')] = 1;
    }
  }
  return {
    detectes: detectes,
    taux: (100 * detectes / 90).toFixed(2),
    passent: 90 - detectes,
    manquees: Object.keys(manquees).sort().join(' ')
  };
}

/* ================================================================
   2. OUTILS DE LECTURE ET DE COMPARAISON
   ================================================================ */

/* Un nombre publié : espaces (y compris insécables) ôtés, virgule décimale
   ramenée au point, signe « moins » typographique ramené au tiret. */
function nettoie(s) {
  return String(s)
    .replace(/[\s  ]/g, '')
    .replace(/−/g, '-')
    .replace(/,/g, '.');
}
function mots(s) { return String(s).replace(/[\s ]+/g, ' ').trim(); }

/* LE contrat de comparaison : l'attendu est déjà calculé quand on arrive ici ;
   on lit, on compare, et l'absence de la ligne est un échec. */
function poser(r, nom, attendu, src, re, quoi) {
  const m = re.exec(src);
  if (!m) { r.push({ nom: nom, ok: false, detail: 'ligne introuvable : ' + quoi }); return; }
  const pub = m.slice(1).map(nettoie).join(' | ');
  const att = [].concat(attendu).map(function (x) { return nettoie(String(x)); }).join(' | ');
  r.push({
    nom: nom, ok: pub === att,
    detail: pub === att ? '' : 'recalcule « ' + att + ' » ; publie « ' + pub + ' » (' + quoi + ')'
  });
}
/* Même contrat, mais sur du texte libre (listes de nombres, mots). */
function poserTexte(r, nom, attendu, src, re, quoi) {
  const m = re.exec(src);
  if (!m) { r.push({ nom: nom, ok: false, detail: 'ligne introuvable : ' + quoi }); return; }
  const pub = m.slice(1).map(mots).join(' | ');
  const att = [].concat(attendu).map(function (x) { return mots(String(x)); }).join(' | ');
  r.push({
    nom: nom, ok: pub === att,
    detail: pub === att ? '' : 'recalcule « ' + att + ' » ; publie « ' + pub + ' » (' + quoi + ')'
  });
}
/* Pour un tableau entier : on rejoue toutes ses lignes d'un coup. */
function poserLignes(r, nom, attendu, src, reGlobale, quoi) {
  const lues = [];
  let m;
  reGlobale.lastIndex = 0;
  while ((m = reGlobale.exec(src))) lues.push(m.slice(1).map(nettoie).join(' '));
  if (!lues.length) { r.push({ nom: nom, ok: false, detail: 'ligne introuvable : ' + quoi }); return; }
  const att = attendu.map(function (l) {
    return l.map(function (x) { return nettoie(String(x)); }).join(' ');
  });
  if (lues.length !== att.length) {
    r.push({
      nom: nom, ok: false,
      detail: 'recalcule ' + att.length + ' ligne(s), la page en publie ' + lues.length + ' (' + quoi + ')'
    });
    return;
  }
  const ecarts = [];
  for (let i = 0; i < att.length; i++) {
    if (att[i] !== lues[i]) ecarts.push('recalcule « ' + att[i] + ' » ; publie « ' + lues[i] + ' »');
  }
  r.push({ nom: nom, ok: !ecarts.length, detail: ecarts.join(' ; ') });
}
/* Un encadrement, pour les grandeurs d'échantillon qu'on ne peut que borner. */
function poserIntervalle(r, nom, src, re, quoi, bas, haut, commentaire) {
  const m = re.exec(src);
  if (!m) { r.push({ nom: nom, ok: false, detail: 'ligne introuvable : ' + quoi }); return; }
  const v = Number(nettoie(m[1]));
  const ok = v >= bas && v <= haut;
  r.push({
    nom: nom, ok: ok,
    detail: ok ? '' : 'publie ' + v + ', hors de l intervalle recalcule [' + bas + ' ; ' + haut + '] — ' + commentaire
  });
}

/* Un contrôle rendu = un fait de la page, et toutes les comparaisons qu'il
   demande. Le paramètre de fn s'appelle aussi `r` : les poseurs ci-dessus
   remplissent donc la liste locale, jamais la liste finale. */
function bloc(sortie, nom, fn) {
  const local = [];
  const suffixe = fn(local);
  const echecs = local.filter(function (c) { return !c.ok; });
  sortie.push({
    nom: nom + (suffixe ? ' ' + suffixe : '') + '  [' + (local.length - echecs.length) + '/' + local.length + ']',
    ok: local.length > 0 && !echecs.length,
    detail: !local.length ? 'aucune verification produite'
      : echecs.map(function (c) { return c.nom + (c.detail ? ' — ' + c.detail : ''); }).join(' ; ')
  });
}

/* ================================================================
   3. LES CONTRÔLES
   ================================================================ */

function controles() {
  const R = [];

  /* Les blocs sont exigés présents dès maintenant : une faute de nom doit
     arrêter le groupe, pas le verdir. */
  const b7 = {
    signe: L.sortie(7, 'modulo-signe.txt'),
    cong: L.sortie(7, 'congruences.txt'),
    cle: L.sortie(7, 'cle-controle.txt'),
    expo: L.sortie(7, 'exponentiation.txt'),
    deb: L.sortie(7, 'debordement.txt'),
    rep: L.sortie(7, 'repartition.txt'),
    s1: L.sortie(7, 'solution-1.txt'),
    s2: L.sortie(7, 'solution-2.txt'),
    s3: L.sortie(7, 'solution-3.txt')
  };
  const b8 = {
    prim: L.sortie(8, 'primalite.txt'),
    crible: L.sortie(8, 'crible.txt'),
    eucl: L.sortie(8, 'euclide.txt'),
    ext: L.sortie(8, 'euclide-etendu.txt'),
    cles: L.sortie(8, 'cles-partagees.txt'),
    fact: L.sortie(8, 'factoriser.txt'),
    fermat: L.sortie(8, 'fermat.txt'),
    s4: L.sortie(8, 'solution-4.txt'),
    s5: L.sortie(8, 'solution-5.txt'),
    s6: L.sortie(8, 'solution-6.txt')
  };
  const p7 = L.texte(7);
  const p8 = L.texte(8);

  /* Certains blocs portent DEUX tableaux de même forme : on les sépare pour ne
     jamais comparer l'un avec l'autre. */
  const repStructure = b7.rep.split('1000 AUTRES')[0];
  const cleLuhn = b7.cle.split('ISBN-13')[0];
  const cleIsbn = b7.cle.split('ISBN-13')[1] || '';
  const factA = b8.fact.split('chiffres du semi-premier')[0];
  const factB = b8.fact.split('chiffres du semi-premier')[1] || '';
  const extInverses = b8.ext.split(/inverse\s+controle/)[1] || '';

  /* ---------------------------------------------------------------
     LEÇON 7 — modulo, congruences, clés de contrôle, exponentiation
     --------------------------------------------------------------- */

  /* 1. La table des restes, recalculée sans jamais écrire « % » : le reste
     tronqué vaut n − m·trunc(n/m), le modulo mathématique s'en déduit. */
  bloc(R, 'lecon 07 · les onze restes de -5 a 5 modulo 3, recalcules par troncature vers zero',
    function (r) {
      const att = [], restes = [], modulos = [];
      for (let n = -5; n <= 5; n++) {
        const t = n - 3 * Math.trunc(n / 3);
        const reste = t === 0 ? 0 : t;
        const modulo = reste < 0 ? reste + 3 : reste;
        att.push([n, reste, modulo]);
        if (restes.indexOf(reste) === -1) restes.push(reste);
        if (modulos.indexOf(modulo) === -1) modulos.push(modulo);
      }
      restes.sort(function (a, b) { return a - b; });
      modulos.sort(function (a, b) { return a - b; });
      poserLignes(r, 'les onze lignes', att, b7.signe,
        /^\s*(-?\d+)\s+(-?\d+)\s+(\d+)\s*$/gm, 'tableau de modulo-signe.txt');
      poserTexte(r, 'les valeurs distinctes de part et d autre',
        [restes.join(', '), modulos.join(', '), String(restes.length), String(modulos.length)],
        b7.signe,
        /valeurs prises par n % 3\s*:\s*([^\n]+)\n\s*valeurs prises par modulo\(n,3\):\s*([^\n]+)\n\s*valeurs d index distinctes produites\s*:\s*(\d+) contre (\d+) seaux/,
        'les deux ensembles de valeurs');
      const tampon = ['A', 'B', 'C'];
      const brut = -1 - 3 * Math.trunc(-1 / 3);
      const juste = brut < 0 ? brut + 3 : brut;
      poserTexte(r, 'l index de tableau, hors bornes puis correct',
        [brut >= 0 && brut < 3 ? tampon[brut] : 'undefined', tampon[juste]], b7.signe,
        /tampon\[\(0 - 1\) % 3\] = (\S+)[\s\S]*?tampon\[modulo\(0 - 1, 3\)\] = (\S+)/,
        'les deux dernieres lignes de modulo-signe.txt');
      return '(' + restes.length + ' valeurs contre ' + modulos.length + ')';
    });

  /* 2. La table des langages : −7 % 3 vaut −1 par troncature vers zéro, 2 par
     division plancher, 2 en mathématiques. */
  bloc(R, 'lecon 07 · -7 % 3 selon la convention : troncature vers zero contre division plancher',
    function (r) {
      const tronque = -7 - 3 * Math.trunc(-7 / 3);
      const plancher = -7 - 3 * Math.floor(-7 / 3);
      poser(r, 'les trois lignes du tableau des langages', [tronque, plancher, plancher], p7,
        /C\+\+11\s*(−?-?\d+)\s*signe du dividende[\s\S]*?Python, Ruby\s*(−?-?\d+)\s*signe du diviseur[\s\S]*?Mathématiques\s*(−?-?\d+)\s*le représentant/,
        'tableau « le meme calcul, -7 % 3 »');
      return '(' + tronque + ' et ' + plancher + ')';
    });

  /* 3. Les 10 000 paires de 0..99 : addition et multiplication passent au reste.
     Énumération complète, avec un modulo défini par Math.floor. */
  bloc(R, 'lecon 07 · reduire avant d additionner ou de multiplier ne change rien',
    function (r) {
      const md = function (a, n) { return a - n * Math.floor(a / n); };
      let essais = 0, add = 0, mul = 0;
      for (let a = 0; a < 100; a++) {
        for (let b = 0; b < 100; b++) {
          essais++;
          if (md(a + b, 7) === md(md(a, 7) + md(b, 7), 7)) add++;
          if (md(a * b, 7) === md(md(a, 7) * md(b, 7), 7)) mul++;
        }
      }
      poser(r, 'les trois lignes de comptage', [essais, add, essais, mul, essais], b7.cong,
        /paires essayees\s+:\s*(\d+)\n\(a\+b\)[^:]*:\s*(\d+) \/ (\d+)\n\(a\*b\)[^:]*:\s*(\d+) \/ (\d+)/,
        'les trois premieres lignes de congruences.txt');
      poser(r, 'la congruence 17 ≡ 3 (mod 7)', [md(17, 7), md(3, 7)], b7.cong,
        /restes : (\d+) et (\d+)/, 'premiere ligne de congruences.txt');
      return '(' + add + ' et ' + mul + ' sur ' + essais + ')';
    });

  /* 4. Les divisions exactes : leur NOMBRE se calcule par une formule fermée
     (pour chaque b non multiple de 7, il y a ⌊59/b⌋ multiples de b sous 60), et
     la RÉUSSITE se caractérise sans flottant : (a/b) mod 7 = (a mod 7)/(b mod 7)
     exactement quand b mod 7 divise a mod 7 dans les entiers. */
  bloc(R, 'lecon 07 · diviser les restes : le compte des cas, les echecs, et les trois contre-exemples',
    function (r) {
      let cas = 0;
      for (let b = 1; b < 60; b++) { if (b % 7 === 0) continue; cas += Math.floor(59 / b); }
      let marche = 0, avecInverse = 0, vus = 0;
      const contre = [];
      for (let a = 1; a < 60; a++) {
        for (let b = 1; b < 60; b++) {
          if (a % b !== 0 || b % 7 === 0) continue;
          vus++;
          if ((a % 7) % (b % 7) === 0) marche++;
          else if (contre.length < 3) contre.push([a, b, (a / b) % 7]);
          const inv = inverseBalayage(b % 7, 7);
          if ((a / b) % 7 === ((a % 7) * inv) % 7) avecInverse++;
        }
      }
      poser(r, 'le compte par formule fermee et les cas ou diviser les restes marche',
        [cas, marche], b7.cong,
        /divisions exactes essayees\s*:\s*(\d+), dont (\d+) ou diviser les restes marche/,
        'ligne « divisions exactes essayees »');
      poserLignes(r, 'les trois premiers contre-exemples', contre, b7.cong,
        /a=(\d+), b=(\d+) : \(a\/b\) mod 7 = (\d+),/gm, 'les trois lignes de contre-exemples');
      poser(r, 'les memes cas en multipliant par l inverse (balayage exhaustif)',
        [vus, avecInverse, vus], b7.cong,
        /les MEMES (\d+) cas, en multipliant par l inverse\s*:\s*(\d+) \/ (\d+)/,
        'ligne « les MEMES … cas »');
      poser(r, 'prose : le nombre d echecs', [cas - marche, cas], p7,
        /échoue sur (\d+) des (\d+) divisions exactes essayées/,
        'prose « Diviser les restes echoue sur … »');
      return '(' + marche + ' sur ' + cas + ', et ' + avecInverse + ' sur ' + vus + ' par l inverse)';
    });

  /* 5. Le calendrier : 10^15 modulo 7 en BigInt, le jour d'arrivée par comptage,
     et le jour de départ vérifié par la congruence de Zeller. */
  bloc(R, 'lecon 07 · le jour de la semaine dans 10^15 jours, et le point de depart',
    function (r) {
      const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const reste = Number((10n ** 15n) % 7n);
      const arrivee = jours[Number((4n + 10n ** 15n) % 7n)];
      poserTexte(r, '10^15 mod 7 et le jour d arrivee', [String(reste), arrivee], b7.cong,
        /10\^15 mod 7 = (\d+)\n10\^15 jours plus tard\s*:\s*(\S+)/, 'les deux lignes du calendrier');
      let j = 3, m = 9, a = 2026;
      if (m < 3) { m += 12; a -= 1; }
      const K = a % 100, J = Math.floor(a / 100);
      const h = (j + Math.floor(13 * (m + 1) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7;
      const noms = ['samedi', 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
      poserTexte(r, 'le 3 septembre 2026 par la congruence de Zeller', [noms[h]], b7.cong,
        /point de depart\s*:\s*(\S+) \(3 septembre 2026\)/, 'ligne « point de depart »');
      return '(reste ' + reste + ', ' + noms[h] + ' -> ' + arrivee + ')';
    });

  /* 6. Luhn refait d'après la spécification énoncée par la page : depuis la
     droite, un chiffre sur deux doublé, 9 retranché au-delà de 9, somme ≡ 0 [10]. */
  bloc(R, 'lecon 07 · la cle de Luhn de l exemple, recalculee depuis la specification',
    function (r) {
      const corps = '453201511283003';
      const somme = function (s) {
        let t = 0;
        for (let i = s.length - 1, k = 0; i >= 0; i--, k++) {
          let c = s.charCodeAt(i) - 48;
          if (k % 2 === 1) { c *= 2; if (c > 9) c -= 9; }
          t += c;
        }
        return t;
      };
      const s0 = somme(corps + '0');
      const manque = (10 - s0 % 10) % 10;
      let cle = null;
      for (let d = 0; d <= 9; d++) if (somme(corps + d) % 10 === 0) cle = d;
      poserTexte(r, 'somme, chiffre manquant, numero complet et validite',
        [String(s0), String(manque), corps + cle, 'true'], b7.cle,
        /somme de Luhn\s+:\s*(\d+)\s+-> il manque (\d+) pour[\s\S]*?numero complet\s+:\s*(\d+)\s+valide \? (\w+)/,
        'les trois lignes de l exemple Luhn');
      return '(somme ' + s0 + ', cle ' + cle + ')';
    });

  /* 7. Les substitutions : le compte se calcule (500 numéros × longueur × 9), et
     le taux de 100 % se DÉMONTRE — les trois poids sont injectifs modulo 10, donc
     changer un chiffre change forcément la somme. */
  bloc(R, 'lecon 07 · toute faute portant sur un seul chiffre est vue, dans les deux cles',
    function (r) {
      const v1 = {}, v2 = {}, v3 = {};
      for (let x = 0; x <= 9; x++) { v1[IDENTITE(x) % 10] = 1; v2[DOUBLE(x) % 10] = 1; v3[TRIPLE(x) % 10] = 1; }
      const injectifs = Object.keys(v1).length === 10 && Object.keys(v2).length === 10 && Object.keys(v3).length === 10;
      const luhn = 500 * 16 * 9, isbn = 500 * 13 * 9;
      poser(r, 'Luhn : 500 x 16 x 9 substitutions, toutes vues',
        [luhn, injectifs ? luhn : 'poids non injectifs', '100.00'], cleLuhn,
        /fautes d'un chiffre\s+:\s*(\d+) essayees, (\d+) detectees\s+\(([\d.]+) %\)/,
        'ligne Luhn « fautes d un chiffre »');
      poser(r, 'ISBN-13 : 500 x 13 x 9 substitutions, toutes vues',
        [isbn, injectifs ? isbn : 'poids non injectifs', '100.00'], cleIsbn,
        /fautes d'un chiffre\s+:\s*(\d+) essayees, (\d+) detectees\s+\(([\d.]+) %\)/,
        'ligne ISBN « fautes d un chiffre »');
      poser(r, 'prose : les deux effectifs', [luhn, isbn], p7,
        /(\d[\d ]*) essais pour Luhn, (\d[\d ]*) pour l'ISBN/, 'prose « 72 000 essais pour Luhn »');
      return '(' + luhn + ' et ' + isbn + ' essais, poids injectifs modulo 10)';
    });

  /* 8. Les échanges de voisins et les échanges à saut, tranchés par énumération
     des 90 échanges de deux chiffres distincts. */
  bloc(R, 'lecon 07 · echanges de voisins et echanges a saut : les taux theoriques et les paires manquees',
    function (r) {
      const luhn = theorieVoisins(IDENTITE, DOUBLE);
      const isbn = theorieVoisins(IDENTITE, TRIPLE);
      poserTexte(r, 'Luhn : taux theorique et paire manquee',
        [luhn.manquees, luhn.taux, String(luhn.passent)], cleLuhn,
        /paires de voisins jamais vues\s*:\s*([^\n]+)\n\s*taux theorique sur les voisins\s*:\s*([\d.]+) % \((\d+) echanges sur 90 passent\)/,
        'les deux lignes theoriques de Luhn');
      poserTexte(r, 'ISBN-13 : taux theorique et paires manquees',
        [isbn.manquees, isbn.taux, String(isbn.passent)], cleIsbn,
        /paires de voisins jamais vues\s*:\s*([^\n]+)\n\s*taux theorique sur les voisins\s*:\s*([\d.]+) % \((\d+) echanges sur 90 passent\)/,
        'les deux lignes theoriques de l ISBN');
      poser(r, 'prose : les deux taux theoriques',
        [luhn.passent, luhn.taux, isbn.passent, isbn.taux], p7,
        /(\d+) paires de chiffres sur 90 échappent à Luhn, soit ([\d, ]+?) %[\s\S]{0,40}?et (\d+) sur 90 à l'ISBN, soit ([\d, ]+?) %/,
        'prose « 2 paires de chiffres sur 90 … »');
      /* Un échange par-dessus un troisième chiffre laisse la somme rigoureusement
         inchangée : les positions i et i+2 portent le même poids. */
      let detectables = 0;
      for (const poids of [DOUBLE, IDENTITE, TRIPLE]) {
        for (let a = 0; a <= 9; a++) {
          for (let b = 0; b <= 9; b++) {
            if (a === b) continue;
            if ((poids(a) + poids(b)) % 10 !== (poids(b) + poids(a)) % 10) detectables++;
          }
        }
      }
      poser(r, 'Luhn : aucun echange a saut n est detectable', [detectables, '0.00'], cleLuhn,
        /echanges A SAUT\s+:\s*\d+ essayees, (\d+) detectees\s+\(([\d.]+) %\)/, 'ligne Luhn « echanges A SAUT »');
      poser(r, 'ISBN-13 : aucun echange a saut n est detectable', [detectables, '0.00'], cleIsbn,
        /echanges A SAUT\s+:\s*\d+ essayees, (\d+) detectees\s+\(([\d.]+) %\)/, 'ligne ISBN « echanges A SAUT »');
      return '(Luhn ' + luhn.taux + ' % en ratant « ' + luhn.manquees + ' », ISBN ' + isbn.taux + ' % en ratant « ' + isbn.manquees + ' »)';
    });

  /* 9. Les effectifs d'échange dépendent du tirage, mais pas leur ordre de
     grandeur : sur 500 numéros de 16 chiffres, 15 couples de voisins chacun, une
     chance sur dix que les deux chiffres soient égaux — 6 750 attendus, écart-type
     26. On exige quatre écarts-types, et un taux mesuré à moins d'un point de la
     théorie. */
  bloc(R, 'lecon 07 · le releve d echantillon est compatible avec 500 numeros tires au hasard',
    function (r) {
      const attL = 500 * 15 * 0.9, sL = Math.sqrt(500 * 15 * 0.9 * 0.1);
      poserIntervalle(r, 'Luhn : effectif des echanges de voisins',
        cleLuhn, /echanges de VOISINS\s+:\s*(\d+) essayees/, 'ligne Luhn « echanges de VOISINS »',
        Math.round(attL - 4 * sL), Math.round(attL + 4 * sL),
        'esperance ' + attL + ', ecart-type ' + sL.toFixed(2));
      const attI = 500 * 12 * 0.9, sI = Math.sqrt(500 * 12 * 0.9 * 0.1);
      poserIntervalle(r, 'ISBN-13 : effectif des echanges de voisins',
        cleIsbn, /echanges de VOISINS\s+:\s*(\d+) essayees/, 'ligne ISBN « echanges de VOISINS »',
        Math.round(attI - 4 * sI), Math.round(attI + 4 * sI),
        'esperance ' + attI + ', ecart-type ' + sI.toFixed(2));
      const tl = Number(theorieVoisins(IDENTITE, DOUBLE).taux);
      const ti = Number(theorieVoisins(IDENTITE, TRIPLE).taux);
      poserIntervalle(r, 'Luhn : le taux mesure serre le taux theorique',
        cleLuhn, /echanges de VOISINS\s+:\s*\d+ essayees, \d+ detectees\s+\(([\d.]+) %\)/,
        'taux mesure de Luhn', tl - 1, tl + 1, 'theorie ' + tl + ' %');
      poserIntervalle(r, 'ISBN-13 : le taux mesure serre le taux theorique',
        cleIsbn, /echanges de VOISINS\s+:\s*\d+ essayees, \d+ detectees\s+\(([\d.]+) %\)/,
        'taux mesure de l ISBN', ti - 1, ti + 1, 'theorie ' + ti + ' %');
      return '(esperances ' + attL + ' et ' + attI + ', a 4 ecarts-types pres)';
    });

  /* 10. Les trois puissances modulaires, refaites par multiplication répétée en
     BigInt, et les comptes de multiplications lus dans l'écriture binaire. */
  bloc(R, 'lecon 07 · les trois puissances modulaires et le compte de multiplications',
    function (r) {
      const att = [
        [7, 1000, 13, puissanceNaive(7, 1000, 13).toString()],
        [7, 100000, 13, puissanceNaive(7, 100000, 13).toString()],
        [3, 65537, 1000003, puissanceNaive(3, 65537, 1000003).toString()]
      ];
      poserLignes(r, 'les resultats, par multiplication repetee en BigInt', att, b7.expo,
        /^(\d+)\^(\d+) mod (\d+)\s+(\d+)\s+\d+\s+\d+\s+x\d+$/gm, 'tableau d exponentiation.txt');
      const comptes = [];
      for (const e of [1000, 100000, 65537]) {
        const bin = BigInt(e).toString(2);
        const uns = bin.split('').filter(function (c) { return c === '1'; }).length;
        const rapides = bin.length + uns;
        comptes.push([e, e, rapides, 'x' + Math.round(e / rapides)]);
      }
      poserLignes(r, 'les mults naives, les mults rapides (bits + poids de Hamming) et les rapports',
        comptes, b7.expo, /^\d+\^(\d+) mod \d+\s+\d+\s+(\d+)\s+(\d+)\s+(x\d+)$/gm,
        'colonnes « mults » du tableau');
      poser(r, 'prose : les deux paliers cites', [comptes[0][2], comptes[1][2]], p7,
        /(\d+) multiplications au lieu de 1 000, (\d+) au lieu de 100 000/,
        'prose « 16 multiplications au lieu de 1 000 »');
      return '(' + att.map(function (l) { return l[3]; }).join(', ') + ')';
    });

  /* 11. Le cas des 2 048 bits : 4 096 multiplications au pire (un carré et une
     multiplication par bit), 10^617 pour la méthode directe, la conversion en
     âges d'Univers, le contrôle croisé (11 × 41 × 3) et les 846 chiffres de 7^1000. */
  bloc(R, 'lecon 07 · l ecart qui rend RSA possible : 2^2048 multiplications contre 4 096',
    function (r) {
      const mults = 2 * 2048;
      const log10Naif = Math.round(Math.log10(2) * 2048);
      const ages = Math.round(Math.log10(2) * 2048 - 9 - Math.log10(4.35e17));
      poser(r, 'les trois ordres de grandeur du pire cas', [log10Naif, mults, ages], b7.expo,
        /methode naive\s+:\s*environ 10\^(\d+) multiplications\n\s*methode rapide\s*:\s*(\d+) multiplications[\s\S]*?10\^(\d+) fois l'age de l'Univers/,
        'les trois lignes du pire cas');
      const secondes = 13.8e9 * 365.25 * 86400;
      const ecart = Math.abs(secondes - 4.35e17) / 4.35e17;
      r.push({
        nom: '4,35e17 secondes = 13,8 milliards d annees (annee julienne)',
        ok: ecart < 0.005,
        detail: ecart < 0.005 ? '' : 'recalcule ' + secondes.toExponential(3) + ' s ; la page emploie 4,35e17 s'
      });
      poser(r, 'le controle croise de la page : 11 x 41 x 3 cas, zero ecart', [11 * 41 * 3, 0], b7.expo,
        /controle\s*:\s*(\d+) cas compares au calcul exact, (\d+) ecart\(s\)/,
        'derniere ligne d exponentiation.txt');
      poser(r, 'prose : le nombre de chiffres de 7^1000, compte en BigInt',
        [(7n ** 1000n).toString().length], p7,
        /demande de former un nombre de ([\d ]+?) chiffres/, 'prose « un nombre de … chiffres »');
      return '(10^' + log10Naif + ' contre ' + mults + ')';
    });

  /* 12. Le débordement : pour k de 20 à 60, on refait l'arrondi IEEE en BigInt et
     on compare le modulo arrondi au modulo exact. Aucun flottant n'est employé. */
  bloc(R, 'lecon 07 · a partir de quel k (a*a) % m se met a mentir, arrondi IEEE refait en BigInt',
    function (r) {
      const m = 1000003n, SUR = (1n << 53n) - 1n;
      let essais = 0, faux = 0, refuses = 0, premierEcart = null;
      for (let k = 20; k <= 60; k++) {
        const a = (1n << BigInt(k)) - 1n;
        if (a > SUR) { refuses++; continue; }
        essais++;
        const exact = (a * a) % m, obtenu = arrondiDouble(a * a) % m;
        if (exact !== obtenu) {
          faux++;
          if (!premierEcart) premierEcart = { k: k, a: a, obtenu: obtenu, exact: exact };
        }
      }
      poser(r, 'essais jugeables, faux, et valeurs de k ecartees', [essais, faux, refuses], b7.deb,
        /carres de 2\^k - 1 reduits modulo 1000003\s*:\s*(\d+) essais jugeables, (\d+) faux\nvaleurs de k ecartees[^:]*:\s*(\d+)/,
        'lignes « carres de 2^k - 1 »');
      poser(r, 'le premier ecart, son k, son a, son modulo faux et son modulo exact',
        [premierEcart.k, premierEcart.a.toString(), premierEcart.obtenu.toString(), premierEcart.exact.toString()],
        b7.deb,
        /premier ecart a k = (\d+) :\n\s*a\s+= (\d+)\n\s*\(a\*a\) % m\s+= (\d+)\s+<- faux\n\s*exact\s+= (\d+)/,
        'bloc « premier ecart »');
      const a27 = (1n << 27n) - 1n;
      poser(r, '(2^27-1)^2 : le double le plus proche perd exactement une unite',
        [arrondiDouble(a27 * a27).toString(), (a27 * a27).toString(),
          (a27 * a27 - arrondiDouble(a27 * a27)).toString()], b7.deb,
        /a \* a en Number\s*:\s*(\d+)\na \* a en BigInt\s*:\s*(\d+)\necart absolu\s*:\s*(\d+)/,
        'bloc « a * a en Number »');
      poser(r, 'la constante 2^53 - 1', [((1n << 53n) - 1n).toString()], b7.deb,
        /Number\.MAX_SAFE_INTEGER = (\d+)/, 'premiere ligne de debordement.txt');
      return '(premier ecart a k = ' + premierEcart.k + ' : ' + premierEcart.obtenu + ' au lieu de ' + premierEcart.exact + ')';
    });

  /* 13. La borne exacte : le plus grand m tel que (m−1)² ≤ 2^53 − 1 vaut
     ⌊√(2^53−1)⌋ + 1, racine entière calculée par la méthode de Héron en BigInt. */
  bloc(R, 'lecon 07 · le plus grand modulo sur lequel (a*b) % m reste exact',
    function (r) {
      const SUR = (1n << 53n) - 1n;
      const mMax = racineEntiereBig(SUR) + 1n;
      let bits = 0;
      for (let b = 10; b <= 32; b++) {
        const mm = 1n << BigInt(b);
        if ((mm - 1n) * (mm - 1n) <= SUR) bits = b;
      }
      poser(r, 'la borne exacte et la regle mnemotechnique',
        [mMax.toString(), bits, (1n << BigInt(bits)).toString()], b7.deb,
        /plus grand modulo sur lequel \(a\*b\) % m reste exact\s*:\s*(\d+)\nregle mnemotechnique, plus prudente\s*:\s*m tient sur (\d+) bits, soit m <= (\d+)/,
        'lignes « plus grand modulo » et « regle mnemotechnique »');
      const marge = Math.round(100 * (Number(mMax) / Number(1n << BigInt(bits)) - 1));
      poser(r, 'prose : la borne et la marge de la regle des 26 bits', [mMax.toString(), marge], p7,
        /m ≤ ([\d ]+?) \.[\s\S]{0,200}?est plus prudente de (\d+) %/,
        'prose « m ≤ 94 906 266 … plus prudente de 41 % »');
      return '(m ≤ ' + mMax + ', regle a ' + bits + ' bits, marge de ' + marge + ' %)';
    });

  /* 14. Le pire écart sur des produits sous 2^45 : il ne peut pas dépasser le
     demi-ulp d'un produit de 90 bits, soit 2^36 — et la page publie exactement
     cette borne. Le produit publié est refait en BigInt, son arrondi aussi. */
  bloc(R, 'lecon 07 · le pire ecart mesure sur des produits sous 2^45 vaut le demi-ulp theorique',
    function (r) {
      const a = 24012751110144n, b = 34310881796096n;
      const exact = a * b;
      const arrondi = arrondiDouble(exact);
      const ecart = exact - arrondi;
      const borne = 1n << BigInt(exact.toString(2).length - 54);
      poser(r, 'l ecart, les deux operandes, le produit exact et le produit arrondi',
        [ecart.toString(), a.toString(), b.toString(), exact.toString(), arrondi.toString()], b7.deb,
        /pire ecart absolu observe\s*:\s*(\d+)\n\s*sur a = (\d+), b = (\d+)\n\s*exact\s+= (\d+)\n\s*Number = (\d+)/,
        'bloc « 300 000 produits »');
      const atteint = ecart === borne && a < (1n << 45n) && b < (1n << 45n);
      r.push({
        nom: 'cet ecart atteint la borne : aucun produit d entiers sous 2^45 ne peut faire pire',
        ok: atteint,
        detail: atteint ? '' : 'ecart recalcule ' + ecart + ', demi-ulp theorique ' + borne
      });
      poser(r, 'prose : le pire ecart', [ecart.toString()], p7,
        /le programme mesure un pire écart de ([\d ]+?) \./, 'prose « un pire ecart de … »');
      return '(' + ecart + ' = 2^' + (exact.toString(2).length - 54) + ')';
    });

  /* 15. La table de hachage : occupation et charge maximale recomptées seau par
     seau, moyenne par division. */
  bloc(R, 'lecon 07 · mille cles espacees de 8 dans des tables de 64, 61, 1024 et 1021 cases',
    function (r) {
      const cles = [];
      for (let i = 0; i < 1000; i++) cles.push(1000 + i * 8);
      const att = [];
      let occupes1024 = 0;
      for (const t of [64, 61, 1024, 1021]) {
        const seaux = new Array(t).fill(0);
        for (const c of cles) seaux[c % t]++;
        let u = 0, mx = 0;
        for (const v of seaux) { if (v > 0) u++; if (v > mx) mx = v; }
        if (t === 1024) occupes1024 = u;
        att.push([t, u, t, mx, (1000 / t).toFixed(1)]);
      }
      poserLignes(r, 'les quatre lignes : seaux occupes, plus gros seau, ideal', att, repStructure,
        /^taille (\d+)\s+seaux occupes (\d+)\/(\d+)\s+plus gros seau (\d+)\s+ideal ([\d.]+)$/gm,
        'tableau de repartition.txt (cles espacees de 8)');
      poser(r, 'la proportion de table inutilisee a 1 024 cases',
        [(100 * (1024 - occupes1024) / 1024).toFixed(1)], b7.rep,
        /la proportion inutilisee vaut ([\d.]+) %/, 'ligne « proportion inutilisee »');
      const petit = [];
      for (const n of [1000, 1008, 1016, 1024, 1032]) petit.push([n, n % 64, n % 61]);
      poserLignes(r, 'n % 64 ne regarde que six bits : les cinq lignes', petit, b7.rep,
        /^(\d{4})\s+(\d+)\s+(\d+)$/gm, 'petit tableau n % 64 / n % 61');
      return '(' + att[0][1] + ' seaux sur 64 contre ' + att[1][1] + ' sur 61)';
    });

  /* 16. L'index circulaire : le nombre de pas qui sortent du tableau se compte par
     une caractérisation — ce sont les sommes négatives non multiples de 7. */
  bloc(R, 'lecon 07 · combien de pas, entre -1 000 et +1 000, font sortir l index du tableau',
    function (r) {
      let hors = 0;
      for (let p = -1000; p <= 1000; p++) {
        const s = 2 + p;
        if (s < 0 && s % 7 !== 0) hors++;
      }
      const pct = (100 * hors / 2001).toFixed(1);
      poser(r, 'les quatre lignes du releve', [0, hors, hors, pct], b7.s1,
        /version corrigee, indices hors tableau\s*:\s*(\d+)\n\s*version naive,\s+indices hors tableau\s*:\s*(\d+)\n\s*pas ou les deux versions divergent\s*:\s*(\d+)\n\s*soit ([\d.]+) %/,
        'bloc « 2001 pas essayes »');
      poser(r, 'prose : le meme compte et le meme pourcentage', [hors, pct], p7,
        /Le chiffre de (\d+) pas sur 2 001[\s\S]*?soit ([\d,]+) % des pas essayés/,
        'prose de l exercice 1');
      return '(' + hors + ' sur 2 001, soit ' + pct + ' %)';
    });

  /* 17. L'IBAN, refait d'après la spécification que l'énoncé donne : les quatre
     premiers caractères passent à la fin, A = 10 … Z = 35, et le tout doit valoir
     1 modulo 97 — vérifié en BigInt sur le nombre entier, sans réduction
     progressive. Puis toutes les fautes d'un chiffre. */
  bloc(R, 'lecon 07 · l IBAN : 29 chiffres, un modulo 97 en BigInt, et ce que Number en fait',
    function (r) {
      const propre = 'FR7630006000011234567890189';
      const permute = propre.slice(4) + propre.slice(0, 4);
      let chiffres = '';
      for (const c of permute) chiffres += /[0-9]/.test(c) ? c : String(c.charCodeAt(0) - 55);
      const reste = Number(BigInt(chiffres) % 97n);
      poser(r, 'la conversion, la longueur et le reste modulo 97',
        [chiffres, chiffres.length, reste, 'true'], b7.s2,
        /en chiffres\s+:\s*(\d+)\nlongueur\s+:\s*(\d+) chiffres\nreste modulo 97\s+:\s*(\d+)\s+-> valide \? (\w+)/,
        'les trois premieres lignes de solution-2.txt');
      const relu = arrondiDouble(BigInt(chiffres));
      const resteRelu = Number(relu % 97n);
      poser(r, 'la valeur relue par Number et le reste qu elle donne',
        [resteRelu, relu.toString()], b7.s2,
        /en Number, sans reduction\s*:\s*(\d+)\s+<-[\s\S]*?valeur relue par Number\s+:\s*(\d+)/,
        'lignes « en Number, sans reduction » et « valeur relue »');
      let commun = 0;
      const rs = relu.toString();
      while (commun < chiffres.length && chiffres[commun] === rs[commun]) commun++;
      poser(r, 'prose : les deux ecritures et le controle qui tombe', [chiffres, rs, resteRelu], p7,
        /le nombre (\d+) devient (\d+) une fois passé par Number[\s\S]*?Le contrôle donne alors (\d+) au lieu de 1/,
        'prose de l exercice 2');
      r.push({
        nom: 'prose : « les dix-sept premiers chiffres survivent »',
        ok: commun === 17 && /dix-sept premiers chiffres survivent/.test(p7),
        detail: commun === 17 ? 'la prose ne porte pas « les dix-sept premiers chiffres survivent »'
          : 'prefixe commun recalcule : ' + commun + ' chiffres'
      });
      let essais = 0, vues = 0;
      for (let i = 4; i < propre.length; i++) {
        if (!/[0-9]/.test(propre[i])) continue;
        for (let d = 0; d <= 9; d++) {
          if (String(d) === propre[i]) continue;
          essais++;
          const p2 = propre.slice(0, i) + d + propre.slice(i + 1);
          const pe = p2.slice(4) + p2.slice(0, 4);
          let t = '';
          for (const c of pe) t += /[0-9]/.test(c) ? c : String(c.charCodeAt(0) - 55);
          if (BigInt(t) % 97n !== 1n) vues++;
        }
      }
      poser(r, 'toutes les fautes d un chiffre, refaites en BigInt',
        [essais, vues, (100 * vues / essais).toFixed(1)], b7.s2,
        /fautes d'un chiffre essayees\s*:\s*(\d+), detectees\s*:\s*(\d+)\s+\(([\d.]+) %\)/,
        'derniere ligne de solution-2.txt');
      return '(reste ' + reste + ', ' + commun + ' chiffres survivent, ' + vues + '/' + essais + ' fautes vues)';
    });

  /* 18. Diffie-Hellman : les puissances modulaires refaites par paliers de
     multiplications répétées, la primalité de p par essai de tous les diviseurs,
     et la force brute rejouée telle quelle. */
  bloc(R, 'lecon 07 · l echange de Diffie-Hellman, refait par multiplications repetees',
    function (r) {
      const p = 2147483647;
      const temoin = puissanceNaive(7, 100000, p).toString();
      const temoinPaliers = puissanceParPaliers(7, 100000, p).toString();
      r.push({
        nom: 'outil : les paliers de 1000 redonnent la multiplication repetee pure',
        ok: temoin === temoinPaliers,
        detail: temoin === temoinPaliers ? '' : 'naif ' + temoin + ', paliers ' + temoinPaliers
      });
      r.push({
        nom: 'p = 2 147 483 647 est premier (essai de tous les diviseurs)',
        ok: premier(p) && b7.s3.indexOf('p = ' + p) !== -1,
        detail: premier(p) ? 'la sortie n annonce pas p = ' + p : 'le p publie n est pas premier'
      });
      const pubA = puissanceParPaliers(7, 123456789, p);
      const pubB = puissanceParPaliers(7, 987654321, p);
      const partage = puissanceParPaliers(Number(pubB), 123456789, p);
      poser(r, 'les deux valeurs publiques', [pubA.toString(), pubB.toString()], b7.s3,
        /A envoie\s*:\s*(\d+)\nB envoie\s*:\s*(\d+)/, 'lignes « A envoie » et « B envoie »');
      poser(r, 'la cle partagee, des deux cotes',
        [partage.toString(), partage.toString(), 'true'], b7.s3,
        /A calcule\s*:\s*(\d+)\nB calcule\s*:\s*(\d+)\nidentiques \? (\w+)/, 'bloc « A calcule »');
      let trouve = -1, courant = 1;
      const cible = Number(pubA);
      for (let x = 0; x < 3000000; x++) {
        if (courant === cible) { trouve = x; break; }
        courant = (courant * 7) % p;
      }
      poserTexte(r, 'la force brute, rejouee sur 3 000 000 d essais',
        [trouve >= 0 ? 'oui' : 'non', String(Math.round(123456789 / 3000000))], b7.s3,
        /trouve \? (\w+),[^\n]*\n[\s\S]*?il aurait fallu (\d+) fois plus d'essais/,
        'lignes « trouve ? » et « il aurait fallu »');
      return '(cle partagee ' + partage + ', secret introuvable sous 3 000 000)';
    });

  /* ---------------------------------------------------------------
     LEÇON 8 — primalité, crible, PGCD, Bézout, Fermat
     --------------------------------------------------------------- */

  /* 19. Le tableau de primalité : verdict par essai de TOUS les diviseurs, et les
     trois colonnes de comptes par formule (n−2 ; ⌊√n⌋−1 ; 2 + 2·|{5+6i, (5+6i)² ≤ n}|). */
  bloc(R, 'lecon 08 · les cinq nombres du tableau de primalite : verdicts et comptes de divisions',
    function (r) {
      const att = [];
      for (const n of [10007, 100003, 1000003, 1000000007, 2147483647]) {
        let pas6 = 2;
        for (let d = 5; d * d <= n; d += 6) pas6 += 2;
        att.push([n, premier(n), n - 2, racineEntiere(n) - 1, pas6]);
      }
      poserLignes(r, 'les cinq lignes', att, b8.prim,
        /^(\d+)\s+(true|false)\s+(\d+)(?: \(calcule\))?\s+(\d+)\s+(\d+)\s*$/gm, 'tableau de primalite.txt');
      poser(r, 'les deux tests d accord sur les nombres de 2 a 20 000', [20000 - 1, 0], b8.prim,
        /les deux tests compares sur (\d+) nombres\s*:\s*(\d+) desaccord/,
        'premiere ligne de primalite.txt');
      return '(tous premiers, 46 339 divisions au plus long)';
    });

  /* 20. La densité des premiers : comptes par crible maison, densité locale
     recomptée sur le dernier dixième, prédiction par 100/ln(n). */
  bloc(R, 'lecon 08 · la densite des premiers, cumulee et locale, contre la prediction 1/ln(n)',
    function (r) {
      const att = [];
      for (const b of [10, 100, 1000, 10000, 100000, 1000000]) {
        const c = pi(b);
        const debut = Math.max(2, Math.floor(b * 0.9));
        let loc = 0, largeur = 0;
        for (let n = debut; n <= b; n++) { largeur++; if (premier(n)) loc++; }
        att.push([b, c, (100 * c / b).toFixed(2),
          largeur < 30 ? '(trop etroit)' : (100 * loc / largeur).toFixed(2) + '%',
          (100 / Math.log(b)).toFixed(2)]);
      }
      poserLignes(r, 'les six lignes du tableau', att, b8.prim,
        /^(\d+)\s+(\d+)\s+([\d.]+) %\s+(\(trop etroit\)|[\d.]+ %)\s+([\d.]+) %$/gm,
        'tableau des densites');
      poser(r, 'combien de tirages pour un premier de 1 024 bits',
        [Math.round(1024 * Math.log(2)), Math.round(1024 * Math.log(2) / 2)], b8.prim,
        /1 sur (\d+) nombres,\nsoit 1 sur (\d+) si l on ne tire que des impairs/,
        'les deux dernieres lignes de primalite.txt');
      return '(' + pi(1000000) + ' premiers sous un million)';
    });

  /* 21. Le crible : les premiers sous 100 listés par un crible maison, et les
     rayures recomptées PAR FORMULE, sans rayer aucune case. */
  bloc(R, 'lecon 08 · les rayures du crible, recomptees par formule fermee',
    function (r) {
      const p100 = premiersJusqua(100);
      poserTexte(r, 'les premiers sous 100 et le nombre de rayures',
        [String(p100.length), p100.join(' '), String(rayuresDepuisPP(100))], b8.crible,
        /premiers jusqu'a 100 \((\d+)\) :\n\s*([\d ]+)\nrayures effectuees\s*:\s*(\d+)/,
        'debut de crible.txt');
      const att = [];
      for (const N of [1000, 100000, 1000000]) {
        const a = rayuresDepuisPP(N), b = rayuresDepuis2P(N);
        att.push([N, a, b, (100 * (b - a) / b).toFixed(1)]);
      }
      poserLignes(r, 'rayures depuis p*p, depuis 2p, et l economie', att, b8.crible,
        /^(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+) %$/gm, 'tableau des rayures');
      return '(104 rayures sous 100, ' + rayuresDepuisPP(1000000) + ' sous un million)';
    });

  /* 22. Le crible contre les tests un par un : le nombre de divisions se calcule
     sans boucler sur les diviseurs — un composé s'arrête à son plus petit facteur,
     un premier va jusqu'à ⌊√n⌋. Puis le coût mémoire. */
  bloc(R, 'lecon 08 · crible contre tests un par un, a travail egal jusqu a 100 000',
    function (r) {
      const N = 100000;
      const spf = new Int32Array(N + 1);
      for (let i = 2; i <= N; i++) if (!spf[i]) for (let j = i; j <= N; j += i) if (!spf[j]) spf[j] = i;
      let divisions = 0;
      for (let x = 2; x <= N; x++) divisions += (spf[x] === x ? racineEntiere(x) : spf[x]) - 1;
      const rayures = rayuresDepuisPP(N);
      const combien = pi(N);
      poser(r, 'rayures, divisions, premiers trouves et rapport',
        [rayures, combien, divisions, combien, 'x' + (divisions / rayures).toFixed(1), 'true'], b8.crible,
        /crible\s*:\s*(\d+) rayures, (\d+) premiers\n\s*tests\s+:\s*(\d+) divisions, (\d+) premiers\n\s*rapport des operations\s*:\s*(x[\d.]+)\n\s*memes premiers \? (\w+)/,
        'bloc « lister les premiers jusqu a 100000 »');
      poser(r, 'le cout memoire, a un bit par nombre',
        [(1e6 / 8 / 1024).toFixed(0), Math.round(Math.log10(2) * 256 - Math.log10(8))], b8.crible,
        /tient dans (\d+) Ko, a un bit par nombre\.\njusqu'a 2\^256, il en faudrait 10\^(\d+) octets/,
        'les deux lignes de cout memoire');
      return '(' + rayures + ' rayures contre ' + divisions + ' divisions)';
    });

  /* 23. Euclide : les quatre paires. Le PGCD des deux petites est confirmé par
     INTERSECTION DES DIVISEURS ; les étapes viennent de deux implémentations
     écrites ici, l'une par modulo, l'autre par soustractions. */
  bloc(R, 'lecon 08 · les quatre paires d Euclide : pgcd, etapes par modulo, etapes par soustraction',
    function (r) {
      const att = [];
      for (const paire of [[48, 18], [1071, 462], [1000000, 999999], [514229, 317811]]) {
        const m = euclide(paire[0], paire[1]), s = euclideSoustraction(paire[0], paire[1]);
        att.push([paire[0], paire[1], m.pgcd, m.etapes, s.etapes]);
      }
      poserLignes(r, 'les quatre lignes', att, b8.eucl,
        /^(\d+) et (\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/gm, 'tableau d euclide.txt');
      const ok = pgcdParDiviseurs(48, 18) === 6 && pgcdParDiviseurs(1071, 462) === 21;
      r.push({
        nom: 'pgcd(48,18) = 6 et pgcd(1071,462) = 21, par intersection des diviseurs',
        ok: ok,
        detail: ok ? '' : 'par intersection : ' + pgcdParDiviseurs(48, 18) + ' et ' + pgcdParDiviseurs(1071, 462)
      });
      return '(999 999 soustractions contre 2 modulos sur 1 000 000 et 999 999)';
    });

  /* 24. Le pire cas sous 1 000, cherché exhaustivement, son appartenance à
     Fibonacci, et le rythme logarithmique. */
  bloc(R, 'lecon 08 · le pire cas d Euclide est bien deux Fibonacci consecutifs',
    function (r) {
      let pire = { etapes: -1, a: 0, b: 0 };
      for (let a = 1; a <= 1000; a++) {
        for (let b = 1; b <= a; b++) {
          const e = euclide(a, b).etapes;
          if (e > pire.etapes) pire = { etapes: e, a: a, b: b };
        }
      }
      const fib = [1, 1];
      while (fib[fib.length - 1] < 2000) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
      const voisins = fib.indexOf(pire.a) > 0 && fib[fib.indexOf(pire.a) - 1] === pire.b;
      poserTexte(r, 'le pire cas, la suite de Fibonacci et l appartenance',
        [String(pire.a), String(pire.b), String(pire.etapes), fib.join(' '), String(voisins)], b8.eucl,
        /pire cas sur toutes les paires jusqu'a 1000 : (\d+) et (\d+), (\d+) etapes\nsuite de Fibonacci : ([\d ]+)\n\d+ et \d+ y figurent-ils cote a cote \? (\w+)/,
        'bloc du pire cas');
      const f = [1, 1];
      for (let k = 0; k < 40; k++) f.push(f[f.length - 1] + f[f.length - 2]);
      const att = [], rythmes = [];
      for (const ch of [3, 6, 9]) {
        let mx = 0, a = 0, b = 0;
        for (let i = 2; i < f.length; i++) {
          if (String(f[i]).length !== ch) continue;
          const e = euclide(f[i], f[i - 1]).etapes;
          if (e > mx) { mx = e; a = f[i]; b = f[i - 1]; }
        }
        att.push([ch, mx, a, b]);
        rythmes.push((mx / ch).toFixed(1));
      }
      poserLignes(r, 'le pire nombre d etapes pour 3, 6 et 9 chiffres', att, b8.eucl,
        /^(\d) chiffres\s+(\d+)\s+\((\d+) et (\d+)\)$/gm, 'tableau « taille des nombres »');
      poser(r, 'le rythme par chiffre decimal', rythmes, b8.eucl,
        /rythme\s*:\s*([\d.]+), ([\d.]+) et ([\d.]+) etapes par chiffre/, 'ligne « rythme »');
      return '(' + pire.a + ' et ' + pire.b + ' en ' + pire.etapes + ' etapes)';
    });

  /* 25. Les nombres de 2 048 bits : la moyenne publiée est confrontée à la valeur
     que donne la théorie des fractions continues, (12·ln2/π²)·ln(N) — et à un
     échantillon tiré ici avec un générateur maison. La borne de Fibonacci se calcule. */
  bloc(R, 'lecon 08 · un PGCD sur deux nombres de 2 048 bits : moyenne mesuree et borne du pire cas',
    function (r) {
      const theorie = (12 * Math.log(2) / (Math.PI * Math.PI)) * 2048 * Math.log(2);
      const suivant = xorshift(20260903);
      const grand = function () {
        let x = 0n;
        for (let i = 0; i < 64; i++) x = (x << 32n) | BigInt(suivant());
        return x | (1n << 2047n);
      };
      let total = 0;
      const N = 120;
      for (let i = 0; i < N; i++) total += euclideBig(grand(), grand()).etapes;
      const mesure = total / N;
      poserIntervalle(r, 'la moyenne publiee, face a la theorie et a un echantillon independant',
        b8.eucl, /etapes en moyenne\s*:\s*(\d+)\s+\(de \d+ a \d+\)/, 'ligne « etapes en moyenne »',
        Math.round(theorie) - 20, Math.round(theorie) + 20,
        'theorie (12 ln2 / pi^2) x ln(2^2048) = ' + theorie.toFixed(1) +
        ', echantillon independant de ' + N + ' paires : ' + mesure.toFixed(1));
      const phi = (1 + Math.sqrt(5)) / 2;
      poser(r, 'la borne du pire cas donnee par Fibonacci',
        [Math.ceil(2048 * Math.log(2) / Math.log(phi))], b8.eucl,
        /borne du pire cas, donnee par Fibonacci\s*:\s*(\d+)/, 'ligne « borne du pire cas »');
      return '(theorie ' + theorie.toFixed(0) + ', echantillon ' + mesure.toFixed(0) + ')';
    });

  /* 26. Bézout : on ne refait pas le calcul des coefficients, on VÉRIFIE ceux que
     la page publie — a·u + b·v doit valoir le PGCD, lui-même recalculé par
     l'Euclide écrit ici. L'identité, elle, ne dépend pas du chemin suivi. */
  bloc(R, 'lecon 08 · Bezout : a*u + b*v = pgcd(a,b) sur les quatre lignes publiees',
    function (r) {
      const re = /^(\d+)\s+(\d+)\s+(\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)$/gm;
      const lignes = [];
      let m;
      while ((m = re.exec(b8.ext))) lignes.push(m.slice(1).map(Number));
      if (lignes.length !== 4) {
        r.push({
          nom: 'les quatre lignes du tableau', ok: false,
          detail: 'ligne introuvable : euclide-etendu.txt en a rendu ' + lignes.length + ' au lieu de 4'
        });
        return '(tableau illisible)';
      }
      for (const l of lignes) {
        const a = BigInt(l[0]), b = BigInt(l[1]), g = BigInt(l[2]);
        const u = BigInt(l[3]), v = BigInt(l[4]), ctrl = BigInt(l[5]);
        const vrai = BigInt(euclide(l[0], l[1]).pgcd);
        const combinaison = a * u + b * v;
        r.push({
          nom: 'a = ' + l[0] + ', b = ' + l[1],
          ok: g === vrai && combinaison === g && ctrl === combinaison,
          detail: 'pgcd recalcule ' + vrai + ' (publie ' + g + ') ; a*u + b*v = ' + combinaison +
            ' ; colonne de verification ' + ctrl
        });
      }
      return '(4 identites verifiees en BigInt)';
    });

  /* 27. Les inverses modulaires, trouvés par balayage exhaustif de 1 à m−1. */
  bloc(R, 'lecon 08 · quatre inverses modulaires, par balayage exhaustif de 1 a m-1',
    function (r) {
      for (const cas of [[3, 7], [17, 3120], [10, 15], [65537, 999982]]) {
        const a = cas[0], m = cas[1];
        const inv = inverseBalayage(a, m);
        const attendu = inv === null ? 'aucun' : String(inv);
        const re = new RegExp('^' + a + '\\s+' + m + '\\s+(\\S+)\\s+(.*)$', 'm');
        const mm = re.exec(extInverses);
        if (!mm) { r.push({ nom: a + ' modulo ' + m, ok: false, detail: 'ligne introuvable dans le tableau des inverses' }); continue; }
        const ecarts = [];
        if (mm[1] !== attendu) ecarts.push('balayage ' + attendu + ', publie ' + mm[1]);
        if (inv !== null && Number(nettoie(mm[2])) !== (a * inv) % m) {
          ecarts.push('colonne de controle : « ' + mm[2].trim() +' », alors que a*inverse mod m vaut ' + (a * inv) % m);
        }
        if (inv === null) {
          const g = pgcdParDiviseurs(a, m);
          if (mm[2].indexOf('= ' + g + ' :') === -1) ecarts.push('le pgcd annonce n est pas ' + g);
        }
        r.push({ nom: a + ' modulo ' + m + ' -> ' + attendu, ok: !ecarts.length, detail: ecarts.join(' ; ') });
      }
      return '(dont 10 modulo 15, qui n en a aucun)';
    });

  /* 28. Le compte des inversibles : indicatrice d'Euler recomptée par
     coprimalité, chaque PGCD venant de l'Euclide écrit ici. */
  bloc(R, 'lecon 08 · combien de nombres sont inversibles modulo 12, 13, 30, 31, 100 et 101',
    function (r) {
      const phiDe = function (m) {
        let c = 0;
        for (let a = 1; a < m; a++) if (euclide(a, m).pgcd === 1) c++;
        return c;
      };
      const att = [];
      for (const m of [12, 13, 30, 31, 100, 101]) att.push([m, phiDe(m), (100 * phiDe(m) / (m - 1)).toFixed(1)]);
      poserLignes(r, 'les six lignes du tableau', att, b8.ext,
        /^(\d+)\s+(\d+)\s+([\d.]+) %$/gm, 'tableau des inversibles');
      poser(r, 'prose : les quatre comptes cites',
        [phiDe(13), phiDe(31), phiDe(101), phiDe(12)], p8,
        /(\d+) sur 12 pour m = 13, (\d+) sur 30 pour 31, (\d+) sur 100 pour 101\. Contre (\d+) sur 11 pour m = 12/,
        'prose « 12 sur 12 pour m = 13 … »');
      return '(quand m est premier, tout l est sauf 0)';
    });

  /* 29. Le RSA jouet : n et φ par produit, d par BALAYAGE EXHAUSTIF de l'inverse,
     et chaque message chiffré puis déchiffré par multiplications répétées. */
  bloc(R, 'lecon 08 · le RSA en miniature : la cle privee est un inverse modulaire',
    function (r) {
      const p = 1009, q = 991, n = p * q, phi = (p - 1) * (q - 1), e = 65537;
      const d = inverseBalayage(e, phi);
      const chiffre = Number(puissanceNaive(42, e, n));
      const clair = Number(puissanceParPaliers(chiffre, d, n));
      poser(r, 'n, phi, l exposant public et l exposant prive',
        [p, q, n, phi, e, d, Number((BigInt(e) * BigInt(d)) % BigInt(phi))], b8.ext,
        /p = (\d+), q = (\d+)\s+->\s+n = (\d+), phi = (\d+)\nexposant public e\s+= (\d+)\nexposant prive\s+d\s+= (\d+)\s+\(e\*d mod phi = (\d+)\)/,
        'bloc « RSA en miniature »');
      poser(r, 'le message 42, chiffre puis dechiffre', [chiffre, clair], b8.ext,
        /exemple\s*:\s*42 -> (\d+) -> (\d+)/, 'ligne « exemple : 42 »');
      let ok = 0, total = 0;
      for (let msg = 2; msg < 1000; msg++) {
        total++;
        const c = Number(puissanceParPaliers(msg, e, n));
        if (Number(puissanceParPaliers(c, d, n)) === msg) ok++;
      }
      poser(r, 'les messages de 2 a 999, refaits un par un', [ok, total], b8.ext,
        /messages chiffres puis dechiffres\s*:\s*(\d+) \/ (\d+) retrouves/,
        'ligne « messages chiffres puis dechiffres »');
      return '(d = ' + d + ', ' + ok + '/' + total + ' messages retrouves)';
    });

  /* 30. Les clés qui partagent un facteur. Tout est reconstruit d'après la
     spécification énoncée : les 82 premiers à partir de 1009 (par essai de tous les
     diviseurs), 40 clés produit de deux premiers, deux d'entre elles partageant le
     25e. Le nombre de paires est une combinaison, C(40,2). */
  bloc(R, 'lecon 08 · deux cles RSA qui partagent un facteur, retrouvees par PGCD',
    function (r) {
      const k = clesReconstruites();
      const paires = 40 * 39 / 2;
      const vulnerables = [];
      for (let i = 0; i < 40; i++) {
        for (let j = i + 1; j < 40; j++) {
          const g = euclide(k.cles[i], k.cles[j]).pgcd;
          if (g > 1 && g < k.cles[i]) vulnerables.push([i, j, g]);
        }
      }
      poser(r, 'le nombre de cles, la premiere d entre elles, le nombre de paires et de paires cassees',
        [k.cles.length, k.cles[0], paires, vulnerables.length], b8.cles,
        /cles publiques engendrees\s*:\s*(\d+)\nexemple : n = (\d+)[\s\S]*?paires de cles comparees\s*:\s*(\d+)\npaires partageant un facteur\s*:\s*(\d+)/,
        'entete de cles-partagees.txt');
      if (!vulnerables.length) {
        r.push({ nom: 'la paire cassee', ok: false, detail: 'aucune paire vulnerable dans la reconstruction independante' });
        return '(reconstruction sans paire vulnerable)';
      }
      const v = vulnerables[0];
      poser(r, 'la paire cassee et les deux factorisations qui en decoulent',
        [v[0], v[1], v[2], v[2], k.cles[v[0]] / v[2], v[2], k.cles[v[1]] / v[2]], b8.cles,
        /cles (\d+) et (\d+) : facteur commun (\d+)\n\s*-> cle \d+ = (\d+) x (\d+)\s+\(factorisee\)\n\s*-> cle \d+ = (\d+) x (\d+)\s+\(factorisee\)/,
        'bloc de la paire vulnerable');
      const trois = [v[2], k.cles[v[0]] / v[2], k.cles[v[1]] / v[2]];
      const tous = trois.every(premier);
      r.push({
        nom: 'les trois facteurs annonces sont premiers (essai de tous les diviseurs)',
        ok: tous, detail: tous ? '' : 'non premier parmi ' + trois.join(', ')
      });
      return '(cles ' + v[0] + ' et ' + v[1] + ', facteur commun ' + v[2] + ')';
    });

  /* 31. Le coût de l'attaque, recompté sur les mêmes clés reconstruites. */
  bloc(R, 'lecon 08 · le cout reel de l attaque par PGCD, compare a la force brute',
    function (r) {
      const k = clesReconstruites();
      let etapes = 0;
      for (let i = 0; i < 40; i++) {
        for (let j = i + 1; j < 40; j++) etapes += euclide(k.cles[i], k.cles[j]).etapes;
      }
      const une = divisionsJusquAuFacteur(k.cles[0]);
      let toutes = 0;
      for (const n of k.cles) toutes += divisionsJusquAuFacteur(n);
      poser(r, 'les trois couts publies', [etapes, une, toutes], b8.cles,
        /ATTAQUE COMPLETE \(les 780 paires\)\s*:\s*(\d+)\ndivisions pour factoriser UNE seule de ces cles par la force\s*:\s*(\d+)\ndivisions pour factoriser LES 40 par la force\s*:\s*(\d+)/,
        'bloc du cout de l attaque');
      const e = euclide(k.cles[12], k.cles[29]).etapes;
      poser(r, 'prose : les etapes de la seule paire vulnerable', [e], p8,
        /(\d+) étapes d'Euclide cassent les deux clés d'un coup/,
        'prose « … etapes d Euclide cassent les deux cles »');
      return '(' + etapes + ' etapes contre ' + une + ' divisions, et ' + e + ' etapes sur la bonne paire)';
    });

  /* 32. La factorisation : quatre nombres, cinq carrés de premiers, et la
     dissymétrie qui n'en est pas une avec la méthode naïve. */
  bloc(R, 'lecon 08 · le cout de la factorisation naive suit la racine carree',
    function (r) {
      const att = [];
      for (const n of [1000003, 999983 * 2, 104729 * 104723, 999983 * 999979]) {
        att.push([n, divisionsJusquAuFacteur(n)]);
      }
      poserLignes(r, 'un premier, un pair, deux semi-premiers', att, factA,
        /^(\d+)\s{2,}.+?\s{2,}(\d+)$/gm, 'premier tableau de factoriser.txt');
      const carres = [];
      for (const p of [101, 1009, 10007, 100003, 1000003]) {
        const n = p * p;
        carres.push([String(n).length, divisionsJusquAuFacteur(n), racineEntiere(n)]);
      }
      poserLignes(r, 'les cinq carres de premiers', carres, factB,
        /^(\d+)\s{2,}(\d+)\s{2,}(\d+)$/gm, 'second tableau de factoriser.txt');
      const n = 999983 * 999979;
      const f = plusPetitFacteur(n);
      const div = divisionsJusquAuFacteur(n);
      poser(r, 'tester et factoriser coutent la meme chose', [div, div, f, n / f, n], b8.fact,
        /par la methode naive : (\d+) divisions\n\s*trouver le facteur\s+: (\d+) divisions\n\s*facteurs trouves : (\d+) x (\d+)\s+-> produit (\d+)/,
        'bloc de la dissymetrie');
      return '(' + div + ' divisions dans les deux cas sur ' + n + ')';
    });

  /* 33. Le petit théorème de Fermat, essayé sur tous les couples (p premier sous
     500, base de 2 à 20), puis ses menteurs en base 2 sous 5 000. */
  bloc(R, 'lecon 08 · le theoreme de Fermat, ses 1 770 couples, et ses menteurs en base 2',
    function (r) {
      let essais = 0, tient = 0;
      for (let p = 3; p < 500; p++) {
        if (!premier(p)) continue;
        for (let a = 2; a <= 20; a++) {
          if (a % p === 0) continue;
          essais++;
          if (puissancePetite(a, p - 1, p) === 1) tient++;
        }
      }
      poser(r, 'les couples (premier, base) sur lesquels le theoreme tient', [essais, tient], b8.fermat,
        /verifie sur (\d+) couples \(premier, base\)\s*:\s*(\d+) fois vrai/, 'premiere ligne de fermat.txt');
      const menteurs = menteursBase2();
      const f = plusPetitFacteur(menteurs[0]);
      poserTexte(r, 'les composes qui passent le test en base 2, et la factorisation du plus petit',
        [String(menteurs.length), menteurs.join(' '), String(menteurs[0]), String(f), String(menteurs[0] / f)],
        b8.fermat,
        /passent le test en base 2 sous 5000 : (\d+)\n\s*([\d ]+)\n\s*\((\d+) = (\d+) x (\d+)\)/,
        'bloc des menteurs de base 2');
      const att = [];
      for (const bases of [[2], [2, 3], [2, 3, 5], [2, 3, 5, 7]]) {
        const restants = [];
        for (let n = 2; n < 5000; n++) {
          if (premier(n)) continue;
          if (bases.every(function (a) { return n % a !== 0 && puissancePetite(a, n - 1, n) === 1; })) restants.push(n);
        }
        att.push(bases.join(','));
        att.push(restants.length ? restants.length + ' : ' + restants.join(' ') : '0');
      }
      poserTexte(r, 'combien de composes survivent a 1, 2, 3 puis 4 bases', att, b8.fermat,
        /^(2)\s+(\d+ : [\d ]+)\n(2,3)\s+(\d+ : [\d ]+)\n(2,3,5)\s+(\d+ : [\d ]+)\n(2,3,5,7)\s+(\d+)$/m,
        'tableau des bases essayees');
      return '(' + essais + ' couples, ' + menteurs.length + ' menteurs)';
    });

  /* 34. Pourquoi chaque menteur tombe : par division (ce qui n'est pas un succès
     du test de Fermat) ou par un vrai témoin. On refait le partage. */
  bloc(R, 'lecon 08 · pourquoi chaque menteur tombe : division deguisee ou vrai temoin',
    function (r) {
      const menteurs = menteursBase2();
      let division = 0, temoin = 0;
      const att = [];
      for (const n of menteurs) {
        for (const a of [2, 3, 5, 7]) {
          if (n % a === 0) { division++; att.push([n, 'la base ' + a + ' le DIVISE']); break; }
          if (puissancePetite(a, n - 1, n) !== 1) { temoin++; att.push([n, 'la base ' + a + ' est un vrai temoin']); break; }
        }
      }
      poser(r, 'le partage entre divisions et vrais temoins', [division, temoin], b8.fermat,
        /ecartes par DIVISION\s*:\s*(\d+)\s+ecartes par un vrai temoin\s*:\s*(\d+)/,
        'ligne « ecartes par DIVISION »');
      poserLignes(r, 'la raison de chacun, une par une', att, b8.fermat,
        /^\s{2}(\d+)\s+(la base \d+ (?:le DIVISE|est un vrai temoin))[^\n]*$/gm,
        'les seize lignes de raisons');
      return '(' + division + ' par division, ' + temoin + ' par un vrai temoin)';
    });

  /* 35. Les nombres de Carmichael sous 20 000, cherchés par force brute. */
  bloc(R, 'lecon 08 · les nombres de Carmichael sous 20 000, trouves par force brute',
    function (r) {
      const carm = carmichaelSous20000();
      poserTexte(r, 'la liste complete', [carm.join(' ')], b8.fermat,
        /nombres de Carmichael sous 20000 : ([\d ]+)\n/, 'ligne des Carmichael');
      const sous5000 = carm.filter(function (n) { return n < 5000; });
      const parDivision = sous5000.every(function (n) {
        for (const a of [2, 3, 5, 7]) {
          if (n % a === 0) return true;
          if (puissancePetite(a, n - 1, n) !== 1) return false;
        }
        return false;
      });
      const cite = p8.indexOf('nombres de Carmichael sous 5 000 — ' + sous5000.join(', ')) !== -1;
      r.push({
        nom: 'prose : ceux qui vivent sous 5 000 sont tous ecartes par une DIVISION, pas par Fermat',
        ok: parDivision && cite,
        detail: !parDivision ? 'au moins un de ces Carmichael tombe par un vrai temoin'
          : (cite ? '' : 'la prose ne cite pas la liste recalculee : ' + sous5000.join(', '))
      });
      return '(' + carm.length + ' sous 20 000, dont ' + sous5000.length + ' sous 5 000)';
    });

  /* 36. Miller-Rabin : on ne se contente pas de refaire la mesure de la page (0
     erreur sous 50 000), on cherche le PREMIER désaccord avec l'essai de tous les
     diviseurs — il tombe exactement sur le nombre que la prose annonce. */
  bloc(R, 'lecon 08 · Miller-Rabin en bases 2 et 3, pousse jusqu au premier compose qui lui echappe',
    function (r) {
      let premierEchec = 0;
      for (let n = 2; n <= 1400000; n++) {
        if (millerRabin(n, [2, 3]) !== premier(n)) { premierEchec = n; break; }
      }
      let faux = 0;
      for (let n = 2; n < 50000; n++) if (millerRabin(n, [2, 3]) !== premier(n)) faux++;
      poser(r, 'zero erreur sur les nombres de 2 a 49 999', [50000 - 2, faux], b8.fermat,
        /compare au test exact sur (\d+) nombres\s*:\s*(\d+) erreur/, 'ligne Miller-Rabin');
      const carm = carmichaelSous20000();
      const verdicts = carm.map(function (n) { return millerRabin(n, [2, 3]) ? 'rate' : 'demasque'; });
      poserTexte(r, 'les Carmichael, passes un par un', [String(carm.length), verdicts.join(', ')], b8.fermat,
        /les (\d+) Carmichael ci-dessus, vus par Miller-Rabin : ([^\n]+)/, 'derniere ligne de fermat.txt');
      const f = plusPetitFacteur(premierEchec);
      poser(r, 'prose : le premier compose qui echappe aux bases 2 et 3',
        [premierEchec, f, premierEchec / f], p8,
        /exactes pour tout n strictement inférieur à ([\d ]+?) , qui vaut ([\d ]+?) × ([\d ]+?) et qui est le premier composé/,
        'prose « exactes pour tout n strictement inferieur a … »');
      const exposant = Math.round(-40 * Math.log10(4));
      const cite = /4 −\s?40[\s\S]{0,30}?10 −\s?24/.test(p8);
      r.push({
        nom: 'prose : 4^-40 vaut environ 10^' + exposant,
        ok: exposant === -24 && cite,
        detail: exposant !== -24 ? 'log10(4^-40) recalcule : ' + (-40 * Math.log10(4)).toFixed(2)
          : 'la prose ne porte pas « sous 4^-40, soit environ 10^-24 »'
      });
      return '(premier desaccord a ' + premierEchec + ' = ' + f + ' x ' + premierEchec / f + ')';
    });

  /* 37. Les premiers jumeaux, comptés sur un crible maison. */
  bloc(R, 'lecon 08 · les premiers jumeaux sous 100 000, et leur densite qui chute plus vite',
    function (r) {
      const P = premiersJusqua(100000);
      const jum = [];
      for (let i = 1; i < P.length; i++) if (P[i] - P[i - 1] === 2) jum.push('(' + P[i - 1] + ',' + P[i] + ')');
      poserTexte(r, 'le compte, les cinq premieres paires et la derniere',
        [String(P.length), String(jum.length), jum.slice(0, 5).join(' '),
          jum[jum.length - 1].replace(/[()]/g, '')], b8.s4,
        /premiers jusqu'a 100000 : (\d+)\npaires de jumeaux\s+: (\d+)\nles cinq premieres\s+: ([^\n]+)\nla derniere sous 100000\s+: \(([\d,]+)\)/,
        'entete de solution-4.txt');
      const att = [];
      for (const b of [1000, 10000, 100000]) {
        const p = P.filter(function (x) { return x <= b; });
        let j = 0;
        for (let i = 1; i < p.length; i++) if (p[i] - p[i - 1] === 2) j++;
        att.push([b, p.length, j, (1000 * j / p.length).toFixed(1)]);
      }
      poserLignes(r, 'les trois lignes de densite', att, b8.s4,
        /^(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)$/gm, 'tableau des densites de jumeaux');
      let ecart1 = 0;
      for (let i = 1; i < P.length; i++) if (P[i] - P[i - 1] === 1) ecart1++;
      poser(r, 'les paires de premiers separes de 1', [ecart1], b8.s4,
        /couples trouves : (\d+)/, 'ligne « couples trouves »');
      return '(' + jum.length + ' paires, et ' + ecart1 + ' seul couple separe de 1)';
    });

  /* 38. PPCM et débordement : PGCD par intersection des diviseurs, coïncidences
     comptées minute par minute, et les deux débordements refaits par l'arrondi
     IEEE en BigInt. */
  bloc(R, 'lecon 08 · le PPCM de trois taches periodiques, et les deux debordements de l exercice',
    function (r) {
      const per = [12, 18, 30];
      const g3 = pgcdParDiviseurs(pgcdParDiviseurs(per[0], per[1]), per[2]);
      let ppcm3 = 0;
      for (let t = 1; t <= 100000 && !ppcm3; t++) {
        if (per.every(function (p) { return t % p === 0; })) ppcm3 = t;
      }
      let coincidences = 0;
      for (let t = 1; t <= 1440; t++) if (per.every(function (p) { return t % p === 0; })) coincidences++;
      poser(r, 'pgcd, ppcm et coincidences sur une journee',
        [g3, ppcm3, ppcm3 / 60, coincidences, ppcm3], b8.s5,
        /pgcd des trois : (\d+)\nppcm des trois : (\d+) minutes, soit (\d+) heures[\s\S]*?simulation sur 1440 minutes : (\d+) coincidences, la premiere a t = (\d+)/,
        'entete de solution-5.txt');
      const att = [];
      for (const paire of [[12, 18], [7, 11], [60, 90], [3600, 5400]]) {
        const g = pgcdParDiviseurs(paire[0], paire[1]);
        att.push([paire[0], paire[1], g, paire[0] / g * paire[1]]);
      }
      poserLignes(r, 'les quatre couples de periodes', att, b8.s5,
        /^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/gm, 'tableau des periodes');
      const ab = 123456789n * 246913578n;
      const cd = 123456789n / 9n * 987654321n;
      poser(r, 'les deux produits arrondis, refaits en BigInt',
        [arrondiDouble(ab).toString(), arrondiDouble(cd).toString(), cd.toString()], b8.s5,
        /<- a\*b vaut deja (\d+)[\s\S]*?c \/ pgcd \* d\s+: (\d+)\n\s*exact \(BigInt\): (\d+)\s+<- une unite de plus/,
        'les deux debordements de solution-5.txt');
      const unite = cd - arrondiDouble(cd) === 1n && cd > (1n << 53n) - 1n;
      r.push({
        nom: 'l ecart d une unite est bien un demi-ulp : le ppcm lui-meme depasse 2^53',
        ok: unite, detail: unite ? '' : 'ecart recalcule ' + (cd - arrondiDouble(cd)) + ', ppcm ' + cd
      });
      return '(ppcm ' + ppcm3 + ' minutes, ' + coincidences + ' coincidences)';
    });

  /* 39. Casser la clé jouet : facteurs par essai de tous les diviseurs, d par
     balayage exhaustif, déchiffrement par multiplications répétées. Puis les deux
     ordres de grandeur que la prose répète. */
  bloc(R, 'lecon 08 · casser la cle RSA jouet, et ce que la taille change',
    function (r) {
      const n = 3232483, e = 65537, chiffre = 1792031;
      const divisions = divisionsJusquAuFacteur(n);
      const p = plusPetitFacteur(n), q = n / p;
      const phi = (p - 1) * (q - 1);
      const d = inverseBalayage(e, phi);
      const clair = Number(puissanceParPaliers(chiffre, d, n));
      const rechiffre = Number(puissanceNaive(clair, e, n));
      poser(r, 'les trois etapes : factoriser, calculer d, dechiffrer',
        [divisions, p, q, n, 'true', 'true', phi, d,
          Number((BigInt(e) * BigInt(d)) % BigInt(phi)), clair, clair, rechiffre], b8.s6,
        /etape 1 : factoriser n en (\d+) divisions\s+->\s+(\d+) x (\d+) = (\d+)\n\s*les deux facteurs sont-ils premiers \? (\w+) et (\w+)\netape 2 : phi = (\d+), puis d = (\d+)\s+\(e\*d mod phi = (\d+)\)\netape 3 : message en clair = (\d+)\ncontrole : on rechiffre (\d+) -> (\d+)/,
        'les trois etapes de solution-6.txt');
      const att = [];
      for (const paire of [[1009, 991], [31607, 31627], [999983, 999979]]) {
        const nn = paire[0] * paire[1];
        att.push([String(nn).length, divisionsJusquAuFacteur(nn)]);
      }
      poserLignes(r, 'les divisions pour un n de 6, 9 puis 12 chiffres', att, b8.s6,
        /^(\d+) chiffres\s+(\d+)$/gm, 'tableau final de solution-6.txt');
      poser(r, 'prose : la taille decimale d une cle de 2 048 bits et le cout en racine',
        [(2n ** 2048n - 1n).toString().length, Math.round(2048 * Math.log10(2) / 2)], p8,
        /Un nombre de ([\d ]+?) chiffres — la taille d'une clé RSA de 2 048 bits — demanderait de l'ordre de 10 (\d+) divisions/,
        'prose « un nombre de 617 chiffres »');
      poser(r, 'prose : la taille en bits du n du RSA jouet',
        [(1009 * 991).toString(2).length], p8,
        /Les nombres employés ici tiennent sur (\d+) bits/, 'prose « tiennent sur 20 bits »');
      return '(message ' + clair + ', retrouve en ' + divisions + ' divisions)';
    });

  return R;
}

module.exports = { titre: 'lecons 07-08 — arithmetique modulaire, nombres premiers', controles: controles };
