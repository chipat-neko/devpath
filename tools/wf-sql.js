export const meta = {
  name: 'syntaxe-sql',
  description: 'Rédige les leçons SQL 02 à 14 (cours complet « SQL ») et assemble le HTML',
  phases: [{ title: 'Rédaction' }, { title: 'Relecture' }],
};

const PILL = { debutant: 'Débutant', intermediaire: 'Intermédiaire' };

function buildLesson(p) {
  const objectives = p.objectives.map((o) => '                  <li>' + o + '</li>').join('\n');
  const pillClass = 'pill--' + p.level;
  const pillLabel = PILL[p.level];
  return `<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${p.title} — Leçon ${p.num} · SQL · Syntaxe</title>
    <meta name="description" content="${p.metaDesc}" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="sql" data-lesson="lecon-${p.num}.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../../index.html">Accueil</a>
          <a href="../catalogue.html">Catalogue</a>
          <a href="../js/cours.html">Cours JavaScript</a>
          <a href="../../index.html#pourquoi">Notre approche</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../../index.html">Accueil</a></li>
            <li><a href="../catalogue.html">Catalogue</a></li>
            <li><a href="cours.html">SQL</a></li>
            <li aria-current="page">Leçon ${p.num}</li>
          </ol>
        </nav>

        <div class="lesson-layout">
          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">
            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">
              <span>Plan du cours</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div class="coursenav-panel"><div data-coursenav></div></div>
          </aside>

          <div class="lesson-main">
            <header class="lesson-header">
              <p class="kicker">Module ${p.modNum} · ${p.modName} — Leçon ${p.num}</p>
              <h1 class="lesson-header__title">${p.title}</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~${p.durationMin} min
                </span>
                <span class="dot-sep"><span class="pill ${pillClass}">${pillLabel}</span></span>
                <span class="dot-sep">${p.prereq}</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
${objectives}
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
${p.body}

              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
                <span>Marquer comme terminée</span>
              </button>

              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>
            </article>
          </div>

          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">
            <p class="toc__title">Sur cette page</p>
            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
          </aside>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
    <script src="../../js/runner.js" defer></script>
    <script src="../../assets/vendor/prism/prism-core.min.js" defer></script>
    <script src="../../assets/vendor/prism/prism-sql.min.js" defer></script>
  </body>
</html>
`;
}

const ICON_NOTE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>';
const ICON_WARN = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>';
const ICON_TIP = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2a7 7 0 0 0-4-12Z" /></svg>';
const ICON_MORE = '<svg class="callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v14M5 10l7 7 7-7M5 21h14" /></svg>';

