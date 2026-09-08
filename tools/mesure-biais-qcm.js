/* =============================================================================
   mesure-biais-qcm.js — de combien de QCM un apprenant vient-il a bout SANS RIEN
   SAVOIR, et par quel indice ?

   POURQUOI (point B1 du chantier V16). `verif-contenu.js` mesure depuis le V15 un
   seul indice : la bonne reponse est la plus LONGUE dans 88,8 % des questions. Le
   plan V16 exige de ne pas s'y fier seul, parce que corriger la longueur sans
   regarder le reste deplacerait le probleme au lieu de le regler : si la bonne
   reponse reste la seule a porter un tiret d'explication, ou la seule a ne pas
   affirmer « toujours », l'apprenant garde une methode qui marche.

   CE QU'IL MESURE. Chaque strategie est un APPRENANT QUI NE COMPREND RIEN et
   applique une regle mecanique sur le texte des options. Le taux rendu est sa
   reussite reelle sur le corpus, question par question.

   TROIS PRECAUTIONS DE MESURE, sans lesquelles les chiffres seraient faux :
     1. Les options sont MELANGEES a l'affichage (`shuffle` dans `js/lecon.js`,
        appele par `buildQuiz` pour les QCM de lecon ET les QCM bilan). La position
        de la bonne reponse dans le source — 98,8 % en premiere place — n'est donc
        PAS un indice exploitable. Elle est relevee a titre d'information, et
        marquee comme telle : c'est le genre de chiffre qui, sorti de son contexte,
        ferait croire a une faille inexistante.
     2. L'EX AEQUO n'est pas une reussite. Si deux options sont a egalite sur le
        critere, la strategie doit trancher, et elle tranche au hasard : on compte
        alors 1/n de succes, pas 1. Prendre « la premiere a egalite » gonflerait
        tous les taux, la bonne reponse etant premiere dans le source.
     3bis. LE RENDEMENT, ajoute le 2026-09-06 (B4, cours `doc`). La colonne « reussite » est
        une moyenne sur TOUT le corpus : une strategie qui ne tranche que sur 3 % des questions
        y est condamnee a rester pres de l'etalon, meme si elle ne se trompe JAMAIS sur ces 3 %.
        Mesure du 2026-09-06 : « la seule avec un tiret » rendait 26,9 % de reussite
        et 84,2 % de rendement. Les deux chiffres sont IMPRIMES depuis la mesure du
        jour, jamais recopies : la premiere redaction en avait grave un (« 87 % »)
        que la colonne d'a cote dementait deja.
        La cible d'un chantier de correction est le rendement ; la couverture dit seulement
        combien de questions il faut reprendre.
     3. Le HASARD sert d'etalon : sa reussite est l'esperance exacte (moyenne des
        1/n), pas une simulation. Un indice ne vaut d'etre corrige que s'il fait
        NETTEMENT mieux que le hasard.

   USAGE
     node tools/mesure-biais-qcm.js               # tableau des strategies
     node tools/mesure-biais-qcm.js --cours       # + le detail par cours
     node tools/mesure-biais-qcm.js --json        # meme mesure, en JSON
     node tools/mesure-biais-qcm.js --pire=20     # les N questions les plus devinables
     node tools/mesure-biais-qcm.js --lots        # par FENETRE DE LECONS (voir ci-dessous)
     node tools/mesure-biais-qcm.js --lots=4      # fenetre glissante de 4 lecons

   ⚠️ POURQUOI `--lots` EXISTE, et c'est la lecon la plus chere de la phase B :
   LES INDICES QUE LA CORRECTION FABRIQUE NE SE VOIENT PAS AU NIVEAU DU COURS.
   Un cours est reecrit par lots de lecons confies a des agents differents, et chaque
   agent laisse le TIC DE STYLE qui lui est propre sur SON lot. Mesure faite sur `react`
   puis refaite sur `ruby` : un tel indice vaut 100 % sur le lot, ~38 % sur le cours et
   ~25 % sur le site. La moyenne d'un cours le noie ; celle du site l'efface. Ce mode
   balaie donc chaque cours par fenetres glissantes et signale toute fenetre ou une
   strategie depasse le seuil, ou designe trop souvent la SEULE bonne reponse.

   ⚠️ LA TAILLE DE LA FENETRE DOIT SUIVRE CELLE DES LOTS D'ECRITURE, et l'epreuve le
   montre. Le defaut de `ruby` (les lecons 05-08, ecrites d'une main, glose finale sur
   tous les distracteurs) a ete mesure dans un bac a sable sur l'etat d'avant correction,
   l'outil y etant COPIE pour que `__dirname/..` ne pointe pas sur le vrai depot :
     --lots=5  aucune fenetre au-dessus des seuils   <- AVEUGLE
     --lots=4  ruby 5-8   56,9 %  designation unique 41,7 %
     --lots=3  ruby 5-7   62,0 %  ·  6-8  59,3 %  ·  4-6  58,3 %
   Une fenetre plus large que le lot dilue le tic jusqu'a le faire disparaitre. Le defaut
   est donc de 4 — la taille des lots de ce chantier —, et il faut le baisser si l'on
   ecrit par lots plus courts. En dessous de 3 lecons, la fenetre n'a plus assez de
   questions et c'est le bruit du hasard qui declenche.

   CODE DE SORTIE : toujours 0 — c'est une mesure, pas un verdict. Le verdict est
   l'affaire de `tools/verif-qcm-biais.js` (point B2).
   ============================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");

var RACINE = path.join(__dirname, "..");
var PAGES = path.join(RACINE, "pages");
var JSON_MODE = process.argv.indexOf("--json") !== -1;
var PAR_COURS = process.argv.indexOf("--cours") !== -1;
var PIRE = (function () {
  var a = process.argv.filter(function (x) { return x.indexOf("--pire=") === 0; })[0];
  return a ? Number(a.slice(7)) || 10 : 0;
})();
/* --lots[=N] : la mesure par FENETRE DE LECONS, ajoutee au point B4 (cours `ruby`). */
var LOTS = (function () {
  var a = process.argv.filter(function (x) { return x.indexOf("--lots") === 0; })[0];
  if (!a) return 0;
  return a.indexOf("=") !== -1 ? (Number(a.split("=")[1]) || 4) : 4;
})();
var SEUIL_LOT = 0.60;   /* une strategie au-dessus de ce taux sur une fenetre */
var SEUIL_SOLO = 0.40;  /* ou qui designe la SEULE bonne reponse aussi souvent */

/* ------------------------------------------------------------ le corpus, des SOURCES */
/* On lit les blocs `data-quiz` et `data-quiz-bilan` des lecons, et non
   `js/quiz-index.js` : l'index est un derive, et il en compte 16 de moins (6151
   contre 6167). Mesurer sur le derive laisserait 16 questions hors du controle. */
