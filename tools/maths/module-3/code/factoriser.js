/* L'asymétrie sur laquelle repose RSA : dire QU'IL EXISTE un facteur est facile,
   TROUVER ce facteur est cher. On mesure les deux sur le même nombre. */

function estPremier(n) {                        // combien de divisions pour répondre oui/non
  let d1 = 0;
  if (n < 2) return { premier: false, divisions: 0 };
  for (let d = 2; d * d <= n; d++) { d1++; if (n % d === 0) return { premier: false, divisions: d1 }; }
  return { premier: true, divisions: d1 };
}

function factoriser(n) {                        // combien pour trouver le facteur
  let divisions = 0;
  for (let d = 2; d * d <= n; d++) {
    divisions++;
    if (n % d === 0) return { facteurs: [d, n / d], divisions: divisions };
  }
  return { facteurs: [n], divisions: divisions };
}

// Un semi-premier : le produit de deux premiers de taille voisine. C'est la forme d'une clé RSA.
const cas = [
  [1000003, 'premier'],
  [999983 * 2, 'pair : le premier essai suffit'],
  [104729 * 104723, 'semi-premier, facteurs proches de 100 000'],
  [999983 * 999979, 'semi-premier, facteurs proches de 1 000 000'],
];
console.log('nombre                 nature                                       divisions');
for (const [n, quoi] of cas) {
  console.log(String(n).padEnd(23) + quoi.padEnd(45) + factoriser(n).divisions);
}

// Le fond de l'affaire : le coût de la factorisation naïve suit la RACINE du nombre.
console.log('');
console.log('chiffres du semi-premier   divisions pour le casser   racine du nombre');
const petits = [101, 1009, 10007, 100003, 1000003];
for (let i = 0; i < petits.length; i++) {
  const n = petits[i] * petits[i];
  const f = factoriser(n);
  console.log(String(String(n).length).padEnd(27) + String(f.divisions).padEnd(27) + Math.round(Math.sqrt(n)));
}
console.log('=> deux chiffres de plus au nombre, c\'est dix fois plus de travail.');

// Et la dissymétrie, sur le même nombre.
const n = 999983 * 999979;
const t = estPremier(n), f = factoriser(n);
console.log('');
console.log('sur ' + n + ' :');
console.log('  repondre « est-ce premier ? » par la methode naive : ' + t.divisions + ' divisions');
console.log('  trouver le facteur                                 : ' + f.divisions + ' divisions');
console.log('  facteurs trouves : ' + f.facteurs.join(' x ') + '  -> produit ' + (f.facteurs[0] * f.facteurs[1]));
console.log('ici les deux couts sont EGAUX : la methode naive fait le meme travail.');
console.log('la dissymetrie vient d\'ailleurs — il existe des tests de primalite qui ne');
console.log('divisent pas du tout, et aucune methode aussi rapide pour factoriser.');
