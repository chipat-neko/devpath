/* Une note de version dit « corrigé en 1.10.0 ». Ta version est la 1.9.3.
   Es-tu concerné ? La question a l'air triviale et se trompe une fois sur deux,
   parce qu'un numéro de version n'est PAS un texte, et pas non plus un nombre. */

console.log('En texte  : "1.10.0" > "1.9.0" ?', '1.10.0' > '1.9.0');
console.log('En nombre : parseFloat("1.10") =', parseFloat('1.10'), '| parseFloat("1.9") =', parseFloat('1.9'));

/* La règle est celle du versionnage sémantique : MAJEUR.MINEUR.CORRECTIF, et
   l'on compare les trois nombres l'un après l'autre — pas la chaîne entière. */
function comparer(a, b) {
  const na = a.split('.').map(Number);
  const nb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((na[i] || 0) !== (nb[i] || 0)) return (na[i] || 0) < (nb[i] || 0) ? -1 : 1;
  }
  return 0;
}

/* Quatre paires de vraies versions sémantiques — la convention exige TROIS
   nombres —, plus une cinquième qui n'en est pas une : « 1.2 » n'est pas une
   version sémantique valide, et c'est justement pour ça qu'elle est là. Les
   outils l'acceptent en complétant par un zéro ; la convention, non. */
const PAIRES = [
  ['1.9.0', '1.10.0'],
  ['1.9.3', '1.10.0'],
  ['2.0.0', '1.99.99'],
  ['1.0.10', '1.0.9'],
  ['1.2', '1.2.0'],
];
const CONFORME = /^\d+\.\d+\.\d+$/;
console.log('\ncomparaison de versions (< : la première est antérieure)');
let trompe = 0, valides = 0;
for (const [a, b] of PAIRES) {
  const r = comparer(a, b);
  const ok = CONFORME.test(a) && CONFORME.test(b);
  if (ok) valides++;
  const seTrompe = (r < 0) !== (a < b);
  if (seTrompe && ok) trompe++;
  console.log('  ' + a.padEnd(9) + (r < 0 ? '<' : r > 0 ? '>' : '=') + '  ' + b.padEnd(9) +
    '   en texte : ' + (a < b ? '<' : a > b ? '>' : '=') +
    (seTrompe ? '   ← le texte se trompe' : '') +
    (ok ? '' : '   (« ' + a + ' » n’est pas une version sémantique valide)'));
}
console.log('\nSur les ' + valides + ' paires de versions VALIDES, la comparaison');
console.log('textuelle se trompe ' + trompe + ' fois.');

/* Et la question de départ : suis-je concerné par « corrigé en 1.10.0 » ? */
const MIENNE = '1.9.3';
const CORRIGE = '1.10.0';
console.log('\nJ’ai la ' + MIENNE + ', le correctif est dans la ' + CORRIGE + '.');
console.log('Je suis concerné :', comparer(MIENNE, CORRIGE) < 0);

/* Ce que MAJEUR.MINEUR.CORRECTIF promet — et le seul de ces trois nombres qui
   autorise l'auteur à casser ton code. */
const REGLES = [
  ['CORRECTIF', '1.9.3 → 1.9.4', 'correction, aucune interface ne change'],
  ['MINEUR', '1.9.3 → 1.10.0', 'ajout, l’ancien code marche toujours'],
  ['MAJEUR', '1.9.3 → 2.0.0', 'RUPTURE : ton code peut cesser de marcher'],
];
console.log('\nCe que le numéro annonce :');
for (const [nom, exemple, sens] of REGLES) {
  console.log('  ' + nom.padEnd(10) + exemple.padEnd(16) + sens);
}

/* Le piège que la convention elle-même documente : avant la 1.0.0, elle ne
   promet rien. Tout peut changer à tout moment, y compris en 0.x.y → 0.x.(y+1). */
console.log('\nET LA CLAUSE QU’ON OUBLIE : tout ce qui précède ne vaut qu’à partir');
console.log('de la 1.0.0. Avant, la convention ne promet RIEN — 0.4.0 → 0.5.0 a');
console.log('le droit de tout casser, et c’est écrit dans la règle elle-même.');
