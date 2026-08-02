const fs = require('fs');
const DIRS = ["js-avance"];
const FILE = 'js/search-index.js';
const src = fs.readFileSync(FILE,'utf8');
const prefix = src.slice(0, src.indexOf('['));
const suffix = src.slice(src.lastIndexOf(']')+1);
const arr = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']')+1));

const NAMED = {nbsp:' ',lt:'<',gt:'>',amp:'&',quot:'"',apos:"'",eacute:'é',egrave:'è',agrave:'à',ccedil:'ç',ocirc:'ô',ecirc:'ê',icirc:'î',ucirc:'û',acirc:'â',euml:'ë',iuml:'ï',uuml:'ü',ouml:'ö',auml:'ä',ugrave:'ù',times:'×',hellip:'…',mdash:'—',ndash:'–',rsquo:'’',lsquo:'‘',ldquo:'“',rdquo:'”',laquo:'«',raquo:'»',deg:'°',copy:'©',rarr:'→',larr:'←',uarr:'↑',darr:'↓',middot:'·',bull:'•',trade:'™',reg:'®',sup2:'²',sup3:'³',frac12:'½',euro:'€',pound:'£'};
function decode(s){s=s.replace(/&#x([0-9a-fA-F]+);/g,(_,h)=>String.fromCodePoint(parseInt(h,16)));s=s.replace(/&#(\d+);/g,(_,d)=>String.fromCodePoint(parseInt(d,10)));s=s.replace(/&([a-zA-Z][a-zA-Z0-9]*);/g,(m,n)=>NAMED[n]!==undefined?NAMED[n]:m);return s;}
function extractX(html){let s=html.match(/<article class="prose">([\s\S]*?)<\/article>/)[1];s=s.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<style[\s\S]*?<\/style>/g,' ').replace(/<[^>]+>/g,' ');return decode(s).replace(/\s+/g,' ').trim();}
function extractT(html){return decode(html.match(/<h1 class="lesson-header__title">([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();}

let n=0;
const newArr = arr.map(e=>{
  if(!DIRS.includes(e.d)) return e;
  const html = fs.readFileSync('pages/'+e.d+'/'+e.f,'utf8');
  n++;
  return {d:e.d, f:e.f, t:extractT(html), x:extractX(html)};
});
const out = prefix + JSON.stringify(newArr) + suffix;
fs.writeFileSync(FILE, out, {encoding:'utf8'});
console.log('régénéré', n, 'entrées pour', DIRS.join(','), '| total', newArr.length);
