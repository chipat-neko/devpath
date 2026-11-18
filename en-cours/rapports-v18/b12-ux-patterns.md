# Rapport V18 — case B12, lot 9 : les cours `ux` et `patterns` (copie `b12-ux-patterns`, branche `v18/b12-ux-patterns`)

Copie de travail `D:\test-claude-b12-ux-patterns`, partie de `8c65449`. Part traitée : les **22 « Cas réel »**
des cours `ux` (11, un par leçon) et `patterns` (11, un par leçon). Scripts et pièces dans
`scratchpad/b12-ux-patterns/` (ignoré par git) : `nouveaux-ux.js` et `nouveaux-patterns.js` (les 22 textes),
`remplace.js` (remplace l'intérieur de l'unique encadré, du titre au `</div>` du corps ; refuse un encadré absent
ou multiple, un `<div>` dans le fragment, tout CR, et prouve que rien ne bouge hors du fragment), `ou-mot.js`
(quelle option de QCM porte un mot), `jtest/` (essais Java 27), le clone de FizzBuzzEnterpriseEdition, les PDF et
pages des sources ouvertes.

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **11 hors de la règle à 0** pour `ux` et de
**11 à 0** pour `patterns` ; `ux` avait surtout des sujets réels mais mal racontés (4 INEXACTS, dont deux
histoires fondues en une), `patterns` presque uniquement des généralités (« les patterns sont partout ») ;
**13 remplacés**, **9 corrigés sur leur sujet**, **0 vérifié tel quel**, **0 « Scénario »**.

**Commits** (branche `v18/b12-ux-patterns`) : `4b2e8d9` (ux, 11 cas), `6b1b693` (patterns, 11 cas), puis le
commit de ce rapport.

**Consignes de fusion** : régénérer les index dérivés (`search-index.js` périmé : I18) et le point fixe ;
inscrire au registre les sujets des réservations `ux/*` et `patterns/*` de `b12-reservations.txt` (la dernière
ligne de chaque cas fait foi : `patterns/lecon-07` a deux lignes, la seconde compte) ; **QCM de `ux/lecon-09`**
à revoir par l'orchestrateur (voir « Ce qui reste ouvert ») ; `doc-ref`/`doc-rec` peuvent bouger (lignes de source).

## Méthode

- Seul l'intérieur de l'encadré change (titre, corps, ligne de source) ; type, icône et structure gardés.
  Aucun intertitre `<h2>`/`<h3>` n'est collé à ces encadrés (celui de `ux/lecon-06`, « Justifier, toujours »,
  en est séparé par un paragraphe et reste juste). `git diff` : une seule ligne changée par page, 22 pages.
- Forme : `Cas réel — sujet (année)` pour `ux`, `Cas réel : sujet (année)` pour `patterns` (le séparateur du
  cours, admis par la règle) ; dernier paragraphe `<p class="cas-reel__source">`, daté et lié ; aucun lien dans
  le corps ; `&nbsp;` devant « : ; ? » et dans « ».
- Longueurs des corps : 141 à 212 mots (originaux : 70 à 140) ; six dépassent 190 (`ux/03`, `04`, `09`, `10`,
  `patterns/09`, `11`).
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans le texte et les sources de tous les
  « Cas réel » de `pages/` (script `cherche.js --cas`), puis réservé dans `b12-reservations.txt` (relu : aucun
  autre agent du lot sur ces sujets). Écartés parce que déjà pris : le WebAIM Million (foyer `html/lecon-13`),
  le GOV.UK Design System (`css/lecon-18`), Martin Fowler et l'injection de dépendances (`archi/lecon-03`),
  « How Figma's multiplayer technology works » (`nodejs/lecon-17`), les branches d'annulation de Vim
  (`pascal/lecon-07`), Om et l'annulation (`clojure/lecon-06`). `doublons.js` a d'abord signalé le lien
  JSR 176 de `patterns/lecon-07`, déjà source de `java/lecon-08` : retiré, le cas est daté autrement.
