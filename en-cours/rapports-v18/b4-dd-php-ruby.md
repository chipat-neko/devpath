# Rapport V18 — case B4 (lot 1), passe de dédoublonnage : `php` et `ruby`

Copie de travail `D:\test-claude-dd-php-ruby`, branche `v18/b4-dd-php-ruby`, partie de `8fd5290`.
Scripts et essais : `scratchpad/b4-dd-php-ruby/` de la copie (ignoré par git) — `remplacer.js`
(remplacement de l'intertitre collé et de l'encadré seuls), `mots-qcm.js` (mots d'options de QCM
à garder ou à ne pas écrire, page par page), `lire-cas.js` (relecture en texte brut), `texte.py`
(extraction du texte des sources), `phpwasm/` (PHP 8.4.27 en WebAssembly, `@php-wasm/node`),
`rubywasm/` (Ruby 3.4.1 en WebAssembly, `@ruby/3.4-wasm-wasi`), `apia.py` (Python `zoneinfo`).

## 1. Mission et bilan

Neuf « Cas réel » EXACTS (contre-relus au lot 1) dont le **sujet** appartient à un autre cours
(registre `tools/cas-reels/lots/foyers.md`). Règle : un sujet = un seul cours sur tout le site.
Chacun est **remplacé** par un autre vrai cas, sur la même notion que sa leçon, dont le sujet
n'est raconté nulle part ailleurs (recherche du sujet et de l'URL de la source dans tout `pages/`,
`doublons.js`, et réservation dans le fichier commun
`D:\test-claude\scratchpad\v18-parallele\dd-reservations.txt` avant écriture, relu après :
aucun conflit).

| cours | cas traités | trouvés VRAI (sujet pris ailleurs) | vérifié tel quel | corrigé | remplacé | Scénario |
|---|---:|---:|---:|---:|---:|---:|
| `php` | 5 | 5 | 0 | 0 | **5** | 0 |
| `ruby` | 4 | 4 | 0 | 0 | **4** | 0 |
| **total** | **9** | **9** | **0** | **0** | **9** | **0** |

Pour `ruby`, la consigne demandait un cas **Ruby** quand l'ancien était un cas Python (`lecon-03`,
`lecon-06`) : les quatre nouveaux cas Ruby sont des cas de l'écosystème Ruby (Ruby, RSpec, Rails,
une bibliothèque Ruby de GitHub). Les cinq nouveaux cas PHP sont des cas PHP, sauf `lecon-20`
(Cloudflare), choisi pour la notion (une dépendance tierce qui tombe).

