/* Où sont les obligations d'un texte normatif ?
   On ne lit pas une RFC de quarante pages : on y cherche ses mots-clés. Voici
   le résultat de cette recherche sur la spécification publiée juste au-dessus —
   ses lignes normatives, extraites du texte exact à la fabrication de la page,
   avec leur numéro et la section où elles vivent. */

const RELEVE = /*@@SPEC@@*/null;

console.log('Le texte fait ' + RELEVE.total + ' lignes et ' + RELEVE.sections + ' sections.');
console.log(RELEVE.lignes.length + ' d’entre elles portent un mot-clé normatif, soit ' +
  Math.round((RELEVE.lignes.length / RELEVE.total) * 100) + ' % du texte.');

/* On ne compte que les MAJUSCULES : « must » dans une phrase ordinaire n'engage
   personne, et c'est précisément pour cela que la convention existe.
   « MUST NOT » contient « MUST » : on retire le plus long d'abord, sinon la même
   obligation serait comptée deux fois. */
const MOTS = ['MUST NOT', 'MUST', 'SHOULD NOT', 'SHOULD', 'MAY'];
const total = {};
for (const mot of MOTS) total[mot] = 0;

const parSection = {};
for (const l of RELEVE.lignes) {
  let reste = l.texte;
  let n = 0;
  for (const mot of MOTS) {
    let pos;
    while ((pos = reste.indexOf(mot)) !== -1) {
      total[mot]++;
      n++;
      reste = reste.slice(0, pos) + ' '.repeat(mot.length) + reste.slice(pos + mot.length);
    }
  }
  parSection[l.section] = (parSection[l.section] || 0) + n;
}

console.log('');
for (const mot of MOTS) console.log('  ' + mot.padEnd(11) + String(total[mot]).padStart(3));

console.log('\nOù ces mots-clés se trouvent :');
const noms = Object.keys(parSection).sort(function (a, b) { return parSection[b] - parSection[a]; });
for (const n of noms) console.log('  ' + String(parSection[n]).padStart(3) + '  ' + n);

/* Le piège de ce comptage, et il vaut pour toutes les RFC : la section qui
   DÉFINIT les mots-clés en est pleine, et n'impose rien du tout. Un classement
   par fréquence met donc en tête la seule section qu'on peut sauter. */
const definition = noms.filter(function (n) { return /Requirements Language/.test(n); })[0];
if (definition) {
  const somme = noms.reduce(function (a, n) { return a + parSection[n]; }, 0);
  console.log('\nEn tête du classement : « ' + definition + ' », avec ' + parSection[definition] +
    ' mots-clés');
  console.log('sur ' + somme + '. C’est la section qui les DÉFINIT : elle n’impose rien.');
  console.log('Obligations réelles : ' + (somme - parSection[definition]) +
    ', réparties sur ' + (noms.length - 1) + ' sections.');
  console.log('\nCompter n’est pas comprendre : la section la plus « normative »');
  console.log('au comptage est la seule qu’on puisse ignorer.');
}
