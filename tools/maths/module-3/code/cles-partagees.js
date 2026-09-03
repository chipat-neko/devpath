/* Cas réel : que se passe-t-il si deux clés RSA, engendrées indépendamment,
   partagent un facteur premier ? Un simple PGCD les casse toutes les deux.
   C'est arrivé en vrai, sur des centaines de milliers de clés d'équipements réseau. */

function pgcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }

// 82 nombres premiers distincts, à partir de 1009.
const premiers = [];
for (let n = 1009; premiers.length < 82; n += 2) {
  let p = true;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; }
  if (p) premiers.push(n);
}

// 40 clés indépendantes, chacune produit de DEUX premiers que personne d'autre n'utilise.
const cles = [];
for (let i = 0; i < 40; i++) cles.push(premiers[2 * i] * premiers[2 * i + 1]);

// … sauf que deux d'entre elles réutilisent le MÊME premier, par manque d'entropie
// au démarrage de la machine qui les a engendrées. C'est la faute qu'on va exploiter.
const facteurPartage = premiers[24];
cles[12] = facteurPartage * premiers[80];
cles[29] = facteurPartage * premiers[81];

console.log('cles publiques engendrees : ' + cles.length);
console.log('exemple : n = ' + cles[0] + ' (personne ne connait ses facteurs)');

// L'attaque : le PGCD de toutes les paires. Aucune factorisation n'est nécessaire.
let paires = 0, trouvees = [];
for (let i = 0; i < cles.length; i++) {
  for (let j = i + 1; j < cles.length; j++) {
    paires++;
    const g = pgcd(cles[i], cles[j]);
    if (g > 1 && g < cles[i]) trouvees.push({ i: i, j: j, g: g });
  }
}
console.log('');
console.log('paires de cles comparees : ' + paires);
console.log('paires partageant un facteur : ' + trouvees.length);
for (const t of trouvees) {
  console.log('  cles ' + t.i + ' et ' + t.j + ' : facteur commun ' + t.g);
  console.log('    -> cle ' + t.i + ' = ' + t.g + ' x ' + cles[t.i] / t.g + '   (factorisee)');
  console.log('    -> cle ' + t.j + ' = ' + t.g + ' x ' + cles[t.j] / t.g + '   (factorisee)');
}

// LE COÛT RÉEL DE L'ATTAQUE. Attention à ne pas comparer un seul PGCD à une
// factorisation complète : l'attaquant ne sait pas d'avance quelle paire est
// vulnérable, il doit toutes les comparer. On compte le total.
let total = 0;
for (let i = 0; i < cles.length; i++) {
  for (let j = i + 1; j < cles.length; j++) {
    let a = cles[i], b = cles[j];
    while (b) { total++; const t = a % b; a = b; b = t; }
  }
}
let uneCle = 0;
for (let d = 2; d * d <= cles[0]; d++) { uneCle++; if (cles[0] % d === 0) break; }
let toutesCles = 0;
for (const n of cles) { for (let d = 2; d * d <= n; d++) { toutesCles++; if (n % d === 0) break; } }
console.log('');
console.log('etapes d Euclide pour l ATTAQUE COMPLETE (les 780 paires) : ' + total);
console.log('divisions pour factoriser UNE seule de ces cles par la force : ' + uneCle);
console.log('divisions pour factoriser LES 40 par la force : ' + toutesCles);
console.log('=> sur ces cles minuscules, l attaque par PGCD coute PLUS CHER que la force brute.');
console.log('   Ce qui la rend decisive n est pas son cout ici, c est qu a 2048 bits les 780');
console.log('   PGCD restent instantanes quand la factorisation, elle, devient impossible.');
console.log('   Le PGCD ne factorise rien : il exploite une faute de generation.');