Chaque affirmation a été confrontée à une source **ouverte** (WebFetch ou `curl`, texte extrait
et relu) ; les comportements techniques ont été **exécutés** (§ 4). Les intertitres `<h2>`
« Un cas réel : … » collés au-dessus des encadrés de `php/lecon-07, -08, -17, -18, -20` ont été
réécrits pour le nouveau récit (les quatre leçons `ruby` n'en ont pas).

## 2. Cas par cas — `php`

| identifiant | état trouvé | action | nouveau titre (et intertitre) | sources ouvertes |
|---|---|---|---|---|
| `pages/php/lecon-07.html#1` | VRAI (contre-relu), événement — sujet TalkTalk gardé par `securite/lecon-03` | remplacé par : l'avis SA-CORE-2014-005 de Drupal 7 (« Drupalgeddon ») — injection SQL **dans** la couche de requêtes préparées : les noms des marqueurs d'un paramètre tableau étaient bâtis avec les **clés** du tableau et collés dans le texte SQL ; correctif d'une ligne (`array_values()`) ; attaques automatisées dans les heures, sites non corrigés avant le 15/10 23 h UTC à tenir pour compromis | Cas réel — Drupal 7 et l'avis SA-CORE-2014-005 (2014) ; intertitre « la clé de tableau qui finissait dans le SQL » | https://www.drupal.org/SA-CORE-2014-005 ; https://www.drupal.org/PSA-2014-003 ; https://github.com/drupal/drupal/commit/26a7752c34321fd9cb889308f507ca6bdb777f08 (le correctif, 1 ligne de `database.inc`) ; https://github.com/drupal/drupal/commit/449c7028749767f2de5eff4bbba04ba27346056f (le test : un `INSERT` dans une clé) ; https://github.com/drupal/drupal/compare/7.31...7.32 ; `database.inc` 7.31 et 7.32 téléchargés et comparés (`diff` : la seule ligne changée) |
| `pages/php/lecon-08.html#1` | VRAI (contre-relu), événement — sujet Parity gardé par `solidity/lecon-16` | remplacé par : la RFC « Asymmetric Visibility v2 » (Tovilo et Garfield, 9 mai 2024, adoptée 24 contre 7) et PHP 8.4 : `public private(set)` remplace le couple propriété privée + getter (exemple `PhpVersion` de l'annonce) ; limite de `readonly` selon la RFC | Cas réel — PHP 8.4 et la visibilité asymétrique (2024) ; intertitre « lire de partout, écrire de l'intérieur » | https://wiki.php.net/rfc/asymmetric-visibility-v2 (date, auteurs, introduction, « Readonly is limited », tableau du vote 24/7) ; https://www.php.net/releases/8.4/en.php ; https://www.php.net/archive/2024.php (« PHP 8.4.1 Released! », 21 nov. 2024) ; https://www.php.net/manual/en/language.oop5.visibility.php (message d'erreur) |
| `pages/php/lecon-17.html#1` | VRAI (contre-relu), événement — sujet Stack Overflow 2016 gardé par `regex/lecon-09` | remplacé par : la RFC de Nikita Popov (4 février 2012) qui retire le modificateur `/e` de `preg_replace()` — la chaîne de remplacement évaluée comme du code, l'exemple `strtoupper("$2")` exploité par `{${eval($_GET[php_code])}}`, `addslashes` « faux sentiment de sécurité », `preg_replace_callback()` ; vote 23 contre 4 ; obsolète en 5.5, retiré en 7.0 | Cas réel — PHP retire le modificateur /e de preg_replace() (2012) ; intertitre « le remplacement qui exécutait du code » | https://wiki.php.net/rfc/remove_preg_replace_eval_modifier ; https://github.com/php/php-src/blob/PHP-5.5/UPGRADING (« The preg_replace /e modifier is now deprecated ») ; https://github.com/php/php-src/blob/PHP-7.0/UPGRADING (« Removed support for /e (PREG_REPLACE_EVAL) modifier ») |
| `pages/php/lecon-18.html#1` | VRAI (contre-relu), événement — sujet Azure 29/02/2012 gardé par `python/lecon-17` | remplacé par : les Samoa sautent le vendredi 30 décembre 2011 (loi sur la ligne de date : UT −11 → +13 ; jeudi 29 à 23:59:59 suivi du samedi 31 à 0 h) ; PHP le sait par sa base des fuseaux (zone `Pacific/Apia`) | Cas réel — les Samoa sautent le 30 décembre (2011) ; intertitre « le jour qui n'a jamais existé aux Samoa » | https://github.com/eggert/tz/blob/main/australasia (commentaires du 2 sept. 2011, publication du ministère samoan, et du 27 juin 2014, citation de l'International Date Line Act 2011 ; règles `WS` et zone `Pacific/Apia`) ; https://raw.githubusercontent.com/eggert/tz/main/NEWS (data2011j : « contemporary changes for Samoa ») ; https://www.php.net/manual/en/datetimezone.listidentifiers.php (identifiants IANA) ; https://www.php.net/manual/en/function.timezone-version-get.php et https://pecl.php.net/package/timezonedb (base embarquée, mise à jour par PHP ou PECL). La loi elle-même (PacLII) refuse les robots (403) : elle n'est citée qu'à travers la base tz |
| `pages/php/lecon-20.html#1` | VRAI (contre-relu), produit nommé — sujet Netflix/Hystrix gardé par `archi/lecon-10` | remplacé par : la panne de Cloudflare du 12 juin 2025 — Workers KV, dont dépendent configuration et authentification de nombreux produits, repose en partie sur un fournisseur cloud tiers en panne ; 90,22 % des requêtes KV échouent (celles que le cache ne sert pas) ; Access, qui « échoue fermé », rate 100 % des connexions par identité ; remèdes annoncés | Cas réel — la panne de Cloudflare (12 juin 2025) ; intertitre « une dépendance en panne peut tout faire tomber » | https://blog.cloudflare.com/cloudflare-service-outage-june-12-2025/ |

## 3. Cas par cas — `ruby`

| identifiant | état trouvé | action | nouveau titre | sources ouvertes |
|---|---|---|---|---|
| `pages/ruby/lecon-02.html#1` | VRAI (contre-relu), événement — sujet gènes/Excel gardé par `python/lecon-02` | remplacé par : la demande Feature #12732 d'Aaron Patterson (7 sept. 2016 : `Integer()`/`Float()` qui renvoient `nil` au lieu de lever) ; réunion des développeurs ; objection de Matz (exception rattrapée) et réponse (plus lent, bruyant avec `-d`) ; acceptée le 24 janv. 2018 ; `exception:` dans Ruby 2.6 (25 déc. 2018) | Cas réel — Ruby 2.6 et `Integer(…, exception: false)` (2018) | https://bugs.ruby-lang.org/issues/12732 (et `.json?include=journals,changesets` : dates, notes 6 et 8, changesets r62757…) ; https://github.com/ruby/ruby/blob/v2_6_0/NEWS ; https://www.ruby-lang.org/en/news/2018/12/25/ruby-2-6-0-released/ |
| `pages/ruby/lecon-03.html#1` | VRAI (contre-relu), événement — sujet « minuit faux » de Python gardé par `python/lecon-38` ; et un cas Ruby vaut mieux | remplacé par : RSpec 3 renomme `be_true`/`be_false` en `be_truthy`/`be_falsey` — ils suivaient la vérité de Ruby (toute valeur sauf `nil`/`false`), `be true` ne passe que pour `true` exact | Cas réel — RSpec 3 renomme `be_true` en `be_truthy` (2014) | https://github.com/rspec/rspec-expectations/issues/283 (7 juillet 2013, texte de Myron Marston) ; https://rspec.info/blog/2014/05/notable-changes-in-rspec-3/ (21 mai 2014, § « Boolean matchers have been renamed ») |
| `pages/ruby/lecon-06.html#1` | VRAI (contre-relu), événement — sujet PEP 343 gardé par `python/lecon-34` ; et un cas Ruby vaut mieux | remplacé par : Rails et la sortie d'un bloc de transaction par `return`/`break`/`throw` — `Timeout.timeout` sort par `throw`, Rails validait la transaction, l'`ensure` ne distingue pas ; obsolète en 6.1, annulation en 7.0, commit rétabli (option par défaut des nouvelles applis) en 7.1 après `timeout` 0.4.0 | Cas réel — Rails, le `return` et les transactions (2017) | https://github.com/rails/rails/pull/29333 (description, dates d'ouverture 2 juin 2017 et de fusion 18 mars 2020) ; https://github.com/rails/rails/blob/6-1-stable/activerecord/CHANGELOG.md ; https://github.com/rails/rails/blob/7-0-stable/activerecord/CHANGELOG.md ; https://github.com/rails/rails/blob/7-1-stable/activerecord/CHANGELOG.md (et 7-2-stable, lu pour contrôle) |
| `pages/ruby/lecon-14.html#1` | VRAI (contre-relu), produit nommé — sujet SQLite gardé par `csharp/lecon-19` | remplacé par : GitHub publie Scientist 1.0 (3 févr. 2016), bibliothèque Ruby née de la réécriture du code des permissions : ancien et nouveau code exécutés, comparés, écarts et durées enregistrés, résultat de l'ancien rendu ; « pourquoi les tests ne suffisent pas » | Cas réel — GitHub publie Scientist (2016) | https://github.blog/developer-skills/application-development/scientist/ ; https://github.com/github/scientist (« A Ruby library for carefully refactoring critical paths ») |

## 4. Ce qui a été exécuté (un comportement technique se teste)

- **PHP 8.4.27** (`@php-wasm/node` 3.1.64, base des fuseaux 2026.5) : `new DateTimeImmutable('2011-12-29 23:59:59', new DateTimeZone('Pacific/Apia'))` → `2011-12-29 23:59:59 -10:00 Thursday` ; `->modify('+1 second')` → `2011-12-31 00:00:00 +14:00 Saturday` (et une date du 30 décembre demandée glisse sans prévenir au 31) ; `public private(set) string $version` : lecture et `increment()` OK, écriture externe → `Error: Cannot modify private(set) property PhpVersion::$version from global scope` ; `preg_replace('/(\w+)/e', …)` → avertissement « Unknown modifier 'e' » et `NULL` ; `preg_replace_callback` sur l'entrée de la RFC → `<h1>{${EVAL($_GET[PHP_CODE])}}</h1>`, rien d'exécuté.
- **Ruby 3.4.1** (`@ruby/3.4-wasm-wasi`) : `"abc".to_i` → `0` ; `Integer("abc")` → `ArgumentError: invalid value for Integer(): "abc"` ; `Integer("abc", exception: false)` → `nil` ; `Integer("42", exception: false)` → `42` ; `0` et `""` vrais dans un `if` ; un `return` (et un `throw`) écrit dans un bloc traverse la méthode qui fait `yield` : son `ensure` s'exécute et voit le bloc « quitté en route » dans les deux cas, alors qu'un `next` termine le bloc normalement.
- **Python 3.14** (`zoneinfo`, `tzdata` 2026c) : à Apia, 2011-12-30 09:59:59 UTC = 2011-12-29 23:59:59 −10:00, une seconde après = 2011-12-31 00:00:00 +14:00.
- **Drupal** : `database.inc` des étiquettes 7.31 et 7.32 téléchargés et comparés : une seule ligne diffère (`foreach ($data as $i => $value)` → `foreach (array_values($data) as $i => $value)`).

Note d'outillage : `@php-wasm/node` 3.1.64 exige `emscriptenOptions: { processId: 1 }` hors de
Vitest (« PHPLoader.processId must be set before init ») ; `@ruby/wasm-wasi` s'emploie par
`DefaultRubyVM` de `dist/node`. Les deux tournent sous Node 24 sans rien installer hors du
dossier de travail — utile aux prochains lots `php`/`ruby` et à la contre-relecture.

## 5. Neutralité lexicale et contrôles

Avant d'écrire, `mots-qcm.js` a listé, page par page, les mots d'options de QCM (6 lettres et
plus) présents **seulement** dans l'ancien encadré (à garder : `paramètres` en `php/07`, `valeur`
en `php/17`, `serveur` en `php/18`, `prestataire` en `php/20`) et ceux **absents** de la page (à
ne pas écrire : par exemple `rescue` en `ruby/02`, `exception`, `équipes`, `valeurs`, `réelles`
en `ruby/14`, `quitter`, `termine` en `ruby/06`, `placeholders` en `php/07`). Résultat :