const INSTRUCTIONS = `Tu rédiges une leçon du cours « SQL : interroger les bases de données » (site Syntaxe). Public : DÉBUTANTS
qui comprennent l'idée d'un tableau de données (comme un tableur). La leçon 1 a déjà posé SELECT … FROM (lire des
colonnes d'une table). Français, tutoiement, ton clair et concret. SQL STANDARD (ANSI), avec une mention des variantes
(SQLite, PostgreSQL, MySQL) quand c'est utile. Mots-clés SQL en MAJUSCULES par convention.

PAS D'EXÉCUTION EN DIRECT : aucune base de données ne tourne dans le navigateur (le site s'ouvre en file://).
N'invite donc JAMAIS à cliquer « Tester » ou « Aperçu ». Montre les REQUÊTES dans des blocs « language-sql »,
et le RÉSULTAT sous forme de PETIT TABLEAU HTML RÉEL (3 à 5 lignes), pas dans un bloc de code :
<table><thead><tr><th>colonne</th>…</tr></thead><tbody><tr><td>valeur</td>…</tr>…</tbody></table> (il sera mis en forme
automatiquement). Travaille sur un schéma simple et récurrent (ex. clients, commandes, produits).

TU PRODUIS UNIQUEMENT { metaDesc, objectives, body } :
- metaDesc : ~150 caractères.
- objectives : 3 à 4 chaînes (« savoir faire X »), HTML inline autorisé (<code>, <strong>). «&nbsp;;» puis «.» pour la dernière.
- body : HTML INTÉRIEUR de <article class="prose"> (sans la balise article, sans bouton « terminer », sans nav).

STRUCTURE (≈1200–1700 mots) : 1–2 <p> d'intro ; 5–8 sections <h2> (chacune avec au moins une requête commentée et,
souvent, son résultat en tableau) ; <h2>Pièges fréquents</h2> ; <h2>Pour aller plus loin</h2> ;
<h2>Récap et vérification</h2> (résumé <ul> + lesson-check) ; <h2>Exercices</h2> (3 gradués avec solutions repliables).

COMPOSANTS (n'invente pas d'autres classes) :
- Requête SQL : <figure class="code-block" data-file="requete.sql"><pre><code class="language-sql">… REQUÊTE ÉCHAPPÉE …</code></pre></figure>.
- Résultat : un VRAI <table>…</table> (balises HTML normales, NON échappées, hors bloc de code).
- Légende : <p class="code-caption">…</p>
- Note : <div class="callout callout--note">${ICON_NOTE}<div class="callout__body"><p class="callout__title">Note</p><p>…</p></div></div>
- Piège : <div class="callout callout--warn">${ICON_WARN}<div class="callout__body"><p class="callout__title">Piège fréquent</p><p>…</p></div></div>
- Astuce : <div class="callout callout--tip">${ICON_TIP}<div class="callout__body"><p class="callout__title">Astuce</p><p>…</p></div></div>
- Pour aller plus loin : <div class="callout callout--more">${ICON_MORE}<div class="callout__body"><p class="callout__title">Pour aller plus loin</p><p>…</p></div></div>
- Vérification : <div class="lesson-check"><p class="kicker kicker--gold">Vérifie ta compréhension</p><ol><li>…</li><li>…</li><li>…</li></ol></div>
- Exercice : <div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice 1</span><span class="exercise__level">Échauffement</span></div><p>…</p><details><summary>Voir une solution</summary><figure class="code-block" data-file="solution.sql"><pre><code class="language-sql">…</code></pre></figure></details></div>

ÉCHAPPEMENT (CRITIQUE) : DANS un <code>, « < »→« &lt; », « > »→« &gt; », « & »→« &amp; ». Donc les comparaisons SQL
« prix > 100 »→« prix &gt; 100 », « age &lt;= 18 », et l'opérateur « différent de » « &lt;&gt; ». Le TABLEAU de résultat,
lui, utilise de VRAIES balises <table>/<tr>/<td> (non échappées). Vérifie qu'aucun « < » ou « > » brut ne traîne DANS un &lt;code&gt;.

RÈGLES : SQL CORRECT et lisible (mots-clés en majuscules, indentation). Chaînes entre guillemets SIMPLES. Aucun style=,
aucun <style>, aucun <script> RÉEL dans la page (ton body = prose + blocs de code + petits tableaux de résultats).`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['metaDesc', 'objectives', 'body'],
  properties: {
    metaDesc: { type: 'string' },
    objectives: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
    body: { type: 'string' },
  },
};