- **Lexique** : `lexique-diff.js … 8c65449` rendait **27 écarts** au premier jet (mots d'options sortis :
  « classes », « unitaires », « données », « partout », « envoyé », « collée », « besoin », « ambigu »,
  « échouer », « dessus », « ordinateur » ; entrés : « toujours », « bibliothèque », « l'équipe », « titres »,
  « intertitres », « défaut », « propre », « teinte », « accessible », « moyenne », « utilisateur », « nombre »,
  « réussite », « plusieurs », « premier », « environ ») ; chaque mot remis dans une phrase exacte de la source,
  ou retiré → **0 écart**. Deux remèdes à signaler : le titre anglais de l'article de Stripe (« Designing
  accessible color systems ») n'est plus écrit en toutes lettres dans la ligne de source, qui garde auteurs,
  date et lien (`stripe.com/blog/accessible-color-systems`) ; et `ux/lecon-07` dit « environ neuf pouces »
  sans « en moyenne » (la source : « around nine inches on average »).
- **Comportements techniques testés** sous Java 27.0.1 (`jtest/Essai.java`, `Ctor.java`) :
  `Integer.valueOf(127) == Integer.valueOf(127)` → `true`, `128` → `false` ; `javac -Xlint:deprecation`
  signale `java.util.Observable` et `new Integer(int)` comme dépréciés ; `UndoManager` (essai écarté ensuite).
- **Comptes mesurés** : FizzBuzzEnterpriseEdition cloné au commit `4922c07` (18/12/2019, dernier commit de la
  branche par défaut) : 89 fichiers `.java`, 23 noms contenant « Factory », 23 contenant « Strategy »
  (2 621 lignes, 2 125 non vides — non cités) ; date de création du dépôt par l'API GitHub (24/11/2012).

