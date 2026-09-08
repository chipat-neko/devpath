/* =============================================================================
   mesure-explain-orpheline.js — l'explication d'un QCM commente-t-elle une option
   QUI N'EXISTE PLUS dans la question ?

   POURQUOI. Trou d'outillage releve le 2026-09-08 en cloturant le 31e cours de B4
   (`kotlin`) et inscrit au point F3. Le protocole de B4 reecrit les DISTRACTEURS
   d'un cours en masse pour supprimer le biais de longueur, et declare la bonne
   reponse ET le champ `explain` INTOUCHABLES. La consequence n'avait ete vue par
   personne, ni par aucun des 53 verificateurs : l'`explain` CITE souvent les
   distracteurs pour les refuter (« contrairement a X », « X est du JavaScript »).
   Quand X est remplace, l'explication continue de commenter un texte que
   l'apprenant n'a plus sous les yeux. Deux cas prouves sur `kotlin`, trouves par la
   RELECTURE, pas par un outil.

   ⚠️ POURQUOI CE FICHIER A ETE REECRIT LE JOUR MEME DE SA CREATION. Le premier jet
   cherchait le defaut par HEURISTIQUE : un identifiant de code cite par l'explain,
   absent de la question, absent du corps, entoure d'un marqueur de refutation.
   Mis a l'epreuve sur les DEUX cas historiques de `kotlin` restaures depuis git, il
   n'en a vu AUCUN :
     - `JSON.stringify est du JavaScript, pas du Kotlin` : la phrase ne porte aucun
       des marqueurs de refutation prevus ;
     - `mutableListOf cree une liste modifiable` : l'identifiant est enseigne dans
       HUIT lecons du cours, donc le temoin « absent du corps » l'ecarte — et il
       l'ecartera toujours, puisqu'un distracteur credible est fait du vocabulaire
       du cours.
   Un outil qui ne voit pas les deux cas qui l'ont fait naitre ne vaut rien. Il est
   remplace par une mesure DIFFERENTIELLE, exacte au lieu d'heuristique : le depot
   est sous git, donc l'etat d'AVANT la vague d'ecriture est disponible, et le
   defaut se lit alors sans deviner.

   CE QU'IL MESURE. Pour chaque question dont, entre la reference git et
   aujourd'hui : (1) au moins une OPTION a change, (2) l'`explain` est reste
   IDENTIQUE — il cherche les mots que l'explication partage avec une option
   DISPARUE et qui ne se retrouvent dans AUCUNE option actuelle. Ces mots-la sont le
   fantome : l'explication parle d'un texte efface par notre propre vague.

   USAGE
     node tools/mesure-explain-orpheline.js --depuis=<ref-git> [--seul=<cours>]
     node tools/mesure-explain-orpheline.js --depuis=fba15d8~1 --seul=c
     node tools/mesure-explain-orpheline.js --depuis=HEAD --travail --seul=solidity
     node tools/mesure-explain-orpheline.js --depuis=<ref> --json

   ⚠️ Ecrire `~1`, PAS `^` : voir le piege cmd.exe documente plus bas. Le drapeau
   `--travail` autorise la comparaison HEAD <-> arbre de travail, qui est le cas
   d'une vague d'ecriture pas encore commitee ; sans lui, une reference qui resout
   sur HEAD est refusee, parce que c'est la signature du piege.

   Il rend un code de sortie 1 si au moins un orphelin est trouve, pour servir de
   controle dans la chaine apres chaque vague d'ecriture.
   ============================================================================= */

var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var RACINE = path.join(__dirname, "..");
var PAGES = path.join(RACINE, "pages");
var args = process.argv.slice(2);
function opt(nom) {
  var a = args.find(function (x) { return x.indexOf("--" + nom + "=") === 0; });
  return a ? a.slice(nom.length + 3) : "";
}
var DEPUIS = opt("depuis");
var SEUL = opt("seul");
var JSONMODE = args.indexOf("--json") !== -1;

if (!DEPUIS) {
  console.error("usage : node tools/mesure-explain-orpheline.js --depuis=<ref-git> [--seul=<cours>]");
  console.error("        la reference est l'etat d'AVANT la vague d'ecriture, par exemple fba15d8^");
  process.exit(2);
}

