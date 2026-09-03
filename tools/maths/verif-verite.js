/* tools/maths/verif-verite.js — LE COURS DE MATHS, REJOUÉ DEPUIS ZÉRO.
   =====================================================================
   V15 · point F2.

   CE QU'IL FAIT, ET EN QUOI IL DIFFÈRE DES AUTRES
   -----------------------------------------------
   `verif-sorties` prouve que le bloc de sortie publié est bien ce que le
   programme publié produit. `verif-chiffres` prouve que les nombres de la prose
   viennent d'une sortie. Aucun des deux ne met en doute le PROGRAMME : s'il
   calcule faux, les deux restent verts. Le module 1 en a fait la démonstration —
   `lois.js` annonçait 78 propositions évaluées pour 76, sous deux contrôles verts.

   Celui-ci ne lit pas le code du cours. Il RECALCULE les faits par une autre
   méthode — énumération exhaustive, force brute, arithmétique exacte en BigInt,
   décodage binaire des flottants — puis confronte le résultat au texte PUBLIÉ.
   Quand le cours dit « 253 paires », ce contrôle compte les paires lui-même ;
   quand il dit « 50,7 % », ce contrôle refait le produit ; quand il dit qu'un
   nombre est premier, ce contrôle essaie tous les diviseurs.

   Il est donc le seul outil du dépôt capable de voir un cours de mathématiques
   qui se trompe en étant parfaitement cohérent avec lui-même.

   USAGE   node tools/maths/verif-verite.js [--groupe N] [-v]
   SORTIE  0 si tout concorde, 1 sinon.
*/
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const VERBEUX = args.indexOf('-v') !== -1 || args.indexOf('--verbeux') !== -1;
const iG = args.indexOf('--groupe');
const SEUL = iG !== -1 ? args[iG + 1] : null;

const DIR = path.join(__dirname, 'verite');
const groupes = fs.readdirSync(DIR)
  .filter((f) => /^groupe-\d+\.js$/.test(f))
  .sort()
  .filter((f) => !SEUL || f === 'groupe-' + SEUL + '.js');

if (!groupes.length) {
  console.error('Aucun fichier groupe-N.js dans ' + DIR + '.');
  process.exit(2);
}

console.log('verif-verite.js — les faits du cours `maths`, recalculés par une autre méthode\n');

let total = 0, ok = 0;
const echecs = [];

for (const f of groupes) {
  let mod;
  try {
    mod = require(path.join(DIR, f));
  } catch (e) {
    console.log('  ' + f + ' : ARRÊT — ' + e.message);
    echecs.push({ groupe: f, nom: '(chargement)', detail: e.message });
    total++;
    continue;
  }
  const controles = typeof mod.controles === 'function' ? mod.controles() : mod.controles;
  if (!Array.isArray(controles) || !controles.length) {
    console.log('  ' + f + ' : ARRÊT — aucun contrôle rendu');
    echecs.push({ groupe: f, nom: '(vide)', detail: 'aucun contrôle rendu' });
    total++;
    continue;
  }
  const nEch = controles.filter((c) => !c.ok).length;
  console.log((nEch ? '  ✗ ' : '  ✓ ') + (mod.titre || f) +
    '   ' + (controles.length - nEch) + '/' + controles.length);
  for (const c of controles) {
    total++;
    if (c.ok) {
      ok++;
      if (VERBEUX) console.log('        OK   ' + c.nom);
    } else {
      echecs.push({ groupe: mod.titre || f, nom: c.nom, detail: c.detail || '' });
      console.log('        ÉCHEC  ' + c.nom + (c.detail ? '\n               ' + c.detail : ''));
    }
  }
}

console.log('\n=== RÉSUMÉ ===');
console.log('  groupes .......... ' + groupes.length);
console.log('  contrôles ........ ' + total);
console.log('  concordants ...... ' + ok);
console.log('  DIVERGENTS ....... ' + echecs.length);
if (!echecs.length) {
  console.log('\n  Chaque fait recalculé indépendamment concorde avec ce que la page publie.');
  process.exit(0);
}
console.log('');
process.exit(1);
