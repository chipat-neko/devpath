# Rapport V18 — case B12, lot 9 : les cours `offensive` et `cloud` (copie `b12-offensive-cloud`, branche `v18/b12-offensive-cloud`)

Copie de travail `D:\test-claude-b12-offensive-cloud`, partie de `8c65449`. Part traitée : les **24 « Cas réel »**
des cours `offensive` (12, un par leçon ; les leçons 01 à 03 en encadré, 04 à 12 en section `<h2>`) et `cloud`
(12 encadrés, un par leçon). Scripts et pièces dans `scratchpad/b12-offensive-cloud/` (ignoré par git) :
`cas-offensive.txt` et `cas-cloud.txt` (les 24 cas réécrits), `appliquer.js` (remplace l'intérieur de
`div.callout__body` repéré par son titre, ou la section de `<h2>Cas réel…</h2>` au `<h2>` suivant ; refuse une ancre
absente ou ambiguë et tout CR ; prouve que les octets hors zone sont identiques), `callout-l12.txt` (l'encadré
« Ce que ce cas dit de l'étape 1 » de `offensive/lecon-12`, recopié à l'octet), `chercher.js`, `mentions.js`,
`options.js`, `lire.js`, `mots.js`, et les documents ouverts dans `web/` (pages, PDF et leurs textes extraits).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **12 hors de la règle à 0** pour `offensive` et
de **12 à 0** pour `cloud` ; sur les 24 cas trouvés, **aucun n'était vrai tel quel** (pas même `offensive/lecon-10`,
jugé VRAI par B2, dont le sujet a son foyer ailleurs) ; **12 remplacés** par un cas réel daté et sourcé sur la même
notion, **12 corrigés sur leur sujet**, **0 gardé tel quel**, **0 renommé « Scénario »**.

**Commits** (branche `v18/b12-offensive-cloud`) : `eb8a57a` (cloud, 12 cas), `807ad0e` (offensive, 12 cas), puis le
commit de ce rapport.

## Méthode

- Seul l'intérieur du « Cas réel » change : pour les encadrés, du `<p class="callout__title">` au `</div></div>`
  (types `note` et `warn` gardés, icône gardée) ; pour les sections d'`offensive`, de l'intertitre `<h2>` au `<h2>`
  suivant. Les intertitres `<h2>Cas réel</h2>` nus au-dessus des encadrés d'`offensive/01` à `03` et les
  `<h2>Un cas concret</h2>` de `cloud` ne disent aucun sujet : laissés tels quels. Les sections `offensive/04` à `12`
  reçoivent leur sujet et leur date dans l'intertitre lui-même. `offensive/lecon-12` garde, à l'octet, son encadré
  « Ce que ce cas dit de l'étape 1 » (commentaire de la leçon) ; la ligne de source est placée après lui, en
  dernier paragraphe de la section. `controle-branche.js … 8c65449` → **0** (0 CR, 0 domaine interdit, octets
  identiques hors « Cas réel », types gardés, signatures).
- Forme : titre `Cas réel — sujet (année)`, dernier paragraphe `<p class="cas-reel__source">` daté et lié ; aucun
  lien dans le corps ; `&nbsp;` devant « : ; ? » et dans « » ; aucun bloc de code.
