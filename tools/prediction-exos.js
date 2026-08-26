'use strict';
/**
 * tools/prediction-exos.js — Les exercices « que produit ce code ? » (chantier V14, B7).
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * 37 langages du site (6 978 blocs) ne seront jamais exécutables en `file://` : ni
 * moteur embarqué, ni interpréteur. On ne peut donc pas y corriger un exercice en
 * exécutant ce que l'apprenant écrit. Le format retenu en A5 est la PRÉDICTION —
 * « que vaut cette ligne ? » — avec une règle qui le rend honnête :
 *
 *   > On ne bâtit un exercice de prédiction que sur une sortie DÉJÀ AFFIRMÉE par la
 *   > leçon. Jamais on n'invente la sortie d'un code qu'on ne peut pas exécuter.
 *
 * Sans elle, écrire mille exercices de prédiction reviendrait à écrire mille
 * affirmations que rien ne vérifie — précisément ce qui a laissé passer cinq exemples
 * faux sous quatre vérificateurs verts.
 *
 * D'OÙ LE PRINCIPE : CE SCRIPT N'ÉCRIT AUCUNE VALEUR. Le code cité est EXTRAIT du bloc
 * de la leçon, et la réponse attendue est EXTRAITE du commentaire d'annonce de la ligne
 * visée (`# =>` en Ruby, `// =>` en Kotlin). Les tables ci-dessous ne font que DÉSIGNER
 * une ligne et rédiger l'énoncé, les indices et le lien. Trois contrôles bloquent avant
 * écriture : la ligne visée doit porter une annonce de sortie, la réponse attendue doit
 * passer le champ (normExo reproduit depuis `js/lecon.js`), et la réponse ne doit pas
 * rester LISIBLE dans le code cité — ce dernier a écarté 2 des 16 exercices envisagés
 * en B7a, et il a de nouveau écarté des cibles en B7b.
 *
 *   node tools/prediction-exos.js                  contrôle tous les lots (n'écrit rien)
 *   node tools/prediction-exos.js --lot=kotlin     un seul lot
 *   node tools/prediction-exos.js --lot=kotlin --write   écrit
 *
 * IDEMPOTENT : une leçon qui porte déjà un exercice « Prédiction » est sautée.
 */
var fs = require('fs'), path = require('path');
var RACINE = path.resolve(__dirname, '..');
var ECRIRE = process.argv.indexOf('--write') !== -1;
var LOT_DEMANDE = (process.argv.filter(function (a) { return a.indexOf('--lot=') === 0; })[0] || '').slice(6);
var VOIR = process.argv.indexOf('--voir') !== -1;   // affiche le code cité, pour la relecture

/* ---------------------------------------------------------------------------
   LES LOTS. Un lot = un cours, une langue Prism, un marqueur de commentaire.
   Chaque cible : lecon, bloc (motif identifiant le bloc), cible (motif de la ligne
   à masquer), occ (n-ième ligne correspondante, défaut 1), apres (l'annonce est sur
   la LIGNE SUIVANTE, forme fréquente en Kotlin), quoi (inséré dans le placeholder),
   hints, label du lien.
   --------------------------------------------------------------------------- */
