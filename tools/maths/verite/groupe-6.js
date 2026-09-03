/* tools/maths/verite/groupe-6.js — LEÇONS 12 ET 13, RECALCULÉES AUTREMENT.
   =======================================================================
   V15 · point F2.

   RÈGLE DE CE FICHIER : aucun code publié dans les leçons n'est repris, ni
   copié, ni adapté. Chaque fait est recalculé par un AUTRE chemin que celui du
   cours, puis confronté au texte publié :

     · le cours énumère (il trie, il compte, il simule) → on emploie une formule
       fermée établie ici : n⌈log₂n⌉ − 2^⌈log₂n⌉ + n pour le travail d'un tri
       fusion, C(n,2) et C(n,3) pour les boucles imbriquées, 2·F(n+1) − 1 pour
       les appels du Fibonacci naïf, n² − 1 et n(n+1)/2 − 1 pour le tri rapide,
       une récurrence f(m) = 3m − 3 + f(m−2) pour son entrée décroissante ;
     · le cours calcule par formule (un seuil, un croisement, un rang n₀) → on
       BALAIE tous les n, un par un, et on exige aussi que le rang précédent
       échoue ;
     · le cours appelle Math.log2 → on calcule le logarithme en virgule fixe
       BigInt, bit par bit, sans jamais toucher à la bibliothèque du moteur ;
     · les hauteurs d'arbre et les profondeurs de dichotomie sont obtenues par
       une récurrence de sommes de profondeurs, jamais par un logarithme.

   CE QUI N'EST PAS JUGÉ, ET POURQUOI. La leçon 12 chronomètre (chrono.js) :
   une durée n'est pas reproductible. Le programme, lui, n'en publie aucune —
   il publie deux compteurs et leur rapport. Seules les affirmations
   STRUCTURELLES en sont vérifiées ici : le rapport annoncé, et le fait que
   chaque compteur tombe dans l'encadrement que sa famille impose. De même, les
   quantités tirées du générateur xorshift32 du cours (coûts sur données
   mélangées, hauteurs d'arbres au hasard, produits de Karatsuba) ne sont pas
   recalculées — les reproduire exigerait de recopier le générateur, donc le
   chemin du cours. Elles sont encadrées, et leurs conséquences arithmétiques
   sont refaites.
*/
'use strict';
const L = require('./lib.js');

/* ===== 0. OUTILS DE RÉFÉRENCE ==========================================
   Aucune de ces fonctions ne vient du cours ; aucune ne lit la page. */

