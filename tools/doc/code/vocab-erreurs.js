/* Le seul anglais que tu liras sans l'avoir cherché : les messages du moteur.
   Ils ne sont pas traduits et ne le seront jamais. Ils suivent presque tous la
   même forme : Type : sujet + ce qu'il n'est pas, ou Cannot + ce qu'on tentait. */

const cassures = [
  ['appeler ce qui n’est pas une fonction', function () { const o = {}; o.demarrer(); }],
  ['lire dans une valeur nulle', function () { const o = null; return o.x; }],
  ['employer un nom jamais déclaré', function () { return typeofInconnu(); }],
  ['écrire dans une constante', function () { const c = 1; eval('c = 2'); }],
  ['descendre trop profond', function () { const f = function () { return f(); }; return f(); }],
  ['sortir des bornes autorisées', function () { return (1).toFixed(101); }],
  ['analyser du JSON invalide', function () { return JSON.parse('{a:1}'); }],
  ['parcourir ce qui n’est pas parcourable', function () { for (const x of 3) { void x; } }],
];

const types = {};
let isNot = 0, cannot = 0;

for (const paire of cassures) {
  try {
    paire[1]();
    console.log(paire[0] + ' → rien ne s’est passé (?)');
  } catch (e) {
    types[e.name] = (types[e.name] || 0) + 1;
    if (/ is not /.test(e.message)) isNot++;
    if (/^Cannot /.test(e.message)) cannot++;
    console.log(paire[0] + '\n    ' + e.name + ': ' + e.message);
  }
}

console.log('---');
console.log('familles rencontrées :', Object.keys(types).sort().join(', '));
console.log('messages en « … is not … » :', isNot, '| messages en « Cannot … » :', cannot);
