"use strict";
var fs=require("fs"),path=require("path"),cp=require("child_process");
var RACINE=path.join(__dirname,"..","..");
function motsLongs(t){var w=String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g)||[];return w.map(function(x){return x.replace(/^[' -]+|[' -]+$/g,"");}).filter(Boolean);}
function nmots(t){return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g)||[]).length;}
function densite(t){var w=t.match(/[A-Za-zÀ-ÿ0-9_]+/g)||[];return w.length?w.join("").length/w.length:0;}
function argMax(v){var m=Math.max.apply(null,v);return v.reduce(function(a,x,i){if(x===m)a.push(i);return a;},[]);}
function argMin(v){var m=Math.min.apply(null,v);return v.reduce(function(a,x,i){if(x===m)a.push(i);return a;},[]);}
function questionsDe(src){var out=[],m,re=/<script[^>]*type="application\/json"[^>]*data-(?:quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g;
 while((m=re.exec(src))){if(/data-exos/.test(m[0]))continue;var v=null;try{v=JSON.parse(m[1]);}catch(e){continue;}
 if(Array.isArray(v))v.forEach(function(q){if(q&&Array.isArray(q.a))out.push(q);});}return out;}
function vocabulaire(src){return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g," ")));}
var f=process.argv[2];
var onlyQ=process.argv[3]?Number(process.argv[3]):null;
var disque=fs.readFileSync(path.join(RACINE,"pages","vue",f),"utf8");
var refSrc=cp.execSync("git show HEAD:pages/vue/"+f,{cwd:RACINE,encoding:"utf8",maxBuffer:64*1024*1024});
var qd=questionsDe(disque),qr=questionsDe(refSrc),vd=vocabulaire(disque),vr=vocabulaire(refSrc);
function sig(q,vocab){
 var L=q.a.map(function(t){return t.length;});var tri=L.slice().sort(function(a,b){return b-a;});
 var sets=q.a.map(function(t){return new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g)||[]);});
 return {L:L,rang:L.map(function(v){return tri.indexOf(v);}),dense:argMax(q.a.map(densite)),bavarde:argMin(q.a.map(nmots)),
  w:q.a.map(function(t){return motsLongs(t).length;}),
  k:q.a.map(function(t){return Array.from(new Set(motsLongs(t))).filter(function(m){return !vocab.has(m);});}),
  x:sets.map(function(s,i){var o=[];s.forEach(function(m){if(!sets.some(function(p,j){return j!==i&&p.has(m);}))o.push(m);});return o;}),
  nm:q.a.map(nmots),dv:q.a.map(densite)};
}
qd.forEach(function(q,i){
 if(onlyQ!==null&&i+1!==onlyQ)return;
 var A=sig(qr[i],vr),B=sig(q,vd);
 console.log("=== q"+(i+1)+" correct="+q.correct+" : "+q.q);
 // fenetre : trier longueurs ref
 var sorted=A.L.slice().sort(function(a,b){return b-a;});
 q.a.forEach(function(t,j){
  var r=A.rang[j];
  var hi=r>0?sorted[r-1]:Infinity, lo=r<sorted.length-1?sorted[r+1]:0;
  console.log((j===q.correct?" *B":" d"+j)+" refLen="+A.L[j]+" rang="+r+"  fenetre=]"+lo+".."+(hi===Infinity?"inf":hi)+"[  now="+B.L[j]+(B.L[j]===A.L[j]?"":"  <<CHANGE"));
  console.log("      w "+A.w[j]+"->"+B.w[j]+"  k "+A.k[j].length+"->"+B.k[j].length+"  x "+A.x[j].length+"->"+B.x[j].length+"  mots "+A.nm[j]+"->"+B.nm[j]+"  dens "+A.dv[j].toFixed(3)+"->"+B.dv[j].toFixed(3));
  console.log("      kREF="+JSON.stringify(A.k[j])+"  kNOW="+JSON.stringify(B.k[j]));
  console.log("      xREF="+JSON.stringify(A.x[j])+"  xNOW="+JSON.stringify(B.x[j]));
  console.log("      TXT: "+t);
 });
 console.log("   dense "+JSON.stringify(A.dense)+"->"+JSON.stringify(B.dense)+"   bavarde "+JSON.stringify(A.bavarde)+"->"+JSON.stringify(B.bavarde));
 console.log("");
});
