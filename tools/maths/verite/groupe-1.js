/* tools/maths/verite/groupe-1.js — leçons 01 à 03, RECALCULÉES.
   =============================================================
   V15 · point F2.

   RÈGLE DE CE FICHIER : rien de ce que la page publie n'est réutilisé pour
   fabriquer une valeur de référence. Les connecteurs sont redéfinis ici par
   ANALYSE DE CAS (un `if`, pas un `&&`), les affectations sont engendrées par un
   produit cartésien récursif (pas par décalage de bits), les puissances sont
   calculées en BigInt par multiplications successives, la véracité d'une valeur
   JavaScript est décidée par la table ToBoolean de la norme et non par
   `Boolean(...)`. On calcule d'abord, on lit la page ensuite, on compare.

   Une ligne attendue et introuvable dans la page rend ok:false : le vert par
   absence est le pire défaut possible pour un vérificateur. */
'use strict';
const L = require('./lib.js');

/* ------------------------------------------------------------------ */
/* 1. La seconde méthode : les connecteurs par analyse de cas          */
/* ------------------------------------------------------------------ */

function NON(a) { if (a === true) return false; return true; }
function ET(a, b) { if (a === true) { if (b === true) return true; return false; } return false; }
function OU(a, b) { if (a === true) return true; if (b === true) return true; return false; }
function IMP(a, b) { if (a === true) { if (b === true) return true; return false; } return true; }
function EQV(a, b) { if (a === b) return true; return false; }
function XOU(a, b) { if (a === b) return false; return true; }

/* Toutes les affectations de n variables, par produit cartésien récursif.
   `vraiDabord` donne l'ordre VV, VF, FV, FF ; sinon FF, FV, VF, VV. */
function affect(n, vraiDabord) {
  let out = [[]];
  for (let k = 0; k < n; k++) {
    const suiv = [];
    for (const a of out) {
      if (vraiDabord) { suiv.push(a.concat([true])); suiv.push(a.concat([false])); }
      else { suiv.push(a.concat([false])); suiv.push(a.concat([true])); }
    }
    out = suiv;
  }
  return out;
}

const S = (v) => (v === true ? 'V' : 'F');
const mot = (t) => t.map(S).join('');

/* 2^k en BigInt, par multiplications successives. */
function puiss2(k) {
  let x = 1n;
  for (let i = 0; i < k; i++) x = x * 2n;
  return x;
}

/* ToBoolean, recopiée de la norme et non de la page : seules ces valeurs sont
   fausses. (document.all est le neuvième cas, absent hors navigateur.) */
function verite(x) {
  if (x === null) return false;
  if (x === undefined) return false;
  const t = typeof x;
  if (t === 'boolean') return x;
  if (t === 'number') { if (x !== x) return false; if (x === 0) return false; return true; }
  if (t === 'bigint') { if (x === 0n) return false; return true; }
  if (t === 'string') { if (x.length === 0) return false; return true; }
  return true; /* objet, fonction, symbole */
}

/* Égalité stricte, énoncée par la norme : types différents -> faux, NaN égal à
   rien, +0 et -0 confondus, objets comparés par référence. */
function memeValeur(x, y) {
  if (typeof x !== typeof y) return false;
  if (typeof x === 'number') { if (x !== x || y !== y) return false; return x === y; }
  return x === y;
}

/* ------------------------------------------------------------------ */
/* 2. Lecture de la page                                              */
/* ------------------------------------------------------------------ */

const lignesDe = (txt) => txt.split(/\r?\n/).map((l) => l.replace(/\s+$/, ''));

function ligne(txt, re) {
  for (const l of lignesDe(txt)) {
    const m = l.match(re);
    if (m) { m.ligne = l.replace(/\s+/g, ' ').trim(); return m; }
  }
  return null;
}

/* Prose visible, espaces (y compris insécables) déjà normalisés par lib.js. */
const prose = (n) => L.texte(n);
/* Comparaison de phrases insensible à l'espacement (le générateur laisse des
   espaces avant la ponctuation là où il a retiré un <strong>). */
const serre = (s) => s.replace(/\s+/g, '');
const contient = (txt, phrase) => serre(txt).indexOf(serre(phrase)) !== -1;

