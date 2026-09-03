'use strict';
const fs = require('fs'), path = require('path');
const RACINE = path.join(__dirname, '..', '..', '..');
const src = fs.readFileSync(path.join(RACINE, 'js', 'lecon.js'), 'utf8');
const m = src.match(/function slugify\(s\) \{[\s\S]*?\n  \}/);
const slugify = new Function('"use strict";' + m[0] + '; return slugify;')();

const cas = ['Les tableaux', 'Portée et fermetures', 'C++ ou C# ?', 'Le cœur du problème',
  'Un « bœuf » et une sœur', '.NET et Node.js', 'ES2015 (ES6)', '日本語', '¿Qué?', '   ',
  '???', '2 + 2', 'Straße', 'naïve — résumé', 'A B', 'Ⅻ siècle', 'ﬁchier', 'Ångström'];
console.log('| entrée | sortie |');
for (const c of cas) {
  let r; try { r = JSON.stringify(slugify(c)); } catch (e) { r = '!! ' + e.name + ': ' + e.message; }
  console.log(JSON.stringify(c).padEnd(24) + ' -> ' + r);
}
for (const v of [null, undefined, 42, ['a'], {}]) {
  let r; try { r = JSON.stringify(slugify(v)); } catch (e) { r = '!! ' + e.constructor.name + ': ' + e.message; }
  console.log(String(v === undefined ? 'undefined' : JSON.stringify(v)).padEnd(24) + ' -> ' + r);
}
/* titres réels du site contenant œ ou une ligature */
function lecons(dir, acc) { acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name);
    if (e.isDirectory()) lecons(p, acc); else if (/^lecon-\d+\.html$/.test(e.name)) acc.push(p); } return acc; }
let n = 0, ex = [];
for (const f of lecons(path.join(RACINE, 'pages'))) {
  const html = fs.readFileSync(f, 'utf8');
  const art = html.match(/<article class="prose"[\s\S]*?<\/article>/); if (!art) continue;
  for (const h of art[0].matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/g)) {
    const t = h[2].replace(/<[^>]*>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
    if (/[œŒæÆß]/.test(t)) { n++; if (ex.length < 6) ex.push([path.relative(RACINE, f), t, slugify(t)]); }
  }
}
console.log('\ntitres réels contenant œ/æ/ß : ' + n);
ex.forEach((e) => console.log('  ' + e[0] + '  « ' + e[1] +' » -> ' + e[2]));
