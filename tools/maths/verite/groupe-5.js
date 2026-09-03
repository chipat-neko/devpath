/* tools/maths/verite/groupe-5.js — leçons 10 et 11 (graphes et matrices), REFAITES.
   ===============================================================================
   V15 · point F2, groupe 5.

   RÈGLE DE CE FICHIER. Rien du code publié dans les leçons n'est lu, requis,
   copié ni exécuté ici. Les graphes, les recettes, les dépendances et les liens
   sont recopiés comme des DONNÉES — c'est l'entrée du problème, pas sa solution.
   Tout le reste est recalculé par une seconde méthode, choisie exprès différente
   de celle du cours :

     · le cours calcule une distance par un parcours en largeur → ici on ÉNUMÈRE
       tous les chemins sans répétition et on garde le plus court ;
     · le cours calcule un plus court chemin pondéré par Dijkstra → ici c'est
       Bellman-Ford, écrit à la main, plus une énumération complète ;
     · le cours compte les ordres d'installation par une descente récursive → ici
       on énumère les 40 320 permutations et on teste chacune ;
     · le cours compte les chemins de longueur k par des produits de matrices →
       ici on descend l'arbre des chemins un par un, sans jamais multiplier ;
     · le cours atteint le vecteur propre par itération → ici on RÉSOUT le système
       linéaire par élimination de Gauss ;
     · le cours mesure une distance moyenne par des parcours → sur l'anneau,
       elle a une forme close : d(0,j) = ceil(min(j, n−j) / (k/2)).

   Aucune valeur attendue n'est lue dans la page : elle est calculée d'abord, la
   page est lue ensuite, et les deux sont confrontées. Un contrôle qui ne trouve
   pas la ligne qu'il cherche échoue — le vert par absence est interdit. */
'use strict';
const L = require('./lib.js');

/* ===================== lecture de ce qui est PUBLIÉ ===================== */

function lignes(txt) { return txt.split('\n'); }

/* La première ligne d'un bloc qui satisfait le motif, ou null. */
function ligne(txt, motif) {
  for (const l of lignes(txt)) if (motif.test(l)) return l;
  return null;
}

/* Les « mots » d'une ligne de tableau, espaces normalisés. */
function mots(l) { return l.replace(/\u00a0/g, ' ').trim().split(/\s+/); }

/* Les nombres d'une ligne, dans l'ordre, sous forme de chaînes telles qu'écrites. */
function nombres(l) {
  const m = l.replace(/\u00a0/g, ' ').match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi);
  return m || [];
}

/* ===================== fabrique de verdicts ===================== */

/* Gauss peut rendre un zero de signe negatif : la page, elle, ecrit 0.0000. */
function sansZeroNegatif(x) {
  const t = x.toFixed(4);
  return t === '-0.0000' ? '0.0000' : t;
}

function ajoute(r, nom, ok, detail) { r.push({ nom: nom, ok: !!ok, detail: ok ? '' : detail }); }

function introuvable(r, nom, quoi) {
  r.push({ nom: nom, ok: false, detail: 'ligne introuvable : ' + quoi });
}

/* Compare une liste de couples { quoi, recalcule, publie }. */
function confronte(r, nom, couples) {
  const faux = couples.filter(function (c) { return String(c.recalcule) !== String(c.publie); });
  r.push({
    nom: nom,
    ok: faux.length === 0,
    detail: faux.length === 0 ? '' : faux.map(function (c) {
      return c.quoi + ' : recalculé ' + c.recalcule + ' , publié ' + c.publie;
    }).join(' | '),
  });
}

/* ===================== outils de calcul INDÉPENDANTS ===================== */

/* Liste d'adjacence d'un graphe non orienté donné par ses arêtes. */
function adjacence(sommets, aretes) {
  const a = new Map(sommets.map(function (s) { return [s, []]; }));
  for (const e of aretes) { a.get(e[0]).push(e[1]); a.get(e[1]).push(e[0]); }
  return a;
}

/* Plus court chemin en NOMBRE D'ARÊTES, par énumération de tous les chemins
   sans répétition. Aucune file, aucune pile : la définition, appliquée. */
function distanceEnum(adj, depart, but) {
  let best = Infinity;
  const vus = new Set([depart]);
  (function marche(s, longueur) {
    if (s === but) { if (longueur < best) best = longueur; return; }
    if (longueur + 1 >= best) return;
    for (const v of adj.get(s)) if (!vus.has(v)) { vus.add(v); marche(v, longueur + 1); vus.delete(v); }
  })(depart, 0);
  return best;
}

/* Existe-t-il un chemin SANS RÉPÉTITION de longueur exactement L ? */
function existeCheminSimple(adj, depart, but, longueur) {
  const vus = new Set([depart]);
  let trouve = false;
  (function marche(s, l) {
    if (trouve) return;
    if (l === longueur) { if (s === but) trouve = true; return; }
    for (const v of adj.get(s)) if (!vus.has(v)) { vus.add(v); marche(v, l + 1); vus.delete(v); }
  })(depart, 0);
  return trouve;
}

/* Tous les chemins sans répétition d'un graphe PONDÉRÉ, rendus sous forme
   { aretes, duree, route } : sert d'arbitre absolu sur les petites cartes. */
function cheminsPonderes(adjP, depart, but) {
  const out = [];
  const vus = new Set([depart]);
  (function marche(s, aretesFaites, duree, route) {
    if (s === but && route.length > 1) { out.push({ aretes: aretesFaites, duree: duree, route: route.slice() }); return; }
    for (const arc of adjP.get(s)) {
      if (vus.has(arc[0])) continue;
      vus.add(arc[0]); route.push(arc[0]);
      marche(arc[0], aretesFaites + 1, duree + arc[1], route);
      route.pop(); vus.delete(arc[0]);
    }
  })(depart, 0, 0, [depart]);
  return out;
}

/* BELLMAN-FORD, écrit ici, qui ne ferme aucun sommet : la méthode que Dijkstra
   n'est pas. Relâche |V|−1 fois toutes les arêtes. */
function bellmanFord(sommets, arcs, depart) {
  const d = new Map(sommets.map(function (s) { return [s, Infinity]; }));
  d.set(depart, 0);
  for (let t = 0; t < sommets.length - 1; t++) {
    for (const a of arcs) {
      if (d.get(a[0]) + a[2] < d.get(a[1])) d.set(a[1], d.get(a[0]) + a[2]);
      if (d.get(a[1]) + a[2] < d.get(a[0])) d.set(a[0], d.get(a[1]) + a[2]);
    }
  }
  return d;
}

/* Sommets atteignables depuis p par au moins un arc, par énumération des chemins
   sans répétition (un sommet d'un cycle se retrouve donc dans son propre ensemble). */
function atteintsEnum(succ, p) {
  const out = new Set();
  const dans = new Set([p]);
  (function marche(s) {
    for (const q of succ(s)) {
      out.add(q);
      if (!dans.has(q)) { dans.add(q); marche(q); dans.delete(q); }
    }
  })(p);
  return out;
}

/* Nombre de CHEMINS AU SENS LARGE (répétitions permises) de longueur k, compté
   en descendant l'arbre des chemins. Aucune multiplication de matrices. */
function cheminsLongueur(M, i, j, k) {
  if (k === 0) return i === j ? 1 : 0;
  let t = 0;
  for (let v = 0; v < M.length; v++) if (M[i][v]) t += cheminsLongueur(M, v, j, k - 1);
  return t;
}

