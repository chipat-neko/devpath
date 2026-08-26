/* =============================================================================
   mesure-prediction.js — Pour les langages qu'on n'exécutera jamais en `file://`,
   que peut-on tout de même faire pratiquer ?

   Répond au point A5 du chantier V14. Les 4 moteurs embarqués (JS, aperçu HTML,
   SQLite, CPython) couvrent 4 langages ; il en reste une cinquantaine. Pour ceux-là
   l'exercice honnête n'est pas « lance ce code » mais « que produit ce code ? ».

   ⚠️ LE PIÈGE QUE CET OUTIL SERT À ÉVITER. Un exercice de prédiction affirme une
   sortie. Si personne ne l'a exécutée, on refabrique exactement la faute qui a fondé
   ce chantier : cinq exemples dont la sortie annoncée était fausse, sous quatre
   vérificateurs verts. D'où le critère retenu : **ne bâtir un exercice de prédiction
   que sur un bloc dont la leçon AFFIRME DÉJÀ la sortie**. L'exercice ne crée alors
   aucune affirmation neuve — il réutilise une affirmation déjà écrite et relue. C'est
   ce gisement que l'outil chiffre.

   ⚠️ OÙ CHERCHER LA SORTIE AFFIRMÉE : PAS LÀ OÙ ON CROIT. Un premier jet reprenait la
   règle de `tools/verif-clic.js` — un bloc `.txt` attenant — et rendait **3 blocs sur
   6 978**. Vérification faite, c'était la mesure qui était fausse, pas le site : les
   cours non exécutables n'annoncent presque jamais leur sortie dans un bloc séparé,
   ils l'écrivent **en commentaire à l'intérieur du code** (`// Sortie :`, `# affiche`).
   L'outil compte donc les deux formes. Et c'est un constat en soi : ces affirmations-là
   sont invisibles pour tout l'outillage du site — c'est exactement sous cette forme
   qu'était écrit l'exemple de `regex` qui annonçait `true` là où le test rendait
   `false`, et qui a fondé ce chantier.

   Aucune dépendance. Lancement : node tools/mesure-prediction.js [--csv]
   ============================================================================= */
"use strict";
const fs = require("fs");
const path = require("path");

const RACINE = path.join(__dirname, "..");
const PAGES = path.join(RACINE, "pages");

/* Les quatre moteurs embarqués : ces langages-là se pratiquent en exécutant. */
const EXECUTABLES = new Set(["javascript", "js", "markup", "html", "python", "sql"]);

/* Ce qui n'est pas un programme : un fichier de données ou de configuration ne
   « produit » rien. La question honnête y est autre — « ce fichier est-il valide ? »,
   « que vaut ce champ ? » — et json/yaml se valident, eux, en JavaScript. */
const PAS_UN_PROGRAMME = new Set(["json", "yaml", "markdown", "hcl", "docker", "http",
  "plaintext", "regex", "graphql", "css", "scss", "diff", "ignore", "toml", "ini", "csv"]);

function decodeEntites(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

function lecons() {
  const out = [];
  for (const cours of fs.readdirSync(PAGES)) {
    const dir = path.join(PAGES, cours);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (/^lecon-\d+\.html$/.test(f)) out.push({ cours: cours, fichier: path.join(dir, f) });
    }
  }
  return out;
}

/* Une sortie affirmée DANS le code. Les marqueurs de commentaire varient d'un langage
   à l'autre (// # -- % ; (* ! ') : on ne s'appuie donc pas sur eux mais sur le mot qui
   annonce la sortie, en exigeant qu'il soit suivi de ce qui est affiché.
   ⚠ DEUX PIÈGES DE MOTIF SUCCESSIFS, tous deux tranchés en relisant le contenu.
   Un premier jet acceptait « => … » n'importe où : il donnait 1 647 blocs, mais en
   Ruby `{ 'bonjour' => 'hello' }` est un HASH, et en JSX `() => {}` une fonction — du
   code, pas l'annonce d'un résultat. Le resserrer aux seuls mots annonciateurs faisait
   tomber Ruby de 191 blocs à 4, ce qui était faux dans l'autre sens : Ruby annonce
   ses sorties par `# => "Ada"`, c'est son idiome. La flèche compte donc, mais
   seulement DANS UN COMMENTAIRE — c'est ce que le second membre du motif exige. */
