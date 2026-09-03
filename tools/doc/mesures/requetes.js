/* Mesure de la leçon 04 : FORMULER la question.

   Un débutant colle son message d'erreur en entier dans un moteur de recherche
   et ne trouve rien, parce que ce message contient le nom de SES variables.
   Cette mesure le démontre au lieu de le dire, en deux volets :

   VOLET 1 — le squelette. Le même défaut est provoqué DEUX fois, avec des noms
   différents. Les deux messages sont comparés mot à mot (plus longue
   sous-séquence commune) : ce qui reste est la part STABLE, écrite par le
   moteur, et c'est elle qu'on cherche. Ce qui saute est la part VARIABLE,
   écrite par toi, et c'est elle qui rend une recherche stérile.

   VOLET 2 — un message, plusieurs causes. Six programmes qui n'ont rien à voir
   produisent le même message au caractère près. Le message seul ne suffit donc
   pas : c'est mesuré, pas affirmé.

   Aucun message n'est recopié : tous sont PROVOQUÉS ici et lus tels que le
   moteur les écrit.

   USAGE : node tools/doc/mesures/requetes.js [--json]                       */
'use strict';

/* ---------------------------------------------------------------- volet 1 */
/* Deux variantes du même défaut, avec des noms et des valeurs différents. */
const PAIRES = [
  {
    nom: 'lire une propriété sur undefined',
    a: () => { const client = {}; return client.adresse.ville; },
    b: () => { const commande = {}; return commande.livraison.date; },
  },
  {
    nom: 'appeler ce qui n’est pas une fonction',
    a: () => { const total = 12; return total(); },
    b: () => { const etiquette = 'x'; return etiquette(); },
  },
  {
    nom: 'variable jamais déclarée',
    a: () => monCompteur + 1,
    b: () => resultatFinal + 1,
  },
  {
    nom: 'lire une propriété sur null',
    a: () => { const session = null; return session.jeton; },
    b: () => { const noeud = null; return noeud.parent; },
  },
  {
    nom: 'itérer ce qui n’est pas itérable',
    a: () => { for (const x of 42) void x; },
    b: () => { for (const y of true) void y; },
  },
  {
    nom: 'déstructurer une valeur absente',
    a: () => { const { prenom } = undefined; return prenom; },
    b: () => { const { largeur } = undefined; return largeur; },
  },
  {
    nom: 'écrire dans un objet gelé',
    a: () => { 'use strict'; const reglage = Object.freeze({ pas: 1 }); reglage.pas = 2; },
    b: () => { 'use strict'; const barème = Object.freeze({ seuil: 9 }); barème.seuil = 8; },
  },
  {
    nom: 'JSON mal formé',
    a: () => JSON.parse('{cle:1}'),
    b: () => JSON.parse('{champ:2}'),
  },
];

function messageDe(fn, nom) {
  try { fn(); } catch (e) { return { type: e.constructor.name, texte: e.message }; }
  throw new Error('« ' + nom + ' » n’a levé aucune erreur — la mesure serait creuse.');
}

/* Découpe en unités comparables : les mots, les nombres, et chaque signe de
   ponctuation séparément (les guillemets encadrant un nom doivent rester
   stables quand le nom, lui, change). */
function decouper(s) {
  return s.match(/[A-Za-z_$][\w$]*|\d+|\S|\s+/g) || [];
}

/* Plus longue sous-séquence commune, en unités. Ce qui y figure est écrit par
   le moteur ; ce qui n'y figure pas vient de ton code. */
function lcs(x, y) {
  const n = x.length, m = y.length;
  const t = [];
  for (let i = 0; i <= n; i++) t.push(new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      t[i][j] = x[i - 1] === y[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]);
    }
  }
  /* remontée : on marque les unités de x retenues */
  const garde = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (x[i - 1] === y[j - 1]) { garde[i - 1] = true; i--; j--; }
    else if (t[i - 1][j] >= t[i][j - 1]) i--;
    else j--;
  }
  return garde;
}

/* Le squelette : les unités communes, les autres remplacées par un seul « … ».
   C'est, mot pour mot, la requête à taper. */
function squelette(x, garde) {
  const out = [];
  let trou = false;
  for (let k = 0; k < x.length; k++) {
    if (garde[k]) { out.push(x[k]); trou = false; }
    else if (!trou) { out.push('…'); trou = true; }
  }
  return out.join('').replace(/\s+/g, ' ').trim();
}