/* Élimination de Gauss avec pivot partiel : résout A x = b. */
function gauss(A, b) {
  const n = A.length;
  const M = A.map(function (l, i) { return l.slice().concat([b[i]]); });
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    const tmp = M[c]; M[c] = M[p]; M[p] = tmp;
    for (let r = 0; r < n; r++) {
      if (r === c || M[r][c] === 0) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map(function (l, i) { return l[n] / M[i][i]; });
}

/* Toutes les permutations d'un tableau, à la force brute. */
function permutations(t) {
  if (t.length <= 1) return [t.slice()];
  const out = [];
  for (let i = 0; i < t.length; i++) {
    const reste = t.slice(0, i).concat(t.slice(i + 1));
    for (const p of permutations(reste)) out.push([t[i]].concat(p));
  }
  return out;
}

/* ===================== LEÇON 10 · le petit réseau de transport =====================
   DONNÉE recopiée du programme publié : huit stations, dix liaisons. C'est l'énoncé
   du problème ; tout ce qui suit est recalculé. */

const STATIONS = ['Nord', 'Halles', 'Opera', 'Gare', 'Parc', 'Fac', 'Port', 'Sud'];
const LIAISONS = [
  ['Nord', 'Halles'], ['Nord', 'Opera'], ['Halles', 'Opera'], ['Halles', 'Gare'],
  ['Opera', 'Gare'], ['Gare', 'Parc'], ['Parc', 'Fac'], ['Gare', 'Port'],
  ['Port', 'Sud'], ['Parc', 'Sud'],
];

function representations(r) {
  const txt = L.sortie(10, 'representations.txt');
  const adj = adjacence(STATIONS, LIAISONS);
  const n = STATIONS.length;

  /* --- 1. taille du graphe --- */
  const entete = ligne(txt, /^graphe : /);
  if (!entete) introuvable(r, 'leçon 10 · taille du réseau publiée', 'ligne « graphe : … sommets, … aretes » de representations.txt');
  else {
    const v = nombres(entete);
    confronte(r, 'leçon 10 · le réseau publié compte bien 8 sommets et 10 arêtes', [
      { quoi: 'sommets', recalcule: n, publie: v[0] },
      { quoi: 'arêtes (paires distinctes de la donnée)', recalcule: new Set(LIAISONS.map(function (e) { return e.slice().sort().join('|'); })).size, publie: v[1] },
    ]);
  }

  /* --- 2. la matrice publiée, case par case, et sa symétrie --- */
  const M = STATIONS.map(function (a) {
    return STATIONS.map(function (b) {
      return LIAISONS.some(function (e) { return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a); }) ? 1 : 0;
    });
  });
  const couples = [];
  let manquantes = 0;
  for (let i = 0; i < n; i++) {
    const l = ligne(txt, new RegExp('^' + STATIONS[i] + '\\s+[01]\\s'));
    if (!l) { manquantes++; continue; }
    const v = nombres(l);
    for (let j = 0; j < n; j++) couples.push({ quoi: 'M[' + STATIONS[i] + '][' + STATIONS[j] + ']', recalcule: M[i][j], publie: v[j] });
  }
  if (manquantes) introuvable(r, 'leçon 10 · les 64 cases de la matrice d’adjacence', manquantes + ' ligne(s) de la matrice de representations.txt');
  else {
    let asym = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (M[i][j] !== M[j][i]) asym++;
    const lAsym = ligne(txt, /^cases ou M\[i\]\[j\]/);
    couples.push({ quoi: 'cases asymétriques', recalcule: asym, publie: lAsym ? nombres(lAsym)[0] : 'ligne absente' });
    confronte(r, 'leçon 10 · les 64 cases de la matrice, reconstruites depuis les seules arêtes', couples);
  }

  /* --- 3. les degrés, et le lemme des poignées de main --- */
  const deg = STATIONS.map(function (s) { return adj.get(s).length; });
  const cd = [];
  STATIONS.forEach(function (s, i) {
    const l = ligne(txt, new RegExp('^' + s + '\\s+ligne='));
    if (!l) { cd.push({ quoi: 'degré de ' + s, recalcule: deg[i], publie: 'ligne absente' }); return; }
    const v = nombres(l);
    cd.push({ quoi: 'degré de ' + s + ' (colonne ligne)', recalcule: deg[i], publie: v[0] });
    cd.push({ quoi: 'degré de ' + s + ' (colonne liste)', recalcule: deg[i], publie: v[1] });
  });
  const somme = deg.reduce(function (a, b) { return a + b; }, 0);
  const lSomme = ligne(txt, /^somme des degres/);
  cd.push({ quoi: 'somme des degrés', recalcule: somme, publie: lSomme ? nombres(lSomme)[0] : 'ligne absente' });
  cd.push({ quoi: '2 m', recalcule: 2 * LIAISONS.length, publie: lSomme ? nombres(lSomme)[2] : 'ligne absente' });
  const prose = L.texte(10);
  const mProse = prose.match(/somme des degrés vaut exactement deux fois le nombre d'arêtes : (\d+) pour (\d+) arêtes/);
  cd.push({ quoi: 'prose « … : X pour Y arêtes » (X)', recalcule: somme, publie: mProse ? mProse[1] : 'phrase absente' });
  cd.push({ quoi: 'prose « … : X pour Y arêtes » (Y)', recalcule: LIAISONS.length, publie: mProse ? mProse[2] : 'phrase absente' });

  /* --- 4. place occupée et coût d'une question --- */
  const cp = [];
  const lA = ligne(txt, /^liste d'aretes/);
  const lAdj = ligne(txt, /^liste d'adjacence/);
  const lMat = ligne(txt, /^matrice\s+:/);
  cp.push({ quoi: "cases de la liste d'arêtes (2 m)", recalcule: 2 * LIAISONS.length, publie: lA ? nombres(lA)[0] : 'ligne absente' });
  cp.push({ quoi: "cases de la liste d'adjacence (somme des degrés)", recalcule: somme, publie: lAdj ? nombres(lAdj)[0] : 'ligne absente' });
  cp.push({ quoi: 'cases de la matrice (n²)', recalcule: n * n, publie: lMat ? nombres(lMat)[0] : 'ligne absente' });
  const lGare = ligne(txt, /^voisins de Gare, par la liste/);
  const voisinsGare = adj.get('Gare').slice().sort().join(', ');
  cp.push({ quoi: 'voisins de Gare', recalcule: voisinsGare,
    publie: lGare ? lGare.split(':')[1].trim().split(', ').sort().join(', ') : 'ligne absente' });
  const lCases = ligne(txt, /^cases lues pour cette reponse/);
  cp.push({ quoi: 'cases lues par la liste (degré de Gare)', recalcule: adj.get('Gare').length, publie: lCases ? nombres(lCases)[0] : 'ligne absente' });
  cp.push({ quoi: 'cases lues par la matrice (n)', recalcule: n, publie: lCases ? nombres(lCases)[1] : 'ligne absente' });
  const lNS = ligne(txt, /^liaison directe Nord-Sud/);
  cp.push({ quoi: 'M[Nord][Sud]', recalcule: M[0][7], publie: lNS ? nombres(lNS)[2] : 'ligne absente' });
  confronte(r, 'leçon 10 · degrés, lemme des poignées de main, place occupée et coût d’une question', cd.concat(cp));
}

/* ===================== LEÇON 10 · densité et coût des représentations ===================== */

function densite(r) {
  const txt = L.sortie(10, 'densite.txt');
  const prose = L.texte(10);
  const n = 1000;

  /* --- les tailles, qui sont de l'arithmétique et rien d'autre --- */
  const c1 = [];
  const lPaires = ligne(txt, /^n = 1000 sommets/);
  c1.push({ quoi: 'paires possibles n(n−1)/2', recalcule: n * (n - 1) / 2, publie: lPaires ? nombres(lPaires)[1] : 'ligne absente' });
  const lBits = ligne(txt, /matrice de bits\s+: n\*n \/ 8/);
  c1.push({ quoi: 'octets d’une matrice de bits (n²/8)', recalcule: n * n / 8, publie: lBits ? nombres(lBits).slice(-1)[0] : 'ligne absente' });
  const lU8 = ligne(txt, /matrice Uint8Array/);
  c1.push({ quoi: 'octets d’une matrice d’octets (n²)', recalcule: n * n, publie: lU8 ? nombres(lU8).slice(-1)[0] : 'ligne absente' });

  /* --- le tableau : liste = 8 m (m est la DONNÉE lue), et le gagnant se recalcule --- */
  const c2 = [];
  const DENSITES = ['0.001', '0.005', '0.01', '0.03', '0.05', '0.1', '0.25', '0.5'];
  for (const d of DENSITES) {
    const l = ligne(txt, new RegExp('^' + d.replace('.', '\\.') + '\\s+\\d'));
    if (!l) { c2.push({ quoi: 'ligne de densité ' + d, recalcule: 'présente', publie: 'ligne absente' }); continue; }
    const v = nombres(l).map(Number);
    const m = v[1];                                   /* le nombre d'arêtes : une donnée du tirage */
    const liste = 8 * m, uint8 = n * n, bits = n * n / 8;
    const noms = ['liste', 'Uint8', 'bits'], vals = [liste, uint8, bits];
    let meilleur = 0;
    for (let i = 1; i < 3; i++) if (vals[i] < vals[meilleur]) meilleur = i;
    c2.push({ quoi: 'densité ' + d + ' · octets de la liste (8 m avec m = ' + m + ')', recalcule: liste, publie: v[2] });
    c2.push({ quoi: 'densité ' + d + ' · octets Uint8', recalcule: uint8, publie: v[3] });
    c2.push({ quoi: 'densité ' + d + ' · octets en bits', recalcule: bits, publie: v[4] });
    c2.push({ quoi: 'densité ' + d + ' · la plus compacte', recalcule: noms[meilleur], publie: mots(l).slice(-1)[0] });
  }
  confronte(r, 'leçon 10 · densité : tailles, et les huit lignes du tableau dont le vainqueur est recalculé', c1.concat(c2));

  /* --- les seuils, résolus à la main : n²/8 = 8 m et m = d·n(n−1)/2 --- */
  const c3 = [];
  const seuilBits = n / (32 * (n - 1)) * 100;
  const seuilOctets = n / (4 * (n - 1)) * 100;
  const lSB = ligne(txt, /matrice de BITS devient plus compacte/);
  const lSU = ligne(txt, /matrice Uint8 devient plus compacte/);
  c3.push({ quoi: 'seuil de la matrice de bits, en %', recalcule: seuilBits.toFixed(3), publie: lSB ? nombres(lSB).slice(-1)[0] : 'ligne absente' });
  c3.push({ quoi: 'seuil de la matrice d’octets, en %', recalcule: seuilOctets.toFixed(3), publie: lSU ? nombres(lSU).slice(-1)[0] : 'ligne absente' });
  const mp1 = prose.match(/densité de bascule vaut n \/ \(32\( n −1\)\), c'est-à-dire ([\d, ]+) % pour n = 1 000/);
  c3.push({ quoi: 'prose : seuil bits', recalcule: L.frNombre(seuilBits, 3), publie: mp1 ? mp1[1].trim() : 'phrase absente' });
  const mp2 = prose.match(/Pour la matrice d'octets, le même calcul donne ([\d, ]+) %/);
  c3.push({ quoi: 'prose : seuil octets', recalcule: L.frNombre(seuilOctets, 3), publie: mp2 ? mp2[1].trim() : 'phrase absente' });

  /* --- la prose chiffre le basculement : ces deux octets valent 8 m --- */
  const c4 = [];
  const l003 = ligne(txt, /^0\.03\s/), l005 = ligne(txt, /^0\.05\s/);
  const m003 = l003 ? Number(nombres(l003)[1]) : null;
  const m005 = l005 ? Number(nombres(l005)[1]) : null;
  const mp3 = prose.match(/ligne 0,03 — ([\d ]+) octets pour la liste, contre ([\d ]+) pour la matrice de bits/);
  c4.push({ quoi: 'prose : octets de la liste à 0,03', recalcule: m003 === null ? 'arêtes introuvables' : L.frNombre(8 * m003), publie: mp3 ? mp3[1].trim() : 'phrase absente' });
  c4.push({ quoi: 'prose : octets de la matrice de bits', recalcule: L.frNombre(n * n / 8), publie: mp3 ? mp3[2].trim() : 'phrase absente' });
  const mp4 = prose.match(/la ligne 0,05, où le rapport s'inverse : ([\d ]+) contre ([\d ]+)/);
  c4.push({ quoi: 'prose : octets de la liste à 0,05', recalcule: m005 === null ? 'arêtes introuvables' : L.frNombre(8 * m005), publie: mp4 ? mp4[1].trim() : 'phrase absente' });
  c4.push({ quoi: 'prose : octets de la matrice de bits (bis)', recalcule: L.frNombre(n * n / 8), publie: mp4 ? mp4[2].trim() : 'phrase absente' });
  confronte(r, 'leçon 10 · densité : les deux seuils résolus algébriquement, et le point de bascule chiffré', c3.concat(c4));

  /* --- le facteur 218, et le réseau social --- */
  const c5 = [];
  const lBanc = ligne(txt, /^0\.25\s+249\.7|^0\.25\s+\d+\.\d\s+200000/);
  const lBanc2 = ligne(txt, /^0\.25\s.*200000/);
  const cible = lBanc2 || lBanc;
  if (!cible) c5.push({ quoi: 'ligne du banc à 25 % de densité', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const v = nombres(cible).map(Number);
    const casesM = v[2], casesL = v[3];
    c5.push({ quoi: 'rapport cases liste / cases matrice à 25 %', recalcule: 'x' + (casesL / casesM).toFixed(0), publie: mots(cible)[4] });
    const mp5 = prose.match(/un facteur (\d+)/);
    c5.push({ quoi: 'prose : « un facteur … »', recalcule: (casesL / casesM).toFixed(0), publie: mp5 ? mp5[1] : 'phrase absente' });
  }
  const N = 1e6, AMIS = 100, mSocial = N * AMIS / 2;
  const lGo = ligne(txt, /^matrice de bits\s+:/);
  const lMo = ligne(txt, /^liste d'adjacence :/);
  const lDens = ligne(txt, /^densite reelle/);
  c5.push({ quoi: 'matrice de bits pour 10⁶ personnes, en Go', recalcule: (N * N / 8 / 1e9).toFixed(0), publie: lGo ? nombres(lGo).slice(-1)[0] : 'ligne absente' });
  c5.push({ quoi: 'liste d’adjacence, en Mo', recalcule: (2 * mSocial * 4 / 1e6).toFixed(0), publie: lMo ? nombres(lMo).slice(-1)[0] : 'ligne absente' });
  c5.push({ quoi: 'densité réelle du réseau social, en %', recalcule: (mSocial / (N * (N - 1) / 2) * 100).toFixed(5), publie: lDens ? nombres(lDens).slice(-1)[0] : 'ligne absente' });
  confronte(r, 'leçon 10 · le facteur 218 et l’échelle du réseau social (125 Go contre 400 Mo)', c5);
}

/* ===================== LEÇON 10 · parcours en largeur et en profondeur ===================== */

function parcours(r) {
  const txt = L.sortie(10, 'parcours.txt');
  const prose = L.texte(10);
  const adj = adjacence(STATIONS, LIAISONS);

  /* La vérité : les distances par ÉNUMÉRATION de tous les chemins sans répétition. */
  const vrai = new Map(STATIONS.map(function (s) { return [s, distanceEnum(adj, 'Nord', s)]; }));

  /* --- le tableau station par station --- */
  const c1 = [], c2 = [];
  let profFausses = 0, profIncoherentes = [];
  let manque = 0;
  for (const s of STATIONS) {
    const l = ligne(txt, new RegExp('^' + s + '\\s+\\d'));
    if (!l) { manque++; continue; }
    const v = nombres(l).map(Number);
    c1.push({ quoi: s + ' · colonne « force brute »', recalcule: vrai.get(s), publie: v[2] });
    c1.push({ quoi: s + ' · colonne « largeur »', recalcule: vrai.get(s), publie: v[0] });
    /* La profondeur n'a pas à être juste ; elle doit être la longueur d'un chemin
       sans répétition réellement présent dans le graphe, et jamais plus courte. */
    if (v[1] !== vrai.get(s)) profFausses++;
    if (v[1] < vrai.get(s) || !existeCheminSimple(adj, 'Nord', s, v[1])) profIncoherentes.push(s + ' (' + v[1] + ')');
  }
  if (manque) introuvable(r, 'leçon 10 · parcours : le tableau des huit stations', manque + ' ligne(s) du tableau de parcours.txt');
  else confronte(r, 'leçon 10 · parcours : les huit distances, énumérées chemin par chemin', c1);

  const lFausses = ligne(txt, /^distances fausses/);
  c2.push({ quoi: 'distances fausses en largeur', recalcule: 0, publie: lFausses ? nombres(lFausses)[0] : 'ligne absente' });
  c2.push({ quoi: 'distances fausses en profondeur (recomptées face à la vérité)', recalcule: profFausses, publie: lFausses ? nombres(lFausses)[1] : 'ligne absente' });
  c2.push({ quoi: 'stations sur ' + STATIONS.length, recalcule: STATIONS.length, publie: lFausses ? nombres(lFausses)[2] : 'ligne absente' });
  c2.push({ quoi: 'profondeurs qui ne sont la longueur d’aucun chemin simple', recalcule: '', publie: profIncoherentes.join(' ') });
  const mp = prose.match(/Le parcours en profondeur se trompe (\d+) fois sur (\d+)/);
  c2.push({ quoi: 'prose : « se trompe X fois sur Y » (X)', recalcule: profFausses, publie: mp ? mp[1] : 'phrase absente' });
  c2.push({ quoi: 'prose : « se trompe X fois sur Y » (Y)', recalcule: STATIONS.length, publie: mp ? mp[2] : 'phrase absente' });

  /* --- les deux ordres publiés sont-ils des ordres de découverte possibles ? --- */
  const c3 = [];
  ['largeur', 'profondeur'].forEach(function (nom) {
    const l = ligne(txt, new RegExp('^' + nom + '\\s*:'));
    if (!l) { c3.push({ quoi: 'ordre ' + nom, recalcule: 'présent', publie: 'ligne absente' }); return; }
    const ordre = l.split(':')[1].trim().split(' > ');
    c3.push({ quoi: 'ordre ' + nom + ' : permutation des stations', recalcule: STATIONS.slice().sort().join(','), publie: ordre.slice().sort().join(',') });
    /* Tout ordre de découverte a cette propriété : chaque sommet, sauf le premier,
       touche un sommet déjà sorti. On la vérifie sur le graphe, pas sur le code. */
    let orphelins = [];
    ordre.forEach(function (s, i) {
      if (i === 0) return;
      const avant = ordre.slice(0, i);
      if (!adj.get(s).some(function (v) { return avant.indexOf(v) !== -1; })) orphelins.push(s);
    });
    c3.push({ quoi: 'ordre ' + nom + ' : sommets découverts sans voisin déjà vu', recalcule: '', publie: orphelins.join(' ') });
  });
  /* Propriété qui n'appartient QU'À la largeur : les distances vraies ne décroissent jamais. */
  const lL = ligne(txt, /^largeur\s*:/);
  if (lL) {
    const ordre = lL.split(':')[1].trim().split(' > ');
    let decroit = [];
    for (let i = 1; i < ordre.length; i++) if (vrai.get(ordre[i]) < vrai.get(ordre[i - 1])) decroit.push(ordre[i]);
    c3.push({ quoi: 'ordre largeur : distances qui reculent', recalcule: '', publie: decroit.join(' ') });
  }
  confronte(r, 'leçon 10 · parcours : la profondeur se trompe trois fois, et les deux ordres publiés restent valides', c2.concat(c3));

  /* --- le chemin Nord → Fac --- */
  const c4 = [];
  const lCh = ligne(txt, /^chemin Nord -> Fac/);
  if (!lCh) c4.push({ quoi: 'ligne du chemin Nord → Fac', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const route = lCh.split(':')[1].split('(')[0].trim().split(' > ');
    let arcsFaux = [];
    for (let i = 0; i + 1 < route.length; i++) if (adj.get(route[i]).indexOf(route[i + 1]) === -1) arcsFaux.push(route[i] + '-' + route[i + 1]);
    c4.push({ quoi: 'arêtes inexistantes dans le chemin publié', recalcule: '', publie: arcsFaux.join(' ') });
    c4.push({ quoi: 'longueur du chemin publié = distance vraie', recalcule: vrai.get('Fac'), publie: route.length - 1 });
    c4.push({ quoi: 'nombre d’arêtes annoncé entre parenthèses', recalcule: vrai.get('Fac'), publie: nombres(lCh.split('(')[1])[0] });
  }

  /* --- le banc de 200 graphes : seul le rapport est recalculable sans le tirage --- */
  const c5 = [];
  const lS = ligne(txt, /sommets atteignables/);
  const lP = ligne(txt, /distances de la profondeur differentes/);
  if (!lS || !lP) c5.push({ quoi: 'lignes du banc de 200 graphes', recalcule: 'présentes', publie: 'ligne(s) absente(s)' });
  else {
    const total = Number(nombres(lS)[1]);
    const faux = Number(nombres(lP)[0]);
    c5.push({ quoi: 'taux d’erreur de la profondeur, refait à la main', recalcule: (faux / total * 100).toFixed(1), publie: nombres(lP)[1] });
    const mpr = prose.match(/le parcours en profondeur ([\d ]+) fois , soit ([\d,]+) %/);
    c5.push({ quoi: 'prose : erreurs de la profondeur', recalcule: L.frNombre(faux), publie: mpr ? mpr[1].trim() : 'phrase absente' });
    c5.push({ quoi: 'prose : taux', recalcule: L.frNombre(faux / total * 100, 1), publie: mpr ? mpr[2] : 'phrase absente' });
  }
  confronte(r, 'leçon 10 · parcours : le chemin Nord → Fac, et le taux de 68,3 % refait depuis les comptes publiés', c4.concat(c5));
}

/* ===================== LEÇON 10 · Dijkstra, jugé par Bellman-Ford ===================== */

const VILLES = ['Lyon', 'Macon', 'Dijon', 'Besancon', 'Geneve', 'Chambery', 'Grenoble', 'Valence'];
const ROUTES = [
  ['Lyon', 'Macon', 60], ['Macon', 'Dijon', 75], ['Dijon', 'Besancon', 65],
  ['Lyon', 'Geneve', 110], ['Geneve', 'Besancon', 145], ['Lyon', 'Chambery', 75],
  ['Chambery', 'Geneve', 65], ['Chambery', 'Grenoble', 45], ['Lyon', 'Valence', 65],
  ['Valence', 'Grenoble', 70], ['Lyon', 'Grenoble', 80],
];

function dijkstra(r) {
  const txt = L.sortie(10, 'dijkstra.txt');
  const prose = L.texte(10);

  const adjP = new Map(VILLES.map(function (v) { return [v, []]; }));
  for (const t of ROUTES) { adjP.get(t[0]).push([t[1], t[2]]); adjP.get(t[1]).push([t[0], t[2]]); }

  /* Référence n° 1 : Bellman-Ford, qui ne ferme jamais un sommet. */
  const bf = bellmanFord(VILLES, ROUTES, 'Lyon');
  /* Référence n° 2 : tous les chemins sans répétition, énumérés. */
  const tousChemins = new Map(VILLES.map(function (v) { return [v, cheminsPonderes(adjP, 'Lyon', v)]; }));

  /* --- les sept destinations --- */
  const c1 = [];
  let sommeMinutes = 0, sommeLargeur = 0, manque = 0;
  for (const v of VILLES) {
    if (v === 'Lyon') continue;
    const l = ligne(txt, new RegExp('^' + v + '\\s+\\d'));
    if (!l) { manque++; continue; }
    const p = nombres(l).map(Number);              /* etapes, minutes(largeur), minutes(Dijkstra), force brute */
    const chemins = tousChemins.get(v);
    const minAretes = Math.min.apply(null, chemins.map(function (c) { return c.aretes; }));
    const minEnum = Math.min.apply(null, chemins.map(function (c) { return c.duree; }));
    const dureesMinAretes = chemins.filter(function (c) { return c.aretes === minAretes; })
      .map(function (c) { return c.duree; });
    c1.push({ quoi: v + ' · minutes par Bellman-Ford', recalcule: bf.get(v), publie: p[2] });
    c1.push({ quoi: v + ' · minutes par énumération complète', recalcule: minEnum, publie: p[3] });
    c1.push({ quoi: v + ' · étapes minimales (énumérées)', recalcule: minAretes, publie: p[0] });
    c1.push({ quoi: v + ' · minutes du trajet en moins d’étapes',
      recalcule: dureesMinAretes.indexOf(p[1]) !== -1 ? p[1] : 'une des durées ' + dureesMinAretes.join('/'), publie: p[1] });
    sommeMinutes += bf.get(v);
    sommeLargeur += p[1];
  }
  if (manque) introuvable(r, 'leçon 10 · Dijkstra : le tableau des sept destinations', manque + ' ligne(s) du tableau de dijkstra.txt');
  else confronte(r, 'leçon 10 · Dijkstra : les sept distances, refaites par Bellman-Ford et par énumération', c1);

  /* --- l'ordre de fermeture : totaux croissants, valeurs = distances vraies --- */
  const c2 = [];
  const lO = ligne(txt, /^\s+Lyon\(0\)/);
  if (!lO) c2.push({ quoi: 'ligne de l’ordre de fermeture', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const publie = lO.trim().split(' > ').map(function (x) {
      const m = x.match(/^(\w+)\((\d+)\)$/);
      return m ? { ville: m[1], total: Number(m[2]) } : { ville: x, total: NaN };
    });
    /* Dijkstra ferme dans l'ordre croissant des totaux ; ici tous distincts, donc
       l'ordre est entièrement déterminé par les distances — que Bellman-Ford donne. */
    const attendu = VILLES.slice().sort(function (a, b) { return bf.get(a) - bf.get(b); });
    c2.push({ quoi: 'ordre de fermeture', recalcule: attendu.join(' > '), publie: publie.map(function (p) { return p.ville; }).join(' > ') });
    publie.forEach(function (p) {
      c2.push({ quoi: 'total affiché pour ' + p.ville, recalcule: bf.get(p.ville), publie: p.total });
    });
  }

  /* --- les totaux, et les 55 minutes perdues --- */
  const c3 = [];
  const lT = ligne(txt, /^total des durees/);
  if (!lT) c3.push({ quoi: 'ligne des totaux', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const v = nombres(lT).map(Number);
    c3.push({ quoi: 'total en minutes des trajets Dijkstra (somme de Bellman-Ford)', recalcule: sommeMinutes, publie: v[1] });
    c3.push({ quoi: 'total du trajet en moins d’étapes', recalcule: sommeLargeur, publie: v[0] });
    c3.push({ quoi: 'écart', recalcule: sommeLargeur - sommeMinutes, publie: v[2] });
  }
  const lEx = ligne(txt, /^\s+moins de temps : /);
  const lEx2 = ligne(txt, /^\s+moins d etapes : /);
  if (lEx && lEx2) {
    const min1 = Number(nombres(lEx2)[0]), min2 = Number(nombres(lEx)[0]);
    c3.push({ quoi: 'Lyon → Besançon, le plus rapide', recalcule: bf.get('Besancon'), publie: min2 });
    c3.push({ quoi: 'Lyon → Besançon, différence des deux trajets', recalcule: min1 - min2, publie: sommeLargeur - sommeMinutes });
    const mpb = prose.match(/(\d+) minutes en 2 étapes contre (\d+) minutes en 3 étapes/);
    c3.push({ quoi: 'prose : le trajet le plus rapide', recalcule: bf.get('Besancon'), publie: mpb ? mpb[2] : 'phrase absente' });
  }
  confronte(r, 'leçon 10 · Dijkstra : ordre de fermeture croissant, 725 minutes contre 780, 55 perdues', c2.concat(c3));

  /* --- le contre-exemple à poids négatif : la vérité par énumération --- */
  const c4 = [];
  const ARCS = { 0: [[1, 1], [2, 5]], 1: [], 2: [[1, -10]] };   /* donnée : le graphe orienté publié */
  let best = Infinity;
  (function marche(s, cout, vus) {
    if (s === 1 && vus.size > 1) { if (cout < best) best = cout; return; }
    for (const a of ARCS[s]) if (!vus.has(a[0])) { vus.add(a[0]); marche(a[0], cout + a[1], vus); vus.delete(a[0]); }
  })(0, 0, new Set([0]));
  const lD = ligne(txt, /^Dijkstra annonce/);
  const lV = ligne(txt, /^la verite \(tous les chemins\)/);
  const lE = ligne(txt, /^ecart :/);
  c4.push({ quoi: 'plus court chemin 0 → 1, par énumération de tous les chemins', recalcule: best, publie: lV ? nombres(lV)[0] : 'ligne absente' });
  if (lD && lE) {
    const annonce = Number(nombres(lD).slice(-1)[0]);
    c4.push({ quoi: 'écart entre l’annonce publiée (' + annonce + ') et la vérité', recalcule: annonce - best, publie: nombres(lE)[0] });
    c4.push({ quoi: 'Dijkstra se trompe-t-il ?', recalcule: annonce !== best ? 'oui' : 'non', publie: /SE TROMPE/.test(lE) ? 'oui' : 'non' });
  } else {
    c4.push({ quoi: 'lignes du contre-exemple', recalcule: 'présentes', publie: 'ligne(s) absente(s)' });
  }
  const mpn = prose.match(/la vraie réponse est −(\d+) , par 0 → 2 → 1. L'écart est de (\d+)/);
  c4.push({ quoi: 'prose : la vraie réponse', recalcule: String(best), publie: mpn ? '-' + mpn[1] : 'phrase absente' });
  confronte(r, 'leçon 10 · Dijkstra : le contre-exemple à poids négatif, arbitré par énumération', c4);
}

/* ===================== LEÇON 10 · dépendances, tri topologique, cycles ===================== */

/* DONNÉE recopiée : ce que chaque paquet exige AVANT lui. */
const DEPENDANCES = {
  'app': ['ui', 'api'],
  'ui': ['moteur-rendu', 'utils'],
  'api': ['http', 'utils'],
  'http': ['sockets'],
  'moteur-rendu': ['utils'],
  'rapport': ['app'],
  'sockets': [],
  'utils': [],
};

/* Les paquets qu'aucun ordre d'installation ne peut atteindre : ceux qui dépendent,
   directement ou non, d'un paquet qui se redemande lui-même. Aucun compteur de
   degré entrant ici — uniquement de l'accessibilité, énumérée. */
function bloques(dep) {
  const noms = Object.keys(dep);
  const succ = function (p) { return dep[p]; };
  const atteint = {};
  noms.forEach(function (p) { atteint[p] = atteintsEnum(succ, p); });
  const surUnCycle = noms.filter(function (p) { return atteint[p].has(p); });
  return noms.filter(function (p) {
    return surUnCycle.indexOf(p) !== -1 || surUnCycle.some(function (q) { return atteint[p].has(q); });
  });
}

/* Tous les cycles élémentaires d'un graphe orienté, chacun une fois : on n'autorise
   comme départ que le plus petit nom du cycle. */
function cyclesElementaires(dep) {
  const noms = Object.keys(dep);
  const out = [];
  noms.forEach(function (depart, rang) {
    const chemin = [depart], dans = new Set([depart]);
    (function marche(p) {
      for (const q of dep[p]) {
        if (q === depart) { out.push(chemin.slice()); continue; }
        if (dans.has(q) || noms.indexOf(q) < rang) continue;
        dans.add(q); chemin.push(q);
        marche(q);
        chemin.pop(); dans.delete(q);
      }
    })(depart);
  });
  return out;
}

function dependances(r) {
  const txt = L.sortie(10, 'dependances.txt');
  const prose = L.texte(10);
  const paquets = Object.keys(DEPENDANCES);
  const arcs = [];
  paquets.forEach(function (p) { DEPENDANCES[p].forEach(function (d) { arcs.push([p, d]); }); });

  /* --- taille, ordre publié, et son contrôle arc par arc --- */
  const c1 = [];
  const lP = ligne(txt, /^paquets :/);
  c1.push({ quoi: 'paquets', recalcule: paquets.length, publie: lP ? nombres(lP)[0] : 'ligne absente' });
  const lV = ligne(txt, /^dependances verifiees/);
  c1.push({ quoi: 'dépendances déclarées (comptées dans la donnée)', recalcule: arcs.length, publie: lV ? nombres(lV)[0] : 'ligne absente' });
  const lO = ligne(txt, /^ordre d.installation :/);
  if (!lO) c1.push({ quoi: 'ordre publié', recalcule: 'présent', publie: 'ligne absente' });
  else {
    const ordre = lO.split(':')[1].trim().split(' > ');
    const rang = new Map(ordre.map(function (p, i) { return [p, i]; }));
    const violations = arcs.filter(function (a) { return !(rang.get(a[1]) < rang.get(a[0])); });
    c1.push({ quoi: 'ordre publié : paquets couverts', recalcule: paquets.slice().sort().join(','), publie: ordre.slice().sort().join(',') });
    c1.push({ quoi: 'dépendances arrivant APRÈS celui qui les exige', recalcule: '', publie: violations.map(function (a) { return a[1] + ' avant ' + a[0]; }).join(' ') });
    c1.push({ quoi: 'violations annoncées', recalcule: violations.length, publie: lV ? nombres(lV)[1] : 'ligne absente' });
  }
  confronte(r, 'leçon 10 · dépendances : l ordre publié est bien un ordre valide, arc par arc', c1);

  /* --- combien d'ordres valides ? On énumère les 8! permutations. --- */
  const c2 = [];
  let valides = 0;
  const perms = permutations(paquets);
  for (const p of perms) {
    const rang = new Map(p.map(function (x, i) { return [x, i]; }));
    if (arcs.every(function (a) { return rang.get(a[1]) < rang.get(a[0]); })) valides++;
  }
  const fact = paquets.reduce(function (f, _, i) { return f * (i + 1); }, 1);
  const lOrdres = ligne(txt, /^ordres d.installation valides/);
  const lFact = ligne(txt, /^ordres possibles si on ignorait/);
  c2.push({ quoi: 'permutations énumérées', recalcule: fact, publie: perms.length });
  c2.push({ quoi: 'ordres valides (force brute sur les 40 320 permutations)', recalcule: valides, publie: lOrdres ? nombres(lOrdres)[0] : 'ligne absente' });
  c2.push({ quoi: 'ordres sans contrainte (8!)', recalcule: fact, publie: lFact ? nombres(lFact).slice(-1)[0] : 'ligne absente' });
  const mpo = prose.match(/L.énumération complète en trouve (\d+) , à comparer aux ([\d ]+) ordres/);
  c2.push({ quoi: 'prose : ordres valides', recalcule: valides, publie: mpo ? mpo[1] : 'phrase absente' });
  c2.push({ quoi: 'prose : ordres sans contrainte', recalcule: L.frNombre(fact), publie: mpo ? mpo[2].trim() : 'phrase absente' });
  confronte(r, 'leçon 10 · dépendances : 19 ordres valides, comptés sur les 40 320 permutations', c2);

  /* --- le cycle ajouté : qui reste bloqué, et pourquoi --- */
  const casse = {};
  paquets.forEach(function (p) { casse[p] = DEPENDANCES[p].slice(); });
  casse['utils'] = ['app'];

  const c3 = [];
  const bloq = bloques(casse).slice().sort();
  const installables = paquets.filter(function (p) { return bloq.indexOf(p) === -1; }).sort();
  const lB = ligne(txt, /^bloques   :/);
  const lI = ligne(txt, /^installes :/);
  c3.push({ quoi: 'paquets bloqués (par accessibilité vers un cycle)', recalcule: bloq.join(','),
    publie: lB ? lB.split(':')[1].split('(')[0].trim().split(', ').sort().join(',') : 'ligne absente' });
  c3.push({ quoi: 'nombre de bloqués', recalcule: bloq.length, publie: lB ? nombres(lB)[0] : 'ligne absente' });
  c3.push({ quoi: 'paquets installables', recalcule: installables.join(','),
    publie: lI ? lI.split(':')[1].trim().split(' > ').sort().join(',') : 'ligne absente' });
  const lTot = ligne(txt, /^total bloque :/);
  c3.push({ quoi: 'total bloqué sur paquets', recalcule: bloq.length + ' sur ' + paquets.length,
    publie: lTot ? nombres(lTot)[0] + ' sur ' + nombres(lTot)[1] : 'ligne absente' });
  const mpb = prose.match(/l.installation s.arrête après (\d+) paquets : (\d+) paquets sur (\d+) restent bloqués/);
  c3.push({ quoi: 'prose : paquets installés', recalcule: installables.length, publie: mpb ? mpb[1] : 'phrase absente' });
  c3.push({ quoi: 'prose : paquets bloqués', recalcule: bloq.length, publie: mpb ? mpb[2] : 'phrase absente' });
  c3.push({ quoi: 'prose : sur combien', recalcule: paquets.length, publie: mpb ? mpb[3] : 'phrase absente' });
  confronte(r, 'leçon 10 · dépendances : le cycle bloque 6 paquets sur 8, recomptés par accessibilité', c3);

  /* --- les cycles élémentaires, leurs arêtes, et celles qui débloquent --- */
  const c4 = [];
  const cycles = cyclesElementaires(casse);
  const lC = ligne(txt, /^cycles elementaires trouves/);
  c4.push({ quoi: 'cycles élémentaires (énumérés)', recalcule: cycles.length, publie: lC ? nombres(lC)[0] : 'ligne absente' });
  const lignesCycles = lignes(txt).filter(function (l) { return / -> .* \(\d+ aretes\)$/.test(l); });
  const recalcules = cycles.map(function (c) { return c.concat([c[0]]).join(' -> ') + ' [' + c.length + ']'; }).sort();
  const lus = lignesCycles.map(function (l) { return l.trim().split('   (')[0] + ' [' + nombres(l).slice(-1)[0] + ']'; }).sort();
  c4.push({ quoi: 'les cycles eux-mêmes, avec leur longueur', recalcule: recalcules.join(' | '), publie: lus.join(' | ') });
  const aretesCycle = [];
  cycles.forEach(function (c) {
    const boucle = c.concat([c[0]]);
    for (let i = 0; i + 1 < boucle.length; i++) {
      const cle = boucle[i] + ' -> ' + boucle[i + 1];
      if (aretesCycle.indexOf(cle) === -1) aretesCycle.push(cle);
    }
  });
  const liberatrices = aretesCycle.filter(function (cle) {
    const a = cle.split(' -> ')[0], b = cle.split(' -> ')[1];
    const d = {};
    Object.keys(casse).forEach(function (p) { d[p] = casse[p].filter(function (x) { return !(p === a && x === b); }); });
    return bloques(d).length === 0;
  });
  const lAr = ligne(txt, /^aretes impliquees dans un cycle/);
  const lLib = ligne(txt, /^aretes qui, a elles seules, debloquent tout/);
  c4.push({ quoi: 'arêtes impliquées dans un cycle', recalcule: aretesCycle.length, publie: lAr ? nombres(lAr)[0] : 'ligne absente' });
  c4.push({ quoi: 'arêtes libératrices', recalcule: liberatrices.length, publie: lLib ? nombres(lLib)[0] : 'ligne absente' });
  c4.push({ quoi: 'laquelle', recalcule: liberatrices.join(' , '), publie: lLib ? lLib.slice(lLib.indexOf('->') + 2).trim() : 'ligne absente' });

  /* --- dans un cycle, ou seulement bloqué par lui --- */
  const c5 = [];
  const succ = function (p) { return casse[p]; };
  const dansCycle = Object.keys(casse).filter(function (p) { return atteintsEnum(succ, p).has(p); }).sort();
  const horsCycle = bloq.filter(function (p) { return dansCycle.indexOf(p) === -1; }).sort();
  const lDans = ligne(txt, /^paquets DANS un cycle/);
  const lHors = ligne(txt, /^paquets bloques SANS y etre/);
  c5.push({ quoi: 'paquets sur un cycle (chacun se réatteint lui-même)', recalcule: dansCycle.join(','),
    publie: lDans ? lDans.split(':')[1].split('(')[0].trim().split(', ').sort().join(',') : 'ligne absente' });
  c5.push({ quoi: 'combien', recalcule: dansCycle.length, publie: lDans ? nombres(lDans).slice(-1)[0] : 'ligne absente' });
  c5.push({ quoi: 'bloqués sans être dans un cycle', recalcule: horsCycle.join(','),
    publie: lHors ? lHors.split(':')[1].split('(')[0].trim().split(', ').sort().join(',') : 'ligne absente' });
  c5.push({ quoi: 'combien', recalcule: horsCycle.length, publie: lHors ? nombres(lHors).slice(-1)[0] : 'ligne absente' });
  confronte(r, 'leçon 10 · dépendances : trois cycles, sept arêtes, une libératrice, cinq paquets pris dedans', c4.concat(c5));
}

/* ===================== LEÇON 10 · l'effet petit monde ===================== */

/* Sur un anneau régulier de n personnes reliées à leurs k plus proches voisines,
   la distance a une forme CLOSE : pour aller de 0 à j, on avance de k/2 crans par
   pas, donc d = ceil(min(j, n−j) / (k/2)). Aucun parcours n'est nécessaire — c'est
   exactement le point : la référence ne partage rien avec le programme publié. */
function anneauMesures(n, k) {
  const pas = k / 2;
  let somme = 0, diametre = 0;
  for (let j = 1; j < n; j++) {
    const d = Math.ceil(Math.min(j, n - j) / pas);
    somme += d;
    if (d > diametre) diametre = d;
  }
  return { aretes: n * k / 2, moyenne: somme / (n - 1), diametre: diametre };
}

function petitMonde(r) {
  const txt = L.sortie(10, 'petit-monde.txt');
  const prose = L.texte(10);
  const n = 1000;
  const base = anneauMesures(n, 6), dense = anneauMesures(n, 10);

  const c1 = [];
  const lB = ligne(txt, /^\s+aretes 3000 , distance moyenne|^\s+aretes \d+ , distance moyenne/);
  if (!lB) c1.push({ quoi: 'ligne de l’anneau à 6 relations', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const v = nombres(lB);
    c1.push({ quoi: 'arêtes de l’anneau 1000 × 6 (n k / 2)', recalcule: base.aretes, publie: v[0] });
    c1.push({ quoi: 'distance moyenne (forme close)', recalcule: base.moyenne.toFixed(2), publie: v[1] });
    c1.push({ quoi: 'diamètre (forme close)', recalcule: base.diametre, publie: v[2] });
  }
  const lPremiere = ligne(txt, /^0 {24,}0 {6,}3000/);
  const l0 = ligne(txt, /^0\s+0\s+3000\s/);
  const ligne0 = l0 || lPremiere;
  if (ligne0) {
    const v = nombres(ligne0);
    c1.push({ quoi: 'ligne « part recâblée 0 » du tableau : arêtes', recalcule: base.aretes, publie: v[2] });
    c1.push({ quoi: 'ligne « part recâblée 0 » : distance moyenne', recalcule: base.moyenne.toFixed(2), publie: v[3] });
    c1.push({ quoi: 'ligne « part recâblée 0 » : diamètre', recalcule: base.diametre, publie: v[4] });
  } else {
    c1.push({ quoi: 'ligne « part recâblée 0 »', recalcule: 'présente', publie: 'ligne absente' });
  }
  const mp1 = prose.match(/une distance moyenne de ([\d,]+) et un diamètre de (\d+)/);
  c1.push({ quoi: 'prose : distance moyenne du village', recalcule: L.frNombre(base.moyenne, 2), publie: mp1 ? mp1[1] : 'phrase absente' });
  c1.push({ quoi: 'prose : diamètre du village', recalcule: String(base.diametre), publie: mp1 ? mp1[2] : 'phrase absente' });
  confronte(r, 'leçon 10 · petit monde : l’anneau de 1 000 personnes, mesuré par forme close', c1);

  const c2 = [];
  const lD = ligne(txt, /^\s+aretes 5000 , distance moyenne|^a titre de comparaison/);
  const lDense = lignes(txt)[lignes(txt).findIndex(function (l) { return /^a titre de comparaison/.test(l); }) + 1];
  if (!lDense) c2.push({ quoi: 'ligne de l’anneau à 10 relations', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const v = nombres(lDense);
    c2.push({ quoi: 'arêtes de l’anneau 1000 × 10', recalcule: dense.aretes, publie: v[0] });
    c2.push({ quoi: 'distance moyenne (forme close)', recalcule: dense.moyenne.toFixed(2), publie: v[1] });
    c2.push({ quoi: 'diamètre (forme close)', recalcule: dense.diametre, publie: v[2] });
  }
  const lRes = ligne(txt, /aretes DEPLACEES font mieux que/);
  c2.push({ quoi: 'arêtes ajoutées par le passage de 6 à 10 relations', recalcule: dense.aretes - base.aretes,
    publie: lRes ? nombres(lRes).slice(-1)[0] : 'ligne absente' });
  const lPct = ligne(txt, /a titre de comparaison/);
  c2.push({ quoi: 'surcroît d’arêtes, en %', recalcule: ((dense.aretes - base.aretes) / base.aretes * 100).toFixed(0),
    publie: lPct ? nombres(lPct)[1] : 'ligne absente' });
  const mp2 = prose.match(/soit ([\d ]+) arêtes en plus , (\d+) % de plus — descend seulement à une distance moyenne de ([\d,]+) et un diamètre de (\d+)/);
  c2.push({ quoi: 'prose : arêtes en plus', recalcule: L.frNombre(dense.aretes - base.aretes), publie: mp2 ? mp2[1].trim() : 'phrase absente' });
  c2.push({ quoi: 'prose : pourcentage en plus', recalcule: ((dense.aretes - base.aretes) / base.aretes * 100).toFixed(0), publie: mp2 ? mp2[2] : 'phrase absente' });
  c2.push({ quoi: 'prose : distance moyenne de l’anneau dense', recalcule: L.frNombre(dense.moyenne, 2), publie: mp2 ? mp2[3] : 'phrase absente' });
  c2.push({ quoi: 'prose : diamètre de l’anneau dense', recalcule: String(dense.diametre), publie: mp2 ? mp2[4] : 'phrase absente' });
  confronte(r, 'leçon 10 · petit monde : l’anneau à dix relations, et les « 67 % d’arêtes en plus »', c2);
}

/* ===================== LEÇON 10 · les trois exercices ===================== */

function exercices10(r) {
  const prose = L.texte(10);

  /* --- exercice 1 : les composantes connexes du parc --- */
  const MACHINES = ['srv1', 'srv2', 'srv3', 'srv4', 'bdd1', 'bdd2', 'bdd3',
    'cache1', 'cache2', 'cache3', 'cache4', 'relais1', 'relais2', 'sonde'];
  const CABLES = [
    ['srv1', 'srv2'], ['srv2', 'srv3'], ['srv3', 'srv1'], ['srv3', 'srv4'],
    ['bdd1', 'bdd2'], ['bdd2', 'bdd3'],
    ['cache1', 'cache2'], ['cache2', 'cache3'], ['cache3', 'cache4'], ['cache4', 'cache1'],
    ['relais1', 'relais2'],
  ];
  const txt1 = L.sortie(10, 'solution-1.txt');
  const adj1 = adjacence(MACHINES, CABLES);
  /* Composantes par ACCESSIBILITÉ énumérée : deux machines sont ensemble s il existe
     un chemin de l une à l autre — ce qui se décide chemin par chemin. */
  const groupes = [];
  MACHINES.forEach(function (m) {
    const dedans = MACHINES.filter(function (x) { return x === m || distanceEnum(adj1, m, x) < Infinity; });
    const cle = dedans.slice().sort().join(',');
    if (groupes.indexOf(cle) === -1) groupes.push(cle);
  });
  const c1 = [];
  const lignesComp = lignes(txt1).filter(function (l) { return /^composante \d/.test(l); });
  c1.push({ quoi: 'composantes connexes', recalcule: groupes.length, publie: lignesComp.length });
  const derniere = lignes(txt1).filter(function (l) { return l.trim().length > 0; }).slice(-1)[0];
  c1.push({ quoi: 'réponse seule en dernière ligne', recalcule: groupes.length, publie: derniere ? derniere.trim() : 'ligne absente' });
  const tailles = groupes.map(function (g) { return g.split(',').length; }).sort(function (a, b) { return a - b; }).join(',');
  const taillesPubliees = lignesComp.map(function (l) { return Number(nombres(l)[1]); }).sort(function (a, b) { return a - b; }).join(',');
  c1.push({ quoi: 'tailles des composantes', recalcule: tailles, publie: taillesPubliees });
  const vusParAretes = new Set();
  CABLES.forEach(function (e) { vusParAretes.add(e[0]); vusParAretes.add(e[1]); });
  const lVus = ligne(txt1, /^sommets vus si on ne lit que les aretes/);
  c1.push({ quoi: 'machines apparaissant dans un câble', recalcule: vusParAretes.size, publie: lVus ? nombres(lVus)[0] : 'ligne absente' });
  c1.push({ quoi: 'machines du parc', recalcule: MACHINES.length, publie: lVus ? nombres(lVus)[1] : 'ligne absente' });
  c1.push({ quoi: 'machines oubliées', recalcule: MACHINES.length - vusParAretes.size, publie: lVus ? nombres(lVus)[2] : 'ligne absente' });
  const mp1 = prose.match(/on ne voit que (\d+) machines sur (\d+) , et on compte (\d+) composantes au lieu de (\d+)/);
  c1.push({ quoi: 'prose : machines vues', recalcule: vusParAretes.size, publie: mp1 ? mp1[1] : 'phrase absente' });
  c1.push({ quoi: 'prose : composantes vues à tort', recalcule: groupes.length - 1, publie: mp1 ? mp1[3] : 'phrase absente' });
  c1.push({ quoi: 'prose : composantes réelles', recalcule: groupes.length, publie: mp1 ? mp1[4] : 'phrase absente' });
  confronte(r, 'leçon 10 · exercice 1 : cinq composantes, dont la sonde que les arêtes seules oublient', c1);

  /* --- exercice 2 : bipartition, jugée par l’existence d’un cycle impair --- */
  const TACHES = ['import', 'export', 'index', 'sauvegarde', 'rapport', 'purge'];
  const CONFLITS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]];
  const txt2 = L.sortie(10, 'solution-2.txt');
  function longueursCycles(aretes, n) {
    const voisins = Array.from({ length: n }, function () { return []; });
    aretes.forEach(function (e) { voisins[e[0]].push(e[1]); voisins[e[1]].push(e[0]); });
    const trouvees = new Set();
    for (let d = 0; d < n; d++) {
      const dans = new Array(n).fill(false);
      (function marche(s, longueur) {
        dans[s] = true;
        for (const v of voisins[s]) {
          if (v === d && longueur >= 2) trouvees.add(longueur + 1);
          else if (!dans[v] && v > d) marche(v, longueur + 1);
        }
        dans[s] = false;
      })(d, 0);
    }
    return Array.from(trouvees).sort(function (a, b) { return a - b; });
  }
  const c2 = [];
  const avant = longueursCycles(CONFLITS, 6);
  const CONFLITS2 = CONFLITS.concat([[0, 2]]);
  const apres = longueursCycles(CONFLITS2, 6);
  const lAvant = ligne(txt2, /^longueurs de cycles AVANT/);
  const lApres = ligne(txt2, /^longueurs de cycles APRES/);
  c2.push({ quoi: 'longueurs de cycles avant', recalcule: avant.join(', '), publie: lAvant ? lAvant.split(':')[1].trim() : 'ligne absente' });
  c2.push({ quoi: 'longueurs de cycles après', recalcule: apres.join(', '), publie: lApres ? lApres.split(':')[1].split('   ')[0].trim() : 'ligne absente' });
  /* Biparti si et seulement si aucun cycle impair : le critère, appliqué à
     l’ÉNUMÉRATION des cycles, sans jamais colorier quoi que ce soit. */
  const bipAvant = avant.every(function (x) { return x % 2 === 0; });
  const bipApres = apres.every(function (x) { return x % 2 === 0; });
  const lBip = ligne(txt2, /^biparti : /);
  const lBip2 = ligne(txt2, /^biparti : .*aretes fautives/);
  c2.push({ quoi: 'biparti avant', recalcule: bipAvant ? 'oui' : 'non', publie: lBip ? lBip.split(':')[1].trim() : 'ligne absente' });
  c2.push({ quoi: 'biparti après', recalcule: bipApres ? 'oui' : 'non', publie: lBip2 ? lBip2.split(':')[1].split(',')[0].trim() : 'ligne absente' });
  const lA = ligne(txt2, /^machine A :/), lBm = ligne(txt2, /^machine B :/);
  if (lA && lBm) {
    const A = lA.split(':')[1].trim().split(', '), B = lBm.split(':')[1].trim().split(', ');
    const cote = {};
    A.forEach(function (t) { cote[t] = 'A'; });
    B.forEach(function (t) { cote[t] = 'B'; });
    const mal = CONFLITS.filter(function (e) { return cote[TACHES[e[0]]] === cote[TACHES[e[1]]]; });
    c2.push({ quoi: 'tâches réparties', recalcule: TACHES.slice().sort().join(','), publie: A.concat(B).sort().join(',') });
    c2.push({ quoi: 'conflits mal séparés par la répartition publiée', recalcule: 0, publie: mal.length });
  } else {
    c2.push({ quoi: 'lignes machine A / machine B', recalcule: 'présentes', publie: 'ligne(s) absente(s)' });
  }
  const lMal = ligne(txt2, /^conflits mal separes/);
  c2.push({ quoi: 'conflits annoncés mal séparés', recalcule: 0, publie: lMal ? nombres(lMal)[0] : 'ligne absente' });
  c2.push({ quoi: 'conflits au total', recalcule: CONFLITS.length, publie: lMal ? nombres(lMal)[1] : 'ligne absente' });
  confronte(r, 'leçon 10 · exercice 2 : biparti si et seulement si aucun cycle impair, cycles énumérés', c2);

  /* --- exercice 3 : les ponts, décidés sans Tarjan ni recomptage de composantes --- */
  const N3 = 9;
  const ARETES3 = [
    [0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3], [5, 6], [6, 7], [7, 8], [8, 6],
  ];
  const txt3 = L.sortie(10, 'solution-3.txt');
  /* Une arête est un pont exactement quand aucun chemin sans répétition ne relie ses
     extrémités en l évitant : décidé par énumération, ni par Tarjan, ni en recomptant
     les morceaux. */
  function estPont(n, aretes, k) {
    const voisins = Array.from({ length: n }, function () { return []; });
    aretes.forEach(function (e, i) {
      if (i === k) return;
      voisins[e[0]].push(e[1]); voisins[e[1]].push(e[0]);
    });
    const depart = aretes[k][0], but = aretes[k][1];
    const vus = new Set([depart]);
    let trouve = false;
    (function marche(s) {
      if (trouve) return;
      if (s === but) { trouve = true; return; }
      for (const v of voisins[s]) if (!vus.has(v)) { vus.add(v); marche(v); vus.delete(v); }
    })(depart);
    return !trouve;
  }
  const c3 = [];
  const ponts = ARETES3.map(function (e, k) { return estPont(N3, ARETES3, k) ? e[0] + '-' + e[1] : null; })
    .filter(function (x) { return x; });
  const lRes = ligne(txt3, /^reseau : /);
  c3.push({ quoi: 'sommets du réseau', recalcule: N3, publie: lRes ? nombres(lRes)[0] : 'ligne absente' });
  c3.push({ quoi: 'arêtes du réseau', recalcule: ARETES3.length, publie: lRes ? nombres(lRes)[1] : 'ligne absente' });
  ['suppression', 'Tarjan'].forEach(function (methode) {
    const l = ligne(txt3, new RegExp('^ponts par ' + methode));
    c3.push({ quoi: 'ponts annoncés par ' + methode, recalcule: ponts.join(' , '),
      publie: l ? l.split(':')[1].trim() : 'ligne absente' });
  });
  const lPar = ligne(txt3, /^parcours complets : suppression/);
  c3.push({ quoi: 'parcours de la méthode naïve (1 + une par arête)', recalcule: ARETES3.length + 1, publie: lPar ? nombres(lPar)[0] : 'ligne absente' });
  c3.push({ quoi: 'sommets visités par Tarjan', recalcule: N3, publie: lPar ? nombres(lPar).slice(-1)[0] : 'ligne absente' });
  const mp3 = prose.match(/les deux ponts sont ([\d-]+) , la liaison entre les grappes, et ([\d-]+) , l.antenne/);
  c3.push({ quoi: 'prose : premier pont', recalcule: ponts[0], publie: mp3 ? mp3[1] : 'phrase absente' });
  c3.push({ quoi: 'prose : second pont', recalcule: ponts[1], publie: mp3 ? mp3[2] : 'phrase absente' });
  const mp4 = prose.match(/(\d+) parcours complets pour la méthode naïve contre (\d+) pour Tarjan/);
  c3.push({ quoi: 'prose : parcours naïfs', recalcule: ARETES3.length + 1, publie: mp4 ? mp4[1] : 'phrase absente' });
  confronte(r, 'leçon 10 · exercice 3 : les deux ponts, décidés par absence de chemin de contournement', c3);
}

/* ===================== LEÇON 11 · le petit graphe A..E =====================
   DONNÉE recopiée du programme publié. Tout ce qui suit est recompté à la main. */

const S5 = ['A', 'B', 'C', 'D', 'E'];
const ARETES5 = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];
const M5 = S5.map(function (a) {
  return S5.map(function (b) {
    return ARETES5.some(function (e) { return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a); }) ? 1 : 0;
  });
});

function matriceVecteur(r) {
  const txt = L.sortie(11, 'matrice-vecteur.txt');
  const prose = L.texte(11);

  /* --- la propagation depuis A : ce sont des comptages de chemins, énumérés --- */
  const c1 = [];
  for (let k = 0; k <= 4; k++) {
    const attendu = S5.map(function (_, j) { return cheminsLongueur(M5, 0, j, k); });
    const motif = k === 0 ? /^depart \(un 1 sur A\)/ : new RegExp('^apres ' + k + ' produit');
    const l = ligne(txt, motif);
    if (!l) { c1.push({ quoi: 'ligne du pas ' + k, recalcule: 'présente', publie: 'ligne absente' }); continue; }
    const v = nombres(l).map(Number);
    const decale = k === 0 ? 1 : 1;                 /* le premier nombre de la ligne est le pas ou le 1 du libellé */
    const lus = k === 0 ? v.slice(1, 6) : v.slice(1, 6);
    c1.push({ quoi: 'pas ' + k + ' · vecteur', recalcule: attendu.join(','), publie: lus.join(',') });
    c1.push({ quoi: 'pas ' + k + ' · total', recalcule: attendu.reduce(function (a, b) { return a + b; }, 0), publie: v[6] });
  }

  /* --- le tableau de vérification, ligne par ligne --- */
  const c2 = [];
  for (let k = 1; k <= 4; k++) {
    const l = ligne(txt, new RegExp('^k = ' + k + '\\s'));
    if (!l) { c2.push({ quoi: 'ligne k = ' + k, recalcule: 'présente', publie: 'ligne absente' }); continue; }
    const v = nombres(l).map(Number).slice(1);
    const attendu = S5.map(function (_, j) { return cheminsLongueur(M5, 0, j, k); });
    c2.push({ quoi: 'k = ' + k + ' · chemins vers A..E', recalcule: attendu.join(','), publie: v.slice(0, 5).join(',') });
  }
  const lDes = ligne(txt, /^desaccords entre le produit de matrices et l enumeration/);
  c2.push({ quoi: 'désaccords annoncés', recalcule: 0, publie: lDes ? nombres(lDes)[0] : 'ligne absente' });
  confronte(r, 'leçon 11 · propagation : les cinq vecteurs et le tableau des chemins, énumérés un par un', c1.concat(c2));

  /* --- degrés, regroupement en zones, et la règle des dimensions --- */
  const c3 = [];
  const degres = M5.map(function (l) { return l.reduce(function (a, b) { return a + b; }, 0); });
  const lUns = ligne(txt, /^A x \(1,1,1,1,1\)/);
  if (lUns) {
    const v = nombres(lUns).map(Number).slice(5);   /* les cinq 1 du libellé passent devant */
    c3.push({ quoi: 'degrés rendus par A fois le vecteur de 1', recalcule: degres.join(','), publie: v.slice(0, 5).join(',') });
    c3.push({ quoi: 'total (somme des degrés = 2 m)', recalcule: 2 * ARETES5.length, publie: v[5] });
  } else c3.push({ quoi: 'ligne A x (1,1,1,1,1)', recalcule: 'présente', publie: 'ligne absente' });
  const lDeg = ligne(txt, /^degres calcules a la main/);
  c3.push({ quoi: 'degrés annoncés à la main', recalcule: S5.map(function (s, i) { return s + '=' + degres[i]; }).join(', '),
    publie: lDeg ? lDeg.split(':')[1].trim() : 'ligne absente' });
  const POP = [12, 30, 45, 8, 21];
  const R3x5 = [[1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]];
  const zones = R3x5.map(function (l) { let s = 0; for (let j = 0; j < 5; j++) s += l[j] * POP[j]; return s; });
  const lZ = ligne(txt, /^population par zone/);
  if (lZ) {
    const v = nombres(lZ).map(Number);
    c3.push({ quoi: 'population par zone', recalcule: zones.join(','), publie: v.slice(0, 3).join(',') });
    c3.push({ quoi: 'total des zones', recalcule: zones.reduce(function (a, b) { return a + b; }, 0), publie: v[3] });
    c3.push({ quoi: 'total de départ', recalcule: POP.reduce(function (a, b) { return a + b; }, 0), publie: v[4] });
  } else c3.push({ quoi: 'ligne population par zone', recalcule: 'présente', publie: 'ligne absente' });
  /* Le vecteur tronqué : la boucle ne lit que trois colonnes, donc le résultat est
     le produit de la sous-matrice 3x3 gauche par (1,2,3). Refait ici à la main. */
  const tronque = R3x5.map(function (l) { let s = 0; for (let j = 0; j < 3; j++) s += l[j] * [1, 2, 3][j]; return s; });
  const lT = ligne(txt, /^avec un vecteur de 3 cases/);
  c3.push({ quoi: 'résultat faux mais silencieux', recalcule: JSON.stringify(tronque),
    publie: lT ? (lT.match(/\[[-\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  const mpt = prose.match(/avec un vecteur de 3 cases au lieu de 5, le calcul rend (\[[-\d,]+\])/);
  c3.push({ quoi: 'prose : le même résultat', recalcule: JSON.stringify(tronque), publie: mpt ? mpt[1] : 'phrase absente' });
  confronte(r, 'leçon 11 · degrés, regroupement en trois zones, et le résultat faux du vecteur tronqué', c3);
}

/* ===================== LEÇON 11 · le produit de deux matrices ===================== */

function produit2x2(X, Y) {                        /* écrit coefficient par coefficient */
  return [
    [X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]],
    [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]],
  ];
}

function produitMatriciel(r) {
  const txt = L.sortie(11, 'produit.txt');
  const prose = L.texte(11);
  const ls = lignes(txt);

  /* --- A et A² publiées, case par case, contre un comptage de chemins --- */
  const c1 = [], c2 = [];
  const debutA = ls.findIndex(function (l) { return /^\s+A\s+B\s+C\s+D\s+E$/.test(l); });
  const debutA2 = ls.findIndex(function (l, i) { return i > debutA + 6 && /^\s+A\s+B\s+C\s+D\s+E$/.test(l); });
  [[debutA, 1, c1], [debutA2, 2, c2]].forEach(function (cas) {
    const debut = cas[0], k = cas[1], cible = cas[2];
    if (debut < 0) { cible.push({ quoi: 'entête de la matrice A^' + k, recalcule: 'présente', publie: 'ligne absente' }); return; }
    for (let i = 0; i < 5; i++) {
      const l = ls[debut + 1 + i];
      if (!l || l.trim().indexOf(S5[i]) !== 0) { cible.push({ quoi: 'ligne ' + S5[i] + ' de A^' + k, recalcule: 'présente', publie: 'ligne absente' }); continue; }
      const v = nombres(l).map(Number);
      for (let j = 0; j < 5; j++) {
        cible.push({ quoi: 'A^' + k + '[' + S5[i] + '][' + S5[j] + ']',
          recalcule: cheminsLongueur(M5, i, j, k), publie: v[j] });
      }
    }
  });
  confronte(r, 'leçon 11 · la matrice d’adjacence publiée, reconstruite depuis les seules arêtes', c1);
  confronte(r, 'leçon 11 · les 25 cases de A x A comptent les chemins de longueur 2, énumérés', c2);

  /* --- diagonale de A², trace de A³, triangles --- */
  const c3 = [];
  const degres = M5.map(function (l) { return l.reduce(function (a, b) { return a + b; }, 0); });
  const lDiag = ligne(txt, /^diagonale de A\^2/);
  c3.push({ quoi: 'diagonale de A² (chemins fermés de longueur 2)',
    recalcule: S5.map(function (s, i) { return s + '=' + cheminsLongueur(M5, i, i, 2); }).join(', '),
    publie: lDiag ? lDiag.split(':')[1].trim() : 'ligne absente' });
  c3.push({ quoi: 'et elle vaut les degrés', recalcule: degres.join(','),
    publie: S5.map(function (_, i) { return cheminsLongueur(M5, i, i, 2); }).join(',') });
  let trace = 0;
  for (let i = 0; i < 5; i++) trace += cheminsLongueur(M5, i, i, 3);
  let triangles = 0;
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) {
    if (M5[i][j] && M5[j][k] && M5[i][k]) triangles++;
  }
  const lTrace = ligne(txt, /^trace de A\^3/);
  const lTri = ligne(txt, /^trace \/ 6 =/);
  c3.push({ quoi: 'trace de A³ (chemins fermés de longueur 3, énumérés)', recalcule: trace, publie: lTrace ? nombres(lTrace).slice(-1)[0] : 'ligne absente' });
  c3.push({ quoi: 'trace / 6', recalcule: trace / 6, publie: lTri ? nombres(lTri)[1] : 'ligne absente' });
  c3.push({ quoi: 'triangles comptés un par un', recalcule: triangles, publie: lTri ? nombres(lTri)[2] : 'ligne absente' });
  confronte(r, 'leçon 11 · diagonale de A², trace de A³ et le triangle unique du graphe', c3);
}

function commutation(r) {
  const txt = L.sortie(11, 'produit.txt');
  const prose = L.texte(11);
  const c4 = [];
  const X = [[1, 2], [0, 1]], Y = [[1, 0], [3, 1]];
  const lXY = ligne(txt, /^X x Y =/), lYX = ligne(txt, /^Y x X =/);
  c4.push({ quoi: 'X x Y', recalcule: JSON.stringify(produit2x2(X, Y)), publie: lXY ? lXY.split('= ')[1].trim() : 'ligne absente' });
  c4.push({ quoi: 'Y x X', recalcule: JSON.stringify(produit2x2(Y, X)),
    publie: lYX ? lYX.split('= ')[1].split('   ')[0].trim() : 'ligne absente' });
  c4.push({ quoi: 'la page les dit différentes', recalcule: 'DIFFERENTS',
    publie: lYX && /DIFFERENTS/.test(lYX) ? 'DIFFERENTS' : 'la page ne les dit pas différentes' });

  /* Les 5^8 paires, énumérées ici aussi, mais avec un produit écrit autrement :
     les quatre coefficients à la main, sans boucle sur k. */
  const toutes = [];
  for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) for (let c = 0; c < 5; c++) for (let e = 0; e < 5; e++) toutes.push([[a, b], [c, e]]);
  let paires = 0, commutent = 0, triviales = 0;
  for (const P of toutes) for (const Q of toutes) {
    paires++;
    const G = produit2x2(P, Q), D = produit2x2(Q, P);
    if (G[0][0] === D[0][0] && G[0][1] === D[0][1] && G[1][0] === D[1][0] && G[1][1] === D[1][1]) {
      commutent++;
      const scalaire = function (Z) { return Z[0][1] === 0 && Z[1][0] === 0 && Z[0][0] === Z[1][1]; };
      if (scalaire(P) || scalaire(Q) || (P[0][0] === Q[0][0] && P[0][1] === Q[0][1] && P[1][0] === Q[1][0] && P[1][1] === Q[1][1])) triviales++;
    }
  }
  const lTout = ligne(txt, /^en les enumerant TOUTES/);
  if (!lTout) c4.push({ quoi: 'ligne de l énumération exhaustive', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const v = nombres(lTout);
    c4.push({ quoi: 'paires énumérées', recalcule: paires, publie: v[0] });
    c4.push({ quoi: 'paires qui commutent', recalcule: commutent, publie: v[1] });
    c4.push({ quoi: 'taux de commutation, en %', recalcule: (commutent / paires * 100).toFixed(2), publie: v[2] });
  }
  const lTriv = ligne(txt, / dont \d+ cas triviaux/);
  if (lTriv) {
    const v = nombres(lTriv);
    c4.push({ quoi: 'cas triviaux', recalcule: triviales, publie: v[0] });
    c4.push({ quoi: 'part des cas triviaux, en %', recalcule: (triviales / commutent * 100).toFixed(0), publie: v[1] });
  } else c4.push({ quoi: 'ligne des cas triviaux', recalcule: 'présente', publie: 'ligne absente' });
  const mpc = prose.match(/le programme énumère les ([\d ]+) paires possibles et obtient la valeur exacte , ([\d,]+) %/);
  c4.push({ quoi: 'prose : paires possibles', recalcule: L.frNombre(paires), publie: mpc ? mpc[1].trim() : 'phrase absente' });
  c4.push({ quoi: 'prose : taux exact', recalcule: L.frNombre(commutent / paires * 100, 2), publie: mpc ? mpc[2] : 'phrase absente' });
  confronte(r, 'leçon 11 · commutation : les 390 625 paires réénumérées, et les cas triviaux recomptés', c4);
}

function coutChaines(r) {
  const txt = L.sortie(11, 'produit.txt');
  const c5 = [];
  function chaine(d) { return { gauche: d[0] * d[1] * d[2] + d[0] * d[2] * d[3], droite: d[1] * d[2] * d[3] + d[0] * d[1] * d[3] }; }
  const ch1 = chaine([50, 5, 60, 4]), ch2 = chaine([10, 100, 5, 50]);
  const lCh1 = ligne(txt, /^chaine \(50x5\)/), lCh2 = ligne(txt, /^chaine \(10x100\)/);
  if (lCh1) {
    const v = nombres(lCh1).map(Number).slice(6);
    c5.push({ quoi: 'chaîne 1 · ((AB)C)', recalcule: ch1.gauche, publie: v[0] });
    c5.push({ quoi: 'chaîne 1 · (A(BC))', recalcule: ch1.droite, publie: v[1] });
    c5.push({ quoi: 'chaîne 1 · rapport', recalcule: Number((ch1.gauche / ch1.droite).toFixed(1)), publie: v[2] });
  } else c5.push({ quoi: 'ligne de la chaîne (50x5)(5x60)(60x4)', recalcule: 'présente', publie: 'ligne absente' });
  if (lCh2) {
    const v = nombres(lCh2).map(Number).slice(6);
    c5.push({ quoi: 'chaîne 2 · ((AB)C)', recalcule: ch2.gauche, publie: v[0] });
    c5.push({ quoi: 'chaîne 2 · (A(BC))', recalcule: ch2.droite, publie: v[1] });
    c5.push({ quoi: 'chaîne 2 · rapport inverse', recalcule: Number((ch2.droite / ch2.gauche).toFixed(1)), publie: v[2] });
  } else c5.push({ quoi: 'ligne de la chaîne (10x100)(100x5)(5x50)', recalcule: 'présente', publie: 'ligne absente' });
  confronte(r, 'leçon 11 · le coût des deux parenthésages, recompté par n x m x p', c5);
}

/* ===================== LEÇON 11 · ce que coûte un produit ===================== */

function cout(r) {
  const txt = L.sortie(11, 'cout.txt');
  const prose = L.texte(11);

  /* --- n au cube, sur les six tailles --- */
  const c1 = [];
  [2, 4, 8, 16, 32, 64].forEach(function (n) {
    const l = ligne(txt, new RegExp('^' + n + ' {2,}\\d'));
    if (!l) { c1.push({ quoi: 'ligne n = ' + n, recalcule: 'présente', publie: 'ligne absente' }); return; }
    const v = nombres(l).map(Number);
    c1.push({ quoi: 'n = ' + n + ' · multiplications comptées', recalcule: n * n * n, publie: v[1] });
    c1.push({ quoi: 'n = ' + n + ' · colonne n au cube', recalcule: n * n * n, publie: v[2] });
  });
  const lDouble = ligne(txt, /^doubler n multiplie le travail par/);
  if (lDouble) {
    const v = nombres(lDouble).map(Number);
    c1.push({ quoi: 'facteur de doublement (16³ / 8³)', recalcule: 16 * 16 * 16 / (8 * 8 * 8), publie: v[0] });
    c1.push({ quoi: '16³', recalcule: 16 * 16 * 16, publie: v[1] });
    c1.push({ quoi: '8³', recalcule: 8 * 8 * 8, publie: v[2] });
  } else c1.push({ quoi: 'ligne du doublement', recalcule: 'présente', publie: 'ligne absente' });
  [100, 1000, 10000, 100000].forEach(function (n) {
    const l = ligne(txt, new RegExp('n = +' + n + ' +->'));
    if (!l) { c1.push({ quoi: 'ligne d échelle n = ' + n, recalcule: 'présente', publie: 'ligne absente' }); return; }
    c1.push({ quoi: 'échelle n = ' + n + ' · n³ en notation scientifique',
      recalcule: Math.pow(n, 3).toExponential(1), publie: (l.match(/\d\.\de\+\d+/) || ['motif absent'])[0] });
  });
  confronte(r, 'leçon 11 · le coût du produit vaut n³ sur les six tailles, et double en x8', c1);

  /* --- Strassen : un exposant, et des rapports --- */
  const c2 = [];
  const exp = Math.log(7) / Math.log(2);
  const lExp = ligne(txt, /^exposant de Strassen/);
  c2.push({ quoi: 'exposant log(7)/log(2)', recalcule: exp.toFixed(4), publie: lExp ? nombres(lExp).slice(-1)[0] : 'ligne absente' });
  [128, 1024, 4096].forEach(function (n) {
    const l = ligne(txt, new RegExp('^' + n + ' {2,}\\d\\.\\d\\de'));
    if (!l) { c2.push({ quoi: 'ligne n = ' + n + ' du tableau Strassen', recalcule: 'présente', publie: 'ligne absente' }); return; }
    const cube = Math.pow(n, 3), strassen = Math.pow(n, exp);
    const v = l.match(/\d\.\d\de\+\d+/g) || [];
    c2.push({ quoi: 'n = ' + n + ' · n³', recalcule: cube.toExponential(2), publie: v[0] });
    c2.push({ quoi: 'n = ' + n + ' · n^2,807', recalcule: strassen.toExponential(2), publie: v[1] });
    c2.push({ quoi: 'n = ' + n + ' · rapport', recalcule: (cube / strassen).toFixed(2), publie: nombres(l).slice(-1)[0] });
  });
  const mpe = prose.match(/un exposant de log\(7\)\/log\(2\) = ([\d,]+) au lieu de 3/);
  c2.push({ quoi: 'prose : exposant de Strassen', recalcule: L.frNombre(exp, 4), publie: mpe ? mpe[1] : 'phrase absente' });
  const mpr = prose.match(/il vaut ([\d,]+) à n = 128 et ([\d,]+) à n = 4 096/);
  c2.push({ quoi: 'prose : rapport à n = 128', recalcule: L.frNombre(Math.pow(128, 3) / Math.pow(128, exp), 2), publie: mpr ? mpr[1] : 'phrase absente' });
  c2.push({ quoi: 'prose : rapport à n = 4096', recalcule: L.frNombre(Math.pow(4096, 3) / Math.pow(4096, exp), 2), publie: mpr ? mpr[2] : 'phrase absente' });
  confronte(r, 'leçon 11 · Strassen : exposant 2,8074 et les trois rapports, recalculés', c2);
}

function classifieur(r) {
  const txt = L.sortie(11, 'cout.txt');
  const prose = L.texte(11);
  const c3 = [];
  const RESEAU = [[784, 512], [512, 256], [256, 10]];   /* donnée : les trois couches publiées */
  let mult = 0, biais = 0;
  RESEAU.forEach(function (c) {
    const l = ligne(txt, new RegExp('^' + c[0] + ' -> ' + c[1] + '\\s'));
    const m = c[0] * c[1];
    mult += m; biais += c[1];
    if (!l) { c3.push({ quoi: 'ligne de la couche ' + c[0] + ' -> ' + c[1], recalcule: 'présente', publie: 'ligne absente' }); return; }
    const v = nombres(l).map(Number).slice(2);
    c3.push({ quoi: 'couche ' + c[0] + ' -> ' + c[1] + ' · multiplications', recalcule: m, publie: v[0] });
    c3.push({ quoi: 'couche ' + c[0] + ' -> ' + c[1] + ' · poids', recalcule: m, publie: v[1] });
    c3.push({ quoi: 'couche ' + c[0] + ' -> ' + c[1] + ' · biais', recalcule: c[1], publie: v[2] });
    c3.push({ quoi: 'couche ' + c[0] + ' -> ' + c[1] + ' · paramètres', recalcule: m + c[1], publie: v[3] });
  });
  const lTot = ligne(txt, /^total {2,}\d/);
  if (lTot) {
    const v = nombres(lTot).map(Number);
    c3.push({ quoi: 'total des multiplications', recalcule: mult, publie: v[0] });
    c3.push({ quoi: 'total des poids', recalcule: mult, publie: v[1] });
    c3.push({ quoi: 'total des biais', recalcule: biais, publie: v[2] });
    c3.push({ quoi: 'total des paramètres', recalcule: mult + biais, publie: v[3] });
  } else c3.push({ quoi: 'ligne de total', recalcule: 'présente', publie: 'ligne absente' });
  const lLot = ligne(txt, /Pour un lot de 128 images/);
  c3.push({ quoi: 'multiplications pour 128 images', recalcule: (mult * 128).toExponential(2),
    publie: lLot ? (lLot.match(/\d\.\d\de\+\d+/) || ['motif absent'])[0] : 'ligne absente' });
  const mpp = prose.match(/([\d ]+) multiplications pour une seule image/);
  c3.push({ quoi: 'prose : multiplications par image', recalcule: L.frNombre(mult), publie: mpp ? mpp[1].trim() : 'phrase absente' });
  const mpb = prose.match(/auxquels s.ajoutent ([\d ]+) biais, soit ([\d ]+) paramètres/);
  c3.push({ quoi: 'prose : biais', recalcule: L.frNombre(biais), publie: mpb ? mpb[1].trim() : 'phrase absente' });
  c3.push({ quoi: 'prose : paramètres', recalcule: L.frNombre(mult + biais), publie: mpb ? mpb[2].trim() : 'phrase absente' });
  confronte(r, 'leçon 11 · le classifieur : 535 040 multiplications, 778 biais, 535 818 paramètres', c3);
}

/* ===================== LEÇON 11 · une couche de réseau de neurones ===================== */

function couche(r) {
  const txt = L.sortie(11, 'couche.txt');
  const prose = L.texte(11);
  /* DONNÉES : les poids posés à la main dans la leçon. */
  const W1 = [[1, 1], [1, 1]], b1 = [0, -1], W2 = [[1, -2]], b2 = [0];
  const CAS = [[0, 0], [0, 1], [1, 0], [1, 1]], ATTENDU = [0, 1, 1, 0];
  const relu = function (x) { return x > 0 ? x : 0; };

  const c1 = [], c2 = [];
  let justesRelu = 0, justesSans = 0;
  CAS.forEach(function (x, i) {
    /* Tout est refait à la main, coefficient par coefficient. */
    const h = [W1[0][0] * x[0] + W1[0][1] * x[1] + b1[0], W1[1][0] * x[0] + W1[1][1] * x[1] + b1[1]];
    const hRelu = [relu(h[0]), relu(h[1])];
    const sortieRelu = W2[0][0] * hRelu[0] + W2[0][1] * hRelu[1] + b2[0];
    const sortieSans = W2[0][0] * h[0] + W2[0][1] * h[1] + b2[0];
    if (sortieRelu === ATTENDU[i]) justesRelu++;
    if (sortieSans === ATTENDU[i]) justesSans++;
    const lR = ligne(txt, new RegExp('^entree \\[' + x[0] + ',' + x[1] + '\\]  couche cachee'));
    if (!lR) c1.push({ quoi: 'ligne ReLU pour [' + x + ']', recalcule: 'présente', publie: 'ligne absente' });
    else {
      const v = nombres(lR).map(Number);
      c1.push({ quoi: 'entrée [' + x + '] · couche cachée après ReLU', recalcule: hRelu.join(','), publie: v.slice(2, 4).join(',') });
      c1.push({ quoi: 'entrée [' + x + '] · sortie', recalcule: sortieRelu, publie: v[4] });
      c1.push({ quoi: 'entrée [' + x + '] · attendu', recalcule: ATTENDU[i], publie: v[5] });
    }
    const lS = ligne(txt, new RegExp('^entree \\[' + x[0] + ',' + x[1] + '\\]  sortie'));
    if (!lS) c2.push({ quoi: 'ligne sans activation pour [' + x + ']', recalcule: 'présente', publie: 'ligne absente' });
    else {
      const v = nombres(lS).map(Number);
      c2.push({ quoi: 'entrée [' + x + '] · sortie sans activation', recalcule: sortieSans, publie: v[2] });
    }
  });
  const lignesJustes = lignes(txt).filter(function (l) { return /^reponses justes/.test(l); });
  c1.push({ quoi: 'réponses justes avec ReLU', recalcule: justesRelu + ' sur ' + CAS.length,
    publie: lignesJustes[0] ? nombres(lignesJustes[0])[0] + ' sur ' + nombres(lignesJustes[0])[1] : 'ligne absente' });
  c2.push({ quoi: 'réponses justes sans activation', recalcule: justesSans + ' sur ' + CAS.length,
    publie: lignesJustes[1] ? nombres(lignesJustes[1])[0] + ' sur ' + nombres(lignesJustes[1])[1] : 'ligne absente' });
  confronte(r, 'leçon 11 · le OU exclusif avec ReLU : quatre cas refaits à la main', c1);

  /* Le repli des deux couches linéaires : W2 x W1 et W2 x b1 + b2, à la main. */
  const Wplie = [[W2[0][0] * W1[0][0] + W2[0][1] * W1[1][0], W2[0][0] * W1[0][1] + W2[0][1] * W1[1][1]]];
  const bplie = [W2[0][0] * b1[0] + W2[0][1] * b1[1] + b2[0]];
  const lPlie = ligne(txt, /^ +W2 x W1 =/);
  if (lPlie) {
    c2.push({ quoi: 'W2 x W1', recalcule: JSON.stringify(Wplie), publie: (lPlie.match(/\[\[[-\d,]+\]\]/) || ['motif absent'])[0] });
    c2.push({ quoi: 'biais replié', recalcule: JSON.stringify(bplie), publie: (lPlie.match(/biais = (\[[-\d,]+\])/) || [0, 'motif absent'])[1] });
  } else c2.push({ quoi: 'ligne du repli', recalcule: 'présente', publie: 'ligne absente' });
  const mpx = prose.match(/W 2 × W 1 = (\[\[[-\d,]+\]\]) , biais (\[[-\d,]+\])/);
  c2.push({ quoi: 'prose : la couche repliée', recalcule: JSON.stringify(Wplie), publie: mpx ? mpx[1] : 'phrase absente' });
  c2.push({ quoi: 'prose : son biais', recalcule: JSON.stringify(bplie), publie: mpx ? mpx[2] : 'phrase absente' });
  /* L identité qui interdit toute couche affine de résoudre le OU exclusif. */
  const lId = ligne(txt, /OU EXCLUSIF exige/);
  const mId = lId ? lId.match(/exige (\d+) = (\d+)/) : null;
  c2.push({ quoi: 'f(0,0) + f(1,1) exigé par le OU exclusif', recalcule: ATTENDU[0] + ATTENDU[3], publie: mId ? mId[1] : 'ligne introuvable : « … OU EXCLUSIF exige X = Y … »' });
  c2.push({ quoi: 'f(0,1) + f(1,0) exigé par le OU exclusif', recalcule: ATTENDU[1] + ATTENDU[2], publie: mId ? mId[2] : 'ligne introuvable : « … OU EXCLUSIF exige X = Y … »' });
  confronte(r, 'leçon 11 · sans activation : 3 sur 4, et les deux couches repliées en une seule', c2);
}

/* ===================== LEÇON 11 · la marche aléatoire ===================== */

/* DONNÉE recopiée : les liens sortants de chaque page. */
const PAGES = ['accueil', 'cours', 'catalogue', 'blog', 'contact', 'archive'];
const LIENS = {
  accueil: ['cours', 'catalogue', 'blog'],
  cours: ['accueil', 'catalogue'],
  catalogue: ['cours'],
  blog: ['accueil', 'contact'],
  contact: ['accueil'],
  archive: [],
};

function transition() {
  const n = PAGES.length;
  const T = Array.from({ length: n }, function () { return new Array(n).fill(0); });
  PAGES.forEach(function (p, j) {
    const sortants = LIENS[p];
    if (!sortants.length) { for (let i = 0; i < n; i++) T[i][j] = 1 / n; return; }
    sortants.forEach(function (q) { T[PAGES.indexOf(q)][j] = 1 / sortants.length; });
  });
  return T;
}

function marche(r) {
  const txt = L.sortie(11, 'marche.txt');
  const n = PAGES.length, d = 0.85;
  const T = transition();

  /* --- chaque colonne somme à 1 --- */
  const c1 = [];
  const lCol = lignes(txt)[lignes(txt).findIndex(function (l) { return /^sommes des colonnes/.test(l); }) + 1];
  PAGES.forEach(function (p, j) {
    let s = 0;
    for (let i = 0; i < n; i++) s += T[i][j];
    const m = lCol ? lCol.match(new RegExp(p + '=([\\d.]+)')) : null;
    c1.push({ quoi: 'somme de la colonne ' + p, recalcule: s.toFixed(3), publie: m ? m[1] : 'ligne absente' });
  });

  /* --- le vecteur propre amorti, RÉSOLU par élimination de Gauss --- */
  const A = Array.from({ length: n }, function (_, i) {
    return Array.from({ length: n }, function (_, j) { return (i === j ? 1 : 0) - d * T[i][j]; });
  });
  const v = gauss(A, new Array(n).fill((1 - d) / n));
  const lFinal = lignes(txt).filter(function (l) { return /^\d+ +0\.\d{4} +0\.\d{4}/.test(l); }).slice(-1)[0];
  if (!lFinal) c1.push({ quoi: 'dernière ligne du tableau de convergence', recalcule: 'présente', publie: 'ligne absente' });
  else {
    const lus = (lFinal.match(/0\.\d{4}/g) || []);
    PAGES.forEach(function (p, i) {
      c1.push({ quoi: 'temps de visite de ' + p + ' (Gauss)', recalcule: v[i].toFixed(4), publie: lus[i] });
    });
  }
  const lSomme = ligne(txt, /^somme du vecteur final/);
  c1.push({ quoi: 'somme du vecteur', recalcule: v.reduce(function (a, b) { return a + b; }, 0).toFixed(6),
    publie: lSomme ? nombres(lSomme)[0] : 'ligne absente' });
  confronte(r, 'leçon 11 · marche : matrice stochastique et vecteur propre amorti, résolu par Gauss', c1);
  return v;
}

function marcheSuite(r, v) {
  const txt = L.sortie(11, 'marche.txt');
  const prose = L.texte(11);
  const n = PAGES.length;
  const T = transition();

  /* --- T appliquée au vecteur : ce n est PAS un vecteur propre de T --- */
  const c2 = [];
  const Tv = [];
  for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < n; j++) s += T[i][j] * v[j]; Tv.push(s); }
  const lTv = ligne(txt, /^ +T x v :/);
  const lRap = ligne(txt, /^ +rapports/);
  c2.push({ quoi: 'T x v', recalcule: Tv.map(function (x) { return x.toFixed(4); }).join('  '),
    publie: lTv ? lTv.split(':')[1].trim() : 'ligne absente' });
  c2.push({ quoi: 'rapports (T x v) / v', recalcule: Tv.map(function (x, i) { return (x / v[i]).toFixed(3); }).join('  '),
    publie: lRap ? lRap.split(':')[1].trim() : 'ligne absente' });
  const rapports = Tv.map(function (x, i) { return x / v[i]; });
  const mpr = prose.match(/ils vont de ([\d,]+) à ([\d,]+)/);
  c2.push({ quoi: 'prose : plus petit rapport', recalcule: L.frNombre(Math.min.apply(null, rapports), 3), publie: mpr ? mpr[1] : 'phrase absente' });
  c2.push({ quoi: 'prose : plus grand rapport', recalcule: L.frNombre(Math.max.apply(null, rapports), 3), publie: mpr ? mpr[2] : 'phrase absente' });

  /* --- le vecteur propre de T seule, résolu lui aussi par Gauss --- */
  const c3 = [];
  const B = Array.from({ length: n }, function (_, i) {
    return Array.from({ length: n }, function (_, j) { return T[i][j] - (i === j ? 1 : 0); });
  });
  B[n - 1] = new Array(n).fill(1);            /* équation redondante remplacée par somme = 1 */
  const second = new Array(n).fill(0);
  second[n - 1] = 1;
  const w = gauss(B, second);
  const lW = lignes(txt)[lignes(txt).findIndex(function (l) { return /^sans amortissement/.test(l); }) + 1];
  PAGES.forEach(function (p, i) {
    const m = lW ? lW.match(new RegExp(p + '=([\\d.]+)')) : null;
    c3.push({ quoi: 'vecteur propre de T seule · ' + p, recalcule: sansZeroNegatif(w[i]), publie: m ? m[1] : 'ligne absente' });
  });
  const lEcart = ligne(txt, /ecart maximal avec le vecteur amorti/);
  const ecart = Math.max.apply(null, w.map(function (x, i) { return Math.abs(x - v[i]); }));
  c3.push({ quoi: 'écart maximal entre les deux vecteurs', recalcule: ecart.toFixed(4), publie: lEcart ? nombres(lEcart)[0] : 'ligne absente' });
  const mpe = prose.match(/il est différent — écart maximal de ([\d,]+)/);
  c3.push({ quoi: 'prose : écart maximal', recalcule: L.frNombre(ecart, 4), publie: mpe ? mpe[1] : 'phrase absente' });
  confronte(r, 'leçon 11 · marche : T x v, les rapports, et le vecteur propre de T seule où archive tombe à zéro', c2.concat(c3));
}

function classementPages(r, v) {
  const txt = L.sortie(11, 'marche.txt');
  const prose = L.texte(11);
  const n = PAGES.length;
  const c4 = [];
  const classement = PAGES.map(function (p, i) { return [p, v[i]]; })
    .sort(function (a, b) { return b[1] - a[1]; }).map(function (c) { return c[0]; });
  const lCl = ligne(txt, /^classement :/);
  c4.push({ quoi: 'classement par temps de visite', recalcule: classement.map(function (p, i) { return (i + 1) + '. ' + p; }).join('  '),
    publie: lCl ? lCl.split(':')[1].trim() : 'ligne absente' });
  const compte = function (p) { return PAGES.filter(function (q) { return LIENS[q].indexOf(p) !== -1; }).length; };
  const entrants = PAGES.map(function (p) { return p + '=' + compte(p); });
  const lEnt = lignes(txt)[lignes(txt).findIndex(function (l) { return /^a comparer au simple comptage/.test(l); }) + 1];
  c4.push({ quoi: 'liens entrants, comptés dans la donnée', recalcule: entrants.join('  '), publie: lEnt ? lEnt.trim() : 'ligne absente' });
  let inverses = 0, paires = 0;
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    paires++;
    const nbA = compte(PAGES[a]), nbB = compte(PAGES[b]);
    if (nbA === nbB) continue;
    const parMarche = classement.indexOf(PAGES[a]) - classement.indexOf(PAGES[b]);
    if (Math.sign(parMarche) !== Math.sign(nbB - nbA)) inverses++;
  }
  const lInv = ligne(txt, /^paires classees DANS L ORDRE INVERSE/);
  c4.push({ quoi: 'paires classées à l envers', recalcule: inverses, publie: lInv ? nombres(lInv)[0] : 'ligne absente' });
  c4.push({ quoi: 'paires au total', recalcule: paires, publie: lInv ? nombres(lInv)[1] : 'ligne absente' });
  const mpi = prose.match(/(\d+) paire sur (\d+) est classée dans l.ordre inverse/);
  c4.push({ quoi: 'prose : paires inversées', recalcule: inverses, publie: mpi ? mpi[1] : 'phrase absente' });
  c4.push({ quoi: 'prose : paires au total', recalcule: paires, publie: mpi ? mpi[2] : 'phrase absente' });
  confronte(r, 'leçon 11 · marche : le classement, les liens entrants et la seule paire inversée', c4);
}

/* ===================== LEÇON 11 · les trois exercices ===================== */

function exercice4(r) {
  const txt = L.sortie(11, 'solution-4.txt');
  const prose = L.texte(11);
  const INGREDIENTS = ['farine', 'oeufs', 'lait', 'sucre'];
  const RECETTES = [[250, 3, 500, 50], [200, 4, 100, 150], [0, 6, 750, 120]];
  const COMMANDES = [12, 5, 8];
  const c = [];
  const besoin = INGREDIENTS.map(function (_, i) {
    let s = 0;
    for (let j = 0; j < RECETTES.length; j++) s += RECETTES[j][i] * COMMANDES[j];
    return s;
  });
  INGREDIENTS.forEach(function (ing, i) {
    const l = ligne(txt, new RegExp('^' + ing + ' '));
    c.push({ quoi: 'besoin en ' + ing + ' (somme directe, sans matrice)', recalcule: besoin[i],
      publie: l ? nombres(l)[0] : 'ligne absente' });
  });
  const tronque = INGREDIENTS.map(function (_, i) {
    let s = 0;
    for (let j = 0; j < 2; j++) s += RECETTES[j][i] * COMMANDES[j];
    return s;
  });
  const lSans = ligne(txt, /^sans controle :/);
  c.push({ quoi: 'résultat faux du vecteur tronqué', recalcule: JSON.stringify(tronque),
    publie: lSans ? (lSans.match(/\[[\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  const lEcart = ligne(txt, /^ecart avec le vrai besoin/);
  c.push({ quoi: 'écart avec le vrai besoin', recalcule: besoin.map(function (x, i) { return x - tronque[i]; }).join(', '),
    publie: lEcart ? lEcart.split(':')[1].trim() : 'ligne absente' });
  const lMult = ligne(txt, /^multiplications pour ce produit/);
  c.push({ quoi: 'multiplications du produit (4 x 3)', recalcule: INGREDIENTS.length * RECETTES.length,
    publie: lMult ? nombres(lMult).slice(-1)[0] : 'ligne absente' });
  const derniere = lignes(txt).filter(function (l) { return l.trim().length > 0; }).slice(-1)[0];
  c.push({ quoi: 'réponse seule en dernière ligne (le lait)', recalcule: besoin[2], publie: derniere ? derniere.trim() : 'ligne absente' });
  const mp = prose.match(/la version sans contrôle rend (\[[\d,]+\])/);
  c.push({ quoi: 'prose : le résultat tronqué', recalcule: JSON.stringify(tronque), publie: mp ? mp[1] : 'phrase absente' });
  confronte(r, 'leçon 11 · exercice 4 : les quatre besoins refaits sans matrice, et le vecteur tronqué', c);
}

function exercice5(r) {
  const txt = L.sortie(11, 'solution-5.txt');
  const prose = L.texte(11);
  const SERVICES = ['passerelle', 'auth', 'commandes', 'paiement', 'stock', 'notif', 'audit'];
  const APPELS = [
    ['passerelle', 'auth'], ['passerelle', 'commandes'], ['commandes', 'paiement'],
    ['commandes', 'stock'], ['paiement', 'notif'], ['stock', 'notif'],
    ['auth', 'audit'], ['paiement', 'audit'],
  ];
  const succ = function (s) { return APPELS.filter(function (a) { return a[0] === s; }).map(function (a) { return a[1]; }); };
  const c = [];
  let total = 0;
  SERVICES.forEach(function (s) {
    const direct = succ(s).slice().sort();
    const atteints = Array.from(atteintsEnum(succ, s)).sort();
    total += atteints.length;
    const l = ligne(txt, new RegExp('^' + s + ' '));
    if (!l) { c.push({ quoi: 'ligne du service ' + s, recalcule: 'présente', publie: 'ligne absente' }); return; }
    const cols = l.trim().split(/\s{2,}/);
    c.push({ quoi: s + ' · appels directs', recalcule: direct.join(', ') || '—',
      publie: (cols[1] || '').split(', ').sort().join(', ') });
    c.push({ quoi: s + ' · atteints au total (chemins énumérés)', recalcule: atteints.join(', ') || '—',
      publie: (cols[2] || '').split(', ').sort().join(', ') });
  });
  const lTot = ligne(txt, /^paires \(i, j\) atteignables au total/);
  c.push({ quoi: 'paires atteignables', recalcule: total, publie: lTot ? nombres(lTot)[0] : 'ligne absente' });
  c.push({ quoi: 'paires possibles (n²)', recalcule: SERVICES.length * SERVICES.length, publie: lTot ? nombres(lTot)[1] : 'ligne absente' });
  const dependants = SERVICES.filter(function (s) { return atteintsEnum(succ, s).has('audit'); });
  const lDep = ligne(txt, /^services qui finissent par appeler/);
  c.push({ quoi: 'services qui finissent par appeler audit', recalcule: dependants.slice().sort().join(', '),
    publie: lDep ? lDep.split(':')[1].trim().split(', ').sort().join(', ') : 'ligne absente' });
  const lPanne = ligne(txt, /une panne d audit se voit depuis/);
  c.push({ quoi: 'combien de services voient la panne', recalcule: dependants.length, publie: lPanne ? nombres(lPanne)[0] : 'ligne absente' });
  const lBorne = ligne(txt, /^exposant atteint/);
  c.push({ quoi: 'borne sur l exposant (n − 1)', recalcule: SERVICES.length - 1, publie: lBorne ? nombres(lBorne)[1] : 'ligne absente' });
  const lProd = ligne(txt, /^PRODUITS de matrices reellement effectues/);
  c.push({ quoi: 'borne sur le nombre de produits (n − 2)', recalcule: SERVICES.length - 2, publie: lProd ? nombres(lProd).slice(-1)[0] : 'ligne absente' });
  const derniere = lignes(txt).filter(function (l) { return l.trim().length > 0; }).slice(-1)[0];
  c.push({ quoi: 'réponse seule en dernière ligne', recalcule: total, publie: derniere ? derniere.trim() : 'ligne absente' });
  const mp = prose.match(/une panne du service audit se voit depuis (\d+) services sur (\d+)/);
  c.push({ quoi: 'prose : services touchés', recalcule: dependants.length, publie: mp ? mp[1] : 'phrase absente' });
  c.push({ quoi: 'prose : services au total', recalcule: SERVICES.length, publie: mp ? mp[2] : 'phrase absente' });
  confronte(r, 'leçon 11 · exercice 5 : la fermeture transitive, refaite par énumération des chemins', c);
}

function exercice6(r) {
  const txt = L.sortie(11, 'solution-6.txt');
  const prose = L.texte(11);
  const c = [];
  /* Les deux compositions, refaites SANS matrice : une rotation de 90 degrés envoie
     (x, y) sur (−y, x), une translation ajoute (dx, dy). */
  const P = [10, 0], DX = 100, DY = 0;
  const tourne = function (p) { return [-p[1], p[0]]; };
  const bouge = function (p) { return [p[0] + DX, p[1] + DY]; };
  const rotationSeule = tourne(P), translationSeule = bouge(P);
  const RT = tourne(bouge(P));                    /* R x T : on translate, PUIS on tourne */
  const TR = bouge(tourne(P));                    /* T x R : on tourne, PUIS on translate */
  const lR = ligne(txt, /^rotation de 90 degres seule/);
  const lT = ligne(txt, /^translation de \(100, 0\) seule/);
  const lRT = ligne(txt, /^R x T /);
  const lTR = ligne(txt, /^T x R /);
  const lD = ligne(txt, /^distance entre les deux resultats/);
  c.push({ quoi: 'rotation seule', recalcule: JSON.stringify(rotationSeule), publie: lR ? (lR.match(/\[[-\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  c.push({ quoi: 'translation seule', recalcule: JSON.stringify(translationSeule), publie: lT ? (lT.match(/\[[-\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  c.push({ quoi: 'R x T (translater puis tourner)', recalcule: JSON.stringify(RT), publie: lRT ? (lRT.match(/\[[-\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  c.push({ quoi: 'T x R (tourner puis translater)', recalcule: JSON.stringify(TR), publie: lTR ? (lTR.match(/\[[-\d,]+\]/) || ['motif absent'])[0] : 'ligne absente' });
  const dist = Math.sqrt((RT[0] - TR[0]) * (RT[0] - TR[0]) + (RT[1] - TR[1]) * (RT[1] - TR[1]));
  c.push({ quoi: 'distance entre les deux résultats', recalcule: dist.toFixed(3), publie: lD ? nombres(lD)[0] : 'ligne absente' });
  const lMult = ligne(txt, /^ +multiplications par point/);
  c.push({ quoi: 'multiplications, quatre matrices 3x3 appliquées une par une', recalcule: 4 * 9, publie: lMult ? nombres(lMult)[0] : 'ligne absente' });
  c.push({ quoi: 'multiplications, une seule matrice composée', recalcule: 9, publie: lMult ? nombres(lMult)[1] : 'ligne absente' });
  c.push({ quoi: 'rapport', recalcule: 4 * 9 / 9, publie: lMult ? nombres(lMult)[2] : 'ligne absente' });
  const mp = prose.match(/(\[[-\d, ]+\]) dans un sens, (\[[-\d, ]+\]) dans l.autre — ([\d,]+) pixels/);
  c.push({ quoi: 'prose : premier point', recalcule: JSON.stringify(RT).replace(/,/g, ', '), publie: mp ? mp[1] : 'phrase absente' });
  c.push({ quoi: 'prose : second point', recalcule: JSON.stringify(TR).replace(/,/g, ', '), publie: mp ? mp[2] : 'phrase absente' });
  c.push({ quoi: 'prose : distance', recalcule: L.frNombre(dist, 3), publie: mp ? mp[3] : 'phrase absente' });
  const mp2 = prose.match(/pour (\d+) multiplications par point au lieu de (\d+)/);
  c.push({ quoi: 'prose : matrice composée', recalcule: 9, publie: mp2 ? mp2[1] : 'phrase absente' });
  c.push({ quoi: 'prose : quatre matrices', recalcule: 36, publie: mp2 ? mp2[2] : 'phrase absente' });
  confronte(r, 'leçon 11 · exercice 6 : les deux compositions refaites sans matrice, et le coût par point', c);
}

/* ===================== assemblage ===================== */

function controles() {
  const r = [];
  representations(r);
  densite(r);
  parcours(r);
  dijkstra(r);
  dependances(r);
  petitMonde(r);
  exercices10(r);
  matriceVecteur(r);
  produitMatriciel(r);
  commutation(r);
  coutChaines(r);
  cout(r);
  classifieur(r);
  couche(r);
  const v = marche(r);
  marcheSuite(r, v);
  classementPages(r, v);
  exercice4(r);
  exercice5(r);
  exercice6(r);
  return r;
}

module.exports = { titre: 'lecons 10-11 — graphes et matrices', controles: controles };
