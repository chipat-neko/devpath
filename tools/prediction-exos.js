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
 * DEUX FORMES D'ANNONCE, parce que les langages n'écrivent pas leur sortie pareil.
 *   `forme` absent  — l'annonce termine la ligne de code : `x # => 3` (Ruby, Kotlin).
 *   `forme:'bloc'`  — le programme entier, PUIS sa sortie complète en commentaire :
 *                     c'est l'idiome des langages compilés (mesuré le 2026-08-26 :
 *                     cpp 64 blocs à « // Sortie : » contre 2 à « // => », rust 50
 *                     contre 0, java 37 contre 0). On y masque UNE ligne de la sortie.
 *                     La tête est STRICTE — « Sortie typique », « Sortie attendue »,
 *                     « Sortie probable » sont refusées, et ce sont exactement les cas
 *                     non déterministes du site (banc d'essai, comportement indéfini,
 *                     état non spécifié après std::move).
 *
 *   node tools/prediction-exos.js                  contrôle tous les lots (n'écrit rien)
 *   node tools/prediction-exos.js --lot=kotlin     un seul lot
 *   node tools/prediction-exos.js --lot=kotlin --write   écrit
 *   node tools/prediction-exos.js --rejouer        RECALCULE les lots déjà écrits
 *
 * IDEMPOTENT : une leçon qui porte déjà un exercice « Prédiction » est sautée. C'est
 * commode, mais ça masque toute régression de l'outil — un lot écrit ne repasse plus
 * jamais dans le calcul. `--rejouer` lève ce court-circuit sans jamais écrire (les
 * contrôles 6 et 9, qui portent sur la page hôte, y sont sautés : la page PORTE déjà
 * l'exercice). C'est ce mode qui a montré que 5 exercices du lot `ruby` (B7a) ne
 * passent pas les contrôles 5 et 7, instaurés APRÈS eux, en B7b.
 */
var fs = require('fs'), path = require('path');
var RACINE = path.resolve(__dirname, '..');
var ECRIRE = process.argv.indexOf('--write') !== -1;
var LOT_DEMANDE = (process.argv.filter(function (a) { return a.indexOf('--lot=') === 0; })[0] || '').slice(6);
var VOIR = process.argv.indexOf('--voir') !== -1;   // affiche le code cité, pour la relecture
var REJOUER = process.argv.indexOf('--rejouer') !== -1;  // recalcule les lots déjà écrits (n'écrit jamais)
if (REJOUER) ECRIRE = false;

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
    dossier: 'ruby', langue: 'ruby', marqueur: '#', fichierCite: 'extrait.rb',
    cibles: [
  { lecon: '02', bloc: '"3a".to_i', cible: 'puts "3a".to_i', quoi: 'ce qu’affiche puts "3a".to_i',
    hints: ['to_i ne lève pas d’erreur : il lit ce qu’il peut.',
            'Il s’arrête au premier caractère non numérique.',
            'Un seul chiffre est lisible ici.'],
    pourquoi: "to_i ne lève pas d’erreur : il lit ce qu’il peut. Il s’arrête au premier caractère non numérique.",
    label: 'Revoir « Les conversions »' },
  { lecon: '03', bloc: 'puts "b" if 0', cible: 'puts "b" if 0', quoi: 'ce qu’affiche puts "b" if 0',
    hints: ['En Ruby, seuls false et nil sont falsy.',
            'Zéro est un objet comme un autre.',
            'La condition est donc vraie : la ligne s’exécute.'],
    pourquoi: "En Ruby, seuls false et nil sont falsy. Zéro est un objet comme un autre.",
    label: 'Revoir « Ce qui est vrai, ce qui est faux »' },
  { lecon: '04', bloc: 'langages[99]', cible: 'langages[99]', quoi: 'la valeur de langages[99]',
    hints: ['Le tableau n’a que cinq éléments.',
            'Ruby ne lève pas d’erreur pour un indice hors limites.',
            'Trois lettres, l’absence de valeur.'],
    pourquoi: "Le tableau n’a que cinq éléments. Ruby ne lève pas d’erreur pour un indice hors limites.",
    label: 'Revoir « Accéder aux éléments »' },
  { lecon: '05', bloc: 'contact.delete(:metier)', cible: 'contact.delete(:metier)',
    quoi: 'la valeur que renvoie contact.delete(:metier)',
    hints: ['delete ne renvoie pas le hash, ni true.',
            'Il rend ce qu’il vient d’enlever.',
            'La clé :metier avait été modifiée juste avant.'],
    pourquoi: "delete ne renvoie pas le hash, ni true. Il rend ce qu’il vient d’enlever.",
    label: 'Revoir « Modifier un hash »' },
  { lecon: '06', bloc: 'addition_proc.call(1)', cible: 'addition_proc.call(1)',
    quoi: 'la valeur de addition_proc.call(1)',
    hints: ['Un Proc ne vérifie pas le nombre d’arguments.',
            'b vaut donc nil, et nil.to_i vaut 0.',
            'C’est là que le lambda, lui, lèverait une erreur.'],
    pourquoi: "Un Proc ne vérifie pas le nombre d’arguments. b vaut donc nil, et nil.to_i vaut 0.",
    label: 'Revoir « Proc et lambda »' },
  { lecon: '07', bloc: 'take_while', cible: 'notes.take_while { |n| n >= 10 }',
    quoi: 'la valeur de notes.take_while { |n| n >= 10 }',
    hints: ['take_while n’est pas select : il ne filtre pas tout le tableau.',
            'Il prend tant que la condition tient, et s’arrête au premier échec.',
            'Le 16 vient après le 9 : il ne sera jamais atteint.'],
    pourquoi: "take_while n’est pas select : il ne filtre pas tout le tableau. Il prend tant que la condition tient, et s’arrête au premier échec.",
    label: 'Revoir « take, drop et leurs variantes »' },
  { lecon: '08', bloc: 'def prix_ttc', cible: 'prix_ttc(100)', quoi: 'la valeur de prix_ttc(100)',
    hints: ['La dernière expression évaluée est la valeur de retour.',
            'La TVA est un flottant : la multiplication l’est aussi.',
            'La réponse n’est donc pas un entier.'],
    pourquoi: "La dernière expression évaluée est la valeur de retour. La TVA est un flottant : la multiplication l’est aussi.",
    label: 'Revoir « Le retour implicite »' },
  { lecon: '09', bloc: 'def ==(autre)', cible: 'a == b', quoi: 'la valeur de a == b',
    hints: ['Les deux comptes n’ont ni le même titulaire ni le même solde.',
            'Mais la classe redéfinit == : c’est elle qui décide.',
            'Elle ne compare qu’une seule chose, et les deux la partagent.'],
    pourquoi: "Les deux comptes n’ont ni le même titulaire ni le même solde. Mais la classe redéfinit == : c’est elle qui décide.",
    label: 'Revoir « Redéfinir == »' },
  { lecon: '10', bloc: 'clamp(v32, v34)', cible: 'Version.new(3, 9).clamp(v32, v34).to_s',
    quoi: 'la valeur de Version.new(3, 9).clamp(v32, v34).to_s',
    hints: ['clamp ramène une valeur dans un intervalle.',
            '3.9 dépasse la borne haute.',
            'On obtient donc la borne, pas la valeur.'],
    pourquoi: "clamp ramène une valeur dans un intervalle. 3.9 dépasse la borne haute.",
    label: 'Revoir « Comparable »' },
  { lecon: '11', bloc: 'inverse_mots', cible: '"le chat dort".inverse_mots',
    quoi: 'la valeur de "le chat dort".inverse_mots',
    hints: ['split sans argument découpe sur les espaces.',
            'reverse s’applique au tableau de mots, pas aux lettres.',
            'join recolle avec une espace.'],
    pourquoi: "split sans argument découpe sur les espaces. reverse s’applique au tableau de mots, pas aux lettres.",
    label: 'Revoir « Rouvrir une classe »' },
  { lecon: '12', bloc: 'e.backtrace.first', cible: 'puts e.class', quoi: 'ce qu’affiche puts e.class',
    hints: ['Integer("abc") ne renvoie pas nil : il lève.',
            'Ce n’est ni TypeError ni StandardError.',
            'L’argument est du bon type, mais sa valeur est invalide.'],
    pourquoi: "Integer(\"abc\") ne renvoie pas nil : il lève. Ce n’est ni TypeError ni StandardError.",
    label: 'Revoir « Inspecter l’exception »' },
  { lecon: '18', bloc: '"1 lapin, 2 lapins"', cible: '"1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    quoi: 'la valeur de "1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    hints: ['gsub remplace TOUTES les occurrences.',
            'Le motif /lapins?/ capte aussi bien le singulier que le pluriel.',
            'Le remplaçant, lui, ne s’accorde pas.'],
    pourquoi: "gsub remplace TOUTES les occurrences. Le motif /lapins?/ capte aussi bien le singulier que le pluriel.",
    label: 'Revoir « Remplacer avec gsub »' },
  { lecon: '19', bloc: '.to_json', cible: '{ ville: "Lyon", hab: 522_000 }.to_json',
    quoi: 'la valeur de { ville: "Lyon", hab: 522_000 }.to_json',
    hints: ['Les clés symboles deviennent des chaînes entre guillemets.',
            'Le tiret bas de 522_000 n’est qu’une aide à la lecture.',
            'JSON n’ajoute aucune espace.'],
    pourquoi: "Les clés symboles deviennent des chaînes entre guillemets. Le tiret bas de 522_000 n’est qu’une aide à la lecture.",
    label: 'Revoir « Écrire du JSON »' },
  { lecon: '20', bloc: 'premier, *reste', cible: 'reste', quoi: 'la valeur de reste',
    hints: ['L’astérisque ramasse tout ce qui reste.',
            'Le résultat est un tableau, même s’il n’y avait qu’un élément.',
            'Le premier élément, lui, est parti dans premier.'],
    pourquoi: "L’astérisque ramasse tout ce qui reste. Le résultat est un tableau, même s’il n’y avait qu’un élément.",
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

     (suite des écarts kotlin plus bas — le lot cpp est déclaré après.)

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
  },

  /* ===================== B7c — cpp (2026-08-26) =====================
     PREMIER LOT À LA FORME « bloc » : ici la leçon ne commente pas ses lignes une à
     une, elle donne le programme entier PUIS sa sortie complète en commentaire. On
     masque UNE ligne de cette sortie ; les autres restent visibles, ce qui pose la
     question sans révéler la réponse.

     ⚠️ ET SURTOUT : chacune de ces sorties a été RECALCULÉE avant d'être reprise.
     Aucun compilateur C++ n'est disponible ici, mais ces programmes sont de
     l'algorithmique déterministe : `scratchpad/v14-b7c/rejoue-cpp.js` les transpose,
     reproduit ce que fait `std::cout` (un bool sort « 1 », un double 7.0 sort « 7 »,
     `size()` compte des octets) et compare à la sortie EXTRAITE du HTML —
     12 programmes, 21 lignes, 0 divergence. C'est la première fois qu'un lot de
     prédiction repose sur des valeurs vérifiées et non sur la seule parole du site. */
  cpp: {
    dossier: 'cpp', langue: 'cpp', marqueur: '//', forme: 'bloc', fichierCite: 'extrait.cpp',
    cibles: [
  { source: '01', page: '02', bloc: 'int& alias = n;', ligne: '6 et 7',
    quoi: 'la ligne manquante', commentaires: 3,
    hints: ['Deux fonctions portent le même nom : c’est le TYPE de l’argument qui choisit.',
            '3 est un int, 3.5 est un double — ce ne sont pas les mêmes appels.',
            'La version double rend 7.0, mais std::cout n’écrit pas les zéros inutiles.'],
    pourquoi: 'doubler(3) appelle la surcharge int et rend 6 ; doubler(3.5) appelle la surcharge double et rend 7.0, que std::cout affiche « 7 » sans le zéro final.',
    label: 'Revoir « Découvrir le C++ »' },

  { source: '02', page: '03', bloc: 'void afficher(const std::string& texte)',
    ligne: 'caracteres', quoi: 'la ligne manquante', commentaires: 3,
    hints: ['size() ne compte pas les mots, mais les caractères.',
            'Les espaces comptent, les deux + aussi.',
            'Compte-les un par un : « Bonjour », l’espace, « le », l’espace, « C++ ».'],
    pourquoi: 'std::string::size() compte tous les caractères, espaces et symboles compris.',
    label: 'Revoir « Types, références et bases modernes »' },

  { source: '05', page: '06', bloc: 'Buffer& operator=(const Buffer& autre)',
    ligne: 'a[0]=', quoi: 'la ligne manquante',
    /* Relus un par un (contrôle 11). Trois ÉNONCENT la réponse : « modifie b, pas a
       (tableaux distincts) » dit que a garde 7 et b 99 ; « appelle le constructeur de
       copie » désigne le mécanisme ; « duplique le tableau (copie profonde) » donne le
       mot même de la notion. Les cinq autres (std::copy, l'ordre allouer/copier/
       libérer/basculer, l'auto-affectation) décrivent l'opérateur d'affectation, qui
       n'est PAS la ligne jouée ici. */
    masquer: ['modifie b, pas a', 'appelle le constructeur de copie', 'duplique le tableau'],
    commentaires: 6,
    hints: ['b est construit à partir de a : quel constructeur est appelé ?',
            'Celui-ci n’a pas copié le POINTEUR, il a alloué un nouveau tableau.',
            'Les deux objets ont donc des tableaux distincts.'],
    pourquoi: 'Le constructeur de copie fait une copie PROFONDE : b possède son propre tableau, donc modifier b ne change pas a.',
    label: 'Revoir « Constructeurs, destructeurs et RAII »' },

  { source: '07', page: '08', bloc: 'bool operator==(const Vecteur2D&) const = default;',
    ligne: 'a * 3', quoi: 'la ligne manquante', commentaires: 1,
    hints: ['a vaut (1, 2), et l’operator* multiplie chaque composante.',
            'Le facteur est 3.0, appliqué à x comme à y.',
            'L’affichage passe par l’operator<< maison, qui écrit « (x, y) ».'],
    pourquoi: 'operator*(v, k) multiplie les deux composantes : (1, 2) × 3 donne (3, 6), affiché par l’operator<< sous la forme « (x, y) ».',
    label: "Revoir « La surcharge d'opérateurs »" },

  { source: '08', page: '09', bloc: "fabrique(1'000'000)", ligne: '1000000',
    quoi: 'la ligne manquante',
    masquer: ['duplique le million'], commentaires: 2,
    /* ⚠️ apostrophe DROITE dans le littéral : c'est la seule que le compilateur
       accepte, et c'est précisément le sujet de l'exercice. L'écrire en apostrophe
       typographique — ce que faisait le premier jet — donne du C++ invalide dans
       l'indice qui explique ce caractère-là. */
    hints: ["Le séparateur de 1'000'000 n’est pas un chiffre : il ne fait que grouper.",
            'b est une COPIE de a : quelle taille a une copie ?',
            'Les deux tailles sont affichées sur la même ligne, séparées par une espace.'],
    pourquoi: "Depuis C++14, l’apostrophe droite sépare les chiffres d’un littéral : 1'000'000 vaut un million. La copie duplique les éléments, donc les deux vecteurs ont la même taille.",
    label: 'Revoir « Sémantique de copie et de déplacement »' },

  { source: '11', page: '12', bloc: 'std::count_if(v.begin(), v.end()', ligne: 'premier > 4',
    quoi: 'la ligne manquante', masquer: ['v == {9'], commentaires: 3,
    commentaireTolere: '« // premier élément > 4 » décrit l’INTENTION de find_if, pas son résultat : le vecteur trié n’est plus montré nulle part.',
    hints: ['Attention à l’ordre des opérations : le tri a lieu AVANT la recherche.',
            'Le comparateur est a > b : le vecteur est trié par ordre décroissant.',
            'find_if rend le PREMIER élément qui convient, dans le vecteur déjà trié.'],
    pourquoi: 'Le tri décroissant place 9 en tête ; find_if s’arrête au premier élément supérieur à 4, c’est-à-dire le tout premier.',
    label: 'Revoir « La STL : algorithmes et lambdas »' },

  { source: '13', page: '14', bloc: 'std::optional<int> vers_entier', ligne: 'b = ',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ['std::stoi("abc") ne rend pas 0 : il lève une exception.',
            'Le catch rend donc nullopt, et b est un optional VIDE.',
            'value_or ne rend sa valeur de repli que dans ce cas précis.'],
    pourquoi: 'stoi("abc") lève, le catch rend nullopt : b est vide, donc value_or(-1) rend son repli.',
    label: "Revoir « Gestion d'erreurs et utilitaires modernes »" },

  { source: '16', page: '17', bloc: '(std::cout << ... << args)', ligne: 'ok=',
    quoi: 'la ligne manquante', commentaires: 4,
    hints: ['Le fold déplie les arguments dans l’ordre où ils sont passés.',
            'Le dernier argument est un bool.',
            'Sans std::boolalpha, un bool ne s’affiche pas « true ».'],
    pourquoi: 'Sans std::boolalpha, std::cout écrit un bool comme un entier : true devient 1.',
    label: 'Revoir « Métaprogrammation et templates avancés »' },

  { source: '17', page: '18', bloc: 'rv::filter', ligne: '4 16', quoi: 'la ligne manquante',
    commentaires: 2,
    hints: ['Le pipeline garde d’abord les pairs, puis élève au carré.',
            'Le vecteur va de 1 à 8 : il y a donc quatre pairs.',
            'Les carrés sont affichés séparés par une espace, dans l’ordre.'],
    pourquoi: 'filter garde 2, 4, 6, 8 ; transform les élève au carré. Le calcul n’a lieu qu’au moment de la boucle, mais le résultat est le même.',
    label: 'Revoir « Performance et C++ moderne »' },

  { source: '17', page: '19', bloc: 'co_yield i;', ligne: '0 1', quoi: 'la ligne manquante',
    commentaires: 3,
    /* ⚠️ Le 3ᵉ indice du premier jet (« Il rend donc quatre valeurs, et la dernière
       n’est pas 4 ») ne laissait plus rien à déduire : combiné aux deux autres, il
       ÉNONÇAIT la réponse. Un indice donne une règle, pas un résultat. */
    hints: ['La boucle du générateur part de i = 0.',
            'Sa condition est i < n, avec n valant 4 : la borne est exclue.',
            'Les valeurs sont affichées dans l’ordre où co_yield les rend, séparées par une espace.'],
    pourquoi: 'La boucle va de 0 à n-1 : compteur(4) rend quatre valeurs, 0 à 3.',
    label: 'Revoir « Performance et C++ moderne »' }

  /* ÉCARTÉS PAR LA RÈGLE DE LA TÊTE STRICTE — et c'est le bon résultat : les blocs
     annotés « Sortie typique », « Sortie attendue », « Sortie probable » ou
     « Sortie (avec reserve(2)) » sont précisément les cas NON DÉTERMINISTES du cours.
     `lecon-08` : l'état d'une std::string après std::move est « valide mais NON
     SPÉCIFIÉ » — la leçon le dit, et prédire « source : [] » serait enseigner le faux.
     `lecon-17` : un banc d'essai (320 ns) ne se prédit pas. `lecon-06` : un
     comportement indéfini. `lecon-12` : « plantage ou corruption du tas ».

     ÉCARTÉ — `lecon-05`, le bloc de la Sentinelle (« destruction » avant « apres le
     bloc ») : c'est le plus bel exemple RAII du cours, mais chaque ligne de sa sortie
     est un littéral du code, donc la réponse se recopie sans rien comprendre. Le
     contrôle 5 le refuse, et il a raison.

     NON TRAITÉ — `lecon-12` emploie un TROISIÈME idiome, le commentaire de bloc
     (« /* Sortie : … *​/ »), que la forme « bloc » ne lit pas. Un seul bloc du cours
     est dans ce cas ; le gain ne valait pas un troisième analyseur. */
    ]
  }
};

/* ------------------------------- outillage ------------------------------- */
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'); }
function dec(s) {
  /* ⚠️ Les `\r` D'ABORD, et ce n'est pas de la cosmétique. `core.autocrlf` vaut `true`
     ici : un simple `git checkout` d'une page la réécrit en CRLF. Or un motif qui finit
     par `$` sans le drapeau `m` ne matche PLUS une ligne terminée par `\r` — `.` ne
     traverse pas un retour chariot. C'est ce qui a fait échouer 4 cibles sur 11 après
     un retour en arrière, alors que ni le site ni la table n'avaient changé. */
  return s.replace(/\r\n?/g, '\n')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
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
  /* ⚠️ La condition ne peut pas être « ça commence par [ ou { ». Mesuré par un
     contradicteur dans Chrome : sur « a * 3   = (3, 6) », un apprenant qui a tout
     compris et tape « a * 3 = (3,6) » est REFUSÉ — normExo réduit les suites
     d'espaces mais n'égalise pas l'espace après la virgule, et la valeur ne commence
     ni par « [ » ni par « { ». Le critère juste est la PRÉSENCE d'une liste entre
     parenthèses ou crochets, où la virgule sépare des éléments et n'appartient pas
     au texte. Sur une phrase, on ne touche toujours à rien. */
  if (/[\[{(][^\])}]*,[^\])}]*[\])}]/.test(v)) {
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
  /* FORME « bloc » (B7c) — l'idiome des langages compilés : le programme entier, puis
     sa sortie complète en commentaires à la fin. Mesuré le 2026-08-26 : cpp 64 blocs,
     rust 50, java 37, csharp 31, c 28, php 29, go 22 — contre 0 à 2 blocs seulement
     à l'idiome « annonce en fin de ligne » de Ruby/Kotlin. La tête est STRICTE :
     « // Sortie : » et rien d'autre. « Sortie typique », « Sortie attendue »,
     « Sortie probable », « Sortie (avec reserve(2)) » sont donc écartées d'office —
     et c'est exactement ce qu'il faut, car ce sont les cas NON DÉTERMINISTES du site
     (le benchmark, l'état non spécifié après std::move, le comportement indéfini). */
  var RE_TETE = new RegExp('^\\s*' + M + '\\s*Sortie\\s*:(.*)$');
  var RE_TETE_TEST = new RegExp('^\\s*' + M + '\\s*Sortie\\s*:', 'm');
  var RE_SORTIE = new RegExp('^\\s*' + M + '\\s?');

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
    /* Idempotence : relancer le script ne doit pas empiler un second exercice.
       `--rejouer` court-circuite ce court-circuit : il refait tout le calcul sur les
       lots DÉJÀ écrits, sans jamais écrire. C'est le contrôle de non-régression de
       l'outil lui-même — sans lui, refondre l'extraction ne se vérifie sur rien,
       puisque les lots anciens sortent avant d'avoir été recalculés. */
    if (src.indexOf('exercise__level">Prédiction') >= 0 && !REJOUER) {
      rapport.push({ lot: nomLot, id: id, attendu: '(déjà posé)', accept: [], lignes: 0, num: 0 });
      return;
    }

    /* 1. le bloc, extrait de la leçon SOURCE — jamais retapé */
    var m, code = null;
    RE_BLOC.lastIndex = 0;
    while ((m = RE_BLOC.exec(srcBloc))) {
      var c = dec(m[2]);
      if (c.indexOf(t.bloc) < 0) continue;
      /* ⚠️ En forme « bloc », NE PAS s'arrêter au premier bloc qui contient le motif :
         une leçon montre presque toujours l'extrait court (la signature, la ligne
         isolée) AVANT le programme complet qui, lui, porte la sortie. Le premier jet
         s'y est fait prendre — il concluait « pas de tête Sortie : » sur cpp/lecon-07
         alors que le bon bloc était deux figures plus bas. */
      if (lot.forme === 'bloc' && !RE_TETE_TEST.test(c)) continue;
      code = c; break;
    }
    if (code === null) { fautes.push(id + ' : bloc introuvable, ou sans tête « ' + lot.marqueur + ' Sortie : » (' + t.bloc + ')'); return; }

    /* 2. la ligne visée et SA sortie annoncée.
       Deux formes : l'annonce termine la ligne de code (Ruby, et Kotlin le plus
       souvent), ou elle occupe la ligne SUIVANTE (fréquent en Kotlin) — champ `apres`. */
    var lignes = code.split('\n');
    var occ = t.occ || 1, vu = 0, iAnn = -1, iCode = -1;
    var attendu = null, codeCite = null, nbSorties = 0;
    /* Les AUTRES valeurs annoncées du même bloc, pour le contrôle 7 (indiscernabilité
       au sens du juge). Rempli par les deux formes, lu une seule fois plus bas. */
    var autresValeurs = [];

    if (lot.forme === 'bloc') {
      /* --- FORME « bloc » : le programme, puis sa sortie complète en commentaires. ---
         On repère la tête stricte, on délimite la sortie, on désigne la ligne visée par
         le motif `t.ligne`, et on la remplace par un « ? » DANS LA SORTIE CITÉE. Le
         reste de la sortie demeure visible : c'est le contexte qui rend la question
         posable (« quelle ligne manque ici ? ») sans dire combien de lignes il y a. */
      var iTete = -1, reste = '';
      for (var a = 0; a < lignes.length; a++) {
        var mt = lignes[a].match(RE_TETE);
        if (mt) { iTete = a; reste = mt[1].trim(); break; }
      }
      if (iTete < 0) { fautes.push(id + ' : pas de tête « ' + lot.marqueur + ' Sortie : » stricte dans ce bloc'); return; }

      var iDeb, iFin;                       // bornes INCLUSIVES des lignes de sortie
      if (reste) { iDeb = iTete; iFin = iTete; }   // sortie d'une seule ligne, sur la tête
      else {
        iDeb = iTete + 1; iFin = iTete;
        for (var b = iTete + 1; b < lignes.length; b++) {
          if (!RE_SORTIE.test(lignes[b])) { if (!lignes[b].trim()) continue; break; }
          iFin = b;
        }
        if (iFin < iDeb) { fautes.push(id + ' : tête « Sortie : » sans aucune ligne de sortie'); return; }
      }

      var vus = 0;
      for (var d = iDeb; d <= iFin; d++) {
        var val = d === iTete ? reste : lignes[d].replace(RE_SORTIE, '').replace(/\s+$/, '');
        if (val.indexOf(t.ligne) < 0) continue;
        if (++vus === occ) { iAnn = d; break; }
      }
      if (iAnn < 0) { fautes.push(id + ' : ligne de sortie introuvable (' + t.ligne + ', occurrence ' + occ + ')'); return; }

      attendu = (iAnn === iTete ? reste : lignes[iAnn].replace(RE_SORTIE, '')).trim();
      if (!attendu) { fautes.push(id + ' : ligne de sortie vide'); return; }
      iCode = iAnn;
      nbSorties = iFin - iDeb + 1;
      for (var f2 = iDeb; f2 <= iFin; f2++) {
        if (f2 === iAnn) continue;
        var v2 = (f2 === iTete ? reste : lignes[f2].replace(RE_SORTIE, '')).trim();
        if (v2) autresValeurs.push(v2);
      }

      /* 2bis. contrôle : la ligne visée ne doit pas porter de GLOSE. Le site annote
         parfois sa sortie (« libérée : buffer       <- destructeurs appelés ») : ce
         n'est plus ce que le programme affiche, et le demander serait faux. */
      if (/<-|->|~\s|\(x\d|\(aucun|\(~|,\s*comme attendu/.test(attendu)) {
        fautes.push(id + ' : la ligne visée porte une glose, ce n\'est pas la sortie brute (« ' + attendu + ' »)');
        return;
      }

      /* 3. le code cité : la ligne visée devient « ? », le reste est intact —
         SAUF les commentaires de fin de ligne qui RÉPÈTENT une ligne de la sortie.
         ⚠️ Le contrôle 5 a trouvé le cas tout seul : `std::cout << "b = " <<
         b.value_or(-1) << '\n'; // b = -1` annonce la sortie deux fois, dans le
         programme puis dans le bloc final. Les laisser, c'est publier la réponse.
         La coupe est CIBLÉE : on ne retire un commentaire que si son texte est,
         au sens du juge, l'une des lignes de la sortie. Un commentaire explicatif
         (« // capture par valeur ») n'est jamais touché. */
      var toutesSorties = autresValeurs.concat([attendu]).map(normExo);
      var citeB = [], coupes = 0, masques = 0, apres = 0, restants = [];
      for (var e = 0; e < lignes.length; e++) {
        if (e === iAnn) {
          /* Le « ? » occupe TOUJOURS sa propre ligne, même quand la leçon écrit sa
             sortie sur la tête (« // Sortie : 4 16 36 64 »). Sinon le marqueur réel
             est « // Sortie : ? » alors que l'énoncé annonce « // ? » : la consigne
             de recherche devient fausse, sur 4 des 11 pages du lot cpp. */
          if (e === iTete) {
            var indent = lignes[e].match(/^\s*/)[0];
            citeB.push(lignes[e].slice(0, lignes[e].length - reste.length).replace(/\s+$/, ''));
            citeB.push(indent + lot.marqueur + ' ?');
          } else citeB.push(lignes[e].match(/^\s*/)[0] + lot.marqueur + ' ?');
          continue;
        }
        var lg = lignes[e];
        if (e < iDeb) {
          /* (a) le commentaire répète une ligne de la sortie : on le retire. */
          if (!COMMENTE.test(lg)) {
            var iCom = lg.indexOf(lot.marqueur);
            if (iCom > 0) {
              var texteCom = lg.slice(iCom + lot.marqueur.length).trim();
              if (texteCom && toutesSorties.indexOf(normExo(texteCom)) >= 0) {
                lg = lg.slice(0, iCom).replace(/\s+$/, '');
                coupes++;
              }
            }
          }
          /* (b) le commentaire ÉNONCE la réponse en français — le vrai trou du lot.
             `masquer` déclare, cible par cible, les commentaires à neutraliser : ils
             deviennent une question ouverte, sans que la leçon d'origine soit touchée.
             C'est le contrôle 11 (plus bas) qui oblige à les regarder. */
          for (var q2 = 0; q2 < (t.masquer || []).length; q2++) {
            var p = lg.indexOf(t.masquer[q2]);
            if (p < 0) continue;
            var c0 = lg.lastIndexOf(lot.marqueur, p);
            if (c0 < 0) continue;
            masques++;
            /* Ligne entièrement commentée : elle DISPARAÎT. Commentaire de fin de
               ligne : seul le commentaire tombe, le code reste. */
            if (COMMENTE.test(lg)) { lg = null; break; }
            lg = lg.slice(0, c0).replace(/\s+$/, '');
          }
          if (lg === null) continue;
          /* (c) inventaire : tout commentaire de CODE que l'apprenant lira encore.
             Compté ici, où l'on sait que la ligne appartient au programme et non à
             la sortie ; la cible doit en déclarer le nombre exact (contrôle 11). */
          var pc = e === iTete ? -1 : lg.indexOf(lot.marqueur);
          if (pc >= 0 && lg.slice(pc + lot.marqueur.length).trim()) restants.push(lg.slice(pc + lot.marqueur.length).trim());
        } else if (e > iFin && COMMENTE.test(lg)) {
          /* Après la zone de sortie, une ligne entièrement commentée se lit comme la
             SUITE de la sortie — l'énoncé vient de dire que la sortie est écrite en
             commentaire à la fin. cpp/lecon-17 met deux lignes d'explication juste
             sous « // Sortie : … » : l'apprenant croit que la sortie fait trois
             lignes. Elles sortent du code cité ; l'explication reste dans la réponse. */
          apres++;
          continue;
        }
        citeB.push(lg);
      }
      if (coupes) notes.push(id + ' : ' + coupes + ' commentaire(s) de fin de ligne retiré(s), ils répétaient la sortie');
      if (masques !== (t.masquer || []).length) {
        fautes.push(id + ' : ' + (t.masquer || []).length + ' commentaire(s) à masquer déclaré(s), ' + masques + ' trouvé(s) dans le bloc — un motif ne correspond à rien');
        return;
      }
      if (masques) notes.push(id + ' : ' + masques + ' commentaire(s) neutralisé(s), ils énonçaient la réponse');
      while (citeB.length && !citeB[citeB.length - 1].trim()) citeB.pop();
      codeCite = citeB.join('\n');

      /* 11. LE CONTRÔLE QUI MANQUAIT, et qu'un fan-out de contradiction a exigé.
         Le contrôle 5 ne cherche que la réponse LITTÉRALE dans le code cité. Il ne
         voit donc pas un commentaire qui l'énonce EN FRANÇAIS : « // modifie b, pas a
         (tableaux distincts) » dit que a garde 7 et que b vaut 99, sans jamais écrire
         « a[0]=7  b[0]=99 » ; « // v == {9, 8, 5, 2, 1} » donne le tri qu'on demandait
         de faire ; « // COPIE : duplique le million d'éléments » donne les DEUX points
         de son exercice. Trois contradicteurs sur trois l'ont trouvé ; aucun de mes
         contrôles ne pouvait le trouver.

         PREMIER JET, ET IL ÉTAIT VIDE. J'ai d'abord comparé les MOTS du commentaire à
         ceux de la réponse. Contre-épreuve : masquage retiré sur `lecon-06`, l'outil
         n'a rien dit — la réponse « a[0]=7  b[0]=99 » n'a aucun mot de deux lettres,
         et « modifie b, pas a » n'en partage évidemment aucun. Un contrôle qui ne peut
         pas échouer ne contrôle rien : c'est la troisième fois que ce chantier bute
         dessus. La prose française qui révèle un résultat n'est PAS détectable par
         recoupement de tokens ; prétendre le contraire aurait rendu un vert par vacuité.

         CE QUI EST RÉELLEMENT MESURABLE : le NOMBRE de commentaires que le code cité
         laisse à l'apprenant. La cible doit le déclarer (`commentaires: N`). L'outil
         les affiche tous, un par un, ce qui oblige à les lire à l'écriture ; et si la
         leçon source change plus tard — un commentaire ajouté, reformulé, déplacé —
         le compte diverge et l'outil refuse. Il ne juge pas le sens : il garantit
         qu'aucun commentaire n'entre dans un exercice sans avoir été vu. */
      if (t.commentaires !== restants.length) {
        fautes.push(id + ' : ' + restants.length + ' commentaire(s) restent dans le code cité, la cible en déclare ' +
          (t.commentaires === undefined ? 'aucun (champ `commentaires` absent)' : t.commentaires) +
          '. À RELIRE UN PAR UN, aucun ne doit énoncer la réponse :\n        · ' +
          restants.join('\n        · '));
        return;
      }
    }

    for (var i = 0; codeCite === null && i < lignes.length; i++) {
      if (lignes[i].indexOf(t.cible) < 0) continue;
      if (t.apres) {
        if (i + 1 < lignes.length && RE_ANN_SEULE.test(lignes[i + 1])) { if (++vu === occ) { iCode = i; iAnn = i + 1; break; } }
      } else if (RE_ANN.test(lignes[i])) {
        if (++vu === occ) { iCode = i; iAnn = i; break; }
      }
    }
    if (codeCite === null) {
      if (iAnn < 0) { fautes.push(id + ' : ligne visée sans annonce de sortie (' + t.cible + ', occurrence ' + occ + ')'); return; }
      attendu = valeurNette(lignes[iAnn].replace(RE_VAL, ''));
      if (!attendu) { fautes.push(id + ' : sortie annoncée vide'); return; }

      /* 3. le code cité : toutes les annonces de sortie retirées, un « ? » sur la ligne visée */
      var cite = [];
      for (var j = 0; j < lignes.length; j++) {
        var l = lignes[j];
        if (RE_ANN_SEULE.test(l)) {
          if (j === iAnn) cite.push(l.match(/^\s*/)[0] + lot.marqueur + ' => ?');
          continue;                                        // sinon : la ligne disparaît
        }
        var nu = l.replace(RE_ANN_FIN, '');
        if (j === iAnn) cite.push(nu + '   ' + lot.marqueur + ' => ?');
        else cite.push(nu);
      }
      while (cite.length && !cite[cite.length - 1].trim()) cite.pop();
      codeCite = cite.join('\n');
      for (var k2 = 0; k2 < lignes.length; k2++) {
        if (k2 === iAnn || !RE_ANN.test(lignes[k2])) continue;
        var v3 = valeurNette(lignes[k2].replace(RE_VAL, ''));
        if (v3) autresValeurs.push(v3);
      }
    }

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
    var ligneNue = lot.forme === 'bloc' ? attendu : lignes[iCode].replace(RE_ANN_FIN, '').trim();
    /* En mode `--rejouer` la page hôte PORTE déjà l'exercice, donc elle contient
       forcément la ligne visée : ce contrôle-là n'a plus de sens, et les contrôles 9
       (alignement) non plus. Le mode vérifie l'EXTRACTION, pas la page d'accueil. */
    if (!REJOUER && ligneNue && dec(src).indexOf(ligneNue) >= 0) {
      fautes.push(id + ' : la ligne visée « ' + ligneNue + ' » figure déjà dans la page où l\'exercice est posé');
      return;
    }

    /* 7. contrôle : l'attendu doit se DISTINGUER des autres sorties du même bloc,
       AU SENS DU JUGE. `normExo` finit par toLowerCase() : deux annonces qui ne
       diffèrent que par la casse — `[dormir, manger]` et `[DORMIR, manger]` — sont
       le même verdict, et l'exercice accepte alors la sortie de la ligne d'avant. */
    var collision = null;
    for (var k = 0; k < autresValeurs.length; k++) {
      if (normExo(autresValeurs[k]) === normExo(attendu)) { collision = autresValeurs[k]; break; }
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
    if (!REJOUER && nbEx !== nbEntrees) {
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
    /* ⚠️ « la leçon précédente » n'est vrai que si l'hôte suit immédiatement la source.
       Dès qu'un lot doit sauter une leçon (une page hôte ne peut porter qu'UN exercice
       de prédiction, l'idempotence se fondant sur sa présence), la phrase devient
       fausse. On cite donc le NUMÉRO, qui est toujours juste. */
    var provenance = source === page ? '' :
      (Number(page) === Number(source) + 1
        ? '<p><em>Ce code est repris de la leçon précédente.</em></p>'
        : '<p><em>Ce code est repris de la leçon ' + enc(String(Number(source))) + '.</em></p>');
    /* L'énoncé suit la forme : en Ruby/Kotlin le « ? » remplace une annonce de fin de
       ligne, en C++ il remplace UNE LIGNE de la sortie du programme, les autres restant
       affichées. Dire lequel évite l'ambiguïté sur ce qu'il faut taper. */
    /* ⚠️ Et l'énoncé doit dire le VRAI nombre de lignes. « Le programme affiche sa
       sortie complète, une ligne a été remplacée » promet un contexte qui n'existe pas
       quand le programme n'affiche qu'UNE ligne — le cas de 5 des 11 cibles cpp. */
    var question = lot.forme !== 'bloc'
      ? '<p><strong>Sans exécuter le code</strong>&nbsp;: quelle sortie remplace le <code>?</code> de la ligne marquée <code>' +
        enc(lot.marqueur) + '&nbsp;=&gt;</code>&nbsp;?</p>'
      : (nbSorties > 1
        ? '<p><strong>Sans exécuter le code</strong>&nbsp;: la sortie complète du programme est écrite en commentaire à la fin, mais <strong>une de ses lignes a été remplacée par <code>' +
          enc(lot.marqueur) + '&nbsp;?</code></strong>. Quelle est cette ligne&nbsp;?</p>'
        : '<p><strong>Sans exécuter le code</strong>&nbsp;: ce programme n\'affiche qu\'une seule ligne, et elle a été remplacée par <code>' +
          enc(lot.marqueur) + '&nbsp;?</code> à la fin du code. Quelle est-elle&nbsp;?</p>');
    var bloc =
      '<div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice ' + num +
      '</span><span class="exercise__level">Prédiction</span></div>' + question + provenance +
      '<figure class="code-block" data-file="' + lot.fichierCite + '"><pre><code class="language-' + lot.langue + '">' +
      enc(codeCite) + '</code></pre></figure>' +
      /* ⚠️ `pourquoi` et `hints` sont du TEXTE : ils doivent être échappés comme tout
         le reste. Le premier jet concaténait `pourquoi` tel quel — et le premier champ
         à contenir un « < » (« l'operator<< maison », cpp/lecon-08) a produit deux
         chevrons bruts dans le HTML. Le navigateur les tolère, `verif-html.js` ne les
         voit pas : c'est un contradicteur qui l'a trouvé, en cherchant `<` non suivi
         d'une lettre. Une valeur injectée dans du HTML passe par enc(), sans exception. */
      '<details><summary>Voir la réponse</summary><p>La ligne affiche <code>' + enc(attendu) + '</code>.' +
      (t.pourquoi ? ' ' + enc(t.pourquoi) : '') + '</p></details></div>';

    var entree = {
      type: 'text', accept: accept,
      placeholder: t.quoi + ' : …',
      hints: t.hints,
      link: { href: 'lecon-' + source + '.html', label: t.label }
    };

    rapport.push({ lot: nomLot, id: id, attendu: attendu, accept: accept, lignes: codeCite.split('\n').length, num: num });

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
