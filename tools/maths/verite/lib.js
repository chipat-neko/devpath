/* tools/maths/verite/lib.js — la seule chose que les contrôles de vérité ont le
   droit de partager : la lecture du HTML PUBLIÉ.

   POURQUOI. Le cours `maths` est déjà tenu par deux contrôles : `verif-sorties`
   rejoue chaque programme et compare sa sortie au bloc publié ; `verif-chiffres`
   exige que chaque nombre de la prose vienne d'une sortie. Les deux ont le même
   angle mort : ils font confiance au PROGRAMME. Si le programme calcule faux, il
   calcule faux des deux côtés, et tout reste vert — c'est très exactement ce qui
   est arrivé au module 1 (`lois.js` additionnait 2^n après un arrêt anticipé et
   annonçait 78 pour 76 ; les deux contrôles étaient verts).

   Les fichiers `groupe-*.js` recalculent donc les faits du cours PAR UNE AUTRE
   MÉTHODE — énumération exhaustive, force brute, arithmétique exacte en BigInt —
   sans jamais lire ni réutiliser le code publié, puis confrontent le résultat au
   texte de la page. Ce module ne fournit que l'accès au texte publié : aucune
   arithmétique n'y vit, pour qu'aucun contrôle ne puisse emprunter sa réponse. */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..', '..', '..');
const PAGES = path.join(RACINE, 'pages', 'maths');

function chemin(n) {
  return path.join(PAGES, 'lecon-' + String(n).padStart(2, '0') + '.html');
}

function html(n) {
  return fs.readFileSync(chemin(n), 'utf8');
}

/* Les entités que le générateur pose dans un bloc de code, et elles seules. */
function deshtml(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/* Tous les blocs `<figure class="code-block" data-file="…">` d'une leçon,
   indexés par leur nom de fichier. Programmes ET sorties. */
function blocs(n) {
  const h = html(n);
  const re = /<figure class="code-block" data-file="([^"]+)"><pre><code[^>]*>([\s\S]*?)<\/code><\/pre><\/figure>/g;
  const out = {};
  let m;
  while ((m = re.exec(h))) out[m[1]] = deshtml(m[2]);
  if (!Object.keys(out).length) throw new Error('leçon ' + n + ' : aucun bloc de code trouvé');
  return out;
}

/* La sortie publiée d'un programme, exigée présente : une faute de nom doit
   arrêter le contrôle, jamais le rendre vert par absence. */
function sortie(n, nom) {
  const b = blocs(n);
  if (!Object.prototype.hasOwnProperty.call(b, nom)) {
    throw new Error('leçon ' + n + ' : bloc « ' + nom + ' » introuvable');
  }
  return b[nom];
}

/* Le texte VISIBLE de la leçon : prose, tableaux et encadrés, sans les blocs de
   code ni le balisage. Sert aux affirmations écrites en toutes lettres. */
function texte(n) {
  let h = html(n);
  const art = h.match(/<article class="prose"[\s\S]*?<\/article>/);
  h = art ? art[0] : h;
  return deshtml(
    h.replace(/<figure class="code-block"[\s\S]*?<\/figure>/g, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/[\s ]+/g, ' ');
}

/* Un nombre écrit à la française dans la page : « 65 536 », « 4 294 967 296 »
   (espace insécable ou non), « 0,0014 ». Rendu sous forme comparable. */
function frNombre(x, decimales) {
  let s;
  if (typeof decimales === 'number') s = Number(x).toFixed(decimales);
  else s = String(x);
  const neg = s[0] === '-';
  if (neg) s = s.slice(1);
  const p = s.split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg ? '-' : '') + p.join(',');
}

module.exports = { RACINE, chemin, html, blocs, sortie, texte, deshtml, frNombre };
