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

/* Deux pièges de ce comptage, et ils valent pour toutes les RFC.
   PREMIER : tous les mots-clés ne sont pas des obligations. Seuls MUST et
   MUST NOT obligent ; SHOULD recommande, MAY autorise. Compter les cinq
   ensemble gonfle le total de plus de moitié.
   SECOND : la section qui DÉFINIT les mots-clés en est pleine — mais elle n'est
   pas vide d'obligations pour autant, et c'est la surprise de ce relevé. */
const obligations = total['MUST'] + total['MUST NOT'];
console.log('\nSur ' + Object.keys(total).reduce(function (a, m) { return a + total[m]; }, 0) +
  ' mots-clés, ' + obligations + ' obligent vraiment (MUST et MUST NOT).');
console.log('Les ' + (total['SHOULD'] + total['SHOULD NOT']) + ' SHOULD recommandent et les ' +
  total['MAY'] + ' MAY autorisent : ni les uns ni les autres n’obligent.');

const definition = noms.filter(function (n) { return /Requirements Language/.test(n); })[0];
if (definition) {
  console.log('\nEn tête du classement : « ' + definition + ' », avec ' +
    parSection[definition] + ' mots-clés.');
  /* Combien d'entre eux sont des obligations que cette section IMPOSE, plutôt
     que des mots qu'elle définit ? On regarde ses lignes une par une. */
  const sienne = RELEVE.lignes.filter(function (l) { return l.section === definition; });
  const imposees = sienne.filter(function (l) {
    return /(MUST|MUST NOT)/.test(l.texte) && !/^(MUST|MUST NOT|SHOULD|SHOULD NOT|MAY)\b/.test(l.texte) &&
      !/key words/.test(l.texte) && !/Note the asymmetry/.test(l.texte);
  });
  console.log('C’est la section qui les DÉFINIT — et pourtant elle en IMPOSE ' +
    imposees.length + ' :');
  for (const l of imposees) console.log('  ligne ' + l.ligne + ' : ' + l.texte);
  console.log('\nLa seconde engage le lecteur, et elle n’est écrite nulle part ailleurs.');
  console.log('Sauter « la section qu’on peut sauter » coûte donc une obligation.');
}
