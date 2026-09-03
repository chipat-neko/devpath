/* Corpus B — l'anglais que l'apprenant lit SANS l'avoir cherché : les messages
   d'erreur du moteur. Ils ne sont pas traduits, ils ne le seront jamais, et ce
   sont les premiers mots anglais qu'un débutant francophone doit comprendre.

   Le corpus n'est pas recopié : chaque message est PROVOQUÉ ici et lu tel que
   le moteur l'écrit. Un message qui changerait avec la version du moteur
   changerait donc ce relevé — c'est voulu.

   USAGE : node tools/doc/mesures/messages-erreur.js [--json]              */
'use strict';

/* Chaque entrée : un programme qui casse, et rien d'autre. */
const CASSURES = [
  ['appel sur undefined', () => { const o = {}; o.methode(); }],
  ['propriété d une valeur nulle', () => { const o = null; return o.x; }],
  ['variable jamais déclarée', () => { /* eslint-disable-next-line */ return inconnue; }],
  ['lecture avant let', () => { { return zzz; let zzz = 1; } }],
  ['réaffectation d une constante', () => { const c = 1; eval('c = 2'); }],
  ['récursion sans fin', () => { const f = () => f(); f(); }],
  ['tableau de taille absurde', () => new Array(-1)],
  ['toFixed hors bornes', () => (1).toFixed(101)],
  ['JSON invalide', () => JSON.parse('{a:1}')],
  ['JSON circulaire', () => { const o = {}; o.self = o; return JSON.stringify(o); }],
  ['syntaxe invalide', () => eval('function (')],
  ['appel d un nombre', () => { const n = 3; return n(); }],
  ['new sur une flèche', () => { const f = () => 1; return new f(); }],
  ['itérer un nombre', () => { for (const x of 3) { void x; } }],
  ['déstructurer undefined', () => { const { a } = undefined; return a; }],
  ['symbole vers nombre', () => Symbol('s') + 1],
  ['BigInt et nombre', () => eval('1n + 1')],
  ['normalize inconnue', () => 'a'.normalize('NFZ')],
  ['encodeURI mal formé', () => encodeURIComponent('\ud800')],
  ['expression régulière invalide', () => new RegExp('(')],
  ['propriété en lecture seule', () => { 'use strict'; const o = Object.freeze({ a: 1 }); o.a = 2; }],
  ['étendre un non-itérable', () => [...{ a: 1 }]],
  ['Object.create sur un nombre', () => Object.create(3)],
  ['appel de super absent', () => eval('class A extends Object { constructor(){ this.x = 1; } } new A()')],
  ['argument non fonction', () => [1, 2].map('non')],
  ['radix hors bornes', () => (255).toString(99)],
];

function relever() {
  const messages = [];
  for (const [nom, fn] of CASSURES) {
    let ligne = null;
    try { fn(); } catch (e) { ligne = { nom, type: e.constructor.name, message: e.message }; }
    if (!ligne) { console.error('ARRÊT : « ' + nom + ' » n a levé aucune erreur.'); process.exit(1); }
    messages.push(ligne);
  }
  return messages;
}

/* Les mots anglais qui reviennent d'un message à l'autre. Un mot vu dans un
   seul message n'apprend rien ; un mot vu dans cinq est du vocabulaire. */
function motsFrequents(messages) {
  const par = new Map();
  for (const m of messages) {
    const vus = new Set();
    for (const w of (m.type + ' ' + m.message).matchAll(/[A-Za-z][A-Za-z']+/g)) vus.add(w[0].toLowerCase());
    for (const w of vus) par.set(w, (par.get(w) || 0) + 1);
  }
  return [...par.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
}

module.exports = { relever, motsFrequents, CASSURES };

if (require.main === module) {
  const messages = relever();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(messages, null, 1)); process.exit(0); }
  console.log(messages.length + ' erreurs provoquées, ' + messages.length + ' messages relevés :\n');
  for (const m of messages) console.log('  ' + m.nom.padEnd(32) + m.type + ': ' + m.message);
  console.log('\nMots présents dans au moins 3 messages :');
  for (const [w, n] of motsFrequents(messages)) if (n >= 3) console.log('  ' + String(n).padStart(3) + '  ' + w);
}
