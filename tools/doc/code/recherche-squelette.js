/* Ce que tu dois taper dans un moteur de recherche, calculé au lieu d'être
   deviné : on provoque DEUX FOIS le même défaut, avec des noms différents, et
   on garde ce que les deux messages ont en commun. */

function messageDe(fn) {
  try { fn(); } catch (e) { return e.message; }
  return '(aucune erreur)';
}

/* Découpe en unités : mots, nombres, et chaque signe séparément. */
function decouper(s) {
  return s.match(/[A-Za-z_$][\w$]*|\d+|\S|\s+/g) || [];
}

/* Plus longue sous-séquence commune : ce qui survit vient du moteur,
   ce qui saute vient de TON code. */
function communes(x, y) {
  var t = [], i, j;
  for (i = 0; i <= x.length; i++) { t.push(new Array(y.length + 1).fill(0)); }
  for (i = 1; i <= x.length; i++) {
    for (j = 1; j <= y.length; j++) {
      t[i][j] = x[i - 1] === y[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]);
    }
  }
  var garde = new Array(x.length).fill(false);
  i = x.length; j = y.length;
  while (i > 0 && j > 0) {
    if (x[i - 1] === y[j - 1]) { garde[i - 1] = true; i--; j--; }
    else if (t[i - 1][j] >= t[i][j - 1]) { i--; }
    else { j--; }
  }
  return garde;
}

function requete(fnA, fnB) {
  var a = messageDe(fnA), b = messageDe(fnB);
  var x = decouper(a), garde = communes(x, decouper(b));
  var out = [], trou = false, k;
  for (k = 0; k < x.length; k++) {
    if (garde[k]) { out.push(x[k]); trou = false; }
    else if (!trou) { out.push('…'); trou = true; }
  }
  var porteuses = 0, stables = 0;
  for (k = 0; k < x.length; k++) {
    if (/[A-Za-z_$0-9]/.test(x[k])) { porteuses++; if (garde[k]) stables++; }
  }
  return {
    a: a, b: b,
    squelette: out.join('').replace(/\s+/g, ' ').trim(),
    pct: Math.round((stables / porteuses) * 100),
  };
}

/* Trois défauts, chacun provoqué avec deux jeux de noms sans rapport. */
var CAS = [
  ['lire une propriété sur undefined',
    function () { var client = {}; return client.adresse.ville; },
    function () { var commande = {}; return commande.livraison.date; }],
  ['appeler ce qui n’est pas une fonction',
    function () { var total = 12; return total(); },
    function () { var etiquette = 'x'; return etiquette(); }],
  ['écrire dans un objet gelé',
    function () { 'use strict'; var reglage = Object.freeze({ pas: 1 }); reglage.pas = 2; },
    function () { 'use strict'; var bareme = Object.freeze({ seuil: 9 }); bareme.seuil = 8; }],
];

for (var n = 0; n < CAS.length; n++) {
  var r = requete(CAS[n][1], CAS[n][2]);
  console.log(CAS[n][0]);
  console.log('  ton message     : ' + r.a);
  console.log('  celui du voisin : ' + r.b);
  console.log('  À CHERCHER      : ' + r.squelette + '   (' + r.pct + ' % du message vient du moteur)');
}
