# V18 / B4 (lot 1, passe de dédoublonnage) — 11 « Cas réel » de `python`, `java` et `csharp`

Copie `D:\test-claude-dd-py-java-cs`, branche `v18/b4-dd-py-java-cs`, partie de `8fd5290`.

**La mission.** Les 11 cas de cette part étaient **exacts** (contre-relus au lot 1), mais leur
**sujet** appartient à un autre cours (`tools/cas-reels/lots/foyers.md`) : un sujet = un seul cours
sur tout le site. Chacun est **remplacé** par un autre vrai cas, sur la même notion que sa leçon,
dont ni le sujet ni la source ne figurent ailleurs dans `pages/` (vérifié par `grep -ril` sur le
sujet et sur l'URL, et par `node tools/cas-reels/lots/doublons.js` : aucun de mes 11 cas n'y apparaît).
Chaque sujet a été réservé dans le fichier commun
`D:\test-claude\scratchpad\v18-parallele\dd-reservations.txt` **avant** l'écriture (une ligne de
correction ajoutée ensuite pour l'URL de Toyota, sujet inchangé).

**Méthode.** Chaque cas lu avec sa leçon (notion, section où il se trouve, intertitre collé). Chaque
affirmation du nouveau récit confrontée à une source **ouverte** : page web lue en texte (`curl`,
parfois l'outil web), API GitHub pour les tickets et les pull requests (corps, commentaires, diff),
PDF lu avec `pypdf`. Comportements techniques **testés** : `if x = 0:` (Python 3.14.5, `SyntaxError`) ;
`(?>a+)b` et `a++b` (Python 3.10.21 : `re.error` ; 3.11.16 : acceptés) ; limite `int`/`str`
(3.10.21 : `ValueError` à 10 000 chiffres) ; formatage paresseux de `logging` (le `__str__` d'un
argument n'est pas appelé quand le niveau est coupé) ; `(0.1 + 0.2).ToString()` et `ToString("G15")`
sous .NET 10.0.403 (culture invariante et `fr-FR`). Remplacement **à l'octet** de la seule partie
« titre … ligne de source » (`scratchpad/b4-dd-py-java-cs/remplacer.js`, qui refuse un titre ou une
source non uniques), plus un intertitre ; `controle-branche.js` confirme les octets identiques hors
« Cas réel ». Après chaque retouche : `lexique-diff.js` à 0 écart (deux mots d'options évités en
cours de route : « détour » dans `python/39`, « passer » dans l'intertitre de `csharp/09`). Aucun QCM,
aucun index dérivé touché.

**Sources** : toutes primaires (listes de diffusion, tickets et pull requests, PEP et JEP,
documentation officielle, journal officiel américain, billets d'ingénierie officiels, communiqué de
l'entreprise), sauf **LWN.net** pour `python/04` (presse spécialisée) : le message de Larry McVoy sur
la liste du noyau, primaire et cité, ne contient pas les deux lignes de code, que seul LWN publie.

## Les 11 cas

| identifiant | état trouvé (nature) | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/python/lecon-04.html#1` | VRAI (événement : « goto fail » d'Apple, 2014) — sujet gardé par `csharp/lecon-03` | remplacé par : la porte dérobée de `wait4` dans le noyau Linux, `=` au lieu de `==` dans un `if` (2003) ; même notion : la condition, et le piège `=`/`==` que la leçon traite (Python refuse `if x = 0:`) | Cas réel — la porte dérobée de `wait4` dans le noyau Linux (2003) | https://lkml.iu.edu/hypermail/linux/kernel/0311.0/0621.html ; https://lwn.net/Articles/57135/ |
| `pages/python/lecon-19.html#1` | VRAI (événement : sauvegardes muettes de GitLab, 2017) — sujet gardé par `iac/lecon-05` | remplacé par : la PEP 282, naissance du module `logging` (créée le 04/02/2002, Python 2.3 du 29/07/2003) ; même notion : journaliser, niveaux, mise en forme différée (le `log.debug("Lecture de %s", …)` juste au-dessus) | Cas réel — la PEP 282 donne à Python son module `logging` (2002) | https://peps.python.org/pep-0282/ ; https://docs.python.org/3/whatsnew/2.3.html |
| `pages/python/lecon-39.html#1` | VRAI (événement : chargement de GTA Online, 2021) — sujet gardé par `algo/lecon-01` | remplacé par : CVE-2020-10735, la conversion `int`/`str` presque quadratique de CPython (issue du 08/08/2022, limite de 4 300 chiffres dans 3.10.7 du 06/09/2022) ; même notion : la complexité cachée | Cas réel — CVE-2020-10735, le coût caché de `int(texte)` (2022) | https://github.com/python/cpython/issues/95778 (et l'API GitHub) ; https://docs.python.org/3/whatsnew/3.10.html ; https://docs.python.org/3/library/stdtypes.html ; https://www.python.org/downloads/release/python-3107/ |
| `pages/python/lecon-41.html#1` | VRAI (événement : panne de Cloudflare, ReDoS, 2019) — sujet gardé par `regex/lecon-06` | remplacé par : les groupes atomiques et quantificateurs possessifs de `re`, ticket ouvert le 14/06/2001, fusionné le 21/03/2022, Python 3.11 (24/10/2022) ; même notion : couper le retour arrière contre le ReDoS (la leçon enseigne `(?>...)` et `a++`) | Cas réel — les groupes atomiques arrivent dans `re` avec Python 3.11 (2022) | https://github.com/python/cpython/issues/34627 (et ses commentaires par l'API) ; https://api.github.com/repos/python/cpython/pulls/31982 ; https://docs.python.org/3/whatsnew/3.11.html |
| `pages/java/lecon-02.html#1` | VRAI (événement : Ariane 5, 1996) — sujet gardé par `ada/lecon-07` | remplacé par : le compteur des GCU du Boeing 787 qui déborde après 248 jours (consigne FAA AD 2015-09-07, 01/05/2015) ; même notion : le débordement d'une capacité fixe, sans exception | Cas réel — le compteur du Boeing 787 qui déborde (2015) | https://www.govinfo.gov/content/pkg/FR-2015-05-01/pdf/2015-10066.pdf ; https://www.federalregister.gov/documents/full_text/html/2015/05/01/2015-10066.html ; https://www.federalregister.gov/api/v1/documents/2015-10066.json |
| `pages/java/lecon-13.html#1` | VRAI (événement : Azure et le 29 février, 2012) — sujet gardé par `python/lecon-17` | remplacé par : la JEP 150 (créée le 22/02/2012 par Stephen Colebourne) fait entrer `java.time` dans le JDK 8 (GA le 18/03/2014) ; même notion : les dates avec `java.time`, objets immuables | Cas réel — la JEP 150 fait entrer `java.time` dans le JDK 8 (2014) | https://openjdk.org/jeps/150 ; https://openjdk.org/projects/jdk8/ |
| `pages/java/lecon-15.html#1` | VRAI (événement : Therac-25, 1985-1987) — sujet gardé par `os/lecon-07` | remplacé par : la condition de course de GitHub qui donnait à un utilisateur la session d'un autre (2021 : thread d'arrière-plan, objet `env` d'Unicorn réutilisé) ; même notion : un état partagé entre threads sans protection | Cas réel — GitHub et les sessions échangées entre threads (2021) | https://github.blog/security/vulnerability-research/how-we-found-and-fixed-a-rare-race-condition-in-our-session-handling/ ; https://github.blog/news-insights/company-news/github-security-update-a-bug-related-to-handling-of-authenticated-sessions/ |
| `pages/csharp/lecon-02.html#1` | VRAI (événement : Patriot de Dhahran, 1991) — sujet gardé par `fortran/lecon-02` ou `asm/lecon-09` | remplacé par : .NET Core 3.0 rend l'affichage des `double` conforme à IEEE 754-2008 (`ToString()` quitte le G15 ; 05/03/2019) ; même notion : `double` binaire et imprécis, `decimal` pour l'argent | Cas réel — .NET Core 3.0 et l'affichage des `double` (2019) | https://devblogs.microsoft.com/dotnet/floating-point-parsing-and-formatting-improvements-in-net-core-3-0/ |
| `pages/csharp/lecon-09.html#1` | VRAI (événement : Ariane 5, 1996) — sujet gardé par `ada/lecon-07` | remplacé par : .NET Framework 2.0 cesse d'avaler les exceptions non gérées des threads (2005) ; même notion : une exception ignorée ne disparaît pas. **Intertitre collé changé** : « l'exception qui a détruit une fusée » → « les exceptions que .NET avalait » | Cas réel — .NET 2.0 cesse d'avaler les exceptions des threads (2005) | https://learn.microsoft.com/en-us/previous-versions/dotnet/netframework-3.0/ms228965(v=vs.85) ; https://learn.microsoft.com/en-us/dotnet/framework/install/versions-and-dependencies ; https://learn.microsoft.com/en-us/dotnet/standard/threading/exceptions-in-managed-threads (version actuelle, sans la section historique) |
| `pages/csharp/lecon-10.html#1` | VRAI (événement : chargement de GTA Online, 2021) — sujet gardé par `algo/lecon-01` | remplacé par : coverage.py 7.6.9, un test d'appartenance sur une liste remplacé par le `set` déjà présent, 730 s → 13 s (décembre 2024) ; même notion : `List<T>.Contains` contre `HashSet<T>`. Intertitre « la bonne collection change tout » **gardé** (il dit le nouveau cas) | Cas réel — coverage.py et une liste de trop (2024) | https://github.com/nedbat/coveragepy/pull/1901 (et l'API : corps, commentaires, diff) ; https://coverage.readthedocs.io/en/latest/changes.html ; https://raw.githubusercontent.com/nedbat/coveragepy/346cfc03885571fd448f8218a8b9f12836c2fcb2/coverage/results.py ; https://coverage.readthedocs.io/en/latest/ |
| `pages/csharp/lecon-22.html#1` | VRAI (événement : clé d'accès publiée d'Uber, 2016) — sujet gardé par `iac/lecon-10` | remplacé par : la clé d'accès de Toyota T-Connect restée sur un dépôt GitHub public de décembre 2017 au 15/09/2022, 296 019 adresses (communiqué du 07/10/2022) ; même notion : les secrets hors du code et du dépôt | Cas réel — la clé d'accès de Toyota T-Connect restée sur GitHub (2022) | https://global.toyota/jp/newsroom/corporate/38095972.html (lu en japonais ; trouvé par les liens de https://www.theregister.com/2022/10/11/toyota_source_code_email_leak/ et de TechCrunch, non cités) |

## Décomptes

- 11 « Cas réel » lus, tous VRAI (déjà contre-relus au lot 1), tous des événements ou produits nommés.
- **11 remplacés** (dédoublonnage) ; 0 corrigé ; 0 gardé tel quel ; 0 renommé « Scénario ».
- Par cours : python 4, java 3, csharp 4. Intertitres collés : 1 changé (`csharp/09`), 1 gardé (`csharp/10`).
- Longueur des nouveaux récits (hors ligne de source) : de 159 à environ 190 mots (`java/15` et `python/39`
  raccourcis après un premier jet à 213 et 191 mots).

## Contrôles (sur l'état final commité)

| contrôle | code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=python` | 0 (50/50 conformes) |
| `node tools/verif-contenu.js --cas-reel --cours=java` | 0 (23/23) |
| `node tools/verif-contenu.js --cas-reel --cours=csharp` | 0 (23/23) |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-dd-py-java-cs 8fd5290` | 0 écart sur les 11 pages |
| `node tools/cas-reels/lots/controle-branche.js D:/test-claude-dd-py-java-cs 8fd5290` | 0 (0 CR, octets identiques hors « Cas réel », types gardés, signatures) |
| `node tools/verif.js --rapide` | 1 (seul rouge : `donnees`, I18, index de recherche périmé) |

`node tools/verif.js --rapide` : **code 1**, 275,2 s, 54 étapes jouées, **un seul signalement**, l'étape `donnees` pour l'invariant **I18** (« 1 index publié divergent du contenu regénéré » : `js/search-index.js`, écart +310 octets, attendu après la retouche de 11 leçons, régénéré par l'orchestrateur) — le seul rouge toléré par la consigne. Toutes les autres étapes OK (`contenu`, `exemple`, `lexique`, `etudes`…).

## Doutes et points ouverts

- **`python/04`** : les deux lignes de code ne sont publiées que par LWN (presse spécialisée, 06/11/2003) ;
  le message primaire de Larry McVoy (05/11/2003) ne donne que le fichier et les révisions. L'auteur
  de l'article LWN n'est signé que « corbet » : la ligne de source ne nomme donc que LWN.net.
- **`python/41`** : le correctif de juin 2008 est déposé par l'utilisateur « timehorse » ; son
  attribution à Jeffrey C. Jacobs tient au commentaire de 2014 (« Jeffrey's patch ») et au crédit de
  « What's New In Python 3.11 » (« Contributed by Jeffrey C. Jacobs and Serhiy Storchaka »).
- **`java/13`** : cas de conception (une JEP), pas un incident ; il est placé, comme l'ancien cas
  Azure, à la fin de la section sur les nombres, mais parle des dates.
- **`csharp/02`** : **une source primaire se trompe** — le billet de Microsoft écrit que
  `Math.PI.ToString()` « aurait dû renvoyer `3.1415926535897931` » ; .NET 10 renvoie
  `3.141592653589793` (la plus courte chaîne relisible, ce que le même billet annonce). L'exemple n'est
  pas repris ; le récit s'appuie sur `0.1 + 0.2`, testé (`0,30000000000000004` contre `0,3` en `G15`,
  culture `fr-FR`, celle des sorties de la leçon).
- **`csharp/09`** : la page actuelle « Exceptions in managed threads » a perdu sa section « Change from
  Previous Versions » ; la source citée est la version .NET Framework 3.0 conservée sur Microsoft Learn
  (mise à jour le 03/11/2006), complétée par la page des versions (.NET 2.0 livré avec Visual Studio 2005).
- **`csharp/22`** : source en japonais, lue dans le texte et paraphrasée ; aucune citation traduite.

## Consignes de fusion

- Fusionner `v18/b4-dd-py-java-cs` (5 commits au-dessus de `8fd5290`, aucun conflit attendu : seules
  les 11 pages et ce rapport changent).
- Régénérer ensuite les index dérivés (le contenu de 11 leçons a changé).
- Sujets à ajouter à `tools/cas-reels/lots/foyers.md` (foyers pris par cette passe) :
  porte dérobée de `wait4` (2003) → `python/lecon-04` ; PEP 282 / `logging` (2002) → `python/lecon-19` ;
  CVE-2020-10735 (2022) → `python/lecon-39` ; groupes atomiques de `re` / Python 3.11 (2022) →
  `python/lecon-41` ; Boeing 787, compteur des GCU (2015) → `java/lecon-02` ; JEP 150 / `java.time`
  (2014) → `java/lecon-13` ; GitHub, sessions échangées (2021) → `java/lecon-15` ; .NET Core 3.0 et
  les `double` (2019) → `csharp/lecon-02` ; .NET 2.0 et les exceptions des threads (2005) →
  `csharp/lecon-09` ; coverage.py 7.6.9 (2024) → `csharp/lecon-10` ; Toyota T-Connect (2022) →
  `csharp/lecon-22`.
- Contre-relecture : les 11 cas sont à confronter à leurs sources comme les autres (la ligne de
  source de chacun porte un lien direct).
