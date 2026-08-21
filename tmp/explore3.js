'use strict';
const fs = require('fs'), path = require('path');
function walk(d, out){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) walk(p,out); else if(/lecon-\d+\.html$/.test(e.name)) out.push(p);} return out; }
const files = walk('pages', []);
const RE_BLOCK = /<code class="language-javascript">([\s\S]*?)<\/code>/gi;
function decode(s){ return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&'); }
const dedic=[], inline=[];
for(const f of files){
  const src = fs.readFileSync(f,'utf8');
  let m;
  while((m = RE_BLOCK.exec(src))){
    const code = decode(m[1]);
    if(/^\/\/\s*=>/m.test(code) && dedic.length<2) dedic.push({f,code});
    if(/\bconsole\.log\([^\n]*\)\s*;?\s*\/\/\s*[^\n]/.test(code) && inline.length<3) {
      // inline avec console.log
      inline.push({f,code});
    }
  }
}
console.log('##### DÉDIÉ 1 ('+dedic[0].f+') #####');
console.log(dedic[0].code.slice(0,400));
console.log('\n##### INLINE 1 ('+inline[0].f+') #####');
console.log(inline[0].code.slice(0,400));
console.log('\n##### INLINE 2 ('+inline[1].f+') #####');
console.log(inline[1].code.slice(0,400));
