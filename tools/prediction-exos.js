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
  },

  /* ===================== B7c-2 — rust (2026-08-26) =====================
     Même forme « bloc » que cpp, et même règle : chaque sortie a été RECALCULÉE avant
     d'être reprise. Ni `rustc` ni `cargo` n'existent ici (vérifié) ;
     `tools/preuves/rejoue-rust.js` transpose les 14 programmes et reproduit ce que
     font Display et Debug — un f64 4.0 s'affiche « 4 », un Vec s'affiche « [1, 2, 3] »
     avec l'espace après la virgule, `str::len()` compte des octets, `strlen` s'arrête
     au NUL. 20 lignes comparées, 0 divergence ; les deux contre-épreuves ciblées
     (`--fausse=float`, `--fausse=debug`) font tomber exactement 1 et 2 programmes,
     ceux qui dépendent de la règle cassée.

     ⚠️ LES THREADS. Deux cibles viennent de la leçon 12 (mpsc, Arc<Mutex>). Elles ne
     sont retenues que parce que leur RÉSULTAT ne dépend pas de l'ordonnancement : un
     `join()` précède l'affichage, et la somme est commutative. Un programme dont la
     sortie dépendrait de l'ordre des `println!` concurrents serait à écarter.

     ⚠️ L'APOSTROPHE EST DROITE, ici et nulle part ailleurs dans les lots. Mesuré : la
     prose du cours rust compte 1 706 apostrophes DROITES pour 11 courbes — et les 11
     courbes étaient celles du premier jet de ce lot. Les textes suivent donc le cours
     qui les héberge, pas l'habitude des lots précédents. */
  rust: {
    dossier: 'rust', langue: 'rust', marqueur: '//', forme: 'bloc', fichierCite: 'extrait.rs',
    cibles: [
  { source: '02', page: '03', bloc: 'let mut y = 10;', ligne: 'y vaut',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Les deux println! n'affichent pas la même variable : celui qui reste caché porte sur y.",
            "y est déclaré mut : sa valeur a le droit de changer entre la déclaration et l'affichage.",
            "La valeur affichée est celle d'APRÈS l'incrément, pas celle de la déclaration."],
    pourquoi: "y est mutable et vaut 10 + 1 au moment du println!. Le println! lit la valeur courante, pas la valeur initiale.",
    label: 'Revoir « Variables, types et fonctions »' },

  { source: '05', page: '06', bloc: 'fn repeter(mot: String, fois: usize)', ligne: 'résultat',
    quoi: 'la ligne manquante', commentaires: 5,
    hints: ["La boucle tourne 3 fois, mais l'espace n'est ajouté que si i > 0.",
            "Il y a donc un espace de moins que de répétitions.",
            "Le libellé « résultat » du println! fait partie de la ligne affichée, comme le mot répété."],
    pourquoi: "repeter concatène 3 fois « écho » en n'insérant un espace qu'à partir du deuxième tour : deux espaces pour trois mots, aucun en tête ni en queue.",
    label: 'Revoir « La possession (ownership) »' },

  { source: '07', page: '08', bloc: "struct Extrait<'a>", ligne: 'Extrait :',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["split('.') coupe la chaîne AU point : le point n'est dans aucun segment.",
            "next() rend le PREMIER segment, pas la chaîne entière.",
            "Le libellé « Extrait : » du println! fait partie de la ligne affichée."],
    pourquoi: "split('.') découpe sur le point, qui n'appartient à aucun segment ; next() rend le premier. La struct ne fait qu'emprunter cette tranche de la String.",
    label: 'Revoir « Les durées de vie (lifetimes) »' },

  { source: '12', page: '13', bloc: 'tx.send(i).unwrap()', ligne: 'Somme =',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Le thread envoie les entiers de 1 à 5 — la borne est INCLUSE avec ..=.",
            "La boucle for recu in rx s'arrête quand le canal se ferme, donc rien n'est perdu.",
            "Le libellé « Somme = » vient du println! ; ce qui le suit est le total accumulé."],
    pourquoi: "1..=5 inclut 5 : le thread envoie 1, 2, 3, 4, 5. Quand tx est abandonné, le canal se ferme et la boucle du récepteur se termine, après avoir tout additionné.",
    label: 'Revoir « La concurrence sans peur »' },

  { source: '14', page: '15', bloc: 'fn somme(liste: &List)', ligne: 'somme =',
    quoi: 'la ligne manquante', commentaires: 0,
    hints: ["La liste chaînée contient trois valeurs, imbriquées les unes dans les autres.",
            "La fonction est récursive : chaque maillon ajoute sa valeur à la somme du reste.",
            "Nil rend 0 : il n'ajoute rien."],
    pourquoi: "La récursion additionne 1, 2 et 3, puis Nil rend 0. Box ne change rien au calcul : il ne fait que donner une taille connue au type récursif.",
    label: 'Revoir « Pointeurs intelligents et mutabilité intérieure »' },

  /* ⚠️ Ce n'est PAS la cible d'origine. Le premier choix visait « 30 » (la somme des
     pairs de 1 à 10, bloc `somme_pairs`) : le contrôle 6 l'a refusée, parce que « 30 »
     figure dans la page hôte — dans des COORDONNÉES SVG (`x1="230"`, `y="130"`). Le
     contrôle cherche une sous-chaîne brute dans tout le HTML : sur une réponse aussi
     courte, il ne peut pas distinguer une divulgation d'un attribut de schéma. Plutôt
     que d'affaiblir le garde-fou pour faire passer une cible, on change de cible — et
     une réponse d'un nombre nu était de toute façon la plus faible du lot. */
  { source: '16', page: '17', bloc: 'fn couper(v: &mut [i32], mid: usize)', ligne: '[1, 2]',
    /* Les 5 commentaires restants sont la DOC de la fonction et les justifications de
       sûreté (« les deux tranches ne se chevauchent pas ») : ils énoncent le contrat,
       jamais le contenu des tranches. Relus un par un. */
    quoi: 'la ligne manquante', commentaires: 5,
    hints: ["`couper` rend DEUX tranches, et le println! les affiche toutes les deux.",
            "La première tranche s'arrête à l'indice mid ; la seconde reprend là où l'autre s'arrête.",
            "Le format {:?} entoure chaque tranche de crochets ; le « | » vient du println!."],
    pourquoi: "couper découpe [1, 2, 3, 4] à l'indice 2 : la première tranche prend les 2 premiers éléments, la seconde le reste. Le bloc unsafe ne change pas le résultat, il rend seulement le découpage possible sans copie.",
    label: 'Revoir « Async, unsafe et performance »' },

  { source: '16', page: '18', bloc: 'fn sqrt(x: f64) -> f64;', ligne: 'sqrt(16.0)',
    quoi: 'la ligne manquante', commentaires: 2,
    hints: ['La fonction déclarée dans le bloc extern "C" est la sqrt de la bibliothèque C.',
            "Son type de retour est f64, même quand la racine tombe juste.",
            "Le Display d'un flottant n'écrit ni zéro final ni point inutile."],
    pourquoi: "sqrt(16.0) rend le f64 4.0, et le format {} (Display) écrit la représentation la plus courte : « 4 ». C'est {:?} (Debug) qui écrirait « 4.0 ».",
    label: 'Revoir « Async, unsafe et performance »' },

  /* ⚠️ Ce n'est PAS la cible d'origine non plus. Le premier choix visait « Some(10) »
     (bloc `get_unchecked`) : un contradicteur a montré que `Some(val)` est ÉCRIT dans
     le corps de la fonction, que le `10` vient de l'appel juste au-dessus, et que la
     deuxième ligne de sortie — « None », restée visible — montre déjà comment Debug
     écrit une Option. Trois voies de recopie pour une seule réponse. Le bloc FFI, lui,
     demande de savoir que `strlen` s'arrête AU NUL : le littéral compte 5 octets, la
     réponse en annonce 4, et aucune ligne visible ne le dit.
     ⚠️ ET L'INDICE 2 A FAILLI PUBLIER UN CARACTÈRE NUL. Il cite l'échappement Rust du
     terminateur ; écrit avec une séquence d'échappement JSON à quatre chiffres dans le premier jet, il devenait un
     VRAI caractère de contrôle une fois le JSON relu par la page, et l'apprenant lisait
     « le littéral écrit «  » ». Invisible à l'œil, invisible à verif-html : trouvé par
     un contradicteur qui cherchait les caractères de contrôle. La formulation ne cite
     donc plus l'échappement, elle nomme l'octet. */
  { source: '16', page: '19', bloc: 'fn strlen(s: *const c_char) -> usize;', ligne: 'strlen =',
    quoi: 'la ligne manquante', commentaires: 3,
    hints: ["strlen vient du C : elle ne connaît pas la longueur, elle la cherche.",
            "Une chaîne C se termine par un octet NUL, celui que le littéral ajoute à la fin.",
            "Ce terminateur marque la fin : il n'est pas compté dans le nombre d'octets rendu."],
    pourquoi: "strlen parcourt les octets jusqu'au NUL et rend le nombre d'octets qui le PRÉCÈDENT : le littéral en compte 5, la longueur rendue est donc plus courte d'une unité.",
    label: 'Revoir « Async, unsafe et performance »' },

  { source: '12', page: '20', bloc: 'for _ in 0..1000', ligne: 'Total =',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Chaque thread exécute la MÊME boucle : lis-en les bornes, elles sont exclusives.",
            "Le Mutex sérialise les incréments : aucun n'est perdu, aucun n'est compté deux fois.",
            "Le join() de tous les threads a lieu AVANT l'affichage."],
    pourquoi: "5 threads × 1000 incréments, chacun protégé par le Mutex : le total est exact et déterministe. Sans le verrou, le compilateur refuserait tout simplement le partage.",
    label: 'Revoir « La concurrence sans peur »' },

  { source: '14', page: '21', bloc: 'vue_b.borrow_mut().push(5)', ligne: '[1,',
    quoi: 'la ligne manquante', commentaires: 2,
    hints: ["Rc::clone ne duplique pas la valeur : il ajoute un propriétaire.",
            "RefCell autorise la mutation d'une valeur pourtant déclarée sans mut.",
            "Les deux push s'appliquent donc au même vecteur, dans l'ordre où ils sont écrits."],
    pourquoi: "Rc partage la valeur au lieu de la copier, et RefCell autorise la mutation malgré l'immuabilité apparente : les deux push s'ajoutent au même vecteur.",
    label: 'Revoir « Pointeurs intelligents et mutabilité intérieure »' }

  /* ÉCARTÉS, et pour des raisons qui valent d'être écrites :
     · `lecon-01` (« Scores : [10, 7, 15] ») : la sortie Debug est le littéral du code,
       à la virgule près — de la transcription, et la ligne se devinait en plus par
       élimination (3 println!, 2 lignes visibles). La leçon 01 n'offrait rien d'autre.
     · `lecon-07` bloc « plus_longue » (sortie « rouille ») et `lecon-05` bloc « consomme »
       (« je possède : a » puis « b ») : la réponse est un littéral du code, elle se
       recopie sans rien comprendre. Le contrôle 5 les refuse, et il a raison.
     · `lecon-14` bloc « Ressource » (Drop) : la sortie restante nomme déjà « libération
       de A », donc « libération de B » se déduit par simple symétrie — c'est la faute
       relevée sur cpp/lecon-04, une réponse obtenue par élimination.
     · `lecon-14` bloc « RefCell » qui PANIQUE à la fin (BorrowMutError) : la sortie
       annoncée précède la panique. Demander « ce que le programme affiche » d'un
       programme qui s'interrompt serait ambigu.
     · `lecon-16` blocs `tokio` : la sortie dépend d'un ordonnanceur asynchrone.
     · La leçon 11 reste sans exercice de prédiction : aucune leçon ANTÉRIEURE ne
       fournissait de cible non triviale, et prendre un bloc de la leçon 12 aurait
       divulgué la leçon suivante. */
    ]
  },

  /* ===================== B7c-3 — java (2026-08-26) =====================
     Même forme « bloc » que cpp et rust. Aucun JDK ici (`javac` et `java` : absents,
     vérifié) : `tools/preuves/rejoue-java.js` transpose les 28 programmes du cours qui
     portent une tête stricte et reproduit ce que Java IMPRIME — la division ENTIÈRE
     (17 / 4 vaut 4), `printf("%.2f")` qui arrondit, `print` qui n'ajoute pas de saut de
     ligne, un boolean écrit en toutes lettres. 56 lignes comparées.

     ⚠️ CE REJEU A TROUVÉ DEUX SORTIES FAUSSES, corrigées avant d'écrire un seul
     exercice : `lecon-03` annonçait « 0,0 / 0,1 / 1,0 » sous un `break externe` — c'est
     la sortie d'un `break` SIMPLE, et l'exemple contredisait son propre commentaire ;
     `lecon-04` annonçait 2 lignes là où le programme en affiche 5. Un exercice de
     prédiction bâti sur l'une des deux aurait publié une réponse fausse.

     ⚠️ LE GISEMENT TIENT DANS QUATRE LEÇONS (01, 03, 04, 06) sur 23, et la leçon 01
     n'offre que de la transcription (« Lea », « Hello, World! ») : les sources
     utilisables sont 03 et 06. L'apostrophe est DROITE — le cours en compte 2 269 pour
     0 courbe. La prose, elle, est ACCENTUÉE : les commentaires du code de ces deux
     cours sont volontairement sans accents, mais un énoncé lu par l'apprenant n'est
     pas du code. */
  java: {
    dossier: 'java', langue: 'java', marqueur: '//', forme: 'bloc', fichierCite: 'Main.java',
    cibles: [
  { source: '03', page: '04', bloc: 'int[] notes = {12, 8, 15, 18};', ligne: 'Total :',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Le for-each parcourt les quatre notes, une par une.",
            "total part de 0 et accumule chaque valeur.",
            "Le libellé « Total : » fait partie de la ligne affichée."],
    pourquoi: "Le for-each additionne les quatre notes du tableau. La concaténation colle le résultat derrière le libellé.",
    label: 'Revoir « Conditions et boucles »' },

  { source: '03', page: '05', bloc: 'long factorielle = 1;', ligne: '! =',
    quoi: 'la ligne manquante', commentaires: 2,
    hints: ["La boucle part de 2, pas de 1 : multiplier par 1 ne changerait rien.",
            "Elle s'arrête à n INCLUS, car la condition est i <= n.",
            "Le libellé reprend n, puis le point d'exclamation, puis le signe égal."],
    pourquoi: "factorielle accumule le produit des entiers de 2 à n. Le libellé affiche n, le point d'exclamation, puis le résultat.",
    label: 'Revoir « Conditions et boucles »' },

  { source: '03', page: '07', bloc: 'int compteur = 0;', ligne: 'do...while : 4',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["do...while teste sa condition APRÈS le tour, jamais avant.",
            "Regarde dans quel sens n varie à chaque passage, et à quelle condition la boucle continue.",
            "La ligne masquée est la dernière que le programme écrit avant de s'arrêter."],
    pourquoi: "Le corps s'exécute d'abord, la condition n > 3 n'est testée qu'ensuite : n est affiché tant qu'il reste au-dessus de 3, et la dernière valeur écrite est la dernière à satisfaire ce test.",
    label: 'Revoir « Conditions et boucles »' },

  { source: '03', page: '08', bloc: 'déclaré AVANT la boucle', ligne: 'j vaut',
    quoi: 'la ligne manquante', commentaires: 3,
    hints: ["j est déclaré AVANT la boucle : il survit à la boucle, contrairement à i.",
            "Le while ne fait qu'incrémenter j, sans rien afficher.",
            "Une boucle s'arrête quand sa condition devient fausse, pas avant."],
    pourquoi: "Le while incrémente j jusqu'à ce que la condition j < 3 devienne fausse ; j existe toujours après la boucle, puisqu'il a été déclaré avant elle.",
    label: 'Revoir « Conditions et boucles »' },

  { source: '06', page: '10', bloc: 'List<Forme> formes = List.of(', ligne: 'Aire totale',
    quoi: 'la ligne manquante', commentaires: 3,
    hints: ["Chaque objet calcule SON aire : la formule du cercle pour l'un, celle du carré pour l'autre.",
            "Le rayon vaut 2 et le côté 3 : additionne les deux aires.",
            "%.2f arrondit à deux décimales, et Locale.US impose le point comme séparateur décimal."],
    pourquoi: "La boucle appelle aire() sur chaque forme sans savoir laquelle elle tient : chaque classe applique sa propre formule. Le total est arrondi par %.2f, il n'est pas tronqué.",
    label: 'Revoir « Héritage et polymorphisme »' },

  { source: '06', page: '11', bloc: 'new Cercle("rouge", 1)', ligne: 'rouge, aire',
    quoi: 'la ligne manquante', commentaires: 3,
    hints: ["decrire() est écrit une seule fois dans la classe abstraite, mais aire() est redéfini par Cercle.",
            "Le rayon vaut 1 : l'aire du cercle se ramène à une constante bien connue.",
            "%.2f garde deux décimales, et Locale.US impose le point comme séparateur décimal."],
    pourquoi: "decrire() affiche la couleur, puis l'aire calculée par la sous-classe. Avec un rayon de 1, l'aire vaut pi, que %.2f arrondit à deux décimales.",
    label: 'Revoir « Héritage et polymorphisme »' },

  { source: '06', page: '12', bloc: 'Forme comparer(Forme autre)', ligne: 'Plus grande aire',
    quoi: 'la ligne manquante', commentaires: 2, masquer: ['aire ~ 12.57'],
    hints: ["comparer() rend l'OBJET dont l'aire est la plus grande, pas la valeur de l'aire.",
            "Calcule les deux aires avant de comparer : un cercle de rayon 2 face à un rectangle de 3 sur 3.",
            "%.2f arrondit le gagnant à deux décimales, et Locale.US impose le point comme séparateur décimal."],
    pourquoi: "comparer() est écrit une seule fois dans la classe abstraite, mais il appelle aire(), que chaque sous-classe redéfinit : c'est la forme la plus étendue qui est rendue, puis affichée arrondie.",
    label: 'Revoir « Héritage et polymorphisme »' }

  /* ÉCARTÉS, et pour des raisons qui valent d'être écrites :
     · toute la leçon 01 (« Lea », « Hello, World! », « Noah / Java / 2026 ») : la
       réponse est le littéral du code, à la guillemet près. De la transcription.
     · `lecon-03` bloc `switch (note / 4)` : le point est superbe (17 / 4 vaut 4 en
       division entière), mais les DEUX lignes de sortie sont écrites en clair dans le
       switch (`println("Excellent travail !")` et `yield "Très bien"`). Le contrôle 5
       les refuse, et il a raison.
     · `lecon-03` bloc des boucles étiquetées : sortie CORRIGÉE ce jour (voir plus
       haut), mais il ne lui reste que deux lignes dont l'une se déduit de l'autre.
     · `lecon-04` bloc `afficher` surchargé : les commentaires de l'appel annoncent la
       sortie en clair (« 1re version : Salut », « 2e version : Java x3 »).
     · `lecon-06` blocs `crier()` (« Wouf » / « Miaou ») et `instanceof` : les deux
       valeurs sont des littéraux du code.
     · ⚠️ `lecon-06` bloc `class Livre` — ÉCRIT, PUIS RETIRÉ PAR LA CONTRADICTION.
       « Livre[titre=Java 1re ed., isbn=978-1] » s'obtient en collant cinq littéraux
       tous visibles à l'écran (`"Livre[titre="`, le titre passé au constructeur,
       `", isbn="`, l'ISBN, `"]"`) : aucun calcul, aucune sémantique. C'est le motif
       « Scores : [10, 7, 15] » déjà sanctionné sur le lot rust. Et les indices
       achevaient le travail en tranchant la seule ambiguïté restante (« c'est le livre
       a, pas b ») puis en décrivant la règle d'assemblage. La ligne « true » du même
       bloc, elle, exigerait de comprendre l'égalité par ISBN — mais c'est une réponse
       binaire, donc une chance sur deux au hasard. Le bloc est abandonné. */
    ]
  },

  /* ===================== B7c-3 — csharp (2026-08-26) =====================
     ⚠️ `dotnet` est installé ici, mais il n'a QUE LE RUNTIME : `dotnet --list-sdks` ne
     rend rien, `--list-runtimes` rend Microsoft.NETCore.App 8.0.19. Sans SDK, pas de
     `dotnet run` : C# n'est pas plus compilable que le C++ ou le Rust, et le rejeu par
     transposition reste la seule voie. `tools/preuves/rejoue-csharp.js` couvre les 22
     programmes à tête stricte du cours — 33 lignes comparées, 0 divergence après
     correction de `lecon-04` (même sortie incomplète que son jumeau Java).

     Ce que le rejeu devait reproduire : un `decimal` ou un `double` sans partie
     décimale s'imprime SANS zéro final (120m donne « 120 »), `Console.Write` n'ajoute
     pas de saut de ligne, et une propriété `static` est partagée par toutes les
     instances. Apostrophe DROITE : le cours en compte 2 540 pour 3 courbes. */
  csharp: {
    dossier: 'csharp', langue: 'csharp', marqueur: '//', forme: 'bloc', fichierCite: 'Program.cs',
    cibles: [
  { source: '01', page: '02', bloc: 'Console.Write("Bonjour ");', ligne: 'Bonjour',
    quoi: 'la ligne manquante', commentaires: 0, masquer: ['termine la ligne ici'],
    hints: ["Write et WriteLine ne font pas la même chose : l'un termine la ligne, l'autre non.",
            "Compte les lignes de la sortie, puis compte les appels : il y en a plus que de lignes.",
            "La deuxième ligne affichée est déjà visible : tout ce qui vient avant elle tient donc sur la première."],
    pourquoi: "Console.Write n'ajoute pas de saut de ligne : les appels s'écrivent bout à bout tant qu'aucun WriteLine ne vient terminer la ligne. Quatre appels ne font ici que deux lignes.",
    label: 'Revoir « Découvrir C# et .NET »' },

  { source: '01', page: '03', bloc: 'var prenom = "Noah";', ligne: 'prochain',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Une interpolation n'accepte pas qu'un nom de variable : elle évalue une EXPRESSION.",
            "Regarde ce que contiennent exactement les accolades de la seconde ligne.",
            "Le point final appartient à la chaîne, il s'affiche aussi."],
    pourquoi: "Les accolades d'une chaîne interpolée évaluent une expression complète, pas seulement une variable : c'est le résultat du calcul qui s'affiche, et le point final fait partie du texte.",
    label: 'Revoir « Découvrir C# et .NET »' },

  { source: '05', page: '06', bloc: 'var compteur = new Compteur();', ligne: 'Valeur',
    quoi: 'la ligne manquante', commentaires: 4,
    hints: ["Le champ _valeur part de 0 : un int non initialisé vaut zéro en C#.",
            "Compte les appels à Incrementer() avant l'affichage.",
            "Afficher() reprend le libellé « Valeur : » suivi du champ."],
    pourquoi: "Un champ int vaut 0 par défaut ; chaque appel à Incrementer() l'augmente d'une unité, et Afficher() écrit sa valeur courante derrière son libellé.",
    label: 'Revoir « Classes, objets et propriétés »' },

  { source: '05', page: '07', bloc: 'public Joueur(string nom) : this(nom, 100) { }', ligne: 'PV',
    quoi: 'la ligne manquante', commentaires: 3,
    masquer: ['utilise les 100 PV par defaut', 'Constructeur surcharge qui CHAINE vers le principal'],
    hints: ["Deux constructeurs portent le même nom : c'est le NOMBRE d'arguments qui choisit lequel s'exécute.",
            "Le second n'a pas de corps, mais il en appelle un autre : regarde ce qu'il lui transmet.",
            "Decrire() est écrit une seule fois, et les deux joueurs passent par lui."],
    pourquoi: "Le constructeur à un seul argument délègue au constructeur principal en lui passant lui-même la valeur manquante : le second joueur reçoit donc cette valeur sans qu'aucun appel ne l'écrive.",
    label: 'Revoir « Classes, objets et propriétés »' },

  { source: '05', page: '08', bloc: 'public static int Total { get; private set; }', ligne: 'total =',
    quoi: 'la ligne manquante', commentaires: 4,
    hints: ["Total est static : il n'existe qu'une seule fois pour toute la classe.",
            "Id, lui, est propre à chaque objet, et prend la valeur de Total au moment de la construction.",
            "Deux utilisateurs sont créés : suis le compteur pas à pas, dans l'ordre du constructeur."],
    pourquoi: "Total est partagé par la classe entière, alors que chaque Id garde la valeur qu'avait le compteur au moment où son objet a été construit : l'un avance, les autres sont figés.",
    label: 'Revoir « Classes, objets et propriétés »' },

  { source: '05', page: '09', bloc: 'var compte = new Compte("Noah", 50m);', ligne: 'EUR',
    quoi: 'la ligne manquante', commentaires: 4,
    hints: ["Le solde initial est passé au constructeur, puis modifié par les appels suivants.",
            "Deposer ajoute, Retirer soustrait : suis les appels dans leur ordre.",
            "Un decimal sans partie décimale s'affiche sans zéro final : ni virgule, ni centimes."],
    pourquoi: "Le solde n'est modifiable que par les méthodes de la classe, qui l'ajustent tour à tour. Un decimal dont la partie décimale est nulle s'imprime sans zéro final.",
    label: 'Revoir « Classes, objets et propriétés »' },

  { source: '05', page: '10', bloc: 'var r = new Rectangle(3, 4);', ligne: 'Aire',
    quoi: 'la ligne manquante', commentaires: 1,
    hints: ["Aire n'est pas un champ : c'est une propriété calculée à chaque lecture.",
            "Elle combine les deux dimensions passées au constructeur, dans l'ordre où il les range.",
            "Les deux dimensions sont des double, mais un double entier s'affiche sans zéro final."],
    pourquoi: "Aire est recalculée à la volée à partir des deux dimensions. Le résultat est un double, mais C# n'écrit pas le zéro final d'un double sans partie décimale.",
    label: 'Revoir « Classes, objets et propriétés »' }

  /* ÉCARTÉS, et pour des raisons qui valent d'être écrites :
     · `lecon-01` blocs « Bonjour, C#! », « Mon premier programme C# », la carte de
       visite : la sortie est le littéral passé à WriteLine. De la transcription.
     · `lecon-05` blocs `init` (« Aria niveau 5 »), constructeur primaire
       (« localhost:8080 »), `init`-only (« Le Petit Prince — Saint-Exupery ») et
       `Produit` (« Souris a 25 EUR ») : tous les morceaux de la réponse sont des
       littéraux voisins. `Etudiant` (« Noah : 17/20 ») est du même ordre — 17 et 20
       sont écrits à deux lignes de là.
     · `lecon-09` : les trois blocs affichent une chaîne écrite en clair dans le
       `catch` ou dans le constructeur de l'exception.
     · `lecon-12` (async) : sa « sortie » contient « (2 secondes plus tard) », qui est
       une GLOSE et non ce que le programme imprime. Demander une ligne d'une sortie
       partiellement fictive serait ambigu.
     · `lecon-04` (grille) : sortie CORRIGÉE ce jour, mais ses cinq lignes sont soit
       des dimensions annoncées en commentaire, soit la transcription du littéral. */
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
/* La typographie du site : espace INSÉCABLE avant les ponctuations doubles. Mesuré par
   un contradicteur sur les 10 pages hôtes du lot rust — les `<details>` voisins en
   comptent 4 pour 0 espace simple, la prose de ces pages 398 pour 122, et l'énoncé
   généré ici respectait déjà la règle (33 `&nbsp;`, 0 simple) alors que la réponse
   rédigée l'ignorait : deux plumes dans un même exercice. À appliquer APRÈS enc(),
   sur du texte déjà échappé, et jamais sur du code. */
function typo(s) {
  return s.replace(/ ([:;!?»])/g, '&nbsp;$1').replace(/« /g, '«&nbsp;');
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
  /* ⚠️ LES ESPACES AUTOUR DU « = ». `normExo` réduit les SUITES d'espaces, il n'égalise
     pas « Somme = 15 » et « Somme=15 » : un apprenant qui a parfaitement prédit la
     valeur était refusé pour une habitude de frappe. Mesuré par un contradicteur sur
     5 des 11 cibles rust (« Somme=15 », « Total=5000 », « somme=6 », « sqrt(16.0)=4 »).
     C'est la même correction que celle faite en B7c-1 sur la virgule des listes, et
     elle est du même ordre : une tolérance de SAISIE, jamais de contenu — la valeur
     annoncée doit être exacte, seule sa mise en espace est libre. */
  if (v.indexOf('=') >= 0) {
    add(v.replace(/\s*=\s*/g, '='));
    add(sansG.replace(/\s*=\s*/g, '='));
  }
  /* ⚠️ ET L'ESPACE FRANÇAISE AVANT LES DEUX-POINTS. Même raison, et même mesure : sur
     « Extrait : Appelez-moi Ismaël », un apprenant qui a tout compris mais tape à
     l'anglo-saxonne (« Extrait: … ») était refusé. Le juge du site ignore déjà la
     CASSE et les ACCENTS : refuser une espace de frappe pendant qu'on accepte
     « SOMME = 15 » n'était pas une exigence, c'était une incohérence. On ne touche
     qu'à l'espace AVANT la ponctuation, celle qui est une convention typographique
     française et non un caractère produit par le programme. */
  if (/\s[:;]/.test(v)) {
    add(v.replace(/\s+([:;])/g, '$1'));
    add(sansG.replace(/\s+([:;])/g, '$1'));
  }
  /* ⚠️ ET LA TOLÉRANCE ÉTAIT ASYMÉTRIQUE, ce qu'un contradicteur a mesuré frappe par
     frappe sur 13 des 15 cibles de B7c-3 : les règles ci-dessus n'enlèvent QUE l'espace
     d'AVANT le séparateur, jamais celle d'APRÈS. « Total: 53 » passait, « Total :53 »
     échouait ; « 5!=120 » passait, « 5! =120 » échouait ; « Aire=12 » passait,
     « Aire =12 » échouait. Un apprenant qui a parfaitement prédit la valeur était donc
     renvoyé sur un demi-espace, au hasard de son habitude de frappe.
     On énumère désormais les QUATRE combinaisons (espace avant retirée ou non × espace
     après retirée ou non), pour les séparateurs qui ne portent pas de sens : `:` `;`
     `=` `|`. La VALEUR reste exacte — seule sa mise en espace est libre, comme pour la
     virgule des listes en B7c-1 et le `=` en B7c-2. On ne touche pas au point décimal :
     « 21,57 » n'est PAS ce que Locale.US imprime, et l'accepter serait valider une
     sortie que le programme ne produit pas. */
  var SEP = /[:;=|]/;
  if (SEP.test(v)) {
    [v, sansG].forEach(function (base) {
      add(base.replace(/[ \t]+([:;=|])/g, '$1'));                 // sans l'espace d'avant
      add(base.replace(/([:;=|])[ \t]+/g, '$1'));                 // sans l'espace d'après
      add(base.replace(/[ \t]*([:;=|])[ \t]*/g, '$1'));           // sans aucune des deux
    });
  }
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
      var citeB = [], coupes = 0, masques = 0, apres = 0, restants = [], contigu = true;
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
        } else if (e > iFin && COMMENTE.test(lg) && contigu) {
          /* Après la zone de sortie, une ligne entièrement commentée se lit comme la
             SUITE de la sortie — l'énoncé vient de dire que la sortie est écrite en
             commentaire à la fin. cpp/lecon-17 met deux lignes d'explication juste
             sous « // Sortie : … » : l'apprenant croit que la sortie fait trois
             lignes. Elles sortent du code cité ; l'explication reste dans la réponse. */
          apres++;
          continue;
        } else if (e > iFin) {
          /* ⚠️ TROU DU CONTRÔLE 11, trouvé en écrivant le lot `csharp` : l'inventaire
             (c) ne regardait que les lignes situées AVANT la zone de sortie. Or C#
             écrit couramment son programme, PUIS sa sortie, PUIS la classe qui le fait
             marcher (`lecon-05` : 10 blocs sur 10 dans ce cas) — tout le corps de la
             classe échappait donc au compte, et un commentaire y énonçant la réponse
             serait passé inaperçu. Le contrôle couvre désormais TOUT le code cité. */
          /* ⚠️ ET LA COUPE NE DOIT PLUS COURIR JUSQU'AU BOUT DU BLOC. La règle « une
             ligne commentée après la sortie se lit comme sa suite » ne vaut que si
             elle SUIT la sortie sans rien entre les deux — le cas de cpp/lecon-17. En
             C#, la sortie est écrite au MILIEU du bloc et la classe vient après :
             appliquée sans condition de contiguïté, la règle effaçait « Constructeur
             principal » et « Constructeur surchargé qui CHAÎNE vers le principal »
             (csharp/lecon-05), c'est-à-dire du commentaire de CODE, à 15 lignes de la
             sortie. `contigu` retombe dès la première ligne de code rencontrée. */
          if (lg.trim()) contigu = false;
          /* ⚠️ ET LE MASQUAGE DOIT COURIR ICI AUSSI. `masquer` ne s'appliquait qu'aux
             lignes situées AVANT la sortie — or en C# la classe vient APRÈS, et c'est
             là qu'un contradicteur a trouvé « Constructeur surchargé qui CHAÎNE vers le
             principal » (csharp/lecon-05), qui énonce à lui seul le raisonnement de
             l'exercice. Un motif déclaré et introuvable reste une FAUTE (contrôle plus
             bas) : on ne masque pas au hasard, on masque ce qu'on a désigné. */
          for (var q3 = 0; q3 < (t.masquer || []).length; q3++) {
            var p3 = lg.indexOf(t.masquer[q3]);
            if (p3 < 0) continue;
            var c3 = lg.lastIndexOf(lot.marqueur, p3);
            if (c3 < 0) continue;
            masques++;
            if (COMMENTE.test(lg)) { lg = null; break; }
            lg = lg.slice(0, c3).replace(/\s+$/, '');
          }
          if (lg === null) continue;
          var pc2 = lg.indexOf(lot.marqueur);
          if (pc2 >= 0 && lg.slice(pc2 + lot.marqueur.length).trim()) restants.push(lg.slice(pc2 + lot.marqueur.length).trim());
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

    /* 12. contrôle : LE LIBELLÉ DU LIEN DOIT ÊTRE LE VRAI TITRE DE LA LEÇON SOURCE.
       Rien ne le vérifiait, et un contradicteur a montré ce que ça coûte : les 7 cibles
       `csharp` renvoyaient à « Classes et objets » et « Découvrir C# », alors que les
       `<h1>` disent « Classes, objets et propriétés » et « Découvrir C# et .NET ». Le
       premier est même le titre de `java/lecon-05` — le libellé avait été emprunté au
       COURS JUMEAU, écrit le même jour par le même outil. L'apprenant qui clique après
       dix essais ratés arrive sur une leçon dont le nom ne correspond pas à ce qu'on
       lui a promis. On compare au `<h1>` du fichier, pas à une table : c'est le titre
       que la page affiche vraiment.

       ⚠️ ET LE CONTRÔLE DÉPEND DE LA DESTINATION, sinon il condamne une convention
       parfaitement saine. Quand la source et la page hôte sont la MÊME leçon (les lots
       `ruby` et `kotlin`), le lien renvoie plus haut dans la page courante et cite donc
       une SECTION : c'est l'usage des 145 liens préexistants de ces cours. Quand elles
       diffèrent (cpp, rust, java, csharp), le lien mène à une AUTRE leçon et doit
       porter SON titre. Les deux cas sont vérifiés, chacun contre le bon niveau de
       titre. */
    function titreNu(x) { return dec(x).replace(/<[^>]*>/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }
    var titres = [], mt2, RE_TITRE = /<h([123])[^>]*>([\s\S]*?)<\/h\1>/g;
    while ((mt2 = RE_TITRE.exec(srcBloc))) titres.push(titreNu(mt2[2]));
    var mLabel = String(t.label || '').match(/«\s*([\s\S]*?)\s*»/);
    var vise = mLabel ? titreNu(mLabel[1]) : null;
    /* Un libellé de SECTION est souvent l'abrégé du titre complet — « La boucle for »
       pour « La boucle for : sur les éléments, pas sur un compteur » (kotlin/lecon-03).
       Le préfixe est donc accepté ; « Classes et objets » pour « Classes, objets et
       propriétés » n'en est pas un, et c'est exactement la faute qu'on cherche. */
    if (titres.length && vise && !titres.some(function (x) { return x === vise || x.indexOf(vise) === 0; })) {
      fautes.push(id + ' : le libellé du lien dit « ' + vise + ' » — aucun titre de la leçon source ' +
        'ne porte ce nom ni ne commence par lui (titre de la leçon : « ' + titres[0] + ' »)');
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
        ? '<p><strong>Sans exécuter le code</strong>&nbsp;: la sortie complète du programme est écrite en commentaire, mais <strong>une de ses lignes a été remplacée par <code>' +
          enc(lot.marqueur) + '&nbsp;?</code></strong>. Quelle est cette ligne&nbsp;?</p>'
        /* ⚠️ « À LA FIN DU CODE » ÉTAIT FAUX UNE FOIS SUR DEUX, et c'est un
           contradicteur qui l'a vu : le bloc « // Sortie : » est souvent écrit À
           L'INTÉRIEUR de main(), avant l'accolade fermante. Mesuré le 2026-08-26 :
           2 des 11 pages rust et 5 des 10 pages cpp déjà publiées portaient donc une
           consigne de recherche inexacte. La formule ne parle plus d'un emplacement,
           mais de ce qui est vrai partout — la sortie est écrite EN COMMENTAIRE. */
        : '<p><strong>Sans exécuter le code</strong>&nbsp;: ce programme n\'affiche qu\'une seule ligne, et elle a été remplacée par <code>' +
          enc(lot.marqueur) + '&nbsp;?</code> dans le commentaire de sortie. Quelle est-elle&nbsp;?</p>');
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
      (t.pourquoi ? ' ' + typo(enc(t.pourquoi)) : '') + '</p></details></div>';

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