## Cours `ux` (11)

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/ux/lecon-01.html#1` | Étude réelle, **INEXACT** (déjà relevé en B2) : les « clics à côté » ne sont qu'un risque supposé, non mesuré ; NN/g parle de *signifiers*, pas d'affordance ; ni date ni chiffres | **corrigé** : expérience d'oculométrie de Kate Moran (3/09/2017), 71 internautes, 9 pages en deux versions, +22 % de temps, +25 % de fixations, réserve sur la tâche complète ; flat design « à la mode vers 2012 » (Moran 2015) | Cas réel — quand le « plat » efface les boutons (2017) | https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/ ; https://www.nngroup.com/articles/flat-design/ |
| `pages/ux/lecon-02.html#1` | Article réel, chiffre **VRAI** (85 %) ; contexte non sourcé (« dans les années 1990, on croyait… », « tester est devenu… à la portée de n'importe quelle équipe ») ; ni date ni source | **corrigé** : date (18/03/2000), modèle Nielsen-Landauer (INTERCHI'93), L = 31 %, au moins 15 pour tout trouver, trois tests de 5 ; le contexte remplacé par la phrase d'ouverture de Nielsen | Cas réel — cinq personnes suffisent (2000) | https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ |
| `pages/ux/lecon-03.html#1` | Récit **anonyme** (« une refonte… », tests A/B sans nom), **INVÉRIFIABLE** | **remplacé** : le schéma de lecture en F (repéré en 2006, revu par Kara Pernice le 12/11/2017) : trois conditions, « schéma par défaut » sans signal fort, remèdes de hiérarchie visuelle | Cas réel — le schéma de lecture en F (2017) | https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ |
| `pages/ux/lecon-04.html#1` | Sujet réel (WebAIM Million) dont le **foyer est `html/lecon-13`** ; chiffres non revérifiés (cas remplacé) | **remplacé** : Stripe refait sa palette (Koopersmith et Miner, 15/10/2019) : audit (aucune couleur de petit texte au seuil, sauf le noir), HSL contre CIELAB, outil web maison, WCAG 2.0, règle des cinq niveaux | Cas réel — Stripe refait ses couleurs pour le contraste (2019) | https://stripe.com/blog/accessible-color-systems |
| `pages/ux/lecon-05.html#1` | Produit nommé, **VRAI** sur le fond (délai de 5 à 30 s aujourd'hui) ; « Gmail a popularisé » non sourcé ; ni date ni source | **corrigé** : Labs le 19/03/2009 (Michael Leggett, le « mauvais Larry », 5 s, le message retenu et non rappelé), réglage officiel en juin 2015, aide actuelle (5, 10, 20, 30 s ; « Message envoyé » / « Annuler ») | Cas réel — « Annuler l'envoi » de Gmail (2009) | https://gmail.googleblog.com/2009/03/new-in-labs-undo-send.html ; https://workspaceupdates.googleblog.com/2015/06/undo-send-for-gmail-on-web.html ; https://support.google.com/mail/answer/2819488?hl=en |
| `pages/ux/lecon-06.html#1` | Sujet réel, en partie **INVÉRIFIABLE** : « une question par écran », « chaque changement mesuré », « démarches plus rapides, moins d'erreurs » sans source ; le design system public est le foyer de `css/lecon-18` | **corrigé et recentré** (GOV.UK gardé ici, la description de la leçon le cite) : les principes du GDS publiés le 3/04/2012, « Start with needs* — user needs not government needs », et l'exemple de la page TVA (20 % en plus grand, le reste en secondaire) | Cas réel — GOV.UK, la refonte qui part de l'utilisateur (2012) | https://www.gov.uk/guidance/government-design-principles ; https://web.archive.org/web/20121030084814/https://www.gov.uk/designprinciples |
| `pages/ux/lecon-07.html#1` | Sujet réel, **VRAI** sur le fond ; « débattu depuis les années 1980 » et « loi vieille de 70 ans » non sourcés ; ni date ni source | **corrigé** : le quiz de Bruce Tognazzini (AskTog, février 1999) : barre sur la fenêtre chez Microsoft et Sun, hauteur infinie du bord, test chez Apple avec un second écran (environ neuf pouces de dépassement, puis temps d'un utilisateur moyen de Windows) | Cas réel — la barre de menus du Mac et la loi de Fitts (1999) | https://www.asktog.com/columns/022DesignedToGiveFitts.html |
| `pages/ux/lecon-08.html#1` | Second récit GOV.UK du cours (la consigne n'en garde qu'un) ; « tris de cartes et tree testing », « plusieurs fois primé », coûts réduits **INVÉRIFIABLES** tels quels | **remplacé** : Joshua Porter (UIE), « Testing the Three-Click Rule » (16/04/2003) : 44 utilisateurs, 620 tâches, plus de 8 000 clics, abandon pas plus fréquent après 3 qu'après 12, jusqu'à 25 clics, insatisfaits entre 46 et 61 % | Cas réel — la « règle des trois clics » à l'épreuve (2003) | https://articles.centercentre.com/?p=17 |
| `pages/ux/lecon-09.html#1` | **INEXACT, deux histoires fondues** : le « 300 millions » de Spool porte sur un **bouton** (connexion/inscription imposée au paiement) ; le champ « Nom de l'entreprise » et l'adresse qui fait échouer la vérification bancaire n'y sont pas | **corrigé** sur l'article de Jared M. Spool (UIE, 14/01/2009) : formulaire à deux champs et deux boutons, citation du client, 45 % de comptes multiples, 160 000 demandes de mot de passe par jour, 75 % d'abandons, « Register » → « Continue », +45 %, 15 M$ le premier mois, 300 M$ la première année | Cas réel — le bouton à 300 millions de dollars (2009) | https://articles.centercentre.com/three_hund_million_button/ |
| `pages/ux/lecon-10.html#1` | **INEXACT** : il ne s'agissait pas des liens « dans les résultats » mais des liens des **annonces** de Gmail et de la recherche ; « vers 2009 » date le billet de Bowman, pas le test ; le chiffre de 200 M$ vient d'une déclaration de 2014 | **corrigé** : Bowman (20/03/2009 : 41 nuances, la bordure de 3, 4 ou 5 px) et Dan Cobley (4/02/2014, rapporté par The Guardian le 5 : 1 % puis 40 autres nuances, bleu plus violet, 200 M$ par an selon lui) — deux témoignages, présentés séparément | Cas réel — les « 41 nuances de bleu » de Google (2009) | https://stopdesign.com/archive/2009/03/20/goodbye-google.html ; https://www.theguardian.com/technology/2014/feb/05/why-google-engineers-designers (lu par curl ; presse, faute d'enregistrement de l'intervention de Cobley) |
| `pages/ux/lecon-11.html#1` | Objet réel, **INEXACT** dans le détail : bloc « taillé » par Hawkins, porté « dans sa poche de chemise », « pendant des semaines », « avant la première ligne de code », « à zéro euro » : rien de cela dans la source du musée (c'est l'appareil, pas la maquette, qui tenait dans une poche de chemise) | **corrigé** sur le Computer History Museum : prototype en bois vers 1995, don de Jeff Hawkins, baguette comme stylet, fausses notes en réunion, étapes comptées ; Newton, EO et Zoomer, accessoire du PC à 299 $, environ un million vendus par U.S. Robotics en 18 mois | Cas réel — le PalmPilot, testé sur un bout de bois (1995) | https://www.computerhistory.org/revolution/mobile-computing/18/321 ; https://www.computerhistory.org/revolution/mobile-computing/18/321/1648?position=1 ; https://www.computerhistory.org/collections/catalog/102716262 |

## Cours `patterns` (11)

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/patterns/lecon-01.html#1` | **Usage général** (Observer, Iterator, middlewares Express, Strategy « déjà dans tes outils »), **INVÉRIFIABLE** comme cas | **remplacé** : Kent Beck (Apple) et Ward Cunningham (Tektronix), rapport CR-87-43 pour l'atelier d'OOPSLA-87 (17/09/1987) : le langage de patterns d'Alexander, cinq patterns de fenêtres Smalltalk, des spécialistes qui spécifient des interfaces « très raisonnables » après un jour | Cas réel : Beck et Cunningham empruntent les patterns à l'architecture (1987) | http://c2.com/doc/oopsla87.html |
| `pages/patterns/lecon-02.html#1` | Récit **anonyme** (« une boutique… new Stripe() »), **INVÉRIFIABLE** | **remplacé** : Robert C. Martin, « The Dependency Inversion Principle », C++ Report, juin 1996 : le module `Copy`, `ReadKeyboard`/`WritePrinter`, le `if` et le drapeau, `Reader`/`Writer` abstraits, l'énoncé du principe | Cas réel : Robert C. Martin et le programme « Copy » (1996) | https://web.archive.org/web/20070928064403/http://www.objectmentor.com/resources/articles/dip.pdf (lu avec pypdf ; identique à https://cs.utexas.edu/~downing/papers/DIP-1996.pdf) ; https://staff.cs.utu.fi/~jounsmed/doos_06/material/Stability.pdf (« The June, 1996 issue of the C++ report discussed the DIP ») ; https://web.archive.org/web/20141228005556/http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod |
| `pages/patterns/lecon-03.html#1` | **Usage général** (`createElement`, knex, un logger), **INVÉRIFIABLE** comme cas | **remplacé** sur la même notion, sourcé : W3C, DOM Level 1 (1/10/1998), § 1.1.2 : interfaces et non classes, pas de constructeur ordinaire, « factory methods » `createX()` du `Document` | Cas réel : les méthodes de fabrique du DOM (1998) | https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html ; https://www.w3.org/TR/REC-DOM-Level-1/ |
| `pages/patterns/lecon-04.html#1` | **Usage général** (`BufferedReader`, axios, « l'Adapter, pain quotidien des intégrations »), **INVÉRIFIABLE** | **remplacé** : SLF4J (site et 1.0-beta1 le 22/04/2005) : façade devant java.util.logging, log4j, reload4j, logback ; providers choisis au déploiement ; celui de JCL « délègue » ; le manuel parle de ses « adapters » | Cas réel : SLF4J, une façade pour la journalisation Java (2005) | https://www.slf4j.org/news.html ; https://www.slf4j.org/manual.html |
| `pages/patterns/lecon-05.html#1` | **Usage général** (Ctrl+Z, compteur de likes, « trier par »), **INVÉRIFIABLE** | **remplacé** : Java 9 (GA le 21/09/2017) déprécie `Observer` et `Observable` ; les trois raisons et les trois pistes de la Javadoc ; avertissement toujours émis par `javac` 27 | Cas réel : Java 9 déprécie Observer et Observable (2017) | https://docs.oracle.com/javase/9/docs/api/java/util/Observable.html ; https://openjdk.org/projects/jdk9/ ; essai `javac -Xlint:deprecation` sous Java 27.0.1 (le ticket JDK-8154801 n'a pas pu être lu : JBS en maintenance) |
| `pages/patterns/lecon-06.html#1` | Produit nommé, **VRAI** sur le fond (dépôt et classe réels) ; ni date ni chiffre vérifiable (« des dizaines de fabriques », « des milliers de lignes ») | **corrigé et précisé** : dépôt créé le 24/11/2012, ce que dit le README (normes de l'entreprise, FizzBuzz d'entretien), 89 fichiers Java dont 23 « Factory » et 23 « Strategy » au commit `4922c07`, configuration Spring ; `AbstractSingletonProxyFactoryBean` existe dans Spring depuis la 2.0 | Cas réel : FizzBuzz Enterprise Edition, la sur-ingénierie en vitrine (2012) | https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition (API GitHub et clone) ; https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/aop/framework/AbstractSingletonProxyFactoryBean.html |
| `pages/patterns/lecon-07.html#1` | Usages généraux (proxies paresseux des ORM, forêt de 10 000 arbres, mémoire vidéo « saturée en quelques secondes »), **INVÉRIFIABLE** tels quels | **remplacé** : le cache d'`Integer.valueOf` (-128 à 127, « depuis 1.5 »), Flyweight du JDK ; essai Java 27 (127 : même objet ; 128 : non) ; Java 9 (21/09/2017) déprécie le constructeur | Cas réel : le cache d'Integer.valueOf, un poids-plume de Java (2017) | https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Integer.html#valueOf(int) ; https://openjdk.org/projects/jdk9/ ; (ouvertes puis non citées : https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html#jls-5.1.7 ; https://jcp.org/en/jsr/detail?id=176, source de `java/lecon-08`) |
| `pages/patterns/lecon-08.html#1` | **Usage général** (middlewares Express/ASP.NET/Spring, commandes e-commerce, `setUp`/`tearDown`), **INVÉRIFIABLE** | **remplacé** : « JUnit: A Cook's Tour », par les auteurs de JUnit (Erich Gamma et Kent Beck selon la FAQ de JUnit), dans la doc de JUnit 3.8 (README du 23/08/2002) : `TestCase.run()` en Template Method, Command et Composite | Cas réel : JUnit, une Template Method au cœur des tests (2002) | https://github.com/junit-team/junit4/blob/main/doc/cookstour/cookstour.htm (et copie archivée https://web.archive.org/web/20041229080011/http://junit.sourceforge.net:80/doc/cookstour/cookstour.htm) ; https://web.archive.org/web/20041229155658/http://junit.sourceforge.net:80/README.html ; https://junit.org/junit4/faq.html |
| `pages/patterns/lecon-09.html#1` | Jugé **VRAI** en B2, revérifié : **présent devenu faux** pour Angular — sa doc (v22.2.6) présente `@Service()` et la fonction `inject()`, l'injection par constructeur n'y reste qu'avec `@Injectable` ; « sans DI, le code serait presque intestable » est une opinion ; ni date ni source | **remplacé** sur la même notion (et le même acteur, Spring) : la doc de Spring 3.2 préférait l'injection par setter (« some purists favor constructor-based injection ») ; Spring 4.0 (12/12/2013) préconise l'injection par constructeur ; la doc 7.0 tient le même discours et parle des tests unitaires sans conteneur | Cas réel : Spring passe à l'injection par constructeur (2013) | https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html ; https://docs.spring.io/spring-framework/docs/4.0.x/spring-framework-reference/html/beans.html ; https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html ; https://docs.spring.io/spring-framework/reference/testing/unit.html ; https://spring.io/blog/2013/12/12/announcing-spring-framework-4-0-ga-release ; (B2, revérifiée : https://angular.dev/guide/di/creating-and-using-services) |
| `pages/patterns/lecon-10.html#1` | **Usage général** (Rails, Django, Laravel en MVC ; Angular, Vue en MVVM ; Spring Data, EF, Doctrine), **INVÉRIFIABLE** comme cas | **remplacé** : la note de Trygve Reenskaug « MODELS - VIEWS - CONTROLLERS » (Xerox PARC, 10/12/1979) : modèle = connaissance, vue = filtre de présentation, contrôleur = lien avec l'utilisateur, la vue ignore souris et clavier | Cas réel : la note de Trygve Reenskaug qui nomme le MVC (1979) | https://zenodo.org/records/3676092 (et l'API du dépôt ; PDF lu avec pypdf) |
| `pages/patterns/lecon-11.html#1` | **Usage général** (historique de Photoshop, undo de VS Code, Word, Figma, journaux de bases de données), **INVÉRIFIABLE** | **remplacé** : la recette Redux « Implementing Undo History », versée par Daniel Bugl (auteur de redux-undo) le 26/09/2015 : `past`/`present`/`future`, le futur vidé, `undoable(reducer)` ; toujours dans la doc | Cas réel : l'historique d'annulation de Redux (2015) | https://github.com/reduxjs/redux/commit/c24e2a1aab3d9696f27099ec91f046d09907f48a ; https://github.com/reduxjs/redux/blob/12182677c4ed4387bec5a3596fbf8e62a27fdce9/docs/recipes/ImplementingUndoHistory.md ; https://redux.js.org/usage/implementing-undo-history ; API GitHub (auteur `omnidan` = Daniel Bugl, dépôt redux-undo) |

## Décomptes

| | `ux` | `patterns` | total |
|---|---:|---:|---:|
| « Cas réel » lus | 11 | 11 | 22 |
| état trouvé : VRAI sur le fond (mais non daté, non sourcé) | 3 | 1 | 4 |
| état trouvé : INEXACT | 4 | 0 | 4 |
| état trouvé : INVÉRIFIABLE (anonyme, général ou en partie) | 3 | 9 | 12 |
| état trouvé : sujet réel au foyer d'un autre cours | 1 | 0 | 1 |
| état trouvé : présent devenu faux (VRAI en B2) | 0 | 1 | 1 |
| INVENTÉ | 0 | 0 | 0 |
| remplacés | 3 | 10 | 13 |
| corrigés (sujet gardé) | 8 | 1 | 9 |
| vérifiés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |
| conformes à la règle (avant → après) | 0 → 11 | 0 → 11 | 0 → 22 |

## Contrôles

Joués dans la copie, après le dernier commit de contenu (`6b1b693`) :

| Contrôle | Code | Détail |
|---|---:|---|
| `node tools/verif-contenu.js --cas-reel --cours=ux` | **0** | 11 lus, 11 conformes (0 au départ) |
| `node tools/verif-contenu.js --cas-reel --cours=patterns` | **0** | 11 lus, 11 conformes (0 au départ) |
| `node tools/verif-contenu.js --strict` | **0** | toutes les leçons au standard ; site : **1 448** « Cas réel » conformes sur 1 551 (1 426 à `8c65449`) |
| `node tools/verif-html.js` | **0** | aucun problème |
| `node tools/verif-domaines-interdits.js` | **0** | |
| `node tools/verif-qcm-lexique.js` | **0** | |
| `node tools/verif-qcm-biais.js` | **0** | |
| `node tools/cas-reels/lots/lexique-diff.js … 8c65449` | — | **0 écart** sur les 22 pages modifiées (27 au premier jet) |
| `node tools/cas-reels/lots/doublons.js` | — | **3** sources partagées entre cours (Debian 12, react.dev, Safari 15.4), toutes antérieures au lot ; la 4ᵉ que j'avais créée (JSR 176 avec `java/lecon-08`) a été retirée. Le lien du projet JDK 9 sert deux fois dans `patterns` (leçons 05 et 07), pour une date |
| `node tools/verif.js --rapide` | 1 | 54 étapes, 284,1 s, **2 signalées, toutes deux tolérées** : `donnees` = I18 seul (2 erreurs : un index publié diverge du contenu régénéré ; I17 n'est qu'un avertissement) ; `doc-rec` = « 1 433 citent la source » introuvable dans `doc/lecon-04` (le compteur a bougé avec mes 22 lignes de source). `doc-ref` **vert**. L'orchestrateur régénère les deux après la fusion |
| fins de ligne | — | 0 CR dans les 22 fichiers modifiés (compté avec node) |

## Ce qui reste ouvert

- **QCM de `ux/lecon-09`** (non touché, consigne) : sa 4ᵉ question demande « Que nous apprend le « champ à
  300 millions de dollars » ? ». Le cas dit maintenant, avec sa source, que c'était un **bouton** (et le
  formulaire de connexion qu'il imposait). La bonne réponse (« Un champ inutile ou ambigu peut faire échouer et
  abandonner : le supprimer lève la friction ») reste défendable — le cas se clôt sur « un champ ou un bouton
  inutile, voire ambigu, peut faire échouer une vente » —, mais l'intitulé « champ » serait à corriger en
  « bouton » par l'orchestrateur (les deux mots ont moins de 6 lettres : sans effet sur le lexique).
- **`patterns/lecon-09`** : B2 l'avait jugé VRAI et la consigne disait de le garder ; je l'ai remplacé parce
  que la documentation d'Angular (v22) ne décrit plus l'injection par constructeur comme la voie principale
  (`@Service()` + `inject()`), et qu'aucune date ne tenait la liste de frameworks au présent. Le nouveau cas
  garde la notion (la forme d'injection recommandée, réponse de la 2ᵉ question du QCM) et Spring. À trancher si
  l'orchestrateur préfère l'ancien cas remis à jour.
- **Presse** (primaire introuvable) : la déclaration de Dan Cobley (200 M$) n'est connue que par
  *The Guardian* (5/02/2014), dit comme tel dans le cas (« Selon lui… rapporté par The Guardian »).
- **Copies tierces** : « Stability » (qui date le DIP de juin 1996) n'est lu que sur une copie de cours de
  l'université de Turku ; le DIP lui-même vient de la copie d'Object Mentor archivée (identique octet pour octet
  à celle de l'UT Austin). Aucun des deux PDF ne porte le nom de l'auteur : l'attribution à Robert C. Martin
  repose sur Object Mentor et sur sa page « The Principles of OOD » (archivée), qui y renvoie.
- **Dates par documents** : `patterns/lecon-08` est daté par le README de JUnit 3.8 (23/08/2002), qui liste
  l'article ; l'article lui-même n'est pas daté. `ux/lecon-11` : la maquette est datée « circa 1995 » par le
  musée (titre « 1995 », corps « vers 1995 »).
- `ux/lecon-04` : la ligne de source ne recopie plus le titre anglais de l'article (le mot « accessible » y
  rouvrait un distracteur) ; auteurs, date et lien y sont.
- Longueurs : six corps dépassent 190 mots (`ux/03`, `04`, `09`, `10`, `patterns/09`, `11` ; maximum 212).