/* --- 0.1 texte publié --------------------------------------------------- */
function nrm(s) {
  return String(s).replace(/[   ]/g, ' ').replace(/[’‘]/g, "'");
}
/* Une ligne repérée par un motif. Absente → le contrôle rougit, jamais l'inverse. */
function ligne(txt, re, e, quoi) {
  const m = nrm(txt).match(re);
  if (!m) { e.push('ligne introuvable : ' + quoi); return null; }
  return m;
}
/* « 1 234,56 » ou « 1234.56 » ou « 1.02e+5 » → nombre. */
function nombre(s) {
  if (s === null || s === undefined) return NaN;
  const t = nrm(s).trim().replace(/ /g, '').replace(',', '.');
  const m = t.match(/^[-+]?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
  return m ? Number(m[0]) : NaN;
}
/* Demi-unité du dernier chiffre affiché : la seule tolérance légitime. */
function tolAffichee(s) {
  const t = nrm(s).trim().replace(/ /g, '').replace(',', '.');
  const m = t.match(/^[-+]?\d+(?:\.(\d+))?(?:e([+-]?\d+))?/i);
  if (!m) return null;
  const d = m[1] ? m[1].length : 0;
  const E = m[2] ? parseInt(m[2], 10) : 0;
  return 0.5 * Math.pow(10, E - d);
}
function egal(e, quoi, calcule, publie) {
  if (String(calcule) !== String(publie).trim()) {
    e.push(quoi + ' : recalculé « ' + calcule +' », publié « ' + String(publie).trim() + ' »');
  }
}
/* Compare à la tolérance qu'impose le nombre de décimales affiché. */
function proche(e, quoi, calcule, publieStr, facteur) {
  const p = nombre(publieStr);
  const t = tolAffichee(publieStr);
  if (!isFinite(p) || t === null) { e.push(quoi + ' : nombre illisible « ' + publieStr + ' »'); return; }
  /* Le (1 + 10⁻⁹) laisse passer les arrondis À LA MOITIÉ EXACTE : 1,048575
     affiché à cinq décimales vaut 1,04858, et l'écart y est la tolérance même. */
  if (Math.abs(p - calcule) > t * (facteur || 1) * (1 + 1e-9)) {
    e.push(quoi + ' : recalculé ' + calcule + ', publié ' + p);
  }
}
function entre(e, quoi, bas, publie, haut) {
  const p = typeof publie === 'number' ? publie : nombre(publie);
  if (!(p >= bas && p <= haut)) {
    e.push(quoi + ' : publié ' + p + ', hors de l\'encadrement [' + bas + ', ' + haut + ']');
  }
}
/* Les cellules d'une ligne de tableau : séparées par au moins deux espaces,
   ce qui préserve les espaces de groupement des milliers. */
function cellules(s) {
  return nrm(s).trim().split(/ {2,}/);
}

/* --- 0.2 arithmétique exacte -------------------------------------------- */
function bitsDe(x) { return x === 0n ? 0 : x.toString(2).length; }

/* log₂ d'un rationnel, en virgule fixe BigInt : partie entière par la longueur
   binaire, puis un bit de mantisse par élévation au carré. N'emploie NI
   Math.log2, NI Math.log — c'est le point : le cours s'en sert, pas nous. */
function log2Rat(num, den) {
  if (num <= 0n || den <= 0n) throw new Error('log2 : argument non positif');
  const P = 96n;
  let e = bitsDe(num) - bitsDe(den);
  let y = e >= 0 ? (num << P) / (den << BigInt(e)) : (num << (P + BigInt(-e))) / den;
  const UN = 1n << P;
  while (y >= 2n * UN) { y >>= 1n; e++; }
  while (y < UN) { y <<= 1n; e--; }
  let frac = 0, poids = 0.5;
  for (let i = 0; i < 60; i++) {
    y = (y * y) >> P;
    if (y >= 2n * UN) { y >>= 1n; frac += poids; }
    poids /= 2;
  }
  return e + frac;
}
function log2(x) {                       // x : nombre entier ou décimal simple
  if (typeof x === 'bigint') return log2Rat(x, 1n);
  if (Number.isInteger(x)) return log2Rat(BigInt(x), 1n);
  const d = 1000000000;
  return log2Rat(BigInt(Math.round(x * d)), BigInt(d));
}
const LOG2_10 = log2Rat(10n, 1n);
/* e par sa série ∑1/k!, en rationnel exact : aucune constante recopiée. */
const LOG2_E = (function () {
  let den = 1n; for (let i = 2n; i <= 40n; i++) den *= i;
  let num = 0n, t = den;                                  // t = 40!/k!
  for (let k = 0n; k <= 40n; k++) { num += t; if (k < 40n) t /= (k + 1n); }
  return log2Rat(num, den);
})();
function log10(x) { return log2(x) / LOG2_10; }
function ln(x) { return log2(x) / LOG2_E; }
function ceilLog2(m) {                    // plus petit k tel que 2^k ≥ m
  const b = BigInt(m);
  if (b <= 1n) return 0;
  return bitsDe(b - 1n);
}
function floorLog2(m) { return bitsDe(BigInt(m)) - 1; }
function racineEntiere(n) {               // ⌊√n⌋ exact, par Newton sur BigInt
  if (n < 2n) return n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}
function racineCubique(n) {               // ⌊n^(1/3)⌋ exact
  if (n < 8n) return n < 1n ? 0n : (n < 8n ? 1n : 2n);
  let x = 1n;
  while ((x + 1n) * (x + 1n) * (x + 1n) <= n) {
    let saut = 1n;
    while ((x + saut * 2n) * (x + saut * 2n) * (x + saut * 2n) <= n) saut *= 2n;
    x += saut;
  }
  return x;
}
function fact(n) { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; }
function fib(n) { let a = 0n, b = 1n; for (let i = 0; i < n; i++) { const s = a + b; a = b; b = s; } return a; }
function C2(n) { return n * (n - 1) / 2; }
function C3(n) { return n * (n - 1) * (n - 2) / 6; }
/* Travail total des fusions d'un tri fusion sur n éléments : la somme des
   tailles des morceaux fusionnés. Formule fermée, établie ici, à opposer à la
   récursion du cours : n⌈log₂n⌉ − 2^⌈log₂n⌉ + n. */
function travailFusion(n) {
  if (n < 2) return 0;
  const k = ceilLog2(n);
  return n * k - Math.pow(2, k) + n;
}
/* Somme des profondeurs de recherche d'une dichotomie sur len éléments — donc
   aussi des profondeurs d'un arbre bâti équilibré. Récurrence sur les tailles,
   sans tableau, sans logarithme. */
const memoProf = new Map();
function sommeProfondeurs(len) {
  if (len <= 0) return 0;
  if (memoProf.has(len)) return memoProf.get(len);
  const m = (len - 1) >> 1;
  const v = len + sommeProfondeurs(m) + sommeProfondeurs(len - 1 - m);
  memoProf.set(len, v);
  return v;
}
/* log₁₀(n!) par la série de Stirling — un autre chemin que la somme de
   logarithmes du cours. Étalonné plus bas contre le nombre exact de chiffres
   de 100! et de 1000!. */
function log10Fact(n) {
  const N = n;
  const lnN = ln(N);
  const lnFact = N * lnN - N + 0.5 * (ln(2) + ln(N) + LN_PI) + 1 / (12 * N) - 1 / (360 * N * N * N);
  return lnFact / (LOG2_10 / LOG2_E);
}
/* π par la formule de Machin, en entiers : π = 16·arctan(1/5) − 4·arctan(1/239). */
const LN_PI = (function () {
  const S = 10n ** 40n;
  function at(invBig) {                    // arctan(1/inv) × S
    let s = 0n;
    for (let k = 0; k < 60; k++) {
      const d = BigInt(2 * k + 1);
      const t = S / (invBig ** d * d);
      if (t === 0n) break;
      s += (k % 2 === 0 ? t : -t);
    }
    return s;
  }
  const pi = 16n * at(5n) - 4n * at(239n);
  return log2Rat(pi, S) / LOG2_E;
})();

/* ===== 1. LES CONTRÔLES ================================================ */
function controles() {
  const r = [];

  /* Les blocs sont exigés présents ICI : un nom fautif doit arrêter le
     programme, pas verdir un contrôle. */
  const B12 = {};
  ['chrono.txt', 'familles.txt', 'definition.txt', 'doublement.txt', 'croisement.txt',
    'cas.txt', 'amorti.txt', 'memoire.txt', 'echelle.txt',
    'solution-1.txt', 'solution-2.txt', 'solution-3.txt'].forEach(function (f) {
    B12[f] = nrm(L.sortie(12, f));
  });
  const B13 = {};
  ['log-def.txt', 'dicho.txt', 'arbres.txt', 'diviser.txt', 'exponentielle.txt',
    'partout.txt', 'solution-4.txt', 'solution-5.txt', 'solution-6.txt'].forEach(function (f) {
    B13[f] = nrm(L.sortie(13, f));
  });
  const P12 = nrm(L.texte(12));
  const P13 = nrm(L.texte(13));

  function ctrl(nom, fn) {
    const e = [];
    try { fn(e); } catch (err) { e.push('exception dans le contrôle : ' + err.message); }
    r.push({ nom: nom, ok: e.length === 0, detail: e.join(' | ') });
  }

  /* --- 0. étalonnage de l'outil lui-même -------------------------------- */
  ctrl('outils · log₂ BigInt et Stirling étalonnés sur des faits exacts', function (e) {
    if (Math.abs(log2(1024) - 10) > 1e-12) e.push('log2(1024) = ' + log2(1024));
    if (Math.abs(log2(3) - 1.5849625007211562) > 1e-12) e.push('log2(3) = ' + log2(3));
    if (Math.abs(LOG2_10 - 3.321928094887362) > 1e-12) e.push('log2(10) = ' + LOG2_10);
    if (Math.abs(LOG2_E - 1.4426950408889634) > 1e-12) e.push('log2(e) = ' + LOG2_E);
    /* Stirling contre le nombre EXACT de chiffres de 100! et de 1000! */
    [100, 1000].forEach(function (n) {
      const exact = fact(n).toString().length;             // = ⌊log₁₀(n!)⌋ + 1
      const st = Math.floor(log10Fact(n)) + 1;
      if (exact !== st) e.push('Stirling faux à n = ' + n + ' : ' + st + ' contre ' + exact + ' chiffres');
    });
    if (racineEntiere(1000000000n) !== 31622n) e.push('racine entière fausse');
    if (racineCubique(1000000000n) !== 1000n) e.push('racine cubique fausse');
  });

  /* ===================== LEÇON 12 ====================================== */

  /* --- chrono.js : ce qui est jugé, et ce qui ne l'est pas -------------- */
  ctrl('leçon 12 · chrono : le rapport 298,6 et l\'encadrement des deux compteurs', function (e) {
    const t = B12['chrono.txt'];
    const a = ligne(t, /opérations, tri par insertion : (\d+)/, e, 'opérations du tri par insertion');
    const b = ligne(t, /opérations, tri fusion \.+ : (\d+)/, e, 'opérations du tri fusion');
    const c = ligne(t, /rapport \.+ : ([\d.]+) fois plus/, e, 'rapport des deux compteurs');
    if (!a || !b || !c) return;
    const oi = Number(a[1]), of = Number(b[1]);
    /* 1. le rapport annoncé, refait à partir des deux comptes publiés. */
    proche(e, 'rapport insertion/fusion', oi / of, c[1]);
    /* 2. encadrement du tri par insertion : sur une permutation quelconque de
       n = 16000 valeurs, comparaisons + déplacements valent 2·inversions + O(n),
       et l'espérance du nombre d'inversions est n(n−1)/4. */
    const attendu = 16000 * 15999 / 2;
    if (Math.abs(oi / attendu - 1) > 0.03) {
      e.push('compteur du tri par insertion hors de son régime quadratique : ' + oi +
        ', attendu ≈ ' + attendu + ' (2 × inversions espérées)');
    }
    /* 3. encadrement du tri fusion : chaque case fusionnée coûte 1 ou 2 unités,
       et le nombre total de cases fusionnées vaut exactement travailFusion(n). */
    const m = travailFusion(16000);
    entre(e, 'compteur du tri fusion', m, of, 2 * m);
    /* 4. la prose reprend les mêmes chiffres. */
    const p = ligne(P12, /127 502 330 opérations pour le tri par insertion contre (\d[\d ]*) pour le tri fusion, soit ([\d,]+) fois plus/, e, 'prose : 127 502 330 contre 427 035');
    if (p) {
      egal(e, 'prose · compteur du tri fusion', of, p[1].replace(/ /g, ''));
      proche(e, 'prose · rapport', oi / of, p[2]);
    }
  });

  /* --- familles.js : les huit familles --------------------------------- */
  ctrl('leçon 12 · familles : les 32 cellules « opérations à effectuer »', function (e) {
    const t = B12['familles.txt'];
    const TAILLES = [10, 100, 1000, 1000000];
    function grouper(s) {
      let out = '';
      for (let i = 0; i < s.length; i++) { if (i > 0 && (s.length - i) % 3 === 0) out += ' '; out += s[i]; }
      return out;
    }
    function ecrire(exact, lg) {
      if (exact !== null) { const s = exact.toString(); if (s.length <= 13) return grouper(s); }
      return '~10^' + Math.round(lg);
    }
    const FAM = [
      { cle: 'O\\(1\\)  constant', ex: function () { return 1n; }, lg: function () { return 0; } },
      { cle: 'O\\(log n\\)', ex: function (n) { return BigInt(ceilLog2(n)); }, lg: function (n) { return log10(ceilLog2(n)); } },
      { cle: 'O\\(n\\)  linéaire', ex: function (n) { return BigInt(n); }, lg: function (n) { return log10(n); } },
      { cle: 'O\\(n log n\\)', ex: function (n) { return BigInt(n) * BigInt(ceilLog2(n)); }, lg: function (n) { return log10(n) + log10(ceilLog2(n)); } },
      { cle: 'O\\(n²\\) quadratique', ex: function (n) { return BigInt(n) ** 2n; }, lg: function (n) { return 2 * log10(n); } },
      { cle: 'O\\(n³\\) cubique', ex: function (n) { return BigInt(n) ** 3n; }, lg: function (n) { return 3 * log10(n); } },
      { cle: 'O\\(2\\^n\\)', ex: function (n) { return n <= 1000 ? 2n ** BigInt(n) : null; }, lg: function (n) { return n * log10(2); } },
      { cle: 'O\\(n!\\) factoriel', ex: function (n) { return n <= 1000 ? fact(n) : null; }, lg: function (n) { return log10Fact(n); } },
    ];
    const debut = t.indexOf('OPÉRATIONS À EFFECTUER');
    const fin = t.indexOf('DURÉE,');
    if (debut < 0 || fin < 0) { e.push('ligne introuvable : les deux tables de familles.txt'); return; }
    const bloc = t.slice(debut, fin);
    FAM.forEach(function (f) {
      const m = ligne(bloc, new RegExp('^' + f.cle + ' *(.+)$', 'm'), e, 'ligne « ' + f.cle + ' » de la table des opérations');
      if (!m) return;
      const cel = cellules(m[1]);
      if (cel.length !== 4) { e.push(f.cle + ' : ' + cel.length + ' cellules au lieu de 4'); return; }
      TAILLES.forEach(function (n, i) {
        egal(e, f.cle.replace(/\\/g, '') + ' à n = ' + n, ecrire(f.ex(n), f.lg(n)), cel[i]);
      });
    });
  });

  ctrl('leçon 12 · familles : les durées citées, et l\'âge de l\'univers retenu', function (e) {
    const t = B12['familles.txt'];
    /* La page pose une CONVENTION — 13,8 milliards d'années — et l'arrondit à
       trois chiffres. On vérifie la conversion, puis on chiffre les durées avec
       la constante arrondie, qui est celle que la page déclare employer. */
    const AGE_VRAI = 13.8e9 * 365.25 * 86400;
    const AGE = 4.35e17;
    const m = ligne(t, /soit ([\d.e+]+) s\./, e, 'âge de l\'univers en secondes');
    if (m) {
      proche(e, 'conversion 13,8 milliards d\'années → secondes', AGE_VRAI, m[1].replace('e+', 'e'), 1);
      if (nombre(m[1].replace('e+', 'e')) !== AGE) e.push('la constante employée plus bas n\'est pas celle qui est déclarée');
    }
    /* Les cellules de durée qui ENGAGENT, reprises telles quelles dans la prose. */
    const CAS = [
      { quoi: 'O(n) à n = 10^6', ops: 1e6, unite: 'ms', publie: /O\(n\)  linéaire.*?([\d.]+) ms\n/ },
      { quoi: 'O(n log n) à n = 10^6', ops: 1e6 * 20, unite: 'ms', publie: /O\(n log n\) .*?([\d.]+) ms\n/ },
      { quoi: 'O(n²) à n = 10^6', ops: 1e12, unite: 'min', publie: /O\(n²\) quadratique.*?([\d.]+) min\n/ },
      { quoi: 'O(n³) à n = 10^6', ops: 1e18, unite: 'ans', publie: /O\(n³\) cubique.*?([\d.]+) ans\n/ },
      { quoi: 'O(n!) à n = 10', ops: 3628800, unite: 'ms', publie: /O\(n!\) factoriel *([\d.]+) ms/ },
    ];
    const UNITE = { ms: 1e-3, s: 1, min: 60, h: 3600, j: 86400, ans: 365.25 * 86400 };
    CAS.forEach(function (c) {
      const mm = ligne(t, c.publie, e, 'durée ' + c.quoi);
      if (!mm) return;
      proche(e, 'durée ' + c.quoi, c.ops / 1e9 / UNITE[c.unite], mm[1]);
    });
    /* 2^100 opérations à un milliard par seconde, en âges de l'univers. */
    const univers = Math.pow(2, 100) / 1e9 / AGE;
    const u = ligne(t, /O\(2\^n\) *[\d.]+ µs *(\d[\d ]*) univers/, e, 'cellule « univers » de 2^n à n = 100');
    if (u) proche(e, '2^100 opérations en âges de l\'univers', univers, u[1], 2);
    const p = ligne(P12, /2 100 opérations demanderaient (\d[\d ]*) fois l'âge de l'univers/, e, 'prose : 2^100 et l\'âge de l\'univers');
    if (p) proche(e, 'prose · 2^100 en âges de l\'univers', univers, p[1], 2);
  });

  /* --- definition.js : le c et le n₀ ------------------------------------ */
  ctrl('leçon 12 · définition de O() : les six rangs n₀, balayés jusqu\'à n₀+10000', function (e) {
    const t = B12['definition.txt'];
    /* f(n) = 3n² + 50n + 200 ≤ c·n², testé en ENTIERS : c = p/q. */
    function tient(n, p, q) { return q * (3 * n * n + 50 * n + 200) <= p * n * n; }
    const CS = [[3, 1, 'aucun'], [7, 2, '104'], [4, 1, '54'], [5, 1, '29'], [10, 1, '10'], [53, 1, '3']];
    CS.forEach(function (c) {
      const p = c[0], q = c[1], attenduTexte = c[2];
      let n0 = null;
      for (let n = 1; n <= 200000 && n0 === null; n++) {
        let bon = true;
        for (let m = n; m <= n + 10000; m++) if (!tient(m, p, q)) { bon = false; break; }
        if (bon) n0 = n;
      }
      const etiquette = q === 1 ? String(p) : (p / q).toString();
      const mm = ligne(t, new RegExp('^ {2}' + etiquette.replace('.', '\\.') + ' +(.+)$', 'm'), e, 'rang n₀ pour c = ' + etiquette);
      if (!mm) return;
      const publie = mm[1].trim();
      if (attenduTexte === 'aucun') {
        if (n0 !== null) e.push('c = ' + etiquette + ' : un rang existe (n₀ = ' + n0 + ') alors que la page n\'en annonce aucun');
        if (!/aucun/.test(publie)) e.push('c = ' + etiquette + ' : la page annonce « ' + publie + ' » au lieu de « aucun »');
      } else {
        if (n0 === null) { e.push('c = ' + etiquette + ' : aucun rang trouvé alors que la page annonce ' + publie); return; }
        egal(e, 'rang n₀ pour c = ' + etiquette, n0, publie);
        /* et le rang précédent doit VRAIMENT échouer quelque part */
        if (n0 > 1) {
          let echoue = false;
          for (let m = n0 - 1; m <= n0 + 10000; m++) if (!tient(m, p, q)) { echoue = true; break; }
          if (!echoue) e.push('c = ' + etiquette + ' : n₀ − 1 = ' + (n0 - 1) + ' conviendrait aussi, le rang publié n\'est pas le plus petit');
        }
      }
    });
  });

  ctrl('leçon 12 · définition de O() : la table des termes jetés (8 lignes × 3 colonnes)', function (e) {
    const t = B12['definition.txt'];
    [1, 5, 10, 17, 50, 100, 1000, 10000].forEach(function (n) {
      const f = 3 * n * n + 50 * n + 200;
      const jete = 50 * n + 200;
      const mm = ligne(t, new RegExp('^ +' + n + ' +(\\d+) +(\\d+) +([\\d.]+) %$', 'm'), e, 'ligne n = ' + n + ' de la table des termes jetés');
      if (!mm) return;
      egal(e, 'f(' + n + ')', f, mm[1]);
      egal(e, '3n² à n = ' + n, 3 * n * n, mm[2]);
      proche(e, 'part jetée à n = ' + n, 100 * jete / f, mm[3]);
    });
  });

  ctrl('leçon 12 · définition de O() : bascule à n = 20/21 et passage sous 1 % à n = 1654', function (e) {
    const t = B12['definition.txt'];
    /* Balayage : dernier n où 50n + 200 ≥ 3n². */
    let bascule = 0;
    for (let n = 1; n <= 100000; n++) { if (50 * n + 200 >= 3 * n * n) bascule = n; else break; }
    const m1 = ligne(t, /pèsent AU MOINS AUTANT que 3n² jusqu'à n = (\d+) inclus/, e, 'rang de bascule');
    if (m1) egal(e, 'dernier rang où les termes jetés pèsent autant', bascule, m1[1]);
    const m2 = ligne(t, /à n = (\d+), 50n \+ 200 = (\d+) et 3n² = (\d+) — égalité exacte/, e, 'égalité exacte à la bascule');
    if (m2) {
      egal(e, 'n de l\'égalité', bascule, m2[1]);
      egal(e, '50n+200 à l\'égalité', 50 * bascule + 200, m2[2]);
      egal(e, '3n² à l\'égalité', 3 * bascule * bascule, m2[3]);
      if (50 * bascule + 200 !== 3 * bascule * bascule) e.push('l\'égalité annoncée n\'en est pas une');
    }
    const m3 = ligne(t, /à n = (\d+), 50n \+ 200 = (\d+) et 3n² = (\d+) — le terme dominant/, e, 'rang suivant la bascule');
    if (m3) {
      egal(e, 'rang suivant', bascule + 1, m3[1]);
      egal(e, '50n+200 au rang suivant', 50 * (bascule + 1) + 200, m3[2]);
      egal(e, '3n² au rang suivant', 3 * (bascule + 1) * (bascule + 1), m3[3]);
    }
    /* Premier n où la part jetée passe sous 1 %, par balayage. */
    let sous = null;
    for (let n = 1; n <= 1000000 && sous === null; n++) {
      if (100 * (50 * n + 200) < 3 * n * n + 50 * n + 200) sous = n;
    }
    const m4 = ligne(t, /passent sous 1 % à partir de n = (\d+)\./, e, 'rang du passage sous 1 %');
    if (m4) egal(e, 'passage sous 1 %', sous, m4[1]);
    const p = ligne(P12, /Ils ne passent sous 1 % qu'à partir de n = (\d[\d ]*),/, e, 'prose : passage sous 1 %');
    if (p) egal(e, 'prose · passage sous 1 %', sous, p[1].replace(/ /g, ''));
  });

  ctrl('leçon 12 · croisement 3n² contre 1000·n·log₂n, par balayage exhaustif de n', function (e) {
    const t = B12['definition.txt'];
    let croisement = null;
    for (let n = 2; n <= 100000 && croisement === null; n++) {
      if (3 * n * n > 1000 * n * log2(n)) croisement = n;
    }
    if (croisement === null) { e.push('aucun croisement trouvé par balayage'); return; }
    const m = ligne(t, /le plus rapide des deux jusqu'à n = (\d+) inclus/, e, 'dernier rang où A gagne');
    if (m) egal(e, 'dernier rang où 3n² gagne', croisement - 1, m[1]);
    const m2 = ligne(t, /B ne passe devant qu'au rang suivant, n = (\d+)\./, e, 'rang du croisement');
    if (m2) egal(e, 'rang du croisement', croisement, m2[1]);
    /* les quatre points chiffrés */
    const A = function (n) { return 3 * n * n; };
    const B = function (n) { return 1000 * n * log2(n); };
    const m3 = ligne(t, /À n = 100 \.+ : A fait (\d+) opérations, B en fait (\d+) — (\d+) fois plus/, e, 'comparaison à n = 100');
    if (m3) { egal(e, 'A(100)', A(100), m3[1]); proche(e, 'B(100)', B(100), m3[2]); proche(e, 'rapport à n = 100', B(100) / A(100), m3[3]); }
    const m4 = ligne(t, /À n = 200 \.+ : A fait (\d+), B en fait (\d+) — ([\d.]+) fois plus/, e, 'comparaison à n = 200');
    if (m4) { egal(e, 'A(200)', A(200), m4[1]); proche(e, 'B(200)', B(200), m4[2]); proche(e, 'rapport à n = 200', B(200) / A(200), m4[3]); }
    const m5 = ligne(t, /À n = 4000 \.+ : A fait (\d+), B en fait (\d+)\./, e, 'comparaison à n = 4000');
    if (m5) { egal(e, 'A(4000)', A(4000), m5[1]); proche(e, 'B(4000)', B(4000), m5[2]); }
    const m6 = ligne(t, /À n = 10\^6 \.+ : A fait ([\d.e+]+), B en fait ([\d.e+]+) — (\d+) fois moins/, e, 'comparaison à n = 10^6');
    if (m6) {
      proche(e, 'A(10^6)', A(1e6), m6[1], 1);
      proche(e, 'B(10^6)', B(1e6), m6[2], 1);
      proche(e, 'rapport à n = 10^6', A(1e6) / B(1e6), m6[3]);
    }
    /* et la prose, qui cite le rang deux fois */
    const p = ligne(P12, /jusqu'à n = (\d[\d ]*) inclus ; B ne passe devant qu'au rang suivant, (\d[\d ]*)/, e, 'prose : le croisement');
    if (p) {
      egal(e, 'prose · dernier rang où A gagne', croisement - 1, p[1].replace(/ /g, ''));
      egal(e, 'prose · rang du croisement', croisement, p[2].replace(/ /g, ''));
    }
  });

  /* --- doublement.js ---------------------------------------------------- */
  ctrl('leçon 12 · test du doublement : les 24 comptes d\'opérations, par formule fermée', function (e) {
    const t = B12['doublement.txt'];
    const N = [125, 250, 500, 1000];
    const LIGNES = [
      { re: /^premier élément +O\(1\) +(.+)$/m, nom: 'premier élément', long: 'premier élément', f: function () { return 1; } },
      { re: /^recherche linéaire \(absent\) +O\(n\) +(.+)$/m, nom: 'recherche linéaire', long: 'recherche linéaire \\(absent\\)', f: function (n) { return n; } },
      /* la cible est plus petite que toutes les valeurs : la dichotomie ne
         descend qu'à gauche, soit ⌊log₂n⌋ sondages. */
      { re: /^recherche dichotomique +O\(log n\) +(.+)$/m, nom: 'recherche dichotomique', long: 'recherche dichotomique', f: function (n) { return floorLog2(n); } },
      { re: /^tri fusion +O\(n log n\) +(.+)$/m, nom: 'tri fusion', long: 'tri fusion', f: function (n) { return travailFusion(n); } },
      { re: /^doublons, deux boucles +O\(n²\) +(.+)$/m, nom: 'doublons', long: 'doublons, deux boucles', f: function (n) { return C2(n); } },
      { re: /^triplets qui somment à 0 +O\(n³\) +(.+)$/m, nom: 'triplets', long: 'triplets qui somment à 0', f: function (n) { return C3(n); } },
    ];
    LIGNES.forEach(function (l) {
      const m = ligne(t, l.re, e, 'ligne « ' + l.nom +' » du test du doublement');
      if (!m) return;
      const cel = cellules(m[1]);
      if (cel.length !== 7) { e.push(l.nom + ' : ' + cel.length + ' cellules au lieu de 7'); return; }
      const vus = [];
      N.forEach(function (n, i) { egal(e, l.nom + ' à n = ' + n, l.f(n), cel[i]); vus.push(Number(cel[i])); });
      for (let i = 1; i < 4; i++) proche(e, l.nom + ' rapport ' + N[i - 1] + '→' + N[i], l.f(N[i]) / l.f(N[i - 1]), cel[3 + i]);
      /* l'exposant déduit, plus bas dans la même sortie */
      const ex = ligne(t, new RegExp('^ {2}' + l.long + ' +log₂\\(([\\d.]+)\\) = ([\\d.]+)', 'm'), e, 'exposant déduit pour « ' + l.nom + ' »');
      if (ex) {
        proche(e, l.nom + ' rapport final', l.f(1000) / l.f(500), ex[1]);
        proche(e, l.nom + ' exposant', log2(l.f(1000) / l.f(500)), ex[2]);
      }
    });
  });

  /* --- croisement.js ---------------------------------------------------- */
  ctrl('leçon 12 · tri hybride : les 9 comptes d\'appels récursifs, par dénombrement d\'arbre', function (e) {
    const t = B12['croisement.txt'];
    /* n = 4096 et S puissance de 2 : la récursion est un arbre binaire complet
       à 4096/S feuilles, donc 2·(4096/S) − 1 appels au total. */
    [1, 2, 4, 8, 16, 32, 64, 128, 256].forEach(function (S) {
      const m = ligne(t, new RegExp('^ {2}' + String(S).padStart(4) + ' +(\\d+) +(\\d+)$', 'm'), e, 'ligne S = ' + S + ' du tri hybride');
      if (!m) return;
      egal(e, 'appels récursifs à S = ' + S, 2 * (4096 / S) - 1, m[2]);
    });
  });

  ctrl('leçon 12 · tri hybride : le seuil optimal selon K, reminimisé indépendamment', function (e) {
    const t = B12['croisement.txt'];
    const SEUILS = [1, 2, 4, 8, 16, 32, 64, 128, 256];
    const brut = [];
    for (let i = 0; i < SEUILS.length; i++) {
      const S = SEUILS[i];
      const m = ligne(t, new RegExp('^ {2}' + String(S).padStart(4) + ' +(\\d+) +(\\d+)$', 'm'), e, 'ligne S = ' + S);
      if (!m) return;
      brut.push({ S: S, ops: Number(m[1]), appels: Number(m[2]) });
    }
    /* Le seuil optimal est un ARGMIN : il se recalcule, il ne se lit pas. */
    [0, 5, 20, 60].forEach(function (K) {
      let best = brut[0];
      for (let i = 1; i < brut.length; i++) {
        if (brut[i].ops + K * brut[i].appels < best.ops + K * best.appels) best = brut[i];
      }
      const m = ligne(t, new RegExp('^ {2}' + String(K).padStart(4) + ' +(\\d+) +(\\d+) +(\\d+)$', 'm'), e, 'ligne K = ' + K);
      if (!m) return;
      egal(e, 'seuil optimal à K = ' + K, best.S, m[1]);
      egal(e, 'coût au seuil optimal à K = ' + K, best.ops + K * best.appels, m[2]);
      egal(e, 'coût à S = 1 pour K = ' + K, brut[0].ops + K * brut[0].appels, m[3]);
    });
    const p = ligne(t, /le travail compté passe de (\d+) à (\d+) opérations,\nsoit ([\d.]+) fois plus/, e, 'écart entre S = 1 et S = 256');
    if (p) {
      egal(e, 'travail à S = 1', brut[0].ops, p[1]);
      egal(e, 'travail à S = 256', brut[brut.length - 1].ops, p[2]);
      proche(e, 'rapport S=256 / S=1', brut[brut.length - 1].ops / brut[0].ops, p[3]);
    }
  });

  ctrl('leçon 12 · croisement insertion/fusion : 520 tirages, et les coûts que la donnée ne peut pas changer', function (e) {
    const t = B12['croisement.txt'];
    const TAILLES = [2, 4, 8, 9, 10, 11, 12, 16, 24, 32, 64, 128, 512];
    const m = ligne(t, /rendent le même tableau sur les (\d+) tirages/, e, 'nombre de tirages');
    if (m) egal(e, 'nombre de tirages', TAILLES.length * 40, m[1]);
    /* À n = 2, le tri fusion coûte EXACTEMENT 3 unités quelle que soit la
       donnée : deux appels sur un élément (0 unité), puis une fusion qui pousse
       une valeur à 2 unités et l'autre à 1. */
    const l2 = ligne(t, /^ {5}2 +([\d.]+) +([\d.]+) +(\w+)$/m, e, 'ligne n = 2 du croisement');
    if (l2) {
      proche(e, 'tri fusion à n = 2', 3, l2[2]);
      entre(e, 'tri par insertion à n = 2', 2, l2[1], 3);
    }
    /* À n = 4 : deux fusions de 2 (3 unités chacune) puis une fusion de 4, qui
       coûte 6 ou 7 selon l'entrelacement. */
    const l4 = ligne(t, /^ {5}4 +([\d.]+) +([\d.]+) +(\w+)$/m, e, 'ligne n = 4 du croisement');
    if (l4) entre(e, 'tri fusion à n = 4', 12, l4[2], 13);
    /* La colonne « gagnant » et le premier gain annoncé doivent être ce que les
       deux colonnes chiffrées disent, ligne à ligne. */
    let premier = null;
    TAILLES.forEach(function (n) {
      const l = ligne(t, new RegExp('^ {2}' + String(n).padStart(4) + ' +([\\d.]+) +([\\d.]+) +(\\w+)$', 'm'), e, 'ligne n = ' + n + ' du croisement');
      if (!l) return;
      const gagnant = Number(l[2]) < Number(l[1]) ? 'fusion' : 'insertion';
      egal(e, 'gagnant à n = ' + n, gagnant, l[3]);
      if (premier === null && gagnant === 'fusion') premier = n;
    });
    const g = ligne(t, /Le tri fusion ne gagne qu'à partir de n = (\d+)/, e, 'premier n où la fusion gagne');
    if (g && premier !== null) egal(e, 'premier n où la fusion gagne', premier, g[1]);
  });

  /* --- cas.js ------------------------------------------------------------ */
  ctrl('leçon 12 · tri par insertion : meilleur, pire et « toutes égales » par formule fermée', function (e) {
    const t = B12['cas.txt'];
    const n = 1000;
    /* Entrée déjà triée : une comparaison qui échoue + un placement par i. */
    const meilleur = 2 * (n - 1);
    /* Entrée à l'envers : i comparaisons + i déplacements + 1 placement par i. */
    let pire = 0; for (let i = 1; i < n; i++) pire += 2 * i + 1;
    const l1 = ligne(t, /^déjà triée +(\d+) +(\d+)$/m, e, 'ligne « déjà triée »');
    if (l1) egal(e, 'insertion sur entrée triée', meilleur, l1[1]);
    const l2 = ligne(t, /^triée à l'envers +(\d+) +(\d+)$/m, e, 'ligne « triée à l\'envers »');
    if (l2) egal(e, 'insertion sur entrée inversée', pire, l2[1]);
    const l3 = ligne(t, /^toutes égales +(\d+) +(\d+)$/m, e, 'ligne « toutes égales »');
    if (l3) egal(e, 'insertion sur valeurs égales', meilleur, l3[1]);
    const m = ligne(t, /meilleur cas \(déjà triée\) : (\d+) — c'est 2\(n−1\), donc LINÉAIRE : (\w+)/, e, 'meilleur cas commenté');
    if (m) { egal(e, 'meilleur cas', meilleur, m[1]); egal(e, 'meilleur cas linéaire', 'true', m[2]); }
    const mp = ligne(t, /pire cas \(à l'envers\) \.+ : (\d+)/, e, 'pire cas commenté');
    if (mp) egal(e, 'pire cas', pire, mp[1]);
    const mm = ligne(t, /cas tiré au sort \.+ : (\d+), soit ([\d.]+) % du pire cas/, e, 'cas tiré au sort');
    if (mm) {
      entre(e, 'cas tiré au sort (encadré par le meilleur et le pire)', meilleur, mm[1], pire);
      proche(e, 'part du pire cas', 100 * Number(mm[1]) / pire, mm[2]);
    }
    const mr = ligne(t, /rapport pire \/ meilleur \. : (\d+) fois/, e, 'rapport pire/meilleur');
    if (mr) egal(e, 'rapport pire/meilleur', Math.round(pire / meilleur), mr[1]);
  });

  ctrl('leçon 12 · tri rapide : n²−1 sur entrée triée, n(n+1)/2−1 sur valeurs égales, récurrence sur entrée inversée', function (e) {
    const t = B12['cas.txt'];
    const n = 1000;
    /* Pivot = dernier élément. Sur une entrée CROISSANTE, un appel de taille m
       fait m−1 comparaisons, m−1 échanges et un échange final, et n'engendre
       qu'un appel de taille m−1 : total = Σ(2m−1) = n² − 1. */
    const triee = n * n - 1;
    /* Sur des valeurs TOUTES ÉGALES, aucun échange dans la boucle : un appel de
       taille m coûte m et n'engendre qu'un appel de taille m−1, d'où n(n+1)/2 − 1. */
    const egales = n * (n + 1) / 2 - 1;
    /* Sur une entrée DÉCROISSANTE, l'échange final remonte le maximum en queue :
       f(m) = m + g(m−1) et g(k) = 2k−1 + f(k−1), soit f(m) = 3m−3+f(m−2). */
    const f = [0, 0];
    for (let m = 2; m <= n; m++) f[m] = m + (m - 1 >= 2 ? (2 * (m - 1) - 1) + f[m - 2] : 0);
    const inversee = f[n];
    const l1 = ligne(t, /^déjà triée +(\d+) +(\d+)$/m, e, 'ligne « déjà triée »');
    if (l1) egal(e, 'tri rapide sur entrée triée', triee, l1[2]);
    const l2 = ligne(t, /^toutes égales +(\d+) +(\d+)$/m, e, 'ligne « toutes égales »');
    if (l2) egal(e, 'tri rapide sur valeurs égales', egales, l2[2]);
    const l3 = ligne(t, /^triée à l'envers +(\d+) +(\d+)$/m, e, 'ligne « triée à l\'envers »');
    if (l3) egal(e, 'tri rapide sur entrée inversée', inversee, l3[2]);
    const l4 = ligne(t, /la MÊME taille, mais DÉJÀ TRIÉE : (\d+) opérations, soit ([\d.]+) fois la moyenne/, e, 'entrée triée à n = 300');
    const l5 = ligne(t, /coût moyen \.+ : (\d+)/, e, 'coût moyen du tri rapide');
    if (l4) {
      egal(e, 'tri rapide sur 300 éléments déjà triés', 300 * 300 - 1, l4[1]);
      if (l5) proche(e, 'rapport à la moyenne', Number(l4[1]) / Number(l5[1]), l4[2]);
    }
  });

  ctrl('leçon 12 · tri rapide : 44 850 = C(300,2) compté par couples, et la décomposition de 89 999', function (e) {
    const t = B12['cas.txt'];
    let couples = 0;
    for (let i = 0; i < 300; i++) for (let j = i + 1; j < 300; j++) couples++;
    const m = ligne(t, /pire cas théorique : (\d+) comparaisons/, e, 'pire cas théorique');
    if (m) egal(e, 'pire cas théorique', couples, m[1]);
    if (2 * couples + 299 !== 300 * 300 - 1) e.push('la décomposition 2·C(300,2) + 299 ne rend pas n² − 1');
    const p = ligne(P12, /elle l'a atteint exactement, ses (\d[\d ]*) comparaisons comprises/, e, 'prose : le pire cas atteint exactement');
    if (p) egal(e, 'prose · comparaisons de l\'entrée triée', couples, p[1].replace(/ /g, ''));
    const mx = ligne(t, /le pire observé \.+ : (\d+), soit ([\d.]+) fois la moyenne/, e, 'pire observé');
    const my = ligne(t, /coût moyen \.+ : (\d+)/, e, 'coût moyen');
    if (mx && my) {
      proche(e, 'pire observé / moyenne', Number(mx[1]) / Number(my[1]), mx[2]);
      if (Number(mx[1]) >= couples) e.push('le pire observé au hasard atteint le pire cas théorique, contrairement à ce qui est écrit');
    }
  });

  /* --- amorti.js --------------------------------------------------------- */
  /* Une réallocation a lieu exactement quand la taille atteint une capacité de
     la chaîne : on parcourt la CHAÎNE DES CAPACITÉS, pas les insertions. */
  function chaineCapacites(n, suivante) {
    let cap = 1, rec = 0, ra = 0;
    while (cap < n) { rec += cap; ra++; cap = suivante(cap); }
    return { recopies: rec, reallocations: ra, capacite: cap };
  }
  /* Le seul emprunt fait à la page : la convention d'arrondi de « ×1,5 », qui
     est une définition de stratégie, pas un résultat. */
  const STRAT = [
    { cle: 'capacité \\+ 1', f: function (c) { return c + 1; } },
    { cle: 'capacité \\+ 100', f: function (c) { return c + 100; } },
    { cle: 'capacité × 1,5', f: function (c) { return Math.ceil(c * 1.5); } },
    { cle: 'capacité × 2', f: function (c) { return c * 2; } },
    { cle: 'capacité × 4', f: function (c) { return c * 4; } },
  ];

  ctrl('leçon 12 · tableau dynamique : les 5 stratégies à 100 000 insertions', function (e) {
    const t = B12['amorti.txt'];
    const N = 100000;
    STRAT.forEach(function (s) {
      const v = chaineCapacites(N, s.f);
      const m = ligne(t, new RegExp('^' + s.cle + ' +(\\d+) +(\\d+) +([\\d.]+) +(\\d+) \\((\\d+) %\\)$', 'm'), e, 'ligne « ' + s.cle.replace(/\\/g, '') + ' »');
      if (!m) return;
      const nom = s.cle.replace(/\\/g, '');
      egal(e, nom + ' · réallocations', v.reallocations, m[1]);
      egal(e, nom + ' · recopies', v.recopies, m[2]);
      proche(e, nom + ' · recopies par insertion', v.recopies / N, m[3]);
      egal(e, nom + ' · mémoire finale', v.capacite, m[4]);
      proche(e, nom + ' · part de mémoire', 100 * v.capacite / N, m[5]);
    });
  });

  ctrl('leçon 12 · tableau dynamique : la comparaison moyennée sur les 96 tailles', function (e) {
    const t = B12['amorti.txt'];
    let tailles = 0;
    for (let n = 50000; n < 146000; n += 1000) tailles++;
    const p = ligne(P12, /La seconde table moyenne donc sur (\d+) tailles , de 50 000 à 145 000/, e, 'prose : le nombre de tailles moyennées');
    if (p) egal(e, 'nombre de tailles moyennées', tailles, p[1]);
    STRAT.forEach(function (s) {
      let sr = 0, sm = 0, k = 0;
      for (let n = 50000; n < 146000; n += 1000) {
        const v = chaineCapacites(n, s.f);
        sr += v.recopies / n; sm += v.capacite / n; k++;
      }
      const occupe = 100 * sm / k;
      const m = ligne(t, new RegExp('^' + s.cle + ' +([\\d.]+) +(\\d+) % +(\\d+) %$', 'm'), e, 'ligne moyennée « ' + s.cle.replace(/\\/g, '') + ' »');
      if (!m) return;
      const nom = s.cle.replace(/\\/g, '');
      proche(e, nom + ' · recopies par insertion (moyenne)', sr / k, m[1]);
      proche(e, nom + ' · mémoire occupée', occupe, m[2]);
      proche(e, nom + ' · part gaspillée', occupe - 100, m[3]);
    });
  });

  ctrl('leçon 12 · tableau dynamique « ×2 » : insertion par insertion, et les quatre centiles', function (e) {
    const t = B12['amorti.txt'];
    const N = 100000;
    /* Les capacités valent 1, 2, 4, … : les insertions chères sont celles dont
       le rang vaut une capacité + 1, et leur coût vaut cette capacité + 1. */
    const chers = [];
    for (let cap = 1; cap < N; cap *= 2) chers.push(cap + 1);
    const recopies = chers.reduce(function (a, b) { return a + b - 1; }, 0);
    const total = N + recopies;
    const moyenne = total / N;
    const pic = chers[chers.length - 1];
    const m1 = ligne(t, /insertions à coût 1 \.+ : (\d+) sur (\d+) \(([\d.]+) %\)/, e, 'insertions à coût 1');
    if (m1) {
      egal(e, 'insertions à coût 1', N - chers.length, m1[1]);
      egal(e, 'total des insertions', N, m1[2]);
      proche(e, 'part des insertions à coût 1', 100 * (N - chers.length) / N, m1[3]);
    }
    const m2 = ligne(t, /insertions qui recopient \.+ : (\d+)/, e, 'insertions qui recopient');
    if (m2) egal(e, 'insertions qui recopient', chers.length, m2[1]);
    const m3 = ligne(t, /la plus chère \.+ : (\d+) unités, à l'insertion n° (\d+)/, e, 'insertion la plus chère');
    if (m3) { egal(e, 'coût de la plus chère', pic, m3[1]); egal(e, 'rang de la plus chère', pic, m3[2]); }
    const m4 = ligne(t, /coût total \.+ : (\d+)/, e, 'coût total');
    if (m4) egal(e, 'coût total', total, m4[1]);
    const m5 = ligne(t, /coût moyen par insertion \.+ : ([\d.]+)/, e, 'coût moyen');
    if (m5) proche(e, 'coût moyen', moyenne, m5[1]);
    const m6 = ligne(t, /vaut (\d+), soit (\d+) fois la moyenne/, e, 'pic rapporté à la moyenne');
    if (m6) { egal(e, 'valeur du pic', pic, m6[1]); egal(e, 'pic / moyenne', Math.round(pic / moyenne), m6[2]); }
    /* Centiles : rang ⌊p·N⌋ dans la suite triée — les 99 983 unités d'abord,
       puis les 17 coûts chers rangés par ordre croissant. */
    function centile(p) {
      const rang = Math.floor(p * N);
      const ordinaires = N - chers.length;
      return rang < ordinaires ? 1 : chers[rang - ordinaires];
    }
    [['coût médian', 0.5], ['99e centile', 0.99], ['99,9e centile', 0.999], ['99,99e centile', 0.9999]].forEach(function (c) {
      const m = ligne(t, new RegExp('^ {2}' + c[0] + ' \\.+ : (\\d+)$', 'm'), e, 'centile « ' + c[0] + ' »');
      if (m) egal(e, c[0], centile(c[1]), m[1]);
    });
    const m7 = ligne(t, /maximum \.+ : (\d+)/, e, 'maximum');
    if (m7) egal(e, 'maximum', pic, m7[1]);
  });

  ctrl('leçon 12 · tableau dynamique : la borne 2n vérifiée sur cinq tailles', function (e) {
    const t = B12['amorti.txt'];
    [1000, 10000, 65537, 100000, 1000000].forEach(function (n) {
      /* Les recopies valent 1 + 2 + … + 2^(k−1) = 2^k − 1, où 2^k est la plus
         petite puissance de 2 supérieure ou égale à n. */
      const rec = Math.pow(2, ceilLog2(n)) - 1;
      if (rec !== chaineCapacites(n, function (c) { return c * 2; }).recopies) {
        e.push('les deux calculs de référence divergent à n = ' + n);
      }
      const m = ligne(t, new RegExp('^ {2}n = +' + n + ' +recopies = +(\\d+) +recopies/n = ([\\d.]+) +< 2n : (\\w+)$', 'm'), e, 'ligne n = ' + n + ' de la borne 2n');
      if (!m) return;
      egal(e, 'recopies à n = ' + n, rec, m[1]);
      proche(e, 'recopies/n à n = ' + n, rec / n, m[2]);
      egal(e, 'borne 2n à n = ' + n, String(rec < 2 * n), m[3]);
    });
  });

  /* --- memoire.js -------------------------------------------------------- */
  ctrl('leçon 12 · Fibonacci : la valeur et les trois coûts, par formules exactes', function (e) {
    const t = B12['memoire.txt'];
    const n = 30;
    const valeur = fib(n).toString();
    /* Le récursif naïf fait 2·F(n+1) − 1 appels ; le mémoïsé en fait 2n − 1 et
       garde n − 1 cases ; l'itératif fait n tours. */
    const aNaif = 2 * Number(fib(n + 1)) - 1;
    const aMemo = 2 * n - 1;
    const l1 = ligne(t, /^récursif +(\d+) +(\d+) +(\d+) +O\(n\) — la pile$/m, e, 'ligne « récursif »');
    if (l1) { egal(e, 'valeur (récursif)', valeur, l1[1]); egal(e, 'appels du récursif', aNaif, l1[2]); egal(e, 'profondeur du récursif', n, l1[3]); }
    const l2 = ligne(t, /^mémoïsé +(\d+) +(\d+) +(\d+) +(\d+) cases$/m, e, 'ligne « mémoïsé »');
    if (l2) {
      egal(e, 'valeur (mémoïsé)', valeur, l2[1]);
      egal(e, 'appels du mémoïsé', aMemo, l2[2]);
      egal(e, 'profondeur du mémoïsé', n, l2[3]);
      egal(e, 'cases mémorisées', n - 1, l2[4]);
    }
    const l3 = ligne(t, /^itératif +(\d+) +(\d+) +(\d+) +2 variables$/m, e, 'ligne « itératif »');
    if (l3) { egal(e, 'valeur (itératif)', valeur, l3[1]); egal(e, 'tours de l\'itératif', n, l3[2]); egal(e, 'profondeur de l\'itératif', 1, l3[3]); }
    const m = ligne(t, /le récursif fait (\d+) fois plus d'appels que le mémoïsé,\net (\d+) fois plus que l'itératif/, e, 'les deux rapports d\'appels');
    if (m) {
      egal(e, 'rapport récursif/mémoïsé', Math.round(aNaif / aMemo), m[1]);
      egal(e, 'rapport récursif/itératif', Math.round(aNaif / n), m[2]);
    }
  });

  ctrl('leçon 12 · Fibonacci : la croissance en φ² et le facteur 577 face à 2^n', function (e) {
    const t = B12['memoire.txt'];
    let prec = null;
    for (let n = 20; n <= 30; n += 2) {
      const appels = 2 * Number(fib(n + 1)) - 1;
      const m = ligne(t, new RegExp('^ {2,3}' + n + ' +(\\d+) *([\\d.]*)$', 'm'), e, 'ligne n = ' + n + ' des appels du récursif');
      if (m) {
        egal(e, 'appels à n = ' + n, appels, m[1]);
        if (prec !== null) proche(e, 'rapport à n = ' + n, appels / prec, m[2]);
      }
      prec = appels;
    }
    /* φ par √5 exact : ⌊√(5·10^40)⌋ / 10^20. */
    const phi = (1 + Number(racineEntiere(5n * 10n ** 40n)) / 1e20) / 2;
    const m1 = ligne(t, /tend vers φ² = ([\d.]+), où φ est le nombre d'or/, e, 'valeur de φ²');
    if (m1) proche(e, 'φ²', phi * phi, m1[1]);
    const m2 = ligne(t, /^([\d.]+) au lieu de 2\. Il croît donc MOINS VITE que 2\^n — (\d+) fois moins à n = 30/m, e, 'valeur de φ et facteur 577');
    if (m2) {
      proche(e, 'φ', phi, m2[1]);
      egal(e, 'facteur 2^30 / φ^30', Math.round(Math.pow(2, 30) / Math.pow(phi, 30)), m2[2]);
    }
  });

  ctrl('leçon 12 · la version « slice » : n(n−1)/2 cellules vivantes', function (e) {
    const t = B12['memoire.txt'];
    [10, 100, 200, 400, 800].forEach(function (n) {
      /* Chaque étage garde une tranche de longueur (n−1), (n−2), …, 0, et elles
         sont toutes vivantes en même temps : la somme vaut n(n−1)/2. */
      let cel = 0;
      for (let k = 0; k < n; k++) cel += k;
      const m = ligne(t, new RegExp('^ {2,4}' + n + ' +(\\d+) +(\\d+)$', 'm'), e, 'ligne n = ' + n + ' des cellules allouées');
      if (!m) return;
      egal(e, 'cellules « slice » à n = ' + n, cel, m[1]);
      egal(e, 'cellules « indice » à n = ' + n, 0, m[2]);
    });
    const m = ligne(t, /à n = 800 elle a mobilisé (\d+) cellules/, e, 'total des cellules à n = 800');
    if (m) egal(e, 'cellules à n = 800', 800 * 799 / 2, m[1]);
    const p = ligne(P12, /soit n \( n −1\)\/2 = (\d[\d ]*) cellules pour additionner 800 nombres/, e, 'prose : les 319 600 cellules');
    if (p) egal(e, 'prose · cellules à n = 800', 800 * 799 / 2, p[1].replace(/ /g, ''));
  });

  /* --- echelle.js -------------------------------------------------------- */
  ctrl('leçon 12 · trois façons de trouver les doublons : ce que la donnée ne peut pas changer', function (e) {
    const t = B12['echelle.txt'];
    [500, 1000, 2000, 4000, 8000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,6}' + n + ' +(\\d+) +(\\d+) +(\\d+) +(\\w+)$', 'm'), e, 'ligne n = ' + n + ' des doublons');
      if (!m) return;
      egal(e, 'table de hachage à n = ' + n, n, m[3]);
      /* Tri suivi d'un passage : travail des fusions + (n−1) comparaisons. */
      egal(e, 'tri + passage à n = ' + n, travailFusion(n) + n - 1, m[2]);
      /* Les deux boucles, avec leur « break », restent sous le nombre de couples. */
      entre(e, 'deux boucles à n = ' + n, 0, m[1], C2(n));
      egal(e, 'même réponse à n = ' + n, 'true', m[4]);
      const mm = ligne(t, new RegExp('^ {2,6}' + n + ' +(\\d+) +([\\d.]+) +(\\d+) +([\\d.]+)$', 'm'), e, 'ligne n = ' + n + ' du modèle');
      if (!mm) return;
      egal(e, 'borne n(n−1)/2 à n = ' + n, C2(n), mm[1]);
      proche(e, 'mesuré/borne à n = ' + n, Number(m[1]) / C2(n), mm[2]);
      egal(e, 'modèle n·log₂n + (n−1) à n = ' + n, Math.round(n * log2(n) + (n - 1)), mm[3]);
      proche(e, 'mesuré/modèle à n = ' + n, Number(m[2]) / (n * log2(n) + (n - 1)), mm[4], 2);
    });
  });

  ctrl('leçon 12 · l\'extrapolation à un million de lignes, et les deux seuils résolus par balayage', function (e) {
    const t = B12['echelle.txt'];
    const M = 1000000;
    const opsNaif = C2(M), opsTri = M * log2(M) + (M - 1);
    const m1 = ligne(t, /deux boucles \.+ : ([\d.e+]+) opérations +→ +([\d.]+) min/, e, 'extrapolation des deux boucles');
    if (m1) { proche(e, 'opérations des deux boucles', opsNaif, m1[1].replace('e+', 'e'), 1); proche(e, 'durée des deux boucles', opsNaif / 1e9 / 60, m1[2]); }
    const m2 = ligne(t, /tri \+ passage \.+ : ([\d.e+]+) opérations +→ +([\d.]+) ms/, e, 'extrapolation du tri');
    if (m2) { proche(e, 'opérations du tri', opsTri, m2[1].replace('e+', 'e'), 1); proche(e, 'durée du tri', opsTri / 1e9 * 1000, m2[2]); }
    const m3 = ligne(t, /table de hachage \. : ([\d.e+]+) opérations +→ +([\d.]+) ms/, e, 'extrapolation du hachage');
    if (m3) { proche(e, 'opérations du hachage', M, m3[1].replace('e+', 'e'), 1); proche(e, 'durée du hachage', M / 1e9 * 1000, m3[2]); }
    const m4 = ligne(t, /rapport entre la première et la dernière : ([\d.e+]+) fois/, e, 'rapport première/dernière');
    if (m4) proche(e, 'rapport', opsNaif / M, m4[1].replace('e+', 'e'), 1);
    const m5 = ligne(t, /deux boucles \.+ : (\d+) opérations +→ +([\d.]+) µs/, e, 'deux boucles sur 200 lignes');
    if (m5) { egal(e, 'opérations à 200 lignes', C2(200), m5[1]); proche(e, 'durée à 200 lignes', C2(200) / 1e9 * 1e6, m5[2]); }
    const m6 = ligne(t, /écart absolu \.+ : ([\d.]+) µs/, e, 'écart absolu à 200 lignes');
    if (m6) proche(e, 'écart absolu', (C2(200) - 200) / 1e9 * 1e6, m6[1]);
    const m7 = ligne(t, /le rapport passe de ([\d.]+) à/, e, 'rapport à 200 lignes');
    if (m7) proche(e, 'rapport à 200 lignes', C2(200) / 200, m7[1]);
    /* Les deux seuils, par balayage entier de n. */
    let seconde = 2; while (C2(seconde) < 1e9) seconde++;
    let minute = 2; while (C2(minute) < 60e9) minute++;
    const m8 = ligne(t, /n = (\d+) lignes\. En dessous, personne/, e, 'seuil de la seconde');
    if (m8) egal(e, 'seuil de la seconde', seconde, m8[1]);
    const m9 = ligne(t, /pour dépasser une MINUTE : n = (\d+) lignes/, e, 'seuil de la minute');
    if (m9) egal(e, 'seuil de la minute', minute, m9[1]);
    const p = ligne(P12, /dépassent la seconde à partir de (\d[\d ]*) lignes, et la minute à partir de (\d[\d ]*)/, e, 'prose : les deux seuils');
    if (p) {
      egal(e, 'prose · seuil de la seconde', seconde, p[1].replace(/ /g, ''));
      egal(e, 'prose · seuil de la minute', minute, p[2].replace(/ /g, ''));
    }
  });

  /* --- exercices de la leçon 12 ------------------------------------------ */
  ctrl('leçon 12 · exercice 1 : les accès au tableau de « mystere », par somme fermée', function (e) {
    const t = B12['solution-1.txt'];
    /* Boucle en j : 2(n−i) accès pour chaque i, soit n(n+1) au total.
       Boucle en k : ⌊log₂(n−1)⌋+1 accès, répétés n fois. */
    function acces(n) { return n * (n + 1) + n * (floorLog2(n - 1) + 1); }
    let prec = null;
    [125, 250, 500, 1000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,4}' + n + ' +(\\d+) *([\\d.]*)$', 'm'), e, 'ligne n = ' + n + ' des accès');
      if (m) {
        egal(e, 'accès à n = ' + n, acces(n), m[1]);
        if (prec !== null) proche(e, 'rapport à n = ' + n, acces(n) / prec, m[2]);
      }
      prec = acces(n);
    });
    const m = ligne(t, /dernier rapport : ([\d.]+)/, e, 'dernier rapport');
    if (m) proche(e, 'dernier rapport', acces(1000) / acces(500), m[1]);
    const m2 = ligne(t, /exposant déduit : log₂\(([\d.]+)\) = ([\d.]+)/, e, 'exposant déduit');
    if (m2) proche(e, 'exposant déduit', log2(acces(1000) / acces(500)), m2[2]);
    const p = ligne(P12, /L'exposant déduit vaut ([\d,]+) — et non 2,00/, e, 'prose : l\'exposant 1,99');
    if (p) proche(e, 'prose · exposant déduit', log2(acces(1000) / acces(500)), p[1]);
  });

  ctrl('leçon 12 · exercice 2 : la jointure indexée coûte 2n, et le modèle n²/2', function (e) {
    const t = B12['solution-2.txt'];
    const N = 5000;
    const m1 = ligne(t, /version indexée \.+ : (\d+) opérations/, e, 'opérations de la version indexée');
    if (m1) egal(e, 'version indexée', 2 * N, m1[1]);
    const m0 = ligne(t, /version naïve \.+ : (\d+) opérations/, e, 'opérations de la version naïve');
    if (m0) entre(e, 'version naïve (encadrée par n et n²)', N, m0[1], N * N);
    const m2 = ligne(t, /rapport \.+ : (\d+) fois/, e, 'rapport naïve/indexée');
    if (m2 && m0 && m1) egal(e, 'rapport', Math.round(Number(m0[1]) / Number(m1[1])), m2[1]);
    const m3 = ligne(t, /soit n²\/2 = (\d+) opérations attendues\. Mesuré : (\d+), soit ([\d.]+) fois le modèle/, e, 'le modèle n²/2');
    if (m3) {
      egal(e, 'modèle n²/2', N * N / 2, m3[1]);
      proche(e, 'mesuré / modèle', Number(m3[2]) / (N * N / 2), m3[3]);
    }
    const m4 = ligne(t, /L'indexée en fait 2n = (\d+)/, e, '2n annoncé');
    if (m4) egal(e, '2n', 2 * N, m4[1]);
    let prec = null;
    [625, 1250, 2500, 5000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,4}' + n + ' .*$', 'm'), e, 'ligne n = ' + n + ' du doublement');
      if (!m) return;
      const c = cellules(m[0]);              // 3 cellules à la 1re ligne (pas de rapport), 5 ensuite
      if (c.length !== (prec === null ? 3 : 5)) { e.push('ligne n = ' + n + ' : ' + c.length + ' cellules'); return; }
      const naive = Number(c[1]), indexee = Number(prec === null ? c[2] : c[3]);
      egal(e, 'indexée à n = ' + n, 2 * n, indexee);
      if (prec !== null) {
        proche(e, 'rapport indexée à n = ' + n, 2, c[4]);
        proche(e, 'rapport naïve à n = ' + n, naive / prec, c[2]);
      }
      prec = naive;
    });
  });

  ctrl('leçon 12 · exercice 3 : la file à deux piles, borne et cohérence du comptage', function (e) {
    const t = B12['solution-3.txt'];
    const N = 100000;
    const m1 = ligne(t, /^(\d+) opérations : (\d+) enfilements, (\d+) défilements$/m, e, 'répartition des opérations');
    if (!m1) return;
    const enfil = Number(m1[2]), defil = Number(m1[3]);
    egal(e, 'total des opérations', N, m1[1]);
    if (enfil + defil !== N) e.push('enfilements + défilements = ' + (enfil + defil) + ' au lieu de ' + N);
    const m2 = ligne(t, /opérations élémentaires, deux piles \.+ : (\d+)/, e, 'total élémentaire');
    if (!m2) return;
    const total = Number(m2[1]);
    /* Chaque opération coûte 1, plus 2 par élément transféré : le surcoût est
       donc PAIR, positif, et le nombre d'éléments transférés ne peut dépasser
       le nombre d'enfilements. */
    const surcout = total - N;
    if (surcout < 0 || surcout % 2 !== 0) e.push('le surcoût ' + surcout + ' devrait être pair et positif');
    if (surcout / 2 > enfil) e.push('il aurait fallu transférer ' + (surcout / 2) + ' éléments pour ' + enfil + ' enfilements');
    const m3 = ligne(t, /coût amorti par opération \.+ : ([\d.]+)/, e, 'coût amorti');
    if (m3) proche(e, 'coût amorti', total / N, m3[1]);
    const m4 = ligne(t, /la plus chère \.+ : (\d+) — soit (\d+) fois le coût amorti/, e, 'opération la plus chère');
    if (m4) {
      const pire = Number(m4[1]);
      if (pire % 2 === 0) e.push('le coût de la plus chère (' + pire + ') devrait être impair : 2k transferts + 1 dépilement');
      if ((pire - 1) / 2 > enfil) e.push('la plus chère transfère plus d\'éléments qu\'il n\'y a eu d\'enfilements');
      egal(e, 'pire / amorti', Math.round(pire / (total / N)), m4[2]);
    }
    const m5 = ligne(t, /4 × (\d+) enfilements = (\d+) au maximum/, e, 'la borne 4 × enfilements');
    if (m5) { egal(e, 'enfilements dans la borne', enfil, m5[1]); egal(e, 'borne 4n', 4 * enfil, m5[2]); }
    const m6 = ligne(t, /la borne tient : (\w+)/, e, 'la borne tient');
    if (m6) egal(e, 'la borne tient', String(total <= 4 * enfil), m6[1]);
    const m7 = ligne(t, /opérations à coût 1 \.+ : (\d+)/, e, 'opérations à coût 1');
    if (m7) {
      /* Une opération coûte 1 sauf les défilements qui transfèrent : leur
         nombre déduit doit être compatible avec le surcoût. */
      const transferts = N - Number(m7[1]);
      if (transferts < 1 || transferts > surcout / 2) e.push('le nombre de transferts déduit (' + transferts + ') est incompatible avec le surcoût ' + surcout);
    }
    const m8 = ligne(t, /opérations élémentaires, file naïve \.+ : (\d+)/, e, 'file naïve');
    const m9 = ligne(t, /rapport avec la version à deux piles \.+ : (\d+) fois/, e, 'rapport des deux files');
    if (m8 && m9) egal(e, 'rapport naïve / deux piles', Math.round(Number(m8[1]) / total), m9[1]);
  });

  /* ===================== LEÇON 13 ====================================== */

  ctrl('leçon 13 · le logarithme comme compteur de divisions : ⌊log₂n⌋, écarts, platitude et changement de base', function (e) {
    const t = B13['log-def.txt'];
    /* 1. la table : divisions entières par 2, log₂ à 3 puis 6 décimales, écart. */
    [1, 2, 3, 4, 8, 10, 100, 1000, 1024, 1000000, 1073741824].forEach(function (n) {
      const compte = floorLog2(n);           // longueur binaire − 1, aucun logarithme
      const exact = log2(n);
      const m = ligne(t, new RegExp('^ +' + n + ' +(\\d+) +([\\d.-]+) +([\\d.-]+) +(-?[\\d.]+)$', 'm'), e, 'ligne n = ' + n + ' de la table des divisions');
      if (!m) return;
      egal(e, 'divisions par 2 à n = ' + n, compte, m[1]);
      proche(e, 'log₂ à 3 décimales, n = ' + n, exact, m[2]);
      proche(e, 'log₂ à 6 décimales, n = ' + n, exact, m[3]);
      proche(e, 'écart à n = ' + n, compte - exact, m[4]);
      /* et l'affirmation qui accompagne la table : le compte vaut ⌊log₂n⌋ */
      if (!(compte <= exact && exact - compte < 1)) e.push('à n = ' + n + ', le compte n\'est pas ⌊log₂n⌋');
    });
    /* 2. « passer de n à 2n ajoute exactement 1 » */
    let prec2 = null;
    [1000, 2000, 4000, 8000].forEach(function (m0) {
      const m = ligne(t, new RegExp('^ {4}log₂\\( *' + m0 + '\\) = ([\\d.]+)$', 'm'), e, 'log₂(' + m0 + ')');
      if (!m) return;
      proche(e, 'log₂(' + m0 + ')', log2(m0), m[1]);
      if (prec2 !== null && Math.abs((log2(m0) - prec2) - 1) > 1e-12) e.push('log₂(' + m0 + ') n\'ajoute pas exactement 1');
      prec2 = log2(m0);
    });
    /* 3. la table de 10³ à 10¹⁸ et ses incréments */
    let precL = null;
    [3, 6, 9, 12, 15, 18].forEach(function (k) {
      const v = k * LOG2_10;
      const m = ligne(t, new RegExp('^ +1e\\+' + k + ' +([\\d.]+) *(\\+[\\d.]+)?$', 'm'), e, 'ligne 1e+' + k);
      if (!m) return;
      proche(e, 'log₂(10^' + k + ')', v, m[1]);
      if (precL !== null) {
        if (!m[2]) { e.push('increment absent à 1e+' + k); return; }
        proche(e, 'ajout depuis la ligne précédente à 1e+' + k, v - precL, m[2]);
      }
      precL = v;
    });
    const m6 = ligne(t, /passe de ([\d.]+) à ([\d.]+)\. Il est multiplié par ([\d.]+)/, e, 'de 10³ à 10¹⁸');
    if (m6) {
      proche(e, 'log₂(1000)', 3 * LOG2_10, m6[1]);
      proche(e, 'log₂(10^18)', 18 * LOG2_10, m6[2]);
      proche(e, 'facteur entre les deux', 18 / 3, m6[3]);
    }
    /* 4. les trois logarithmes de 10⁶ et la constante de changement de base */
    const n6 = 1000000;
    const m7 = ligne(t, /log₂\(1000000\) += ([\d.]+)/, e, 'log₂(10^6)');
    if (m7) proche(e, 'log₂(10^6)', log2(n6), m7[1]);
    const m8 = ligne(t, /log₁₀\(1000000\) = ([\d.]+)/, e, 'log₁₀(10^6)');
    if (m8) proche(e, 'log₁₀(10^6)', log10(n6), m8[1]);
    const m9 = ligne(t, /ln\(1000000\) += ([\d.]+)/, e, 'ln(10^6)');
    if (m9) proche(e, 'ln(10^6)', ln(n6), m9[1]);
    const ma = ligne(t, /log₂ \/ log₁₀ = ([\d.]+) +et 1\/log₁₀\(2\) = ([\d.]+)/, e, 'rapport log₂/log₁₀');
    if (ma) { proche(e, 'log₂/log₁₀', LOG2_10, ma[1]); proche(e, '1/log₁₀(2)', LOG2_10, ma[2]); }
    const mb = ligne(t, /log₂ \/ ln \.+ = ([\d.]+) +et 1\/ln\(2\) \.+ = ([\d.]+)/, e, 'rapport log₂/ln');
    if (mb) { proche(e, 'log₂/ln', LOG2_E, mb[1]); proche(e, '1/ln(2)', LOG2_E, mb[2]); }
    [7, 1000, 123456789].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2}n = +' + n + ' +log₂/log₁₀ = ([\\d.]+)$', 'm'), e, 'rapport constant à n = ' + n);
      if (m) proche(e, 'log₂/log₁₀ à n = ' + n, log2(n) / log10(n), m[1]);
    });
  });

  ctrl('leçon 13 · dichotomie : (n+1)/2 exact, ⌈log₂(n+1)⌉ exact, et les moyennes par récurrence de profondeurs', function (e) {
    const t = B13['dicho.txt'];
    /* Table exhaustive : quatre tailles, cinq colonnes. */
    [10, 100, 1000, 5000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,6}' + n + ' +([\\d.]+) +([\\d.]+) +([\\d.]+) +(\\d+) +(\\d+)$', 'm'), e, 'ligne n = ' + n + ' de la table exhaustive');
      if (!m) return;
      proche(e, 'linéaire (moyenne) à n = ' + n, (n + 1) / 2, m[1]);
      proche(e, 'colonne (n+1)/2 à n = ' + n, (n + 1) / 2, m[2]);
      proche(e, 'dichotomie (moyenne) à n = ' + n, sommeProfondeurs(n) / n, m[3]);
      egal(e, 'dichotomie (pire) à n = ' + n, ceilLog2(n + 1), m[4]);
      egal(e, 'colonne ⌈log₂(n+1)⌉ à n = ' + n, ceilLog2(n + 1), m[5]);
    });
    /* Grandes tailles. */
    [50000, 200000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,7}' + n + ' +([\\d.]+) +(\\d+) +(\\d+) +([\\d.]+)$', 'm'), e, 'ligne n = ' + n + ' des grandes tailles');
      if (!m) return;
      proche(e, 'dichotomie (moyenne) à n = ' + n, sommeProfondeurs(n) / n, m[1]);
      egal(e, 'dichotomie (pire) à n = ' + n, ceilLog2(n + 1), m[2]);
      egal(e, 'colonne ⌈log₂(n+1)⌉ à n = ' + n, ceilLog2(n + 1), m[3]);
      proche(e, 'linéaire par formule à n = ' + n, (n + 1) / 2, m[4]);
    });
    /* De mille à mille milliards. */
    [3, 6, 9, 12].forEach(function (k) {
      const n = Math.pow(10, k);
      const m = ligne(t, new RegExp('^ +1e\\+' + k + ' +1e\\+' + k + ' +(\\d+)$', 'm'), e, 'ligne 1e+' + k + ' de la table des grandes tailles');
      if (m) egal(e, 'dichotomie au pire à 10^' + k, ceilLog2(BigInt(n) + 1n), m[1]);
    });
    const m = ligne(t, /Un milliard d'éléments : (\d+) comparaisons\. Mille milliards : (\d+)\./, e, 'les deux chiffres à retenir');
    if (m) {
      egal(e, 'un milliard', ceilLog2(1000000001n), m[1]);
      egal(e, 'mille milliards', ceilLog2(1000000000001n), m[2]);
    }
    const m2 = ligne(t, /Multiplier la taille par mille coûte (\d+) comparaisons de plus/, e, 'l\'écart de dix comparaisons');
    if (m2) egal(e, 'écart', ceilLog2(1000000000001n) - ceilLog2(1000000001n), m2[1]);
  });

  ctrl('leçon 13 · dichotomie : le prix d\'entrée du tri, le gain et le seuil de rentabilité', function (e) {
    const t = B13['dicho.txt'];
    const n = 100000;
    const m1 = ligne(t, /trier une fois, MESURÉ \.+ : (\d+) comparaisons/, e, 'comparaisons du tri');
    if (!m1) return;
    const coutTri = Number(m1[1]);
    /* Encadrement d'un tri fusion : une fusion de p et q coûte entre min(p,q)
       et p+q−1 comparaisons ; il y a n−1 fusions, et la somme des tailles
       fusionnées vaut travailFusion(n). */
    const M = travailFusion(n);
    entre(e, 'comparaisons du tri fusion', (M - (n - 1)) / 2, coutTri, M - (n - 1));
    const m2 = ligne(t, /le modèle n·log₂n en annoncerait (\d+), soit ([\d.]+) fois la mesure/, e, 'le modèle n·log₂n');
    if (m2) {
      egal(e, 'modèle n·log₂n', Math.round(n * log2(n)), m2[1]);
      proche(e, 'modèle / mesure', (n * log2(n)) / coutTri, m2[2]);
    }
    /* La recherche linéaire échantillonnée : positions 0, 200, …, 99 800.
       Sans doublon elle coûte en moyenne (Σ(i+1))/500 = 49 901 ; les doublons
       ne peuvent que l'abaisser, jamais la relever. */
    let somme = 0, ech = 0;
    for (let i = 0; i < n; i += 200) { somme += i + 1; ech++; }
    const ideal = somme / ech;
    const m3 = ligne(t, /une recherche linéaire \.+ : ([\d.]+) comparaisons, moyennées sur (\d+) positions/, e, 'coût de la recherche linéaire');
    if (!m3) return;
    const coutLin = Number(m3[1]);
    egal(e, 'taille de l\'échantillon', ech, m3[2]);
    entre(e, 'coût de la recherche linéaire', ideal - 20, coutLin, ideal + 0.05);
    const m4 = ligne(t, /une recherche dichotomique \.+ : ([\d.]+) comparaisons/, e, 'coût de la recherche dichotomique');
    if (!m4) return;
    const coutDic = Number(m4[1]);
    /* La moyenne sur TOUTES les positions se calcule par récurrence ; un
       échantillon d'une position sur 200 ne peut s'en écarter que de peu. */
    proche(e, 'coût de la recherche dichotomique', sommeProfondeurs(n) / n, coutDic, 100);
    const m5 = ligne(t, /gain par recherche \.+ : (\d+) comparaisons/, e, 'gain par recherche');
    if (m5) egal(e, 'gain par recherche', Math.round(coutLin - coutDic), m5[1]);
    /* Le seuil : premier k, par balayage, où trier devient rentable. */
    let k = 1; while (coutTri + k * coutDic > k * coutLin) k++;
    const m6 = ligne(t, /seuil de rentabilité \.+ : (\d+) recherches/, e, 'seuil de rentabilité');
    if (m6) egal(e, 'seuil de rentabilité', k, m6[1]);
    /* La prose affirme qu'avec le MODÈLE le seuil vaudrait 34 : on le refait. */
    let km = 1; const modele = n * log2(n);
    while (modele + km * coutDic > km * coutLin) km++;
    const p = ligne(P13, /Le modèle annonce (\d[\d ]*) comparaisons quand le tri en fait (\d[\d ]*) : ([\d,]+) fois trop, et le seuil passait de (\d+) à (\d+)/, e, 'prose : le seuil du modèle');
    if (p) {
      egal(e, 'prose · modèle', Math.round(modele), p[1].replace(/ /g, ''));
      egal(e, 'prose · mesure', coutTri, p[2].replace(/ /g, ''));
      proche(e, 'prose · rapport modèle/mesure', modele / coutTri, p[3]);
      egal(e, 'prose · seuil mesuré', k, p[4]);
      egal(e, 'prose · seuil du modèle', km, p[5]);
    }
  });

  ctrl('leçon 13 · arbres : hauteur n et coût (n+1)/2 en ordre croissant, hauteur minimale ⌈log₂(n+1)⌉ une fois équilibré', function (e) {
    const t = B13['arbres.txt'];
    [1000, 5000].forEach(function (n) {
      const mc = ligne(t, new RegExp('^ {2,5}' + n + ' +croissant +(\\d+) +([\\d.]+) +([\\d.]+)$', 'm'), e, 'ligne « croissant » à n = ' + n);
      if (mc) {
        /* Les valeurs n'allant jamais à gauche, l'arbre est une liste : hauteur n,
           et la valeur de rang i se trouve en i+1 comparaisons. */
        egal(e, 'hauteur en ordre croissant à n = ' + n, n, mc[1]);
        proche(e, 'log₂(n) à n = ' + n, log2(n), mc[2]);
        proche(e, 'coût moyen en ordre croissant à n = ' + n, (n + 1) / 2, mc[3]);
      }
      const me = ligne(t, new RegExp('^ {2,5}' + n + ' +équilibré +(\\d+) +([\\d.]+) +([\\d.]+)$', 'm'), e, 'ligne « équilibré » à n = ' + n);
      if (me) {
        egal(e, 'hauteur équilibrée à n = ' + n, ceilLog2(n + 1), me[1]);
        proche(e, 'coût moyen équilibré à n = ' + n, sommeProfondeurs(n) / n, me[3]);
      }
      const mh = ligne(t, new RegExp('^ {2,5}' + n + ' +tiré au sort +(\\d+) +([\\d.]+) +([\\d.]+)$', 'm'), e, 'ligne « tiré au sort » à n = ' + n);
      if (mh && mc && me) {
        /* Non recalculable sans le générateur du cours : on l'encadre. */
        entre(e, 'hauteur au hasard à n = ' + n, ceilLog2(n + 1), mh[1], n);
        entre(e, 'coût moyen au hasard à n = ' + n, sommeProfondeurs(n) / n, mh[3], (n + 1) / 2);
      }
    });
    const m = ligne(t, /dégénéré : ([\d.]+) comparaisons +équilibré : ([\d.]+) +rapport : (\d+) fois/, e, 'l\'écart à n = 5000');
    if (m) {
      proche(e, 'coût dégénéré à n = 5000', 2500.5, m[1]);
      proche(e, 'coût équilibré à n = 5000', sommeProfondeurs(5000) / 5000, m[2]);
      egal(e, 'rapport dégénéré/équilibré', Math.round(2500.5 / (sommeProfondeurs(5000) / 5000)), m[3]);
    }
    const m2 = ligne(t, /hauteur (\d+) contre (\d+) — et le code d'insertion est le MÊME/, e, 'les deux hauteurs à n = 5000');
    if (m2) { egal(e, 'hauteur dégénérée', 5000, m2[1]); egal(e, 'hauteur équilibrée', ceilLog2(5001), m2[2]); }
  });

  ctrl('leçon 13 · arbres : les hauteurs aux grandes tailles, et la constante 4,311·ln(n)', function (e) {
    const t = B13['arbres.txt'];
    [1000, 10000, 100000].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,7}' + n + ' +(\\d+) +(\\d+) +(\\d+) +([\\d.]+) +([\\d.]+)$', 'm'), e, 'ligne n = ' + n + ' des hauteurs');
      if (!m) return;
      egal(e, 'hauteur en ordre croissant à n = ' + n, n, m[1]);
      egal(e, 'hauteur équilibrée à n = ' + n, ceilLog2(n + 1), m[2]);
      egal(e, 'colonne ⌈log₂(n+1)⌉ à n = ' + n, ceilLog2(n + 1), m[3]);
      /* La hauteur moyenne de 20 mélanges dépend du générateur : encadrement. */
      entre(e, 'hauteur au hasard à n = ' + n, ceilLog2(n + 1), m[4], n);
      proche(e, 'rapport à log₂n à n = ' + n, Number(m[4]) / log2(n), m[5]);
      const mm = ligne(t, new RegExp('^ {2}n = +' + n + ' +4,311·ln\\(n\\) = ([\\d.]+) +moins 1,953·ln\\(ln n\\) = ([\\d.]+)$', 'm'), e, 'ligne n = ' + n + ' du terme dominant');
      if (!mm) return;
      proche(e, '4,311·ln(n) à n = ' + n, 4.311 * ln(n), mm[1]);
      proche(e, '4,311·ln(n) − 1,953·ln(ln n) à n = ' + n, 4.311 * ln(n) - 1.953 * ln(ln(n)), mm[2]);
    });
    const m = ligne(t, /il tend est connue : 4,311·ln\(n\), soit ([\d.]+)·log₂\(n\)/, e, 'la constante en log₂');
    if (m) proche(e, '4,311·ln(2)', 4.311 / LOG2_E, m[1]);
  });

  ctrl('leçon 13 · diviser pour régner : largeur × profondeur du tri fusion, et l\'exposant de Karatsuba', function (e) {
    const t = B13['diviser.txt'];
    const N = 1024;
    let total = 0;
    for (let etage = 0; etage <= 9; etage++) {
      const morceaux = Math.pow(2, etage), taille = N / morceaux;
      total += N;
      const m = ligne(t, new RegExp('^ {2,6}' + etage + ' +(\\d+) +(\\d+) +(\\d+)$', 'm'), e, 'étage ' + etage + ' du tri fusion');
      if (!m) return;
      egal(e, 'morceaux à l\'étage ' + etage, morceaux, m[1]);
      egal(e, 'taille de chaque morceau à l\'étage ' + etage, taille, m[2]);
      egal(e, 'cases parcourues à l\'étage ' + etage, N, m[3]);
    }
    const mt = ligne(t, /^ {2}total +(\d+)$/m, e, 'total du travail par étage');
    if (mt) egal(e, 'total', total, mt[1]);
    const me = ligne(t, /Le nombre d'étages qui travaillent vaut log₂\(1024\) = (\d+)\./, e, 'nombre d\'étages');
    if (me) egal(e, 'nombre d\'étages', log2(N), me[1]);
    const md = ligne(t, /n × log₂\(n\) = 1024 × (\d+) = (\d+), et le mesuré vaut (\d+)/, e, 'la formule largeur × profondeur');
    if (md) {
      egal(e, 'log₂(1024)', log2(N), md[1]);
      egal(e, 'produit n × log₂n', N * log2(N), md[2]);
      egal(e, 'total mesuré', total, md[3]);
    }
    /* Multiplication : la méthode scolaire fait exactement n² produits ; celle
       de Karatsuba en fait au moins n^log₂3 et au plus n², sans quoi son
       exposant serait faux. */
    let ps = null, pk = null;
    [16, 32, 64, 128, 256].forEach(function (n) {
      const m = ligne(t, new RegExp('^ {2,8}' + n + ' +(\\d+) *([\\d.]*) +(\\d+) *([\\d.]*) +(\\w+)$', 'm'), e, 'ligne n = ' + n + ' des multiplications');
      if (!m) return;
      egal(e, 'produits de la méthode scolaire à n = ' + n, n * n, m[1]);
      const k = Number(m[3]);
      entre(e, 'produits de Karatsuba à n = ' + n, Math.pow(n, log2(3)), k, n * n);
      egal(e, 'résultats identiques à n = ' + n, 'true', m[5]);
      if (ps !== null) {
        proche(e, 'rapport scolaire à n = ' + n, (n * n) / ps, m[2]);
        proche(e, 'rapport Karatsuba à n = ' + n, k / pk, m[4]);
      }
      ps = n * n; pk = k;
    });
    const mx = ligne(t, /méthode scolaire : log₂\(([\d.]+)\) = ([\d.]+) +théorie : 2/, e, 'exposant de la méthode scolaire');
    if (mx) { proche(e, 'rapport final scolaire', 4, mx[1]); proche(e, 'exposant scolaire', 2, mx[2]); }
    const mk = ligne(t, /Karatsuba \.+ : log₂\(([\d.]+)\) = ([\d.]+) +théorie : log₂\(3\) = ([\d.]+)/, e, 'exposant de Karatsuba');
    if (mk && pk !== null) {
      proche(e, 'exposant de Karatsuba', log2(Number(mk[1])), mk[2], 10);
      proche(e, 'log₂(3)', log2(3), mk[3]);
    }
    const mr = ligne(t, /À 1 000 chiffres, le rapport prévu vaut ([\d.]+) ; à 10\^6 chiffres, (\d+)\./, e, 'les deux rapports prévus');
    if (mr) {
      proche(e, 'rapport à 1000 chiffres', Math.pow(1000, 2 - log2(3)), mr[1]);
      proche(e, 'rapport à 10^6 chiffres', Math.pow(1e6, 2 - log2(3)), mr[2]);
    }
  });

  /* Le plus grand n traitable dans un budget, en arithmétique EXACTE : on
     cherche le plus grand entier dont le coût tient, sans jamais évaluer une
     puissance en virgule flottante. Le plafond de comptage exact est 10^15. */
  const PLAFOND = 1000000000000000n;
  function plusGrandN(cout, budget) {
    switch (cout) {
      case 'n': return budget < PLAFOND ? budget : PLAFOND;
      case 'n2': { const v = racineEntiere(budget); return v < PLAFOND ? v : PLAFOND; }
      case 'n3': { const v = racineCubique(budget); return v < PLAFOND ? v : PLAFOND; }
      case '2n': { let k = 0n, v = 1n; while (v * 2n <= budget) { v *= 2n; k++; } return k; }
      case 'fact': { let k = 1n, v = 1n; while (v * (k + 1n) <= budget) { k++; v *= k; } return k; }
      default: throw new Error('coût inconnu');
    }
  }
  function court(n) {                       // la mise en forme que la page emploie
    if (n >= PLAFOND) return '> 1e15';
    const x = Number(n);
    return x < 1e7 ? String(x) : x.toExponential(2);
  }
  const BUDGETS = [['une seconde', 1n], ['une minute', 60n], ['une heure', 3600n],
    ['un jour', 86400n], ['un an', 31557600n], ['un siècle', 3155760000n]];
  const COUTS = [['n {2}\\(linéaire\\)', 'n'], ['n² {2}\\(quadratique\\)', 'n2'],
    ['n³ {2}\\(cubique\\)', 'n3'], ['2\\^n \\(exponentiel\\)', '2n'], ['n! {2}\\(factoriel\\)', 'fact']];

  ctrl('leçon 13 · exponentielle : les 2^n énumérés, et les 30 cellules du plus grand n traitable', function (e) {
    const t = B13['exponentielle.txt'];
    /* 1. la table des parties : 2^n exact, en BigInt. */
    let prec = null;
    for (let n = 0; n <= 14; n++) {
      const p = (2n ** BigInt(n)).toString();
      const m = ligne(t, new RegExp('^ {2,4}' + n + ' +(\\d+) +(\\d+) *(\\d*)$', 'm'), e, 'ligne n = ' + n + ' des parties');
      if (!m) continue;
      egal(e, 'parties énumérées à n = ' + n, p, m[1]);
      egal(e, 'colonne 2^n à n = ' + n, p, m[2]);
      if (prec !== null) egal(e, 'rapport avec n−1 à n = ' + n, 2, m[3]);
      prec = p;
    }
    /* 2. le plus grand n traitable : 5 coûts × 6 budgets. */
    const debut = t.indexOf('LE PLUS GRAND n TRAITABLE');
    const fin = t.indexOf('CE QU\'ACHÈTE');
    if (debut < 0 || fin < 0) { e.push('ligne introuvable : la table du plus grand n traitable'); return; }
    const bloc = t.slice(debut, fin);
    COUTS.forEach(function (c) {
      const m = ligne(bloc, new RegExp('^' + c[0] + ' +(.+)$', 'm'), e, 'ligne « ' + c[0].replace(/\\/g, '') + ' »');
      if (!m) return;
      const cel = cellules(m[1]);
      if (cel.length !== 6) { e.push(c[1] + ' : ' + cel.length + ' cellules au lieu de 6'); return; }
      BUDGETS.forEach(function (b, i) {
        egal(e, c[1] + ' pour ' + b[0], court(plusGrandN(c[1], b[1] * 1000000000n)), cel[i]);
      });
    });
  });

  ctrl('leçon 13 · exponentielle : ce qu\'achète une machine ×1000, et les mots de passe', function (e) {
    const t = B13['exponentielle.txt'];
    const debut = t.indexOf('CE QU\'ACHÈTE');
    const fin = t.indexOf('COMBINAISONS D\'UN MOT DE PASSE');
    if (debut < 0 || fin < 0) { e.push('ligne introuvable : la table de la machine ×1000'); return; }
    const bloc = t.slice(debut, fin);
    COUTS.forEach(function (c) {
      const a = plusGrandN(c[1], 3600n * 1000000000n);
      const b = plusGrandN(c[1], 3600000n * 1000000000n);
      const plafonne = b >= PLAFOND;
      const m = ligne(bloc, new RegExp('^' + c[0] + ' +(.+)$', 'm'), e, 'ligne ×1000 « ' + c[0].replace(/\\/g, '') + ' »');
      if (!m) return;
      const cel = cellules(m[1]);
      if (cel.length !== 4) { e.push(c[1] + ' : ' + cel.length + ' cellules au lieu de 4'); return; }
      egal(e, c[1] + ' · n aujourd\'hui', court(a), cel[0]);
      egal(e, c[1] + ' · n avec ×1000', court(b), cel[1]);
      egal(e, c[1] + ' · gagné', plafonne ? '—' : court(b - a), cel[2]);
      if (!plafonne) proche(e, c[1] + ' · facteur', Number(b) / Number(a), cel[3]);
      else egal(e, c[1] + ' · facteur', '—', cel[3]);
    });
    const m = ligne(t, /multiplie par 1000 la taille\ntraitable en linéaire, par ([\d.]+) en cubique… et en ajoute (\d+) en exponentiel/, e, 'les deux facteurs de la conclusion');
    if (m) {
      proche(e, 'racine cubique de 1000', Math.pow(1000, 1 / 3), m[1]);
      egal(e, 'éléments gagnés en exponentiel', Math.round(log2(1000)), m[2]);
    }
    /* Mots de passe : combinaisons exactes en BigInt, durées à l'unité affichée. */
    const UNITE = { ms: 1e-3, s: 1, min: 60, h: 3600, j: 86400, ans: 31557600 };
    [[26, 8], [26, 10], [62, 8], [62, 10], [62, 12], [95, 12], [95, 16]].forEach(function (p) {
      const a = p[0], l = p[1];
      const combi = BigInt(a) ** BigInt(l);
      const essais = Number(combi);
      const m = ligne(t, new RegExp('^ {2,8}' + a + ' +' + l + ' +(.+)$', 'm'), e, 'ligne ' + a + '^' + l + ' des mots de passe');
      if (!m) return;
      const cel = cellules(m[1]);
      if (cel.length !== 3) { e.push(a + '^' + l + ' : ' + cel.length + ' cellules au lieu de 3'); return; }
      egal(e, 'combinaisons ' + a + '^' + l, essais.toExponential(3), cel[0].replace('e+', 'e+'));
      [['tout essayer', essais, cel[1]], ['la moitié', essais / 2, cel[2]]].forEach(function (d) {
        const mm = String(d[2]).match(/^([\d.e+]+) (\w+)$/);
        if (!mm) { e.push('durée illisible : « ' + d[2] + ' »'); return; }
        if (!UNITE[mm[2]]) { e.push('unité inconnue : « ' + mm[2] + ' »'); return; }
        proche(e, d[0] + ' ' + a + '^' + l, d[1] / 1e9 / UNITE[mm[2]], mm[1].replace('e+', 'e'));
      });
    });
    const m2 = ligne(t, /Ajouter deux caractères le multiplie par (\d+)/, e, 'facteur de deux caractères');
    if (m2) egal(e, '62 × 62', 62 * 62, m2[1]);
    const m3 = ligne(t, /8 caractères multiplie par ([\d.e+]+), passer de 8 à 12 caractères sur 26 multiplie par ([\d.e+]+)/, e, 'les deux facteurs finaux');
    if (m3) {
      proche(e, '95^8 / 26^8', Number(95n ** 8n) / Number(26n ** 8n), m3[1].replace('e+', 'e'), 1);
      proche(e, '26^12 / 26^8', Number(26n ** 4n), m3[2].replace('e+', 'e'), 1);
    }
  });

  ctrl('leçon 13 · le logarithme caché : chiffres, bits, racine carrée et bits d\'entropie', function (e) {
    const t = B13['partout.txt'];
    /* Chiffres et bits comptés par divisions successives — ni String(n).length,
       ni toString(2), ni logarithme. */
    function compteChiffres(n) { let c = 0, v = n; while (v > 0) { v = Math.floor(v / 10); c++; } return c; }
    function compteBits(n) { let c = 0, v = n; while (v > 0) { v = Math.floor(v / 2); c++; } return c; }
    [7, 42, 255, 1000, 65535, 1000000, 2147483647].forEach(function (n) {
      const m = ligne(t, new RegExp('^ +' + n + ' +(\\d+) +(\\d+) +(\\d+) +(\\d+)$', 'm'), e, 'ligne n = ' + n + ' des chiffres et des bits');
      if (!m) return;
      egal(e, 'chiffres de ' + n, compteChiffres(n), m[1]);
      egal(e, '⌊log₁₀n⌋+1 pour ' + n, Math.floor(log10(n)) + 1, m[2]);
      egal(e, 'bits de ' + n, compteBits(n), m[3]);
      egal(e, '⌊log₂n⌋+1 pour ' + n, floorLog2(n) + 1, m[4]);
    });
    /* √n arrondi, exact : m = ⌊√n⌋, puis m+1 si n > m² + m. */
    [1000003, 1000000007].forEach(function (n) {
      const b = BigInt(n), m0 = racineEntiere(b);
      const arrondi = b > m0 * m0 + m0 ? m0 + 1n : m0;
      const m = ligne(t, new RegExp('^ {2}n = +' + n + ' +(\\d+) bits +√n ≈ (\\d+) divisions, soit 2\\^([\\d.]+)', 'm'), e, 'ligne n = ' + n + ' de la primalité');
      if (!m) return;
      egal(e, 'bits de ' + n, compteBits(n), m[1]);
      egal(e, '√' + n + ' arrondi', arrondi.toString(), m[2]);
      proche(e, 'log₂(√' + n + ')', log2(n) / 2, m[3]);
    });
    /* Entropie : possibilités exactes en BigInt, bits par log₂. */
    const ENT = [['un dé à 6 faces', 6n], ['une lettre minuscule', 26n], ['un caractère imprimable', 95n],
      ['un code PIN à 4 chiffres', 10000n], ['4 mots parmi 7776 \\(méthode dés\\)', 7776n ** 4n],
      ['une clé de 128 bits', 2n ** 128n]];
    ENT.forEach(function (p) {
      const n = Number(p[1]);
      const m = ligne(t, new RegExp('^ {2}' + p[0] + ' +([\\d.e+]+) +([\\d.]+) +([\\d.e+]+)$', 'm'), e, 'ligne « ' + p[0].replace(/\\/g, '') + ' » de l\'entropie');
      if (!m) return;
      egal(e, 'possibilités · ' + p[0].replace(/\\/g, ''), n < 1e6 ? String(n) : n.toExponential(2), m[1]);
      proche(e, 'bits · ' + p[0].replace(/\\/g, ''), log2(p[1]), m[2]);
      egal(e, 'essais moyens · ' + p[0].replace(/\\/g, ''), n / 2 < 1e6 ? String(n / 2) : (n / 2).toExponential(2), m[3]);
    });
    const m = ligne(t, /liste de 7776 valent ([\d.]+) bits, contre ([\d.]+) bits pour/, e, 'les deux entropies comparées');
    if (m) {
      proche(e, 'entropie de 4 mots parmi 7776', log2(7776n ** 4n), m[1]);
      proche(e, 'entropie de 8 caractères parmi 95', 8 * log2(95), m[2]);
    }
    const m2 = ligne(t, /caractères imprimables : ([\d.]+) fois moins de possibilités,\nsoit un écart de ([\d.]+) bit/, e, 'l\'écart entre les deux');
    if (m2) {
      proche(e, 'rapport des possibilités', Number(95n ** 8n) / Number(7776n ** 4n), m2[1]);
      proche(e, 'écart en bits', 8 * log2(95) - log2(7776n ** 4n), m2[2]);
    }
  });

  ctrl('leçon 13 · l\'attente doublée : les 14 tentatives, les deux totaux, et le nombre d\'essais pour couvrir une heure', function (e) {
    const t = B13['partout.txt'];
    let totalSans = 0, totalAvec = 0, dernier = 0;
    for (let i = 0; i < 14; i++) {
      const sans = 100 * Math.pow(2, i);
      const avec = Math.min(sans, 30000);
      totalSans += sans; totalAvec += avec; dernier = sans;
      const m = ligne(t, new RegExp('^ {2,10}' + (i + 1) + ' +(\\d+) +(\\d+)$', 'm'), e, 'tentative ' + (i + 1));
      if (!m) continue;
      egal(e, 'attente sans plafond, tentative ' + (i + 1), sans, m[1]);
      egal(e, 'attente plafonnée, tentative ' + (i + 1), avec, m[2]);
    }
    /* La somme géométrique : 100·(2^14 − 1). */
    if (totalSans !== 100 * (Math.pow(2, 14) - 1)) e.push('la somme des attentes ne vaut pas 100·(2^14 − 1)');
    const m1 = ligne(t, /attente totale sans plafond : (\d+) ms, soit ([\d.]+) min — dont ([\d.]+) min/, e, 'total sans plafond');
    if (m1) {
      egal(e, 'total sans plafond', totalSans, m1[1]);
      proche(e, 'total sans plafond en minutes', totalSans / 60000, m1[2]);
      proche(e, 'attente avant la 14e tentative', dernier / 60000, m1[3]);
    }
    const m2 = ligne(t, /attente totale plafonnée \.+ : (\d+) ms, soit ([\d.]+) min/, e, 'total plafonné');
    if (m2) {
      egal(e, 'total plafonné', totalAvec, m2[1]);
      proche(e, 'total plafonné en minutes', totalAvec / 60000, m2[2]);
    }
    /* Couvrir une heure : plus petit k tel que 100·(2^k − 1) ≥ 3 600 000. */
    let k = 0, cumul = 0;
    while (cumul < 3600000) { cumul += 100 * Math.pow(2, k); k++; }
    const m3 = ligne(t, /Couvrir une heure demande (\d+)\n? *tentatives/, e, 'tentatives pour couvrir une heure');
    if (m3) egal(e, 'tentatives pour couvrir une heure', k, m3[1]);
    /* Le bruit : 1000 clients, attente 800 ms, créneaux de 100 ms → 8 créneaux
       au plus, donc un pic d'au moins ⌈1000/8⌉. */
    const m4 = ligne(t, /sans hasard : (\d+) créneau de 100 ms occupé, pic = (\d+) requêtes/, e, 'répartition sans hasard');
    if (m4) { egal(e, 'créneaux sans hasard', 1, m4[1]); egal(e, 'pic sans hasard', 1000, m4[2]); }
    const m5 = ligne(t, /avec hasard : (\d+) créneaux occupés, pic = (\d+) requêtes — soit ([\d.]+) fois moins/, e, 'répartition avec hasard');
    if (m5) {
      entre(e, 'créneaux avec hasard', 1, m5[1], Math.floor(100 * Math.pow(2, 3) / 100));
      entre(e, 'pic avec hasard', Math.ceil(1000 / 8), m5[2], 1000);
      proche(e, 'rapport des pics', 1000 / Number(m5[2]), m5[3]);
    }
  });

  /* --- exercices de la leçon 13 ------------------------------------------ */
  ctrl('leçon 13 · exercice 4 : le seuil de n·log₂n > 10⁹, et le coût des deux méthodes', function (e) {
    const t = B13['solution-4.txt'];
    const m = ligne(t, /réponse : n = (\d+)/, e, 'la réponse');
    if (!m) return;
    const n = Number(m[1]);
    /* n·log₂n est strictement croissante : il suffit — et il faut — que le rang
       publié dépasse 10⁹ et que le précédent ne le dépasse pas. Le logarithme
       est celui de ce fichier, calculé en virgule fixe BigInt. */
    const avant = (n - 1) * log2(n - 1), apres = n * log2(n);
    if (!(avant <= 1e9)) e.push('n−1 = ' + (n - 1) + ' dépasse déjà 10⁹ : ' + avant);
    if (!(apres > 1e9)) e.push('n = ' + n + ' ne dépasse pas 10⁹ : ' + apres);
    const m2 = ligne(t, /^ {2}(\d+) · log₂\((\d+)\) = (\d+) {2}≤ 10\^9$/m, e, 'la valeur à n−1');
    if (m2) { egal(e, 'rang n−1', n - 1, m2[1]); proche(e, 'valeur à n−1', avant, m2[3]); }
    const m3 = ligne(t, /^ {2}(\d+) · log₂\((\d+)\) = (\d+) {2}> 10\^9$/m, e, 'la valeur à n');
    if (m3) { egal(e, 'rang n', n, m3[1]); proche(e, 'valeur à n', apres, m3[3]); }
    /* L'encadrement par doublements : premier k tel que 2^k·k dépasse 10⁹. */
    let k = 1; while (Math.pow(2, k) * k <= 1e9) k++;
    const doublements = k - 1, evalEncadrement = k, tours = k - 1, totalEval = 2 * k - 1;
    const m4 = ligne(t, /encadrement par doublements : (\d+) doublements, (\d+) évaluations, intervalle \[(\d+), (\d+)\]/, e, 'l\'encadrement');
    if (m4) {
      egal(e, 'doublements', doublements, m4[1]);
      egal(e, 'évaluations de l\'encadrement', evalEncadrement, m4[2]);
      egal(e, 'borne basse', Math.pow(2, k - 1), m4[3]);
      egal(e, 'borne haute', Math.pow(2, k), m4[4]);
    }
    const m5 = ligne(t, /resserrement par dichotomie : (\d+) tours, (\d+) évaluations/, e, 'le resserrement');
    if (m5) { egal(e, 'tours de dichotomie', tours, m5[1]); egal(e, 'évaluations du resserrement', tours, m5[2]); }
    const m6 = ligne(t, /total \.+: (\d+) évaluations/, e, 'total des évaluations');
    if (m6) egal(e, 'total des évaluations', totalEval, m6[1]);
    const m7 = ligne(t, /évaluations de la fonction : (\d+)/, e, 'évaluations de la boucle témoin');
    if (m7) egal(e, 'évaluations de la boucle témoin', n, m7[1]);
    const m8 = ligne(t, /rapport avec la dichotomie : (\d+) fois plus/, e, 'rapport boucle/dichotomie');
    if (m8) egal(e, 'rapport boucle/dichotomie', Math.round(n / totalEval), m8[1]);
    const m9 = ligne(t, /valent à peu près 2·log₂\(n\) = ([\d.]+)/, e, '2·log₂(n)');
    if (m9) proche(e, '2·log₂(n)', 2 * log2(n), m9[1]);
    const ma = ligne(t, /n \/ \(2·log₂ n\) ≈ ([\d.e+]+)/, e, 'n / (2·log₂n)');
    if (ma) proche(e, 'n / (2·log₂n)', n / (2 * log2(n)), ma[1].replace('e+', 'e'), 1);
  });

  ctrl('leçon 13 · exercice 5 : les hauteurs d\'arbre d\'ordre m, par deux comptages entiers indépendants', function (e) {
    const t = B13['solution-5.txt'];
    /* Méthode 1 : plus petit k tel que m^k ≥ n, en BigInt.
       Méthode 2 : on regroupe les feuilles par paquets de m jusqu'à n'en avoir
       qu'une, en divisions PAR EXCÈS — un autre chemin, même réponse exigée. */
    function parPuissances(n, m) { let k = 0; let c = 1n; const M = BigInt(m); while (c < BigInt(n)) { c *= M; k++; } return k; }
    function parRegroupement(n, m) { let k = 0, reste = n; while (reste > 1) { reste = Math.ceil(reste / m); k++; } return k; }
    function bArbre(n, m) { let k = 0; let c = 1n; const M = BigInt(m); while (c - 1n < BigInt(n)) { c *= M; k++; } return k; }
    [[1000, 2], [1000, 10], [10000, 100], [50000, 8], [50000, 256], [9, 3], [27, 3], [729, 3], [125, 5]].forEach(function (p) {
      const n = p[0], m = p[1];
      const a = parRegroupement(n, m), b = parPuissances(n, m);
      if (a !== b) e.push('mes deux méthodes divergent à (' + n + ', ' + m + ') : ' + a + ' contre ' + b);
      const l = ligne(t, new RegExp('^ +' + n + ' +' + m + ' +(\\d+) +(\\d+) +(\\w+)$', 'm'), e, 'ligne (' + n + ', ' + m + ') du contrôle');
      if (!l) return;
      egal(e, 'hauteur construite (' + n + ', ' + m + ')', a, l[1]);
      egal(e, 'hauteur calculée (' + n + ', ' + m + ')', b, l[2]);
      egal(e, 'identiques (' + n + ', ' + m + ')', 'true', l[3]);
    });
    const N = 1000000000;
    [2, 10, 100, 256, 1000].forEach(function (m) {
      const l = ligne(t, new RegExp('^ +' + m + ' +(\\d+) +(\\d+)$', 'm'), e, 'ligne ordre ' + m + ' à un milliard de clés');
      if (!l) return;
      egal(e, 'niveaux (m enfants) à l\'ordre ' + m, parPuissances(N, m), l[1]);
      egal(e, 'niveaux (B-arbre) à l\'ordre ' + m, bArbre(N, m), l[2]);
    });
    const hBin = parPuissances(N, 2), h256 = parPuissances(N, 256);
    const m1 = ligne(t, /rapport \.+ : ([\d.]+) fois moins de niveaux/, e, 'rapport des deux hauteurs');
    if (m1) proche(e, 'rapport 30/4', hBin / h256, m1[1]);
    const m2 = ligne(t, /log₂\(256\) = (\d+)\.\n {2}(\d+) \/ (\d+) = ([\d.]+), arrondi au-dessus : (\d+)/, e, 'la justification du rapport');
    if (m2) {
      egal(e, 'log₂(256)', log2(256), m2[1]);
      egal(e, 'hauteur binaire', hBin, m2[2]);
      proche(e, 'quotient 30/8', hBin / 8, m2[4]);
      egal(e, 'arrondi au-dessus', Math.ceil(hBin / 8), m2[5]);
    }
    /* Le piège de l'arrondi, vérifié sur les flottants eux-mêmes. */
    const m3 = ligne(t, /Math\.ceil\(2 \+ 1e-15\) \.+ = (\d+)/, e, 'Math.ceil(2 + 1e-15)');
    if (m3) {
      if (2 + 1e-15 === 2) e.push('2 + 1e-15 vaut exactement 2 sur cette machine : l\'exemple ne tient pas');
      egal(e, 'Math.ceil(2 + 1e-15)', Math.ceil(2 + 1e-15), m3[1]);
    }
    /* Les temps : 100 ns par niveau en mémoire, 10 ms par niveau sur disque. */
    [['arbre binaire', hBin], ['arbre d\'ordre 256', h256]].forEach(function (p) {
      const l = ligne(t, new RegExp('^ {2}' + p[0] + ' +(\\d+) +([\\d.]+) µs +([\\d.]+) s$', 'm'), e, 'ligne « ' + p[0] + ' » des temps');
      if (!l) return;
      egal(e, 'niveaux · ' + p[0], p[1], l[1]);
      proche(e, 'temps en mémoire · ' + p[0], p[1] * 100 / 1000, l[2]);
      proche(e, 'temps sur disque · ' + p[0], p[1] * 10000000 / 1e9, l[3]);
    });
    const m4 = ligne(t, /soit ([\d.e+]+) fois plus/, e, 'rapport disque / mémoire');
    if (m4) proche(e, 'rapport disque/mémoire', 10000000 / 100, m4[1].replace('e+', 'e'), 1);
  });

  ctrl('leçon 13 · exercice 6 : l\'exponentiation rapide coûte (L−1) carrés et un produit par bit à 1', function (e) {
    const t = B13['solution-6.txt'];
    /* Longueur binaire et poids de Hamming par divisions successives. */
    function bitsEtUns(b) { let L = 0, uns = 0, v = b; while (v > 0) { if (v % 2 === 1) uns++; v = Math.floor(v / 2); L++; } return { L: L, uns: uns }; }
    [10, 100, 1000, 10000, 100000, 1000000].forEach(function (b) {
      const x = bitsEtUns(b);
      const rapide = (x.L - 1) + x.uns;
      const m = ligne(t, new RegExp('^ {2,11}' + b + ' +(\\d+) +(\\d+) +(\\d+) +(\\d+)$', 'm'), e, 'ligne b = ' + b + ' des multiplications');
      if (!m) return;
      egal(e, 'méthode naïve à b = ' + b, b, m[1]);
      egal(e, 'méthode rapide à b = ' + b, rapide, m[2]);
      egal(e, 'bits de b = ' + b, x.L, m[3]);
      egal(e, 'rapport à b = ' + b, Math.round(b / rapide), m[4]);
    });
    [10, 1000, 1000000].forEach(function (b) {
      const x = bitsEtUns(b);
      const m = ligne(t, new RegExp('^ {2}b = +' + b + ' +(\\d+) bits, (\\d+) à 1 +→ +\\((\\d+)\\) \\+ \\((\\d+)\\) = (\\d+) +mesuré : (\\d+)$', 'm'), e, 'décomposition de b = ' + b);
      if (!m) return;
      egal(e, 'bits de ' + b, x.L, m[1]);
      egal(e, 'bits à 1 de ' + b, x.uns, m[2]);
      egal(e, 'carrés pour ' + b, x.L - 1, m[3]);
      egal(e, 'produits pour ' + b, x.uns, m[4]);
      egal(e, 'somme pour ' + b, x.L - 1 + x.uns, m[5]);
      egal(e, 'mesuré pour ' + b, x.L - 1 + x.uns, m[6]);
    });
    const mb = ligne(t, /au moins (\d+) et au plus (\d+) multiplications/, e, 'les deux bornes');
    if (mb) {
      const L = bitsEtUns(1000000).L;
      egal(e, 'borne basse', L, mb[1]);
      egal(e, 'borne haute', 2 * L - 1, mb[2]);
    }
    let prec = null;
    [62500, 125000, 250000, 500000, 1000000].forEach(function (b) {
      const x = bitsEtUns(b), rapide = (x.L - 1) + x.uns;
      const m = ligne(t, new RegExp('^ {2,11}' + b + ' +(\\d+) *(\\+?\\d*)$', 'm'), e, 'ligne b = ' + b + ' du doublement');
      if (m) {
        egal(e, 'multiplications à b = ' + b, rapide, m[1]);
        if (prec !== null) egal(e, 'ajout à b = ' + b, '+' + (rapide - prec), m[2]);
      }
      prec = rapide;
    });
    /* Le nombre de chiffres de 2^bits / (2·bits), compté en BigInt exact. */
    [256, 1024, 2048, 4096].forEach(function (bits) {
      const chiffres = ((2n ** BigInt(bits)) / (2n * BigInt(bits))).toString().length;
      const m = ligne(t, new RegExp('la rapide en demande au plus (\\d+)\\. Rapport : 2\\^' + bits + ' / (\\d+), un nombre à (\\d+) chiffres', 'm'), e, 'rapport RSA à ' + bits + ' bits');
      if (!m) return;
      egal(e, 'multiplications de la rapide à ' + bits + ' bits', 2 * bits, m[1]);
      egal(e, 'diviseur à ' + bits + ' bits', 2 * bits, m[2]);
      egal(e, 'chiffres du rapport à ' + bits + ' bits', chiffres, m[3]);
    });
  });

  return r;
}
module.exports = { titre: 'leçons 12-13 — ordres de grandeur, logarithmes', controles: controles };
