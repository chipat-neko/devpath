/* POURQUOI UN ARBRE EST RAPIDE — et à quelle condition exactement.
   Un arbre binaire de recherche coûte sa HAUTEUR par recherche. Toute la
   question est donc : cette hauteur vaut-elle log n, ou n ? */

function noeud(v) { return { v: v, g: null, d: null }; }

function inserer(racine, v) {          // itératif : un arbre dégénéré ferait déborder la pile
  if (racine === null) return noeud(v);
  let c = racine;
  for (;;) {
    if (v < c.v) { if (c.g === null) { c.g = noeud(v); return racine; } c = c.g; }
    else { if (c.d === null) { c.d = noeud(v); return racine; } c = c.d; }
  }
}
function hauteur(racine) {             // itératif aussi, par une pile explicite
  if (racine === null) return 0;
  let max = 0;
  const pile = [{ n: racine, h: 1 }];
  while (pile.length) {
    const x = pile.pop();
    if (x.h > max) max = x.h;
    if (x.n.g) pile.push({ n: x.n.g, h: x.h + 1 });
    if (x.n.d) pile.push({ n: x.n.d, h: x.h + 1 });
  }
  return max;
}
function chercher(racine, v) {         // rend le nombre de comparaisons
  let c = racine, k = 0;
  while (c !== null) { k++; if (v === c.v) return k; c = v < c.v ? c.g : c.d; }
  return k;
}
function equilibre(valeurs) {          // arbre parfaitement équilibré, construit depuis un tableau trié
  function bati(g, d) {
    if (g > d) return null;
    const m = (g + d) >> 1, n = noeud(valeurs[m]);
    n.g = bati(g, m - 1); n.d = bati(m + 1, d);
    return n;
  }
  return bati(0, valeurs.length - 1);
}

function alea(graine) {
  let e = graine >>> 0;
  return function () { e ^= e << 13; e >>>= 0; e ^= e >>> 17; e ^= e << 5; e >>>= 0; return e / 4294967296; };
}
function melanger(t, graine) {         // Fisher-Yates, déterministe
  const a = t.slice(), r = alea(graine);
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const s = a[i]; a[i] = a[j]; a[j] = s; }
  return a;
}

console.log('MÊME DONNÉE, MÊME CODE D’INSERTION, TROIS ARBRES');
console.log('');
console.log('      n   ordre d’insertion   hauteur   log₂(n)   coût moyen d’une recherche');
console.log('  -----   -----------------   -------   -------   --------------------------');
const RESUME = {};
[1000, 5000].forEach(function (n) {
  const trie = []; for (let i = 0; i < n; i++) trie.push(i);
  const arbres = [];
  let croissant = null; trie.forEach(function (v) { croissant = inserer(croissant, v); });
  arbres.push({ nom: 'croissant', racine: croissant });
  let hasard = null; melanger(trie, 20260914 + n).forEach(function (v) { hasard = inserer(hasard, v); });
  arbres.push({ nom: 'tiré au sort', racine: hasard });
  arbres.push({ nom: 'équilibré', racine: equilibre(trie) });
  arbres.forEach(function (a) {
    let s = 0;
    for (let i = 0; i < n; i++) s += chercher(a.racine, i);
    const moy = s / n;
    RESUME[n + '/' + a.nom] = { h: hauteur(a.racine), moy: moy };
    console.log('  ' + String(n).padStart(5) + '   ' + a.nom.padEnd(17) + '   ' +
      String(hauteur(a.racine)).padStart(7) + '   ' + Math.log2(n).toFixed(2).padStart(7) + '   ' +
      moy.toFixed(2).padStart(26));
  });
  console.log('');
});