- **Un sujet = un seul cours** : chaque sujet cherché dans `foyers.md`, dans tout `pages/` (texte et URL de la
  source, `chercher.js`), puis réservé dans `b12-reservations.txt` (aucun conflit avec les quatre autres agents ;
  `crypto/lecon-09` a pris Storm-0558, distinct du jeton SAS d'`offensive/lecon-09`). Sujets écartés en cours de
  route parce qu'un autre cours les garde : MOVEit (`sql/lecon-14`), Drupalgeddon (`php/lecon-07`), Heartland
  (`nodejs/lecon-15`), CircleCI (`cicd/lecon-07`), Okta et les fichiers HAR (`http/lecon-11`), Toyota T-Connect
  (`csharp/lecon-22`), ProxyLogon (proche de HAFNIUM, `powershell/lecon-13`), CrowdStrike (`js/lecon-30`),
  Peloton (`api/lecon-06`).
- **Sources primaires** : arrêt de la Cour de cassation (Légifrance, copie de l'Internet Archive, la page vivante
  étant derrière un défi anti-robot), jugement du tribunal de commerce de Lille Métropole (PDF lu avec `pypdf`),
  rapport du BEA-RI (PDF), rapport de l'OIG du HHS (PDF), Legal Update de la législature de l'Iowa (PDF), directive
  de la CISA, fiches de la NVD par l'API du NIST, avis GHSA de `php-src` par l'API de GitHub, déclaration 8-K/A à la
  SEC (EDGAR), communiqué de l'ICO, rapport du Commissariat canadien, post-mortems et billets des fournisseurs
  (AWS, Google Cloud, Azure, Netflix, Microsoft MSRC, Mandiant, PyTorch), publications des chercheurs (Böck,
  CynoSure Prime, Carroll et Curry, Wiz, DEVCORE, Freund), message de liste de diffusion (xz-devel). Aucun article
  de presse n'est cité.
- **Ce qui n'a pas été repris** faute de source primaire ouverte : la citation de Tom McAndrew et les clauses du
  contrat (alarmes, portes) de l'ancien cas Coalfire ; la « clé privée précise » et la liste des distributions de
  l'ancien cas xz ; la « base de données » que Freund aurait mesurée (il écrit « micro-benchmarking ») ;
  « services de streaming, objets connectés », « les architectures multi-régions ont basculé » (AWS 2021) ;
  « une large partie du web est tombée » (S3 2017) ; « le pic du samedi soir » (Netflix) ; « un écran mural » (SRE).
- **Mots d'options de QCM** (`lexique-diff.js`, base `8c65449`) : 24 écarts au premier jet, ramenés à **1**, chaque
  mot remis dans une phrase exacte de la source quand il le fallait : « derrière » (Böck : l'attaquant laisse
  derrière lui une porte dérobée, *leaving a webshell*), « comprises » (DEVCORE : toutes les versions de PHP sous
  Windows, branches abandonnées comprises), « ajoute » (Twitter ajoute qu'aucune information de compte n'a été
  compromise), « n'exigeait » (McHire : la requête n'exigeait aucun droit sur la conversation visée), « frontale »
  (CynoSure : une attaque frontale contre bcrypt, *extremely compute intensive*), « identifiants » (offensive/09),
  « comptes » (`/etc/passwd`, la liste des comptes du système), « prenaient » et « d'origine » (xz) ; retirés :
  « nombre », « exposées », « serveurs », « mettre », « données », « privées », « exécuté », « avaient »,
  « n'existait », « ajoutée », « demandée », « procureur », « juridique », « sources » (la ligne de source
  d'`offensive/12` dit « Source : », au singulier, comme 96 lignes du site qui listent plusieurs documents).
  **L'écart restant est structurel** : « source » entre dans `cloud/lecon-12` par la classe `cas-reel__source`
  elle-même (le tokeniseur lit le HTML) ; il touche le distracteur « Du code source » de la question 1. Les deux
  cliquets QCM sont verts.

## Les 24 « Cas réel », un par un

