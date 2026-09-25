/* Remplacements litteraux, une seule occurrence exigee. usage: node applique.js lot.json
   lot.json : [ {"f":"lecon-10.html","de":"...","a":"..."} , ... ] */
var fs=require("fs"),path=require("path");
var RACINE=path.join(__dirname,"..","..");
var LOTS=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
LOTS.forEach(function(l){
  var p=path.join(RACINE,"pages","vue",l.f);
  var t=fs.readFileSync(p,"utf8");
  var n=t.split(l.de).length-1;
  if(n!==1){console.log("REFUS "+l.f+" : "+n+" occurrence(s) — "+l.de.slice(0,40));process.exitCode=1;return;}
  fs.writeFileSync(p,t.split(l.de).join(l.a),"utf8");
  console.log("ok "+l.f+" : "+l.de.slice(0,45)+" -> "+l.a.slice(0,45));
});
