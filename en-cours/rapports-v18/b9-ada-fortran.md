# Rapport V18 — case B9, lot 6 : les cours `ada` et `fortran` (copie `b9-ada-fortran`, branche `v18/b9-ada-fortran`)

Copie de travail `D:\test-claude-b9-ada-fortran`, partie de `c5b3e9d`. Part traitée : les **28 « Cas réel »**
des cours `ada` (14, un par leçon) et `fortran` (14, un par leçon). Scripts et pièces dans
`scratchpad/b9-ada-fortran/` (ignoré par git) : `cas-ada.js` et `cas-fortran.js` (les 28 titres et corps),
`appliquer.js` (remplace du titre de l'encadré au `</div></div>` final ; refuse un titre absent ou multiple,
refuse tout CR, prouve que les octets hors de l'encadré sont identiques), `dump.js`, `options.js`,
`godbolt.py` (compile et exécute sur Compiler Explorer, Ada ou Fortran selon l'extension), les essais
`t-*.adb` et `t-*.f90`, `pdfgrep.py`, et les documents ouverts (PDF et textes extraits).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **14 hors de la règle à 0** pour `ada`
et de **14 à 0** pour `fortran` ; sur les 28 cas trouvés, **0 était VRAI tel quel** : 4 INEXACTS sur leur sujet,
3 sujets réels dont le foyer est ailleurs, 21 INVÉRIFIABLES (récits anonymes, usages généraux, affirmations
sans source) ; **24 remplacés** par un cas réel daté et sourcé sur la même notion, **4 corrigés sur leur
sujet** (`ada/07`, `ada/13`, `fortran/06`, `fortran/09`), **0 renommé « Scénario »**.

**Commits** (branche `v18/b9-ada-fortran`) : `1e7b7f0` (ada, 14 cas), `1c5ca2f` (fortran, 14 cas),
`ce4cd8b` (ada/07 : 37 s après l'allumage, 30 s après le décollage), puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, du `<p class="callout__title">` au `</div></div>` (type `note`,
  icône, structure gardés). Aucun intertitre `<h2>`/`<h3>` « Cas réel » n'est collé au-dessus d'un encadré
  dans ces deux cours (les `<h2>` voisins — « Où Ada travaille », « Contrats et preuve », « Pourquoi le temps
  réel adore Ada » — sont des sections de la leçon, suivies d'un paragraphe) : rien à renommer.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? » et dans « » ; `=>` écrit `=&gt;` dans le `<code>`.
- Longueur du corps (hors titre et source) : 146 à 205 mots, 220 pour Ariane 5 (`ada/07`, la plus chargée en
  corrections) ; les originaux, plus vagues, en faisaient 60 à 160.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL),
  puis inscrit au fichier commun `b9-reservations.txt` (29 lignes : `ada/lecon-09` a d'abord reçu le CubeSat,
  passé ensuite en `ada/lecon-14` ; la dernière ligne d'`ada/lecon-09` fait foi : GNAT dans GCC 3.1).
  Sujets **écartés** : Ariane 5 hors de son foyer (`ada/09`, et la mention d'`ada/01`), Mars Climate Orbiter
  (foyer `tests/lecon-12`, que racontait `ada/02`), le Patriot de Dhahran (foyer `asm/lecon-09`, que
  racontait `fortran/02`). Le cours `fortran` racontait BLAS/LAPACK sous NumPy dans **cinq** leçons
  (01, 04, 09, 11, 13) : gardé une fois (`fortran/09`, la section « Les grandes bibliothèques »).
  `doublons.js` : toujours **2** sources partagées entre cours (les deux légitimes).
- **Comportements rejoués** sur Compiler Explorer, **GNAT 16.2** (`gnat162`) et **gfortran 16.2**
  (`gfortran162`), exécution comprise :
  - Ada : `D := D + T` (Length + Time, `System.Dim.Mks`) refusé, « both operands for operation "+" must have
    same dimensions », [L] et [T] ; `case` énuméré sans `Yellow` refusé (« missing case value: "Yellow" »),
    `when Red .. Blue` compile et prend `Yellow` ; fonction `Suivant (Compteur : in out Integer)` : compile en
    `-gnat2012`, refusée en `-gnat2005` (« functions can only have "in" parameters ») ;
    `Bounded_Vectors`, `Capacity => 3` : quatrième `Append` → `Capacity_Error` ; `pragma Profile (Ravenscar)` :
    tâche locale à entrée refusée (`No_Task_Hierarchy`, `Max_Task_Entries = 0`) ; `Get_Line` procédure sur
    une ligne de 33 caractères et un `String (1 .. 32)` : `Last = 32` puis le 33ᵉ seul ; la fonction rend 33.
  - Fortran : sans `implicit none`, `kompte = 2.7` affiche 2 ; avec, « Symbol 'kompte' … has no IMPLICIT
    type » ; `7/3, -7/3, 7/-3, -7/-3` = 2, -2, -2, 2 et `mod` = 1, -1, 1, -1 (la table du Rationale de C99) ;
    format fixe `DO 10 I = 1.10` : une seule passe, `DO10I = 1.10000002`, refusé avec `IMPLICIT NONE` ;
    `reshape` 10×10 : `b(1,2) = 11`, `b(2,1) = 2` ; subroutine externe qui modifie la constante 2 :
    SIGSEGV à l'exécution, refus à la compilation avec `intent(inout)` (« Non-variable expression in variable
    definition context ») et `intent(in)` ; `write` de 3 réels : 20 octets en séquentiel non formaté,
    12 en `stream` ; `SELECT TYPE` de l'exemple de Reid : le bloc `CLASS IS (POINT)` s'exécute ;
    `a = [a, 4, 5]` après `allocate(a(3))` : 5 éléments.
- **Mots d'options de QCM** (`lexique-diff.js`, base `c5b3e9d`) : 8 écarts sur `ada` au premier jet, ramenés à
  **0** (« calcul » remis dans une phrase exacte de Whitaker — systèmes d'armes, « non du calcul scientifique » ;
  « toutes », « systèmes », « embarqués » remis dans des phrases exactes ; « opérateur », « effets »,
  « exceptionnels », « caractère » retirés). 9 écarts sur `fortran`, ramenés à **2**, tous deux sur
  `fortran/lecon-12` et sur la même question (« Qu'est-ce qu'une image ? ») : **« source »** entre par la
  classe `cas-reel__source` (inévitable ; le distracteur « Une copie de sauvegarde du code source » le
  porte) ; pour égaliser, **« physique »**, mot d'un autre distracteur (« Un cœur physique du processeur »),
  entre dans une phrase exacte de la source (N1824 : « the number of images may be the same as the number of
  physical processors, or it may be more, or it may be less »). « bibliothèques » et « LAPACK » (bonne
  réponse de `fortran/01`) sont remis par une phrase vérifiée sur les sources de Reference-LAPACK
  (`DGEMM` et `DGESV` déclarent `IMPLICIT NONE`). Cliquets QCM verts.

## Cas par cas — `ada`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/ada/lecon-01.html#1` | INVÉRIFIABLE — usage général (« un métro… un avion… c'est souvent du code Ada ») ; raconte aussi Ariane 5, foyer `ada/07` | remplacé par : la naissance d'Ada au DoD (HOLWG, compétition, « Green », MIL-STD-1815) | Cas réel — Le DoD choisit « Green », qui devient Ada (1979) | http://archive.adaic.com/pol-hist/history/holwg-93/holwg-93.htm (Whitaker, *ACM SIGPLAN Notices* 28(3), mars 1993 ; https refuse, http répond) |
| `pages/ada/lecon-02.html#1` | sujet réel, foyer ailleurs — Mars Climate Orbiter (foyer `tests/lecon-12`, sourcé au F1 du V16) ; non revérifié | remplacé par : l'analyse dimensionnelle de GNAT (aspects `Dimension_System`, `Dimension`, `System.Dim.Mks`) | Cas réel — GNAT vérifie les unités physiques (2012) | https://www.adacore.com/blog/gem-136-how-tall-is-a-kilogram (12 novembre 2012) ; https://gcc.gnu.org/onlinedocs/gnat_ugn/Performing-Dimensionality-Analysis-in-GNAT.html ; Compiler Explorer |
| `pages/ada/lecon-03.html#1` | INVÉRIFIABLE — usage général (machine à états d'un métro, « beaucoup d'accidents ») ; affirme que `when others` est « la réponse sûre », ce que le guide de style Ada 95 nuance | remplacé par : la règle 5.6.3 de l'*Ada 95 Quality and Style Guide* (limiter `others`, pas de plages d'énumération) | Cas réel — le guide de style d'Ada 95 et le « when others » (1995) | https://www.adaic.org/resources/add_content/docs/95style/html/sec_5/5-6-3.html ; https://www.adaic.org/resources/add_content/docs/95style/html/cover.html (octobre 1995, SPC-94093-CMC) ; Compiler Explorer |
| `pages/ada/lecon-04.html#1` | INVÉRIFIABLE — usage général (DO-178C, « revues ») | remplacé par : l'AI05-0143-1, paramètres `in out` pour les fonctions (Ada 2012) | Cas réel — l'AI05-0143 ouvre les fonctions aux paramètres in out (2010) | http://www.ada-auth.org/cgi-bin/cvsweb.cgi/ai05s/ai05-0143-1.txt?rev=1.5&raw=N (reçue le 15/02/2009, ARG 13/06/2009, WG 9 18/06/2010) ; Compiler Explorer |
| `pages/ada/lecon-05.html#1` | INVÉRIFIABLE (verdict de B2, confirmé) — illustration générale de l'embarqué | remplacé par : les conteneurs bornés d'Ada 2012 (discriminant `Capacity`, `Capacity_Error`) | Cas réel — Ada 2012 et ses conteneurs bornés (2012) | https://www.ada-europe.org/manuals/Rationale_2012.pdf (John Barnes, Ada-Europe 2013 ; pages 36 et 169 à 174 du PDF, § 8.1-8.2 ; « approved late in 2012 », page 11 du PDF) ; Compiler Explorer |
| `pages/ada/lecon-06.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe stocke un identifiant client… ») | remplacé par : Parnas, le masquage d'information (index KWIC, deux découpages) | Cas réel — David Parnas et le masquage d'information (1972) | http://web.archive.org/web/20260801121819/https://dl.acm.org/doi/pdf/10.1145/361598.361623 (l'original de l'ACM renvoie 403 ; copie de l'Internet Archive, *CACM* 15(12), p. 1053-1058) |
| `pages/ada/lecon-07.html#1` | INEXACT — foyer gardé. (1) l'exception « non rattrapée » : la **spécification** imposait d'arrêter le processeur pour toute exception ; (2) « puis son jumeau de secours » : le SRI de secours s'était arrêté **avant**, un cycle de 72 ms plus tôt ; (3) « un demi-milliard de dollars » : **absent** du rapport ; (4) la variable est BH, le biais horizontal, « liée à » la vitesse horizontale ; (5) « trente-sept secondes après le décollage » : le § 3.2 dit 37 s après le début de la séquence d'allumage du moteur principal, **30 s après le décollage** | corrigé sur son sujet, relu phrase à phrase au rapport (commits `1e7b7f0` puis `ce4cd8b` pour le point 5) | Cas réel — Ariane 5, vol 501 (1996) | https://sci.esa.int/web/cluster/-/38889-ariane-501-report-by-board-of-inquiry → PDF scanné de l'ESA (pages 1 à 3 vues en image : titre, 19 juillet 1996, § 2.1) ; texte lu dans la copie https://people.eecs.berkeley.edu/~demmel/ma221_Fall04/ariane5rep.html (copie tierce, identique sur les pages comparées) |
| `pages/ada/lecon-08.html#1` | INVÉRIFIABLE en l'état — Météor (ligne 14) réel, mais « SPARK pour les parties critiques », les objets protégés et Ravenscar n'ont aucune source ouverte (l'article de Behm et al., FM'99, n'a pu être ouvert : Springer redirige vers une authentification) ; et le cas n'illustrait pas les tâches | remplacé par : le profil Ravenscar (IRTAW 8, 1997 ; restrictions, pas de rendez-vous) | Cas réel — le profil Ravenscar (1997) | https://www.open-std.org/jtc1/sc22/WG9/n424.pdf (Burns, Dobbing, Vardanega, York YCS-2003-348, janvier 2003) ; Compiler Explorer |
| `pages/ada/lecon-09.html#1` | sujet réel, foyer ailleurs — Ariane 5 une seconde fois (foyer `ada/07`) ; et INEXACT : « ≈ 370 millions de dollars » absent du rapport Lions, « trente-sept secondes après le décollage » (30 s, § 3.2), « contrôle de bornes désactivé » imprécis | remplacé par : GNAT versé dans GCC 3.1, front end Ada écrit en Ada, règle de nommage `.ads`/`.adb` | Cas réel — GNAT entre dans GCC (2002) | https://gcc.gnu.org/gcc-3.1/changes.html ; https://gcc.gnu.org/gcc-3.1/ (15 mai 2002) ; https://gcc.gnu.org/install/prerequisites.html ; https://gcc.gnu.org/onlinedocs/gnat_ugn/File-Naming-Rules.html |
| `pages/ada/lecon-10.html#1` | INVÉRIFIABLE — usage général ; « Ada.Text_IO repose sur Ada.Sequential_IO et Ada.Direct_IO » douteux (non vérifié), tampons circulaires « dans l'avionique » sans source | remplacé par : la bibliothèque générique d'Ada de Musser et Stepanov (tri par fusion abstrait sur `Next`, `Set_Next`, `Is_End`) | Cas réel — Musser et Stepanov, une bibliothèque générique pour Ada (1987) | https://www.stepanovpapers.com/p216-musser.pdf (scan de l'ACM, 1987) ; https://www.stepanovpapers.com/ (référence : *Proceedings of the 1987 annual ACM SIGAda international conference on Ada*, p. 216-225) |
| `pages/ada/lecon-11.html#1` | INVÉRIFIABLE — illustration générale (poste d'aiguillage) | remplacé par : le Rationale d'Ada 95, types `tagged` et types de classe | Cas réel — Ada 95 et les types étiquetés (1995) | https://www.adaic.org/resources/add_content/standards/95rat/rat95html/rat95-p2-4.html ; …/rat95-preface.html (« The Ada 9X Design Team, January 1995 ») ; …/rat95-foreword.html (Intermetrics) |
| `pages/ada/lecon-12.html#1` | INVÉRIFIABLE — récit anonyme (« Une équipe débutant en Ada… ») | remplacé par : l'AI95-00301, fonction `Get_Line` et `Text_IO.Unbounded_IO` (Ada 2005) | Cas réel — Get_Line devient une fonction dans Ada 2005 (2004) | http://www.ada-auth.org/cgi-bin/cvsweb.cgi/ais/ai-00301.txt?rev=1.21&raw=N (ARG 12/12/2003, WG 9 18/06/2004) ; Compiler Explorer |
| `pages/ada/lecon-13.html#1` | INEXACT — iFACTS réel, mais « écrit en SPARK » (SPARK 2005 + Ada complet + C MISRA), « l'absence d'erreurs est prouvée » (98,76 % automatique, 1 701 par lemme, 200 seulement relues), « SPARK sert aussi dans l'automobile… noyaux, cryptographie » sans source | corrigé sur son sujet, avec les chiffres de l'industriel | Cas réel — iFACTS, le contrôle aérien britannique (2011) | https://sos-vo.org/system/files/sos_files/Going_Large_with_Formal_Methods_on_iFACTS.pdf (Chapman, Altran UK) ; https://sos-vo.org/node/12230 (HCSS 2014) |
| `pages/ada/lecon-14.html#1` | INVÉRIFIABLE — récit anonyme (« Un ingénieur écrit en une heure… ») | remplacé par : Vermont Lunar CubeSat, logiciel de vol en SPARK 2005 | Cas réel — Vermont Lunar CubeSat, un satellite en SPARK (2013) | https://sigada.hosting.acm.org/conf/hilt2016/paper-Brandon.pdf (Brandon et Chapin, HILT 2016) |

## Cas par cas — `fortran`

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/fortran/lecon-01.html#1` | INVÉRIFIABLE en partie — produits nommés (BLAS/LAPACK sous NumPy, MATLAB, R, Julia) sans source ; même sujet dans 4 autres leçons du cours ; NumPy peut aussi embarquer des versions en C (sa documentation) | remplacé par : MIL-STD-1753 et `IMPLICIT NONE` (la section où se trouve l'encadré) | Cas réel — IMPLICIT NONE naît dans une norme militaire (1978) | https://wg5-fortran.org/ARCHIVE/mil_std_1753.html ; https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub69-1.pdf (ANSI X3.9-1978, § 4.1.2, approuvée le 3 avril 1978) ; https://raw.githubusercontent.com/Reference-LAPACK/lapack/master/BLAS/SRC/dgemm.f ; https://raw.githubusercontent.com/Reference-LAPACK/lapack/master/SRC/dgesv.f ; Compiler Explorer |
| `pages/fortran/lecon-02.html#1` | sujet réel, foyer ailleurs — Patriot de Dhahran (foyer `asm/lecon-09`, tranché au B7) ; non revérifié | remplacé par : le Rationale de C99, la division entière tronquée vers zéro « comme en Fortran » | Cas réel — C99 aligne sa division entière sur Fortran (1999) | https://www.open-std.org/jtc1/sc22/wg14/www/C99RationaleV5.10.pdf (§ 6.5.5, § 7.20.6.2, table 7.2 ; « adopted in 1999 », p. 8) ; Compiler Explorer |
| `pages/fortran/lecon-03.html#1` | INVÉRIFIABLE (verdict de B2, confirmé) — illustration générale (grille d'un modèle météo) | remplacé par : le `DO` à point au lieu de virgule dans un programme d'orbite de la NASA (été 1963) | Cas réel — un point au lieu d'une virgule dans un DO (1963) | https://catless.ncl.ac.uk/risks/9/54 (RISKS 9.54, 12 décembre 1989) ; Compiler Explorer (format fixe) |
| `pages/fortran/lecon-04.html#1` | INVÉRIFIABLE — BLAS/LAPACK (doublon de 01) et « même des outils modernes s'y conforment » sans source | remplacé par : le manuel FORTRAN de l'IBM 704, tableaux rangés « columnwise » | Cas réel — le premier manuel FORTRAN range les tableaux par colonnes (1956) | https://archive.computerhistory.org/resources/text/Fortran/102649787.05.01.acc.pdf (15 octobre 1956, chap. 2 « Arrangement of Arrays in Storage ») ; https://www.softwarepreservation.org/projects/FORTRAN (notice) ; Compiler Explorer |
| `pages/fortran/lecon-05.html#1` | INVÉRIFIABLE — anecdote générale (« sur certains compilateurs », la valeur de 2 changée), sans source | remplacé par : la règle 15.9.3.2 de FORTRAN 77 (une constante passée en argument ne doit pas être redéfinie), et ce qu'en font aujourd'hui `intent` et les interfaces | Cas réel — FORTRAN 77 et la constante passée en argument (1978) | https://nvlpubs.nist.gov/nistpubs/Legacy/FIPS/fipspub69-1.pdf (§ 15.9.3.2, p. 298-299 du PDF) ; https://www.wg5-fortran.org/ARCHIVE/Fortran77.html (texte, même clause) ; Compiler Explorer |
| `pages/fortran/lecon-06.html#1` | INEXACT — « passer de gfortran 12 à gfortran 13 oblige à tout recompiler » : faux, GCC 8 à 14 partagent un format (notes de GCC 15) ; le message « wrong version of module » n'a pas été vérifié | corrigé sur son sujet (le format des `.mod` de gfortran), daté et sourcé : GCC 4.9, 5 et 15 | Cas réel — GCC 4.9 change le format des fichiers .mod (2014) | https://gcc.gnu.org/gcc-4.9/changes.html ; https://gcc.gnu.org/gcc-4.9/ (4.9.0 : 22 avril 2014) ; https://gcc.gnu.org/gcc-5/changes.html ; https://gcc.gnu.org/gcc-15/changes.html ; https://gcc.gnu.org/gcc-15/ (15.1 : 25 avril 2025) |
| `pages/fortran/lecon-07.html#1` | INVÉRIFIABLE — usage général (fichiers de reprise) | remplacé par : GCC 4.2, marqueurs d'enregistrement de 4 octets, `-frecord-marker=8`, accès `stream` | Cas réel — GCC 4.2 change les marqueurs des fichiers non formatés (2007) | https://gcc.gnu.org/gcc-4.2/changes.html ; https://gcc.gnu.org/gcc-4.2/ (4.2.0 : 13 mai 2007) ; Compiler Explorer |
| `pages/fortran/lecon-08.html#1` | INVÉRIFIABLE — « l'ECMWF ou Météo-France… de plusieurs jours à moins d'une heure » sans source | remplacé par : l'IFS du CEPMMT en simple précision (`JPRB`, ~40 %, cycle 47r2 du 11 mai 2021) | Cas réel — le CEPMMT passe ses prévisions en simple précision (2021) | https://www.ecmwf.int/sites/default/files/elibrary/2018/80963-progress-using-single-precision-ifs.pdf (Newsletter 157, automne 2018) ; https://www.ecmwf.int/node/20106 (Newsletter 168, été 2021) |
| `pages/fortran/lecon-09.html#1` | INEXACT en partie — `numpy.linalg.solve` appelle bien la routine `_gesv` de LAPACK, mais NumPy peut embarquer des versions en C des routines de référence (« du code Fortran » n'est pas toujours vrai) ; « des millions de scientifiques » sans source | corrigé sur son sujet : LAPACK 1.0 (1992), son but, les BLAS de niveau 3, et ce qu'en dit la documentation de NumPy 2.5 | Cas réel — LAPACK, sous le capot de NumPy (1992) | https://www.netlib.org/lapack/ ; https://numpy.org/doc/2.5/reference/routines.linalg.html ; https://numpy.org/doc/2.5/reference/generated/numpy.linalg.solve.html |
| `pages/fortran/lecon-10.html#1` | INVÉRIFIABLE — « PETSc ou les cœurs de calcul de codes météo organisent… en types dérivés avec méthodes » : aucune source (PETSc est écrit en C) | remplacé par : Fortran 2003, `EXTENDS`, `CLASS`, `SELECT TYPE` (résumé de John Reid) | Cas réel — Fortran 2003 rend les types dérivés extensibles (2004) | https://wg5-fortran.org/N1601-N1650/N1648.pdf ; https://wg5-fortran.org/documents.html (registre : N1648 remplace N1579) ; Compiler Explorer |
| `pages/fortran/lecon-11.html#1` | INVÉRIFIABLE — usage général ; « BLAS et LAPACK… bâties sur ce modèle » (opérations sur tableaux entiers) sans source | remplacé par : la (ré)allocation automatique à l'affectation, GCC 4.6 | Cas réel — gfortran réalloue les tableaux à l'affectation (2011) | https://gcc.gnu.org/gcc-4.6/changes.html ; https://gcc.gnu.org/gcc-4.6/ (4.6.0 : 25 mars 2011) ; Compiler Explorer |
| `pages/fortran/lecon-12.html#1` | INVÉRIFIABLE — IFS et WRF en MPI + OpenMP, « des dizaines de milliers de cœurs » sans source ; l'encadré est dans la section sur les coarrays | remplacé par : les coarrays de Fortran 2008 et leur origine (Co-Array Fortran, F−− du CRAY-T3D) | Cas réel — les coarrays entrent dans Fortran 2008 (2010) | https://wg5-fortran.org/N1801-N1850/N1824.pdf (Reid, 21 avril 2010) |
| `pages/fortran/lecon-13.html#1` | INVÉRIFIABLE — « f2py… c'est exactement iso_c_binding qui travaille » : la documentation de f2py décrit des fichiers de signature et des fonctions enveloppes, sans `iso_c_binding` ; NumPy et LAPACK : doublon de 01 | remplacé par : LAPACKE, interface C de LAPACK 3.3, `LAPACK_ROW_MAJOR` / `LAPACK_COL_MAJOR` | Cas réel — LAPACKE, une interface C de LAPACK pour les deux ordres (2010) | https://www.netlib.org/lapack/lapack-3.3.0.html (14/11/2010) ; https://www.netlib.org/lapack/lapack-3.4.0.html ; https://www.netlib.org/lapack/lapacke.html ; https://numpy.org/doc/2.5/f2py/f2py.getting-started.html (vérification) |
| `pages/fortran/lecon-14.html#1` | INVÉRIFIABLE — illustration générale (« les vrais codes scientifiques… souvent via fpm test ») | remplacé par : Fortran-lang (décembre 2019), `stdlib` et `fpm` | Cas réel — Fortran-lang, sa bibliothèque standard et fpm (2019) | https://arxiv.org/abs/2203.15110 ; https://arxiv.org/pdf/2203.15110 (*Computing in Science & Engineering*, 2022) |

## Décomptes

| | ada | fortran | total |
|---|---:|---:|---:|
| « Cas réel » lus | 14 | 14 | **28** |
| VRAI tel quel | 0 | 0 | 0 |
| INEXACT (sujet gardé ou voisin) | 2 (`07`, `13`) | 2 (`06`, `09`) | 4 |
| sujet réel, foyer ailleurs | 2 (`02` Mars Climate Orbiter, `09` Ariane 5) | 1 (`02` Patriot) | 3 |
| INVÉRIFIABLE | 10 | 11 | 21 |
| INVENTÉ | 0 | 0 | 0 |
| remplacés | 12 | 12 | **24** |
| corrigés sur leur sujet | 2 | 2 | **4** |
| renommés « Scénario » | 0 | 0 | 0 |
| hors de la règle, avant → après | 14 → 0 | 14 → 0 | 28 → 0 |

(`ada/09` est compté « foyer ailleurs » : il racontait Ariane 5 avec en plus deux détails faux.)

## Contrôles (sur l'état commité, avant le commit de ce rapport)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=ada` | **0** (14 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=fortran` | **0** (14 conformes) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js … c5b3e9d` | 2 écarts, tous deux sur `fortran/lecon-12` (expliqués plus haut) ; 0 sur les 27 autres pages |
| `node tools/cas-reels/lots/controle-branche.js … c5b3e9d` | OK : 0 CR, 0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures, copie propre |
| `node tools/cas-reels/lots/doublons.js` | 2 sources partagées (les deux légitimes, inchangées) |
| `node tools/verif.js --rapide` | voir ci-dessous |

`node tools/verif.js --rapide` (lancé **une fois**, à la fin, sur la machine partagée ; 414 s) : code **1**,
4 étapes signalées sur 54, toutes tolérées par la consigne :

- `donnees` — **I18** seul : `search-index.js` publié diverge du contenu regénéré (+15 917 octets), et
  `quiz-index.js` aussi (+20 octets). Ce second écart **n'est pas de ce lot** : regénéré à part
  (`--fresh --out=scratchpad/…`), il porte sur l'explication d'un QCM d'`ocaml/lecon-10` (« Rocq,
  anciennement Coq »), changée au lot 5. L'orchestrateur régénère après la fusion.
- `doc-ref` — « nombre de leçons qui renvoient à un document = 118 » et « nombre de cours concernés = 42 » :
  compteurs du cours `doc` mesurés sur tout le site, qui bougent avec les 28 lignes de source.
- `normatf` — « leçons parlant de la spécification = 42 » : plusieurs encadrés emploient le mot (« la
  spécification fonctionnelle est écrite en Z », « la spécification imposait… d'arrêter le processeur »,
  « .ads pour une spécification »…), mot de leurs sources ; rien n'a été déformé pour garder l'étape verte.
- `doc-rec` — « 977 citent la source de leur « Cas réel » » (le nombre monte avec les 28 sources) et
  « mentions de Stack Overflow et des assistants : 8 leçons » : ni la base ni mes pages d'`ada` et de
  `fortran` ne mentionnent Stack Overflow ; écart hérité du lot 5 (`vscode/lecon-01`).

Les 50 autres étapes sont OK, dont `source`, `contenu`, `exemple`, `qcmbiai`, `qcmlexi` et les `rj-*`.
Relancés seuls après le dernier commit de contenu (`ce4cd8b`) : les deux cliquets QCM, `--cas-reel` des deux
cours, `--strict`, `verif-html`, `verif-domaines-interdits` et `controle-branche` sortent en 0 / OK.

## Cas où j'ai douté

- `fortran/03` repose sur un **témoignage** (Fred Webb, transmis à RISKS par Mark Brader, 12 décembre 1989),
  pas sur un document de la NASA. Webb ne cite pas la ligne exacte (« in exactly the form … indicated above » :
  un point à la place d'une virgule dans un `DO`) ; la ligne `DO 10 I = 1.10` est donc présentée comme un
  exemple de la forme, rejoué au compilateur, pas comme la ligne du programme de 1963. Webb écrit aussi que
  le programme avait servi « pendant les vols Mercury » et qu'il était « assez bon pour les vols
  suborbitaux » : l'encadré ne garde que la première formule.
- `ada/07` : le rapport de l'ESA est un PDF **scanné** (pypdf n'en tire aucun texte) ; le texte a été lu dans
  une copie universitaire (Berkeley) et confronté aux pages scannées 1 à 3 (titre, date, § 2.1). L'instant
  retenu est celui du § 3.2 : « 37 seconds after start of the main engine ignition sequence (30 seconds after
  lift-off) » ; le § 1.1 dit « approximately H0 + 37 seconds », l'avant-propos « about 40 seconds after
  initiation of the flight sequence ». Le premier jet de B9 disait « environ 37 secondes après l'allumage » :
  précisé au commit `ce4cd8b`.
- `ada/13` : les chiffres viennent des **diapositives** de l'industriel (Altran UK), datées seulement par la
  conférence (HCSS 2014). « 529 000 lignes » est la ligne « 529kloc "code" » (890 000 lignes brutes,
  250 000 logiques).
- Années des titres sur des documents de normalisation : `ada/04` (2010 = approbation du WG 9 ; la norme Ada
  2012 est approuvée « late in 2012 »), `ada/12` (2004 = approbation du WG 9 de l'AI95-00301),
  `fortran/10` (2004 = publication de la norme, d'après Reid ; le document N1648 lui-même n'est pas daté,
  il remplace N1579 et se place vers 2005 dans le registre du WG5), `fortran/02` (1999 = adoption de C99 ;
  le Rationale cité est la révision 5.10 d'avril 2003).
- Copies tierces : Parnas (`ada/06`) par l'Internet Archive (l'ACM renvoie 403 au téléchargement direct) ;
  Musser et Stepanov (`ada/10`) par la collection stepanovpapers.com (scan de l'ACM, référence vérifiée sur
  l'index ; le lieu de la conférence n'a pas pu être vérifié, dblp et l'ACM étant protégés, il n'est pas
  écrit) ; le FORTRAN 77 par la FIPS PUB 69-1 du NIST (scan officiel) et le texte du WG5.
- `fortran/01` et `fortran/05` citent le **même document** (ANSI X3.9-1978), pour deux clauses différentes
  (4.1.2 et 15.9.3.2) ; `fortran/09` et `fortran/13` citent deux pages différentes de netlib. Sujets
  distincts, mais l'orchestrateur peut préférer moins de répétition.

## Ce qui reste ouvert

- **Hors encadré, non corrigé** (consigne : ne toucher qu'aux « Cas réel ») :
  - `fortran/lecon-01` : la légende de figure dit « Cette règle héritée de 1957 » ; le manuel qui la fixe est
    daté du 15 octobre 1956 (il décrit le système « made available during late 1956 »).
  - `fortran/lecon-09` : la figure dit « BLAS et LAPACK en Fortran » ; la documentation de NumPy 2.5 précise
    que NumPy peut aussi embarquer des versions **en C** d'une partie des routines de référence.
  - `ada/lecon-03` : le corps présente `when others` comme ce qui rend « impossible d'oublier un cas en
    silence » ; le guide de style Ada 95 (et l'essai GNAT) montrent l'inverse quand on ajoute une valeur à
    une énumération. L'encadré le dit désormais ; le corps n'a pas été retouché.
- Phrases de liaison à la leçon, qui viennent du cours et non des sources : la dernière phrase de
  `ada/02`, `ada/06`, `ada/10`, `ada/13` (« niveau argent »), `ada/14`, `fortran/04`, `fortran/09`,
  `fortran/11`, `fortran/14`.
- Les essais Compiler Explorer sont cités dans les lignes de source sans lien permanent (l'API de
  compilation ne crée pas de lien court) ; les fichiers d'essai sont dans `scratchpad/b9-ada-fortran/`.
