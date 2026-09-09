'use strict';
/**
 * tools/preuves/sonde-erreur-nommee.js — MESURER, avant d'écrire une règle, combien de
 * blocs en panne portent dans un COMMENTAIRE le nom de l'erreur qu'ils lèvent.
 *
 * POURQUOI. `verif-js.js` ne compte pas comme panne une erreur que la page ANNONCE, mais
 * son détecteur ne connaît que des mots français (`erreur`, `throw`, `échoue`…). Or les
 * leçons écrivent le plus souvent le NOM TECHNIQUE : `//=> TypeError: Assignment to
 * constant variable.` La question est de savoir combien de blocs cela concerne, et
 * surtout si la règle candidate reclasse quelque chose qu'elle ne devrait pas.
 *
 * ENTRÉE : la sortie de `node tools/verif-js.js --erreurs` (lignes « KO fichier #n — msg »).
 *   node tools/verif-js.js --erreurs > ko.txt
 *   node tools/preuves/sonde-erreur-nommee.js ko.txt
 *
 * SORTIE : pour chaque bloc en panne, le verdict des DEUX règles candidates —
 *   NOM   : un commentaire cite le nom de l'erreur levée ;
 *   TEXTE : ce commentaire cite EN PLUS le début du message.
 * Rien n'est modifié : cette sonde ne fait que rendre la mesure jugeable à l'œil.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..', '..');

function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsJs(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var re = /<figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">([\s\S]*?)<\/code>/g, m;
  while ((m = re.exec(src))) out.push(dec(m[2]).trim());
  return out;
}

/* Les commentaires SEULS : une erreur nommée dans une chaîne ou dans un `throw new
   TypeError(...)` du code n'est pas une annonce faite à l'apprenant. */
function commentairesDe(code) {
  var out = [];
  code.replace(/\/\*[\s\S]*?\*\//g, function (c) { out.push(c); return c; });
  code.replace(/(^|[^:"'`\\])\/\/[^\n]*/gm, function (c) { out.push(c); return c; });
  return out.join('\n');
}

var lignes = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
var nom = 0, texte = 0, rien = 0, tot = 0;
lignes.forEach(function (l) {
  var m = /^\s*KO\s+(\S+)\s+#(\d+)\s+(?:\[[^\]]*\]\s+)?— (.*)$/.exec(l);
  if (!m) return;
  tot++;
  var code = blocsJs(path.join(RACINE, m[1]))[Number(m[2]) - 1];
  var msg = m[3];
  var com = commentairesDe(code);
  var nm = /^([A-Za-z]*Error)\b:?\s*([\s\S]*)$/.exec(msg);
  var aNom = nm && new RegExp('\\b' + nm[1] + '\\b').test(com);
  var debut = nm ? nm[2].split(/\s+/).slice(0, 3).join(' ') : '';
  var aTexte = aNom && debut && com.toLowerCase().indexOf(debut.toLowerCase()) !== -1;
  var verdict = aTexte ? 'NOM+TEXTE' : (aNom ? 'NOM      ' : '  -      ');
  if (aTexte) texte++; else if (aNom) nom++; else rien++;
  if (aNom) {
    console.log(verdict + '  ' + m[1] + ' #' + m[2] + '  — ' + msg);
    com.split('\n').filter(function (c) { return nm && new RegExp('\\b' + nm[1] + '\\b').test(c); })
       .forEach(function (c) { console.log('            commentaire : ' + c.trim()); });
  }
});
console.log('\n=== ' + tot + ' blocs en panne examinés ===');
console.log('  nom + début du message dans un commentaire : ' + texte);
console.log('  nom seul dans un commentaire ..............: ' + nom);
console.log('  aucun commentaire nommant l\'erreur ........: ' + rien);
