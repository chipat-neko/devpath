/* Pourquoi la taille d'une table de hachage est souvent un nombre premier.
   On ne l'affirme pas : on répartit les mêmes clés dans deux tables et on compte. */

// Des clés réelles ont une structure. Ici : des identifiants espacés de 8,
// comme des adresses mémoire alignées ou des numéros de commande par lots.
const cles = [];
for (let i = 0; i < 1000; i++) cles.push(1000 + i * 8);

function repartir(taille) {
  const seaux = new Array(taille).fill(0);
  for (const c of cles) seaux[c % taille]++;
  const utilises = seaux.filter((n) => n > 0).length;
  const max = Math.max.apply(null, seaux);
  const moyenne = cles.length / taille;
  return { utilises: utilises, max: max, moyenne: moyenne, taille: taille };
}

function ligne(r) {
  return ('taille ' + r.taille).padEnd(14) +
    ('seaux occupes ' + r.utilises + '/' + r.taille).padEnd(26) +
    ('plus gros seau ' + r.max).padEnd(20) +
    'ideal ' + r.moyenne.toFixed(1);
}

console.log(cles.length + ' cles, espacees de 8 : ' + cles.slice(0, 4).join(', ') + ', …');
console.log('');
console.log(ligne(repartir(64)));               // puissance de 2
console.log(ligne(repartir(61)));               // nombre premier voisin
console.log(ligne(repartir(1024)));
console.log(ligne(repartir(1021)));             // le plus grand premier sous 1024
console.log('avec 1024 cases, la proportion inutilisee vaut ' + (100 * (1024 - repartir(1024).utilises) / 1024).toFixed(1) + ' %');

// Le fond du problème : n % 64 ne regarde que les 6 derniers bits.
console.log('');
console.log('n            n % 64   n % 61');
for (const n of [1000, 1008, 1016, 1024, 1032]) {
  console.log(String(n).padEnd(13) + String(n % 64).padStart(6) + String(n % 61).padStart(8));
}
console.log('=> avec 64, toutes ces cles retombent sur des multiples de 8 : 8 seaux sur 64 seulement.');

// Et si les clés n'ont AUCUNE structure ? Le premier ne sert plus à rien.
let g = 20260903;
const tirage = () => ((g = (Math.imul(g, 1664525) + 1013904223) >>> 0) >>> 8);
const desordre = [];
for (let i = 0; i < 1000; i++) desordre.push(tirage());
function repartirSur(liste, taille) {
  const seaux = new Array(taille).fill(0);
  for (const c of liste) seaux[c % taille]++;
  return { utilises: seaux.filter((n) => n > 0).length, max: Math.max.apply(null, seaux), taille: taille, moyenne: liste.length / taille };
}
console.log('');
console.log('1000 AUTRES cles, sans aucune structure, tirees a graine fixe :');
console.log(ligne(repartirSur(desordre, 64)));
console.log(ligne(repartirSur(desordre, 61)));
console.log('=> le nombre premier ne repare pas un mauvais hachage : il protege des cles REGULIERES.');