var LOTS = {

  /* ===================== B7a — ruby (14 exercices, 2026-08-26) ===================== */
  ruby: {
    dossier: 'ruby', langue: 'ruby', marqueur: '#', fichierCite: 'prediction.rb',
    cibles: [
  { lecon: '02', bloc: '"3a".to_i', cible: 'puts "3a".to_i', quoi: 'ce qu’affiche puts "3a".to_i',
    hints: ['to_i ne lève pas d’erreur : il lit ce qu’il peut.',
            'Il s’arrête au premier caractère non numérique.',
            'Un seul chiffre est lisible ici.'],
    label: 'Revoir « Les conversions »' },
  { lecon: '03', bloc: 'puts "b" if 0', cible: 'puts "b" if 0', quoi: 'ce qu’affiche puts "b" if 0',
    hints: ['En Ruby, seuls false et nil sont falsy.',
            'Zéro est un objet comme un autre.',
            'La condition est donc vraie : la ligne s’exécute.'],
    label: 'Revoir « Ce qui est vrai, ce qui est faux »' },
  { lecon: '04', bloc: 'langages[99]', cible: 'langages[99]', quoi: 'la valeur de langages[99]',
    hints: ['Le tableau n’a que cinq éléments.',
            'Ruby ne lève pas d’erreur pour un indice hors limites.',
            'Trois lettres, l’absence de valeur.'],
    label: 'Revoir « Accéder aux éléments »' },
  { lecon: '05', bloc: 'contact.delete(:metier)', cible: 'contact.delete(:metier)',
    quoi: 'la valeur que renvoie contact.delete(:metier)',
    hints: ['delete ne renvoie pas le hash, ni true.',
            'Il rend ce qu’il vient d’enlever.',
            'La clé :metier avait été modifiée juste avant.'],
    label: 'Revoir « Modifier un hash »' },
  { lecon: '06', bloc: 'addition_proc.call(1)', cible: 'addition_proc.call(1)',
    quoi: 'la valeur de addition_proc.call(1)',
    hints: ['Un Proc ne vérifie pas le nombre d’arguments.',
            'b vaut donc nil, et nil.to_i vaut 0.',
            'C’est là que le lambda, lui, lèverait une erreur.'],
    label: 'Revoir « Proc et lambda »' },
  { lecon: '07', bloc: 'take_while', cible: 'notes.take_while { |n| n >= 10 }',
    quoi: 'la valeur de notes.take_while { |n| n >= 10 }',
    hints: ['take_while n’est pas select : il ne filtre pas tout le tableau.',
            'Il prend tant que la condition tient, et s’arrête au premier échec.',
            'Le 16 vient après le 9 : il ne sera jamais atteint.'],
    label: 'Revoir « take, drop et leurs variantes »' },
  { lecon: '08', bloc: 'def prix_ttc', cible: 'prix_ttc(100)', quoi: 'la valeur de prix_ttc(100)',
    hints: ['La dernière expression évaluée est la valeur de retour.',
            'La TVA est un flottant : la multiplication l’est aussi.',
            'La réponse n’est donc pas un entier.'],
    label: 'Revoir « Le retour implicite »' },
  { lecon: '09', bloc: 'def ==(autre)', cible: 'a == b', quoi: 'la valeur de a == b',
    hints: ['Les deux comptes n’ont ni le même titulaire ni le même solde.',
            'Mais la classe redéfinit == : c’est elle qui décide.',
            'Elle ne compare qu’une seule chose, et les deux la partagent.'],
    label: 'Revoir « Redéfinir == »' },
  { lecon: '10', bloc: 'clamp(v32, v34)', cible: 'Version.new(3, 9).clamp(v32, v34).to_s',
    quoi: 'la valeur de Version.new(3, 9).clamp(v32, v34).to_s',
    hints: ['clamp ramène une valeur dans un intervalle.',
            '3.9 dépasse la borne haute.',
            'On obtient donc la borne, pas la valeur.'],
    label: 'Revoir « Comparable »' },
  { lecon: '11', bloc: 'inverse_mots', cible: '"le chat dort".inverse_mots',
    quoi: 'la valeur de "le chat dort".inverse_mots',
    hints: ['split sans argument découpe sur les espaces.',
            'reverse s’applique au tableau de mots, pas aux lettres.',
            'join recolle avec une espace.'],
    label: 'Revoir « Rouvrir une classe »' },
  { lecon: '12', bloc: 'e.backtrace.first', cible: 'puts e.class', quoi: 'ce qu’affiche puts e.class',
    hints: ['Integer("abc") ne renvoie pas nil : il lève.',
            'Ce n’est ni TypeError ni StandardError.',
            'L’argument est du bon type, mais sa valeur est invalide.'],
    label: 'Revoir « Inspecter l’exception »' },
  { lecon: '18', bloc: '"1 lapin, 2 lapins"', cible: '"1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    quoi: 'la valeur de "1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    hints: ['gsub remplace TOUTES les occurrences.',
            'Le motif /lapins?/ capte aussi bien le singulier que le pluriel.',
            'Le remplaçant, lui, ne s’accorde pas.'],
    label: 'Revoir « Remplacer avec gsub »' },
  { lecon: '19', bloc: '.to_json', cible: '{ ville: "Lyon", hab: 522_000 }.to_json',
    quoi: 'la valeur de { ville: "Lyon", hab: 522_000 }.to_json',
    hints: ['Les clés symboles deviennent des chaînes entre guillemets.',
            'Le tiret bas de 522_000 n’est qu’une aide à la lecture.',
            'JSON n’ajoute aucune espace.'],
    label: 'Revoir « Écrire du JSON »' },
  { lecon: '20', bloc: 'premier, *reste', cible: 'reste', quoi: 'la valeur de reste',
    hints: ['L’astérisque ramasse tout ce qui reste.',
            'Le résultat est un tableau, même s’il n’y avait qu’un élément.',
            'Le premier élément, lui, est parti dans premier.'],
    label: 'Revoir « La déstructuration »' },
  /* ÉCARTÉ — `lecon-21` : la seule sortie affirmée est `compteur # => 1000`, et 1000
     est écrit noir sur blanc dans le code du bloc (10 fils × 100 tours). Le contrôle
     « la réponse ne doit pas rester lisible » l'a signalé ; on ne force pas. */
    ]
  },


  /* ===================== B7b — kotlin (2026-08-26) =====================
     Le cours `kotlin` est le 2ᵉ gisement du site : 151 blocs sur 212 annoncent déjà
     leur sortie, et l'idiome y est `// =>` (368 lignes). Aucun compilateur Kotlin
     n'est disponible ici : la prédiction sur sortie déjà affirmée est la seule voie
     honnête, exactement comme pour Ruby.

     ⚠️ CE LOT A ÉTÉ REFAIT APRÈS CONTRADICTION. Un premier jet posait l'exercice
     DANS la leçon dont il citait le bloc : trois agents chargés de le démolir ont
     montré que la réponse s'y lisait alors en clair, quelques écrans plus haut, dans
     le commentaire `// =>` du bloc d'origine — un Ctrl+F suffisait, et le lien
     « Revoir… » menait droit à la réponse. La règle « ne bâtir que sur une sortie
     déjà affirmée » rend ce conflit INÉVITABLE en intra-page. D'où le champ `page` :
     le bloc vient de la leçon `source`, l'exercice est posé dans la SUIVANTE. La
     sortie reste une affirmation déjà relue, mais elle n'est plus imprimée sur la
     page où l'on interroge — et le lien « Revoir » redevient utile au lieu d'être
     un raccourci vers la solution.

     ⚠️ `lecon-21` (capstone) porte 4 blocs `.exercise` pour 3 entrées `data-exos` :
     écart préexistant et délibéré. Comme `ruby/lecon-22` en B7a, on n'y touche pas —
     l'appariement se fait PAR INDEX, une entrée de plus s'y collerait au mauvais bloc. */
  kotlin: {
    dossier: 'kotlin', langue: 'kotlin', marqueur: '//', fichierCite: 'extrait.kt',
    cibles: [
  { source: '02', page: '03', bloc: 'note.toInt()', cible: 'println(note.toInt())',
    quoi: 'ce qu’affiche println(note.toInt())',
    hints: ['toInt() ne fait pas d’arrondi.',
            'Il coupe la partie décimale, quelle qu’elle soit.',
            'La réponse n’est donc pas 17.'],
    pourquoi: 'toInt() tronque au lieu d’arrondir : la partie décimale est supprimée telle quelle.',
    label: 'Revoir « Conversions : toujours explicites »',
    /* La valeur attendue se lit dans « 16.7 », et c’est EXACTEMENT le piège : tout
       l’exercice consiste à choisir entre 16 et 17. Fuite tolérée, en connaissance. */
    fuiteToleree: 'la réponse 16 se lit dans 16.7 — c’est le piège même de l’exercice' },

  { source: '03', page: '04', bloc: 'for (i in 1..3) print', cible: 'for (i in 1..3) print("$i ")',
    quoi: 'ce qu’affiche for (i in 1..3) print("$i ")',
    hints: ['Le range 1..3 est inclusif aux deux bouts.',
            'print n’ajoute pas de saut de ligne : la sortie suivante se collera à la suite.',
            'Chaque valeur est suivie d’une espace.'],
    pourquoi: 'Le range 1..3 est inclusif : trois tours de boucle, et print n’ajoute aucun saut de ligne.',
    label: 'Revoir « La boucle for »' },

  { source: '04', page: '05', bloc: 'KM_PAR_MILE',
    cible: 'println(decrire(celsiusVersFahrenheit(20.0), "°F"))', apres: true,
    quoi: 'ce qu’affiche le second println, celui en °F',
    hints: ['La conversion est c × 9 / 5 + 32.',
            'decrire arrondit, et son paramètre decimales a une valeur par défaut.',
            'Ici cette valeur par défaut n’est pas celle passée à l’appel du dessus.'],
    pourquoi: 'La conversion donne 68, et decrire arrondit à une décimale par défaut : la sortie porte donc un « .0 », suivi de l’unité.',
    label: 'Revoir « Valeurs par défaut et arguments nommés »' },

  { source: '05', page: '06', bloc: 'filterNotNull', cible: 'println(reponses.filterNotNull())',
    quoi: 'ce qu’affiche le println de filterNotNull()',
    hints: ['La liste déclarée est List<String?> : elle a le droit de contenir des null.',
            'filterNotNull ne remplace pas les null, il les enlève.',
            'Il reste donc moins d’éléments que ne l’annonce size.'],
    pourquoi: 'filterNotNull retire le null du milieu : il ne reste que les deux valeurs non nulles.',
    label: 'Revoir « Null et collections »' },

  { source: '06', page: '07', bloc: 'nombres.drop(7)', cible: 'println(nombres.drop(7))',
    quoi: 'ce qu’affiche println(nombres.drop(7))',
    hints: ['La liste contient les entiers de 1 à 10.',
            'drop n’enlève pas les valeurs supérieures à 7 : il enlève les 7 premières.',
            'Il en reste donc trois.'],
    pourquoi: 'drop(7) écarte les sept PREMIERS éléments de la liste 1..10, pas ceux qui dépassent 7.',
    label: 'Revoir « La boîte à outils des collections »' },

  { source: '07', page: '08', bloc: '.chunked(3)', cible: 'val pages = (1..7).toList().chunked(3)', apres: true,
    quoi: 'la valeur de (1..7).toList().chunked(3)',
    hints: ['chunked découpe en morceaux de taille fixe.',
            'Sept n’est pas un multiple de trois : le dernier morceau est incomplet.',
            'Le résultat est une liste de listes.'],
    pourquoi: 'Sept n’est pas un multiple de trois : les deux premiers morceaux sont pleins, le dernier n’a qu’un élément.',
    label: 'Revoir « Apparier et fenêtrer »' },

  { source: '08', page: '09', bloc: 'get() = age >= 18', cible: 'println(p.majeur)', occ: 2,
    quoi: 'ce qu’affiche le second println(p.majeur)',
    hints: ['majeur n’est pas stocké : il est recalculé à chaque accès.',
            'La ligne entre les deux affichages a changé age.',
            'La comparaison est donc refaite avec la nouvelle valeur.'],
    pourquoi: 'majeur n’a pas de champ : son get() refait la comparaison à chaque lecture, et age vaut désormais 18.',
    label: 'Revoir « Propriétés calculées et getter custom »' },

  { source: '09', page: '10', bloc: 'data class Point', cible: 'println(a === b)',
    quoi: 'ce qu’affiche println(a === b)',
    hints: ['Une data class fournit un equals qui compare les valeurs.',
            'Mais === ne passe pas par equals.',
            'Il demande si les deux noms désignent le MÊME objet en mémoire.'],
    pourquoi: '=== ne compare pas les valeurs mais les références, et les deux Point sont deux objets distincts.',
    label: 'Revoir « La data class »' },

  { source: '10', page: '11', bloc: 'override fun toString(): String = "($x, $y)"',
    cible: 'println(Point(1, 2) == Point(1, 2))',
    quoi: 'ce qu’affiche println(Point(1, 2) == Point(1, 2))',
    hints: ['Cette classe n’est PAS une data class : relis son en-tête.',
            'Elle redéfinit toString, et rien d’autre.',
            'equals reste donc celui d’Any, qui compare les références.'],
    pourquoi: 'Sans data class ni equals redéfini, == retombe sur l’equals d’Any, qui compare les références.',
    label: 'Revoir « Any et ses trois méthodes »' },

  { source: '11', page: '12', bloc: 'Delegates.observable', cible: 'c.valeur = 8',
    quoi: 'ce qu’affiche la ligne c.valeur = 8',
    hints: ['observable appelle son bloc à chaque affectation, après coup.',
            'Le bloc affiche l’ancienne valeur puis la nouvelle.',
            'L’ancienne n’est plus celle du départ : une affectation a déjà eu lieu.'],
    pourquoi: 'L’affectation elle-même ne vaut rien : c’est le bloc du délégué qui imprime l’ancienne valeur puis la nouvelle, et l’ancienne est déjà 5.',
    label: 'Revoir « les propriétés déléguées »' },

  { source: '12', page: '13', bloc: 'val taille = with', cible: 'println(taille)',
    quoi: 'ce qu’affiche println(taille)',
    hints: ['with rend la valeur de sa dernière expression, ici length.',
            'La chaîne a été construite juste au-dessus, par run.',
            'Compte les caractères un par un, sans oublier la virgule ni l’espace.'],
    pourquoi: 'run rend la valeur de sa dernière expression, la chaîne assemblée ; with rend celle de length, soit le nombre de caractères de cette chaîne.',
    label: 'Revoir « run et with »' },

  /* ÉCARTÉ — `lecon-01` : la seule cible utilisable était `println("$langage, essai
     n°$compteur")`, mais le bloc se termine par `langage = "Java"` sur un `val`. En
     Kotlin c'est une erreur de COMPILATION : le fichier ne produit aucun exécutable,
     donc il n'affiche RIEN, et la sortie annoncée par la leçon — juste dans son
     contexte d'illustration — devient inatteignable une fois le bloc cité tel quel.
     Un contradicteur l'a trouvé ; le contrôle 8 le refuse désormais tout seul.

     ÉCARTÉ — `lecon-05`, cible `println(taches)` (2ᵉ occurrence, `[DORMIR, manger]`) :
     le juge du site normalise en MINUSCULES (`normExo`, js/lecon.js). Or les deux
     `println(taches)` du bloc ne diffèrent QUE par la casse : `[dormir, manger]`, la
     sortie de la ligne PRÉCÉDENTE, était acceptée — vérifié en exécutant normExo.
     L'exercice ne mesurait donc pas ce qu'il prétendait mesurer. Le contrôle 7 refuse
     désormais toute cible dont l'attendu, normalisé, égale une autre annonce du bloc.

     ÉCARTÉ — `lecon-04`, cible `println(estPair(7))` : réponse binaire (true/false),
     donc une chance sur deux au hasard, et le 3ᵉ indice la calculait. Remplacée par
     la sortie du convertisseur, qui porte plus d'un bit d'information. */
    ]
  }
};

