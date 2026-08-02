// Workflow GÉNÉRIQUE v3 — rédacteur + relecteur, SANS scribe.
// Les contenus restent dans le journal du workflow ; l'assemblage des fichiers
// lecon-NN.html est fait LOCALEMENT par tools/assemble-course.ps1 (zéro agent).
// Les prompts rédaction/relecture sont IDENTIQUES à wf-course2.js : une reprise
// (resumeFromRunId) d'un run v2 réutilise donc le cache des rédactions.
// args = {
//   langName, dataCourse, breadcrumb, titleSuffix, prismLangs:[...], codeLang, sampleFile,
//   outDir (inutilisé ici, conservé pour compat), preamble,
//   specs:[{num,modNum,modName,level,durationMin,title,prereq,brief}, ...]
// }
export const meta = {
  name: 'syntaxe-course-v3',
  description: 'Rédige un cours complet (rédacteur + relecteur ; assemblage local des fichiers)',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const cfg = typeof args === 'string' ? JSON.parse(args) : args;
if (!cfg || !cfg.specs) {
  throw new Error('Config absente ou incomplète (specs requis)');
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const RULES =
  '\n\nTU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :\n' +
  '- metaDesc : ~150 caractères.\n' +
  '- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.\n' +
  '- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).\n\n' +
  'STRUCTURE (≈1300–1800 mots) : 1–2 <p> d\'intro ; 5–8 sections <h2> (chacune avec un exemple commenté) ;\n' +
  '<h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ; <h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ;\n' +
  '<h2>Exercices</h2> (3 gradués avec solutions repliables contenant du code).\n\n' +
  'COMPOSANTS (n\'invente pas d\'autres classes) :\n' +
  '- Code ' + cfg.langName + ' : <figure class="code-block" data-file="' + (cfg.sampleFile || 'exemple') + '"><pre><code class="language-' + cfg.codeLang + '">… CODE ÉCHAPPÉ …</code></pre></figure>.\n' +
  '- Commandes terminal : <figure class="code-block" data-file="Terminal"><pre><code class="language-bash">… ÉCHAPPÉ …</code></pre></figure>. Légende : <p class="code-caption">…</p>\n' +
  '- Note : <div class="callout callout--note">' + ICON_NOTE + '<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>\n' +
  '- Piège : <div class="callout callout--warn">' + ICON_WARN + '<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>\n' +
  '- Astuce : <div class="callout callout--tip">' + ICON_TIP + '<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>\n' +
  '- Pour aller plus loin : <div class="callout callout--more">' + ICON_MORE + '<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>\n' +
  '- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>\n' +
  '- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution"><pre><code class="language-' + cfg.codeLang + '">…</code></pre></figure></details></div>\n\n' +
  'ÉCHAPPEMENT (ABSOLUMENT CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les\n' +
  'flèches/opérateurs « => »→« =&gt; », « a && b »→« a &amp;&amp; b », les comparaisons « n > 0 »→« n &gt; 0 », « n < 0 »→« n &lt; 0 »,\n' +
  'les chevrons de type/générique/template « <T> »→« &lt;T&gt; », les redirections shell « 2>&1 »→« 2&gt;&amp;1 », « a << b »→« a &lt;&lt; b ».\n' +
  'AUCUN « < », « > » ou « & » brut dans un &lt;code&gt;. Aucun style=, aucun <style>, aucun <script> RÉEL dans la page.';

const INSTRUCTIONS = cfg.preamble + RULES;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

log('Rédaction de ' + cfg.specs.length + ' leçons (cours ' + cfg.langName + ')…');

const results = await pipeline(
  cfg.specs,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement ; montre les sorties/erreurs en commentaire ; ÉCHAPPE tous les <, >, & dans le code) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' » (' + cfg.langName + ').\n' +
        '1. EXACTITUDE technique et idiomatique du ' + cfg.langName + ' moderne.\n' +
        '2. PÉDAGOGIE : progression du connu vers l\'inconnu ; PAS d\'invitation à « Tester »/« Aperçu » (le code ne s\'exécute pas dans le site).\n' +
        '3. ÉCHAPPEMENT (CRITIQUE) : AUCUN « < », « > » ou « & » brut dans un &lt;code&gt; (flèches « =&gt; », « &amp;&amp; », chevrons « &lt;T&gt; », redirections « 2&gt;&amp;1 », etc.).\n' +
        '4. STRUCTURE : intro, 5–8 <h2>, Pièges fréquents, Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Aucun style/script réel ; sorties et erreurs en commentaire dans le code.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => ({ num: s.num, relu: !!fixed, ok: !!(fixed || parts) }))
);

const ok = results.filter(Boolean);
log('Leçons rédigées (contenu dans le journal) : ' + ok.length + '/' + cfg.specs.length);
return { lessons: ok, total: cfg.specs.length, note: 'Assembler avec tools/assemble-course.ps1' };