### offensive

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/offensive/lecon-01.html#1` | INVENTÉ, récit fictif (« une société fictive que nous appellerons Rideau ») raconté comme réel | remplacé : l'extranet de l'ANSES — accès dû à une défaillance technique, maintien après avoir vu le contrôle d'accès, archive de 7,7 Go ; relaxe, condamnation en appel (5 février 2014, 3 000 €) pour maintien frauduleux et vol, pourvoi rejeté | Cas réel — l'extranet de l'ANSES devant la Cour de cassation (2015) | https://web.archive.org/web/20211106153408/https://www.legifrance.gouv.fr/juri/id/JURITEXT000030635061/ |
| `pages/offensive/lecon-02.html#1` | INVÉRIFIABLE, anonyme (« Une équipe prépare une démonstration… », préproduction) | remplacé : Hanno Böck, journaux de Certificate Transparency comme flux de noms neufs, installateurs PHP sans authentification ; 5 000 WordPress, 500 Joomla, 120 Nextcloud en trois mois, sans prise de contrôle ; seul Joomla corrige ; attaques réelles en 2022 | Cas réel — Hanno Böck et les installations web repérées par la Certificate Transparency (2017) | https://web.archive.org/web/20170728231315/https://www.golem.de/news/certificate-transparency-hacking-web-applications-before-they-are-installed-1707-129172.html ; https://www.feistyduck.com/newsletter/issue_89_certificate_transparency_data_is_used_to_compromise_wordpress_before_installation ; https://slides.hboeck.de/defcon-ct-web/ (non cité) |
| `pages/offensive/lecon-03.html#1` | INVENTÉ, récit fictif (l'équipe qui entretient « Rideau », quatre tickets CVSS) | remplacé : Ivanti Connect Secure, CVE-2023-46805 (8,2, PR:N) + CVE-2024-21887 (9,1, PR:H) enchaînées, directive d'urgence ED 24-01 | Cas réel — Ivanti Connect Secure, deux failles enchaînées (2024) | https://www.cisa.gov/news-events/directives/ed-24-01-mitigate-ivanti-connect-secure-and-ivanti-policy-secure-vulnerabilities ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2023-46805 ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2024-21887 |
| `pages/offensive/lecon-04.html#1` (section) | sujet réel (TalkTalk 2015) dont le **foyer est `securite/lecon-03`** | remplacé : PHP-CGI, CVE-2024-4577 — la parade de CVE-2012-1823 (refus d'un tiret en tête) contournée par la conversion Best-Fit de Windows (0xAD → 0x2D, pages de codes 932, 936, 950) ; signalé le 7 mai 2024, corrigé le 6 juin, NVD 9,8, KEV de la CISA le 12 juin | Cas réel — PHP-CGI et la parade de 2012 contournée (2024) | https://devco.re/blog/2024/06/06/security-alert-cve-2024-4577-php-cgi-argument-injection-vulnerability-en/ ; https://github.com/php/php-src/security/advisories/GHSA-3qgc-jrrr-25jv (et l'API) ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2024-4577 |
| `pages/offensive/lecon-05.html#1` (section) | sujet réel (ver Samy 2005) dont le **foyer est `securite/lecon-04`** | remplacé : Twitter, faille XSS « onMouseOver » du 21 septembre 2010 — couleurs, fenêtre au survol, retweets à l'insu ; déjà corrigée le mois précédent, rouverte par une mise à jour | Cas réel — Twitter et la faille « onMouseOver » (2010) | https://web.archive.org/web/20100922002301/http://blog.twitter.com/2010/09/all-about-onmouseover-incident.html (et la copie de 2017) |
| `pages/offensive/lecon-06.html#1` (section) | sujet réel (First American 2019) dont le **foyer est `securite/lecon-06`** | remplacé : McHire (Paradox.ai) — identifiants 123456/123456, IDOR sur `lead_id` (≈ 64 185 742), plus de 64 millions de candidats selon les chercheurs ; réponse de Paradox.ai (compte inutilisé depuis 2019, 7 enregistrements téléchargés, dont 5 avec des données) | Cas réel — McHire, l'identifiant qu'il suffisait de décrémenter (2025) | https://ian.sh/mcdonalds ; https://www.paradox.ai/blog/responsible-security-update |
| `pages/offensive/lecon-07.html#1` (section) | VRAI sur le fond, INEXACT dans le détail : le jeton MD5 présenté comme général (il ne valait que pour les comptes créés avant le 14 juin 2012 ou modifiés avant un autre changement), « une attaque frontale aurait demandé des années » (non dit), dates du piratage sans source | corrigé : The Impact Team, fuite des 18 et 20 août 2015 (≈ 36 millions de comptes, code source), bcrypt coût 12, `$loginkey` en MD5, 11,2 millions retrouvés dont 2,6 millions en quelques heures sur une machine | Cas réel — Ashley Madison et le jeton MD5 (2015) | https://cynosureprime.blogspot.com/2015/09/how-we-cracked-millions-of-ashley.html ; https://www.priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/2016/pipeda-2016-005/ |
| `pages/offensive/lecon-08.html#1` (section) | sujet réel (Firesheep 2010) dont le **foyer est `http/lecon-05`** (tranché au lot 8) | remplacé : 23andMe, bourrage d'identifiants d'avril à septembre 2023, ≈ 0,1 % des comptes, profils DNA Relatives d'autres clients ; mots de passe réinitialisés (10 octobre), vérification en deux étapes (6 novembre) ; amende de l'ICO de 2,31 M£ (17 juin 2025) | Cas réel — 23andMe et le bourrage d'identifiants (2023) | https://www.sec.gov/Archives/edgar/data/1804591/000119312523287449/d242666d8ka.htm ; https://cy.ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/06/23andme-fined-for-failing-to-protect-uk-users-genetic-data |
| `pages/offensive/lecon-09.html#1` (section) | sujet réel (Uber 2016) dont le **foyer est `iac/lecon-10`** (registre : « mentions dans offensive/lecon-09 … à relire » — c'est le même récit) | remplacé : le jeton SAS de `robust-models-transfer` (20 juillet 2020), compte entier et « contrôle total », expiration repoussée à 2051 ; 38 To dont deux sauvegardes de postes ; révoqué le 24 juin 2023 ; l'outil de rescan de Microsoft l'avait vu et classé faux positif | Cas réel — le jeton SAS de Microsoft publié sur GitHub (2023) | https://www.wiz.io/blog/38-terabytes-of-private-data-accidentally-exposed-by-microsoft-ai-researchers ; https://www.microsoft.com/en-us/msrc/blog/2023/09/microsoft-mitigated-exposure-of-internal-information-in-a-storage-account-due-to-overly-permissive-sas-token |
| `pages/offensive/lecon-10.html#1` (section) | VRAI (B2), mais **foyer `securite/lecon-09`** (consigne du lot : prendre un autre sujet) | remplacé : PyTorch-nightly et torchtriton (25-30 décembre 2022) — confusion de dépendances, PyPI prioritaire, binaire qui exfiltre par DNS ; correctifs de PyTorch | Cas réel — PyTorch-nightly et le paquet torchtriton (2022) | https://pytorch.org/blog/compromised-nightly-dependency/ |
| `pages/offensive/lecon-11.html#1` (section) | VRAI sur le fond, INEXACT dans le détail : « en mesurant les performances d'une base de données » (Freund : *micro-benchmarking*), « quiconque détenait une clé privée précise » (non dit par les sources lues), versions « arrêtées avant » Debian stable, Ubuntu LTS, RHEL et liste « Arch… » (non sourcé), « pression sociale » non sourcée | corrigé : annonce du 29 mars 2024, archives signées par Jia Tan, accès GitHub seul, message de Lasse Collin du 8 juin 2022, charge obscurcie dans des fichiers de test, déclencheur `build-to-host.m4` absent du dépôt, NVD 10, 0,3 s → 0,8 s par connexion SSH, « beaucoup de coïncidences » | Cas réel — la porte dérobée de xz Utils (2024) | https://www.openwall.com/lists/oss-security/2024/03/29/4 ; https://mastodon.social/@AndresFreundTec/112180406142695845 (lu par l'API) ; https://tukaani.org/xz-backdoor/ ; https://www.mail-archive.com/xz-devel@tukaani.org/msg00567.html ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2024-3094 |
| `pages/offensive/lecon-12.html#1` (section) | INEXACT, événement : citation de Tom McAndrew introuvable dans les sources primaires lues, clauses du contrat (« interdisait de neutraliser les alarmes et de forcer les portes ») non trouvées, « une porte a déclenché une alarme » (Coalfire : alarme déclenchée exprès), « cambriolage au troisième degré et possession d'outils » (Coalfire : accusation de cambriolage, *felony*, réduite à *criminal trespass*), « le client ne souhaitait pas que Coalfire prévienne la police » non trouvé, « Coalfire Labs » ; intertitre sans date | corrigé : arrestation du 11 septembre 2019, mandat de la State Court Administration, porte ouverte et alarme volontaire selon Coalfire, lettre d'autorisation ; audition du Sénat de l'Iowa (4 octobre) : bâtiment du comté, shérif non prévenu, contrat rédigé par Coalfire sans relecture juridique, pas de zone exclue dans les palais de justice ; charges abandonnées le 30 janvier 2020 | Cas réel — Coalfire au palais de justice du comté de Dallas, Iowa (2019) | https://www.legis.iowa.gov/docs/publications/LU/1069925.pdf ; https://web.archive.org/web/20191030225331/https://www.coalfire.com/News-and-Events/Press-Releases/Coalfire-Objects-to-All-Charges-in-Pending-Case ; https://web.archive.org/web/20200202210716/https://www.coalfire.com/News-and-Events/Press-Releases/Charges-Dismissed-Against-Coalfire-Employees |

### cloud

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/cloud/lecon-01.html#1` | VRAI sur le cœur (2008, 2016), INEXACT dans l'argument : « le trafic explose chaque soir », « le pic du samedi soir », « des milliers de machines inutiles en semaine » absents de la source | corrigé : corruption d'août 2008 (trois jours sans DVD), sortie des points uniques de défaillance, sept ans de migration, derniers éléments éteints début janvier 2016, huit fois plus d'abonnés, élasticité (« des milliers de serveurs virtuels… en quelques minutes »), la baisse des coûts n'était pas la raison principale | Cas réel — Netflix achève sa migration vers le cloud (2016) | https://about.netflix.com/en/news/completing-the-netflix-cloud-migration |
| `pages/cloud/lecon-02.html#1` | INVÉRIFIABLE (B2) : cœur confirmé, « données perdues… pour des services publics » introuvable | corrigé sur les sources primaires : rapport du BEA-RI (rez-de-chaussée de SBG2, 4 salles sur 12 de SBG1, maîtrisé vers 10 h, clients institutionnels interrompus) ; jugement du 26 janvier 2023 (sauvegardes au même endroit que le serveur, « physiquement isolé » = lieu différent, clause de force majeure écartée, 94 102 € de dommages et intérêts) ; « services publics » retiré | Cas réel — l'incendie de SBG2 chez OVHcloud (10 mars 2021) | https://www.igedd.developpement-durable.gouv.fr/IMG/pdf/rapport_ovh_67_vdif_cle01cf13.pdf ; https://web.archive.org/web/20250110213918/https://s3.documentcloud.org/documents/23599193/5910_jugements_rendus.pdf |
| `pages/cloud/lecon-03.html#1` | INEXACT : « dans le sillage du Data Act, les grands fournisseurs (AWS, Google Cloud, Azure) » — Google (janvier 2024) n'invoque pas le Data Act, AWS (5 mars) et Azure (13 mars) le font | corrigé : les trois annonces datées, le Data Act attribué aux seuls AWS et Azure, la condition d'Azure (abonnements résiliés) | Cas réel — les frais de sortie levés pour qui quitte son cloud (2024) | https://cloud.google.com/blog/products/networking/eliminating-data-transfer-fees-when-migrating-off-google-cloud ; https://aws.amazon.com/blogs/aws/free-data-transfer-out-to-internet-when-moving-out-of-aws/ ; https://web.archive.org/web/20240313175657/https://azure.microsoft.com/en-us/updates/now-available-free-data-transfer-out-to-internet-when-leaving-azure/ |
| `pages/cloud/lecon-04.html#1` | VRAI sur le cœur, INEXACT dans le détail : « (paiement, jeux, finance) » absent du billet, « un frein tel que » non dit | corrigé : billet du 3 décembre 2019 (causes du démarrage à froid, « double-digit milliseconds », services interactifs, API synchrones, microservices sensibles à la latence, facturation de la concurrence configurée) | Cas réel — AWS Lambda et la Provisioned Concurrency (2019) | https://aws.amazon.com/blogs/aws/new-provisioned-concurrency-for-lambda-functions/ |
| `pages/cloud/lecon-05.html#1` | INEXACT : « En 2023, … a annoncé quitter le cloud » (annonce du 19 octobre 2022 ; le chiffre de 7 M$ date du 21 février 2023) | corrigé : les deux billets de DHH, les deux bouts du spectre, 300 000 inscrits à HEY, 3,2 M$ de cloud en 2022 | Cas réel — 37signals quitte le cloud (2022-2023) | https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0 ; https://world.hey.com/dhh/we-stand-to-save-7m-over-five-years-from-our-cloud-exit-53996caa |
| `pages/cloud/lecon-06.html#1` | sujet réel (Capital One 2019) dont le **foyer est `securite/lecon-11`** | remplacé : Snowflake et UNC5537 — aucune intrusion chez Snowflake, identifiants de clients volés par des *infostealers* (dès 2020), ≈ 165 organisations prévenues, trois facteurs côté client (pas de MFA, pas de rotation, pas de liste d'adresses autorisées) | Cas réel — Snowflake et la campagne UNC5537 (2024) | https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion |
| `pages/cloud/lecon-07.html#1` | VRAI sur le cœur, imprécis : « une poignée d'utilisateurs », « architecture mal dimensionnée », « manque de tests de charge » sans source | corrigé sur le rapport de l'OIG : 250 000 utilisateurs simultanés, pannes en moins de deux heures, « cinq fois » selon le CTO fédéral mais défauts de fond, six inscrits le premier jour, risque de capacité signalé en avril 2013, tests incomplets, doublement de capacité demandé fin septembre | Cas réel — le lancement de HealthCare.gov (2013) | https://oig.hhs.gov/oei/reports/oei-06-14-00350.pdf |
| `pages/cloud/lecon-08.html#1` | INVÉRIFIABLE, général (« le patron par défaut de presque toutes les applications… ») | remplacé : base du support de Microsoft exposée par une modification du groupe de sécurité réseau (5-31 décembre 2019), protections existantes non activées, audit et alertes annoncés | Cas réel — une base du support de Microsoft exposée par une règle réseau (2019) | https://web.archive.org/web/20241212094419/https://msrc.microsoft.com/blog/2020/01/access-misconfiguration-for-customer-support-database/ |
| `pages/cloud/lecon-09.html#1` | INVÉRIFIABLE en partie, général : la pratique de Google est réelle, mais « beaucoup d'équipes affichent sur un écran mural trois chiffres » n'a pas de source | corrigé sur le chapitre « Embracing Risk » : tension produit/SRE, « Hope is not a strategy », budget trimestriel tiré du SLO, mesure par la supervision, livraisons suspendues quand il est épuisé, exemple 99,999 % / 0,0002 % = 20 % | Cas réel — Google et le budget d'erreur (2016) | https://sre.google/sre-book/embracing-risk/ ; https://sre.google/sre-book/preface/ (date du livre) ; https://sre.google/workbook/error-budget-policy/ (lu, écarté : politique d'un service d'exemple) |
| `pages/cloud/lecon-10.html#1` | INEXACT : « services de streaming, objets connectés, applications de livraison », « les plus touchés étaient dans une seule région », « les multi-régions ont pu basculer », « la plus ancienne et la plus utilisée » : rien de cela dans le post-mortem | corrigé sur le post-mortem du 10 décembre 2021 : cause (activité automatique de mise à l'échelle, congestion du réseau interne), effets (lancements EC2, Route 53, console, API Gateway, CloudWatch), rétablissement à 14 h 22, tableau de bord qui n'a pas basculé vers sa région de secours, support multirégion annoncé | Cas réel — la panne d'AWS en us-east-1 (7 décembre 2021) | https://aws.amazon.com/message/12721/ |
| `pages/cloud/lecon-11.html#1` | INVÉRIFIABLE, général (« Chez les grands acteurs du web… 1 % du trafic… d'innombrables incidents ») | remplacé : Kayenta (10 avril 2018) — canari et témoin de trois instances, jugement automatique, décision de Spinnaker, une ou deux livraisons par semaine avant, 30 % des jugements soit 200 par jour | Cas réel — Kayenta, l'analyse automatique des canaris de Netflix (2018) | https://web.archive.org/web/20231109112548/https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69 |
| `pages/cloud/lecon-12.html#1` | VRAI sur le cœur (FOYER), INEXACT : « une large partie du web est tombée » absent du post-mortem ; titre sans date ni source | corrigé : 9 h 37 PST, procédure établie, valeur mal saisie, sous-systèmes index et placement, redémarrage complet, retour à la normale à 13 h 54, services touchés, tableau de bord dépendant de S3, outil ralenti et plancher de capacité | Cas réel — la panne d'Amazon S3 en us-east-1 (28 février 2017) | https://aws.amazon.com/message/41926/ |

## Décomptes

| | offensive | cloud | total |
|---|---:|---:|---:|
| « Cas réel » lus | 12 | 12 | **24** |
| état : VRAI tel quel | 0 | 0 | 0 |
| état : VRAI (B2) mais foyer ailleurs | 1 (`10`) | 0 | 1 |
| état : sujet réel dont le foyer est ailleurs | 5 (`04`, `05`, `06`, `08`, `09`) | 1 (`06`) | 6 |
| état : INEXACT | 3 (`07`, `11`, `12`) | 7 (`01`, `03`, `04`, `05`, `07`, `10`, `12`) | 10 |
| état : INVÉRIFIABLE (anonyme ou général) | 1 (`02`) | 4 (`02`, `08`, `09`, `11`) | 5 |
| état : INVENTÉ (récit fictif « Rideau ») | 2 (`01`, `03`) | 0 | 2 |
| action : remplacé | 9 | 3 | **12** |
| action : corrigé sur son sujet | 3 | 9 | **12** |
| action : gardé tel quel | 0 | 0 | 0 |
| action : renommé « Scénario » | 0 | 0 | 0 |
| `verif-contenu.js --cas-reel` hors règle | 12 → **0** | 12 → **0** | 24 → 0 |

(`cloud/02` et `cloud/09`, classés INVÉRIFIABLE, ont un sujet réel : ils sont corrigés sur ce sujet, pas remplacés.)

## Contrôles (avant le commit de ce rapport)

- `node tools/verif-contenu.js --cas-reel --cours=offensive` → **0** (12 conformes) ;
- `node tools/verif-contenu.js --cas-reel --cours=cloud` → **0** (12 conformes) ;
- `node tools/verif-contenu.js --strict` → **0** ;
- `node tools/verif-html.js` → **0** ;
- `node tools/verif-domaines-interdits.js` → **0** ;
- `node tools/verif-fraicheur.js` → **0** ;
- `node tools/verif-qcm-lexique.js` → **0** ; `node tools/verif-qcm-biais.js` → **0** ;
- `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b12-offensive-cloud 8c65449` → **1 écart, structurel**
  (« source » dans `cloud/lecon-12`, voir la méthode) ;
- `node tools/cas-reels/lots/doublons.js` → **4** sources partagées entre cours : les 3 d'avant (Debian 12,
  react.dev, WebKit 15.4) et le post-mortem S3 d'AWS, que cite aussi `python/lecon-28` (voir les consignes) ;
- `node tools/cas-reels/lots/controle-branche.js D:\test-claude-b12-offensive-cloud 8c65449` → **0** ;
- `node tools/verif.js --rapide` → voir la section suivante.

### `node tools/verif.js --rapide`

**Code 1**, 54 étapes jouées en 254,2 s (lancé une seule fois, depuis Git Bash), **3 signalées, toutes tolérées** :

- `donnees` : l'invariant **I18** seul (2 erreurs comptées pour une cause : `js/search-index.js` publié diverge du
  contenu régénéré, +3 326 octets) — attendu, l'orchestrateur régénère les index après la fusion ;
- `doc-ref` : « la page cite fragments distincts = 9 022 » — chiffre du cours `doc` mesuré sur tout le site, que les
  nouvelles lignes de source font bouger ;
- `doc-rec` : « 1 435 citent la source » introuvable dans la page — même cause (24 « Cas réel » de plus citent
  leur source).

Toutes les autres étapes sont vertes, dont `contenu`, `fraich`, `qcmbiai`, `qcmlexi`, `normatf`, `erreurs`,
`etudes`.

## Ce qui reste ouvert, et les doutes

1. **Les leçons d'`offensive` parlent encore des anciens cas hors de l'encadré** (méta-description, liste
   d'objectifs « relier cela à un cas réel : … », ligne « Cas réel » de l'antisèche, glossaire, exercices, QCM) — je
   n'ai pas le droit d'y toucher (`controle-branche.js` l'interdit, et les QCM sont hors de ma portée). Relevé :
   `04` TalkTalk (méta l.7, objectifs l.91, antisèche l.511) ; `05` Samy (méta, objectifs, antisèche l.414,
   glossaire l.430) ; `06` First American (méta, objectifs, antisèche l.370) ; `08` Firesheep (méta, objectifs,
   antisèche l.572) ; `09` Uber (méta, objectifs, antisèche l.394, glossaire l.412, **QCM 4** « Dans le cas Uber
   (2016)… » l.424, exercice à trou l.432, **exercice 3** « Le cas Uber cumule deux fautes » l.456) ; `10`
   event-stream (méta, objectifs, antisèche, exercice à trou l.568, **exercice 3** l.594-601) ; `11` xz : l'antisèche
   (« n'a touché que des branches de dev ») et l'**explication du QCM 4** (« en mesurant les performances d'une
   base de données ») reprennent les deux affirmations que j'ai retirées faute de source ; `03` : la méta et les
   objectifs citent les notes 5,3 / 3,7 / 6,5 / 6,5 → 9,1 du programme de la leçon (pas du cas) : cohérents.
2. **`offensive/lecon-09` : Uber.** Le registre écrit « mentions dans offensive/lecon-09 … à relire » ; c'était en
   fait le « Cas réel » lui-même, même récit que `iac/lecon-10`. J'ai appliqué « un sujet = un seul cours » et
   remplacé, ce qui laisse le QCM 4 et l'exercice 3 sans leur récit dans la leçon (seule l'antisèche le résume
   encore). Si l'orchestrateur préfère garder Uber ici, le remplacement est à annuler sur ce seul fichier.
3. **`cloud/lecon-09`** : un chapitre de livre n'est pas un « événement » ; le cas décrit la pratique documentée de
   Google (2016). L'exemple de politique du *SRE Workbook* (2018), plus concret, a été lu et écarté : il porte sur un
   service d'exemple, pas sur un service réel.
4. **`offensive/lecon-06`, McHire** : le chiffre de « plus de 64 millions » est celui des chercheurs ; Paradox.ai
   le conteste (conversations, pas candidatures ; 5 candidats vus). Le cas donne les deux versions. La date de
   publication du billet n'est pas affichée sur la page : la ligne de source dit « 2025 (divulgation du 30 juin
   2025) ».
5. **`offensive/lecon-12`, Coalfire** : l'ancien récit venait sans doute de la presse (Ars Technica, Des Moines
   Register) ; la citation de McAndrew et les clauses du contrat n'ont pas été retrouvées dans une source primaire
   et sont retirées. La version de l'alarme « déclenchée exprès » est celle de Coalfire (dite comme telle).
6. **`cloud/lecon-02`** : le montant de 94 102 € est la somme des quatre postes du dispositif (26 472 + 9 100 +
   38 530 + 20 000) ; s'y ajoutent 7 000 € au titre de l'article 700, non comptés. Le texte du jugement vient d'une
   copie de DocumentCloud (archivée), OCR imparfait mais lisible.
7. **Copies tierces et archives** : Légifrance (défi anti-robot), DocumentCloud et le MSRC de 2020 (accès refusé),
   l'annonce d'Azure (page actuelle vide), Twitter et Coalfire (pages disparues) ne se lisent que par l'Internet
   Archive ; les liens citent ces copies.
8. **`offensive/lecon-08`** : la page `ico.org.uk` a refusé l'outil ; la même actualité a été lue et est citée sur
   `cy.ico.org.uk` (miroir officiel de l'ICO, texte anglais). Le 8-K/A a été lu sur EDGAR.
9. **Fraîcheur** : les marques `fraicheur` des anciens encadrés de `cloud/03`, `08`, `09`, `10` et `11` sont parties
   avec eux (`verif-fraicheur.js` reste à 0). Les cas neufs sont au passé et datés.

## Consignes de fusion

- **Registre `foyers.md`** — sujets pris ici, à inscrire : l'extranet de l'ANSES, Cass. crim. 20 mai 2015
  (`offensive/lecon-01`) ; Hanno Böck et la Certificate Transparency (`offensive/lecon-02`) ; Ivanti Connect Secure,
  CVE-2023-46805 + CVE-2024-21887 (`offensive/lecon-03`) ; PHP-CGI, CVE-2024-4577 (`offensive/lecon-04`) ; Twitter,
  « onMouseOver » 2010 (`offensive/lecon-05`) ; McHire / Paradox.ai 2025 (`offensive/lecon-06`) ; Ashley Madison et
  CynoSure Prime 2015 (`offensive/lecon-07`) ; 23andMe 2023 (`offensive/lecon-08`) ; jeton SAS de Microsoft, Wiz 2023
  (`offensive/lecon-09`) ; PyTorch-nightly et torchtriton 2022 (`offensive/lecon-10`) ; xz Utils 2024
  (`offensive/lecon-11`) ; Coalfire, comté de Dallas 2019 (`offensive/lecon-12`) ; Netflix, fin de la migration 2016
  (`cloud/lecon-01`) ; OVHcloud SBG2 2021 (`cloud/lecon-02`) ; frais de sortie 2024 (`cloud/lecon-03`) ; Lambda
  Provisioned Concurrency 2019 (`cloud/lecon-04`) ; 37signals quitte le cloud (`cloud/lecon-05`) ; Snowflake et
  UNC5537 2024 (`cloud/lecon-06`) ; HealthCare.gov 2013 (`cloud/lecon-07`) ; base du support de Microsoft 2019
  (`cloud/lecon-08`) ; Google et le budget d'erreur 2016 (`cloud/lecon-09`) ; AWS us-east-1 du 7 décembre 2021
  (`cloud/lecon-10`) ; Kayenta 2018 (`cloud/lecon-11`) ; S3 du 28 février 2017 (`cloud/lecon-12`, FOYER).
- **S3 2017** : `python/lecon-28` (« la commande qui a arrêté Amazon S3 ») raconte le même incident sur la même
  source ; le foyer étant `cloud/lecon-12`, c'est `python/lecon-28` qui devra changer de sujet (hors de ma part).
- **Uber 2016** : foyer `iac/lecon-10` ; `offensive/lecon-09` ne le raconte plus (voir le doute n° 2).
- **Textes hors encadré à reprendre** (méta, objectifs, antisèches, glossaires, exercices, QCM) : voir le point 1 de
  la section précédente ; en particulier le QCM 4 et l'exercice 3 d'`offensive/lecon-09`, l'exercice 3
  d'`offensive/lecon-10` et l'explication du QCM 4 d'`offensive/lecon-11`.
- Index dérivés (`js/search-index.js`, `pages/etude-recherche.html`…) non touchés : à régénérer après la fusion.
- Une contre-relecture de chaque affirmation des 24 cas reste à faire (consigne du lot).