| contrôle | code |
|---|---:|
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-dd-php-ruby 8fd5290` | **0** écart (9 pages) |
| `node tools/verif-contenu.js --cas-reel --cours=php` | **0** (21 conformes sur 21) |
| `node tools/verif-contenu.js --cas-reel --cours=ruby` | **0** (22 conformes sur 22) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/verif.js --rapide` | **1** : `donnees` (I18) et `doc-rec` (compteur dérivé), voir § 6 |
| `node tools/cas-reels/lots/controle-branche.js D:\test-claude-dd-php-ruby 8fd5290` | OK (0 CR, octets identiques hors « Cas réel », 9 zones avant et après, types gardés, signatures) |

0 CR dans les neuf pages ; `doublons.js` ne liste plus aucune des neuf sources ni aucun des
neuf sujets remplacés pour `php` et `ruby` (il reste `php/lecon-16` / `react/lecon-23`, CRMEB,
dont `php/lecon-16` est le foyer : l'autre côté est à un autre agent). Chacun des neuf nouveaux
sujets et chacune de leurs URL n'apparaissent que dans leur page (`grep -rl` sur `pages/`).

## 6. `verif.js --rapide`

Code **1**, 236,4 s, 54 étapes jouées : **52 vertes, 2 rouges**, toutes deux des chiffres
DÉRIVÉS que l'orchestrateur régénère après fusion.

- `donnees` — invariant **I18** seul (les 2 « ERREURS » de `verif-donnees.js` sont ses deux
  lignes) : `search-index.js` publié 4 314 440 o, régénéré 4 314 980 o. Toléré par la consigne.
- `doc-rec` (`tools/doc/verif-recherche.js`, 76 contrôles passés, 1 échec) : « introuvable dans
  la page : 8 leçons ». `pages/doc/lecon-04.html` publie « 9 leçons nomment bien Stack Overflow
  ou un assistant de code » (mesure `tools/doc/mesures/recours.js`, motif `nomment`) ; or
  `php/lecon-17` ne raconte plus la panne de Stack Overflow : la mesure vaut **8**. La phrase
  reste juste sur le fond (« la panne de 2016 » est toujours racontée, par `regex/lecon-09`, son
  foyer). Les pages du cours `doc` sont **générées** par `node tools/doc/gen.js` ; essayé dans la
  copie, il ne change que trois chiffres, tous dus à ce lot : `doc/lecon-04` 9 → 8 (Stack
  Overflow), `doc/lecon-02` « overflow : 24 cours » → 23 (le cours `php` ne contient plus le mot),
  `doc/lecon-03` « 17 leçons mentionnent un journal des modifications » → 18 (`ruby/lecon-06`
  cite les journaux des changements de Rails). Pages **remises à l'état de la base** et non
  commitées : elles sont hors des « Cas réel » (`controle-branche.js` les refuserait), et les
  autres agents du dédoublonnage bougeront les mêmes compteurs. **À faire après la fusion de
  tous : `node tools/doc/gen.js`**, puis `node tools/doc/verif-recherche.js`.

## 7. Doutes, et ce qui reste ouvert

- `php/lecon-07` : le cours `php` raconte déjà Drupal 7 en `lecon-10` (les transactions,
  ticket n° 108818, 2009). Sujet différent (un avis de sécurité de 2014), même produit : gardé,
  mais un relecteur peut préférer un autre CMS.
- `php/lecon-08` : un changement du langage plutôt qu'un incident ; choisi parce qu'il porte
  exactement la notion (visibilité, getter, `readonly`), et que la leçon enseigne `readonly`.
- `php/lecon-18` : la loi samoane n'a pas pu être ouverte (PacLII répond 403 aux robots, le site
  du parlement samoan ne répond plus et n'est pas archivé) ; elle est citée telle que la base tz
  la cite (commentaire de Paul Eggert, 27 juin 2014). Le « −10 h » vient de l'heure d'été en
  vigueur, que la base tz décrit (règles `WS` 2011) et que PHP et Python donnent.
- `ruby/lecon-03` : la phrase de liaison « un 0 ou une chaîne vide … passaient donc un test
  `be_true` » est une **déduction** (règle de la source + règle de Ruby, exécutée), pas une
  phrase de la source.
- `ruby/lecon-06` : le journal de Rails 7.1 écrit que l'**annulation** date d'Active Record 6.1,
  alors que les journaux de 6.1 (« Deprecate … ») et de 7.0 (« Rollback transactions when the
  block returns earlier than expected ») la placent en 7.0 : le cas suit les journaux de 6.1 et
  7.0. Le titre porte 2017 (le signalement), l'histoire court jusqu'à Rails 7.1.
- `ruby/lecon-14` : Scientist dit « les tests ne suffisent pas » dans une leçon qui enseigne les
  tests ; la phrase de liaison cite GitHub (« extrêmement important » de couvrir de tests le code
  réécrit) pour ne pas laisser croire le contraire.
- Piège de recherche noté en passant : `grep -i "T-Connect"` trouve `pages/powershell/lecon-04`,
  `-06`, `-11`, mais c'est `Test-Connection` — Toyota T-Connect (réservé par un autre agent pour
  `csharp/lecon-22`) n'est raconté nulle part. Chercher un sujet avec un motif assez long.

## 8. Consignes de fusion

- Fichiers touchés : les neuf pages ci-dessus (intertitre collé + encadré seulement) et ce
  rapport. Aucun QCM, aucun index dérivé, aucun outil.
- À ajouter au registre `tools/cas-reels/lots/foyers.md` (sujets que d'autres cours pourraient
  vouloir) : Drupal SA-CORE-2014-005 → `php/lecon-07` ; RFC `/e` de `preg_replace` →
  `php/lecon-17` ; les Samoa et le 30 décembre 2011 → `php/lecon-18` ; panne de Cloudflare du
  12 juin 2025 → `php/lecon-20` ; RFC visibilité asymétrique → `php/lecon-08` ; `be_truthy` de
  RSpec 3 → `ruby/lecon-03` ; Rails, `return` et transactions → `ruby/lecon-06` ; Scientist de
  GitHub → `ruby/lecon-14` ; `Integer(…, exception: false)` → `ruby/lecon-02`.
- Après fusion : régénérer les pages dérivées (index de recherche, `etude-recherche.html`) **et
  les pages du cours `doc`** (`node tools/doc/gen.js` : trois compteurs bougent, § 6) ;
  contre-relecture des neuf cas avec `cr-extraire.js` (intertitres compris).
