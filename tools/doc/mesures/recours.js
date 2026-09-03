/* Mesure de la leçon 04 : le site est-il une île ?

   ⚠ CE FICHIER A ÉTÉ RÉÉCRIT DEUX FOIS APRÈS RELECTURE, ET C'EST LE CAS RÉEL
   QUE LA LEÇON RACONTE.

   PREMIÈRE VERSION — motifs larges, résultat publié : « 80 leçons renvoient
   l'apprenant chercher ailleurs ». Échantillonnés un par un, les matchs étaient
   pour l'essentiel le SUJET et non le geste :
     – « stack overflow » désignait un DÉBORDEMENT DE PILE dans 8 leçons sur 18 ;
     – « assistant de » attrapait l'assistant de configuration de Vue, celui de
       création de projet de Vite, et l'assistant de preuve Coq ;
     – « LLM » attrapait les douze leçons du cours qui ENSEIGNE les LLM ;
     – « moteur de recherche » attrapait l'index inversé, le SEO et Yandex ;
     – « href="http » matchait des liens ÉCHAPPÉS dans des blocs de code.

   DEUXIÈME VERSION — motifs resserrés, 23 leçons. Réchantillonnée à la main,
   elle restait fausse, et d'une façon plus instructive :
     – compilation/lecon-11 : « **ne cherche pas** la documentation — demande-lui
       son bytecode ». Le motif comptait l'exact contraire d'un renvoi ;
     – markdown/lecon-03 : « Consulte la [documentation][doc]. » est un EXEMPLE
       de syntaxe Markdown, pas un conseil ;
     – mobile/lecon-02 : « on **va voir** les trois grandes familles » ;
     – les cinq mentions de « Stack Overflow » parlaient de la panne de 2016, de
       l'enquête annuelle, ou du bouton « copier » de son interface.

   TROISIÈME VERSION, celle-ci. Distinguer « cherche dans la doc » (un conseil)
   de « ne cherche pas la documentation » (son contraire) suppose de lire la
   phrase, et aucun motif ne lit une phrase. On a donc CHANGÉ DE MESURE plutôt
   que de forcer le motif — ce que la leçon enseigne par ailleurs. Ne restent
   que deux faits DURS, non ambigus, que n'importe qui peut recompter :

     1. combien de leçons portent une VRAIE balise de lien vers l'extérieur
        (hors blocs de code) — c'est-à-dire une porte de sortie ;
     2. combien NOMMENT Stack Overflow ou un assistant de code — le site en
        parle, la question restant de savoir s'il en dit quoi que ce soit
        d'utile (échantillonné à la main : non, jamais comme conseil de méthode).

   Le cours « doc » est exclu du corpus (corpus-lib s'en charge) : une leçon qui
   se compterait elle-même se périmerait le jour de sa publication — c'est
   arrivé en D1.

   USAGE : node tools/doc/mesures/recours.js [--json] [--echantillon]          */
'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('./corpus-lib.js');

const MOTIFS = {
  lienExterne: {
    libelle: 'portent une vraie balise de lien vers l’extérieur',
    /* Une balise <a> réelle, jamais un &lt;a&gt; échappé dans un bloc de code :
       celui-là est du texte enseigné, pas une porte de sortie. */
    re: /<a\b[^>]*href="https?:\/\//i,
    surHtml: true,
  },
  nomment: {
    libelle: 'nomment Stack Overflow ou un assistant de code',
    /* « Stack Overflow » exige ses majuscules et son espace : en minuscules,
       « stack overflow » est le débordement de pile, et il apparaît dans huit
       leçons de langages système. */
    re: /Stack\s+Overflow|\bChatGPT\b|\bCopilot\b|\bIA g[ée]n[ée]rative\b/,
    exclut: /Stack\s*Overflow(Error|Exception)/,
  },
};

function sansBlocsDeCode(html) {
  return html.replace(/<figure class="code-block"[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ');
}

function mesurer() {
  const fichiers = lib.fichiersLecons();
  const cpt = {}, exemples = {};
  for (const k of Object.keys(MOTIFS)) { cpt[k] = 0; exemples[k] = []; }
  let avecPorte = 0;
  const coursPorte = new Set();
  for (const f of fichiers) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    const rel = path.relative(lib.RACINE, f).replace(/\\/g, '/');
    const brutSansCode = sansBlocsDeCode(art[0]);
    const texte = lib.texteDe(brutSansCode);
    for (const k of Object.keys(MOTIFS)) {
      const m = MOTIFS[k];
      const cible = m.surHtml ? brutSansCode : texte;
      if (!m.re.test(cible)) continue;
      if (m.exclut && !m.re.test(cible.replace(new RegExp(m.exclut.source, 'g'), ' '))) continue;
      cpt[k]++;
      if (exemples[k].length < 12) exemples[k].push(rel);
      if (k === 'lienExterne') { avecPorte++; coursPorte.add(rel.split('/')[1]); }
    }
  }
  return {
    lecons: fichiers.length,
    cpt, exemples, motifs: MOTIFS,
    portes: avecPorte,
    coursPorte: coursPorte.size,
    sansPorte: fichiers.length - avecPorte,
    /* En pour mille, parce qu'en pourcentage le chiffre s'arrondirait à 1 %
       et perdrait tout son sens. */
    pourMille: Math.round((avecPorte / fichiers.length) * 1000 * 10) / 10,
  };
}

module.exports = { mesurer, MOTIFS };

if (require.main === module) {
  const m = mesurer();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(m, null, 2)); process.exit(0); }
  console.log('corpus : ' + m.lecons + ' leçons (cours « doc » exclu)');
  for (const k of Object.keys(m.motifs)) {
    console.log('  ' + String(m.cpt[k]).padStart(5) + '  ' + m.motifs[k].libelle);
    if (process.argv.includes('--echantillon')) {
      for (const e of m.exemples[k]) console.log('           ' + e);
    }
  }
  console.log('');
  console.log('  leçons avec une porte de sortie : ' + m.portes + ' (' +
    String(m.pourMille).replace('.', ',') + ' ‰), dans ' + m.coursPorte + ' cours');
  console.log('  leçons sans aucune porte ....... : ' + m.sansPorte);
  if (!process.argv.includes('--echantillon')) {
    console.log('\n  (--echantillon pour lister les pages retenues, motif par motif :');
    console.log('   un motif qu’on n’a pas échantillonné n’est pas une mesure. Deux versions');
    console.log('   de ce fichier l’ont appris à leurs dépens — voir l’en-tête.)');
  }
}
