'use strict';
/**
 * tools/verif-etiquette-blocs.js — LE BLOC DÉSIGNÉ EST-IL BIEN CELUI QU'ON EXÉCUTE ?
 *
 * POURQUOI CE CONTRÔLE EXISTE (2026-09-09, point B2b-15)
 * -----------------------------------------------------
 * `tools/verif-js.js` nomme chaque bloc en panne par le `data-file` de sa figure —
 * c'est ce nom qui envoie le lecteur au bon endroit. Son motif d'extraction n'était pas
 * BORNÉ par `</figure>` :
 *     <figure class="code-block"([^>]*)>[\s\S]*?<code class="language-javascript">…
 * le `[\s\S]*?` traversait donc les figures. Quand une figure NON JavaScript précédait
 * une figure JavaScript, l'attribut venait de la PREMIÈRE et le code de la SECONDE :
 * **629 blocs sur 1 987 portaient le nom d'un fichier qui n'a jamais eu de bouton**
 * (`index.html`, `Terminal`, `.github/workflows/deploy.yml`…). Le verdict restait juste —
 * le code exécuté était le bon — mais le diagnostic mentait, et le lecteur du rapport
 * partait corriger un YAML qui n'avait jamais porté de bouton.
 *
 * CE QU'IL VÉRIFIE, ET POURQUOI CE N'EST PAS UNE TAUTOLOGIE
 * --------------------------------------------------------
 * Il LIT `blocsJs` dans `tools/verif-js.js` — jamais ne la recopie, même discipline que
 * `verif-js.js` avec `js/runner.js` — puis il refait l'appariement PAR UNE AUTRE VOIE :
 * un découpage figure par figure, chaque figure jugée sur son seul contenu. Les deux
 * doivent tomber d'accord sur le nombre de blocs, sur le code de chacun et sur son nom.
 * Un motif qui redeviendrait glissant, quelle qu'en soit l'écriture, ferait rougir ce
 * contrôle : il ne teste pas une expression, il teste une correspondance.
 *
 *   node tools/verif-etiquette-blocs.js
 * Code de sortie : 1 dès qu'un bloc n'est pas apparié au `data-file` de sa propre figure.
 */
var fs = require('fs');
var path = require('path');
var RACINE = path.resolve(__dirname, '..');

/* La fonction d'extraction est LUE dans `verif-js.js`, comme les règles du bouton sont
   lues dans `runner.js` : ce contrôle doit juger CE QUE L'OUTIL FAIT, pas une copie. */
function lireBlocsJs() {
  var src = fs.readFileSync(path.join(RACINE, 'tools', 'verif-js.js'), 'utf8');
  function corps(nom) {
    var i = src.indexOf('function ' + nom + '(');
    if (i < 0) throw new Error(nom + ' introuvable dans tools/verif-js.js');
    var j = src.indexOf('\n}', i);
    if (j < 0) throw new Error('fin de ' + nom + ' introuvable');
    return src.slice(i, j + 2);
  }
  var fab = new Function('fs', corps('dec') + '\n' + corps('blocsJs') + '\nreturn blocsJs;');
  return fab(fs);
}

/* L'AUTRE VOIE : on découpe le fichier en figures, et chaque figure est jugée SEULE.
   Aucune expression ne court d'une figure à l'autre, donc aucun glissement n'est
   possible — c'est la définition même de ce qu'on veut prouver. */
function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function blocsParFigure(fichier) {
  var src = fs.readFileSync(fichier, 'utf8'), out = [];
  var morceaux = src.split('<figure class="code-block"');
  for (var i = 1; i < morceaux.length; i++) {
    var fin = morceaux[i].indexOf('</figure>');
    var figure = fin < 0 ? morceaux[i] : morceaux[i].slice(0, fin);
    var chevron = figure.indexOf('>');
    if (chevron < 0) continue;
    var attrs = figure.slice(0, chevron);
    var dedans = figure.slice(chevron + 1);
    var code = dedans.match(/<code class="language-javascript">([\s\S]*?)<\/code>/);
    if (!code) continue;
    var df = attrs.match(/data-file="([^"]*)"/);
    out.push({ code: dec(code[1]).trim(), fichier: df ? df[1] : '' });
  }
  return out;
}

function lecons() {
  var out = [];
  (function marche(d) {
    var st; try { st = fs.statSync(d); } catch (e) { return; }
    if (st.isFile()) { if (/lecon-\d+\.html$/.test(d)) out.push(d); return; }
    for (var f of fs.readdirSync(d)) marche(path.join(d, f));
  })(path.join(RACINE, 'pages'));
  return out;
}

var blocsJs = lireBlocsJs();
var pages = 0, blocs = 0, ecarts = [];
lecons().forEach(function (f) {
  var rel = path.relative(RACINE, f).split(path.sep).join('/');
  var a = blocsJs(f), b = blocsParFigure(f);
  pages++;
  if (a.length !== b.length) {
    ecarts.push(rel + ' : ' + a.length + ' bloc(s) extrait(s) contre ' + b.length + ' figure(s) JavaScript');
    return;
  }
  for (var i = 0; i < a.length; i++) {
    blocs++;
    if (a[i].code !== b[i].code) {
      ecarts.push(rel + ' #' + (i + 1) + ' : le CODE extrait n est pas celui de la figure');
    } else if (a[i].fichier !== b[i].fichier) {
      ecarts.push(rel + ' #' + (i + 1) + ' : nomme [' + a[i].fichier + '] alors que sa figure porte [' + b[i].fichier + ']');
    }
  }
});

console.log('verif-etiquette-blocs — ' + blocs + ' bloc(s) JavaScript sur ' + pages + ' lecon(s)');
if (ecarts.length) {
  console.log('\n' + ecarts.length + ' bloc(s) mal apparie(s) :');
  ecarts.slice(0, 40).forEach(function (l) { console.log('   ' + l); });
  if (ecarts.length > 40) console.log('   … et ' + (ecarts.length - 40) + ' autre(s)');
  console.log('\nECHEC — un rapport qui nomme le mauvais fichier envoie corriger le mauvais bloc.');
  process.exit(1);
}
console.log('  Chaque bloc est apparie au data-file de SA figure.');