function lireCorpus() {
  var out = [];
  fs.readdirSync(PAGES, { withFileTypes: true }).forEach(function (d) {
    if (!d.isDirectory()) return;
    var dossier = path.join(PAGES, d.name);
    fs.readdirSync(dossier).forEach(function (f) {
      if (!/^lecon-\d+\.html$/.test(f)) return;
      var t = fs.readFileSync(path.join(dossier, f), "utf8");
      var blocs = t.match(/<script[^>]*type="application\/json"[^>]*data-(quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g) || [];
      blocs.forEach(function (b) {
        if (/data-exos/.test(b)) return;
        var corps = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
        var v = null;
        try { v = JSON.parse(corps); } catch (e) { return; }
        if (!Array.isArray(v)) return;
        v.forEach(function (item) {
          if (!item || !Array.isArray(item.a) || item.a.length < 2) return;
          out.push({
            cours: d.name, fichier: f,
            bilan: /data-quiz-bilan/.test(b),
            q: String(item.q == null ? "" : item.q),
            a: item.a.map(function (x) { return String(x == null ? "" : x); }),
            k: Number(item.correct || 0),
          });
        });
      });
    });
  });
  return out;
}

/* ----------------------------------------------------------------- les strategies */
/* Chacune rend la LISTE des options qu'elle retient. Une liste de plusieurs
   elements est un ex aequo : la reussite comptee vaut alors 1 / taille. */

function longueurs(q) { return q.a.map(function (t) { return t.length; }); }
function argMax(vals) {
  var m = Math.max.apply(null, vals);
  return vals.reduce(function (acc, v, i) { if (v === m) acc.push(i); return acc; }, []);
}
function toutes(q) { return q.a.map(function (_, i) { return i; }); }

/* Longueur moyenne des mots d'une option : le rembourrage en petits mots la fait
   BAISSER, alors que la longueur en caracteres reste dans la fenetre. Voir le bloc
   des deux strategies de densite plus bas. */
function densiteMots(t) {
  var w = t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || [];
  return w.length ? w.join("").length / w.length : 0;
}

/* L'INVERSE d'argMax : les indices qui ne sont PAS au maximum. Si tout le monde est
   a egalite, la regle ne tranche pas et l'apprenant tire au hasard (toutes). Sans ce
   garde-fou, une question dont les quatre options ont le meme score serait comptee
   comme « couverte » et fausserait la couverture vers le haut. */
function ecarterMax(q, scores) {
  var m = Math.max.apply(null, scores);
  var s = scores.reduce(function (acc, v, i) { if (v !== m) acc.push(i); return acc; }, []);
  return s.length ? s : toutes(q);
}

/* Le tiret d'explication : « — », « – », ou un « - » entoure d'espaces. C'est la
   marque typographique de la reponse qui s'explique elle-meme. */
function aTiret(t) { return /—|–| - |\(c'est-à-dire|, c'est-à-dire/.test(t); }

/* Combien de mots longs (9 lettres et plus) chaque option porte-t-elle QU'AUCUNE
   AUTRE option de la meme question n'emploie ? Sert aux deux strategies « le mot
   technique exclusif » et « ECARTER le mot technique exclusif ». */
function scoreMotExclusif(q) {
  var mots = q.a.map(function (t) {
    return new Set((t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{8,}/g) || []));
  });
  return mots.map(function (s, i) {
    var n = 0;
    s.forEach(function (m) {
      var ailleurs = mots.some(function (o, j) { return j !== i && o.has(m); });
      if (!ailleurs) n++;
    });
    return n;
  });
}

/* La NEGATION. Attention au piege de mesure : « n' » doit etre cherche AVEC son
   apostrophe typographique comme avec l'apostrophe droite, sans quoi la moitie du
   corpus echappe a la regle -- c'est le meme defaut que « c'est-a-dire » sans
   accent dans aTiret(), corrige le meme jour.

   ⚠️ DEUXIEME PIEGE, trouve le 2026-09-08 (B4, cours `c`) par TROIS lots
   d'ecriture independants : la limite \b de JavaScript est ASCII, donc une
   lettre accentuee cree une frontiere de mot A L'INTERIEUR d'un mot. « chaine »
   ecrit avec un i circonflexe declenchait \bne\b et comptait comme une negation.
   Mesure refaite le 2026-09-08 (scratchpad/verif-nie2.js) : 306 options sur 24 669
   changent de verdict, soit 1,24 % du corpus ; ABSOLUS et PRUDENTS n'en changent
   AUCUNE, la correction n'y est qu'une precaution. C'est le meme defaut
   que celui deja documente plus bas pour CAPITALES (« DEJA » accentue coupe
   apres le J) -- la correction y avait ete faite, mais pas ici. Les limites sont
   desormais des lookaround unicode, sur les trois regles de vocabulaire. */
var LD = "(?<![\\p{L}\\p{N}])", LF = "(?![\\p{L}\\p{N}])";
var NIE = new RegExp(LD + "(ne|ni|non|pas|jamais|aucun|aucune|rien)" + LF + "|" + LD + "n[’']", "iu");

/* Les affirmations ABSOLUES sont la signature du distracteur expedie. Un
   apprenant qui les ecarte n'a rien compris mais elimine beaucoup. */
var ABSOLUS = new RegExp(LD + "(toujours|jamais|uniquement|seulement|aucun|aucune|impossible|obligatoirement|systematiquement|systématiquement|rien|tous les cas|n'existe pas)" + LF, "iu");
/* Les formulations PRUDENTES, symetrie de la precedente. */
var PRUDENTS = new RegExp(LD + "(souvent|generalement|généralement|en general|en général|peut|permet|selon|plutot|plutôt|principalement|notamment|le plus souvent)" + LF, "iu");

/* Les SIGLES du metier, ecartes de la mesure des capitales d'emphase : « HTML »
   ou « JSON » dans une option n'est pas un cri, c'est le nom de la chose. */
var SIGLES = /^(HTML|CSS|JS|JSON|DOM|API|URL|URI|HTTP|HTTPS|CORS|SQL|CLI|UI|UX|ID|IDE|CPU|GPU|RAM|SSD|DNS|TLS|SSL|CRUD|REST|RPC|GRPC|ORM|JWT|XSS|CSRF|SVG|PNG|JPEG|GIF|PDF|UTF|ASCII|BOM|LF|CRLF|OK|NASA|IEEE|ISO|RFC|MDN|ECMA|ES|NPM|CDN|CI|CD|TDD|BDD|DDD|MVC|MVVM|SPA|PWA|SEO|ARIA|WAI|WCAG|RGPD|GNU|POSIX|BSD|MIT|AWS|GCP|VM|OS|IO|FIFO|LIFO|LRU|TTL|UUID|MD|XML|YAML|TOML|CSV|AJAX|XHR|WEBP|WOFF|EOF|NAN|INF|TCP|UDP|IP|SSH|FTP|SMTP|IMAP|MQTT|GRAPHQL|SDK|JVM|LLVM|ASM|WASM|GC|JIT|AOT|OOP|FP|SOLID|DRY|KISS|YAGNI|A11Y|I18N|L10N|RGB|HSL|DPI|PPI|FPS|MS|KO|MO|GO|TO|BIT|OCTET|SI|IIFE|NEW|THIS|VAR|LET|CONST|NULL|TRUE|FALSE|GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|SELECT|INSERT|UPDATE|FROM|WHERE|JOIN|GROUP|ORDER|BY|AND|OR|NOT|IN|IS|AS|ON|IF|ELSE|FOR|WHILE|DO|END|BEGIN|COMMIT|ROLLBACK|CASCADE|UNIQUE|INDEX|KEY|PRIMARY|FOREIGN|TABLE|VIEW|WITH|UNION|ALL|DISTINCT|LIMIT|OFFSET|CASE|WHEN|THEN|USING|SET|VALUES|INTO|CREATE|DROP|ALTER|GRANT|REVOKE|SHA|NET|PHP|REPL|JSX|SLO|SLI|ELT|ETL|LCP|CLS|FID|INP|TTFB|DSL|BEAM|CLR|PID|VPN|CMD|UTC|BFS|DFS|ERC|CVE|ACID|XOR|RSA|AES|HMAC|GIL|README|ARC|LLM|CSP|DAG|AST|ESM|ABC|SSR|SSG|SCSS|RAG|JDK|JRE|RAII|RTT|IQR|RBAC|ABAC|NFT|HCL|ADR|OOM|RPO|RTO|CSSOM|SDL|VBA|COBOL|SPARK|PVC|GFM|SCA|ARGV|LFS|DBI|DBD|GOOS|GOPATH|TIMESTAMPTZ|TIMESTAMP|ANN|PCA|SVM|GAN|RNN|CNN|OTP|MFA|SSO|LDAP|SAML|OIDC|CIDR|NAT|ARP|ICMP|MTU|QPS|RPS|SLA|KPI|ROI|MVP|POC|QA|UAT|SRE|NP|DP|PV|VB|VS|NA|PR|MR|BD|LD|NC|ML|IDENT|REX|TODO|JJ|MM|AAAA|EXPLAIN|ANALYZE|ROLLUP|TRUNCATE|HAVING|PIVOT|ENTRYPOINT|WORKDIR|DISPLAY|PERFORM|INSPECT|COMPUTE|OCCURS|STORAGE|WORKING|IDENTIFICATION|ENVIRONMENT|PROCEDURE|DIVISION|SECTION|DEFAULT|COLUMN|MERGE|INNER|LEFT|RIGHT|OUTER|DESC|ASC|COUNT|SUM|AVG|MIN|MAX|CHECK|ADD|READ|WRITE|CALL|MOVE|TIMES|REFERENCE|ARRAY|DEBUG|ERROR|DATA|RUN|ARG|ENV|PATH|HOME|TERM|EXIT|KILL|MUST|SHOULD|REWRITE|COMP|PIC|AT|NO)$/;

/* Les mots CRIES en capitales. Deux pieges corriges en B4 (cours python), tous
   deux mesures : (1) l'apostrophe etait acceptee comme lettre, si bien que « C'est »
   rendait le jeton « C' » et « L'option » le jeton « L' » — 880 des 2496 occurrences
   relevees sur le site, soit 35 % du signal, etaient des majuscules de DEBUT DE PHRASE
   suivies d'une elision, et non des cris ; (2) la limite \b de JavaScript est ASCII,
   donc « DEJA » accentue etait coupe apres le J. On exige donc deux LETTRES capitales
   consecutives, sans lettre autour. */
var CAPITALES = /(?<![\p{L}\p{N}])[\p{Lu}][\p{Lu}\p{N}]+(?![\p{L}])/gu;

/* Le MOT D'ATTAQUE d'une option : son premier mot, les locutions conjonctives
   comptant pour un seul jeton. Voir la strategie « l'attaque unique » plus bas. */
var LOCUTIONS = ["parce que", "parce qu'", "pour que", "afin de", "afin d'",
                 "des que", "des qu'", "tant que", "tant qu'", "alors que", "alors qu'",
                 "si bien que", "au lieu de", "en effet", "c'est"];
function motAttaque(t) {
  var m = String(t).trim().toLowerCase().replace(/^[«"'`\s]+/, "");
  for (var i = 0; i < LOCUTIONS.length; i++) if (m.indexOf(LOCUTIONS[i]) === 0) return LOCUTIONS[i];
  var mm = /^[\wà-ÿ']+/.exec(m);
  return mm ? mm[0] : m.split(/\s+/)[0];
}

/* La RESTRICTION : les options qui portent la marque, ou toutes si la marque est
   absente ou universelle (la strategie ne tranche alors pas). */
function restreindre(q, porte) {
  var m = q.a.map(porte), n = m.filter(Boolean).length;
  if (n === 0 || n === q.a.length) return toutes(q);
  return m.reduce(function (acc, x, i) { if (x) acc.push(i); return acc; }, []);
}

/* LA DESIGNATION UNIQUE : l'option SEULE a porter la marque. Si zero ou plusieurs
   la portent, la strategie ne tranche pas. */
function seule(q, porte) {
  var m = q.a.map(porte);
  if (m.filter(Boolean).length !== 1) return toutes(q);
  return [m.indexOf(true)];
}

/* Les trois marques de la dette 3. Le point interne se definit par un point (ou un
   « ! », ou un « ? ») SUIVI D'UNE ESPACE ET D'UNE MAJUSCULE : c'est ce qui distingue
   deux phrases d'un point d'abreviation ou d'un `objet.methode()`. L'espace insecable
   est acceptee au meme titre que l'espace ordinaire — sans quoi la mesure raterait en
   silence les options composees a la francaise. */
/* Les MORCEAUX des identifiants de l'enonce : ce que la tokenisation « par mots »
   ne peut pas voir. On decoupe `vm.expectRevert` en `expect` et `revert`, `setUp` en
   `set` et `up`, `customElements` en `custom` et `elements` — et on ECARTE les
   morceaux qui sont deja des jetons entiers de l'enonce, sans quoi on mesurerait
   deux fois l'echo ordinaire. */
function fragmentsIdentifiants(q) {
  var texte = String(q == null ? "" : q);
  var entiers = new Set((texte.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []));
  var out = new Set();
  (texte.match(/[A-Za-z_][A-Za-z0-9_]*(?:[._][A-Za-z0-9_]+)+|[a-z]+[A-Z][A-Za-z0-9]*/g) || [])
    .forEach(function (id) {
      id.split(/[._]/).forEach(function (part) {
        (part.match(/[A-Z]?[a-z]{3,}|[A-Z]{4,}/g) || []).forEach(function (frag) {
          var f = frag.toLowerCase();
          if (f.length >= 4 && !entiers.has(f)) out.add(f);
        });
      });
    });
  return Array.from(out);
}

function aPointInterne(t) { return /[.!?][  ]+[A-ZÀ-ÖØ-Þ]/.test(String(t)); }
function aGuillemets(t) { return /[«»]/.test(String(t)); }
function aFleche(t) { return /→|->|=>|⇒/.test(String(t)); }

/* Le rang de longueur d'une option, les ex aequo etant tous candidats : sans cela
   une egalite ferait rendre un choix arbitraire et la mesure vaudrait le hasard. */
function parRang(q, rang) {
  var L = longueurs(q);
  var tri = L.slice().sort(function (a, b) { return b - a; });
  if (rang >= tri.length) return toutes(q);
  var cible = tri[rang];
  var s = L.reduce(function (acc, x, i) { if (x === cible) acc.push(i); return acc; }, []);
  return s.length ? s : toutes(q);
}

var STRATEGIES = [
  {
    nom: "hasard (etalon)",
    quoi: "clique n'importe ou",
    choisir: toutes,
  },
  {
    nom: "la plus longue",
    quoi: "la reponse qui compte le plus de caracteres",
    choisir: function (q) { return argMax(longueurs(q)); },
  },
  {
    /* AJOUTEE AU POINT B4 (reprise du cours `git`, 2026-09-06). DEUX contradicteurs sur
       quatre l'ont trouvee separement, et aucune des dix-huit strategies precedentes ne la
       voyait : la bonne reponse porte l'explication, donc elle est souvent la SEULE a
       separer deux propositions par un point-virgule. « la plus detaillee » compte les
       virgules et les deux-points ensemble, ce qui NOIE la marque : le point-virgule seul
       est bien plus tranchant.
       Mesure du jour, sur les 6 167 questions du site : couverture 17,4 %, RENDEMENT
       93,5 % (1 000 bonnes sur 1 070 questions tranchees). Sur `git` avant reprise :
       26 sur 26, soit 100,0 %. C'est le meme phenomene que la longueur, et il y SURVIT :
       `git` etait a 25,0 % sur la longueur et gardait 100 % sur le point-virgule.
       ⚠️ Elle n'entre PAS dans EXPLOITABLES de verif-qcm-biais.js : les cours deja
       marques `traite` sont au-dessus de 60 % dessus, et un cliquet qui rougit partout
       cesse d'etre lu. La dette est mesuree ici, elle se solde cours par cours. */
    nom: "la seule avec un point-virgule",
    quoi: "la seule option qui separe deux propositions par un point-virgule",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (String(t).indexOf(";") !== -1) acc.push(i); return acc; }, []);
      return s.length === 1 ? s : toutes(q);
    },
  },
  {
    nom: "la seule avec un tiret",
    quoi: "la seule option qui porte un tiret d'explication",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (aTiret(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "ecarter les absolus",
    quoi: "eliminer toute option qui dit « toujours », « jamais », « uniquement »…",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (!ABSOLUS.test(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "la plus prudente",
    quoi: "l'option qui nuance (« souvent », « permet », « selon »)",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (PRUDENTS.test(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    /* AJOUTEE le 2026-09-06 (B4, cours `doc`). Aucune des 17 strategies ne mesurait
       la NEGATION, et c'est un trou : sur `doc`, quand une seule option nie, c'est
       la bonne 2 fois sur 3 (rendement 66,7 %, contre 41,6 % sur le site et 9 a
       29 % sur les cours deja traites). Un correcteur qui redige la bonne reponse
       comme un DEMENTI de l'idee recue laisse cette trace, et rien ne la voyait. */
    nom: "la seule qui nie",
    quoi: "l'option seule a porter une negation (« ne », « pas », « jamais », « aucun »)",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (NIE.test(t)) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  {
    nom: "la plus detaillee",
    quoi: "l'option qui compte le plus de virgules et de deux-points",
    choisir: function (q) {
      return argMax(q.a.map(function (t) { return (t.match(/[,:;]/g) || []).length; }));
    },
  },
  {
    nom: "le mot technique exclusif",
    quoi: "l'option seule a porter un mot long qu'aucune autre n'emploie",
    choisir: function (q) { return argMax(scoreMotExclusif(q)); },
  },
  {
    /* AJOUTE EN B4 (2026-09-04). B1 avait cru faire le tour des indices et en a
       manque un qui est le DEUXIEME du site : l'incise entre parentheses, portee
       par la seule bonne reponse. Mesuree apres coup sur les 6 167 questions :
       59,2 %. Six relecteurs adversariaux du lot `js` l'ont signalee sans se
       concerter, et aucun des huit indices de B1 ne la voyait. On ne compte pas
       les parentheses d'appel de fonction — `f()`, `map()` — mais les incises
       d'au moins quatre caracteres, celles qui expliquent. */
    nom: "l'incise entre parentheses",
    quoi: "l'option qui glisse le plus d'explications entre parentheses",
    choisir: function (q) {
      return argMax(q.a.map(function (t) { return (t.match(/\([^)]{4,}\)/g) || []).length; }));
    },
  },
  {
    /* AJOUTE EN B4. Meme angle mort : la bonne reponse est souvent la seule a
       CRIER un mot. Les sigles du metier (HTML, JSON, DOM...) ne sont pas des
       emphases : sans cette exclusion la mesure ne voudrait rien dire. */
    nom: "la MAJUSCULE d'emphase",
    quoi: "l'option seule a crier un mot en capitales",
    choisir: function (q) {
      return argMax(q.a.map(function (t) {
        return (t.match(CAPITALES) || []).filter(function (w) {
          return !SIGLES.test(w.replace(/'/g, ""));
        }).length;
      }));
    },
  },
  {
    nom: "l'echo de la question",
    quoi: "l'option qui reprend le plus de mots de l'enonce",
    choisir: function (q) {
      var enonce = new Set((q.q.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []));
      return argMax(q.a.map(function (t) {
        var n = 0;
        (new Set((t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []))).forEach(function (m) {
          if (enonce.has(m)) n++;
        });
        return n;
      }));
    },
  },
  {
    /* AJOUTE EN B4 (2026-09-05, cours `projets-js`). TROISIEME angle mort de B1,
       et le premier qui soit FABRIQUE PAR LA CORRECTION elle-meme : en reecrivant
       les distracteurs, trois lots sur six ont calque « Parce que… » sur tous les
       distracteurs d'une question en laissant la bonne reponse commencer
       autrement. L'apprenant n'a alors qu'a reperer l'intrus. Mesure sur le cours
       traite : 25,9 % avant la vague d'ecriture, 29,8 % apres (41,7 % quand la
       regle se declenche), 22,0 % apres correction. Trois relecteurs adversariaux
       l'ont signale sans se concerter, et AUCUNE des dix strategies precedentes ne
       le voyait — pas plus que sur le cours `nodejs`, ou le meme defaut avait deja
       ete trouve a la main.
       Les locutions comptent pour UN mot : separer « parce que » de « parce qu' »
       sous-estimerait l'indice (defaut mesure sur la premiere version de l'outil). */
    nom: "l'attaque unique",
    quoi: "l'option dont le mot d'attaque differe de celui des trois autres",
    choisir: function (q) {
      var at = q.a.map(motAttaque), cnt = {};
      at.forEach(function (a) { cnt[a] = (cnt[a] || 0) + 1; });
      var s = at.reduce(function (acc, a, i) { if (cnt[a] === 1) acc.push(i); return acc; }, []);
      return s.length === 1 ? s : toutes(q);
    },
  },
  {
    /* AJOUTEE AU POINT B4 (cours `react`, 2026-09-05), et elle vient d'une faute
       QUE CET OUTIL NE VOYAIT PAS. La vague de reecriture des distracteurs de
       `react` a termine chaque nouveau distracteur des lecons 16 a 20 par un
       POINT, en laissant la bonne reponse sans ponctuation finale : sur ces cinq
       lecons, l'option a la fin unique etait la bonne 15 fois sur 15. Aucune des
       onze strategies precedentes ne le voyait — ni la longueur, ni la
       ponctuation interne, qui ne regardent pas le DERNIER caractere.
       C'est la meme famille que « l'attaque unique » : un lot d'ecriture confie a
       un agent prend un tic de style, et ce tic designe l'intrus. La regle
       generale a retenir : TOUTE REGULARITE TYPOGRAPHIQUE QUI SEPARE LES
       DISTRACTEURS D'UN LOT DE LEUR BONNE REPONSE EST UN INDICE.
       Mesure du jour, apres correction : 25 questions designees sur 6 167 pour
       tout le site, 44,0 % de reussite quand la regle se declenche, 25,1 % sur
       l'ensemble — donc l'indice n'existe PAS ailleurs sur le site, il avait ete
       fabrique par la passe. */
    nom: "la ponctuation finale unique",
    quoi: "l'option dont le dernier caractere (point ou non) differe des trois autres",
    choisir: function (q) {
      var fins = q.a.map(function (t) { return /[.!?]$/.test(String(t).trim()) ? 1 : 0; });
      var avec = fins.reduce(function (n, x) { return n + x; }, 0);
      var rare = avec === 1 ? 1 : (avec === fins.length - 1 ? 0 : null);
      if (rare === null) return toutes(q);
      return fins.reduce(function (acc, x, i) { if (x === rare) acc.push(i); return acc; }, []);
    },
  },
  {
    /* AJOUTEE AU POINT B4 (cours `ruby`, 2026-09-05). Deux relecteurs adversariaux sur
       six l'ont vue, chacun de son cote : la bonne reponse commence par un jeton de code
       en minuscule (`sort renvoie...`, `super nu...`, `rescue => e capture...`) quand les
       distracteurs, rediges comme des phrases francaises, prennent une majuscule.
       LA CAUSE EST DANS CET OUTIL, a la ligne : `motAttaque()` fait un .toLowerCase()
       AVANT toute comparaison, donc « l'attaque unique » compare les MOTS et jamais leur
       CASSE. Une faute invisible a l'outil qui etait cense la voir.
       Mesure du jour : sur `ruby`, la vague d'ecriture l'avait fait monter de 25,9 % a
       30,4 % (39,6 % sur le lot des lecons 01-04, ou elle designait la SEULE bonne
       reponse une question sur quatre) ; apres correction, 23,8 % et plus aucune
       designation unique. Sur les 6 167 questions du site : 25,2 %, le hasard. */
    nom: "la casse initiale rare",
    quoi: "l'option dont le premier caractere est de casse differente des trois autres",
    choisir: function (q) {
      var min = q.a.map(function (t) {
        var c = String(t).trim().replace(/^[«"'`\s]+/, "").charAt(0);
        return c && c === c.toLowerCase() && c !== c.toUpperCase() ? 1 : 0;
      });
      var n = min.reduce(function (a, x) { return a + x; }, 0);
      var rare = n === 1 ? 1 : (n === min.length - 1 ? 0 : null);
      if (rare === null) return toutes(q);
      return min.reduce(function (acc, x, i) { if (x === rare) acc.push(i); return acc; }, []);
    },
  },
  {
    /* AJOUTEE AU POINT B4 (cours `ruby`, 2026-09-05), meme famille que la precedente et
       meme origine : la vague d'ecriture donne a chaque lot le TIC DE STYLE de son agent.
       Ici, l'agent des lecons 05-08 a termine ses distracteurs par une glose entre
       parentheses — « (qui poursuit) », « (une paire par element) » — que la bonne
       reponse ne porte pas. Sur ce lot : 56,9 %, et la regle designait la SEULE bonne
       reponse dans 41,7 % des questions. Le cours entier ne montait qu'a 28,6 %, et le
       site est a 21,2 % : PAR COURS, l'indice etait invisible.
       C'est le troisieme indice de suite fabrique par la correction, apres le mot
       d'attaque (`projets-js`) et le point final (`react`). La regle generale tient :
       toute regularite typographique qui separe les distracteurs d'un lot de leur bonne
       reponse est un indice, et le bon niveau d'observation est le LOT, pas le cours. */
    nom: "ecarter la glose finale",
    quoi: "eliminer les options qui se terminent par une incise entre parentheses",
    choisir: function (q) {
      var f = q.a.map(function (t) { return /\([^()]{3,}\)[.!?]?$/.test(String(t).trim()) ? 1 : 0; });
      var n = f.reduce(function (a, x) { return a + x; }, 0);
      if (n === 0 || n === f.length) return toutes(q);
      return f.reduce(function (acc, x, i) { if (!x) acc.push(i); return acc; }, []);
    },
  },
  /* ⚠️ LES TROIS STRATEGIES DE RANG, ajoutees au point B4 (cours `sql`, 2026-09-06).
     ELLES MESURENT CE QUE LA CORRECTION FABRIQUE. Le chantier corrige « la bonne
     reponse est la plus LONGUE » jusqu'a la faire tomber sous le hasard -- mais une
     question a quatre options a QUATRE rangs de longueur, et ecraser le rang 0 pousse
     la bonne reponse sur le rang 1. Mesure du 2026-09-06 sur les 22 cours deja
     traites : `doc`, qui n'a JAMAIS la bonne reponse la plus longue (0,0 %), l'a en
     DEUXIEME position dans 60,9 % des cas -- soit deux fois et demie le hasard, et
     bien pire que ce que la correction croyait avoir supprime. `archi` est a 56,3 %
     sur le rang 2. Aucune des quatorze strategies precedentes ne voyait cela : elles
     ne connaissent que les extremes. LA REGLE QUI EN DECOULE : viser 25 % sur CHAQUE
     rang, jamais 0 % sur le premier. */
  {
    nom: "la DEUXIEME plus longue",
    quoi: "le rang 1 de longueur — ce que devient la bonne reponse quand on ecrase le rang 0",
    choisir: function (q) { return parRang(q, 1); },
  },
  {
    nom: "la TROISIEME plus longue",
    quoi: "le rang 2 de longueur",
    choisir: function (q) { return parRang(q, 2); },
  },
  {
    nom: "ecarter les deux extremes",
    quoi: "ni la plus longue ni la plus courte — la zone ou la correction pousse la bonne reponse",
    choisir: function (q) {
      var L = longueurs(q), mx = Math.max.apply(null, L), mn = Math.min.apply(null, L);
      var s = L.reduce(function (acc, x, i) { if (x !== mx && x !== mn) acc.push(i); return acc; }, []);
      return s.length ? s : toutes(q);
    },
  },
  /* ⚠️ LES DEUX STRATEGIES « ECARTER », ajoutees au point B4 (cours `stats`, 2026-09-07).
     ELLES REPARENT UN DEFAUT DE L'OUTIL, PAS DU CONTENU, et c'est ce qui les rend
     importantes : les vingt-trois strategies precedentes sont TOUTES directionnelles
     sauf quatre (`ecarter les absolus`, `ecarter la glose finale`, `ecarter les deux
     extremes`, et les rangs 2/3 de longueur). Un indice qu'on ferme trop fort ne
     disparait pas : il SE RETOURNE, et l'outil reste vert pendant que la faille est
     entiere. C'est la lecon du cours `mobile` (fermer un indice a fond le RETOURNE)
     transposee a la FORME DE LA MESURE elle-meme.

     Ce qui a declenche l'ajout : sur `stats` detordu, « la plus detaillee » tombe a
     16,9 % et « l'echo de la question » a 10,9 % — tres SOUS l'etalon du hasard de
     25,0 %. Un taux sous le hasard n'est pas un indice ferme, c'est un indice inverse
     exploitable. Mesure independante d'un relecteur adversarial sur les 72 questions
     du cours : quand une option porte STRICTEMENT le plus de `, : ;`, ce n'est JAMAIS
     la bonne — 0 sur 33.

     La consigne d'ecriture doit donc etre SYMETRIQUE : la bonne reponse ne doit etre
     ni celle qui en porte le plus, ni celle qui en porte le moins. Viser 25 % dans
     les DEUX sens, comme pour les rangs de longueur.

     ⚠️ Ajouter ces deux strategies fait remonter `pire` sur une dizaine de cours d'un
     coup. Ce n'est PAS une regression : c'est une dimension neuve. La reference a donc
     ete refigee dans LE MEME COMMIT, en le disant. */
  {
    nom: "ECARTER la plus detaillee",
    quoi: "tirer parmi les options qui ne portent PAS le maximum de , : ;",
    choisir: function (q) {
      return ecarterMax(q, q.a.map(function (t) { return (t.match(/[,:;]/g) || []).length; }));
    },
  },
  {
    nom: "ECARTER l'echo de la question",
    quoi: "tirer parmi les options qui ne reprennent PAS le plus de mots de l'enonce",
    choisir: function (q) {
      var enonce = new Set((q.q.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []));
      return ecarterMax(q, q.a.map(function (t) {
        var n = 0;
        (new Set((t.toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ-]{3,}/g) || []))).forEach(function (m) {
          if (enonce.has(m)) n++;
        });
        return n;
      }));
    },
  },
  /* LES TROIS STRATEGIES DE RESTRICTION, ajoutees au point B4 (cours `data-eng`,
     2026-09-06). ELLES MESURENT LE PLAFOND QUE LA CORRECTION ELLE-MEME INSTALLE.
     Les strategies de marque ci-dessus cherchent l'option SEULE a porter un signe ;
     la consigne de correction dit « au moins un distracteur doit porter la meme
     marque », ce qui ramene leur couverture a zero. Mais un apprenant n'a pas besoin
     de l'unicite : il lui suffit de RESTREINDRE son tirage aux options marquees. Si
     la marque est portee par la bonne reponse et par UN seul distracteur, il tire a
     pile ou face -- 50 %, le double du hasard, et AUCUNE des 19 strategies
     precedentes ne le voit. Deux relecteurs adversariaux l'ont signale le meme jour,
     sans se concerter ; leur chiffre (100 %) etait celui de leur LOT, la mesure sur le
     cours entier dit 45,6 %.
     Mesure du jour, avant / apres la vague d'ecriture sur `data-eng` : point-virgule
     97,4 % -> 45,6 % de rendement, parenthese 98,7 % -> 48,7 %, deux-points 83,8 %
     -> 35,7 %. Le residu n'est pas un oubli, c'est le PLAFOND MECANIQUE de la
     consigne. Sur les cours deja traites il tient : `git` 47,8 / 50,9 %, `csharp`
     43,4 / 39,4 %, `cpp` 44,2 / 42,0 %, `java` 43,0 / 39,3 %, `react` 34,0 / 49,0 %.
     LA REGLE QUI EN DECOULE, a mettre en consigne : porter la marque sur DEUX
     distracteurs quand la bonne reponse la porte, et en poser aussi sur des
     distracteurs de questions ou la bonne reponse n'en porte PAS. L'etalon reste
     25,0 % : une marque distribuee au hasard sur n options rend n/4 x 1/n. */
  {
    nom: "RESTREINDRE au point-virgule",
    quoi: "tirer parmi les seules options qui portent un « ; » — le plafond de 50 %",
    choisir: function (q) { return restreindre(q, function (t) { return /;/.test(t); }); },
  },
  {
    nom: "RESTREINDRE a la parenthese",
    quoi: "tirer parmi les seules options qui portent une incise entre parentheses",
    choisir: function (q) { return restreindre(q, function (t) { return /[(][^()]+[)]/.test(t); }); },
  },
  {
    nom: "RESTREINDRE aux deux-points",
    quoi: "tirer parmi les seules options qui portent un « : »",
    choisir: function (q) { return restreindre(q, function (t) { return /:/.test(t); }); },
  },
  /* ⚠️ LES DEUX STRATEGIES DE DENSITE, ajoutees au point B4 (cours `php`, 2026-09-07).
     ELLES MESURENT CE QUE LA FENETRE 70-130 % FABRIQUE. La consigne d'ecriture impose
     aux distracteurs une longueur en CARACTERES proche de la bonne reponse ; pour y
     arriver on les rembourre avec de petits mots francais, si bien que la longueur
     est plate mais que les distracteurs portent PLUS DE MOTS, chacun PLUS COURT.
     Mesure du jour sur `php` fraichement detordu : 19,6 mots par distracteur contre
     18,1 pour la bonne reponse, et 4,56 lettres par mot contre 4,83. La regle « coche
     l'option qui dit la meme chose en MOINS DE MOTS » tranche sur 93,6 % des questions
     et rend 39,0 % — et ce n'est pas propre a cette vague : `mobile` 46,6 %, `ruby`
     40,4 %, `js` 36,9 %. C'est une dette de TOUTE la campagne, restee invisible parce
     que les 24 strategies precedentes comptent des CARACTERES et des SIGNES, jamais
     des MOTS. LA REGLE QUI EN DECOULE : allonger un distracteur avec du vocabulaire
     technique, pas avec des chevilles ; viser un nombre de mots comparable.
     Trouvee par un agent mesureur charge de chercher ce qu'aucun outil ne cherche,
     puis re-mesuree independamment avant d'etre cablee ici.

     ⚠️ Ajouter ces deux strategies fait remonter `pire` sur beaucoup de cours d'un
     coup. Ce n'est PAS une regression : c'est une dimension neuve. La reference est
     donc refigee dans LE MEME COMMIT, en le disant. */
  {
    nom: "la plus dense (mots longs)",
    quoi: "l'option dont les mots sont en moyenne les plus longs — ce que le rembourrage trahit",
    choisir: function (q) { return argMax(q.a.map(densiteMots)); },
  },
  {
    nom: "la moins bavarde (peu de mots)",
    quoi: "l'option qui compte le MOINS de mots a longueur egale",
    choisir: function (q) {
      var n = q.a.map(function (t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; });
      var mn = Math.min.apply(null, n);
      var s = n.reduce(function (acc, x, i) { if (x === mn) acc.push(i); return acc; }, []);
      return s.length === q.a.length ? toutes(q) : s;
    },
  },
  /* ⚠️ LES DEUX STRATEGIES INVERSES DE DENSITE, ajoutees au point B4 (cours `kotlin`,
     2026-09-08). MEME MOTIF QUE LES DEUX « ECARTER » AJOUTEES SUR `stats`, sur une
     dimension neuve : les deux strategies de densite ci-dessus sont DIRECTIONNELLES,
     et notre propre campagne les pousse SOUS l'etalon du hasard.

     Pourquoi : pour tenir la fenetre de longueur, un ecrivain rembourre ses
     distracteurs de vocabulaire long, si bien que la bonne reponse (intouchable)
     n'est presque jamais la plus dense. Mesure sur `kotlin` detordu : « la plus
     dense » 17,3 %, « la moins bavarde » 19,2 % — nettement sous 25,0 %. Un taux
     sous le hasard n'est pas un indice ferme, c'est un indice INVERSE exploitable,
     et aucune des 32 strategies precedentes ne le voyait.

     QUATRE relecteurs adversariaux sur six l'ont signale independamment le meme
     jour, chacun sur son lot, avant que l'outil ne sache le mesurer. C'est la
     relecture qui a trouve le trou de l'outil, pas l'outil.

     ⚠️ Ajouter ces deux strategies fait remonter `pire` sur beaucoup de cours d'un
     coup. Ce n'est PAS une regression : c'est une dimension neuve. La reference est
     donc refigee dans LE MEME COMMIT, en le disant. */
  {
    nom: "ECARTER la plus dense",
    quoi: "tirer parmi les options qui ne portent PAS les mots les plus longs en moyenne",
    choisir: function (q) { return ecarterMax(q, q.a.map(densiteMots)); },
  },
  {
    nom: "ECARTER la moins bavarde",
    quoi: "tirer parmi les options qui ne comptent PAS le MOINS de mots",
    choisir: function (q) {
      var n = q.a.map(function (t) { return (t.match(/[A-Za-zÀ-ÿ0-9_]+/g) || []).length; });
      return ecarterMax(q, n.map(function (x) { return -x; }));
    },
  },
  /* ⚠️ L'INVERSE DU MOT TECHNIQUE EXCLUSIF, ajoutee au point B4 (cours `c`,
     2026-09-08). TROISIEME fois que le meme motif se produit — apres les deux
     « ECARTER » de `stats` et les deux de densite de `kotlin` — et, comme les deux
     fois precedentes, ce sont les RELECTEURS qui l'ont vu avant l'outil : trois des
     six lots d'ecriture de `c` ont signale, chacun sur son lot, que l'indice etait
     passe SOUS l'etalon du hasard et que rien ne le mesurait.

     Le mecanisme est mecanique, et il est le NOTRE : la consigne (4) demande que
     deux distracteurs au moins portent du vocabulaire du meme registre que la bonne
     reponse. Comme la bonne reponse est intouchable, ce sont les distracteurs qui
     recoivent le vocabulaire neuf, et c'est un DISTRACTEUR qui finit seul a porter
     un mot long que personne d'autre n'emploie. Mesure sur `c` detordu avant
     cablage : « le mot technique exclusif » 19,2 % — donc l'ecarter payait.

     Comme pour les quatre precedentes : ajouter cette strategie fait remonter
     `pire` sur des cours deja traites. Ce n'est PAS une regression, c'est une
     dimension neuve, et la reference est refigee dans le meme commit. */
  {
    nom: "ECARTER le mot technique exclusif",
    quoi: "tirer parmi les options qui ne portent PAS de mot long exclusif",
    choisir: function (q) { return ecarterMax(q, scoreMotExclusif(q)); },
  },
  /* ⚠️ LES SIX STRATEGIES DE MARQUE TYPOGRAPHIQUE, ajoutees au point B4 (dette 3
     laissee par le cours `php`, cablees le 2026-09-07). La consigne « les quatre ou
     aucune » ne couvrait jusqu'ici que le point-virgule, la parenthese et les
     deux-points. Trois marques restaient hors de tout outil, et la mesure faite
     AVANT de les cabler dit que la premiere est la PLUS RENTABLE DU SITE :

       marque                       couverture   rendement (unique / restreint)
       le POINT INTERNE                  5,0 %      99,0 %  /  94,5 %
       les GUILLEMETS francais           2,6 %      76,1 %  /  65,3 %
       la FLECHE (-> ou =>)              1,6 %      75,0 %  /  66,8 %
       temoin : point-virgule           13,7 %      91,3 %  /  71,7 %
       temoin : parenthese              29,5 %      92,5 %  /  76,1 %

     99,0 % sur 308 questions : c'est le rendement le plus eleve mesure depuis le
     debut du chantier, AU-DESSUS du point-virgule et de la parenthese, et aucune
     des 26 strategies precedentes ne le voyait. La cause est un reflexe de
     redaction, verifie sur echantillon avant le cablage : la bonne reponse explique
     puis CONCLUT — « … donc la branche 12 la capte avant. Il faut tester du plus
     restrictif au moins restrictif » — pendant que les distracteurs tiennent en une
     phrase. Sur les 308 questions ou une seule option est ecrite en deux phrases,
     c'est la bonne reponse 305 fois.
     LA REGLE QUI EN DECOULE : les quatre options, ou aucune, pour ces marques
     aussi — et pour le point interne, la conclusion en seconde phrase se met sur
     les distracteurs ou se fond dans la premiere. */
  {
    nom: "la seule en deux phrases",
    quoi: "la seule option qui contient un point suivi d'une majuscule — elle explique PUIS conclut",
    choisir: function (q) { return seule(q, aPointInterne); },
  },
  {
    nom: "RESTREINDRE au point interne",
    quoi: "tirer parmi les seules options ecrites en deux phrases",
    choisir: function (q) { return restreindre(q, aPointInterne); },
  },
  {
    nom: "la seule avec des guillemets",
    quoi: "la seule option qui cite un terme entre guillemets francais",
    choisir: function (q) { return seule(q, aGuillemets); },
  },
  {
    nom: "RESTREINDRE aux guillemets",
    quoi: "tirer parmi les seules options qui portent des guillemets francais",
    choisir: function (q) { return restreindre(q, aGuillemets); },
  },
  {
    nom: "la seule avec une fleche",
    quoi: "la seule option qui montre une transformation par une fleche",
    choisir: function (q) { return seule(q, aFleche); },
  },
  {
    nom: "RESTREINDRE a la fleche",
    quoi: "tirer parmi les seules options qui portent une fleche",
    choisir: function (q) { return restreindre(q, aFleche); },
  },
  /* ⚠️ L'ECHO DE FRAGMENT D'IDENTIFIANT, ajoutee au point B4 (cours `solidity`,
     2026-09-08). Trouvee par un lot d'ecriture DANS SON PROPRE TRAVAIL, outillee par
     lui, puis rejouee ici avant cablage — c'est la QUATRIEME fois qu'un indice arrive
     par la relecture avant l'outil.

     Le mecanisme est un angle mort de tokenisation. « l'echo de la question » decoupe
     l'enonce par /[a-zà-ÿ][a-zà-ÿ-]{3,}/ sur le texte en minuscules : un identifiant
     du metier — `vm.expectRevert`, `setUp()`, `customElements`, `ArrayBuffer`,
     `totalDepenses` — y devient UN SEUL jeton. Ses MORCEAUX ne sont donc jamais
     cherches dans les options. Or la bonne reponse est precisement celle qui EXPLIQUE
     l'identifiant, donc celle qui en reemploie un morceau en clair : « A quoi sert
     vm.expectRevert ? » -> « ... doit echouer (revert) ».

     Mesure du jour sur les 6 167 questions : la regle tranche sur 201 questions
     (3,3 %) et rend 39,0 % ; en designation unique, 47 bonnes reponses sur 98
     (48,0 %). Couverture faible, rendement nettement au-dessus de l'etalon : c'est le
     profil d'un indice rare et sur, celui que la colonne « reussite » noie et que la
     colonne RENDEMENT montre. */
  {
    nom: "l'echo de FRAGMENT d'identifiant",
    quoi: "tirer parmi les options qui reprennent un MORCEAU d'un identifiant de l'enonce",
    choisir: function (q) {
      var frags = fragmentsIdentifiants(q.q);
      if (!frags.length) return toutes(q);
      return restreindre(q, function (t) {
        var s = String(t).toLowerCase();
        return frags.some(function (fr) { return s.indexOf(fr) !== -1; });
      });
    },
  },
  {
    nom: "COMBINE : tiret puis longueur",
    quoi: "le tiret d'abord, la longueur pour departager — la methode d'un tricheur",
    choisir: function (q) {
      var s = q.a.reduce(function (acc, t, i) { if (aTiret(t)) acc.push(i); return acc; }, []);
      var cand = s.length ? s : toutes(q);
      var lg = cand.map(function (i) { return q.a[i].length; });
      var m = Math.max.apply(null, lg);
      return cand.filter(function (i) { return q.a[i].length === m; });
    },
  },
];

/* ---------------------------------------------------------------------- la mesure */
var corpus = lireCorpus();
/* --seul=<cours> : le tableau des 19 strategies RESTREINT a un seul cours, avec sa
   colonne RENDEMENT. Ajoute au point B4 (cours `cpp`) : `--cours` ne rendait que la
   longueur et la meilleure strategie, et `--lots=<n> --cours=<c>` ne montrait que ce
   qui depasse un seuil de 60 % — donc un indice RARE et SUR (le point-virgule, mesure
   a 93,5 % de rendement sur le site) restait invisible cours par cours. */
var SEUL = (process.argv.filter(function (x) { return x.indexOf("--seul=") === 0; })[0] || "").slice(7);
if (SEUL) {
  corpus = corpus.filter(function (q) { return q.cours === SEUL; });
  if (!corpus.length) { console.error("cours inconnu ou sans QCM : " + SEUL); process.exit(2); }
}
if (!corpus.length) { console.error("aucune question trouvee sous pages/ — mesure impossible"); process.exit(2); }

var resultats = STRATEGIES.map(function (s) {
  var succes = 0, exaequo = 0, francs = 0, tranche = 0;
  corpus.forEach(function (q) {
    var choix = s.choisir(q);
    if (!choix.length) choix = toutes(q);
    if (choix.length > 1) exaequo++; else tranche++;
    if (choix.indexOf(q.k) !== -1) {
      succes += 1 / choix.length;
      if (choix.length === 1) francs++;
    }
  });
  return { nom: s.nom, quoi: s.quoi, taux: succes / corpus.length,
    francs: francs / corpus.length, exaequo: exaequo / corpus.length,
    tranche: tranche / corpus.length, rendement: tranche ? francs / tranche : 0 };
});

/* Le biais POSITIONNEL, pour information seulement : les options sont melangees
   a l'affichage, donc ce chiffre ne decrit pas ce que l'apprenant peut exploiter. */
var positions = {};
corpus.forEach(function (q) { positions[q.k] = (positions[q.k] || 0) + 1; });

/* Par cours : le taux de la meilleure strategie exploitable (hors etalon). */
var parCours = {};
corpus.forEach(function (q) { (parCours[q.cours] = parCours[q.cours] || []).push(q); });
var coursMesure = Object.keys(parCours).map(function (c) {
  var qs = parCours[c];
  var best = { nom: "", taux: -1 };
  var parStrategie = {};
  STRATEGIES.slice(1).forEach(function (s) {
    var succes = 0;
    qs.forEach(function (q) {
      var choix = s.choisir(q); if (!choix.length) choix = toutes(q);
      if (choix.indexOf(q.k) !== -1) succes += 1 / choix.length;
    });
    var t = succes / qs.length;
    parStrategie[s.nom] = t;
    if (t > best.taux) best = { nom: s.nom, taux: t };
  });
  var lg = 0;
  qs.forEach(function (q) {
    var choix = argMax(longueurs(q));
    if (choix.indexOf(q.k) !== -1) lg += 1 / choix.length;
  });
  return { cours: c, questions: qs.length, longueur: lg / qs.length,
    meilleure: best.nom, taux: best.taux, parStrategie: parStrategie };
}).sort(function (a, b) { return b.taux - a.taux; });

/* Les questions les plus devinables : combien de strategies exploitables tombent
   sur la bonne reponse SANS ex aequo. Une question que 6 indices sur 8 trahissent
   n'a plus rien d'une question. */
var pires = corpus.map(function (q) {
  var n = 0, quels = [];
  STRATEGIES.slice(1).forEach(function (s) {
    var choix = s.choisir(q); if (!choix.length) choix = toutes(q);
    if (choix.length === 1 && choix[0] === q.k) { n++; quels.push(s.nom); }
  });
  return { cours: q.cours, fichier: q.fichier, q: q.q.slice(0, 60), n: n, quels: quels };
}).sort(function (a, b) { return b.n - a.n; });

function pct(x) { return (x * 100).toFixed(1) + " %"; }

if (JSON_MODE) {
  console.log(JSON.stringify({
    questions: corpus.length, strategies: resultats, positions: positions,
    parCours: coursMesure, pires: pires.slice(0, PIRE || 20),
  }, null, 2));
  process.exit(0);
}

console.log("mesure-biais-qcm — " + corpus.length + " questions (" +
  corpus.filter(function (q) { return q.bilan; }).length + " en QCM bilan) sur " +
  Object.keys(parCours).length + " cours\n");
console.log("  Reussite d'un apprenant qui ne comprend RIEN et applique une regle mecanique :\n");
console.log("    strategie                        reussite   sans ex aequo   ex aequo   couverture   RENDEMENT");
resultats.forEach(function (r) {
  console.log("    " + (r.nom + "                                 ").slice(0, 32) +
    " " + ("       " + pct(r.taux)).slice(-8) +
    "   " + ("       " + pct(r.francs)).slice(-8) +
    "      " + ("      " + pct(r.exaequo)).slice(-7) +
    "    " + ("       " + pct(r.tranche)).slice(-8) +
    "    " + ("       " + pct(r.rendement)).slice(-8));
});
console.log("\n  Lecture : « sans ex aequo » = la strategie a designe UNE option, et c'etait la bonne.");
console.log("  « couverture » = part des questions ou la strategie TRANCHE ; « RENDEMENT » = sa reussite");
console.log("  SUR CES QUESTIONS-LA seulement. Colonne ajoutee le 2026-09-06 (B4, cours `doc`) parce que");
console.log("  la colonne « reussite » NOIE un indice rare et sur dans le hasard des questions qu'il ne");
var TIRET = resultats.filter(function (r) { return r.nom === "la seule avec un tiret"; })[0];
console.log("  couvre pas : « la seule avec un tiret » a une reussite de " + pct(TIRET.taux) + " et un rendement de");
console.log("  " + pct(TIRET.rendement) + ". B1 avait ecarte trois strategies « au niveau du hasard » sur la seule reussite ;");
console.log("  leur rendement dit l'inverse. C'est la lecon du cours `react` — un indice de LOT vaut");
console.log("  100 % sur le lot et 25 % sur le site — transposee a la FORME de la mesure elle-meme.");
console.log("  Un indice ne vaut d'etre corrige que s'il depasse nettement l'etalon du hasard (" +
  pct(resultats[0].taux) + ").");

console.log("\n  POUR INFORMATION, et surtout pas comme une faille : la bonne reponse est en position");
console.log("  " + JSON.stringify(positions) + " dans le SOURCE — mais `js/lecon.js` melange les options");
console.log("  a l'affichage (shuffle, dans buildQuiz, pour les QCM de lecon comme pour les bilans),");
console.log("  donc la position n'est pas exploitable par l'apprenant.");

var repartition = { "0-2": 0, "3-4": 0, "5+": 0 };
pires.forEach(function (p) {
  if (p.n >= 5) repartition["5+"]++; else if (p.n >= 3) repartition["3-4"]++; else repartition["0-2"]++;
});
/* Le nombre d'indices se COMPTE, il ne se recopie pas : il valait « 8 » en dur
   alors que la table en portait deja onze — corrige au point B4. */
console.log("\n  Nombre d'indices qui trahissent une meme question (sur " +
  (STRATEGIES.length - 1) + " strategies) :");
console.log("    0 a 2 indices : " + repartition["0-2"] + "   3 ou 4 : " + repartition["3-4"] +
  "   5 et plus : " + repartition["5+"] + " (" + pct(repartition["5+"] / corpus.length) + ")");

if (PAR_COURS) {
  console.log("\n  Par cours, du plus devinable au moins (meilleure strategie exploitable) :\n");
  console.log("    cours                questions   longueur   meilleure strategie");
  coursMesure.forEach(function (c) {
    console.log("    " + (c.cours + "                    ").slice(0, 20) +
      " " + ("      " + c.questions).slice(-9) +
      "   " + ("       " + pct(c.longueur)).slice(-8) +
      "   " + pct(c.taux) + "  " + c.meilleure);
  });
}

if (LOTS) {
  /* Fenetre GLISSANTE : les lots d'ecriture ne tombent pas sur des frontieres connues
     d'avance, donc une decoupe fixe raterait un tic a cheval sur deux fenetres. On ne
     mesure qu'une fenetre d'au moins 8 questions : en dessous, le bruit du hasard
     depasse le seuil tout seul (a 8 questions, l'ecart-type du pur hasard est de 15
     points). Une soustraction n'est pas une mesure, et une fenetre trop courte non plus. */
  var MIN_Q = 8;
  /* Sur quels cours ? Un cours NON traite est au-dessus du seuil dans toutes ses
     fenetres — c'est son biais d'origine, pas un tic de lot, et l'afficher noierait le
     signal (mesure : 4 038 alertes sur les 90 cours, contre une poignee sur les seuls
     cours traites). Par defaut on ne regarde donc que les cours marques `traite` dans
     tools/qcm-biais-reference.json ; `--cours=<nom>` force un cours precis. */
  var UN = (process.argv.filter(function (x) { return x.indexOf("--cours=") === 0; })[0] || "").slice(8);
  var traites = null;
  if (!UN) {
    try {
      var ref = JSON.parse(fs.readFileSync(path.join(__dirname, "qcm-biais-reference.json"), "utf8"));
      traites = Object.keys(ref.cours || {}).filter(function (c) { return ref.cours[c].traite; });
    } catch (e) { traites = null; }
  }
  var parCoursLot = {};
  corpus.forEach(function (q) {
    if (UN && q.cours !== UN) return;
    if (!UN && traites && traites.indexOf(q.cours) === -1) return;
    var m = /^lecon-(\d+)\.html$/.exec(q.fichier); if (!m) return;
    (parCoursLot[q.cours] = parCoursLot[q.cours] || []).push({ n: Number(m[1]), q: q });
  });
  var alertes = [], fenetres = 0;
  Object.keys(parCoursLot).sort().forEach(function (c) {
    var lot = parCoursLot[c];
    var nums = lot.map(function (x) { return x.n; });
    var lo = Math.min.apply(null, nums), hi = Math.max.apply(null, nums);
    for (var d = lo; d + LOTS - 1 <= hi; d++) {
      var f = d + LOTS - 1;
      var qs = lot.filter(function (x) { return x.n >= d && x.n <= f; })
        .map(function (x) { return x.q; });
      if (qs.length < MIN_Q) continue;
      fenetres++;
      STRATEGIES.slice(1).forEach(function (s) {
        var succes = 0, solo = 0;
        qs.forEach(function (q) {
          var choix = s.choisir(q); if (!choix.length) choix = toutes(q);
          if (choix.indexOf(q.k) !== -1) { succes += 1 / choix.length; if (choix.length === 1) solo++; }
        });
        var t = succes / qs.length, so = solo / qs.length;
        if (t >= SEUIL_LOT || so >= SEUIL_SOLO) {
          alertes.push({ cours: c, de: d, a: f, questions: qs.length, nom: s.nom, taux: t, solo: so });
        }
      });
    }
  });
  alertes.sort(function (a, b) { return b.taux - a.taux; });
  console.log("\n  PAR FENETRE DE " + LOTS + " LECONS — " + fenetres + " fenetres d'au moins "
    + MIN_Q + " questions sur " + Object.keys(parCoursLot).length + " cours "
    + (UN ? "(--cours=" + UN + ")" : traites ? "(les cours marques `traite`)" : "(tous)")
    + ", seuils " + pct(SEUIL_LOT) + " / " + pct(SEUIL_SOLO) + " en designation unique :\n");
  if (!alertes.length) console.log("    aucune fenetre au-dessus des seuils.");
  else {
    console.log("    cours          lecons    q   strategie                       taux    seule bonne");
    alertes.forEach(function (a) {
      console.log("    " + (a.cours + "              ").slice(0, 14) +
        " " + (a.de + "-" + a.a + "      ").slice(0, 8) +
        " " + ("   " + a.questions).slice(-3) +
        "   " + (a.nom + "                              ").slice(0, 30) +
        "  " + ("      " + pct(a.taux)).slice(-7) + "   " + ("      " + pct(a.solo)).slice(-7));
    });
    console.log("\n    Une fenetre au-dessus du seuil ne prouve pas une faute : elle designe l'endroit");
    console.log("    ou regarder. Un cours entier ecrit d'une seule main peut etre haut partout.");
  }
}

if (PIRE) {
  console.log("\n  Les " + PIRE + " questions les plus devinables :\n");
  pires.slice(0, PIRE).forEach(function (p) {
    console.log("    " + p.n + " indices  " + p.cours + "/" + p.fichier + "  « " + p.q + " »");
    console.log("              " + p.quels.join(", "));
  });
}
process.exit(0);