/* ------------------------------------------------------- lecture d'un etat */
function questionsDe(html) {
  var out = [];
  var blocs = html.match(/<script[^>]*type="application\/json"[^>]*data-(quiz|quiz-bilan)[^>]*>([\s\S]*?)<\/script>/g) || [];
  blocs.forEach(function (b) {
    if (/data-exos/.test(b)) return;
    var v = null;
    try { v = JSON.parse(b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "")); } catch (e) { return; }
    if (!Array.isArray(v)) return;
    v.forEach(function (item, i) {
      if (!item || !Array.isArray(item.a)) return;
      out.push({
        bilan: /data-quiz-bilan/.test(b),
        rang: i + 1,
        q: String(item.q == null ? "" : item.q),
        a: item.a.map(function (x) { return String(x == null ? "" : x); }),
        explain: String(item.explain == null ? "" : item.explain),
      });
    });
  });
  return out;
}

/* ⚠️ execFileSync, PAS execSync, et le piege a failli passer inapercu : sous Windows
   execSync passe par cmd.exe, ou l'accent circonflexe est le caractere d'ECHAPPEMENT.
   « --depuis=fba15d8^ » y devenait « fba15d8 », l'outil comparait le cours a
   lui-meme et annoncait tranquillement « 0 option a change » sur une vague qui en
   avait reecrit 207. Aucune erreur n'etait levee. On passe donc les arguments en
   tableau, sans shell, et on VERIFIE en plus que la reference n'est pas HEAD. */
