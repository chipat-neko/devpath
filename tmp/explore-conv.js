'use strict';
const fs = require('fs'), path = require('path');
function walk(d, out){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p,out); else if(/lecon-\d+\.html$/.test(e.name)) out.push(p);} return out; }
const files = walk('pages', []);
// Extraire les blocs <code class="language-XXX">...</code>
const langCount = {};
const patterns = {}; // motif de commentaire -> count
let blocks = 0;
const RE_BLOCK = /<code class="language-([a-z0-9+#-]+)">([\s\S]*?)<\/code>/gi;
for(const f of files){
  const src = fs.readFileSync(f,'utf8');
  let m;
  while((m = RE_BLOCK.exec(src))){
    blocks++;
    const lang = m[1];
    langCount[lang] = (langCount[lang]||0)+1;
    // décoder les entités minimales pour analyser
    const code = m[2];
    // Chercher motifs de sortie attendue
    // JS/C-like: // ... ; Python/shell: # ...
    const lines = code.split('\n');
    for(const ln of lines){
      // motif "=>" dans un commentaire
      let mm;
      if((mm = ln.match(/\/\/\s*=>/))) patterns['//=>'] = (patterns['//=>']||0)+1;
      else if((mm = ln.match(/\/\/\s*affiche/i))) patterns['// affiche'] = (patterns['// affiche']||0)+1;
      else if((mm = ln.match(/#\s*=>/))) patterns['#=>'] = (patterns['#=>']||0)+1;
      else if((mm = ln.match(/#\s*affiche/i))) patterns['# affiche'] = (patterns['# affiche']||0)+1;
      else if((mm = ln.match(/#\s*sortie/i))) patterns['# sortie'] = (patterns['# sortie']||0)+1;
      else if((mm = ln.match(/\/\/\s*sortie/i))) patterns['// sortie'] = (patterns['// sortie']||0)+1;
    }
  }
}
console.log('Blocs de code total:', blocks);
console.log('\n--- Langages (top 25) ---');
Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log(`  ${k.padEnd(14)} ${v}`));
console.log('\n--- Motifs de sortie attendue ---');
Object.entries(patterns).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`  ${k.padEnd(14)} ${v}`));
