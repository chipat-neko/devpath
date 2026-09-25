/* k.js — mots de 6+ lettres d'un texte ABSENTS du corps d'une page. usage : node k.js lecon-NN.html "texte" ... */
var fs=require("fs"),path=require("path");
function mots(t){var w=String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g)||[];
 return w.map(function(x){return x.replace(/^['\s-]+|['\s-]+$/g,"")}).filter(Boolean);}
var f=process.argv[2];
var src=fs.readFileSync(path.join(__dirname,"..","..","pages","vue",f),"utf8")
  .replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g," ");
var voc=new Set(mots(src));
process.argv.slice(3).forEach(function(t){
  var L=Array.from(new Set(mots(t)));
  var et=L.filter(function(m){return !voc.has(m)});
  console.log("car="+t.length+" w="+mots(t).length+" k="+et.length+" "+JSON.stringify(et));
});
