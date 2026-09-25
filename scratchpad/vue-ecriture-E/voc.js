var fs=require("fs"),path=require("path");
var RACINE=path.join(__dirname,"..","..");
function motsLongs(t){var w=String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g)||[];return w.map(function(x){return x.replace(/^[' -]+|[' -]+$/g,"");}).filter(Boolean);}
var src=fs.readFileSync(path.join(RACINE,"pages","vue",process.argv[2]),"utf8");
var voc=Array.from(new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g," ")))).sort();
console.log(voc.join(" "));
