/* releve-perissable.js — CE QUI VIEILLIT SANS PRÉVENIR.

   POURQUOI. Un site de 1 540 leçons qui cite des numéros de version se périme
   tout seul, en silence : rien ne casse, aucun vérificateur ne rougit, et la
   page dit simplement quelque chose de faux. Ce relevé dresse l'inventaire
   AVANT qu'on décide quoi en faire (phases E2 à E4).

   ⚠ LA LEÇON DE D4 EST APPLIQUÉE ICI DÈS LA PREMIÈRE LIGNE : un motif qu'on n'a
   pas échantillonné n'est pas une mesure. Un premier essai avec le motif naïf
   « <Mot en majuscule> <nombre> » a rendu 1 540 pages sur 1 540 — parce qu'il
   attrapait « Exercice 2 » (1 538 fois), « Top 10 », « Les 10 », « Sac 40 »,
   « Taux 0 » et « CONST 3 ». On travaille donc par LISTE BLANCHE de
   technologies dont la version bouge vraiment, et chaque catégorie est
   échantillonnable (--echantillon).

   CE QUI N'EST PAS PÉRISSABLE, et qui est écarté nommément :
     – les NOMS de standards figés : ES2015, HTTP/2, TLS 1.3, UTF-8, SHA-256,
       IPv6, OAuth 2.0, PEP 8, C++17… un numéro y fait partie du nom ;
     – les faits historiques datés : « en 1995, JavaScript est créé » ne
       vieillira jamais ;
     – les numéros dans les BLOCS DE CODE : un « python:3.12 » dans un
       Dockerfile est un exemple, pas une affirmation sur le monde. (Ils sont
       comptés à part : ils périment aussi, mais ils se corrigent autrement.)

   USAGE : node tools/releve-perissable.js [--echantillon] [--csv] [--cours=x]  */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..');

/* ------------------------------------------------------------ le corpus --- */
function fichiersLecons() {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/^lecon-\d+\.html$/.test(e.name)) out.push(p);
    }
  })(path.join(RACINE, 'pages'));
  return out.filter((f) => /<article class="prose"/.test(fs.readFileSync(f, 'utf8')));
}