/* La hauteur seule coûte peu : on peut monter beaucoup plus haut. */
console.log('LA HAUTEUR SEULE, SUR DES TAILLES PLUS GRANDES');
console.log('        n   croissant   équilibré   ⌈log₂(n+1)⌉   au hasard (moyenne de 20 mélanges)   rapport à log₂n');
console.log('  -------   ---------   ---------   -----------   ----------------------------------   ---------------');
[1000, 10000, 100000].forEach(function (n) {
  const trie = []; for (let i = 0; i < n; i++) trie.push(i);
  let somme = 0;
  for (let k = 0; k < 20; k++) {
    let r = null;
    melanger(trie, 900000 + k * 7 + n).forEach(function (v) { r = inserer(r, v); });
    somme += hauteur(r);
  }
  const moyenne = somme / 20;
  console.log('  ' + String(n).padStart(7) + '   ' + String(n).padStart(9) + '   ' +
    String(hauteur(equilibre(trie))).padStart(9) + '   ' + String(Math.ceil(Math.log2(n + 1))).padStart(11) + '   ' +
    moyenne.toFixed(2).padStart(34) + '   ' + (moyenne / Math.log2(n)).toFixed(2).padStart(15));
});
console.log('');
console.log('La hauteur d’un arbre bâti au hasard n’est PAS log₂(n) : le rapport mesuré');
console.log('vaut entre 2 et 2,5 ici, et il monte lentement avec n. La valeur vers laquelle');
console.log('il tend est connue : 4,311·ln(n), soit ' + (4.311 * Math.LN2).toFixed(2) + '·log₂(n) — moins un terme');
console.log('correctif en ln(ln n), qui explique qu’on soit encore en dessous à n = 100 000.');
console.log('Vérification du terme dominant seul, à ces trois tailles :');
[1000, 10000, 100000].forEach(function (n) {
  console.log('  n = ' + String(n).padStart(6) + '   4,311·ln(n) = ' + (4.311 * Math.log(n)).toFixed(2) +
    '   moins 1,953·ln(ln n) = ' + (4.311 * Math.log(n) - 1.953 * Math.log(Math.log(n))).toFixed(2));
});
console.log('Un facteur CONSTANT dans tous les cas : la classe reste O(log n), et c’est');
console.log('tout ce que la notation retient. La constante, elle, vaut environ 3.');

console.log('');
console.log('LECTURE');
console.log('  · Insérées en ordre CROISSANT, les valeurs ne descendent jamais à gauche :');
console.log('    l’arbre est une liste chaînée déguisée. Sa hauteur vaut n, et une recherche');
console.log('    coûte (n+1)/2 en moyenne — exactement comme un parcours de tableau.');
console.log('  · Insérées au HASARD, la hauteur reste un petit multiple de log₂(n), et la');
console.log('    recherche devient logarithmique. C’est un résultat de probabilités, pas');
console.log('    une garantie : l’ordre croissant fait partie des ordres possibles.');
console.log('  · Construit ÉQUILIBRÉ, l’arbre atteint la hauteur minimale, ⌈log₂(n+1)⌉.');
console.log('');
console.log('L’écart entre le premier et le dernier, à n = 5000 :');
console.log('  dégénéré : ' + RESUME['5000/croissant'].moy.toFixed(1) + ' comparaisons   équilibré : ' +
  RESUME['5000/équilibré'].moy.toFixed(1) + '   rapport : ' +
  Math.round(RESUME['5000/croissant'].moy / RESUME['5000/équilibré'].moy) + ' fois');
console.log('  hauteur ' + RESUME['5000/croissant'].h + ' contre ' + RESUME['5000/équilibré'].h +
  ' — et le code d’insertion est le MÊME.');
console.log('');
console.log('C’EST POURQUOI LES VRAIES STRUCTURES SE RÉÉQUILIBRENT. Un arbre rouge-noir,');
console.log('un AVL ou un B-arbre font le même travail que ci-dessus plus une réorganisation');
console.log('après chaque insertion, dont le seul but est de garder la hauteur en O(log n).');
console.log('Sans elle, une donnée déjà triée — le cas le plus fréquent — ruine la structure.');
