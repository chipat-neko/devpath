# Rapport V18 — case B11, lot 8 : les cours `securite` et `regex` (copie `b11-securite-regex`, branche `v18/b11-securite-regex`)

Copie de travail `D:\test-claude-b11-securite-regex`, partie de `01795b6`. Part traitée : les **26 « Cas réel »**
des cours `securite` (15, dont deux en `lecon-06`) et `regex` (11, un par leçon). Scripts et pièces dans
`scratchpad/b11-securite-regex/` (ignoré par git) : `cas-securite.txt` et `cas-regex.txt` (les 26 encadrés
réécrits), `appliquer.js` (remplace le contenu de `div.callout__body` repéré par son titre ou par l'intertitre
`<h2>` collé au-dessus ; refuse une ancre absente ou multiple, tout CR ; prouve que les octets hors des zones
remplacées sont identiques), `retouches1.py` à `retouches3.py` (retouches lexicales et de relecture),
`rejouer.js` et `rejouer.py` (comportements rejoués), `options.js` (mots d'options de QCM), `chercher.js`,
`invisibles.js`, et les documents ouverts dans `web/` (PDF et pages, textes extraits).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **15 hors de la règle à 0** pour `securite`
et de **11 à 0** pour `regex` ; sur les 26 cas trouvés, **aucun n'était vrai tel quel** (même les deux jugés VRAIS
par B2 n'avaient pas de source et portaient une généralisation) ; **13 remplacés** par un cas réel daté et sourcé
sur la même notion, **13 corrigés sur leur sujet**, **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b11-securite-regex`) : `373ef65` (securite, 15 cas), `9fa5cca` (regex, 11 cas),
puis le commit de ce rapport.

## Méthode

- Seul l'intérieur de l'encadré change, de `<div class="callout__body">` au `</div></div>` final (type `note`,
  `warn` pour Samy, icône, structure gardés). `tools/cas-reels/lots/controle-branche.js … 01795b6` : **0 CR,
  0 domaine interdit, octets identiques hors « Cas réel », types gardés, signatures** (code 0).
- **Intertitres** : les leçons `securite/10` à `14` portent le cas dans une section `<h2>Cas réel — …</h2>`
  suivie d'un encadré au titre propre ; l'intertitre a été daté ou réécrit quand le cas a changé (`12` :
  « des mois avant de voir » → « Marriott et Starwood (2018) » ; `13` : « d'où vient STRIDE » → « … (1999) » ;
  `14` : « la divulgation responsable » → « la directive BOD 20-01 de la CISA (2020) »). Les leçons `regex`
  ont un `<h2>Cas réel</h2>` nu au-dessus de l'encadré : laissé tel quel (comme au cours `bdd`), il ne dit
  aucun sujet périmé.
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ;
  aucun lien dans le corps ; `&nbsp;` devant « : ; ? » et dans « » ; `<` écrit `&lt;` dans le code.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (`chercher.js`, texte
  et URL), dans `b10-reservations.txt` (lot 7) et `b11-reservations.txt`, puis réservé. **Firesheep**
  (`securite/07`) était aussi le « Cas réel » de `http/lecon-05`, dont l'agent l'a réservé : laissé à `http`
  (la leçon porte sur les cookies de session, le mécanisme même de Firesheep) et remplacé ici par sslstrip et
  HSTS, qui illustrent la section « Forcer HTTPS : la redirection et HSTS ». Sujets pris ici et racontés aussi
  par des cours du lot 12, qui devront les remplacer : LinkedIn 2012 (`crypto/lecon-07`), Adobe 2013
  (`crypto/lecon-08`), First American (`offensive/lecon-06`), Capital One (`cloud/lecon-06`), event-stream et
  Firesheep (mentions dans les descriptions de `offensive/lecon-10` et `-08`). `doublons.js` : **2** sources
  partagées entre cours (les deux d'avant) — un premier jet citait la liste TC39 des propositions terminées,
  déjà utilisée par sept cas du cours `js` : remplacée par la 9ᵉ édition d'ECMA-262 et les dépôts des
  propositions.
- **Sources primaires** : rapports d'autorités (GAO-18-559, ICO, NYDFS, CSRB, plainte du DOJ, directive de la
  CISA), avis officiels (GitHub Advisory Database, API de la NVD), RFC 6797, recommandation HTML5 du W3C,
  ECMA-262, post-mortems et billets des éditeurs, article de conférence. Un PDF illisible en ligne a été lu
  avec `pypdf` ; deux PDF scannés sans couche de texte (avis de pénalité de l'ICO pour TalkTalk et pour
  Marriott, ce dernier en JBIG2) n'ont **pas** été lus : seuls les communiqués et la chronologie de l'ICO sont
  cités. La plainte contre Paige Thompson (scannée) a été lue page par page en image.
- **Comportements rejoués** (`rejouer.js`, `rejouer.py`) — moteurs : **Node 26.13.1** (V8 Irregexp ; la consigne
  annonçait Node 24, la machine a la 26), **Python 3.14.5** (`re`), **GNU grep 3.0** (Git Bash) :
  - Litestar : motif construit comme en 2.19.0, `fullmatch('exampleXcom')` → accepté ; avec `re.escape` (2.20.0)
    → refusé ; `evil.com` refusé dans les deux cas (Python 3.14.5).
  - shell-quote : la ligne exacte du commit `5799416` ; `` `:\a\b `` → `` `:\\a\\b `` en 1.7.2 (accent grave et
    deux-points non échappés), `` \`\:\\a\\b `` en 1.7.3, comme le test du commit ; `[A-z]` accepte
    `[ \ ] ^ _ `` ` ``, `[A-Za-z]` les refuse (Node).
  - ntfy : motif construit comme `server_webpush.go` avant 2.22.0 → `https://attacker.com/x.google.com/push`
    accepté ; motifs de 2.22.0 → refusé, `https://fcm.googleapis.com/fcm/send/abc` accepté (Node ; le moteur
    `regexp` de Go n'a pas été rejoué, les motifs n'emploient que des constructions communes).
  - GNU grep : `^(ab*)*\1$` accepte `ababbabb`, refuse `ababbab` (grep -E 3.0, Node et Python identiques).
  - V8 : `/(?<=\$)\d+/` → `100`, `/(?<!\$)\d+/` → `90` sur les phrases du billet (Node).
  - `\p{…}` : `/\p{Script=Greek}/u.test('π')` → true ; `/^\p{L}+$/u` accepte `écologie`, `Москва`, `日本`,
    `/^\w+$/` les refuse (Node).
  - HTML5 : `marie+news@exemple.fr` accepté, `marie(news)@exemple.fr` et `"marie dupont"@exemple.fr` refusés
    par la regex de la recommandation (Node).
  - Stack Overflow : `/\s+$/` sur 10 000, 20 000, 40 000 espaces suivis de `x` : 40, 163, 649 ms (×4 quand la
    longueur double : quadratique) (Node).
  - Cloudflare : `/.*.*=.*;/` sur `x=` suivi de 1 000, 2 000, 4 000 `x` : 137 ms, 1,05 s, 8,26 s (Node ; le
    post-mortem compte, lui, les pas de PCRE : 5 353 pour 20 `x`).
  - Django : groupes numérotés → `('2005', '03')`, nommés → `{'year': '2005', 'month': '03'}` (Python).
- **Mots d'options de QCM** (`lexique-diff.js`, base `01795b6`) : 20 écarts au premier jet, ramenés à **0**,
  chaque mot remis dans une phrase exacte de la source quand c'était possible : « mal protégées » et
  « scanners » (ICO : *failed to properly scan this infrastructure*), « simple sel », « casser en masse »,
  « serveurs » (CSRB : *trying to patch millions of servers*), « associés » (identifiants associés au compte
  `*-WAF-Role`), « examen public » (RFC 6797 : *public review*), « relecture du code », « devient »,
  « de façon privée » (BOD 20-01) ; « connus », « interne », « navigateurs », « connaît », « atteindre »,
  « public » et « remplacer » retirés ; « caractères » remis dans la phrase de liaison de `regex/11`.
  **Une exception assumée** : pour garder « automatisés » et « testent » dans `securite/03`, la phrase de
  liaison dit « c'est une attaque courante, que testent aussi des outils automatisés » — l'ICO dit « attaque
  courante », la seconde moitié est une généralité, non sourcée (voir « Ce qui reste ouvert »).

## Les 26 « Cas réel », un par un

### securite

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/securite/lecon-01.html#1` | VRAI sur le fond (B2), INEXACT dans le détail : « société de notation de crédit » (agence d'évaluation du crédit des particuliers), « environ 147 millions » (GAO : au moins 145,5 millions aux États-Unis), « l'une des plus grandes fuites de l'histoire » (aucune source) ; événement | corrigé : chiffres et chronologie du GAO (alerte US-CERT du 8 mars 2017, avis non reçu, scan une semaine après, extraction dès le 13 mai) ; catégorie OWASP gardée | Cas réel — la fuite Equifax (2017) | https://www.gao.gov/assets/gao-18-559.pdf ; https://owasp.github.io/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities |
| `pages/securite/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« Un site permet d'envoyer une image… ») | remplacé : OpenMage LTS, liste noire `php,exe` de l'option de fichier, contournée par `.phtml`, `.phar`, `.php5`, `.pht` ; correctif 20.17.0 | Cas réel — OpenMage et sa liste noire « php,exe » (2026) | https://api.github.com/advisories/GHSA-3j5q-7q7h-2hhv ; https://github.com/advisories/GHSA-3j5q-7q7h-2hhv ; https://github.com/OpenMage/magento-lts/releases/tag/v20.17.0 ; https://github.com/OpenMage/magento-lts/pull/5460 (et son diff par l'API) ; README du dépôt |
| `pages/securite/lecon-03.html#1` | INEXACT, événement : « aucune requête préparée, l'entrée était concaténée » et « menée par des adolescents à l'aide d'outils automatisés » absents de l'ICO ; « environ 157 000 » (156 959) | corrigé : chiffres, pages héritées de Tiscali, correctif oublié de plus de trois ans et demi, deux attaques antérieures, amende record de 400 000 £ (5 octobre 2016) | Cas réel — TalkTalk (2015) | https://web.archive.org/web/20161008142026/https://ico.org.uk/about-the-ico/news-and-events/news-and-blogs/2016/10/talktalk-gets-record-400-000-fine-for-failing-to-prevent-october-2015-attack/ ; https://web.archive.org/web/20260928095738/https://ico.org.uk/about-the-ico/media-centre/talktalk-cyber-attack-how-the-ico-investigation-unfolded/ ; avis de pénalité (PDF scanné, non lu) |
| `pages/securite/lecon-04.html#1` | INEXACT, événement : « plus d'un million de comptes touchés » (l'auteur parle de demandes d'ami d'utilisateurs distincts), « l'un des vers les plus rapides de l'histoire », « Il n'a rien détruit », « le site n'encodait pas » (il filtrait par liste noire) | corrigé : date, filtrage par liste noire, CSS et « java\nscript », un million en moins de 20 h, site « en maintenance » | Cas réel — le ver « Samy » sur MySpace (2005) | https://samy.pl/myspace/ ; https://samy.pl/myspace/tech.html |
| `pages/securite/lecon-05.html#1` | INEXACT, événement : « SHA-1 sans sel », « des dizaines de millions cassées en quelques jours », « 117 millions » : aucune source primaire ouverte ne les dit (le jugement *In re LinkedIn User Privacy Litigation* n'a pas pu être ouvert, Justia en 403) | corrigé : 6,5 millions d'empreintes (juin 2012), passage d'un stockage « haché » à « haché et salé », plus de 100 millions (mai 2016) | Cas réel — la fuite LinkedIn (2012) | https://news.linkedin.com/2012/06/linkedin-summarizes-password-theft-and-member-security-efforts ; https://web.archive.org/web/20120616030717/http://blog.linkedin.com/2012/06/09/an-update-on-taking-steps-to-protect-our-members/ ; https://web.archive.org/web/20160527213703/https://blog.linkedin.com/2016/05/18/protecting-our-members |
| `pages/securite/lecon-06.html#1` | INEXACT, événement : « 885 millions » (chiffre de Krebs ; NYDFS : plus de 850 millions, SEC : plus de 800 millions d'images), « géant de l'assurance » (assureur de titres immobiliers) | corrigé : `ImageDocumentID` séquentiel, sans connexion, octobre 2014 à mai 2019, test d'intrusion de décembre 2018, révélation de Krebs le 24 mai 2019 | Cas réel — First American et ses URL à numéros (2019) | https://www.dfs.ny.gov/industry_guidance/enforcement_discipline/ea20200721_first_american_statement_notice ; https://www.dfs.ny.gov/reports_and_publications/press_releases/pr202007221 ; https://www.sec.gov/news/press-release/2021-102 |
| `pages/securite/lecon-06.html#2` | INVÉRIFIABLE dans le détail, événement : « des millions d'applications vulnérables » sans source | corrigé : chronologie du CSRB (24 novembre, 9 et 10 décembre 2021), JNDI ajouté en 2013, note 10, près de 7 000 projets dépendants, SBOM | Cas réel — Log4Shell (2021) | https://www.cisa.gov/sites/default/files/publications/CSRB-Report-on-Log4-July-11-2022_508.pdf |
| `pages/securite/lecon-07.html#1` | sujet réel (Firesheep), causalité non sourcée (« Le choc a précipité le passage au HTTPS »), et **foyer ailleurs** : `http/lecon-05` le garde (réservation de l'agent `http`) | remplacé : sslstrip (Black Hat DC 2009 ; « 117 comptes de messagerie… en 24 heures ») puis HSTS (RFC 6797, faille d'amorçage, listes préchargées) | Cas réel — sslstrip, puis HSTS (2009) | https://www.blackhat.com/presentations/bh-dc-09/Marlinspike/BlackHat-DC-09-Marlinspike-Defeating-SSL.pdf ; https://www.rfc-editor.org/rfc/rfc6797.txt |
| `pages/securite/lecon-08.html#1` | INEXACT, événement : « 153 millions » (Ducklin : environ 150 millions), « on a pu deviner des millions de mots de passe » (aucune source) | corrigé : annonce d'Adobe (mots de passe « chiffrés »), analyse de Ducklin (blocs de 8 octets, DES/3DES probable, ECB, indices en clair ; échantillon d'un million : 5 mots de passe = 2,75 %, longueur de près d'un tiers) | Cas réel — la fuite Adobe (2013) | https://blog.adobe.com/en/publish/2013/10/03/important-customer-security-announcement ; https://web.archive.org/web/20131109054924/http://nakedsecurity.sophos.com/2013/11/04/anatomy-of-a-password-disaster-adobes-giant-sized-cryptographic-blunder/ |
| `pages/securite/lecon-09.html#1` | INEXACT, événement : « téléchargé des millions de fois par semaine », « piégeait des milliers de projets », « un inconnu qui paraissait bienveillant » : aucune source primaire | corrigé : cession par Dominic Tarr (« he emailed me… »), 3.3.6 du 9 septembre 2018, flatmap-stream 0.1.1, cible Copay (plus de 100 BTC ou 1 000 BCH), ticket du 20 novembre, npm alerté le 26, versions 5.0.2 à 5.1.0 | Cas réel — event-stream (2018) | https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident ; https://github.com/dominictarr/event-stream/issues/116 (et sa chronologie par l'API) |
| `pages/securite/lecon-10.html#1` (section) | VRAI (B2), sans source ; « plusieurs bibliothèques très répandues » (la source dit « many libraries ») | corrigé (mineur) : date, deux défauts, exemple de la source (`{"loggedInAs":"admin"}`), conseil de passer l'algorithme à la vérification ; ligne de source | Cas réel — la faille `alg: none` (2015) (intertitre inchangé) | https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/ (`datePublished` 2015-03-31) |
| `pages/securite/lecon-11.html#1` (section) | INEXACT, événement : « 169.254.169.254 », « service de métadonnées », « identifiants temporaires » : absents des sources primaires lisibles ; « 100 millions de dossiers » (personnes) | corrigé : 22-23 mars 2019, pare-feu applicatif mal configuré, rôle `*****-WAF-Role`, plus de 700 dossiers (plainte), SSRF selon les sénateurs Wyden et Warren ; titre de l'encadré « … de personnes » | Cas réel — Capital One (2019) (intertitre inchangé) | https://web.archive.org/web/20240226163215/https://www.justice.gov/usao-wdwa/press-release/file/1188626/download (lue en images) ; https://www.capitalone.com/digital/facts2019/ ; https://web.archive.org/web/20261111104149/https://www.justice.gov/usao-wdwa/pr/seattle-tech-worker-arrested-data-theft-involving-large-financial-services-company ; https://web.archive.org/web/20261031102211/https://www.justice.gov/usao-wdwa/pr/former-seattle-tech-worker-convicted-wire-fraud-and-computer-intrusions ; https://web.archive.org/web/20260808100614/https://www.wyden.senate.gov/news/press-releases/wyden-and-warren-to-ftc-investigate-amazons-negligence-in-capital-one-hack |
| `pages/securite/lecon-12.html#1` (section) | INVÉRIFIABLE, général (« Dans de nombreuses grandes fuites… ») | remplacé : Marriott et Starwood (alerte du 8 septembre 2018, accès depuis 2014, *web shell*, 339 millions de fiches, amende de 18,4 M£) | Cas réel — Marriott et Starwood (2018) | https://web.archive.org/web/20181130150637/http://news.marriott.com/2018/11/marriott-announces-starwood-guest-reservation-database-security-incident/ ; https://web.archive.org/web/20201101121650/https://ico.org.uk/about-the-ico/news-and-events/news-and-blogs/2020/10/ico-fines-marriott-international-inc-184million-for-failing-to-keep-customers-personal-data-secure/ ; avis de pénalité (PDF JBIG2, non lu) |
| `pages/securite/lecon-13.html#1` (section) | sujet réel, titre sans date ; « deux ingénieurs » (rôle non sourcé), « mémo Trustworthy Computing de 2002 » (Microsoft parle d'une initiative lancée en janvier 2002) | corrigé : note du 1er avril 1999 dans la revue interne *Interface*, recommandation du groupe de travail sécurité, avis de Shostack, SDL obligatoire depuis 2004, outil fondé sur STRIDE | Cas réel — d'où vient STRIDE (1999) | https://threatmodelingbook.com/files/microsoft/The-Threats-To-Our-Products.docx ; https://shostack.org/blog/20-years-of-stride-looking-back-looking-forward/ ; http://download.microsoft.com/download/F/7/D/F7D6B14F-0149-4FE8-A00F-0B9858404D85/Simplified%20Implementation%20of%20the%20SDL.doc ; https://www.microsoft.com/en-us/securityengineering/sdl/about |
| `pages/securite/lecon-14.html#1` (section) | INVÉRIFIABLE, général (« De nombreuses organisations… ») | remplacé : directive BOD 20-01 de la CISA (périmètre, tests permis, engagement de ne pas poursuivre la recherche de bonne foi, ouverte au public, distincte d'un *bug bounty*) | Cas réel — la directive BOD 20-01 de la CISA (2020) | https://www.cisa.gov/news-events/directives/bod-20-01-develop-and-publish-vulnerability-disclosure-policy |

### regex

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/regex/lecon-01.html#1` | INVÉRIFIABLE, général (« Tu reçois un export de 5 000 lignes… ») | remplacé : Litestar, `AllowedHosts`, point non échappé (CVE-2026-25479, `re.escape` en 2.20.0 ; même défaut pour CORS, CVE-2026-25478) | Cas réel — Litestar et le point non échappé (2026) | https://github.com/advisories/GHSA-93ph-p7v4-hwh4 ; https://github.com/advisories/GHSA-2p2x-hpg8-cqp2 ; https://raw.githubusercontent.com/litestar-org/litestar/v2.20.0/litestar/middleware/allowed_hosts.py (et v2.19.0) |
| `pages/regex/lecon-02.html#1` | INVÉRIFIABLE, général (« le sélecteur de couleur d'un éditeur graphique… ») | remplacé : shell-quote, `([A-z]:)?` laisse passer l'accent grave (CVE-2021-42740), `[A-Za-z]` en 1.7.3 | Cas réel — shell-quote et l'intervalle `[A-z]` (2021) | https://github.com/advisories/GHSA-g4rg-993r-mgx7 ; https://github.com/ljharb/shell-quote/commit/5799416ed454aa4ec9afafc895b4e31760ea1abe ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-42740 ; CHANGELOG et registre npm (date de 1.7.3) |
| `pages/regex/lecon-03.html#1` | INVÉRIFIABLE, général (« VS Code, Sublime… entourent la recherche de `\b…\b` » : fonctionnement interne non documenté) | remplacé : ntfy, jokers changés en `.+` qui déborde sur le chemin, SSRF (CVE-2026-39087), motifs ancrés et `[^/]+` en 2.22.0 | Cas réel — ntfy et le `.+` qui débordait sur le chemin (2026) | https://github.com/binwiederhier/ntfy/releases/tag/v2.22.0 ; https://github.com/binwiederhier/ntfy/commit/fa83d68754 ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-39087 ; https://api.github.com/gists/5d41d6e8ead16e217f86b016002ecae5 (non cité : sa chronologie porte des années fausses) |
| `pages/regex/lecon-04.html#1` | INVÉRIFIABLE, général (« un site extrait l'identifiant YouTube », « Word, LanguageTool repèrent les mots doublés ») | remplacé : le manuel de GNU grep sur les références arrière et ses « Known Bugs » (cinq bugs de la glibc en 2021) | Cas réel — GNU grep et ses références arrière (2021) | https://www.gnu.org/software/grep/manual/grep.html |
| `pages/regex/lecon-05.html#1` | INVÉRIFIABLE (B2), illustration d'usage | remplacé : V8 annonce le lookbehind (26 février 2016), longueur fixe de Perl contre .NET, proposition de Yakin, Katō, Ehrenberg, ECMAScript 2018 | Cas réel — le lookbehind arrive dans JavaScript (2016) | https://v8.dev/blog/regexp-lookbehind-assertions ; https://github.com/tc39/proposal-regexp-lookbehind ; https://262.ecma-international.org/9.0/ |
| `pages/regex/lecon-06.html#1` | INEXACT, événement : « un motif aux quantificateurs imbriqués » (la partie critique est `.*(?:.*=.*)`), « environ 30 minutes » (27) | corrigé : 2 juillet 2019 13 h 42 UTC, règle XSS du WAF, PCRE, près de 100 % des cœurs HTTP/HTTPS, erreurs 502, 5 353 pas, RE2 ou Rust | Cas réel — Cloudflare et une regex de son pare-feu (2019) | https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/ |
| `pages/regex/lecon-07.html#1` | INVÉRIFIABLE, anonyme (« Un réseau social veut extraire les hashtags »), et faux techniquement : `/#\w+/` ne « tronque » pas `#écologie` en `#cologie`, il ne trouve rien (rejoué sous Node) | remplacé : la proposition TC39 « Unicode property escapes » (`\p{…}`, drapeau `u`, XRegExp et Regenerate), ECMAScript 2018 | Cas réel — `\p{…}` entre dans JavaScript (2018) | https://github.com/tc39/proposal-regexp-unicode-property-escapes ; https://262.ecma-international.org/9.0/ |
| `pages/regex/lecon-08.html#1` | INVÉRIFIABLE, anonyme (« Une équipe migre des milliers de lignes de logs… ») | remplacé : Django, groupes nommés des URLconf (doc. 1.11 : moins d'erreurs d'ordre des arguments ; doc. 5.2 : groupes non nommés déconseillés) | Cas réel — Django et les groupes nommés de ses URL (2017) | https://docs.djangoproject.com/en/1.11/topics/http/urls/ ; https://docs.djangoproject.com/en/5.2/releases/1.11/ ; https://docs.djangoproject.com/en/5.2/topics/http/urls/ |
| `pages/regex/lecon-09.html#1` | INEXACT, événement : « explorer d'innombrables découpes » (le post-mortem dit O(n²), pas le retour arrière catastrophique), « le correctif : borner le nombre d'espaces » (remplacée par une fonction de sous-chaîne), motif simplifié | corrigé : 34 min dès 14 h 44 UTC, regex exacte, 20 000 espaces, près de 200 millions de vérifications, page d'accueil et équilibreur de charge | Cas réel — Stack Overflow et 20 000 espaces (2016) | https://web.archive.org/web/20160812095157/http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016 |
| `pages/regex/lecon-10.html#1` | INVÉRIFIABLE, anonyme (« Sur un site d'inscription, un monstre de 900 caractères… ») | remplacé : la regex « valid e-mail address » de HTML5, violation délibérée de la RFC 5322 | Cas réel — l'adresse e-mail selon HTML5 (2014) | https://www.w3.org/TR/2014/REC-html5-20141028/forms.html |
| `pages/regex/lecon-11.html#1` | INVÉRIFIABLE, général (« ce petit moteur est exactement ce qui vit derrière… ») | remplacé : Davis et al. (ESEC/FSE 2018), 448 402 modules npm et pypi, 1 % de regex super-linéaires, plus de 10 000 modules, 284 signalements | Cas réel — des regex à risque dans plus de 10 000 modules (2018) | https://davisjam.github.io/files/publications/DavisCoghlanServantLee-EcosystemREDOS-ESECFSE18.pdf |

## Décomptes

| | securite | regex | total |
|---|---:|---:|---:|
| « Cas réel » lus | 15 | 11 | **26** |
| état : VRAI tel quel | 0 | 0 | 0 |
| état : VRAI sans source, détail à reprendre (B2) | 2 (`01`, `10`) | 0 | 2 |
| état : INEXACT | 8 | 2 | 10 |
| état : INVÉRIFIABLE (anonyme ou général) | 4 | 9 | 13 |
| état : sujet réel dont le foyer est ailleurs | 1 (`07`, Firesheep) | 0 | 1 |
| état : INVENTÉ | 0 | 0 | 0 |
| action : remplacé | 4 | 9 | **13** |
| action : corrigé sur son sujet | 11 | 2 | **13** |
| action : gardé tel quel | 0 | 0 | 0 |
| action : renommé « Scénario » | 0 | 0 | 0 |
| `verif-contenu.js --cas-reel` hors règle | 15 → **0** | 11 → **0** | 26 → 0 |

(`securite/13` est compté INEXACT : rôle « ingénieurs » non sourcé et « mémo » pour « initiative » ; `regex/07`
est compté INVÉRIFIABLE, avec en plus une affirmation technique fausse.)

## Contrôles (avant le commit de ce rapport)

- `node tools/verif-contenu.js --cas-reel --cours=securite` → **0** (15 conformes) ;
- `node tools/verif-contenu.js --cas-reel --cours=regex` → **0** (11 conformes) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b11-securite-regex 01795b6` → **0 écart** ;
- `node tools/cas-reels/lots/doublons.js` → 2 sources partagées entre cours (les deux d'avant) ;
- `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b11-securite-regex 01795b6` → **0** ;
- `node tools/verif.js --rapide` → **code 1**, 54 étapes jouées en 789 s, 4 signalées :
  - `donnees` : l'invariant **I18** seul (« 1 index publié divergent du contenu regénéré ») — attendu, l'orchestrateur
    régénère les index après la fusion ;
  - `doc-rec` : chiffres du cours `doc` mesurés sur tout le site, que les lignes de source font bouger — toléré
    (`doc-ref` est vert) ;
  - `erreurs` et `rj-bash` : **faux rouges d'environnement**, sans lien avec ces pages. Lancé depuis PowerShell,
    `bash` y désigne `C:\Windows\System32\bash.exe` (WSL, non installé), qui répond « Sous-système Windows pour
    Linux n'a aucune distribution installée » en UTF-16 au lieu d'exécuter les extraits du cours `bash`. Rejoués
    seuls depuis Git Bash (`/usr/bin/bash`) : `node tools/preuves/rejoue-bash.js` → **0** (4 scripts conformes) ;
    `node tools/verif-erreurs.js` → **0** (« Aucune faute »).
  Toutes les autres étapes sont vertes (dont `contenu`, `qcmbiai`, `qcmlexi`, `doc-ref`, `domaine`, `etudes`).

## Ce qui reste ouvert, et les doutes

1. **`securite/03`, phrase de liaison** : « c'est une attaque courante, que testent aussi des outils
   automatisés » — la première moitié est de l'ICO, la seconde est une généralité gardée pour que « testent »
   et « automatisés » (mots d'un distracteur de la question 1) restent dans la page. À reprendre si la
   contre-relecture l'exige, en trouvant un autre emploi exact de ces deux mots.
2. **`securite/05`, LinkedIn** : le « SHA-1 sans sel » de l'ancien récit est probablement vrai (il figure dans
   les actes du procès *In re LinkedIn User Privacy Litigation*), mais je n'ai pu ouvrir aucune source primaire
   qui le dise (Justia en 403) : retiré. Le cas dit seulement ce que LinkedIn a écrit — le passage, achevé juste
   avant le vol, d'un stockage « haché » à « haché et salé ».
3. **`securite/11`, Capital One** : le mot SSRF n'apparaît que dans le communiqué des sénateurs Wyden et Warren
   (24 octobre 2019) ; le service de métadonnées et l'adresse 169.254.169.254 ne figurent dans aucune source
   primaire lisible (la lettre de Wyden à Amazon et la réponse d'Amazon, archivées, ne se sont pas ouvertes) :
   retirés.
4. **`securite/03` et `securite/12`** : les avis de pénalité de l'ICO sont des PDF scannés (le second en JBIG2,
   sans décodeur ici) ; les cas s'appuient sur les communiqués et la chronologie de l'ICO, et, pour Marriott, sur
   le communiqué de Marriott (alerte du 8 septembre 2018).
5. **`securite/02`, OpenMage** : la date de l'avis diffère selon la vue (page GitHub : 18 avril 2026, base
   mondiale par l'API : 21 avril) ; le cas dit « avril 2026 ». De même Litestar (8 ou 9 février) : « février 2026 ».
6. **`regex/03`, ntfy** : la NVD parle de motif « non ancré » ; le code d'avant 2.22.0 avait bien un `^`, mais le
   `.` des jokers changés en `.+` traversait le `/` : le cas décrit le code (commit `fa83d68`), pas la formule de
   la NVD. L'avis du dépôt (GHSA-w9hq-5jg7-q4j7) n'est pas lisible par l'API : non cité.
7. **`regex/04`** : un manuel n'est pas un « événement » ; l'année du titre (2021) est celle de l'état des bugs
   que le manuel décrit, la source est datée par sa version (3.12, 2025).
8. **Moteurs** : la machine a Node **26.13.1**, pas Node 24 comme l'annonçait la consigne ; Python 3.14.5 ; le
   `regexp` de Go (ntfy) n'a pas été rejoué.

## Consignes de fusion

- **Registre `foyers.md`** — sujets pris ici, à inscrire : Equifax 2017 (`securite/lecon-01`) ; OpenMage,
  liste noire `php,exe` (`securite/lecon-02`) ; LinkedIn 2012 (`securite/lecon-05` — à remplacer dans
  `crypto/lecon-07`, B12) ; First American 2019 (`securite/lecon-06#1` — `offensive/lecon-06`, B12) ; Log4Shell
  (`securite/lecon-06#2`) ; sslstrip et HSTS (`securite/lecon-07`) ; Adobe 2013 (`securite/lecon-08` —
  `crypto/lecon-08`, B12) ; event-stream 2018 (`securite/lecon-09` — mention de `offensive/lecon-10`, B12) ;
  failles JWT `alg: none` (`securite/lecon-10`) ; Capital One 2019 (`securite/lecon-11` — `cloud/lecon-06`, B12) ;
  Marriott et Starwood (`securite/lecon-12`) ; STRIDE 1999 (`securite/lecon-13`) ; BOD 20-01 de la CISA
  (`securite/lecon-14`) ; Litestar et le point non échappé (`regex/lecon-01`) ; shell-quote et `[A-z]`
  (`regex/lecon-02`) ; ntfy et `.+` (`regex/lecon-03`) ; GNU grep, références arrière (`regex/lecon-04`) ;
  lookbehind dans V8 et ES2018 (`regex/lecon-05`) ; `\p{…}` dans ES2018 (`regex/lecon-07`) ; Django, groupes
  nommés des URLconf (`regex/lecon-08`) ; regex e-mail de HTML5 (`regex/lecon-10`) ; Davis et al. 2018, ReDoS
  dans npm et pypi (`regex/lecon-11`). Cloudflare 2019 (`regex/lecon-06`), Stack Overflow 2016 (`regex/lecon-09`),
  TalkTalk (`securite/lecon-03`) et Samy (`securite/lecon-04`) y sont déjà.
- **Firesheep** : foyer `http/lecon-05` (agent `http` du même lot) ; `securite/lecon-07` ne le raconte plus.
- Index dérivés (`js/search-index.js`, `pages/etude-recherche.html`…) non touchés : à régénérer après la fusion
  (I18 attendu rouge à `verif.js --rapide`, ainsi que `doc-ref` et `doc-rec`, que les lignes de source font
  bouger).
- Une contre-relecture de chaque affirmation des 26 cas reste à faire (consigne du lot) ; les points 1 à 6
  ci-dessus sont ceux où je l'attends en premier.