const SORTIE_EN_COMMENTAIRE =
  /(?:^|[^\w])(?:[Ss]ortie|SORTIE|[Aa]ffiche|[Rr]ésultat|[Oo]utput|[Aa]ffichage|[Rr]envoie|[Ii]mprime|[Dd]onne)\s*[:=]|(?:\/\/|#|--|;;|%)[^\n]{0,40}?(?:=>|→|-->)\s*\S/;

const stats = new Map();
function fiche(langue) {
  if (!stats.has(langue)) {
    stats.set(langue, { blocs: 0, avecSortie: 0, dansCode: 0, dansTxt: 0, cours: new Set() });
  }
  return stats.get(langue);
}

let totalLecons = 0;
const verifiables = new Map(); // langage a moteur -> blocs dont la sortie est affirmee en commentaire
const leconsPretes = new Map(); // cours -> nb de blocs à sortie affirmée

for (const item of lecons()) {
  totalLecons++;
  const src = fs.readFileSync(item.fichier, "utf8");

  /* On travaille sur la SUITE des figures de la page : un bloc de sortie ne peut être
     apparié qu'à un programme qui le précède de peu. */
  const figures = [];
  const reFig = /<figure class="code-block"([^>]*)>([\s\S]*?)<\/figure>/g;
  let f;
  while ((f = reFig.exec(src))) {
    const attrs = f[1];
    const nomFichier = (attrs.match(/data-file="([^"]*)"/) || [, ""])[1];
    const mCode = f[2].match(/<code class="language-([\w-]+)">([\s\S]*?)<\/code>/);
    figures.push({
      nom: nomFichier,
      langue: mCode ? mCode[1] : null,
      code: mCode ? decodeEntites(mCode[2]) : "",
    });
  }

  for (let i = 0; i < figures.length; i++) {
    const fig = figures[i];
    if (!fig.langue) continue;
    if (EXECUTABLES.has(fig.langue)) {
      /* Ces langages-là ont un moteur : leurs sorties affirmées en commentaire sont
         VÉRIFIABLES par exécution. On les compte à part — c'est le travail actionnable
         tout de suite, quand la prédiction, elle, restera une affirmation sur parole. */
      if (SORTIE_EN_COMMENTAIRE.test(fig.code)) {
        verifiables.set(fig.langue, (verifiables.get(fig.langue) || 0) + 1);
      }
      continue;
    }
    if (PAS_UN_PROGRAMME.has(fig.langue)) continue;
    const F = fiche(fig.langue);
    F.blocs++;
    F.cours.add(item.cours);

    /* Un bloc de sortie attenant : dans les 3 figures suivantes, nom en .txt, et
       désigné comme une sortie (préfixe « sortie » ou radical partagé). */
    const radical = fig.nom.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
    let txt = false;
    for (let j = i + 1; j <= i + 3 && j < figures.length; j++) {
      const s = figures[j];
      if (!/\.txt$/i.test(s.nom)) continue;
      const rs = s.nom.replace(/\.txt$/i, "").toLowerCase();
      if (/^sortie/.test(rs) || (radical && rs.indexOf(radical) === 0)) { txt = true; break; }
    }
    const dansCode = SORTIE_EN_COMMENTAIRE.test(fig.code);
    if (txt) F.dansTxt++;
    if (dansCode) F.dansCode++;
    if (txt || dansCode) {
      F.avecSortie++;
      leconsPretes.set(item.cours, (leconsPretes.get(item.cours) || 0) + 1);
    }
  }
}

const liste = [...stats.entries()].sort((a, b) => b[1].avecSortie - a[1].avecSortie);
const totalBlocs = liste.reduce((s, e) => s + e[1].blocs, 0);
const totalSortie = liste.reduce((s, e) => s + e[1].avecSortie, 0);

if (process.argv.indexOf("--csv") !== -1) {
  console.log("langage;blocs;avec_sortie_affirmee;cours");
  for (const e of liste) console.log([e[0], e[1].blocs, e[1].avecSortie, e[1].cours.size].join(";"));
  process.exit(0);
}

console.log("=".repeat(74));
console.log("  LANGAGES NON EXÉCUTABLES — " + totalLecons + " leçons lues");
console.log("=".repeat(74));
console.log("On ne compte ici NI les 4 langages à moteur embarqué (JavaScript, HTML,");
console.log("SQL, Python), NI les formats de données (json, yaml, css…), qui ne");
console.log("« produisent » rien et relèvent d'un autre exercice.");
console.log("");
console.log("langage".padEnd(14) + "blocs".padStart(7) + "cours".padStart(6) +
            "sortie affirmée".padStart(17) + "  part" + "   (dans le code / bloc .txt)");
console.log("-".repeat(74));
for (const e of liste) {
  if (e[1].blocs < 20) continue;
  const part = e[1].blocs ? (e[1].avecSortie * 100 / e[1].blocs).toFixed(0) + " %" : "-";
  console.log(e[0].padEnd(14) + String(e[1].blocs).padStart(7) + String(e[1].cours.size).padStart(6) +
              String(e[1].avecSortie).padStart(17) + "  " + part.padStart(5) +
              "   " + e[1].dansCode + " / " + e[1].dansTxt);
}
console.log("-".repeat(74));
console.log("TOTAL".padEnd(15) + String(totalBlocs).padStart(7) + " ".repeat(7) +
            String(totalSortie).padStart(17) + "   " +
            (totalSortie * 100 / totalBlocs).toFixed(1) + " %");
console.log("");
console.log("Lecture : " + totalSortie + " blocs de langage non exécutable affirment déjà leur");
console.log("sortie — " + liste.reduce((a,e)=>a+e[1].dansCode,0) + " EN COMMENTAIRE DANS LE CODE, " + liste.reduce((a,e)=>a+e[1].dansTxt,0) + " dans un bloc attenant.");
console.log("Ce sont les seuls sur lesquels un exercice de prédiction n'invente aucune");
console.log("affirmation neuve. ⚠ Aucun outil du site ne regarde ces commentaires :");
console.log("verif-clic ne compare que des blocs .txt, et seulement en JavaScript.");
console.log("");
console.log("-- et pour les langages QUI ONT un moteur : sorties verifiables --");
{
  const v = [...verifiables.entries()].sort((a, b) => b[1] - a[1]);
  for (const e of v) console.log("  " + e[0].padEnd(14) + String(e[1]).padStart(5) + " blocs affirment leur sortie en commentaire");
  console.log("  " + "TOTAL".padEnd(14) + String(v.reduce((a, e) => a + e[1], 0)).padStart(5) + " — verifiables par EXECUTION, des maintenant");
}
console.log("");
console.log("-- cours les mieux dotés (gisement pour la phase B7) --");
const parCours = [...leconsPretes.entries()].sort((a, b) => b[1] - a[1]);
for (const e of parCours.slice(0, 18)) console.log("  " + e[0].padEnd(18) + String(e[1]).padStart(5));
