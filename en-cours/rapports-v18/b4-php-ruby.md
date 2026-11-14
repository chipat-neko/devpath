# Rapport V18 — case B4 (lot 1) : les « Cas réel » des cours `php` et `ruby`

Copie de travail `D:\test-claude-b4-php-ruby`, branche `v18/b4-php-ruby`, partie de `a244d0f`.
Scripts : `scratchpad/b4-php-ruby/` de la copie (ignoré par git) — `contenu-php.js` et
`contenu-ruby.js` (le texte exact de chaque nouvel encadré), `appliquer.js` (remplacement de
l'encadré seul, avec preuve que tout octet hors de l'encadré et de son intertitre est identique),
`lexique-diff.js` (neutralité lexicale, § 4), `dump.js` (lecture des cas).

## 1. Bilan

| cours | « Cas réel » | trouvés VRAI | INEXACT | INVÉRIFIABLE | INVENTÉ | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `php` | 21 | 0 | 2 | 19 | 0 | 0 | 1 | 20 | 0 |
| `ruby` | 22 | 0 | 4 | 18 | 0 | 0 | 3 | 19 | 0 |
| **total** | **43** | **0** | **6** | **37** | **0** | **0** | **4** | **39** | **0** |

Aucun des 43 cas d'origine ne tenait seul : 37 étaient des récits anonymes ou des usages
généraux (« une boutique », « une équipe », « un développeur »…), 6 portaient une affirmation
fausse ou non soutenue par la source. Les 43 cas sont maintenant **datés, nommés et sourcés** ;
chaque affirmation a été confrontée à une source **ouverte** (URL listée ci-dessous, ouverte par
WebFetch ou `curl`). `verif-contenu.js --cas-reel` : `php` 21 → **0**, `ruby` 22 → **0** hors
de la règle ; site : 4 → **47** conformes.

## 2. Cas par cas — `php`

