/* =============================================================================
   tools/cas-reels/extraction.js — trouver les « Cas réel » d'une page, et juger
   s'ils tiennent LA RÈGLE (V18, B1 et B3). Module partagé : `inventaire.js` et
   `verif-contenu.js` lisent les cas réels avec CE code, pas avec deux copies qui
   divergeraient (leçon du V16 : un diagnostic doit être la copie exacte de l'outil).

   LA RÈGLE (B3 du CHANTIER-V18) — un « Cas réel » nomme son SUJET, sa DATE et sa
   SOURCE, sous cette forme :

     <p class="callout__title">Cas réel — Knight Capital (2012)</p>      sujet, date
     <p>… le récit, qui ne dit que ce que dit la source …</p>
     <p class="cas-reel__source">Source : SEC, ordonnance 34-70694, 16 octobre 2013.</p>

   - SUJET : le titre porte, après « Cas réel » et un séparateur (—, –, :), le nom de
     ce dont il parle ;
   - DATE : le titre porte une année (19xx ou 20xx) ;
   - SOURCE : le cas se termine par un <p class="cas-reel__source"> qui commence par
     « Source » et nomme un document daté (une année) ou porte un lien.
   La même forme vaut pour une section dont l'intertitre <h2>/<h3> est « Cas réel… ».
   Ce qui ne peut pas être sourcé n'est pas un « Cas réel » : c'est un « Scénario ».
   ============================================================================= */
"use strict";

var ENTITES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", rsquo: "’", lsquo: "‘",
  laquo: "«", raquo: "»", hellip: "…", mdash: "—", ndash: "–", eacute: "é", egrave: "è", agrave: "à",
  ccedil: "ç", ecirc: "ê", times: "×", rarr: "→", larr: "←", le: "≤", ge: "≥", ne: "≠", thinsp: " ",
  euro: "€", deg: "°", middot: "·", rdquo: "”", ldquo: "“", minus: "−" };
function decoder(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCodePoint(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCodePoint(parseInt(d, 10)); })
    .replace(/&([a-z]+);/gi, function (m, n) { return Object.prototype.hasOwnProperty.call(ENTITES, n) ? ENTITES[n] : m; });
}
function texte(html) {
  return decoder(String(html).replace(/<[^>]*>/g, " ")).replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();
}

var RE_TITRE_CAS = /^Cas r[ée]el\b/i;
var RE_ANNEE = /\b(19[5-9]\d|20[0-3]\d)\b/;

/* Les « Cas réel » d'une page HTML (scripts retirés par l'appelant ou ici).
   On part de chaque TITRE d'encadré, pas de chaque <div> : 23 encadrés ferment par
   « </div> », saut de ligne, « </div> », et une recherche ancrée sur le <div> laissait
   l'encadré PRÉCÉDENT avaler le « Cas réel » qui le suit (mesuré au B1 : 1 477 trouvés
   contre 1 500 titres). Le corps s'arrête au premier « </div> » suivi d'un « </div> ». */
function extraire(html) {
  html = String(html).replace(/<script[\s\S]*?<\/script>/gi, "");
  var res = [], m;
  var RE_TITRE_P = /<p class="callout__title">([\s\S]*?)<\/p>/g;
  while ((m = RE_TITRE_P.exec(html))) {
    var avant = html.slice(Math.max(0, m.index - 2000), m.index);
    var types = avant.match(/<div class="callout callout--([a-z]+)"/g);
    var type = types ? /callout--([a-z]+)/.exec(types[types.length - 1])[1] : "?";
    var suite = html.slice(RE_TITRE_P.lastIndex);
    var fin = /<\/div>\s*<\/div>/.exec(suite);
    res.push({ pos: m.index, type: type, titreHtml: m[1], corpsHtml: fin ? suite.slice(0, fin.index) : suite.slice(0, 4000) });
  }
  /* L'AUTRE FORME : un intertitre <h2>/<h3> « Cas réel… » suivi de sa prose (51 leçons :
     offensive, crypto, neurones, maths…). Un <h2> s'arrête au <h2> suivant, un <h3> au
     <h2> ou <h3> suivant. Une section qui ENVELOPPE un encadré « Cas réel » est déjà
     comptée par lui (213 cas mesurés au B1) : on ne la garde pas. */
  var RE_H = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/g;
  while ((m = RE_H.exec(html))) {
    if (!RE_TITRE_CAS.test(texte(m[2]))) continue;
    var reste = html.slice(RE_H.lastIndex);
    var stop = (m[1] === "2" ? /<h2[\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/ :
                               /<h[23][\s>]|<\/article>|<\/main>|<nav[\s>]|<footer[\s>]/).exec(reste);
    var corpsH = stop ? reste.slice(0, stop.index) : reste.slice(0, 6000);
    if (/<p class="callout__title">\s*Cas r[ée]el/i.test(corpsH)) continue;
    res.push({ pos: m.index, type: "section", titreHtml: m[2], corpsHtml: corpsH });
  }
  res.sort(function (a, b) { return a.pos - b.pos; });
  var cas = [], rang = 0;
  res.forEach(function (x) {
    var titre = texte(x.titreHtml);
    if (!RE_TITRE_CAS.test(titre)) return;
    cas.push({ rang: ++rang, type: x.type, titre: titre, corpsHtml: x.corpsHtml, corps: texte(x.corpsHtml) });
  });
  return cas;
}

/* Le jugement de LA RÈGLE, mécanique et déterministe. L'identifiabilité du sujet ne se
   juge pas ici (c'est une lecture humaine, faite dans les lots B4 à B12) : on exige ce
   qu'un récit inventé ne peut pas fournir honnêtement — un sujet nommé, une date, une
   source datée. */
function conformite(cas) {
  var raisons = [];
  var sujet = cas.titre.replace(RE_TITRE_CAS, "").replace(/^\s*[—–:\-]\s*/, "").trim();
  if (sujet === cas.titre.replace(RE_TITRE_CAS, "").trim() && sujet) sujet = "";   /* pas de séparateur */
  if (!/[A-Za-zÀ-ÿ]{2}/.test(sujet)) raisons.push("titre sans sujet");
  if (!RE_ANNEE.test(cas.titre)) raisons.push("titre sans date");
  var ps = String(cas.corpsHtml).match(/<p class="cas-reel__source"[^>]*>[\s\S]*?<\/p>/gi) || [];
  if (!ps.length) raisons.push("pas de source");
  else {
    var src = ps[ps.length - 1];
    var t = texte(src);
    if (!/^Sources?\s*:/.test(t) || t.replace(/^Sources?\s*:\s*/, "").length < 15) raisons.push("source vide");
    else if (!RE_ANNEE.test(t) && !/<a\s[^>]*href="https?:\/\//i.test(src)) raisons.push("source sans date ni lien");
  }
  return { conforme: raisons.length === 0, raisons: raisons, sujet: sujet };
}

module.exports = { extraire: extraire, conformite: conformite, texte: texte, decoder: decoder,
                   RE_TITRE_CAS: RE_TITRE_CAS, RE_ANNEE: RE_ANNEE };