const SPECS = [
  { num: '02', modNum: '01', modName: 'Interroger des données', level: 'debutant', durationMin: 26, title: 'Filtrer avec WHERE', prereq: 'Leçon 01 recommandée',
    brief: `Sujet : ne garder que les lignes qui nous intéressent.
Sections : (1) La clause WHERE (après FROM) : filtrer les lignes selon une condition. (2) Les OPÉRATEURS de comparaison : =, &lt;&gt; (différent), &lt;, &gt;, &lt;=, &gt;=. (3) Combiner avec AND, OR, NOT et des parenthèses pour la priorité. (4) Les opérateurs SQL : BETWEEN a AND b (intervalle inclusif), IN (liste de valeurs), LIKE (motifs avec % et _), IS NULL / IS NOT NULL (crucial : NULL ne se compare PAS avec =). (5) Les guillemets SIMPLES pour les chaînes ; la casse. (6) L'ordre logique FROM → WHERE → SELECT. Montre des requêtes et leurs résultats en tableau.
Pièges : écrire « = NULL » au lieu de IS NULL ; utiliser des guillemets doubles pour une chaîne ; mélanger AND et OR sans parenthèses ; LIKE sans joker (% ou _).
Pour aller plus loin : ILIKE (PostgreSQL), l'échappement dans LIKE (ESCAPE), NULL et la logique à trois valeurs, les expressions régulières.
Exercices : (1) sélectionner les clients d'une ville donnée ; (2) trouver les produits dont le prix est entre deux bornes (BETWEEN) ; (3) lister les noms commençant par « A » (LIKE).`,
  },
  { num: '03', modNum: '01', modName: 'Interroger des données', level: 'debutant', durationMin: 24, title: 'Trier et limiter les résultats', prereq: 'Leçon 02 recommandée',
    brief: `Sujet : ordonner et restreindre ce que renvoie une requête.
Sections : (1) ORDER BY colonne ASC (par défaut) / DESC ; trier sur PLUSIEURS colonnes (départager les égalités). (2) Trier par un alias ou un numéro de colonne (mention). (3) LIMIT n et la PAGINATION avec OFFSET (LIMIT n OFFSET m) ; les variantes (FETCH FIRST n ROWS en standard, TOP en SQL Server). (4) DISTINCT pour éliminer les doublons (porte sur TOUTES les colonnes du SELECT). (5) La place des NULL dans le tri (NULLS FIRST / LAST). (6) L'ordre des clauses : FROM → WHERE → ORDER BY → LIMIT. Montre des requêtes et leurs résultats en tableau.
Pièges : supposer un ordre sans ORDER BY (aucune garantie) ; LIMIT sans ORDER BY (résultats arbitraires) ; DISTINCT mal compris (sur l'ensemble des colonnes) ; pagination sans tri STABLE (résultats qui « sautent »).
Pour aller plus loin : la pagination par curseur (keyset), ORDER BY avec une expression CASE, les variantes de LIMIT selon le SGBD.
Exercices : (1) les 5 produits les plus chers ; (2) la deuxième page de 10 résultats (LIMIT/OFFSET) ; (3) la liste des villes distinctes, triées.`,
  },
  { num: '04', modNum: '02', modName: 'Calculer et agréger', level: 'debutant', durationMin: 28, title: 'Fonctions et expressions', prereq: 'Module 1 recommandé',
    brief: `Sujet : transformer et calculer des valeurs dans une requête.
Sections : (1) Les EXPRESSIONS dans SELECT : calculs (prix * quantite AS total) et les ALIAS avec AS. (2) Les fonctions de CHAÎNES : UPPER, LOWER, LENGTH, SUBSTRING, TRIM, et la CONCATÉNATION (|| en standard, CONCAT selon le SGBD). (3) Les fonctions NUMÉRIQUES : ROUND, ABS, CEIL/FLOOR, MOD. (4) Les fonctions de DATE : CURRENT_DATE / NOW, extraire une partie (EXTRACT) — en signalant les variantes. (5) Gérer les NULL : COALESCE(x, valeur_par_defaut) et NULLIF. (6) Le CASE WHEN … THEN … ELSE … END pour des valeurs conditionnelles. (7) CAST pour convertir un type. Montre des requêtes et leurs résultats.
Pièges : la concaténation qui diffère selon le SGBD (|| vs CONCAT vs +) ; tout calcul impliquant NULL vaut NULL (d'où COALESCE) ; division entière vs décimale ; utiliser un alias dans WHERE (interdit ; possible dans ORDER BY).
Pour aller plus loin : le formatage des dates et nombres, les fonctions spécifiques au SGBD, les expressions CASE imbriquées, les conversions de types.
Exercices : (1) afficher un prix TTC calculé avec un alias ; (2) mettre des noms en majuscules ; (3) étiqueter des valeurs avec CASE (ex. « cher »/« abordable »).`,
  },
  { num: '05', modNum: '02', modName: 'Calculer et agréger', level: 'intermediaire', durationMin: 30, title: 'Agréger : COUNT, SUM et GROUP BY', prereq: 'Leçon 04 recommandée',
    brief: `Sujet : résumer des données, globalement ou par groupe.
Sections : (1) Les fonctions d'AGRÉGATION : COUNT(*), COUNT(colonne) (ignore les NULL), SUM, AVG, MIN, MAX. (2) GROUP BY : regrouper les lignes par une (ou plusieurs) colonne(s) et calculer un agrégat PAR groupe (ex. le chiffre d'affaires par catégorie). (3) La RÈGLE : toute colonne du SELECT qui n'est pas agrégée doit figurer dans GROUP BY. (4) HAVING : filtrer les GROUPES (après agrégation) — à bien distinguer de WHERE (qui filtre les lignes AVANT). (5) L'ordre logique complet : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. (6) COUNT(DISTINCT colonne). Montre des requêtes et leurs résultats en tableau.
Pièges : confondre WHERE (lignes) et HAVING (groupes) ; mettre dans SELECT une colonne ni agrégée ni groupée ; oublier que COUNT(colonne) ignore les NULL ; trier sur un agrégat sans l'avoir nommé.
Pour aller plus loin : GROUP BY sur une expression, ROLLUP/CUBE, les fonctions de fenêtrage (leçon 13) qui agrègent SANS réduire les lignes.
Exercices : (1) compter les commandes par client ; (2) le total des ventes par mois ; (3) ne garder que les groupes dépassant un seuil (HAVING).`,
  },
  { num: '06', modNum: '03', modName: 'Combiner des tables', level: 'intermediaire', durationMin: 28, title: 'Modéliser : tables, clés et relations', prereq: 'Module 2 recommandé',
    brief: `Sujet : comprendre comment les données sont organisées et reliées.
Sections : (1) Le modèle RELATIONNEL : des TABLES (relations), des LIGNES (enregistrements), des COLONNES (attributs typés). (2) Les TYPES de données : entiers (INTEGER), décimaux (DECIMAL/NUMERIC), texte (VARCHAR/TEXT), dates (DATE/TIMESTAMP), booléens — avec les variantes des SGBD. (3) La CLÉ PRIMAIRE (PRIMARY KEY) : identifie chaque ligne de façon UNIQUE. (4) La CLÉ ÉTRANGÈRE (FOREIGN KEY) : référence la clé primaire d'une autre table et CRÉE une RELATION (un-à-plusieurs ; plusieurs-à-plusieurs via une table de liaison). (5) La NORMALISATION en intuitif : éviter la redondance (ne pas répéter le nom du client dans chaque commande). (6) Un petit schéma (clients, commandes, produits) avec un schéma texte des relations. Montre des définitions de tables simples.
Pièges : dupliquer des données plutôt que les relier ; oublier la clé primaire ; relation plusieurs-à-plusieurs sans table de liaison ; types mal choisis (texte pour un nombre/date).
Pour aller plus loin : la création concrète des tables (leçon 11), les formes normales, les diagrammes entité-association, la dénormalisation maîtrisée.
Exercices : (1) identifier la clé primaire d'une table ; (2) repérer une clé étrangère et la relation qu'elle traduit ; (3) proposer un schéma à deux tables reliées.`,
  },
  { num: '07', modNum: '03', modName: 'Combiner des tables', level: 'intermediaire', durationMin: 32, title: 'Les jointures (JOIN)', prereq: 'Leçon 06 recommandée',
    brief: `Sujet : réassembler les données réparties dans plusieurs tables.
Sections : (1) Pourquoi : les données sont éclatées en tables reliées par des clés ; les JOINTURES les recombinent. (2) INNER JOIN … ON … : ne garde que les lignes qui CORRESPONDENT dans les deux tables (clé étrangère = clé primaire). (3) Les ALIAS de table (FROM clients c JOIN commandes co ON co.client_id = c.id) pour des requêtes lisibles et lever les ambiguïtés. (4) LEFT JOIN : TOUTES les lignes de gauche + les correspondances (NULL sinon) — ex. clients même sans commande ; RIGHT JOIN (symétrique). (5) Joindre PLUSIEURS tables en chaînant les JOIN. (6) Jointure combinée à WHERE et GROUP BY (ex. total par client). Montre des requêtes et leurs résultats en tableau.
Pièges : oublier la condition ON (produit cartésien géant) ; confondre INNER (intersection) et LEFT (tout à gauche) ; colonnes homonymes ambiguës (préfixer par l'alias) ; mettre la condition d'une LEFT JOIN dans WHERE (ce qui annule l'effet « LEFT »).
Pour aller plus loin : FULL JOIN et auto-jointures (leçon suivante), USING, anti-jointures (LEFT JOIN … IS NULL), l'impact des index sur les jointures.
Exercices : (1) joindre commandes et clients (INNER) ; (2) lister les clients SANS commande (LEFT JOIN + IS NULL) ; (3) joindre trois tables.`,
  },
  { num: '08', modNum: '03', modName: 'Combiner des tables', level: 'intermediaire', durationMin: 28, title: 'Jointures avancées et auto-jointures', prereq: 'Leçon 07 recommandée',
    brief: `Sujet : les formes de jointure moins courantes mais utiles.
Sections : (1) FULL OUTER JOIN : toutes les lignes des DEUX tables (correspondances + orphelines des deux côtés) ; l'ÉMULER quand il n'est pas supporté (UNION d'une LEFT et d'une RIGHT JOIN). (2) CROSS JOIN : le produit cartésien (toutes les combinaisons) — rare mais réel (générer des paires). (3) L'AUTO-JOINTURE (self-join) : joindre une table à ELLE-MÊME (ex. un employé et son manager dans la même table) — alias OBLIGATOIRES. (4) Les anti-jointures / semi-jointures (LEFT JOIN … IS NULL ; EXISTS). (5) USING (colonnes de même nom) vs ON ; NATURAL JOIN (et pourquoi l'éviter). (6) Combiner jointures et agrégation. Montre des requêtes et leurs résultats.
Pièges : CROSS JOIN involontaire (ON oublié) ; self-join sans alias distincts ; NATURAL JOIN fragile (dépend des noms de colonnes) ; FULL JOIN non supporté (anciens MySQL/SQLite).
Pour aller plus loin : les sous-requêtes corrélées (leçon suivante), les CTE récursives pour les hiérarchies, les jointures latérales (LATERAL / CROSS APPLY).
Exercices : (1) une auto-jointure employé → manager ; (2) un CROSS JOIN pour générer des combinaisons ; (3) émuler un FULL JOIN avec UNION.`,
  },
  { num: '09', modNum: '03', modName: 'Combiner des tables', level: 'intermediaire', durationMin: 30, title: 'Sous-requêtes, ensembles et CTE', prereq: 'Leçon 08 recommandée',
    brief: `Sujet : composer des requêtes à partir d'autres requêtes.
Sections : (1) Les SOUS-REQUÊTES : une requête imbriquée — dans WHERE (x IN (SELECT …), x &gt; (SELECT AVG …)), dans FROM (table dérivée), dans SELECT (sous-requête scalaire). (2) Les sous-requêtes CORRÉLÉES (qui référencent la requête externe) et EXISTS / NOT EXISTS. (3) Les opérateurs ENSEMBLISTES : UNION (dédoublonne) et UNION ALL, INTERSECT, EXCEPT/MINUS — combiner des résultats de MÊMES colonnes/types. (4) Les CTE (Common Table Expressions) : WITH nom AS (SELECT …) SELECT … — nommer des sous-requêtes pour la LISIBILITÉ et enchaîner plusieurs étapes. (5) Mention des CTE RÉCURSIVES (parcourir une hiérarchie). Montre des requêtes et leurs résultats.
Pièges : UNION qui exige le MÊME nombre et type de colonnes ; UNION (coûteux, dédoublonne) vs UNION ALL ; IN (SELECT …) qui gère mal les NULL (préférer EXISTS) ; sous-requête corrélée lente sur de gros volumes.
Pour aller plus loin : les CTE récursives, sous-requête vs JOIN (lisibilité/performance), la matérialisation des CTE, les requêtes latérales.
Exercices : (1) les clients ayant commandé plus que la moyenne (sous-requête scalaire) ; (2) combiner deux listes avec UNION ; (3) réécrire une sous-requête imbriquée en CTE lisible.`,
  },
  { num: '10', modNum: '04', modName: 'Manipuler et structurer', level: 'debutant', durationMin: 28, title: 'Insérer, modifier, supprimer', prereq: 'Module 3 recommandé',
    brief: `Sujet : écrire dans la base, pas seulement la lire (les commandes INSERT, UPDATE, DELETE).
Sections : (1) INSERT INTO table (colonnes) VALUES (…) ; insérer PLUSIEURS lignes d'un coup ; INSERT … SELECT (copier des données). (2) UPDATE table SET colonne = valeur WHERE … : le WHERE est CRUCIAL — sans lui, TOUTES les lignes sont modifiées. (3) DELETE FROM table WHERE … : pareil, sans WHERE on vide la table ; TRUNCATE (vider rapidement). (4) Le réflexe de SÉCURITÉ : tester sa condition avec un SELECT AVANT un UPDATE/DELETE. (5) Les TRANSACTIONS en aperçu : BEGIN … COMMIT / ROLLBACK pour pouvoir annuler (détaillé leçon 12). (6) L'UPSERT (INSERT … ON CONFLICT / ON DUPLICATE KEY UPDATE) en mention. Décris l'effet de chaque requête.
Pièges : UPDATE ou DELETE SANS WHERE (catastrophe) ; modification définitive hors transaction ; violer une contrainte (clé étrangère, UNIQUE, NOT NULL) ; types incompatibles.
Pour aller plus loin : les transactions (leçon 12), RETURNING (PostgreSQL), les déclencheurs (triggers), l'insertion en masse performante.
Exercices : (1) insérer une nouvelle ligne ; (2) mettre à jour un champ ciblé par son identifiant ; (3) supprimer des lignes selon une condition (après les avoir vérifiées par un SELECT).`,
  },
  { num: '11', modNum: '04', modName: 'Manipuler et structurer', level: 'intermediaire', durationMin: 28, title: 'Créer et modifier des tables (DDL)', prereq: 'Leçon 10 recommandée',
    brief: `Sujet : définir et faire évoluer la structure de la base.
Sections : (1) CREATE TABLE nom (colonne TYPE contraintes, …) : déclarer les colonnes et leurs types. (2) Les CONTRAINTES : PRIMARY KEY, FOREIGN KEY … REFERENCES, NOT NULL, UNIQUE, DEFAULT, CHECK (condition). (3) L'AUTO-INCRÉMENT (SERIAL en PostgreSQL, AUTOINCREMENT en SQLite, IDENTITY / AUTO_INCREMENT ailleurs). (4) ALTER TABLE : ADD COLUMN, DROP COLUMN, RENAME, modifier une colonne ou une contrainte. (5) DROP TABLE (avec IF EXISTS) et TRUNCATE. (6) Les INDEX (CREATE INDEX) : accélérer les recherches (aperçu ; détaillé en performance, leçon 14). Montre des définitions de tables avec contraintes et clés.
Pièges : oublier la clé primaire ; type inadapté ; supprimer une table encore référencée par une clé étrangère ; multiplier les index inutiles (ralentit les écritures).
Pour aller plus loin : les MIGRATIONS (versionner le schéma comme du code), les types avancés (JSON, UUID, ENUM), les contraintes différées, les index composites.
Exercices : (1) créer une table avec clé primaire et contraintes ; (2) ajouter une colonne avec ALTER TABLE ; (3) créer une seconde table reliée par une clé étrangère.`,
  },
  { num: '12', modNum: '04', modName: 'Manipuler et structurer', level: 'intermediaire', durationMin: 28, title: 'Vues, transactions et intégrité', prereq: 'Leçon 11 recommandée',
    brief: `Sujet : fiabiliser et simplifier l'accès aux données.
Sections : (1) Les VUES (CREATE VIEW nom AS SELECT …) : une requête enregistrée, utilisée comme une « table virtuelle » — simplifier des requêtes complexes, exposer un sous-ensemble ; les vues MATÉRIALISÉES (mention). (2) Les TRANSACTIONS : un groupe d'opérations TOUT-OU-RIEN. BEGIN / START TRANSACTION, COMMIT (valider), ROLLBACK (tout annuler). (3) Les propriétés ACID (Atomicité, Cohérence, Isolation, Durabilité) en intuitif, avec l'exemple du virement bancaire. (4) Les niveaux d'ISOLATION et les anomalies (lecture sale…) en survol. (5) L'INTÉGRITÉ par les contraintes (rappel) et les actions référentielles ON DELETE CASCADE / RESTRICT / SET NULL. (6) Mention des droits (GRANT / REVOKE). Montre des exemples.
Pièges : oublier COMMIT (modifications non validées) ; transactions trop longues (verrous) ; croire qu'une vue stocke des données (elle rejoue la requête) ; ON DELETE CASCADE qui supprime en chaîne sans qu'on l'ait prévu.
Pour aller plus loin : les vues matérialisées, les niveaux d'isolation en détail, les déclencheurs et procédures stockées, le contrôle d'accès.
Exercices : (1) créer une vue qui simplifie une jointure fréquente ; (2) écrire une transaction avec COMMIT puis une autre avec ROLLBACK ; (3) expliquer ce que garantit l'atomicité.`,
  },
  { num: '13', modNum: '05', modName: 'Aller plus loin', level: 'intermediaire', durationMin: 30, title: 'Les fonctions de fenêtrage', prereq: 'Module 4 recommandé',
    brief: `Sujet : calculer des agrégats SANS perdre le détail des lignes.
Sections : (1) Ce que GROUP BY ne permet pas : garder CHAQUE ligne ET y ajouter un calcul d'ensemble (un rang, un total cumulé). (2) La clause OVER : fonction() OVER (PARTITION BY … ORDER BY …) — PARTITION BY définit les groupes (fenêtres), ORDER BY l'ordre interne. (3) Les fonctions de CLASSEMENT : ROW_NUMBER, RANK, DENSE_RANK, NTILE. (4) Les AGRÉGATS fenêtrés : SUM/AVG/COUNT OVER (totaux cumulés, moyennes glissantes). (5) LAG et LEAD (valeur de la ligne précédente/suivante, ex. la variation), FIRST_VALUE / LAST_VALUE. (6) Le cadre de fenêtre (ROWS BETWEEN …) en mention. Montre des requêtes et leurs résultats en tableau.
Pièges : confondre PARTITION BY (garde les lignes) et GROUP BY (les réduit) ; l'ORDER BY de la fenêtre vs celui de la requête ; LAST_VALUE et son cadre par défaut surprenant ; le support selon le SGBD (SQLite récent, MySQL 8+).
Pour aller plus loin : les cadres ROWS/RANGE détaillés, les fonctions statistiques, le Top-N par groupe, CTE + fonctions de fenêtrage.
Exercices : (1) numéroter les lignes au sein de chaque groupe (ROW_NUMBER + PARTITION BY) ; (2) un total cumulé (SUM OVER … ORDER BY) ; (3) la variation par rapport à la ligne précédente (LAG).`,
  },
  { num: '14', modNum: '05', modName: 'Aller plus loin', level: 'intermediaire', durationMin: 28, title: 'Performance, sécurité & bonnes pratiques', prereq: 'Leçon 13 recommandée',
    brief: `Sujet : des requêtes rapides et sûres — et synthèse du cours.
Sections : (1) Les INDEX : ils accélèrent recherches et jointures (arbre B), au prix d'écritures un peu plus lentes ; indexer les colonnes utilisées dans WHERE / JOIN / ORDER BY ; index composites ; ne pas sur-indexer. (2) EXPLAIN / EXPLAIN ANALYZE : lire le PLAN d'exécution, repérer un balayage complet de table. (3) Les pièges de PERFORMANCE : SELECT * (préférer les colonnes utiles), une fonction sur une colonne indexée (casse l'usage de l'index), le problème N+1, les sous-requêtes corrélées coûteuses. (4) La SÉCURITÉ : l'INJECTION SQL — ne JAMAIS concaténer une saisie utilisateur dans une requête ; utiliser des requêtes PARAMÉTRÉES / préparées ; le principe du moindre privilège. (5) La LISIBILITÉ : mots-clés en majuscules, indentation, alias clairs, commentaires. (6) &lt;h2&gt;Et après&lt;/h2&gt; : tu maîtrises SQL ; pistes — approfondir un SGBD (PostgreSQL), l'optimisation avancée, l'analytique (fenêtrage/BI), le NoSQL, et relier SQL depuis un langage (Python, etc.). Encourage.
Remplace « Pièges fréquents » par une CHECKLIST (performance + sécurité, à puces). GARDE « Pour aller plus loin », « Récap et vérification » et « Exercices ».
Exercices : (1) ajouter un index utile et expliquer son effet ; (2) transformer une requête concaténée en requête PARAMÉTRÉE (pseudo-code) ; (3) lister 5 bonnes pratiques SQL (perf + sécurité).`,
  },
];