Nature : *événement* (fait daté), *produit* (produit ou document nommé), *anonyme* (récit sans
sujet identifiable), *général* (usage général présenté comme un cas).

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/php/lecon-01.html#1` | INVÉRIFIABLE, général (« c'est arrivé à de vrais sites », aucun nommé) | remplacé par : fuite du code PHP de Facebook | Cas réel — le code de Facebook exposé (2007) | https://www.theregister.com/2007/08/13/facebook_code_leak/ (presse : la déclaration de Facebook n'existe que citée par la presse ; la cause « Apache qui sert le PHP brut » est donnée comme hypothèse non confirmée, ce que dit l'encadré) |
| `pages/php/lecon-02.html#1` | INEXACT, général : « avant PHP 8.0 » les chaînes `0e…` se comparaient comme des nombres et « PHP 8 a durci `==` » — or la RFC de PHP 8 laisse **inchangée** la comparaison de deux chaînes numériques (`"0" == "0e214987142012"` vrai avant et après) | remplacé par : la faille de hash de WordPress 4.0.1 (`$hash == md5($password)` → `hash_equals`) | Cas réel — le `==` de WordPress 4.0 (2014) | https://wordpress.org/news/2014/11/wordpress-4-0-1/ ; https://raw.githubusercontent.com/WordPress/WordPress/4.0/wp-includes/pluggable.php ; https://raw.githubusercontent.com/WordPress/WordPress/4.0.1/wp-includes/pluggable.php ; https://wiki.php.net/rfc/string_to_number_comparison ; https://openwall.com/lists/oss-security/2014/11/25/12 (CVE-2014-9037, contrôle) |
| `pages/php/lecon-03.html#1` | INVÉRIFIABLE, anonyme | remplacé par : ticket WordPress n° 58141 (titre et contenu « 0 » jugés vides par `! $post_content && …`) | Cas réel — un article intitulé « 0 » dans WordPress (2023) | https://lists.wordpress.org/pipermail/wp-trac/2023-April/493178.html ; https://lists.wordpress.org/pipermail/wp-trac/2023-August/502875.html (statut) ; https://raw.githubusercontent.com/WordPress/WordPress/6.2/wp-includes/post.php |
| `pages/php/lecon-04.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la proposition `ARRAY_FILTER_REINDEX` de Tyson Andre sur php.internals (exemple exact `{"0":5,"2":7}`) | Cas réel — la proposition ARRAY_FILTER_REINDEX (2021) | https://externals.io/message/116097 ; https://www.php.net/manual/en/function.array-filter.php ; https://bugs.php.net/bug.php?id=74551 (contrôle) |
| `pages/php/lecon-05.html#1` | INVÉRIFIABLE, anonyme | remplacé par : l'attaque XSS contre le JIRA de la fondation Apache (vol de cookies de session) | Cas réel — l'attaque contre la fondation Apache (2010) | https://infra.apache.org/blog/apache_org_04_09_2010 |
| `pages/php/lecon-06.html#1` | INVÉRIFIABLE, anonyme | remplacé par : CVE-2009-4808, cookie `g_admin=1` de Graugon PHP Article Publisher | Cas réel — le cookie de Graugon PHP Article Publisher (2009) | https://www.exploit-db.com/exploits/8133 (et `/raw/8133`) ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2009-4808 (la page HTML de la NVD n'est qu'un squelette JavaScript : la fiche est citée sans lien) |
| `pages/php/lecon-07.html#1` | INEXACT, événement (TalkTalk) : « coordonnées bancaires **partielles** » (faux : numéro de compte et code guichet de 15 656 clients) ; « paramètres pas passés en requête préparée » (la source ne le dit pas) ; « une seule page » (trois pages) ; « faille connue de longue date et trivialement évitable » (l'ICO dit : attaque connue depuis plus de dix ans, défenses connues, logiciel de base périmé) | corrigé à la source (même sujet), affirmations non sourcées retirées | Cas réel — TalkTalk (2015) | https://ico.org.uk/about-the-ico/media-centre/talktalk-cyber-attack-how-the-ico-investigation-unfolded/ |
| `pages/php/lecon-08.html#1` | INVÉRIFIABLE, anonyme ; de plus la causalité était fausse : rendre `$places` privé ne protège pas de deux requêtes simultanées (deux processus PHP) | remplacé par : le portefeuille multi-sig de Parity (fonctions sensibles « protégées par rien ») | Cas réel — le portefeuille multi-sig de Parity (2017) | http://web.archive.org/web/20180830181639/https://paritytech.io/the-multi-sig-hack-a-postmortem/ (l'original n'existe plus sur parity.io) |
| `pages/php/lecon-09.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Omnipay (`GatewayInterface`, Stripe et PayPal) | Cas réel — la bibliothèque Omnipay (2012) | https://github.com/thephpleague/omnipay ; https://raw.githubusercontent.com/thephpleague/omnipay/master/README.md ; https://api.github.com/repos/thephpleague/omnipay (date de création) |
| `pages/php/lecon-10.html#1` | INVÉRIFIABLE, anonyme (déjà en B2) | remplacé par : ticket Drupal n° 108818 (sauvegarde coupée entre `node` et `node_revisions`, transactions ajoutées) | Cas réel — les transactions de Drupal 7 (2009) | https://www.drupal.org/node/108818 ; https://www.drupal.org/i/261258 (contrôle) |
| `pages/php/lecon-11.html#1` | INVÉRIFIABLE, anonyme | remplacé par : CVE-2017-9841 (`eval-stdin.php` de PHPUnit dans des `vendor/` publics) | Cas réel — la faille de PHPUnit dans les `vendor/` publics (2017) | https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2017-9841 (fiche et date d'ajout au catalogue CISA) ; https://docs.phpunit.de/en/11.5/installation.html ; https://getcomposer.org/doc/03-cli.md |
| `pages/php/lecon-12.html#1` | INVÉRIFIABLE, anonyme | remplacé par : le `200 OK` qui peut contenir une erreur de CopyObject (Amazon S3) | Cas réel — le « 200 OK » de CopyObject sur Amazon S3 (doc. 2026) | https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html |
| `pages/php/lecon-13.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la RFC « Generators » (exemple `getLinesFromFile`, limite de mémoire) et PHP 5.5.0 | Cas réel — la RFC des générateurs de PHP (2012) | https://wiki.php.net/rfc/generators ; https://www.php.net/releases/5_5_0.php ; https://www.php.net/ChangeLog-5.php |
| `pages/php/lecon-14.html#1` | INVÉRIFIABLE, anonyme (900 ms → 300 ms sans source) | remplacé par : l'intégration de Zend Optimizer+/OPcache dans PHP 5.5 | Cas réel — OPcache entre dans PHP 5.5 (2013) | https://wiki.php.net/rfc/optimizerplus ; https://www.php.net/releases/5_5_0.php ; https://www.php.net/manual/en/opcache.installation.php |
| `pages/php/lecon-15.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Laravel 5.0 échappe `{{ }}` et introduit `{!! !!}` | Cas réel — Laravel 5.0 rend Blade sûr par défaut (2015) | https://laravel.com/docs/5.0/upgrade ; https://api.github.com/repos/laravel/framework/git/refs/tags/v5.0.0 (date de l'étiquette) |
| `pages/php/lecon-16.html#1` | INVÉRIFIABLE, anonyme | remplacé par : CVE-2024-50653, limite de coupons appliquée seulement par l'interface de CRMEB | Cas réel — les coupons sans limite de CRMEB (2024) | https://cveawg.mitre.org/api/cve/CVE-2024-50653 ; https://github.com/Yllxx03/CVE/tree/main/CVE-2024-50653 ; https://cwe.mitre.org/data/definitions/602.html ; https://api.github.com/repos/crmeb/CRMEB/languages |
| `pages/php/lecon-17.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la panne de Stack Overflow du 20 juillet 2016 (regex de nettoyage d'espaces) | Cas réel — la panne de Stack Overflow (2016) | http://web.archive.org/web/20260325093346/https://stackstatus.tumblr.com/post/147710624694/outage-postmortem-july-20-2016 (l'original répond 403) |
| `pages/php/lecon-18.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la panne d'Azure du 29 février 2012 (année + 1) | Cas réel — la panne d'Azure du 29 février (2012) | https://azure.microsoft.com/en-us/blog/summary-of-windows-azure-service-disruption-on-feb-29th-2012/ |
| `pages/php/lecon-19.html#1` | INVÉRIFIABLE, anonyme | remplacé par : WP File Manager, `connector.minimal.php` (CVE-2020-25213) | Cas réel — l'extension WP File Manager (2020) | https://seravo.com/blog/0-day-vulnerability-in-wp-file-manager/ ; https://cveawg.mitre.org/api/cve/CVE-2020-25213 |
| `pages/php/lecon-20.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Netflix et Hystrix (une dépendance lente sature tout) | Cas réel — Netflix et Hystrix (2012) | https://github.com/Netflix/Hystrix/wiki ; https://api.github.com/repos/Netflix/Hystrix (date d'ouverture) |
| `pages/php/lecon-21.html#1` | INVÉRIFIABLE, anonyme (déjà en B2) | remplacé par : les « Personal Home Page Tools » de Rasmus Lerdorf | Cas réel — les « Personal Home Page Tools » de Rasmus Lerdorf (1994) | https://www.php.net/manual/en/history.php.php |

## 3. Cas par cas — `ruby`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/ruby/lecon-01.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Ruby 3.4 change `Hash#inspect`, donc ce qu'affiche `p` | Cas réel — Ruby 3.4 change ce qu'affiche `p` (2024) | https://www.ruby-lang.org/en/news/2024/12/25/ruby-3-4-0-released/ ; https://docs.ruby-lang.org/en/3.4/Kernel.html |
| `pages/ruby/lecon-02.html#1` | INVÉRIFIABLE, anonyme | remplacé par : les noms de gènes convertis en dates par Excel (19,6 % des articles) | Cas réel — les noms de gènes changés en dates (2016) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4994289/ ; https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=27552985&rettype=abstract&retmode=text |
| `pages/ruby/lecon-03.html#1` | INVÉRIFIABLE, anonyme | remplacé par : bpo-13936, minuit « faux » en Python jusqu'à 3.5 (contraste avec la règle de Ruby) | Cas réel — le minuit « faux » de Python (2012) | https://bugs.python.org/issue13936 ; https://docs.python.org/3/library/datetime.html |
| `pages/ruby/lecon-04.html#1` | INVÉRIFIABLE, anonyme | remplacé par : l'avertissement « même objet » de `class_attribute` (Rails) | Cas réel — l'avertissement de `class_attribute` dans Rails (2010) | https://api.rubyonrails.org/classes/Class.html ; https://raw.githubusercontent.com/rails/rails/v3.0.0/activesupport/lib/active_support/core_ext/class/attribute.rb (et v3.1.0, v3.2.0, v4.0.0) ; https://api.github.com/repos/rails/rails/git/commits/9891ca89c69732a21743f0349f2995956a7802e7 (date de v3.0.0) |
| `pages/ruby/lecon-05.html#1` | INVÉRIFIABLE, anonyme (déjà en B2) | remplacé par : CVE-2013-1854, « Symbol DoS » d'Active Record | Cas réel — la faille « Symbol DoS » de Rails (2013) | https://rubyonrails.org/2013/3/18/SEC-ANN-Rails-3-2-13-3-1-12-and-2-3-18-have-been-released ; https://cveawg.mitre.org/api/cve/CVE-2013-1854 ; https://www.ruby-lang.org/en/news/2013/02/22/json-dos-cve-2013-0269/ ; https://www.ruby-lang.org/en/news/2014/12/25/ruby-2-2-0-released/ |
| `pages/ruby/lecon-06.html#1` | INVÉRIFIABLE, général (« sur un serveur qui tourne des semaines… ») | remplacé par : PEP 343 (le `with` de Python) et le `rb_ensure(rb_yield, …)` de `File.open` | Cas réel — Python adopte `with` (PEP 343, 2005) | https://peps.python.org/pep-0343/ ; https://peps.python.org/pep-0340/ (contrôle) ; https://docs.ruby-lang.org/en/3.4/File.html |
| `pages/ruby/lecon-07.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Feature #4890 et Ruby 2.0 (`Enumerable#lazy`) | Cas réel — `Enumerable#lazy` arrive dans Ruby 2.0 (2013) | https://bugs.ruby-lang.org/issues/4890 (et `.json`) ; https://www.ruby-lang.org/en/news/2013/02/24/ruby-2-0-0-p0-is-released/ |
| `pages/ruby/lecon-08.html#1` | INVÉRIFIABLE, général (« la communauté a massivement basculé ») | remplacé par : le piège du booléen (Qt) et les arguments nommés de Ruby 2.0, séparés en 3.0 | Cas réel — les arguments nommés de Ruby 2.0 (2013) | https://wiki.qt.io/API_Design_Principles ; https://www.ruby-lang.org/en/news/2013/02/24/ruby-2-0-0-p0-is-released/ ; https://www.ruby-lang.org/en/news/2019/12/12/separation-of-positional-and-keyword-arguments-in-ruby-3-0/ |
| `pages/ruby/lecon-09.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la faille d'affectation de masse de GitHub (clé ajoutée à l'organisation `rails`) | Cas réel — la faille d'affectation de masse de GitHub (2012) | https://github.blog/news-insights/the-library/public-key-security-vulnerability-and-mitigation/ |
| `pages/ruby/lecon-10.html#1` | INEXACT, général : « Unity, Unreal et Godot reposent tous [sur l'ECS] » — faux pour Godot, qui explique pourquoi il n'utilise pas l'ECS | remplacé par : Mick West, « Evolve Your Hierarchy », les composants de *Tony Hawk* | Cas réel — les composants de *Tony Hawk* chez Neversoft (2007) | https://cowboyprogramming.com/2007/01/05/evolve-your-heirachy/ ; https://godotengine.org/article/why-isnt-godot-ecs-based-game-engine/ (vérification de l'erreur) |
| `pages/ruby/lecon-11.html#1` | INEXACT, produit (Ruby 2.4) : « selon l'ordre de chargement, `[1.0, 2.0].sum` pouvait changer de résultat, et des tests verts se sont mis à échouer » — non dit par la source, qui parle de « différences subtiles » | corrigé à la source (même sujet) | Cas réel — `Array#sum` arrive dans Ruby 2.4 (2016) | https://raw.githubusercontent.com/ruby/ruby/master/doc/NEWS/NEWS-2.4.0 ; https://www.ruby-lang.org/en/news/2016/12/25/ruby-2-4-0-released/ |
| `pages/ruby/lecon-12.html#1` | INEXACT, anonyme (déjà en B2) : « écrire puis `File.rename` » ne garantit pas, après une coupure de courant, un fichier complet sans `fsync` | remplacé par : ext4 et les fichiers vides de 2009 (même notion, l'erreur corrigée : `f.fsync` avant le renommage) | Cas réel — ext4 et les fichiers vides (2009) | https://lwn.net/Articles/322823/ ; https://man7.org/linux/man-pages/man2/rename.2.html ; https://docs.ruby-lang.org/en/3.4/IO.html |
| `pages/ruby/lecon-13.html#1` | INVÉRIFIABLE, anonyme | remplacé par : les versions piégées de rest-client (CVE-2019-15224) | Cas réel — les versions piégées de rest-client (2019) | https://github.com/rest-client/rest-client/issues/713 (et l'API) |
| `pages/ruby/lecon-14.html#1` | INVÉRIFIABLE, anonyme | remplacé par : la règle de non-régression de SQLite | Cas réel — les tests de non-régression de SQLite (2023) | https://www.sqlite.org/testing.html |
| `pages/ruby/lecon-15.html#1` | INEXACT, produit (Shopify) : « dizaines de milliers de commandes à la seconde » et « emploie plusieurs mainteneurs du cœur de Ruby » sans source trouvée ; « finance YJIT » (Ruby 3.1 dit : YJIT **développé** par Shopify) | corrigé à la source (même sujet), chiffres remplacés par ceux de Shopify | Cas réel — Shopify, Rails à très grande échelle (2024) | https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity ; https://www.shopify.com/news/bfcm-data-2024 ; https://www.ruby-lang.org/en/news/2021/12/25/ruby-3-1-0-released/ |
| `pages/ruby/lecon-16.html#1` | INVÉRIFIABLE en partie, produit : Rails tiré de Basecamp en 2004 confirmé ; la vidéo qui « a stupéfié… et lancé le framework », et « GitHub, Airbnb à ses débuts » sans source ouverte | corrigé à la source (même sujet), affirmations non sourcées retirées | Cas réel — la sortie de Rails 0.5 (2004) | https://dhh.dk/arc/000254.html ; https://rubyonrails.org/2006/7/26/rails-is-2-years-old ; https://rubyonrails.org/2005/2/28/rails-0-10-on-lighttpd-without-scaffolding-video ; https://rubyonrails.org/2008/11/27/new-15-minute-blog-video-on-rails-2-2 |
| `pages/ruby/lecon-17.html#1` | INVÉRIFIABLE, général (« la cause la plus courante de lenteur ») | remplacé par : l'ajout de `strict_loading` à Rails (PR n° 37400) et l'exemple N+1 du guide | Cas réel — Rails ajoute `strict_loading` (2020) | https://github.com/rails/rails/pull/37400 (et l'API) ; https://guides.rubyonrails.org/active_record_querying.html |
| `pages/ruby/lecon-18.html#1` | INVÉRIFIABLE, anonyme | remplacé par : le piège `^`/`$` du guide de sécurité et l'exception de `validates_format_of` dans Rails 4.0 | Cas réel — le piège de `^` et `$` dans Rails 4.0 (2013) | https://guides.rubyonrails.org/security.html ; https://raw.githubusercontent.com/rails/rails/v4.0.0/activemodel/CHANGELOG.md ; https://api.github.com/repos/rails/rails/git/commits/375d9a0a7fb329b0fbbd75a13e93e53a00520587 (date de v4.0.0) |
| `pages/ruby/lecon-19.html#1` | INVÉRIFIABLE, anonyme | remplacé par : les plantages d'apps iOS dus au SDK Facebook (mai et juillet 2020) | Cas réel — le SDK Facebook qui faisait planter les apps (2020) | https://github.com/meta/facebook-ios-sdk/issues/1373 ; https://github.com/meta/facebook-ios-sdk/issues/1427 (et leurs commentaires par l'API) |
| `pages/ruby/lecon-20.html#1` | INVÉRIFIABLE, anonyme (« de 90 à 35 lignes ») | remplacé par : le pattern matching de Ruby 2.7, stabilisé en 3.0 | Cas réel — le pattern matching de Ruby 2.7 (2019) | https://www.ruby-lang.org/en/news/2019/12/25/ruby-2-7-0-released/ ; https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/ |
| `pages/ruby/lecon-21.html#1` | INVÉRIFIABLE, anonyme (38 s → 2,5 s) | remplacé par : Ractor dans Ruby 3.0 (mesure *tak*, 3,87 fois plus vite) | Cas réel — Ractor dans Ruby 3.0 (2020) | https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/ |
| `pages/ruby/lecon-22.html#1` | INVÉRIFIABLE, anonyme | remplacé par : Jekyll, de l'outil de blog personnel au moteur de GitHub Pages | Cas réel — Jekyll, du blog perso à GitHub Pages (2008) | https://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html ; https://github.blog/news-insights/the-library/github-pages/ ; https://api.github.com/repos/jekyll/jekyll (langage) |

## 4. Ce que la neutralité lexicale a demandé

Premier passage écrit : `verif-qcm-lexique.js` sort en **1** — `php` INVERSE 0,0 % → 14,3 %,
`ruby` STRICTE 70,0 % → 73,7 %. Cause : l'outil compte comme « présent dans la page » tout mot
de 6 lettres ou plus du HTML brut, **titres de source et URL compris**. Retirer l'ancien récit
faisait disparaître des mots que portaient des options (*fausse*, *résultat*, *prestataire*…),
et le nouveau en apportait d'autres (*défaut*, *exposé*, *manuel*, *public* — ce dernier venu du
titre anglais d'une source). `lexique-diff.js` liste, leçon par leçon, les mots d'options dont la
présence a changé : **41 écarts** au premier passage, **0** après réécriture des encadrés (mots
perdus remis dans l'encadré, mots gagnés remplacés). Les QCM n'ont pas été touchés. Les deux
cliquets sortent alors en 0.

## 5. Écarts à la consigne, à relire

- **Intertitres modifiés (18)** : la consigne dit « ne touche à rien d'autre dans la leçon ».
  17 leçons de `php` et `ruby/lecon-22` ont un `<h2>Un cas réel : …</h2>` juste au-dessus de
  l'encadré, qui annonçait le récit inventé (« les places fantômes », « le cookie role=admin »…).
  Le garder aurait annoncé un fait qui n'existe pas : seul le texte après « Un cas réel : » a
  changé (liste exacte dans la sortie de `appliquer.js`). Gardés tels quels : `php/lecon-01`,
  `-02`, `-04`, `-09`.
- **Notion déplacée dans la leçon** : `php/lecon-18` traitait des fuseaux horaires ; le cas
  réel retenu (Azure, 29 février) illustre l'arithmétique des dates (`DateInterval`) de la même
  leçon. Aucun cas de fuseau ou d'heure d'été avec une source primaire ouverte n'a été trouvé.
- **Cas d'un autre langage**, choisis parce qu'ils éclairent la notion mieux qu'un récit Ruby
  anonyme : `ruby/lecon-03` (Python, minuit faux), `ruby/lecon-06` (PEP 343), `ruby/lecon-02`
  (Excel), `php/lecon-08` (Solidity/Parity), `php/lecon-05` (JIRA d'Apache), `php/lecon-17`
  (Stack Overflow), `php/lecon-20` (Hystrix, en Java).

## 6. Cas où j'ai douté

- `php/lecon-01` : seule source, la presse (The Register) ; aucune page de Facebook de 2007
  trouvée. La cause technique est écrite comme une hypothèse non confirmée.
- `php/lecon-06` : produit obscur ; avis d'origine (milw0rm, recopié par Exploit-DB) et fiche NVD
  lue par l'API (la page HTML de la NVD est vide sans JavaScript, d'où une fiche citée sans lien).
- `php/lecon-12` : un comportement documenté (Amazon S3), pas un incident ; l'année du titre est
  celle de la documentation consultée (2026).
- `php/lecon-16` : CVE tirée d'un rapport de chercheur ; « écrit en PHP et en Vue » vient des
  statistiques de langage de GitHub.
- `php/lecon-08` et `php/lecon-17` : sources lues dans des copies d'archive.org (les originaux
  ont disparu ou répondent 403) ; à la dernière vérification, archive.org répondait 429.
- `ruby/lecon-05` : le lien « symboles jamais libérés → déni de service » vient de l'avis JSON de
  Ruby (février 2013), pas de l'annonce Rails ; l'encadré le dit.
- `ruby/lecon-15` : la source BFCM 2024 ne nomme pas Rails ; c'est le billet de 2019 qui dit que
  Shopify est l'une des plus grandes bases Rails. L'encadré juxtapose les deux sans conclure.
- `ruby/lecon-16` : la page de DHH porte « July 24 » sans l'année ; 2004 vient du billet officiel
  « Rails is 2 years old » (2006), qui situe la sortie au 25 juillet (décalage horaire).
- `ruby/lecon-17` : l'auteure de la PR n'est identifiée que par « Eileen » (compte eileencodes) :
  son nom complet n'est pas écrit faute de source ouverte.
- `ruby/lecon-19` : la cause précise (donnée du serveur au mauvais type) n'est donnée que par la
  presse, non citée ; l'encadré s'en tient au ticket et à la réponse publiée.

## 7. Contrôles avant le dernier commit (codes de sortie)

| commande | code |
|---|---:|
| `node tools/verif-contenu.js --cas-reel --cours=php` | 0 |
| `node tools/verif-contenu.js --cas-reel --cours=ruby` | 0 |
| `node tools/verif-contenu.js --strict` | 0 |
| `node tools/verif-html.js` | 0 |
| `node tools/verif-domaines-interdits.js` | 0 |
| `node tools/verif-qcm-lexique.js` | 0 |
| `node tools/verif-qcm-biais.js` | 0 |
| `node tools/verif.js --rapide` | 1 — 52/54 OK, 2 signalés (`donnees` : I18 ; `doc-rec`), 712,6 s sous la charge des autres agents |

Fins de ligne : 0 CR dans les 43 fichiers modifiés (vérifié avec node). Jamais lancé :
`verif.js --mutations`. Aucun push, aucune autre branche touchée.

**Les rouges de `--rapide`, expliqués** :

- `donnees` — **I18 seul** (`node tools/verif-donnees.js` : 2 erreurs, toutes deux I18 :
  `search-index.js` publié 4 274 431 o, régénéré 4 278 819 o). Attendu : l'index de recherche
  est périmé par le texte des encadrés ; l'orchestrateur le régénère après la fusion.
- `doc-rec` (`tools/doc/verif-recherche.js`, 74 contrôles passés, **2 échecs**) — **causé par
  ce lot, et par tout lot B4** : `pages/doc/lecon-04.html` publie deux chiffres mesurés sur tout
  le site par `tools/doc/mesures/recours.js`. (1) « 11 portent un lien vers l'extérieur » : avec
  les liens de source, la mesure donne **52** (41 leçons de plus : les 43 de ce lot, moins
  `ruby/lecon-13` et `-14` qui avaient déjà un lien). (2) « 10 leçons » nomment Stack Overflow
  ou un assistant : **11**, à cause de `php/lecon-17` (la panne de 2016). Je n'ai pas touché
  la page du cours `doc` (hors de ma part, et chaque lot B4 qui ajoute des liens change le
  premier chiffre) : à **régénérer une fois tous les lots fusionnés** (`tools/doc/gen.js`).
  ⚠️ La leçon `doc/lecon-04` en tire une thèse — « Ce site est une île » (11 leçons sur 1 536) :
  après le V18, la phrase sera à relire, pas seulement le chiffre.

## 8. Ce qui reste ouvert, et consignes de fusion

- Les index dérivés (`js/search-index.js`, `pages/etude-recherche.html`…) n'ont pas été
  régénérés (consigne) : l'orchestrateur les régénère après la fusion.
- Fichiers touchés : `pages/php/lecon-01..21.html`, `pages/ruby/lecon-01..22.html` (l'encadré
  « Cas réel » et, pour 18 d'entre eux, l'intertitre qui le précède), et ce rapport. Aucun autre
  cours, aucun QCM, ni `js/data.js`.
- Après fusion avec les autres branches B4, relancer les deux cliquets QCM : ils sont verts ici,
  et les autres branches touchent d'autres cours, mais la référence du cliquet est commune.
- Toute retouche ultérieure de ces encadrés doit relancer `lexique-diff.js` (ou au moins
  `verif-qcm-lexique.js`) : un mot de six lettres, même dans une URL de source, compte.
- La contre-relecture annoncée peut partir des fichiers `scratchpad/b4-php-ruby/contenu-*.js`,
  qui donnent le texte exact de chaque encadré à côté de ses sources.