const CARD = ['zéro', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
  'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
const ORD = ['première', 'deuxième', 'troisième', 'quatrième'];

/* ------------------------------------------------------------------ */
/* 3. Les contrôles                                                    */
/* ------------------------------------------------------------------ */

function controles() {
  const r = [];
  const add = (nom, ok, detail) => r.push({ nom: nom, ok: ok === true, detail: detail || '' });
  /* Certains contrôles portent sur deux endroits de la page (une sortie et la
     phrase de la prose qui la commente) : on met leurs écarts en attente, puis
     on rend un seul verdict. */
  const attente = {};
  const garde = (cle, ecarts) => { attente[cle] = (attente[cle] || []).concat(ecarts); };
  const rendre = (cle, nom, ecarts) => {
    const tout = (attente[cle] || []).concat(ecarts);
    add(nom, tout.length === 0, tout.join(' ; '));
  };

  /* ================================================================ */
  /* LEÇON 01                                                         */
  /* ================================================================ */

  /* --- 1. la table des six connecteurs, refaite par analyse de cas --- */
  {
    const txt = L.sortie(1, 'connecteurs.txt');
    const lignes = lignesDe(txt).filter((l) => /^[VF] [VF] \|/.test(l));
    const attendues = affect(2, true);
    const ecarts = [];
    if (lignes.length !== attendues.length) {
      ecarts.push('nombre de lignes recalculé : ' + attendues.length + ' | publié : ' + lignes.length);
    }
    for (let i = 0; i < attendues.length && i < lignes.length; i++) {
      const a = attendues[i][0], b = attendues[i][1];
      const c = lignes[i].split('|').map((x) => x.trim());
      const ref = [S(a) + ' ' + S(b), S(NON(a)), S(ET(a, b)), S(OU(a, b)), S(XOU(a, b)), S(IMP(a, b)), S(EQV(a, b))];
      for (let k = 0; k < ref.length; k++) {
        if (c[k] !== ref[k]) {
          ecarts.push('ligne ' + (i + 1) + ' colonne ' + k + ' : recalculé « ' + ref[k] + ' » | publié « ' + c[k] + ' »');
        }
      }
    }
    garde('connecteurs', ecarts);
  }

  /* --- 2. « 4 lignes : 2 valeurs pour a, 2 pour b » --- */
  {
    const txt = L.sortie(1, 'connecteurs.txt');
    const ecarts = [];
    const m = ligne(txt, /^(\d+) lignes : (\d+) valeurs pour a, (\d+) pour b\./);
    const attendu = affect(2, true);
    const distinctes = new Set(attendu.map(mot)).size;
    if (!m) ecarts.push('ligne introuvable : « N lignes : N valeurs pour a, N pour b. »');
    else if (Number(m[1]) !== attendu.length || Number(m[2]) !== 2 || Number(m[3]) !== 2 || distinctes !== 4) {
      ecarts.push('recalculé : ' + attendu.length + ' lignes (2 et 2), ' + distinctes +
        ' affectations distinctes | publié : ' + m[1] + ' lignes (' + m[2] + ' et ' + m[3] + ')');
    }
    rendre('connecteurs', 'leçon 01 · connecteurs.txt : la table des six connecteurs et son compte de lignes', ecarts);
  }

  /* --- 3. la prose commente les colonnes : 1/4, 3/4, 2e ligne --- */
  {
    const p = prose(1);
    const combis = affect(2, true);
    const nET = combis.filter((v) => ET(v[0], v[1])).length;
    const nOU = combis.filter((v) => OU(v[0], v[1])).length;
    const fausses = combis.map((v, i) => (IMP(v[0], v[1]) ? -1 : i)).filter((i) => i >= 0);
    const ecarts = [];
    const phET = 'Une ligne vraie sur quatre.';
    const phOU = CARD[nOU].charAt(0).toUpperCase() + CARD[nOU].slice(1) + ' lignes vraies sur quatre.';
    if (nET !== 1 || !contient(p, phET)) ecarts.push('ET vrai sur ' + nET + ' ligne(s) sur 4 ; phrase « ' + phET + ' » ' + (contient(p, phET) ? 'présente' : 'ABSENTE de la prose'));
    if (!contient(p, phOU)) ecarts.push('OU vrai sur ' + nOU + ' lignes sur 4 ; phrase « ' + phOU + ' » ABSENTE de la prose');
    const phIMP = 'faux dans un seul cas, celui de la ' + ORD[fausses[0]] + ' ligne';
    if (fausses.length !== 1 || !contient(p, phIMP)) {
      ecarts.push('implication fausse sur ' + fausses.length + ' ligne(s), la n° ' + (fausses[0] + 1) +
        ' ; phrase « ' + phIMP + ' » ' + (contient(p, phIMP) ? 'présente' : 'ABSENTE de la prose'));
    }
    add('leçon 01 · prose : ET 1 ligne sur 4, OU 3 sur 4, implication fausse à la 2e ligne',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 4. la table du bouton « Publier » : connecte ET complet ET NON publie --- */
  {
    const txt = L.sortie(1, 'table.js') && L.sortie(1, 'table.txt');
    const lignes = lignesDe(txt).filter((l) => /^[VF]\s+\|/.test(l));
    const attendues = affect(3, false);
    const ecarts = [];
    if (lignes.length !== 8) ecarts.push('recalculé : 8 lignes | publié : ' + lignes.length);
    for (let i = 0; i < attendues.length && i < lignes.length; i++) {
      const v = attendues[i];
      const parts = lignes[i].split('||');
      const gauche = parts[0].split('|').map((x) => x.trim());
      const droite = (parts[1] || '').trim();
      const ref = ET(ET(v[0], v[1]), NON(v[2]));
      if (gauche.join('') !== mot(v)) ecarts.push('ligne ' + (i + 1) + ' : affectation recalculée ' + mot(v) + ' | publiée ' + gauche.join(''));
      if (droite !== S(ref)) ecarts.push('ligne ' + (i + 1) + ' (' + mot(v) + ') : recalculé ' + S(ref) + ' | publié ' + droite);
    }
    add('leçon 01 · table.txt : les 8 lignes de « connecté ET complet ET NON publié »',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 5. « 8 lignes, 1 vraie(s), 7 fausse(s) » + la prose « 1 cas sur 8 » --- */
  {
    const txt = L.sortie(1, 'table.txt');
    const m = ligne(txt, /^(\d+) lignes, (\d+) vraie\(s\), (\d+) fausse\(s\)\./);
    const attendues = affect(3, false);
    const vrais = attendues.filter((v) => ET(ET(v[0], v[1]), NON(v[2]))).length;
    const ecarts = [];
    const p = prose(1);
    const phrase = 'n\'est vraie que dans une situation sur huit';
    if (!m) ecarts.push('ligne introuvable : « N lignes, N vraie(s), N fausse(s). »');
    else if (Number(m[1]) !== attendues.length || Number(m[2]) !== vrais || Number(m[3]) !== attendues.length - vrais) {
      ecarts.push('recalculé : ' + attendues.length + ' lignes, ' + vrais + ' vraie(s), ' +
        (attendues.length - vrais) + ' fausse(s) | publié : ' + m[1] + '/' + m[2] + '/' + m[3]);
    }
    if (!contient(p, phrase)) ecarts.push('prose : « ' + phrase + ' » ABSENTE');
    garde('publier', ecarts);
  }

  /* --- 6. la prose désigne V V V comme la dernière ligne, et fausse --- */
  {
    const attendues = affect(3, false);
    const derniere = attendues[attendues.length - 1];
    const valeur = ET(ET(derniere[0], derniere[1]), NON(derniere[2]));
    const p = prose(1);
    const phrase = 'c\'est la ligne V V V , la dernière, celle qui vaut faux';
    const ecarts = [];
    if (mot(derniere) !== 'VVV' || valeur !== false || !contient(p, phrase)) {
      ecarts.push('recalculé : dernière ligne = ' + mot(derniere) + ', valeur = ' + S(valeur) +
        ' | prose : phrase « ' + phrase + ' » ' + (contient(p, phrase) ? 'présente' : 'ABSENTE'));
    }
    rendre('publier', 'leçon 01 · table.txt : 8 lignes, 1 vraie, 7 fausses, la dernière (V V V) étant fausse', ecarts);
  }

  /* --- 7. les 201 âges, et la ligne F V impossible --- */
  {
    let ages = 0, ecartsAges = 0;
    for (let age = 0; age <= 200; age++) {
      ages++;
      const g = ET(age >= 18, age >= 21);
      const d = (age >= 21);
      if (g !== d) ecartsAges++;
    }
    const lignesDiff = affect(2, true).filter((v) => ET(v[0], v[1]) !== v[1]).map(mot);
    const p = prose(1);
    const ok = ages === 201 && ecartsAges === 0 && lignesDiff.length === 1 && lignesDiff[0] === 'FV' &&
      contient(p, 'sur les 201 âges de 0 à 200') && contient(p, 'leur table diffère sur la ligne F V');
    add('leçon 01 · prose : 201 âges de 0 à 200, aucun écart, une seule ligne de table divergente (F V)', ok,
      ok ? '' : 'recalculé : ' + ages + ' âges, ' + ecartsAges + ' écart(s), lignes de table divergentes = ' +
        (lignesDiff.join(',') || 'aucune') + ' | publié : « 201 âges de 0 à 200 » ' +
        (contient(p, 'sur les 201 âges de 0 à 200') ? 'présent' : 'ABSENT') + ', « ligne F V » ' +
        (contient(p, 'leur table diffère sur la ligne F V') ? 'présent' : 'ABSENT'));
  }

  /* --- 8. 2^10 = 1 024, et la colonne du tableau 4/8/16/1024 --- */
  {
    const p = prose(1);
    const mille = puiss2(10).toString();
    const attenduProse = 'une condition à dix booléens a ' + L.frNombre(mille) + ' lignes';
    const attenduTable = '4 lignes pour 2 variables, ' + puiss2(3) + ' pour 3, ' + puiss2(4) +
      ' pour 4, ' + puiss2(10) + ' pour 10';
    const a = contient(p, attenduProse), b = contient(p, attenduTable);
    add('leçon 01 · prose et tableau : 2^10 = 1 024 lignes (et 4 / 8 / 16 / 1024)', a && b,
      (a && b) ? '' : 'recalculé : 2^10 = ' + mille + ' | prose « ' + attenduProse + ' » ' + (a ? 'présente' : 'ABSENTE') +
        ' ; tableau « ' + attenduTable + ' » ' + (b ? 'présent' : 'ABSENT'));
  }

  /* --- 9. 2^20 et 2^40 en BigInt --- */
  {
    const p = prose(1);
    const v20 = L.frNombre(puiss2(20).toString());
    const v40 = L.frNombre(puiss2(40).toString());
    const a = contient(p, 'se tabule encore (' + v20 + ' lignes)');
    const b = contient(p, 'à 40, il y en a ' + v40);
    add('leçon 01 · prose : 2^20 = 1 048 576 et 2^40 = 1 099 511 627 776 (BigInt)', a && b,
      (a && b) ? '' : 'recalculé : 2^20 = ' + v20 + ', 2^40 = ' + v40 +
        ' | « ' + v20 + ' lignes » ' + (a ? 'présent' : 'ABSENT') + ', « ' + v40 + ' » ' + (b ? 'présent' : 'ABSENT'));
  }

  /* --- 10. implication.txt : les quatre verdicts --- */
  {
    const txt = L.sortie(1, 'implication.txt');
    const lignes = lignesDe(txt).filter((l) => /mot de passe correct =/.test(l));
    const attendues = affect(2, true);
    const ecarts = [];
    if (lignes.length !== 4) ecarts.push('recalculé : 4 lignes | publié : ' + lignes.length);
    for (let i = 0; i < attendues.length && i < lignes.length; i++) {
      const a = attendues[i][0], b = attendues[i][1];
      const oui = (v) => (v ? 'oui' : 'non');
      const verdict = IMP(a, b) ? 'règle TENUE' : 'règle VIOLÉE';
      const l = lignes[i].replace(/\s+/g, ' ');
      const attendu = 'mot de passe correct = ' + oui(a) + ' session ouverte = ' + oui(b) + ' -> ' + verdict;
      if (l.indexOf(attendu) === -1) ecarts.push('ligne ' + (i + 1) + ' : recalculé « ' + attendu + ' » | publié « ' + l.trim() + ' »');
    }
    add('leçon 01 · implication.txt : les 4 verdicts TENUE / VIOLÉE', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 11. every / some, recomptés élément par élément --- */
  {
    const txt = L.sortie(1, 'implication.txt');
    /* « tous pairs » = aucun impair ; « il existe un pair » = au moins un pair.
       On compte les éléments à la main, sans every ni some. */
    function comptePairs(t) { let n = 0; for (let i = 0; i < t.length; i++) { if (t[i] - 2 * Math.floor(t[i] / 2) === 0) n++; } return n; }
    const cas = [
      { expr: '[2,4,6].every(pair)', t: [2, 4, 6], quant: 'tous' },
      { expr: '[2,3,6].every(pair)', t: [2, 3, 6], quant: 'tous' },
      { expr: '[].every(pair)', t: [], quant: 'tous' },
      { expr: '[].some(pair)', t: [], quant: 'existe' },
    ];
    const ecarts = [];
    for (const c of cas) {
      const n = comptePairs(c.t);
      const ref = c.quant === 'tous' ? (n === c.t.length) : (n > 0);
      const re = new RegExp(c.expr.replace(/[.[\]()]/g, '\\$&') + '\\s*=\\s*(true|false)');
      const m = ligne(txt, re);
      if (!m) ecarts.push('ligne introuvable : ' + c.expr);
      else if (String(ref) !== m[1]) ecarts.push(c.expr + ' : recalculé ' + ref + ' | publié ' + m[1]);
    }
    add('leçon 01 · implication.txt : every / some recomptés sur [2,4,6], [2,3,6] et []',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 12 et 13. les seize fonctions : colonnes, numéros et noms --- */
  const REF16 = [
    { nom: 'contradiction (toujours faux)', f: () => false },
    { nom: 'a NON-OU b (NOR)', f: (a, b) => NON(OU(a, b)) },
    { nom: 'NON a ET b', f: (a, b) => ET(NON(a), b) },
    { nom: 'NON a', f: (a) => NON(a) },
    { nom: 'a ET NON b', f: (a, b) => ET(a, NON(b)) },
    { nom: 'NON b', f: (a, b) => NON(b) },
    { nom: 'a OU EXCLUSIF b', f: (a, b) => XOU(a, b) },
    { nom: 'a NON-ET b (NAND)', f: (a, b) => NON(ET(a, b)) },
    { nom: 'a ET b', f: (a, b) => ET(a, b) },
    { nom: 'a ÉQUIVAUT À b', f: (a, b) => EQV(a, b) },
    { nom: 'b (a ignoré)', f: (a, b) => b },
    { nom: 'a IMPLIQUE b', f: (a, b) => IMP(a, b) },
    { nom: 'a (b ignoré)', f: (a) => a },
    { nom: 'b IMPLIQUE a', f: (a, b) => IMP(b, a) },
    { nom: 'a OU b', f: (a, b) => OU(a, b) },
    { nom: 'tautologie (toujours vrai)', f: () => true },
  ];
  const COMBIS16 = affect(2, true);
  /* Numéro d'une fonction = valeur de sa colonne lue comme un nombre binaire,
     la première ligne pesant le plus lourd. Calculé, pas emprunté. */
  function numero(colonne) {
    let n = 0, poids = 1;
    for (let k = colonne.length - 1; k >= 0; k--) { if (colonne[k] === 'V') n += poids; poids *= 2; }
    return n;
  }
  {
    const txt = L.sortie(1, 'seize.txt');
    const publiees = {};
    for (const l of lignesDe(txt)) {
      const m = l.match(/^\s*(\d+)\s+colonne\s+([VF]{4})\s+=\s+(.*)$/);
      if (m) publiees[Number(m[1])] = { colonne: m[2], nom: m[3].trim() };
    }
    const ecarts = [];
    const vues = new Set();
    for (const ref of REF16) {
      const colonne = COMBIS16.map((v) => S(ref.f(v[0], v[1]))).join('');
      const n = numero(colonne);
      vues.add(colonne);
      const pub = publiees[n];
      if (!pub) ecarts.push('ligne introuvable : numéro ' + n + ' (colonne recalculée ' + colonne + ' pour « ' + ref.nom + ' »)');
      else {
        if (pub.colonne !== colonne) ecarts.push('n° ' + n + ' : colonne recalculée ' + colonne + ' | publiée ' + pub.colonne);
        if (serre(pub.nom) !== serre(ref.nom)) ecarts.push('colonne ' + colonne + ' : nom recalculé « ' + ref.nom + ' » | publié « ' + pub.nom + ' »');
      }
    }
    if (vues.size !== 16) ecarts.push('les 16 fonctions de référence ne donnent que ' + vues.size + ' colonnes distinctes');
    if (Object.keys(publiees).length !== 16) ecarts.push('recalculé : 16 fonctions | publié : ' + Object.keys(publiees).length + ' lignes');
    garde('seize', ecarts);
  }

  /* --- 14. « 16 fonctions énumérées, 16 portent un nom » --- */
  {
    const txt = L.sortie(1, 'seize.txt');
    const ecarts = [];
    const m = ligne(txt, /^(\d+) fonctions énumérées, (\d+) portent un nom/);
    const total = Number(puiss2(4));
    if (!m) ecarts.push('ligne introuvable : « N fonctions énumérées, N portent un nom »');
    else if (Number(m[1]) !== total || Number(m[2]) !== REF16.length || REF16.length !== total) {
      ecarts.push('recalculé : 2^4 = ' + total + ' fonctions, ' + REF16.length + ' nommées | publié : ' + m[1] + ' / ' + m[2]);
    }
    rendre('seize', 'leçon 01 · seize.txt : les 16 colonnes, leurs numéros, leurs noms et le compte final', ecarts);
  }

  /* --- 15. 2^(2^n) pour n = 1..5, en BigInt --- */
  {
    const txt = L.sortie(1, 'seize.txt');
    const ecarts = [];
    for (const n of [1, 2, 3, 4, 5]) {
      const lignesTable = puiss2(n);
      const fonctions = puiss2(Number(lignesTable));
      const m = ligne(txt, new RegExp('^\\s*n = ' + n + '\\s+->\\s+(\\d+) lignes, (\\d+) fonctions différentes'));
      if (!m) ecarts.push('ligne introuvable : « n = ' + n + ' »');
      else {
        if (m[1] !== lignesTable.toString()) ecarts.push('n = ' + n + ' : lignes recalculées ' + lignesTable + ' | publiées ' + m[1]);
        if (m[2] !== fonctions.toString()) ecarts.push('n = ' + n + ' : fonctions recalculées ' + fonctions + ' | publiées ' + m[2]);
      }
    }
    add('leçon 01 · seize.txt : 2^(2^n) pour n = 1 à 5, calculé en BigInt', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 16. la répartition 2 / 4 / 10 des seize connecteurs --- */
  {
    const p = prose(1);
    let degeneres = 0, uneEntree = 0, effectives = 0;
    for (const ref of REF16) {
      const col = COMBIS16.map((v) => ref.f(v[0], v[1]));
      const dependA = COMBIS16.some((v, i) => ref.f(v[0], v[1]) !== ref.f(NON(v[0]), v[1]));
      const dependB = COMBIS16.some((v) => ref.f(v[0], v[1]) !== ref.f(v[0], NON(v[1])));
      const constante = col.every((x) => x === col[0]);
      if (constante) degeneres++;
      else if (!dependA || !dependB) uneEntree++;
      else effectives++;
    }
    const phrases = [
      CARD[degeneres].charAt(0).toUpperCase() + CARD[degeneres].slice(1) + ' d\'entre eux sont dégénérés',
      CARD[uneEntree] + ' ignorent l\'une de leurs deux entrées',
      'il reste les ' + CARD[effectives] + ' qui font vraiment quelque chose',
    ];
    const manquantes = phrases.filter((ph) => !contient(p, ph));
    const ok = degeneres + uneEntree + effectives === 16 && manquantes.length === 0;
    add('leçon 01 · prose : 2 dégénérés + 4 à une seule entrée + 10 effectives = 16', ok,
      ok ? '' : 'recalculé : ' + degeneres + ' constantes, ' + uneEntree + ' à une entrée, ' + effectives +
        ' effectives | phrases absentes de la prose : ' + (manquantes.join(' / ') || 'aucune'));
  }

  /* --- 17. « sur 121 couples, a !== b s'écarte 51 fois du ou exclusif » --- */
  {
    const p = prose(1);
    /* Onze valeurs choisies ici, pas dans la page : six fausses (dont NaN) et
       cinq vraies, toutes deux à deux distinctes. Le compte ne dépend que de
       cette répartition : f(f-1) + t(t-1) désaccords hors diagonale, plus le
       seul NaN de la diagonale, soit 6*5 + 5*4 + 1 = 51 pour tout 6/5. */
    const VAL = [true, false, 1, 0, '', 'texte', null, undefined, NaN, [], {}];
    let couples = 0, ecarts = 0;
    for (const x of VAL) {
      for (const y of VAL) {
        couples++;
        const differents = !memeValeur(x, y);          /* ce que rend a !== b */
        const ouExclusif = XOU(verite(x), verite(y));  /* le ⊕ de la logique */
        if (differents !== ouExclusif) ecarts++;
      }
    }
    const m = ligne(p, /sur (\d+) couples de valeurs, a !== b s'écarte (\d+) fois/);
    const liste = [];
    if (!m) liste.push('ligne introuvable : « sur N couples de valeurs, a !== b s\'écarte N fois »');
    else if (Number(m[1]) !== couples || Number(m[2]) !== ecarts) {
      liste.push('recalculé : ' + couples + ' couples, ' + ecarts + ' écarts | publié : ' + m[1] + ' couples, ' + m[2] + ' écarts');
    }
    garde('xor', liste);
  }

  /* --- 18. « true !== 1 vaut true alors que vrai ⊕ vrai est faux » --- */
  {
    const p = prose(1);
    const strict = !memeValeur(true, 1);
    const logique = XOU(verite(true), verite(1));
    const ecarts = [];
    if (strict !== true || logique !== false || !contient(p, 'true !== 1 vaut true alors que « vrai ⊕ vrai » est faux')) {
      ecarts.push('recalculé : true !== 1 -> ' + strict + ', ou exclusif logique -> ' + logique +
        ' | la page annonce true puis faux');
    }
    rendre('xor', 'leçon 01 · prose : 121 couples, 51 écarts entre !== et le ou exclusif (dont true !== 1)', ecarts);
  }

  /* --- 19. solution-1 : (a OU b) ET NON c --- */
  {
    const txt = L.sortie(1, 'solution-1.txt');
    const attendues = affect(3, false);
    const lignes = lignesDe(txt).filter((l) => /^[VF] [VF] [VF]\s+->/.test(l));
    const ecarts = [];
    let vrais = 0;
    for (let i = 0; i < attendues.length; i++) {
      const v = attendues[i];
      const ref = ET(OU(v[0], v[1]), NON(v[2]));
      if (ref) vrais++;
      const attendu = S(v[0]) + ' ' + S(v[1]) + ' ' + S(v[2]) + ' -> ' + S(ref);
      if (!lignes[i] || lignes[i].replace(/\s+/g, ' ').trim() !== attendu) {
        ecarts.push('ligne ' + (i + 1) + ' : recalculé « ' + attendu + ' » | publié « ' +
          (lignes[i] ? lignes[i].replace(/\s+/g, ' ').trim() : 'ligne introuvable') + ' »');
      }
    }
    const mTotal = ligne(txt, /^(\d+)$/);
    if (!mTotal) ecarts.push('ligne introuvable : le total de lignes vraies (un nombre seul)');
    else if (Number(mTotal[1]) !== vrais) ecarts.push('total : recalculé ' + vrais + ' | publié ' + mTotal[1]);
    const p = prose(1);
    const phrase = CARD[vrais].charAt(0).toUpperCase() + CARD[vrais].slice(1) + ' lignes sur huit';
    if (!contient(p, phrase)) ecarts.push('prose : « ' + phrase + ' » ABSENTE');
    add('leçon 01 · solution-1.txt : (a OU b) ET NON c, 8 lignes et 3 vraies', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 20. solution-2 : la facture envoyable, 3 cas sur 16 --- */
  {
    const txt = L.sortie(1, 'solution-2.txt');
    const attendues = affect(4, false);
    const vraies = attendues.filter((v) => ET(ET(v[0], OU(v[1], v[2])), NON(v[3]))).map(mot);
    const ecarts = [];
    const m = ligne(txt, /lignes où la facture part\s*:\s*(.+)$/);
    if (!m) ecarts.push('ligne introuvable : « lignes où la facture part : … »');
    else {
      const publiees = m[1].split(/\s*,\s*/).map((x) => x.trim()).filter((x) => x.length);
      if (publiees.join(' ') !== vraies.join(' ')) {
        ecarts.push('recalculé : ' + vraies.join(' , ') + ' | publié : ' + publiees.join(' , '));
      }
    }
    const m2 = ligne(txt, /^soit (\d+) cas sur (\d+)\.$/);
    if (!m2) ecarts.push('ligne introuvable : « soit N cas sur N. »');
    else if (Number(m2[1]) !== vraies.length || Number(m2[2]) !== attendues.length) {
      ecarts.push('recalculé : ' + vraies.length + ' cas sur ' + attendues.length + ' | publié : ' + m2[1] + ' sur ' + m2[2]);
    }
    const p = prose(1);
    const phrase = CARD[vraies.length].charAt(0).toUpperCase() + CARD[vraies.length].slice(1) + ' cas sur seize';
    if (!contient(p, phrase)) ecarts.push('prose : « ' + phrase + ' » ABSENTE');
    if (!contient(p, 'la ligne VVVF , où les deux sont vrais, fait partie des trois')) {
      ecarts.push('prose : la phrase sur la ligne VVVF est ABSENTE');
    } else if (vraies.indexOf('VVVF') === -1) {
      ecarts.push('la prose annonce VVVF parmi les lignes vraies, le recalcul donne ' + vraies.join(','));
    }
    garde('facture', ecarts);
  }

  /* --- 21. l'autre lecture de l'énoncé : 7 cas sur 16 --- */
  {
    const attendues = affect(4, false);
    const autre = attendues.filter((v) => OU(ET(v[0], v[1]), ET(v[2], NON(v[3])))).length;
    const juste = attendues.filter((v) => ET(ET(v[0], OU(v[1], v[2])), NON(v[3]))).length;
    const p = prose(1);
    const phrase = 'donne ' + autre + ' cas sur 16 au lieu de ' + juste;
    const ecarts = [];
    if (!contient(p, phrase)) {
      ecarts.push('recalculé : (adresse ET article) OU (acompte ET NON bloqué) est vraie sur ' + autre +
        ' des 16 lignes, contre ' + juste + ' pour la lecture retenue | la page n\'annonce pas « ' + phrase + ' »');
    }
    rendre('facture', 'leçon 01 · solution-2.txt : 3 lignes sur 16 pour la facture, 7 pour l\'autre lecture', ecarts);
  }

  /* --- 22. exercice 3 : la ligne 3 de l'implication vaut vrai --- */
  {
    const txt = L.sortie(1, 'reponse-exo3.txt');
    const combis = affect(2, true);
    const idxFausse = combis.findIndex((v) => IMP(v[0], v[1]) === false);
    const idxCas = combis.findIndex((v) => v[0] === false && v[1] === true);
    const ecarts = [];
    if (mot(combis[idxFausse]) !== 'VF') ecarts.push('la seule ligne fausse recalculée est ' + mot(combis[idxFausse]) + ', pas V F');
    const m = ligne(txt, /soit la ligne (\d+) de la table de l.implication, qui vaut (VRAI|FAUX)/);
    if (!m) ecarts.push('ligne introuvable : « soit la ligne N de la table de l\'implication, qui vaut … »');
    else {
      if (Number(m[1]) !== idxCas + 1) ecarts.push('numéro de ligne : recalculé ' + (idxCas + 1) + ' | publié ' + m[1]);
      const val = IMP(false, true) ? 'VRAI' : 'FAUX';
      if (m[2] !== val) ecarts.push('valeur de la ligne (F,V) : recalculée ' + val + ' | publiée ' + m[2]);
    }
    if (!contient(txt, 'administrateur = vrai ET peut modifier = faux')) {
      ecarts.push('la description du seul contre-exemple (a vrai, b faux) est ABSENTE du texte');
    }
    add('leçon 01 · reponse-exo3.txt : la ligne 3 de l\'implication vaut vrai, la seule fausse est V F',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* ================================================================ */
  /* LEÇON 02                                                         */
  /* ================================================================ */

  /* --- 23. deux-conditions : deux écritures, un seul comportement --- */
  {
    const txt = L.sortie(2, 'deux-conditions.txt');
    const attendues = affect(2, true);
    const ecarts = [];
    for (let i = 0; i < attendues.length; i++) {
      const admin = attendues[i][0], susp = attendues[i][1];
      const f1 = NON(ET(admin, NON(susp)));
      const f2 = OU(NON(admin), susp);
      if (f1 !== f2) ecarts.push('les deux formes divergent en ' + mot(attendues[i]) + ' — le recalcul contredit la leçon');
      const verdict = (v) => (v ? 'refuse' : 'laisse passer');
      const attendu = 'admin=' + S(admin) + ' suspendu=' + S(susp) + ' forme 1 : ' + verdict(f1) + ' forme 2 : ' + verdict(f2);
      const m = ligne(txt, new RegExp('^admin=' + S(admin) + ' suspendu=' + S(susp) + '\\s'));
      if (!m) ecarts.push('ligne introuvable : admin=' + S(admin) + ' suspendu=' + S(susp));
      else if (m.ligne !== attendu) {
        ecarts.push('recalculé « ' + attendu + ' » | publié « ' + m.ligne + ' »');
      }
    }
    add('leçon 02 · deux-conditions.txt : les 4 situations des deux gardes', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* Les dix-neuf propositions du programme, réécrites ici par analyse de cas. */
  const LOIS = [
    { nom: 'double négation', n: 1, f: (a) => NON(NON(a)), g: (a) => a },
    { nom: 'idempotence du ET', n: 1, f: (a) => ET(a, a), g: (a) => a },
    { nom: 'idempotence du OU', n: 1, f: (a) => OU(a, a), g: (a) => a },
    { nom: 'tiers exclu', n: 1, f: (a) => OU(a, NON(a)), g: () => true },
    { nom: 'non-contradiction', n: 1, f: (a) => ET(a, NON(a)), g: () => false },
    { nom: 'commutativité du ET', n: 2, f: (a, b) => ET(a, b), g: (a, b) => ET(b, a) },
    { nom: 'commutativité du OU', n: 2, f: (a, b) => OU(a, b), g: (a, b) => OU(b, a) },
    { nom: 'absorption 1', n: 2, f: (a, b) => OU(a, ET(a, b)), g: (a) => a },
    { nom: 'absorption 2', n: 2, f: (a, b) => ET(a, OU(a, b)), g: (a) => a },
    { nom: 'De Morgan (ET)', n: 2, f: (a, b) => NON(ET(a, b)), g: (a, b) => OU(NON(a), NON(b)) },
    { nom: 'De Morgan (OU)', n: 2, f: (a, b) => NON(OU(a, b)), g: (a, b) => ET(NON(a), NON(b)) },
    { nom: 'implication', n: 2, f: (a, b) => IMP(a, b), g: (a, b) => NON(ET(a, NON(b))) },
    { nom: 'contraposée', n: 2, f: (a, b) => IMP(a, b), g: (a, b) => IMP(NON(b), NON(a)) },
    { nom: 'associativité du ET', n: 3, f: (a, b, c) => ET(ET(a, b), c), g: (a, b, c) => ET(a, ET(b, c)) },
    { nom: 'associativité du OU', n: 3, f: (a, b, c) => OU(OU(a, b), c), g: (a, b, c) => OU(a, OU(b, c)) },
    { nom: 'distributivité ET/OU', n: 3, f: (a, b, c) => ET(a, OU(b, c)), g: (a, b, c) => OU(ET(a, b), ET(a, c)) },
    { nom: 'distributivité OU/ET', n: 3, f: (a, b, c) => OU(a, ET(b, c)), g: (a, b, c) => ET(OU(a, b), OU(a, c)) },
    { nom: '« De Morgan » bâclé', n: 2, f: (a, b) => NON(ET(a, b)), g: (a, b) => ET(NON(a), NON(b)) },
    { nom: 'réciproque', n: 2, f: (a, b) => IMP(a, b), g: (a, b) => IMP(b, a) },
  ];
  /* Pour chaque proposition : verdict, nombre de lignes RÉELLEMENT parcourues
     (on s'arrête au premier écart, en ordre croissant F d'abord), contre-exemple. */
  const VERDICTS = LOIS.map((loi) => {
    const combis = affect(loi.n, false);
    let essayees = 0, contre = null, ok = true;
    for (const v of combis) {
      essayees++;
      if (loi.f.apply(null, v) !== loi.g.apply(null, v)) { ok = false; contre = mot(v); break; }
    }
    return { nom: loi.nom, n: loi.n, ok: ok, essayees: essayees, contre: contre, total: Number(puiss2(loi.n)) };
  });
  /* Lignes publiées de lois.txt, indexées par nom normalisé. */
  const LOIS_PUB = {};
  {
    const txt = L.sortie(2, 'lois.txt');
    for (const l of lignesDe(txt)) {
      const m = l.match(/^(ÉQUIVALENTES|DIFFÉRENTES)\s+(.+?)\s+\((\d+) ligne\(s\) essayée\(s\) sur (\d+)\)(.*)$/);
      if (m) {
        const ce = m[5].match(/contre-exemple\s*:\s*([VF]+)/);
        LOIS_PUB[serre(m[2])] = {
          verdict: m[1], nom: m[2], essayees: Number(m[3]), total: Number(m[4]), contre: ce ? ce[1] : null,
        };
      }
    }
  }

  /* --- 24. les 19 verdicts --- */
  {
    const ecarts = [];
    for (const v of VERDICTS) {
      const pub = LOIS_PUB[serre(v.nom)];
      if (!pub) { ecarts.push('ligne introuvable : « ' + v.nom +' »'); continue; }
      const attendu = v.ok ? 'ÉQUIVALENTES' : 'DIFFÉRENTES';
      if (pub.verdict !== attendu) ecarts.push(v.nom + ' : recalculé ' + attendu + ' | publié ' + pub.verdict);
    }
    const nb = Object.keys(LOIS_PUB).length;
    if (nb !== LOIS.length) ecarts.push('recalculé : ' + LOIS.length + ' propositions | publié : ' + nb + ' lignes');
    add('leçon 02 · lois.txt : les 19 verdicts ÉQUIVALENTES / DIFFÉRENTES', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 25. le nombre de lignes réellement essayées --- */
  {
    const ecarts = [];
    for (const v of VERDICTS) {
      const pub = LOIS_PUB[serre(v.nom)];
      if (!pub) { ecarts.push('ligne introuvable : « ' + v.nom + ' »'); continue; }
      if (pub.essayees !== v.essayees) ecarts.push(v.nom + ' : lignes essayées recalculées ' + v.essayees + ' | publiées ' + pub.essayees);
      if (pub.total !== v.total) ecarts.push(v.nom + ' : 2^' + v.n + ' recalculé ' + v.total + ' | publié ' + pub.total);
    }
    garde('lois-lignes', ecarts);
  }

  /* --- 26. les contre-exemples --- */
  {
    const ecarts = [];
    for (const v of VERDICTS) {
      const pub = LOIS_PUB[serre(v.nom)];
      if (!pub) { ecarts.push('ligne introuvable : « ' + v.nom + ' »'); continue; }
      if ((v.contre || null) !== (pub.contre || null)) {
        ecarts.push(v.nom + ' : contre-exemple recalculé ' + (v.contre || 'aucun') + ' | publié ' + (pub.contre || 'aucun'));
      }
    }
    rendre('lois-lignes', 'leçon 02 · lois.txt : lignes réellement essayées (arrêt au premier écart) et contre-exemples', ecarts);
  }

  /* --- 27. le total de la sortie : 19 / 17 / 2 / 78 --- */
  {
    const txt = L.sortie(2, 'lois.txt');
    const m = ligne(txt, /^(\d+) propositions testées, (\d+) vérifiées, (\d+) réfutée\(s\), (\d+) lignes de table réellement évaluées\./);
    const total = LOIS.length;
    const vraies = VERDICTS.filter((v) => v.ok).length;
    const fausses = VERDICTS.length - vraies;
    const lignesEval = VERDICTS.reduce((s, v) => s + v.essayees, 0);
    const ecarts = [];
    if (!m) ecarts.push('ligne introuvable : « N propositions testées, N vérifiées, N réfutée(s), N lignes… »');
    else if (Number(m[1]) !== total || Number(m[2]) !== vraies || Number(m[3]) !== fausses || Number(m[4]) !== lignesEval) {
      ecarts.push('sortie : recalculé ' + total + ' / ' + vraies + ' / ' + fausses + ' / ' + lignesEval +
        ' | publié ' + m[1] + ' / ' + m[2] + ' / ' + m[3] + ' / ' + m[4]);
    }
    garde('lois-total', ecarts);
  }

  /* --- 28. le récapitulatif de la prose --- */
  {
    const p = prose(2);
    const m = ligne(p.replace(/\s*:\s*/g, ' : '), /Mesuré ici : (\d+) propositions, (\d+) vérifiées, (\d+) réfutée/);
    const total = LOIS.length;
    const vraies = VERDICTS.filter((v) => v.ok).length;
    const fausses = VERDICTS.length - vraies;
    const lignesEval = VERDICTS.reduce((s, v) => s + v.essayees, 0);
    const m2 = ligne(p, /(\d+) lignes calculées en tout/);
    const ecarts = [];
    if (!m) ecarts.push('ligne introuvable : « Mesuré ici : N propositions, N vérifiées, N réfutée… »');
    else {
      if (Number(m[1]) !== total) ecarts.push('propositions : recalculé ' + total + ' | publié ' + m[1]);
      if (Number(m[2]) !== vraies) ecarts.push('vérifiées : recalculé ' + vraies + ' | publié ' + m[2]);
      if (Number(m[3]) !== fausses) ecarts.push('réfutées : recalculé ' + fausses + ' | publié ' + m[3]);
    }
    if (!m2) ecarts.push('ligne introuvable : « N lignes calculées en tout »');
    else if (Number(m2[1]) !== lignesEval) ecarts.push('lignes : recalculé ' + lignesEval + ' | publié ' + m2[1]);
    add('leçon 02 · prose « ce qu\'il faut retenir » : le récapitulatif du vérificateur',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 29. « 74 lignes pour les dix-sept lois, plus 2 + 2 » --- */
  {
    const p = prose(2);
    const vraies = VERDICTS.filter((v) => v.ok);
    const fausses = VERDICTS.filter((v) => !v.ok);
    const lignesVraies = vraies.reduce((s, v) => s + v.essayees, 0);
    const ecarts = [];
    const attendu = lignesVraies + ' lignes pour les ' + CARD[vraies.length] + ' lois';
    if (!contient(p, attendu)) ecarts.push('prose : « ' + attendu + ' » ABSENTE (recalculé : ' + lignesVraies + ' lignes)');
    const detailFausses = fausses.map((v) => v.essayees).join(' + ');
    if (!contient(p, 'plus ' + detailFausses + ' pour les deux réfutations')) {
      ecarts.push('prose : « plus ' + detailFausses + ' pour les deux réfutations » ABSENTE');
    }
    rendre('lois-total', 'leçon 02 · lois.txt et prose : 19 / 17 / 2 / 78, dont 74 lignes pour les lois et 2 + 2 pour les réfutations', ecarts);
  }

  /* --- 30. de-morgan.txt : la table et les deux marques « FAUX ICI » --- */
  {
    const txt = L.sortie(2, 'de-morgan.txt');
    const attendues = affect(2, true);
    const lignes = lignesDe(txt).filter((l) => /^\s+[VF]\s+[VF]\s+\|/.test(l));
    const ecarts = [];
    if (lignes.length !== 4) ecarts.push('recalculé : 4 lignes | publié : ' + lignes.length);
    for (let i = 0; i < attendues.length && i < lignes.length; i++) {
      const rr = attendues[i][0], vv = attendues[i][1];
      const env = ET(rr, vv);
      const ref = NON(env);
      const juste = OU(NON(rr), NON(vv));
      const bacle = ET(NON(rr), NON(vv));
      const cells = lignes[i].split('|').map((x) => x.trim());
      const attendu = [S(rr) + '      ' + S(vv), S(env), S(ref), S(juste), S(bacle)];
      for (let k = 0; k < 5; k++) {
        const publie = k === 4 ? cells[4].replace(/<--.*$/, '').trim() : cells[k];
        const att = k === 0 ? S(rr) + ' ' + S(vv) : attendu[k];
        const norm = k === 0 ? publie.replace(/\s+/g, ' ') : publie;
        if (norm !== att) ecarts.push('ligne ' + (i + 1) + ' colonne ' + k + ' : recalculé « ' + att + ' » | publié « ' + norm + ' »');
      }
      const marque = /<-- FAUX ICI/.test(lignes[i]);
      if (marque !== (bacle !== ref)) {
        ecarts.push('ligne ' + mot(attendues[i]) + ' : la marque « FAUX ICI » est ' + (marque ? 'présente' : 'absente') +
          ' alors que la version bâclée est ' + (bacle === ref ? 'd\'accord' : 'en désaccord'));
      }
    }
    add('leçon 02 · de-morgan.txt : la table et les deux marques « FAUX ICI »', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 31. de-morgan : 4/4 et 2/4, et la prose --- */
  {
    const txt = L.sortie(2, 'de-morgan.txt');
    const combis = affect(2, true);
    const justes = combis.filter((v) => OU(NON(v[0]), NON(v[1])) === NON(ET(v[0], v[1]))).length;
    const bacles = combis.filter((v) => ET(NON(v[0]), NON(v[1])) === NON(ET(v[0], v[1]))).length;
    const ecarts = [];
    const m1 = ligne(txt, /!\(r ET v\) = !r OU !v : (\d+)\/(\d+) lignes d'accord\./);
    const m2 = ligne(txt, /!\(r ET v\) = !r ET !v : (\d+)\/(\d+) lignes d'accord/);
    if (!m1) ecarts.push('ligne introuvable : « !(r ET v) = !r OU !v : N/N »');
    else if (Number(m1[1]) !== justes || Number(m1[2]) !== combis.length) ecarts.push('De Morgan juste : recalculé ' + justes + '/' + combis.length + ' | publié ' + m1[1] + '/' + m1[2]);
    if (!m2) ecarts.push('ligne introuvable : « !(r ET v) = !r ET !v : N/N »');
    else if (Number(m2[1]) !== bacles || Number(m2[2]) !== combis.length) ecarts.push('version bâclée : recalculé ' + bacles + '/' + combis.length + ' | publié ' + m2[1] + '/' + m2[2]);
    const p = prose(2);
    if (!contient(p, 'est d\'accord avec la réalité sur ' + bacles + ' lignes sur ' + combis.length)) {
      ecarts.push('prose : « d\'accord avec la réalité sur ' + bacles + ' lignes sur ' + combis.length + ' » ABSENTE');
    }
    add('leçon 02 · de-morgan.txt : 4/4 pour la loi, 2/4 pour la version bâclée', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* Les quatre expressions de simplifier.txt, réécrites ici en arbres explicites :
     chaque feuille est une occurrence de variable, ce qui permet de LES COMPTER
     sans regarder le texte du programme publié. */
  const V_AUT = 0, V_MOD = 1, V_VER = 2, V_BAN = 3;
  const feuille = (i) => ({ k: 'var', i: i });
  const non = (x) => ({ k: 'non', a: x });
  const et = (x, y) => ({ k: 'et', a: x, b: y });
  const ou = (x, y) => ({ k: 'ou', a: x, b: y });
  function evalue(n, v) {
    if (n.k === 'var') return v[n.i];
    if (n.k === 'non') return NON(evalue(n.a, v));
    if (n.k === 'et') return ET(evalue(n.a, v), evalue(n.b, v));
    return OU(evalue(n.a, v), evalue(n.b, v));
  }
  function occurrences(n) {
    if (n.k === 'var') return 1;
    if (n.k === 'non') return occurrences(n.a);
    return occurrences(n.a) + occurrences(n.b);
  }
  const A = feuille(V_AUT), M = feuille(V_MOD), Vr = feuille(V_VER), B = feuille(V_BAN);
  const EXPR = {
    'initiale': ou(ou(et(et(A, non(Vr)), non(B)), et(M, non(B))), et(et(A, M), non(B))),
    'étape 1': et(non(B), ou(ou(et(A, non(Vr)), M), et(A, M))),
    'étape 2': et(non(B), ou(et(A, non(Vr)), M)),
    'finale': et(non(B), ou(M, et(A, non(Vr)))),
    'sans !banni': ou(M, et(A, non(Vr))),
  };

  /* --- 32. simplifier.txt : les trois étapes, et le témoin à 5 écarts --- */
  {
    const txt = L.sortie(2, 'simplifier.txt');
    const combis = affect(4, false);
    const ecarts = [];
    for (const nom of ['étape 1', 'étape 2', 'finale', 'sans !banni']) {
      const divergentes = combis.filter((v) => evalue(EXPR[nom], v) !== evalue(EXPR['initiale'], v)).map(mot);
      const m = ligne(txt, new RegExp('^' + nom.replace(/[!]/g, '\\$&') + '\\s*:\\s*(.*)$'));
      if (!m) { ecarts.push('ligne introuvable : « ' + nom + ' »'); continue; }
      const attendu = divergentes.length === 0
        ? 'identique sur les ' + combis.length + ' cas'
        : divergentes.length + ' écart(s) : ' + divergentes.join(' ');
      if (m[1].trim() !== attendu) ecarts.push(nom + ' : recalculé « ' + attendu + ' » | publié « ' + m[1].trim() + ' »');
    }
    garde('simplifier', ecarts);
  }

  /* --- 33. les occurrences de variables : 8 au départ, 4 à l'arrivée --- */
  {
    const txt = L.sortie(2, 'simplifier.txt');
    const m = ligne(txt, /départ\s*:\s*(\d+)\s*,\s*finale\s*:\s*(\d+)/);
    const oDepart = occurrences(EXPR['initiale']);
    const oFinale = occurrences(EXPR['finale']);
    const o1 = occurrences(EXPR['étape 1']);
    const o2 = occurrences(EXPR['étape 2']);
    const ecarts = [];
    if (!m) ecarts.push('ligne introuvable : « occurrences de variables — départ : N , finale : N »');
    else {
      if (Number(m[1]) !== oDepart) ecarts.push('départ : recalculé ' + oDepart + ' | publié ' + m[1]);
      if (Number(m[2]) !== oFinale) ecarts.push('finale : recalculé ' + oFinale + ' | publié ' + m[2]);
    }
    const p = prose(2);
    if (!contient(p, 'de ' + oDepart + ' à ' + oFinale + ' occurrences de variable')) {
      ecarts.push('prose : « de ' + oDepart + ' à ' + oFinale + ' occurrences de variable » ABSENTE');
    }
    if (!contient(p, 'de ' + o1 + ' à ' + o2 + ' occurrences de variable')) {
      ecarts.push('prose (étape 2) : « de ' + o1 + ' à ' + o2 + ' occurrences de variable » ABSENTE');
    }
    if (!contient(p, 'qui l\'avait fait passer de ' + oDepart + ' à ' + o1)) {
      ecarts.push('prose (étape 1) : « fait passer de ' + oDepart + ' à ' + o1 + ' » ABSENTE');
    }
    add('leçon 02 · simplifier.txt : 8 occurrences au départ, 6 après l\'étape 1, 4 à l\'arrivée',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 34. « sur 16 situations, la modification est autorisée dans 5 » --- */
  {
    const txt = L.sortie(2, 'simplifier.txt');
    const combis = affect(4, false);
    const oui = combis.filter((v) => evalue(EXPR['finale'], v)).length;
    const m = ligne(txt, /sur (\d+) situations possibles, la modification est autorisée dans (\d+)\./);
    const ecarts = [];
    if (!m) ecarts.push('ligne introuvable : « sur N situations possibles, la modification est autorisée dans N. »');
    else if (Number(m[1]) !== combis.length || Number(m[2]) !== oui) {
      ecarts.push('situations autorisées : recalculé ' + oui + ' sur ' + combis.length + ' | publié ' + m[2] + ' sur ' + m[1]);
    }
    garde('simplifier', ecarts);
  }

  /* --- 35. les 8 lignes bannies, 5 visibles, 3 invisibles --- */
  {
    const combis = affect(4, false);
    const bannies = combis.filter((v) => v[V_BAN] === true);
    const visibles = bannies.filter((v) => evalue(EXPR['sans !banni'], v) !== evalue(EXPR['initiale'], v));
    const invisibles = bannies.length - visibles.length;
    const p = prose(2);
    const ecarts = [];
    if (!contient(p, 'il y a huit lignes où l\'utilisateur est banni, et seulement cinq où l\'oubli se voit')) {
      ecarts.push('prose : la phrase « huit lignes bannies, cinq où l\'oubli se voit » ABSENTE');
    }
    if (bannies.length !== 8) ecarts.push('lignes bannies : recalculé ' + bannies.length + ' | la prose annonce huit');
    if (visibles.length !== 5) ecarts.push('écarts visibles : recalculé ' + visibles.length + ' | la prose annonce cinq');
    if (invisibles !== 3 || !contient(p, 'sur ' + invisibles + ' d\'entre elles, la condition de départ refusait déjà')) {
      ecarts.push('lignes bannies où l\'oubli ne se voit pas : recalculé ' + invisibles + ' | la prose annonce trois');
    }
    rendre('simplifier', 'leçon 02 · simplifier.txt : 3 réécritures exactes, témoin à 5 écarts sur 8 lignes bannies, 5 cas autorisés sur 16', ecarts);
  }

  /* --- 36. le tableau des lois : 13 lignes, 12 lois, la dernière réfutée --- */
  {
    const h = L.html(2);
    const table = (h.match(/<table[\s\S]*?<\/table>/) || [''])[0];
    const lignes = table.match(/<tr><td>[\s\S]*?<\/tr>/g) || [];
    const nomsPub = lignes.map((l) => L.deshtml(l.replace(/<\/td>[\s\S]*$/, '').replace(/<[^>]+>/g, '')).replace(/⚠️/g, '').trim());
    const ecarts = [];
    /* Chaque ligne du tableau doit correspondre à une proposition éprouvée par
       le programme ; la dernière (la réciproque) est celle qu'il réfute. */
    const testees = VERDICTS.map((v) => serre(v.nom.toLowerCase()));
    for (const nom of nomsPub) {
      const cle = serre(nom.toLowerCase());
      const trouve = testees.some((t) => t.indexOf(cle) === 0 || cle.indexOf(t) === 0 || t.indexOf(cle) !== -1);
      if (!trouve) ecarts.push('la ligne « ' + nom + ' » du tableau ne correspond à aucune proposition évaluée');
    }
    if (lignes.length !== 13) ecarts.push('lignes du tableau : recalculé 13 attendues | trouvé ' + lignes.length);
    const caption = (table.match(/<caption>([\s\S]*?)<\/caption>/) || ['', ''])[1];
    if (!contient(L.deshtml(caption), 'les ' + CARD[lignes.length] + ' lignes sont vérifiées')) {
      ecarts.push('la légende du tableau n\'annonce pas « les ' + CARD[lignes.length] + ' lignes » : « ' + L.deshtml(caption).trim() + ' »');
    }
    const derniere = nomsPub[nomsPub.length - 1];
    const refutees = VERDICTS.filter((v) => !v.ok).map((v) => serre(v.nom.toLowerCase()));
    if (refutees.indexOf(serre(derniere.toLowerCase())) === -1) {
      ecarts.push('la dernière ligne du tableau est « ' + derniere + ' », or les propositions réfutées sont ' +
        VERDICTS.filter((v) => !v.ok).map((v) => v.nom).join(' et '));
    }
    /* La leçon 3 renvoie à « douze lois » : le tableau moins la réciproque. */
    const p3 = prose(3);
    const lois = lignes.length - 1;
    if (!contient(p3, CARD[lois] + ' lois permettent de passer de l\'une à l\'autre')) {
      ecarts.push('leçon 03 : la phrase « ' + CARD[lois] + ' lois permettent… » ABSENTE (13 lignes de tableau moins la réciproque)');
    }
    add('leçon 02 · tableau des lois : 13 lignes, la dernière réfutée, 12 lois (renvoi de la leçon 03)',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 37. la négation d'un intervalle, vérifiée âge par âge --- */
  {
    const p = prose(2);
    let ecartsOu = 0, vraisEt = 0, ages = 0;
    for (let age = -50; age <= 150; age++) {
      ages++;
      const dedans = ET(18 <= age, age <= 65);
      const negOu = OU(age < 18, age > 65);
      const negEt = ET(age < 18, age > 65);
      if (NON(dedans) !== negOu) ecartsOu++;
      if (negEt) vraisEt++;
    }
    const ecarts = [];
    if (ecartsOu !== 0) ecarts.push('age < 18 || age > 65 diverge de la négation sur ' + ecartsOu + ' âges');
    if (vraisEt !== 0) ecarts.push('age < 18 && age > 65 serait vraie pour ' + vraisEt + ' âges — la page la dit toujours fausse');
    if (!contient(p, 'est age < 18 || age > 65 , pas age < 18 && age > 65')) {
      ecarts.push('prose : la phrase donnant la bonne négation est ABSENTE');
    }
    add('leçon 02 · prose : la négation de 18 <= age <= 65, vérifiée sur 201 âges (' + ages + ' essayés)',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 38. solution-3 : De Morgan sur le OU, 4 accords sur 4 --- */
  {
    const txt = L.sortie(2, 'solution-3.txt');
    const combis = affect(2, true);
    const ecarts = [];
    let accord = 0;
    for (let i = 0; i < combis.length; i++) {
      const a = combis[i][0], b = combis[i][1];
      const g = NON(OU(a, b)), d = ET(NON(a), NON(b));
      if (g === d) accord++;
      const attendu = S(a) + ' ' + S(b) + ' !(a||b) = ' + S(g) + ' !a&&!b = ' + S(d) + (g === d ? ' d\'accord' : ' DIFFÉRENT');
      const l = lignesDe(txt)[i];
      if (!l || l.replace(/\s+/g, ' ').trim() !== attendu) {
        ecarts.push('ligne ' + (i + 1) + ' : recalculé « ' + attendu + ' » | publié « ' + (l ? l.replace(/\s+/g, ' ').trim() : 'introuvable') + ' »');
      }
    }
    const m = ligne(txt, /^(\d+)$/);
    if (!m) ecarts.push('ligne introuvable : le total d\'accords (un nombre seul)');
    else if (Number(m[1]) !== accord) ecarts.push('total : recalculé ' + accord + ' | publié ' + m[1]);
    add('leçon 02 · solution-3.txt : !(a||b) = !a&&!b sur les 4 lignes', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 39. solution-4 : la garde réécrite, 0 écart, 3 passages sur 8 --- */
  {
    const txt = L.sortie(2, 'solution-4.txt');
    const combis = affect(3, false);
    const ecarts = [];
    let ecartsLignes = 0, passent = 0;
    for (let i = 0; i < combis.length; i++) {
      const ad = combis[i][0], au = combis[i][1], ar = combis[i][2];
      const depart = NON(OU(ad, ET(au, NON(ar))));
      const reecrit = ET(NON(ad), OU(NON(au), ar));
      if (depart !== reecrit) ecartsLignes++;
      if (depart) passent++;
      const attendu = 'admin=' + S(ad) + ' auteur=' + S(au) + ' archivé=' + S(ar) +
        ' départ=' + S(depart) + ' réécrit=' + S(reecrit) + (depart === reecrit ? '' : ' ÉCART');
      const m = ligne(txt, new RegExp('^admin=' + S(ad) + ' auteur=' + S(au) + ' archivé=' + S(ar) + '\\s'));
      if (!m) ecarts.push('ligne introuvable : admin=' + S(ad) + ' auteur=' + S(au) + ' archivé=' + S(ar));
      else if (m.ligne !== attendu) {
        ecarts.push('recalculé « ' + attendu + ' » | publié « ' + m.ligne + ' »');
      }
    }
    const m1 = ligne(txt, /écarts sur les (\d+) lignes : (\d+)/);
    if (!m1) ecarts.push('ligne introuvable : « écarts sur les N lignes : N »');
    else if (Number(m1[1]) !== combis.length || Number(m1[2]) !== ecartsLignes) {
      ecarts.push('écarts : recalculé ' + ecartsLignes + ' sur ' + combis.length + ' | publié ' + m1[2] + ' sur ' + m1[1]);
    }
    const m2 = ligne(txt, /situations où la garde laisse passer : (\d+) sur (\d+)\./);
    if (!m2) ecarts.push('ligne introuvable : « situations où la garde laisse passer : N sur N. »');
    else if (Number(m2[1]) !== passent || Number(m2[2]) !== combis.length) {
      ecarts.push('passages : recalculé ' + passent + ' sur ' + combis.length + ' | publié ' + m2[1] + ' sur ' + m2[2]);
    }
    const p = prose(2);
    if (!contient(p, 'ne laisse passer que ' + passent + ' des ' + combis.length + ' situations')) {
      ecarts.push('prose : « ne laisse passer que ' + passent + ' des ' + combis.length + ' situations » ABSENTE');
    }
    add('leçon 02 · solution-4.txt : la garde réécrite, 0 écart, 3 passages sur 8', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 40. solution-5 : les deux fusions de termes adjacents --- */
  {
    const txt = L.sortie(2, 'solution-5.txt');
    const combis = affect(2, true);
    const cas = [
      { nom: '(a && b) || (a && !b)  ->  a', f: (a, b) => OU(ET(a, b), ET(a, NON(b))) },
      { nom: '(a || b) && (a || !b)  ->  a', f: (a, b) => ET(OU(a, b), OU(a, NON(b))) },
    ];
    const ecarts = [];
    for (const c of cas) {
      const e = combis.filter((v) => c.f(v[0], v[1]) !== v[0]).length;
      const attendu = c.nom + '   écarts sur ' + combis.length + ' lignes : ' + e + (e === 0 ? '  (réécriture VALIDE)' : '  (FAUSSE)');
      const m = ligne(txt, new RegExp('^' + c.nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      if (!m) ecarts.push('ligne introuvable : « ' + c.nom + ' »');
      else if (serre(m.ligne) !== serre(attendu)) ecarts.push('recalculé « ' + attendu + ' » | publié « ' + m.ligne + ' »');
    }
    const tiers = combis.map((v) => OU(v[1], NON(v[1]))).every((x) => x === true);
    const contra = combis.map((v) => ET(v[1], NON(v[1]))).some((x) => x === true);
    const m1 = ligne(txt, /^b \|\| !b vaut toujours (true|false)$/);
    const m2 = ligne(txt, /^b && !b vaut toujours (true|false)$/);
    if (!m1) ecarts.push('ligne introuvable : « b || !b vaut toujours … »');
    else if (m1[1] !== String(tiers)) ecarts.push('tiers exclu : recalculé ' + tiers + ' | publié ' + m1[1]);
    if (!m2) ecarts.push('ligne introuvable : « b && !b vaut toujours … »');
    else if (m2[1] !== String(contra)) ecarts.push('non-contradiction : recalculé ' + contra + ' | publié ' + m2[1]);
    add('leçon 02 · solution-5.txt : deux termes adjacents fusionnent, tiers exclu et non-contradiction',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* ================================================================ */
  /* LEÇON 03                                                         */
  /* ================================================================ */

  /* --- 41. court-circuit : verdicts et compteurs d'appels --- */
  {
    const txt = L.sortie(3, 'court-circuit.txt');
    /* Les trois paniers, reconstruits ici. Le raisonnement, pas l'exécution :
       `p && estValide(p)` ne franchit la droite que si p est vrai ;
       `estValide(p) && p` appelle toujours, et lève sur un panier absent. */
    const paniers = [null, { articles: [] }, { articles: ['thé'] }];
    let appels1 = 0, appels2 = 0;
    const ecarts = [];
    for (const p of paniers) {
      const etiquette = JSON.stringify(p);
      let verdict1;
      if (!verite(p)) verdict1 = 'false';
      else { appels1++; verdict1 = String(verite(p.articles.length > 0)); }
      const m1 = ligne(txt, new RegExp('^\\s+' + etiquette.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' -> (.*)$'));
      if (!m1) ecarts.push('ordre 1 : ligne introuvable pour ' + etiquette);
      else if (m1[1].trim() !== verdict1 && !(p === null && /TypeError/.test(m1[1]))) {
        ecarts.push('ordre 1, ' + etiquette + ' : recalculé « ' + verdict1 + ' » | publié « ' + m1[1].trim() + ' »');
      }
      appels2++;
      let verdict2;
      if (p === null) verdict2 = 'TypeError';
      else if (!verite(p.articles.length > 0)) verdict2 = 'false';
      else verdict2 = String(verite(p));
      /* les deux blocs portent la même étiquette : on vérifie la seconde occurrence */
      const toutes = lignesDe(txt).filter((l) => l.indexOf(etiquette + ' -> ') !== -1);
      if (toutes.length !== 2) ecarts.push('ordre 2 : ' + toutes.length + ' ligne(s) pour ' + etiquette + ', 2 attendues');
      else {
        const publie = toutes[1].split('-> ')[1].trim();
        if (verdict2 === 'TypeError') {
          if (publie.indexOf('TypeError') !== 0 || publie.indexOf('articles') === -1) {
            ecarts.push('ordre 2, ' + etiquette + ' : recalculé « une TypeError sur .articles » | publié « ' + publie + ' »');
          }
        } else if (publie !== verdict2) {
          ecarts.push('ordre 2, ' + etiquette + ' : recalculé « ' + verdict2 + ' » | publié « ' + publie + ' »');
        }
      }
    }
    const compteurs = lignesDe(txt).map((l) => l.match(/estValide appelée (\d+) fois/)).filter((m) => m);
    if (compteurs.length !== 2) ecarts.push('recalculé : 2 compteurs d\'appels | publié : ' + compteurs.length);
    else {
      if (Number(compteurs[0][1]) !== appels1) ecarts.push('ordre 1 : appels recalculés ' + appels1 + ' | publiés ' + compteurs[0][1]);
      if (Number(compteurs[1][1]) !== appels2) ecarts.push('ordre 2 : appels recalculés ' + appels2 + ' | publiés ' + compteurs[1][1]);
    }
    const p3 = prose(3);
    if (!contient(p3, 'appelle la fonction ' + appels1 + ' fois sur trois paniers') ||
      !contient(p3, 'l\'ordre inverse l\'appelle ' + appels2 + ' fois')) {
      ecarts.push('prose : les compteurs ' + appels1 + ' / ' + appels2 + ' ne s\'y retrouvent pas tels quels');
    }
    add('leçon 03 · court-circuit.txt : les 6 verdicts et les compteurs 2 et 3', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 42. falsy : les 14 verdicts, décidés par la table ToBoolean --- */
  {
    const txt = L.sortie(3, 'falsy.txt');
    const CANDIDATES = [
      ['false', false], ['0', 0], ['-0', -0], ['0n (BigInt)', 0n], ['"" (chaîne vide)', ''],
      ['null', null], ['undefined', undefined], ['NaN', NaN],
      ['"0" (chaîne)', '0'], ['"false" (chaîne)', 'false'], ['[] (tableau vide)', []],
      ['{} (objet vide)', {}], ['-1', -1], ['" " (une espace)', ' '],
    ];
    const ecarts = [];
    let fausses = 0;
    for (const c of CANDIDATES) {
      const v = verite(c[1]);
      if (!v) fausses++;
      const re = new RegExp('^' + c[0].replace(/[.*+?^${}()|[\]\\"]/g, '\\$&') + '\\s+-> (.*)$');
      const m = ligne(txt, re);
      if (!m) { ecarts.push('ligne introuvable : « ' + c[0] + ' »'); continue; }
      const publie = m[1].trim();
      const attendu = v ? 'VRAI' : 'FAUX (une des 8)';
      if (publie !== attendu) ecarts.push(c[0] + ' : recalculé « ' + attendu + ' » | publié « ' + publie + ' »');
    }
    const m = ligne(txt, /^(\d+) valeurs fausses parmi les (\d+) essayées\.$/);
    if (!m) ecarts.push('ligne introuvable : « N valeurs fausses parmi les N essayées. »');
    else if (Number(m[1]) !== fausses || Number(m[2]) !== CANDIDATES.length) {
      ecarts.push('recalculé : ' + fausses + ' fausses sur ' + CANDIDATES.length + ' | publié : ' + m[1] + ' sur ' + m[2]);
    }
    const p = prose(3);
    if (!contient(p, 'La liste des ' + CARD[fausses] + ' valeurs fausses est courte et close')) {
      ecarts.push('prose : « la liste des ' + CARD[fausses] + ' valeurs fausses » ABSENTE');
    }
    garde('falsy', ecarts);
  }

  /* --- 43. la neuvième valeur fausse : document.all --- */
  {
    const p = prose(3);
    /* Recalculé depuis la norme : les valeurs primitives fausses sont au nombre
       de 8 (undefined, null, false, +0, -0, NaN, "", 0n) ; le seul objet faux
       est celui qui porte [[IsHTMLDDA]], c'est-à-dire document.all — absent
       d'un worker, où le programme de la page s'exécute. */
    const primitivesFausses = [undefined, null, false, 0, -0, NaN, '', 0n].filter((x) => !verite(x)).length;
    const ecarts = [];
    if (primitivesFausses !== 8) ecarts.push('valeurs primitives fausses recalculées : ' + primitivesFausses);
    if (!contient(p, 'Il existe une neuvième valeur fausse')) ecarts.push('prose : « une neuvième valeur fausse » ABSENTE');
    if (typeof document !== 'undefined') ecarts.push('document existe dans cet environnement : la page dit le contraire');
    if (!contient(p, 'il s\'exécute dans un worker , où document n\'existe pas')) {
      ecarts.push('prose : l\'explication « le programme s\'exécute dans un worker » ABSENTE');
    }
    rendre('falsy', 'leçon 03 · falsy.txt : les 14 verdicts, les 8 valeurs fausses, et document.all en neuvième', ecarts);
  }

  /* --- 44. || contre ?? sur cinq quantités --- */
  {
    const txt = L.sortie(3, 'falsy.txt');
    const montre = (v) => (v === undefined ? 'undefined' : JSON.stringify(v));
    const ecarts = [];
    for (const q of [5, 0, null, undefined, '']) {
      /* || rend la droite dès que la gauche est fausse ; ?? seulement si elle
         est null ou undefined. Règles réécrites, pas empruntées. */
      const avecOu = verite(q) ? q : 1;
      const avecCoal = (q === null || q === undefined) ? 1 : q;
      const re = new RegExp('^quantité = ' + montre(q).replace(/[.*+?^${}()|[\]\\"]/g, '\\$&') +
        '\\s+avec \\|\\| : (\\S+)\\s+avec \\?\\? : (.*)$');
      const m = ligne(txt, re);
      if (!m) { ecarts.push('ligne introuvable : « quantité = ' + montre(q) + ' »'); continue; }
      if (m[1].trim() !== montre(avecOu)) ecarts.push('quantité ' + montre(q) + ' avec || : recalculé ' + montre(avecOu) + ' | publié ' + m[1].trim());
      if (m[2].trim() !== montre(avecCoal)) ecarts.push('quantité ' + montre(q) + ' avec ?? : recalculé ' + montre(avecCoal) + ' | publié ' + m[2].trim());
    }
    add('leçon 03 · falsy.txt : || contre ?? sur 5, 0, null, undefined et ""', ecarts.length === 0, ecarts.join(' ; '));
  }

  /* Tous les tableaux de booléens de longueur 0 à 4, engendrés par produit
     cartésien (1 + 2 + 4 + 8 + 16). */
  const TABLEAUX = [];
  for (let n = 0; n <= 4; n++) for (const t of affect(n, true)) TABLEAUX.push(t);
  /* Quantificateurs recomptés élément par élément, sans every ni some. */
  const tous = (t, p) => { for (let i = 0; i < t.length; i++) { if (!p(t[i])) return false; } return true; };
  const ilExiste = (t, p) => { for (let i = 0; i < t.length; i++) { if (p(t[i])) return true; } return false; };
  const idt = (x) => x === true;
  const nonIdt = (x) => x !== true;

  /* --- 45. les 31 tableaux et les trois règles de négation --- */
  {
    const txt = L.sortie(3, 'quantificateurs.txt');
    const ecarts = [];
    const attenduTotal = 1 + 2 + 4 + 8 + 16;
    if (TABLEAUX.length !== attenduTotal) ecarts.push('tableaux engendrés : ' + TABLEAUX.length + ' au lieu de ' + attenduTotal);
    const REGLES = [
      ['!tous(p)      = ilExiste(non p)', (t) => !tous(t, idt), (t) => ilExiste(t, nonIdt)],
      ['!ilExiste(p)  = tous(non p)', (t) => !ilExiste(t, idt), (t) => tous(t, nonIdt)],
      ['tous(p)       = !ilExiste(non p)', (t) => tous(t, idt), (t) => !ilExiste(t, nonIdt)],
    ];
    for (const [nom, f, g] of REGLES) {
      const contre = TABLEAUX.filter((t) => f(t) !== g(t));
      const m = ligne(txt, new RegExp('^' + nom.replace(/[.*+?^${}()|[\]\\!]/g, '\\$&').replace(/\s+/g, '\\s+') + '\\s*:\\s*(.*)$'));
      if (!m) { ecarts.push('ligne introuvable : « ' + nom.replace(/\s+/g, ' ') + ' »'); continue; }
      const attendu = contre.length === 0
        ? 'vérifié sur les ' + TABLEAUX.length + ' tableaux'
        : contre.length + ' contre-exemple(s)';
      if (contre.length === 0) {
        if (m[1].trim() !== attendu) ecarts.push(nom.replace(/\s+/g, ' ') + ' : recalculé « ' + attendu + ' » | publié « ' + m[1].trim() + ' »');
      } else {
        ecarts.push(nom.replace(/\s+/g, ' ') + ' : le recalcul trouve ' + contre.length +
          ' contre-exemple(s) alors que la page l\'annonce vérifiée');
      }
    }
    const p = prose(3);
    if (!contient(p, 'sur les ' + TABLEAUX.length + ' tableaux de longueur 0 à 4 — 1 + 2 + 4 + 8 + 16')) {
      ecarts.push('prose : « les ' + TABLEAUX.length + ' tableaux de longueur 0 à 4 — 1 + 2 + 4 + 8 + 16 » ABSENTE');
    }
    add('leçon 03 · quantificateurs.txt : 3 règles de négation vérifiées sur 31 tableaux',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 46. « aucun » n'est pas « pas tous » : 23 contre-exemples --- */
  {
    const txt = L.sortie(3, 'quantificateurs.txt');
    const contre = TABLEAUX.filter((t) => tous(t, nonIdt) !== !tous(t, idt));
    const ecarts = [];
    const m = ligne(txt, /« aucun » = « pas tous » \?\s*:\s*(\d+) contre-exemple\(s\), le premier : \[([^\]]*)\]/);
    if (!m) ecarts.push('ligne introuvable : « « aucun » = « pas tous » ? : N contre-exemple(s)… »');
    else {
      if (Number(m[1]) !== contre.length) ecarts.push('contre-exemples : recalculé ' + contre.length + ' | publié ' + m[1]);
      const premier = contre.length ? contre[0].map(S).join(',') : '(aucun)';
      if (m[2] !== premier) ecarts.push('premier contre-exemple : recalculé [' + premier + '] | publié [' + m[2] + ']');
    }
    const p = prose(3);
    if (!contient(p, contre.length + ' contre-exemples sur ' + TABLEAUX.length)) {
      ecarts.push('prose : « ' + contre.length + ' contre-exemples sur ' + TABLEAUX.length + ' » ABSENTE');
    }
    if (!contient(p, 'Vingt-trois des trente et un tableaux séparent ces deux phrases')) {
      ecarts.push('prose : la phrase « Vingt-trois des trente et un tableaux » ABSENTE (recalculé : ' + contre.length + ' sur ' + TABLEAUX.length + ')');
    }
    const m2 = ligne(txt, /^tableau vide : every -> (true|false) , some -> (true|false)$/);
    if (!m2) ecarts.push('ligne introuvable : « tableau vide : every -> … , some -> … »');
    else {
      if (m2[1] !== String(tous([], idt))) ecarts.push('tableau vide, every : recalculé ' + tous([], idt) + ' | publié ' + m2[1]);
      if (m2[2] !== String(ilExiste([], idt))) ecarts.push('tableau vide, some : recalculé ' + ilExiste([], idt) + ' | publié ' + m2[2]);
    }
    add('leçon 03 · quantificateurs.txt : 23 contre-exemples sur 31, le premier étant []',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 47. priorité : la table de a || b && c --- */
  {
    const txt = L.sortie(3, 'priorite.txt');
    const combis = affect(3, false);
    /* La grammaire de la norme (LogicalORExpression : … || LogicalANDExpression)
       impose la lecture a || (b && c). On la prend comme référence, et on la
       confirme en faisant analyser l'expression par le moteur lui-même. */
    let moteur;
    try { moteur = new Function('a', 'b', 'c', 'return a || b && c'); } catch (e) { moteur = null; }
    const ecarts = [];
    let dGauche = 0, dDroite = 0;
    const lignes = lignesDe(txt).filter((l) => /^[VF] [VF] [VF] \|/.test(l));
    if (lignes.length !== combis.length) ecarts.push('recalculé : ' + combis.length + ' lignes | publié : ' + lignes.length);
    for (let i = 0; i < combis.length; i++) {
      const [a, b, c] = combis[i];
      const sans = OU(a, ET(b, c));
      if (moteur && moteur(a, b, c) !== sans) ecarts.push('le moteur lit a||b&&c autrement que a||(b&&c) en ' + mot(combis[i]));
      const gauche = ET(OU(a, b), c);
      const droite = OU(a, ET(b, c));
      if (sans !== gauche) dGauche++;
      if (sans !== droite) dDroite++;
      const attendu = S(a) + ' ' + S(b) + ' ' + S(c) + ' | ' + S(sans) + ' | ' + S(gauche) + ' | ' + S(droite);
      const l = lignes[i];
      if (!l) { ecarts.push('ligne introuvable : ' + mot(combis[i])); continue; }
      if (l.replace(/\s+/g, ' ').replace(/ \| /g, ' | ').trim() !== attendu) {
        ecarts.push('ligne ' + mot(combis[i]) + ' : recalculé « ' + attendu + ' » | publié « ' + l.replace(/\s+/g, ' ').trim() + ' »');
      }
    }
    const m1 = ligne(txt, /écarts avec \(a\|\|b\)&&c : (\d+) lignes sur (\d+)/);
    const m2 = ligne(txt, /écarts avec a\|\|\(b&&c\) : (\d+) lignes sur (\d+)/);
    if (!m1) ecarts.push('ligne introuvable : « écarts avec (a||b)&&c »');
    else if (Number(m1[1]) !== dGauche || Number(m1[2]) !== combis.length) ecarts.push('écarts avec (a||b)&&c : recalculé ' + dGauche + '/' + combis.length + ' | publié ' + m1[1] + '/' + m1[2]);
    if (!m2) ecarts.push('ligne introuvable : « écarts avec a||(b&&c) »');
    else if (Number(m2[1]) !== dDroite || Number(m2[2]) !== combis.length) ecarts.push('écarts avec a||(b&&c) : recalculé ' + dDroite + '/' + combis.length + ' | publié ' + m2[1] + '/' + m2[2]);
    const p = prose(3);
    if (!contient(p, dDroite + ' écart avec a || (b && c) , ' + dGauche + ' écarts sur ' + combis.length + ' avec (a || b) && c')) {
      ecarts.push('prose : le verdict « ' + dDroite + ' écart / ' + dGauche + ' écarts sur ' + combis.length + ' » ABSENT');
    }
    garde('priorite', ecarts);
  }

  /* --- 48. la comparaison enchaînée 18 < age < 65 --- */
  {
    const txt = L.sortie(3, 'priorite.txt');
    const ecarts = [];
    /* < est associatif à gauche : (18 < x) est un booléen, converti en 0 ou 1,
       et 0 comme 1 sont inférieurs à 65 — l'expression est donc toujours vraie,
       quelle que soit la valeur comparée. */
    const nombre = (v) => (v === true ? 1 : 0);
    const toujoursVrai = [true, false].every((b) => nombre(b) < 65);
    const m = ligne(txt, /^18 < 5 < 65\s+->\s+(true|false)/);
    if (!m) ecarts.push('ligne introuvable : « 18 < 5 < 65 -> … »');
    else {
      const premier = 5 > 18;                 /* ce que vaut (18 < 5) */
      const attendu = String(nombre(premier) < 65);
      if (m[1] !== attendu) ecarts.push('18 < 5 < 65 : recalculé ' + attendu + ' | publié ' + m[1]);
    }
    const mD = ligne(txt, /^détail : \(18 < 5\) vaut (true|false), converti en nombre cela fait (-?\d+), et (-?\d+) < 65 est (true|false)$/);
    if (!mD) ecarts.push('ligne introuvable : « détail : (18 < 5) vaut … »');
    else {
      if (mD[1] !== 'false') ecarts.push('(18 < 5) : recalculé false | publié ' + mD[1]);
      if (mD[2] !== '0' || mD[3] !== '0') ecarts.push('conversion de false : recalculé 0 | publié ' + mD[2]);
      if (mD[4] !== 'true') ecarts.push('0 < 65 : recalculé true | publié ' + mD[4]);
    }
    const mA = ligne(txt, /^18 < age < 65\s+->\s+(true|false)$/);
    if (!mA) ecarts.push('ligne introuvable : « 18 < age < 65 -> … »');
    else if (mA[1] !== 'true' || !toujoursVrai) ecarts.push('18 < age < 65 : recalculé toujours vrai | publié ' + mA[1]);
    const mC = ligne(txt, /^la forme correcte : 18 < age && age < 65\s+->\s+(true|false)$/);
    if (!mC) ecarts.push('ligne introuvable : « la forme correcte … »');
    const p = prose(3);
    if (!contient(p, 'il est lu (18 < age) < 65 , donc 18 < 5 < 65 vaut true')) {
      ecarts.push('prose : la conclusion « lu (18 < age) < 65 … vaut true » ABSENTE');
    }
    add('leçon 03 · priorite.txt : 18 < 5 < 65 vaut true, par (18 < 5) puis 0 < 65',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 49. mêler ?? à || ou && est une erreur de syntaxe --- */
  {
    const p = prose(3);
    const essais = ['return a || b ?? c', 'return a && b ?? c'];
    const refuses = essais.filter((src) => {
      try { new Function('a', 'b', 'c', src); return false; } catch (e) { return e instanceof SyntaxError; }
    });
    const acceptes = ['return a || (b ?? c)', 'return (a && b) ?? c'].filter((src) => {
      try { new Function('a', 'b', 'c', src); return true; } catch (e) { return false; }
    });
    const ecarts = [];
    if (refuses.length !== 2 || acceptes.length !== 2 ||
      !contient(p, 'Erreur de syntaxe sans parenthèses, dans les deux cas : le langage refuse')) {
      ecarts.push('recalculé : ' + refuses.length + '/2 formes sans parenthèses refusées, ' + acceptes.length +
        '/2 formes parenthésées acceptées | la page annonce un refus dans les deux cas');
    }
    rendre('priorite', 'leçon 03 · priorite.txt : a || b && c (2 écarts / 0), et ?? refusé sans parenthèses', ecarts);
  }

  /* --- 50. garde-api : les six verdicts --- */
  {
    const txt = L.sortie(3, 'garde-api.txt');
    const CAS = [
      ['aucun utilisateur', null],
      ['actif, non banni', { actif: true, invite: false, bannis: [] }],
      ['invité, non banni', { actif: false, invite: true, bannis: [] }],
      ['ni actif ni invité', { actif: false, invite: false, bannis: [] }],
      ['actif mais banni', { actif: true, invite: false, bannis: ['spam'] }],
      ['champ « actif » absent', { invite: false, bannis: [] }],
    ];
    const ecarts = [];
    for (const [nom, user] of CAS) {
      /* !user || (!user.actif && !user.invite) || user.bannis.length > 0,
         avec le court-circuit qui protège les accès. */
      let refuse;
      if (!verite(user)) refuse = true;
      else if (ET(NON(verite(user.actif)), NON(verite(user.invite)))) refuse = true;
      else refuse = user.bannis.length > 0;
      const attendu = refuse ? 'REFUSÉ' : 'accepté';
      const m = ligne(txt, new RegExp('^' + nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*-> (.*)$'));
      if (!m) { ecarts.push('ligne introuvable : « ' + nom + ' »'); continue; }
      if (m[1].trim() !== attendu) ecarts.push(nom + ' : recalculé « ' + attendu + ' » | publié « ' + m[1].trim() + ' »');
    }
    const lignes = lignesDe(txt).filter((l) => /->/.test(l));
    if (lignes.length !== CAS.length) ecarts.push('recalculé : ' + CAS.length + ' situations | publié : ' + lignes.length);
    const p = prose(3);
    if (!contient(p, 'Six situations, et déjà une surprise')) ecarts.push('prose : « Six situations » ABSENTE');
    garde('garde', ecarts);
  }

  /* --- 51. la forme De Morgan de la garde est bien la négation --- */
  {
    const p = prose(3);
    const combis = affect(3, false);   /* actif, invité, banni */
    const ecarts = [];
    for (const v of combis) {
      const refuse = OU(ET(NON(v[0]), NON(v[1])), v[2]);
      const passe = ET(OU(v[0], v[1]), NON(v[2]));
      if (passe !== NON(refuse)) ecarts.push('les deux formes divergent en ' + mot(v));
    }
    if (!contient(p, 'on passe la garde si user && (user.actif || user.invite) && user.bannis.length === 0')) {
      ecarts.push('prose : la forme « user && (actif || invité) && bannis.length === 0 » ABSENTE');
    }
    if (!contient(p, '&& colle plus fort : la condition est !user || (!user.actif && !user.invite) || user.bannis.length > 0')) {
      ecarts.push('prose : le parenthésage implicite annoncé est ABSENT');
    }
    rendre('garde', 'leçon 03 · garde-api.txt : les 6 verdicts, le parenthésage implicite et la forme De Morgan', ecarts);
  }

  /* --- 52. solution-6 et solution-7 : un seul appel, trois écrasements --- */
  {
    const txt6 = L.sortie(3, 'solution-6.txt');
    const ecarts = [];
    /* false && f() n'évalue pas f ; true && f() l'évalue une fois. */
    let appels = 0;
    const r1 = false; if (false) appels++;
    const r2 = (function () { appels++; return true; })();
    const m1 = ligne(txt6, /^false && cher\(\) -> (true|false)$/);
    const m2 = ligne(txt6, /^true  && cher\(\) -> (true|false)$/);
    const m3 = ligne(txt6, /^(\d+)$/);
    if (!m1) ecarts.push('ligne introuvable : « false && cher() -> … »');
    else if (m1[1] !== String(r1)) ecarts.push('false && cher() : recalculé ' + r1 + ' | publié ' + m1[1]);
    if (!m2) ecarts.push('ligne introuvable : « true  && cher() -> … »');
    else if (m2[1] !== String(r2)) ecarts.push('true && cher() : recalculé ' + r2 + ' | publié ' + m2[1]);
    if (!m3) ecarts.push('ligne introuvable : le nombre d\'appels (un nombre seul)');
    else if (Number(m3[1]) !== appels) ecarts.push('appels : recalculé ' + appels + ' | publié ' + m3[1]);

    const txt7 = L.sortie(3, 'solution-7.txt');
    const saisie = { titre: '', marge: 0, visible: false };
    const defauts = { titre: 'Sans titre', marge: 16, visible: true };
    let ecrases = 0;
    const avecOu = {}, avecCoal = {};
    for (const cle of ['titre', 'marge', 'visible']) {
      avecOu[cle] = verite(saisie[cle]) ? saisie[cle] : defauts[cle];
      avecCoal[cle] = (saisie[cle] === null || saisie[cle] === undefined) ? defauts[cle] : saisie[cle];
      if (!memeValeur(avecOu[cle], saisie[cle])) ecrases++;
    }
    const attCoal = JSON.stringify(avecCoal), attOu = JSON.stringify(avecOu);
    const mc = ligne(txt7, /^avec \?\?\s+: (.*)$/);
    const mo = ligne(txt7, /^avec \|\|\s+: (.*)$/);
    const me = ligne(txt7, /champs écrasés par \|\| alors que la saisie était valide : (\d+) sur (\d+)\./);
    if (!mc) ecarts.push('ligne introuvable : « avec ?? : … »');
    else if (mc[1].trim() !== attCoal) ecarts.push('avec ?? : recalculé ' + attCoal + ' | publié ' + mc[1].trim());
    if (!mo) ecarts.push('ligne introuvable : « avec || : … »');
    else if (mo[1].trim() !== attOu) ecarts.push('avec || : recalculé ' + attOu + ' | publié ' + mo[1].trim());
    if (!me) ecarts.push('ligne introuvable : « champs écrasés par || … »');
    else if (Number(me[1]) !== ecrases || Number(me[2]) !== 3) ecarts.push('écrasements : recalculé ' + ecrases + ' sur 3 | publié ' + me[1] + ' sur ' + me[2]);
    add('leçon 03 · solutions 6 et 7 : un seul appel court-circuité, trois écrasements par ||',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  /* --- 53. solution-8 : 31 listes, 0 écart, trois messages --- */
  {
    const txt = L.sortie(3, 'solution-8.txt');
    const ecarts = [];
    let ecartsListes = 0;
    for (const t of TABLEAUX) {
      const toutes = tous(t, idt);
      const aucuneNon = !ilExiste(t, nonIdt);
      if (toutes !== aucuneNon) ecartsListes++;
    }
    const m = ligne(txt, /listes examinées : (\d+) , écarts entre les deux formulations : (\d+)/);
    if (!m) ecarts.push('ligne introuvable : « listes examinées : N , écarts … »');
    else {
      if (Number(m[1]) !== TABLEAUX.length) ecarts.push('listes : recalculé ' + TABLEAUX.length + ' | publié ' + m[1]);
      if (Number(m[2]) !== ecartsListes) ecarts.push('écarts : recalculé ' + ecartsListes + ' | publié ' + m[2]);
    }
    function message(t) {
      if (t.length === 0) return 'aucune tâche pour le moment';
      if (tous(t, idt)) return 'toutes les tâches sont terminées';
      return t.filter(nonIdt).length + ' tâche(s) restante(s)';
    }
    const cas = [['[]', []], ['[true, true]', [true, true]], ['[true, false]', [true, false]]];
    for (const [etiquette, t] of cas) {
      const re = new RegExp('^' + etiquette.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*-> (.*)$');
      const mm = ligne(txt, re);
      if (!mm) { ecarts.push('ligne introuvable : « ' + etiquette + ' »'); continue; }
      if (mm[1].trim() !== message(t)) ecarts.push(etiquette + ' : recalculé « ' + message(t) + ' » | publié « ' + mm[1].trim() + ' »');
    }
    add('leçon 03 · solution-8.txt : 31 listes sans écart, et les trois messages',
      ecarts.length === 0, ecarts.join(' ; '));
  }

  return r;
}

module.exports = { titre: 'leçons 01-03 — logique, algèbre de Boole, conditions', controles: controles };