function auGit(ref, chemin) {
  try {
    return cp.execFileSync("git", ["show", ref + ":" + chemin], { cwd: RACINE, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) { return null; }
}

function resoudre(ref) {
  try {
    return cp.execFileSync("git", ["rev-parse", ref], { cwd: RACINE, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch (e) { return null; }
}

var SHA_REF = resoudre(DEPUIS), SHA_HEAD = resoudre("HEAD");
if (!SHA_REF) {
  console.error("reference git introuvable : " + DEPUIS);
  process.exit(2);
}
if (SHA_REF === SHA_HEAD && args.indexOf("--travail") === -1) {
  console.error("la reference " + DEPUIS + " est HEAD : il n'y a rien a comparer.");
  console.error("(sous Windows, ecrire ~1 plutot que ^ : cmd.exe mange l'accent circonflexe)");
  console.error("Si tu veux VRAIMENT comparer HEAD a l'arbre de travail — le cas d'une vague");
  console.error("d'ecriture pas encore commitee — ajoute --travail, qui le dit explicitement.");
  process.exit(2);
}

/* ------------------------------------------------------------ les JETONS */
/* On compare des JETONS, pas des phrases : un identifiant de code, ou un mot long
   du francais. Les mots courts et les mots-outils sont ecartes, sans quoi tout
   l'explain « partagerait » du vocabulaire avec toutes les options. */
var OUTILS = new Set(("le la les un une des du de et ou mais donc or ni car que qui quoi dont ou a au aux en dans sur sous pour par avec sans "
  + "est sont etait sera ete fait font faire cela ceci celui celle ceux elle elles il ils on nous vous se sa son ses leur leurs ce cet cette "
  + "plus moins tres bien tout tous toute toutes meme aussi alors ainsi donc puis quand comme deux trois chaque autre autres pas ne non oui "
  + "vaut valent rend rendu donne donnent contient contiennent lorsque puisque parce").split(/\s+/));

/* ⚠️ DEUX NIVEAUX, et la difference se mesure. Sur l'epreuve `kotlin` (voir plus
   bas), les jetons de CODE rendent les 2 cas reels et 0 bruit ; les MOTS du
   francais y ajoutent 6 cas dont aucun n'est un defaut (« exclut », « logique »,
   « jamais » : deux textes qui parlent du meme sujet partagent forcement du
   vocabulaire). Les mots sont donc rendus a titre INDICATIF et ne font pas echouer
   le controle ; seul le code le fait. */
function jetonsCode(t) {
  var out = new Set();
  (String(t).match(/[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]+)+/g) || []).forEach(function (m) { out.add(m.toLowerCase()); });
  (String(t).match(/[A-Za-z_][A-Za-z0-9_]{2,}\(/g) || []).forEach(function (m) { out.add(m.replace(/\($/, "").toLowerCase()); });
  (String(t).match(/\b[A-Za-z_]+[A-Z0-9][A-Za-z0-9_]*\b/g) || []).forEach(function (m) { out.add(m.toLowerCase()); });
  (String(t).match(/\b[a-z]+_[a-z0-9_]+\b/g) || []).forEach(function (m) { out.add(m.toLowerCase()); });
  return out;
}

function jetonsMot(t) {
  var out = new Set();
  (String(t).toLowerCase().match(/[a-zà-ÿ][a-zà-ÿ0-9'-]{5,}/g) || []).forEach(function (m) {
    if (!OUTILS.has(m)) out.add(m);
  });
  return out;
}

function jetons(t) {
  var out = jetonsCode(t);
  jetonsMot(t).forEach(function (m) { out.add(m); });
  return out;
}

function normalise(s) { return String(s).toLowerCase().replace(/\s+/g, " ").trim(); }

/* --------------------------------------------------------------- la mesure */
var cours = fs.readdirSync(PAGES, { withFileTypes: true })
  .filter(function (d) { return d.isDirectory() && (!SEUL || d.name === SEUL); })
  .map(function (d) { return d.name; });

var cas = [];
var stats = { questions: 0, comparees: 0, optionsChangees: 0, explainIntouchee: 0, absentesDeLaRef: 0 };

cours.forEach(function (c) {
  fs.readdirSync(path.join(PAGES, c)).forEach(function (f) {
    if (!/^lecon-\d+\.html$/.test(f)) return;
    var relatif = "pages/" + c + "/" + f;
    var avantHtml = auGit(DEPUIS, relatif);
    if (avantHtml == null) return;
    var avant = questionsDe(avantHtml);
    var html = fs.readFileSync(path.join(PAGES, c, f), "utf8");
    var apres = questionsDe(html);
    /* le corps de LA PAGE, sans ses blocs JSON : ce que l'apprenant a sous les yeux */
    var corpsPage = normalise(html.replace(/<script[^>]*type="application\/json"[^>]*>[\s\S]*?<\/script>/g, " "));
    stats.questions += apres.length;
    apres.forEach(function (na) {
      /* appariement par ENONCE (les questions ne sont pas touchees par la vague),
         a defaut par rang dans le meme type de bloc */
      var vieux = avant.find(function (v) { return normalise(v.q) === normalise(na.q); })
        || avant.find(function (v) { return v.bilan === na.bilan && v.rang === na.rang; });
      if (!vieux) { stats.absentesDeLaRef++; return; }
      stats.comparees++;
      var memesOptions = vieux.a.length === na.a.length && vieux.a.every(function (o, i) { return normalise(o) === normalise(na.a[i]); });
      if (memesOptions) return;
      stats.optionsChangees++;
      if (normalise(vieux.explain) !== normalise(na.explain)) return;
      stats.explainIntouchee++;

      var actuelles = new Set();
      jetons(na.q).forEach(function (j) { actuelles.add(j); });
      na.a.forEach(function (o) { jetons(o).forEach(function (j) { actuelles.add(j); }); });

      var disparues = vieux.a.filter(function (o) {
        return !na.a.some(function (n) { return normalise(n) === normalise(o); });
      });
      var jetonsDisparus = new Set();
      disparues.forEach(function (o) { jetons(o).forEach(function (j) { if (!actuelles.has(j)) jetonsDisparus.add(j); }); });

      var codeExplain = jetonsCode(na.explain);
      var fantomes = Array.from(jetons(na.explain)).filter(function (j) { return jetonsDisparus.has(j); });
      if (!fantomes.length) return;
      /* les sigles courts (« UI », « API ») passent la regle de casse chameau sans
         etre des identifiants : mesure sur `kotlin`, « ui » etait le seul faux
         positif dur restant. Quatre caracteres suffisent a les ecarter.

         ⚠️ ET LA RACINE COMMUNE. Deuxieme faux positif, mesure celui-la sur `c` :
         l'explain de `lecon-17` parle de `time()`, et aucune option ne contient le
         jeton `time` — elles contiennent `localtime`, `difftime`, `strftime`. Un
         nom qui est la RACINE d'un identifiant present sous les yeux de l'apprenant
         n'est pas un fantome : il est a l'ecran, dans un mot plus long. */
      var codeActuel = [];
      jetonsCode(na.q).forEach(function (j) { codeActuel.push(j); });
      na.a.forEach(function (o) { jetonsCode(o).forEach(function (j) { codeActuel.push(j); }); });
      /* ⚠️ ET LE CORPS DE LA PAGE, troisieme filtre, mesure sur les 25 cours deja
         traites : une explication a le droit d employer le vocabulaire que SA PAGE
         enseigne (`localStorage` dans la lecon js sur les canaux entre onglets,
         `HTTP` dans la lecon nodejs sur les couches). Sur les 3 cas durs rendus par
         la mesure, 2 venaient de la. Le temoin est le corps de LA PAGE, jamais celui
         du cours : `mutableListOf`, l un des deux cas historiques, est enseigne dans
         huit lecons de `kotlin` mais absent du corps de la page du bilan -- un temoin
         a l echelle du cours effacerait le defaut qu on cherche. */
      var fantomesCode = fantomes.filter(function (j) {
        if (!codeExplain.has(j) || j.length < 4) return false;
        if (corpsPage.indexOf(j) !== -1) return false;
        return !codeActuel.some(function (k) { return k !== j && k.indexOf(j) !== -1; });
      });

      cas.push({
        cours: c, fichier: f, bilan: na.bilan, rang: na.rang,
        q: na.q, options: na.a, explain: na.explain,
        fantomes: fantomes, fantomesCode: fantomesCode, optionsDisparues: disparues,
      });
    });
  });
});

if (JSONMODE) {
  console.log(JSON.stringify({ depuis: DEPUIS, stats: stats, cas: cas }, null, 2));
} else {
  console.log("mesure-explain-orpheline — reference " + DEPUIS + (SEUL ? ", cours " + SEUL : ", tout le site"));
  console.log("");
  console.log("  questions aujourd'hui        : " + stats.questions);
  console.log("  appariees a la reference     : " + stats.comparees + (stats.absentesDeLaRef ? "  (" + stats.absentesDeLaRef + " sans equivalent, ignorees)" : ""));
  console.log("  dont une option a change     : " + stats.optionsChangees);
  console.log("  dont l'explain est INTOUCHEE : " + stats.explainIntouchee + "   <- la population a risque");
  console.log("");
  var durs = cas.filter(function (x) { return x.fantomesCode.length; });
  var mous = cas.filter(function (x) { return !x.fantomesCode.length; });

  function imprimer(x, i, quoi) {
    console.log("  " + (i + 1) + ". " + x.cours + "/" + x.fichier + (x.bilan ? " [bilan]" : "") + " q" + x.rang
      + "   fantome(s) : " + quoi.join(", "));
    console.log("     Q : " + x.q);
    x.options.forEach(function (o, j) { console.log("       " + (j + 1) + ") " + o); });
    console.log("     explain : " + x.explain);
    x.optionsDisparues.forEach(function (o) { console.log("     option EFFACEE : " + o); });
    console.log("");
  }

  if (!durs.length) {
    console.log("  AUCUNE explication orpheline : aucun explain n'emploie un IDENTIFIANT qui n'existait");
    console.log("  que dans une option effacee par la vague.");
  } else {
    console.log("  " + durs.length + " EXPLICATION(S) ORPHELINE(S) — l'explain emploie un IDENTIFIANT DE CODE qui");
    console.log("  n'existait que dans une option EFFACEE, et qu'on ne retrouve dans aucune option actuelle.");
    console.log("");
    durs.forEach(function (x, i) { imprimer(x, i, x.fantomesCode); });
  }
  if (mous.length) {
    console.log("");
    console.log("  --- " + mous.length + " cas INDICATIFS (mots du francais seulement, pas de code). Deux textes qui");
    console.log("  parlent du meme sujet partagent forcement du vocabulaire : ceux-la ne font PAS echouer le");
    console.log("  controle, ils se lisent. ---");
    console.log("");
    mous.forEach(function (x, i) { imprimer(x, i, x.fantomes); });
  }
}

process.exit(cas.some(function (x) { return x.fantomesCode.length; }) ? 1 : 0);
