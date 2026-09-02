var fs = require('fs');
var s = fs.readFileSync(__dirname + '/analyse-journal.js', 'utf8');

var avant = "  lignes.push('volume servi ....... ' + taille(stat.octets));";
var ajout = [
  avant,
  "  var taux = stat.valides ? (stat.echecs.length / stat.valides) * 100 : 0;",
  '  lignes.push("taux d\'échec ....... " + taux.toFixed(1) + " %");',
].join('\n');

if (s.split(avant).length - 1 !== 1) { console.log('ancre KO'); process.exit(1); }
fs.writeFileSync(__dirname + '/solution-modif.js', s.replace(avant, ajout));
console.log('solution-modif.js écrit');