/* ------------------------------- outillage ------------------------------- */
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'); }
function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}
function enc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* La valeur annoncée, débarrassée de la glose que la leçon met entre parenthèses :
   « nil       (hors limites : pas d'erreur !) » → « nil ».
   ⚠️ On ne coupe QUE la parenthèse finale. Un premier jet coupait aussi ce qui suit
   un tiret cadratin : il aurait mutilé `ADA — RECHERCHE` (kotlin/lecon-04), une vraie
   valeur. Une règle de nettoyage trop large abîme les données qu'elle prétend lire. */
function valeurNette(s) {
  return String(s).trim().replace(/\s+\([^)]*\)\s*$/, '').trim();
}
/* normExo de js/lecon.js — le juge du site, reproduit pour vérifier ici même que la
   réponse attendue est bien acceptée par le champ. ⚠️ Il finit par toLowerCase() :
   deux sorties qui ne diffèrent que par la casse sont LE MÊME verdict pour la page. */
function normExo(s) {
  s = s == null ? '' : String(s);
  s = s.replace(/ /g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.trim().replace(/\s+/g, ' ').replace(/;+\s*$/, '').toLowerCase();
}
/* Graphies acceptées : la valeur telle que la leçon l'écrit, sans ses guillemets
   englobants, et — POUR LES SEULES VALEURS STRUCTURÉES — sans les espaces après les
   virgules (normExo n'égalise QUE les suites d'espaces : « [18,15] » n'est pas
   « [18, 15] »). ⚠️ Un premier jet appliquait cette variante à TOUTE valeur : sur une
   phrase, « Kotlin,essai n°1 » devenait acceptable alors que Kotlin ne l'affiche
   jamais. Une tolérance de saisie n'a de sens que là où la ponctuation sépare des
   éléments, pas là où elle appartient au texte. */
function graphies(v) {
  var out = [], vus = {};
  function add(x) { x = String(x).trim(); if (x && !vus[normExo(x)]) { vus[normExo(x)] = 1; out.push(x); } }
  add(v);
  var sansG = v.replace(/^"([\s\S]*)"$/, '$1').replace(/^'([\s\S]*)'$/, '$1');
  add(sansG);
  if (/^[\[{]/.test(v.trim())) {                 // liste, tableau, map : la virgule sépare
    add(v.replace(/,\s+/g, ','));
    add(sansG.replace(/,\s+/g, ','));
  }
  add(v.replace(/\s*->\s*/g, '->'));
  return out;
}

/* --------------------------------- passe --------------------------------- */
var rapport = [], fautes = [], notes = [], ecrits = 0;

Object.keys(LOTS).forEach(function (nomLot) {
  if (LOT_DEMANDE && LOT_DEMANDE !== nomLot) return;
  var lot = LOTS[nomLot];
  var DIR = path.join(RACINE, 'pages', lot.dossier);
  var M = esc(lot.marqueur);
  var RE_BLOC = new RegExp('<figure\\b([^>]*)>\\s*<pre><code class="language-' + lot.langue + '">([\\s\\S]*?)<\\/code><\\/pre>', 'gi');
  var RE_ANN_FIN = new RegExp('\\s*' + M + '\\s*=>[\\s\\S]*$');       // annonce en fin de ligne de code
  var RE_ANN_SEULE = new RegExp('^\\s*' + M + '\\s*=>');              // ligne d'annonce seule
  var RE_ANN = new RegExp(M + '\\s*=>');
  var RE_VAL = new RegExp('^[\\s\\S]*?' + M + '\\s*=>\\s*');
  var COMMENTE = new RegExp('^\\s*' + M);

  lot.cibles.forEach(function (t) {
    /* `source` = la leçon dont vient le bloc ; `page` = la leçon où l'exercice est
       posé. Les lots d'avant ce correctif n'ont qu'un champ `lecon` : les deux y
       coïncident. */
    var source = t.source || t.lecon, page = t.page || t.lecon;
    var id = nomLot + '/lecon-' + source + ' → lecon-' + page;
    var fSrc = path.join(DIR, 'lecon-' + source + '.html');
    var fPage = path.join(DIR, 'lecon-' + page + '.html');
    var srcBloc = fs.readFileSync(fSrc, 'utf8');
    var src = source === page ? srcBloc : fs.readFileSync(fPage, 'utf8');
    /* Idempotence : relancer le script ne doit pas empiler un second exercice. */
    if (src.indexOf('exercise__level">Prédiction') >= 0) {
      rapport.push({ lot: nomLot, id: id, attendu: '(déjà posé)', accept: [], lignes: 0, num: 0 });
      return;
    }

    /* 1. le bloc, extrait de la leçon SOURCE — jamais retapé */
    var m, code = null;
    RE_BLOC.lastIndex = 0;
    while ((m = RE_BLOC.exec(srcBloc))) {
      var c = dec(m[2]);
      if (c.indexOf(t.bloc) >= 0) { code = c; break; }
    }
    if (code === null) { fautes.push(id + ' : bloc introuvable (' + t.bloc + ')'); return; }

    /* 2. la ligne visée et SA sortie annoncée.
       Deux formes : l'annonce termine la ligne de code (Ruby, et Kotlin le plus
       souvent), ou elle occupe la ligne SUIVANTE (fréquent en Kotlin) — champ `apres`. */
    var lignes = code.split('\n');
    var occ = t.occ || 1, vu = 0, iAnn = -1, iCode = -1;
    for (var i = 0; i < lignes.length; i++) {
      if (lignes[i].indexOf(t.cible) < 0) continue;
      if (t.apres) {
        if (i + 1 < lignes.length && RE_ANN_SEULE.test(lignes[i + 1])) { if (++vu === occ) { iCode = i; iAnn = i + 1; break; } }
      } else if (RE_ANN.test(lignes[i])) {
        if (++vu === occ) { iCode = i; iAnn = i; break; }
      }
    }
    if (iAnn < 0) { fautes.push(id + ' : ligne visée sans annonce de sortie (' + t.cible + ', occurrence ' + occ + ')'); return; }
    var attendu = valeurNette(lignes[iAnn].replace(RE_VAL, ''));
    if (!attendu) { fautes.push(id + ' : sortie annoncée vide'); return; }

    /* 3. le code cité : toutes les annonces de sortie retirées, un « ? » sur la ligne visée */
    var cite = [];
    for (var j = 0; j < lignes.length; j++) {
      var l = lignes[j];
      if (RE_ANN_SEULE.test(l)) {
        if (j === iAnn) cite.push(l.match(/^\s*/)[0] + lot.marqueur + ' => ?');
        continue;                                          // sinon : la ligne disparaît
      }
      var nu = l.replace(RE_ANN_FIN, '');
      if (j === iAnn) cite.push(nu + '   ' + lot.marqueur + ' => ?');
      else cite.push(nu);
    }
    while (cite.length && !cite[cite.length - 1].trim()) cite.pop();
    var codeCite = cite.join('\n');

    /* 4. contrôle : la réponse attendue passe-t-elle le champ ? (moteur du site) */
    var accept = graphies(attendu);
    if (!accept.some(function (a) { return normExo(a) === normExo(attendu); })) {
      fautes.push(id + ' : la réponse attendue n\'est pas dans accept');
      return;
    }

    /* 5. contrôle : la réponse ne doit pas rester lisible dans le code cité.
       ⚠️ Le premier jet se désactivait pour toute réponse de 1 ou 2 caractères
       (`attendu.length > 2`) : `14` n'était donc contrôlé par rien, et un saut se
       lisait comme une réussite. Le seuil a disparu ; une fuite ASSUMÉE se déclare
       cible par cible (`fuiteToleree`) et s'affiche dans le rapport. */
    var reFuite = new RegExp('(^|[^\\w])' + esc(attendu) + '($|[^\\w])', 'i');
    if (reFuite.test(codeCite)) {
      if (t.fuiteToleree) notes.push(id + ' : fuite TOLÉRÉE — ' + t.fuiteToleree);
      else { fautes.push(id + ' : la réponse « ' + attendu + ' » est encore visible dans le code cité'); return; }
    }

    /* 6. contrôle : la ligne visée ne doit pas figurer dans la PAGE OÙ L'ON INTERROGE.
       C'est ce contrôle qui manquait, et trois contradicteurs l'ont montré : poser
       l'exercice dans la leçon dont il cite le bloc laisse la réponse imprimée en
       clair quelques écrans plus haut, dans le `// =>` du bloc d'origine. */
    var ligneNue = lignes[iCode].replace(RE_ANN_FIN, '').trim();
    if (ligneNue && dec(src).indexOf(ligneNue) >= 0) {
      fautes.push(id + ' : la ligne visée « ' + ligneNue + ' » figure déjà dans la page où l\'exercice est posé');
      return;
    }

    /* 7. contrôle : l'attendu doit se DISTINGUER des autres sorties du même bloc,
       AU SENS DU JUGE. `normExo` finit par toLowerCase() : deux annonces qui ne
       diffèrent que par la casse — `[dormir, manger]` et `[DORMIR, manger]` — sont
       le même verdict, et l'exercice accepte alors la sortie de la ligne d'avant. */
    var collision = null;
    for (var k = 0; k < lignes.length; k++) {
      if (k === iAnn || !RE_ANN.test(lignes[k])) continue;
      var autre = valeurNette(lignes[k].replace(RE_VAL, ''));
      if (autre && normExo(autre) === normExo(attendu)) { collision = lignes[k].trim(); break; }
    }
    if (collision) {
      fautes.push(id + ' : une AUTRE sortie du bloc est indiscernable de la réponse au sens de normExo (« ' + collision + ' »)');
      return;
    }

    /* 8. contrôle : le bloc ne doit pas annoncer une erreur de COMPILATION portant sur
       une ligne active. Un bloc qui ne compile pas n'affiche rien : sa sortie annoncée
       n'est vraie que dans le contexte d'illustration de la leçon, pas dans un exercice
       qui demande ce que le code produit. (Une ligne déjà commentée, elle, ne gêne pas :
       c'est l'idiome du site pour montrer ce que le compilateur refuse.) */
    var RE_INCOMP = /[Ee]rreur de compilation|(^|[^\w])error\s*:/;
    var incompilable = null;
    for (var q = 0; q < lignes.length; q++) {
      var pos = lignes[q].search(RE_INCOMP);
      if (pos < 0) continue;
      /* QUELLE LIGNE l'annonce vise-t-elle ? Ce qui la précède SUR LA MÊME LIGNE, une
         fois ôtés le marqueur de commentaire et la flèche : s'il reste du code, c'est
         lui qui est visé — et il est déjà commenté, donc le fichier compile. S'il ne
         reste rien, l'annonce vise la ligne précédente non vide.
         ⚠️ Premier jet FAUX, pris en défaut par sa propre contre-épreuve : il prenait
         la ligne d'annonce elle-même pour la porteuse dès qu'elle commençait par `//`,
         donc il ne refusait jamais rien. Un contrôle qui ne peut pas échouer ne
         contrôle rien. */
      var noyau = lignes[q].slice(0, pos).replace(/^\s*/, '').replace(new RegExp('^' + M + '\s*'), '')
        .replace(/^=>\s*/, '').replace(new RegExp(M + '\s*$'), '').trim();
      if (noyau) continue;                       // une ligne commentée porte l'annonce
      var r = q - 1;
      while (r >= 0 && !lignes[r].trim()) r--;
      var porteuse = r >= 0 ? lignes[r] : '';
      if (porteuse.trim() && !COMMENTE.test(porteuse)) { incompilable = porteuse.trim(); break; }
    }
    if (incompilable) {
      fautes.push(id + ' : le bloc ne compile pas (« ' + incompilable + ' ») — il n\'affiche donc rien');
      return;
    }

    /* 9. contrôle : la page hôte doit être ALIGNÉE avant insertion. `initExos` apparie
       `data-exos` aux blocs `.exercise` PAR INDEX ; ajouter une entrée à une page déjà
       décalée la collerait en face du mauvais bloc. */
    var nbEx = (src.match(/<div class="exercise">/g) || []).length;
    var mj0 = src.match(/(<script type="application\/json" data-exos>\s*)([\s\S]*?)(\s*<\/script>)/);
    if (!mj0) { fautes.push(id + ' : tableau data-exos introuvable dans la page hôte'); return; }
    var nbEntrees;
    try { nbEntrees = JSON.parse(mj0[2]).length; } catch (e) { fautes.push(id + ' : data-exos illisible'); return; }
    if (nbEx !== nbEntrees) {
      fautes.push(id + ' : page hôte DÉSALIGNÉE (' + nbEx + ' blocs .exercise pour ' + nbEntrees + ' entrées)');
      return;
    }

    /* 10. contrôle : aucun MOT insécable de plus de 30 caractères dans le placeholder.
       `.exo-try__label` se coupe aux espaces mais pas au milieu d'un mot : un appel
       imbriqué comme `println(decrire(celsiusVersFahrenheit(20.0),` (44 caractères)
       débordait de 26 px à 320 px de large, mesuré par `verif-rendu.js`. Ce n'est PAS
       la longueur totale qui gêne — le site porte des placeholders de 375 caractères
       sans débordement — c'est le mot le plus long. */
    var long = (t.quoi.split(/\s+/).sort(function (a, b) { return b.length - a.length; })[0] || '');
    if (long.length > 30) {
      fautes.push(id + ' : le placeholder contient un mot insécable de ' + long.length +
        ' caractères (« ' + long + ' ») — il débordera du champ sur mobile');
      return;
    }

    var num = nbEx + 1;
    var provenance = source === page ? '' :
      '<p><em>Ce code est repris de la leçon précédente.</em></p>';
    var bloc =
      '<div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice ' + num +
      '</span><span class="exercise__level">Prédiction</span></div><p><strong>Sans exécuter le code</strong> : quelle sortie remplace le <code>?</code> de la ligne marquée <code>' +
      enc(lot.marqueur) + '&nbsp;=&gt;</code>&nbsp;?</p>' + provenance +
      '<figure class="code-block" data-file="' + lot.fichierCite + '"><pre><code class="language-' + lot.langue + '">' +
      enc(codeCite) + '</code></pre></figure>' +
      '<details><summary>Voir la réponse</summary><p>La ligne affiche <code>' + enc(attendu) + '</code>.' +
      (t.pourquoi ? ' ' + t.pourquoi : '') + '</p></details></div>';

    var entree = {
      type: 'text', accept: accept,
      placeholder: t.quoi + ' : …',
      hints: t.hints,
      link: { href: 'lecon-' + source + '.html', label: t.label }
    };

    rapport.push({ lot: nomLot, id: id, attendu: attendu, accept: accept, lignes: cite.length, num: num });

    if (VOIR) {
      console.log('\n----- ' + id + '  attendu = ' + JSON.stringify(attendu) + '  accept = ' + JSON.stringify(accept));
      console.log(codeCite);
    }
    if (!ECRIRE) return;

    /* insertion : le bloc juste après le dernier .exercise, l'entrée en fin de tableau */
    var dernier = src.lastIndexOf('<div class="exercise">');
    var ancre = '</details></div>';
    var posFin = src.indexOf(ancre, dernier);
    if (posFin < 0) { fautes.push(id + ' : fin du dernier exercice introuvable'); return; }
    posFin += ancre.length;
    src = src.slice(0, posFin) + '\n' + bloc + src.slice(posFin);

    var mj = src.match(/(<script type="application\/json" data-exos>\s*)([\s\S]*?)(\s*<\/script>)/);
    var tab = JSON.parse(mj[2]);
    tab.push(entree);
    var json = '[\n' + tab.map(function (e) { return '  ' + JSON.stringify(e); }).join(',\n') + '\n]';
    src = src.replace(mj[0], mj[1] + json + mj[3]);

    fs.writeFileSync(fPage, src, 'utf8');
    ecrits++;
  });
});

console.log('Exercices de prédiction' + (LOT_DEMANDE ? ' — lot ' + LOT_DEMANDE : ''));
rapport.forEach(function (r) {
  console.log('  ' + r.id + '  exercice ' + r.num + '  ' + r.lignes +
    ' lignes citées  attendu = ' + JSON.stringify(r.attendu) + '  (' + r.accept.length + ' graphies)');
});
var neufs = rapport.filter(function (r) { return r.num; }).length;
console.log('  total : ' + rapport.length + ' exercice(s), dont ' + (rapport.length - neufs) +
  ' déjà en place' + (ECRIRE ? ' — ' + ecrits + ' écrit(s)' : ' — contrôle seul'));
var bool = rapport.filter(function (r) { return /^(true|false|null|nil)$/i.test(r.attendu); }).length;
if (bool) console.log('  ⚠ ' + bool + ' réponse(s) binaire(s) (true/false/null) : une chance sur deux au hasard.');
if (notes.length) { console.log('\n  TOLÉRANCES DÉCLARÉES :'); notes.forEach(function (x) { console.log('   · ' + x); }); }
if (fautes.length) { console.log('\n  FAUTES :'); fautes.forEach(function (x) { console.log('   · ' + x); }); process.exit(1); }
