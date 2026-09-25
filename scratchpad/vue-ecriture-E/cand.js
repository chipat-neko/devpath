"use strict";
// usage: node cand.js <fichier> <texte...>   -> metriques brutes d'un candidat
var fs=require("fs"),path=require("path");
var RACINE=path.join(__dirname,"..","..");
function motsLongs(t){var w=String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g)||[];return w.map(function(x){return x.replace(/^[' -]+|[' -]+$/g,"");}).filter(Boolean);}
function nmots(t){return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g)||[]).length;}
function densite(t){var w=t.match(/[A-Za-zÀ-ÿ0-9_]+/g)||[];return w.length?w.join("").length/w.length:0;}
function vocabulaire(src){return new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g," ")));}
var f=process.argv[2];
var src=fs.readFileSync(path.join(RACINE,"pages","vue",f),"utf8");
var voc=vocabulaire(src);
process.argv.slice(3).forEach(function(t){
  var ml=motsLongs(t);
  var abs=Array.from(new Set(ml)).filter(function(m){return !voc.has(m);});
  var nine=Array.from(new Set(t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g)||[]));
  console.log("len="+t.length+" mots="+nmots(t)+" w="+ml.length+" k="+abs.length+" dens="+densite(t).toFixed(3));
  console.log("   absents="+JSON.stringify(abs));
  console.log("   9+="+JSON.stringify(nine));
  console.log("   "+t);
});