function decouper(html) {
  const m = html.match(/<article class="prose"[\s\S]*?<\/article>/);
  if (!m) return null;
  const art = m[0];
  /* On sépare la PROSE du CODE : une version citée dans une phrase est une
     affirmation sur le monde ; la même dans un Dockerfile est un exemple. */
  const code = (art.match(/<figure class="code-block"[\s\S]*?<\/figure>/gi) || []).join('\n');
  const prose = art
    .replace(/<figure class="code-block"[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code[\s\S]*?<\/code>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ');
  return { prose, code, art };
}

/* --------------------------------------------------- A. numéros de version */
/* Liste blanche : uniquement des choses dont la version BOUGE et dont citer
   un numéro engage sur l'état du monde. Chaque entrée a été vue dans le site. */
const TECHNOS = [
  'Node', 'Node\\.js', 'Deno', 'Bun', 'npm', 'React', 'Vue', 'Angular', 'Svelte',
  'Next\\.js', 'Nuxt', 'Astro', 'Vite', 'Webpack', 'TypeScript', 'Babel', 'ESLint',
  'Python', 'Django', 'Flask', 'FastAPI', 'NumPy', 'pandas', 'PyTorch', 'TensorFlow',
  'Java', 'Kotlin', 'Scala', 'Spring', 'Gradle', 'Maven', 'Groovy', 'Clojure',
  'PHP', 'Laravel', 'Symfony', 'Ruby', 'Rails', 'Go', 'Rust', 'Zig', 'Swift',
  'Dart', 'Flutter', 'Elixir', 'Erlang', 'Haskell', 'OCaml', 'Julia', 'Lua', 'Perl',
  'PowerShell', 'Bash', 'Git', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MongoDB', 'Redis', 'Elasticsearch',
  'Chrome', 'Firefox', 'Safari', 'Edge', 'V8', 'Sass', 'Tailwind', 'Bootstrap',
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'Pytest', 'JUnit',
  '\\.NET', 'ASP\\.NET', 'Blazor', 'Unity', 'Godot', 'Solidity', 'Ada', 'Fortran',
  'COBOL', 'Pascal', 'Delphi', 'GCC', 'Clang', 'LLVM', 'CMake', 'Nginx', 'Apache',
];
const RE_VERSION = new RegExp(
  '\\b(' + TECHNOS.join('|') + ')\\s+v?(\\d+(?:\\.\\d+){0,2})\\b', 'g');

/* Ce qui porte un numéro mais n'est PAS une version qui bouge : le numéro fait
   partie du nom. Écarté nommément, avec sa raison. */
const NOMS_FIGES = [
  [/\bES\s?20\d\d\b/, 'ES2015, ES2020… : le millésime EST le nom'],
  [/\bHTTP\/[123](\.\d)?\b/, 'HTTP/2, HTTP/3 : numéro de protocole'],
  [/\bTLS\s+1\.[0-3]\b/, 'TLS 1.2, 1.3 : numéro de protocole'],
  [/\bOAuth\s+2(\.0)?\b/, 'OAuth 2.0 : nom du standard'],
  [/\bIPv[46]\b/, 'IPv4, IPv6 : nom du protocole'],
  [/\bUTF-\d+\b/, 'UTF-8, UTF-16 : nom de l’encodage'],
  [/\bSHA-?\d+\b/, 'SHA-256 : nom de l’algorithme'],
  [/\bC\+\+\s?(11|14|17|20|23)\b/, 'C++17 : millésime de la norme'],
  [/\bPEP\s+\d+\b/, 'PEP 8 : numéro de document, pas de version'],
  [/\bPython\s+[23]\b(?!\.)/, 'Python 2 / Python 3 : branche du langage, pas une version'],
  [/\bHTML5\b|\bCSS3\b/, 'HTML5, CSS3 : noms d’époque'],
  /* Vus à l'échantillonnage du premier passage : ce sont des millésimes de
     NORME, au même titre que C++17. « Ada 2012 » ne vieillira pas. */
  [/\bAda\s+(83|95|2005|2012|2022)\b/, 'Ada 2012 : millésime de la norme'],
  [/\bFortran\s+(77|90|95|2003|2008|2018)\b/, 'Fortran 90 : millésime de la norme'],
  [/\bCOBOL\s+(85|2002|2014|2023)\b/, 'COBOL 85 : millésime de la norme'],
  [/\bScheme\s*R[567]RS\b/, 'R7RS : nom du rapport'],
  /* « COBOL 1000-INITIALISER » : un numéro de PARAGRAPHE, pas une version. */
  [/\bCOBOL\s+\d{3,4}-/, 'numéro de paragraphe COBOL'],
];

/* ------------------------------------------- B. déictiques et superlatifs */
const CATEGORIES = {
  version: {
    libelle: 'un numéro de version d’une technologie qui bouge',
    special: true,   // traité par RE_VERSION, avec liste blanche
  },
  recence: {
    libelle: 'une affirmation de récence («&nbsp;aujourd’hui&nbsp;», «&nbsp;la dernière version&nbsp;»)',
    /* ⚠ « désormais » a été RETIRÉ après échantillonnage : sur les extraits lus,
   il sert à enchaîner un raisonnement (« le pivot est désormais figé à
   l'indice 1 », « chaque élément traîne désormais un objet ») et non à
   affirmer quelque chose sur l'état du monde. Il gonflait la catégorie de
   plusieurs centaines d'occurrences sans en désigner une seule vraie. */
    re: /\b(aujourd'hui|aujourd’hui|actuellement|à ce jour|de nos jours|r[ée]cemment|ces derni[èe]res ann[ée]es|la derni[èe]re version|la version actuelle|le plus r[ée]cent|la plus r[ée]cente|à l'heure actuelle|à l’heure actuelle)\b/gi,
  },
  domination: {
    libelle: 'une affirmation de domination ou de part de marché',
    /* ⚠ « la majorité des » a été RETIRÉ après échantillonnage : « la majorité
   des cas réels », « la majorité des questions d'accessibilité » sont des
   généralités de raisonnement, pas des parts de marché. */
    re: /\b(le plus utilis[ée]|la plus utilis[ée]|le plus populaire|la plus populaire|le plus r[ée]pandu|la plus r[ée]pandue|\d{1,3}\s?% des)\b/gi,
  },
  performance: {
    libelle: 'un chiffre de performance ou de vitesse',
    re: /\b(\d+(?:[.,]\d+)?\s*fois plus (?:rapide|lent|petit|gros)|\d+(?:[.,]\d+)?\s*(?:ms|millisecondes?)\b|gain de \d+)/gi,
  },
  dateRecente: {
    libelle: 'une date récente (2020 ou après) hors contexte historique',
    /* Une année ANCIENNE est un fait, pas une affirmation périssable : « en 1995,
       JavaScript est créé » ne vieillira jamais. On ne retient donc que les
       années récentes, celles qui peuvent encore bouger. */
    re: /\b(?:depuis|en|début|fin|courant)\s+(20[2-9]\d)\b/gi,
  },
};

/* ---------------------------------------------- LE CONTEXTE DÉCIDE ---------
   Le premier passage de ce relevé a rendu 748 pages « concernées » (49 %).
   Échantillonné, l'essentiel était du faux positif — et surtout, un même motif
   recouvrait TROIS choses qui n'appellent pas le même traitement :

     · « depuis Bash 4, on bascule la casse » ....... un fait de COMPATIBILITÉ.
       Il restera vrai quand Bash 6 sortira. Rien à faire.
     · « Node 24.16.0, médiane de 5 essais » ........ une PROVENANCE de mesure.
       C'est exactement ce que la phase E veut généraliser : la mesure est datée,
       donc relisible. C'est un modèle, pas une dette.
     · « la dernière version de X est 19 » .......... une affirmation NUE sur
       l'état du monde. Celle-là périme, et c'est la seule qui compte.

   Idem pour les déictiques : « tu sais DÉSORMAIS auditer une page » est un
   marqueur de progression pédagogique, « ACTUELLEMENT sélectionné » décrit un
   état du programme, et « dès AUJOURD'HUI » est une locution. Aucune des trois
   ne vieillit. Seule « AUJOURD'HUI, la disposition se fait en CSS » vieillit.

   D'où ce sous-classement. Il ne supprime pas le jugement humain — il le
   concentre sur ce qui le mérite. */

/* Un fait de compatibilité : vrai pour toujours. */
const RE_COMPAT = /\b(depuis|à partir de|avant|jusqu'à|jusqu’à|introduits?e?s? (?:dans|en|par)|apparus?e?s? (?:dans|en)|ajoutés?e?s? (?:dans|en)|disponible (?:dans|depuis)|support[ée]? (?:dans|depuis)|requiert|exige|n[ée]cessite)\s*$/i;
/* Un « + » ou un « ou plus » après le numéro borne par le bas : « Bash 4.3+ »,
   « Chrome 117+ » disent une compatibilité minimale, pas la version du jour. */
const RE_BORNE = /^\s*(\+|ou plus|et plus|et suivantes)/i;
/* Une provenance de mesure : la mesure est datée, donc honnête. */
const RE_PROVENANCE = /\b(m[ée]diane|essais?|mesur[ée]|chronom[èé]tr|par processus|reproduite?|[àa] chaud|banc d'essai|r[ée]ellement obtenue?|sortie obtenue|sur ma machine|relev[ée] le)\b/i;
/* Un marqueur de progression pédagogique, ou un état du programme. */
const RE_PEDAGO = /\b(tu (?:sais|peux|as|connais)|nous (?:savons|avons)|vous (?:savez|pouvez)|on (?:sait|peut))\s+\S*\s*$/i;
const RE_ETAT = /^(?:\s*)(s[ée]lectionn|affich|en cours|utilis[ée]|point[ée]|actif|ouvert|charg[ée]|survol)/i;
const RE_LOCUTION = /\b(d[èe]s|d'|d’|jusqu'à|jusqu’à)\s*$/i;

/* Classe une occurrence d'après ce qui l'entoure. Rend l'une de :
     'compat' | 'provenance' | 'pedago' | 'locution' | 'nu'
   Seul 'nu' constitue une dette. */
function classer(categorie, avant, apres, phrase) {
  if (categorie === 'version') {
    if (RE_COMPAT.test(avant)) return 'compat';
    if (RE_BORNE.test(apres)) return 'compat';
    if (RE_PROVENANCE.test(phrase)) return 'provenance';
    return 'nu';
  }
  if (categorie === 'performance') {
    /* une mesure accompagnée de sa provenance est datée : c'est le modèle */
    return RE_PROVENANCE.test(phrase) ? 'provenance' : 'nu';
  }
  if (categorie === 'recence') {
    if (RE_PEDAGO.test(avant)) return 'pedago';
    if (RE_LOCUTION.test(avant)) return 'locution';
    if (RE_ETAT.test(apres)) return 'pedago';
    return 'nu';
  }
  return 'nu';
}

/* ------------------------------------------------------------- le relevé --- */
function relever() {
  const fichiers = fichiersLecons();
  const parCours = {};
  const totaux = {};
  const exemples = {};
  let versionsCode = 0;
  const exemplesNu = {};
  for (const k of Object.keys(CATEGORIES)) {
    totaux[k] = { pages: 0, occurrences: 0, nu: 0, pagesNu: 0, ecarte: {} };
    exemples[k] = []; exemplesNu[k] = [];
  }
  const technosVues = {};

  for (const f of fichiers) {
    const d = decouper(fs.readFileSync(f, 'utf8'));
    if (!d) continue;
    const rel = path.relative(RACINE, f).replace(/\\/g, '/');
    const cours = rel.split('/')[1];
    if (!parCours[cours]) {
      parCours[cours] = { lecons: 0, touchees: new Set() };
      for (const k of Object.keys(CATEGORIES)) parCours[cours][k] = 0;
    }
    parCours[cours].lecons++;

    for (const k of Object.keys(CATEGORIES)) {
      let hits = [];
      if (k === 'version') {
        RE_VERSION.lastIndex = 0;
        let m;
        while ((m = RE_VERSION.exec(d.prose))) {
          const autour = d.prose.slice(Math.max(0, m.index - 30), m.index + m[0].length + 20);
          if (NOMS_FIGES.some(function (n) { return n[0].test(autour); })) continue;
          const av = d.prose.slice(Math.max(0, m.index - 40), m.index);
          const ap = d.prose.slice(m.index + m[0].length, m.index + m[0].length + 40);
          const ph = d.prose.slice(Math.max(0, m.index - 110), m.index + m[0].length + 110);
          hits.push({ texte: m[0], classe: classer('version', av, ap, ph),
            autour: d.prose.slice(Math.max(0, m.index - 55), m.index + m[0].length + 45) });
          technosVues[m[1]] = (technosVues[m[1]] || 0) + 1;
        }
      } else {
        const re = new RegExp(CATEGORIES[k].re.source, CATEGORIES[k].re.flags);
        let m;
        while ((m = re.exec(d.prose))) {
          const av = d.prose.slice(Math.max(0, m.index - 40), m.index);
          const ap = d.prose.slice(m.index + m[0].length, m.index + m[0].length + 40);
          const ph = d.prose.slice(Math.max(0, m.index - 110), m.index + m[0].length + 110);
          hits.push({ texte: m[0], classe: classer(k, av, ap, ph),
            autour: d.prose.slice(Math.max(0, m.index - 55), m.index + m[0].length + 45) });
        }
      }
      if (!hits.length) continue;
      const nus = hits.filter(function (h) { return h.classe === 'nu'; });
      totaux[k].pages++;
      totaux[k].occurrences += hits.length;
      totaux[k].nu += nus.length;
      for (const h of hits) {
        if (h.classe === 'nu') continue;
        totaux[k].ecarte[h.classe] = (totaux[k].ecarte[h.classe] || 0) + 1;
      }
      if (exemples[k].length < 14) exemples[k].push({ page: rel, ex: hits[0] });
      if (!nus.length) continue;
      totaux[k].pagesNu++;
      parCours[cours][k] += nus.length;
      parCours[cours].touchees.add(rel);
      if (exemplesNu[k].length < 14) exemplesNu[k].push({ page: rel, ex: nus[0] });
    }
    /* les versions dans le CODE, comptées à part */
    RE_VERSION.lastIndex = 0;
    if (RE_VERSION.test(d.code)) versionsCode++;
  }

  const touchees = new Set();
  for (const c of Object.keys(parCours)) for (const p of parCours[c].touchees) touchees.add(p);

  return {
    lecons: fichiers.length,
    cours: Object.keys(parCours).length,
    totaux, exemples, exemplesNu, parCours,
    pagesTouchees: touchees.size,
    versionsCode,
    technosVues,
  };
}

/* ----------------------------------------------------------------- sortie */
if (require.main === module) {
  const r = relever();
  const filtre = (process.argv.find((a) => a.indexOf('--cours=') === 0) || '').split('=')[1];

  if (process.argv.includes('--csv')) {
    console.log('cours;lecons;' + Object.keys(CATEGORIES).join(';') + ';pages_touchees');
    for (const c of Object.keys(r.parCours).sort()) {
      const o = r.parCours[c];
      console.log([c, o.lecons].concat(Object.keys(CATEGORIES).map((k) => o[k]))
        .concat([o.touchees.size]).join(';'));
    }
    process.exit(0);
  }

  console.log('RELEVÉ DU PÉRISSABLE — ' + r.lecons + ' leçons, ' + r.cours + ' cours');
  console.log('');
  console.log('  catégorie       brut    ÉCARTÉ (contexte)         DETTE  pages');
  for (const k of Object.keys(CATEGORIES)) {
    const t = r.totaux[k];
    const ec = Object.keys(t.ecarte).map(function (c) { return c + ' ' + t.ecarte[c]; }).join(', ');
    console.log('  ' + k.padEnd(14) + String(t.occurrences).padStart(5) + '    ' +
      (ec || '—').padEnd(24) + String(t.nu).padStart(6) + String(t.pagesNu).padStart(7));
  }
  console.log('');
  console.log('  « écarté » = le contexte montre que ce n’est PAS une dette :');
  console.log('     compat     — « depuis Bash 4 » : vrai pour toujours ;');
  console.log('     provenance — « Node 24.16.0, médiane de 5 essais » : la mesure est datée ;');
  console.log('     pedago     — « tu sais désormais » : progression, pas état du monde ;');
  console.log('     locution   — « dès aujourd’hui », « d’aujourd’hui ».');
  console.log('');
  console.log('  PAGES CONCERNÉES (au moins une catégorie) : ' + r.pagesTouchees +
    ' sur ' + r.lecons + ' (' + Math.round((r.pagesTouchees / r.lecons) * 100) + ' %)');
  console.log('  pages dont un BLOC DE CODE cite une version : ' + r.versionsCode +
    '  (comptées à part : un exemple n’est pas une affirmation)');

  console.log('\n  LES 15 COURS LES PLUS EXPOSÉS (pages touchées / leçons) :');
  const classement = Object.keys(r.parCours).map(function (c) {
    const o = r.parCours[c];
    const total = Object.keys(CATEGORIES).reduce(function (a, k) { return a + o[k]; }, 0);
    return { cours: c, lecons: o.lecons, touchees: o.touchees.size, total };
  }).filter(function (o) { return o.touchees > 0; })
    .sort(function (a, b) { return b.touchees - a.touchees || b.total - a.total; });
  for (const o of classement.slice(0, 15)) {
    console.log('    ' + o.cours.padEnd(16) + String(o.touchees).padStart(3) + ' / ' +
      String(o.lecons).padEnd(4) + ' leçons   ' + String(o.total).padStart(4) + ' occurrences');
  }

  if (process.argv.includes('--echantillon')) {
    for (const k of Object.keys(CATEGORIES)) {
      if (filtre && k !== filtre) continue;
      console.log('\n=== ÉCHANTILLON — ' + k + ' ===');
      for (const e of (r.exemplesNu[k] || [])) {
        console.log('  ' + e.page);
        console.log('      …' + e.ex.autour.trim() + '…');
      }
    }
    console.log('\n=== technologies vues, par fréquence ===');
    const t = Object.keys(r.technosVues).sort(function (a, b) { return r.technosVues[b] - r.technosVues[a]; });
    console.log('  ' + t.slice(0, 25).map(function (x) { return x + ' (' + r.technosVues[x] + ')'; }).join(', '));
  } else {
    console.log('\n  (--echantillon pour lire les extraits : un motif qu’on n’a pas');
    console.log('   échantillonné n’est pas une mesure. --csv pour le tableau par cours.)');
  }
}

module.exports = { relever, CATEGORIES, TECHNOS, NOMS_FIGES,
  /* exportés pour E2/E3 : le sous-classement contextuel ne doit exister qu'ici. */
  decouper, classer, RE_VERSION, fichiersLecons };