function volet1() {
  const lignes = PAIRES.map(function (p) {
    const a = messageDe(p.a, p.nom + ' (a)');
    const b = messageDe(p.b, p.nom + ' (b)');
    if (a.type !== b.type) {
      throw new Error('« ' + p.nom + ' » : les deux variantes lèvent des types différents (' +
        a.type + ' / ' + b.type + ') — ce n’est pas le même défaut.');
    }
    const x = decouper(a.texte), y = decouper(b.texte);
    const garde = lcs(x, y);
    /* On ne compte que les unités qui portent du sens : ni les espaces, ni la
       ponctuation. Sinon un message plein de parenthèses paraîtrait stable. */
    const porteuses = x.map(function (u, k) { return { u, k }; })
      .filter(function (o) { return /[A-Za-z_$\d]/.test(o.u); });
    const stables = porteuses.filter(function (o) { return garde[o.k]; }).length;
    return {
      nom: p.nom,
      type: a.type,
      messageA: a.texte,
      messageB: b.texte,
      identiques: a.texte === b.texte,
      squelette: squelette(x, garde),
      unites: porteuses.length,
      stables,
      variables: porteuses.length - stables,
      pctStable: Math.round((stables / porteuses.length) * 100),
    };
  });
  const u = lignes.reduce(function (a, l) { return a + l.unites; }, 0);
  const s = lignes.reduce(function (a, l) { return a + l.stables; }, 0);
  return {
    paires: lignes,
    total: lignes.length,
    unites: u,
    stables: s,
    variables: u - s,
    pctStable: Math.round((s / u) * 100),
    /* Combien de ces défauts donnent le MÊME message malgré des noms
       différents : pour ceux-là, le copier-coller intégral marche. */
    identiques: lignes.filter(function (l) { return l.identiques; }).length,
  };
}

/* ---------------------------------------------------------------- volet 2 */
/* Six causes sans rapport entre elles, un seul et même message. */
const CAUSES = [
  ['un objet imbriqué qui n’existe pas', () => { const u = {}; return u.profil.nom; }],
  ['une fonction qui ne rend rien', () => { function chercher() { /* oubli du return */ } return chercher().nom; }],
  ['un tableau vide', () => { const t = []; return t[0].nom; }],
  ['un find qui ne trouve pas', () => [{ id: 1 }].find(function (x) { return x.id === 2; }).nom],
  ['une déstructuration d’un champ absent', () => { const { profil } = {}; return profil.nom; }],
  ['une faute de frappe sur la clé', () => { const u = { profil: { nom: 'a' } }; return u.proFil.nom; }],
];

/* Et le symétrique : deux programmes presque identiques, deux messages
   différents — donc deux recherches différentes. */
const VOISINS = [
  ['la valeur est null', () => { const o = null; return o.x; }],
  ['la valeur est undefined', () => { let o; return o.x; }],
];

function volet2() {
  const lignes = CAUSES.map(function (c) {
    const m = messageDe(c[1], c[0]);
    return { cause: c[0], type: m.type, message: m.texte };
  });
  const distincts = new Set(lignes.map(function (l) { return l.type + '|' + l.message; }));
  const voisins = VOISINS.map(function (c) {
    const m = messageDe(c[1], c[0]);
    return { cause: c[0], type: m.type, message: m.texte };
  });
  return {
    causes: lignes,
    nbCauses: lignes.length,
    messagesDistincts: distincts.size,
    voisins,
    voisinsDistincts: new Set(voisins.map(function (v) { return v.message; })).size,
  };
}

function mesurer() {
  const v1 = volet1(), v2 = volet2();
  return { v1, v2 };
}

module.exports = { mesurer };

if (require.main === module) {
  const m = mesurer();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(m, null, 2)); process.exit(0); }
  console.log('VOLET 1 — la part stable d’un message d’erreur');
  console.log('  ' + m.v1.total + ' défauts provoqués deux fois, avec des noms différents.');
  console.log('  unités porteuses de sens : ' + m.v1.unites + '  ·  stables : ' + m.v1.stables +
    '  ·  variables (les tiennes) : ' + m.v1.variables + '  → ' + m.v1.pctStable + ' % de stable');
  console.log('  messages identiques malgré des noms différents : ' + m.v1.identiques + ' / ' + m.v1.total);
  console.log('');
  for (const p of m.v1.paires) {
    console.log('  ' + p.nom);
    console.log('    a) ' + p.type + ': ' + p.messageA);
    console.log('    b) ' + p.type + ': ' + p.messageB);
    console.log('    → ' + p.squelette + '   (' + p.pctStable + ' % stable)');
  }
  console.log('');
  console.log('VOLET 2 — un message, plusieurs causes');
  console.log('  ' + m.v2.nbCauses + ' causes sans rapport → ' + m.v2.messagesDistincts + ' message(s) distinct(s)');
  for (const c of m.v2.causes) console.log('    ' + c.cause.padEnd(42) + ' ' + c.type + ': ' + c.message);
  console.log('  voisins : ' + m.v2.voisinsDistincts + ' message(s) distinct(s) pour ' + m.v2.voisins.length + ' programmes quasi identiques');
  for (const c of m.v2.voisins) console.log('    ' + c.cause.padEnd(42) + ' ' + c.type + ': ' + c.message);
}