log('Rédaction de ' + SPECS.length + ' leçons (SQL)…');

const results = await pipeline(
  SPECS,
  (s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== LEÇON À RÉDIGER ===\nNuméro : ' + s.num + ' | Module ' + s.modNum + ' (' + s.modName + ')\nTitre : ' + s.title +
        '\n\nBRIEF DÉTAILLÉ (intègre fidèlement le contenu et les requêtes ; montre des résultats en TABLEAU HTML ; échappe < > & dans le code SQL) :\n' + s.brief,
      { label: 'écrit L' + s.num, phase: 'Rédaction', schema: SCHEMA }
    ),
  (parts, s) =>
    agent(
      INSTRUCTIONS +
        '\n\n=== RELECTURE CRITIQUE (corrige et renvoie la version finale, même schéma) ===\nLeçon ' + s.num + ' « ' + s.title + ' ».\n' +
        '1. EXACTITUDE du SQL standard (mentionne les variantes SGBD si utile) ; chaque requête correcte, résultats plausibles.\n' +
        '2. PAS d\'invitation à « Tester »/« Aperçu » (aucune base ne tourne dans le navigateur) ; les résultats sont des TABLEAUX HTML réels.\n' +
        '3. ÉCHAPPEMENT : DANS les blocs de code SQL, « < »→« &lt; », « > »→« &gt; » (comparaisons a &gt; b, a &lt;= b, différent &lt;&gt;), « & »→« &amp; ». Les tableaux de résultats utilisent de VRAIES balises &lt;table&gt; non échappées.\n' +
        '4. STRUCTURE : intro, 5–8 sections <h2>, Pièges fréquents (sauf L14 : checklist), Pour aller plus loin, Récap et vérification (lesson-check), Exercices (3 avec solutions).\n' +
        '5. Public débutant→intermédiaire ; aucun style/script réel dans la page.\n\n' +
        'BRIEF DE RÉFÉRENCE :\n' + s.brief + '\n\nBROUILLON (JSON) :\n' + JSON.stringify(parts),
      { label: 'relit L' + s.num, phase: 'Relecture', schema: SCHEMA }
    ).then((fixed) => {
      const p = fixed || parts;
      const html = buildLesson({
        num: s.num, modNum: s.modNum, modName: s.modName, level: s.level, durationMin: s.durationMin,
        title: s.title, prereq: s.prereq, metaDesc: p.metaDesc, objectives: p.objectives, body: p.body,
      });
      return { file: 'lecon-' + s.num + '.html', html, num: s.num };
    })
);

const ok = results.filter(Boolean);
log('Leçons assemblées : ' + ok.length + '/' + SPECS.length);
return ok;
