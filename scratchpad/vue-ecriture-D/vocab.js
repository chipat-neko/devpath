var fs=require("fs"),path=require("path");
function motsLongs(t){var w=String(t).toLowerCase().match(/[a-zà-öø-ÿ][a-zà-öø-ÿ'-]{5,}/g)||[];return w.map(function(x){return x.replace(/^[' -]+|[' -]+$/g,"");}).filter(Boolean);}
var f=process.argv[2];
var src=fs.readFileSync(path.join(__dirname,"..","..","pages","vue",f),"utf8");
var v=Array.from(new Set(motsLongs(src.replace(/<script[^>]*data-quiz(?:-bilan)?[^>]*>[\s\S]*?<\/script>/g," ")))).sort();
if(process.argv[3]){var re=new RegExp(process.argv[3]);v=v.filter(function(w){return re.test(w);});}
console.log(v.join(" "));
console.log("total "+v.length);
