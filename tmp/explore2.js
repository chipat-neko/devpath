'use strict';
const fs = require('fs'), path = require('path');
function walk(d, out){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p,out); else if(/lecon-\d+\.html$/.test(e.name)) out.push(p);} return out; }
const files = walk('pages', []);
const RE_BLOCK = /<code class="language-javascript">([\s\S]*?)<\/code>/gi;
function decode(s){ return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&'); }
// Compter: blocs avec au moins une ligne de sortie attendue
let inlineEnd=0, dedicated=0, both=0;
const samples=[];
for(const f of files){
  const src = fs.readFileSync(f,'utf8');
  let m;
  while((m = RE_BLOCK.exec(src))){
    const code = decode(m[1]);
    const lines = code.split('\n');
    let hasDedic=false, hasInline=false;
    for(const ln of lines){
      const t = ln.trim();
      if(/^\/\/\s*(=>|affiche|sortie|résultat|resultat|retourne|renvoie)/i.test(t)) hasDedic=true;
      // inline: du code AVANT le commentaire, puis // qqch
      else if(/\S.*\/\/\s*(=>|affiche|sortie|résultat|resultat|retourne|renvoie|true|false|\d|\[|\{|"|')/i.test(ln) && !/^\s*\/\//.test(ln)) hasInline=true;
    }
    if(hasDedic) dedicated++;
    if(hasInline) inlineEnd++;
    if(hasDedic&&hasInline) both++;
    if(samples.length<3 && hasDedic && f.includes('js/lecon')) samples.push({f, code});
  }
}
console.log('Blocs JS avec ligne dédiée //=>/affiche/sortie :', dedicated);
console.log('Blocs JS avec commentaire inline de valeur   :', inlineEnd);
console.log('Blocs avec les deux                          :', both);
console.log('\n===== EXEMPLE 1 =====\n'+samples[0].code.slice(0,700));
