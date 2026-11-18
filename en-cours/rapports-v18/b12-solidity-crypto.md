# Rapport V18 — case B12, lot 9 : les cours `solidity` et `crypto` (copie `b12-solidity-crypto`, branche `v18/b12-solidity-crypto`)

Copie de travail `D:\test-claude-b12-solidity-crypto`, partie de `8c65449`. Part traitée : les **28 « Cas réel »**
des cours `solidity` (17 encadrés ou sections, un par leçon) et `crypto` (11 sections `<h2>Cas réel</h2>`, une par
leçon). Scripts et pièces dans `scratchpad/b12-solidity-crypto/` (ignoré par git) : `cas.js` (les cas d'un cours,
via `extraction.js`), `sujets.js` (un motif cherché dans les « Cas réel » de tout le site, dans `foyers.md` et
dans les réservations), `applique.js` (encadrés : remplace du titre au `</div></div>` ; pour les leçons 13 à 17,
l'intertitre `<h2>` et l'encadré qu'il coiffe), `applique-section.js` (sections `<h2>` du cours `crypto`, jusqu'au
`<h2>` suivant), tous deux prouvant que les octets hors de la zone sont identiques ; `contenu-solidity.js` et
`contenu-crypto.js` (les 28 textes), `retouche.js` et `lex*.json`, `crypto*.json` (retouches exactes),
`typo.js` (espaces insécables, guillemets, CR), `pdf.py` (pypdf), les originaux dans `originaux/`, les PDF et
pages lus (`*.pdf`, `*.txt`, `*.html`).

**En une phrase** : `node tools/verif-contenu.js --cas-reel` passe de **17 hors de la règle à 0** pour `solidity`
et de **11 à 0** pour `crypto` ; sur les 28 cas, **aucun n'était conforme**, **13 remplacés** par un cas réel daté
et sourcé sur la même notion, **15 gardés sur leur sujet et corrigés à la source**, **0 gardé tel quel** (tous
ont reçu au moins une ligne de source, un titre daté ou une correction), **0 renommé « Scénario »**.

**Commits** (branche `v18/b12-solidity-crypto`) : `01d8eef` (solidity, 17 cas), `c833009` (crypto, 11 cas), puis
le commit de ce rapport.

## Méthode

- **Un sujet = un seul cours, et un seul cas.** Chaque sujet cherché dans `tools/cas-reels/lots/foyers.md`, dans
  les « Cas réel » de tout `pages/` (script `sujets.js`, plus rapide qu'un `grep` sur une machine partagée) et
  dans `D:/test-claude/scratchpad/v18-parallele/b12-reservations.txt`, puis réservé (28 lignes ; une seconde
  ligne pour `solidity/lecon-16`, dont la première URL ne répondait pas). Aucune collision.
- **Doublons internes levés** (consigne) : The DAO était raconté **trois fois** (`solidity/lecon-01`, `-06`,
  `-17`) → gardé en 06 seulement ; le portefeuille Parity **trois fois** (03, 11, 16 ; foyer `solidity/lecon-16`
  au registre) → gardé en 16 ; CryptoKitties **deux fois** (08, 15) → gardé en 15 (la leçon ERC-721) ; ERC-20
  raconté en 04, 09 et 14 → l'histoire du standard (EIP-20) est désormais en 14, la leçon ERC-20 ; 09 garde un
  sujet distinct (le bogue des valeurs de retour de 2018), 04 change de sujet. Dans `crypto`, LinkedIn (07) et
  Adobe (08) ont leur foyer dans `securite` (consigne), Uber 2016 (09) a le sien en `iac/lecon-10` (registre) :
  les trois sont remplacés.
- **Forme** : titre `Cas réel — sujet (année)` ; pour les sections de `solidity/lecon-13` à `-17`, c'est
  l'**intertitre `<h2>`** qui porte le titre (l'outil juge la section), et le titre de l'encadré qu'il coiffe a
  été réécrit quand il ne disait plus le cas (13, 14, 17). Les 11 sections du cours `crypto` étaient intitulées
  « Cas réel » tout court : chacune reçoit sujet et année. Dernier paragraphe `<p class="cas-reel__source">`
  daté et lié ; aucun lien dans le corps ; `&nbsp;` devant « : ; ? ! » et dans « » (vérifié par `typo.js`).
- **Calculs rejoués** (Python 3.14) : √(π/2)·2⁸⁰ = 1,515 × 10²⁴ et 2⁶³ = 9 223 372 036 854 775 808, rapport
  164 274 (SHAttered) ; √(π/2)·2¹² = 5 133,6 paquets et 2²⁴ × 1 500 octets à 5 Mbit/s = 11,2 h (WEP) ;
  164,1 GH/s ÷ 184,0 kH/s = 891 848 (MD5 contre bcrypt coût 5, même banc hashcat que la leçon 7) ;
  3 × 32 767 = 98 301 (Debian) ; 0x8 suivi de 63 zéros hexadécimaux = 2²⁵⁵, et 2 × 2²⁵⁵ déborde un `uint256`
  à 0 (BeautyChain).
- **Sources fermées au simple outil web** (Medium, IACR, Springer, Etherscan) : téléchargées par `curl` puis lues
  avec `pypdf` ou un extracteur de texte ; les contrats et tickets par l'API GitHub (`gh api`). Une seule image
  lue : la diapositive « Sony's ECDSA code » du 27C3 (le dessin xkcd n° 221, confirmé par l'API de xkcd).
- **Lexique** : `lexique-diff.js` rendait 15 écarts (solidity) puis 23 (crypto) au premier jet ; chaque mot
  d'option de QCM perdu a été remis dans une phrase **exacte** (« laissé », « comptes », « double »,
  « structurelle », « collision », « conception », « cryptanalyse », « publication »…), chaque mot gagné
  retiré (« repéré », « financer », « transaction », « coûterait », « choisis », « finale »…) → **0 écart**.

## Les 28 cas, un par un

Légende de l'état trouvé : VRAI, INEXACT (quoi), INVÉRIFIABLE, INVENTÉ ; nature : événement, produit nommé,
anonyme, général.

### `solidity` (17)

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/solidity/lecon-01.html#1` | VRAI sur le fond mais **doublon** (The DAO, foyer du cours en 06) ; événement ; « ~150 M$ » | **Remplacé** — notion : l'immuabilité | Cas réel — Ethereum reporte Constantinople (2019) | https://blog.ethereum.org/2019/01/15/security-alert-ethereum-constantinople-postponement ; https://blog.ethereum.org/2019/02/22/ethereum-constantinople-st-petersburg-upgrade-announcement |
| `pages/solidity/lecon-02.html#1` | INEXACT : « la valeur s'est effondrée » non sourcé ; « de grandes plateformes ont suspendu les dépôts » (PeckShield : OKEx suspend retraits et échanges du BEC) ; événement | **Corrigé** : mécanisme exact (`cnt * _value`, 2²⁵⁵ × 2 = 0), douzaine d'autres contrats, OKEx ; Solidity 0.8.0 daté | Cas réel — le jeton BeautyChain et batchOverflow (2018) | https://peckshield.medium.com/alert-new-batchoverflow-bug-in-multiple-erc20-smart-contracts-cve-2018-10299-511067db6536 ; https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2018-10299 ; https://docs.soliditylang.org/en/v0.8.0/080-breaking-changes.html ; https://soliditylang.org/blog/2020/12/16/solidity-v0.8.0-release-announcement/ |
| `pages/solidity/lecon-03.html#1` | VRAI mais **doublon** (gel Parity, foyer 16) ; événement | **Remplacé** — notion : la visibilité | Cas réel — Solidity 0.5.0 rend la visibilité obligatoire (2018) | https://docs.soliditylang.org/en/v0.5.0/050-breaking-changes.html ; https://docs.soliditylang.org/en/v0.4.24/contracts.html ; https://swcregistry.io/docs/SWC-100/ ; date de la 0.5.0 par l'API GitHub (`argotorg/solidity`, 13 nov. 2018) |
| `pages/solidity/lecon-04.html#1` | INVÉRIFIABLE et **doublon ERC-20** : « des centaines de milliards reposent sur cette structure », « quasi-totalité des jetons » ; général | **Remplacé** — notion : tableaux et mappings | Cas réel — GovernMental, des tableaux trop longs pour être vidés (2016) | https://link.springer.com/content/pdf/10.1007/978-3-662-54455-6_8.pdf (§ 4.5 et note 18) ; http://governmental.github.io/GovernMental/ ; https://github.com/GovernMental/GovernMental (code du contrat, dépôt créé le 10 mars 2016) |
| `pages/solidity/lecon-05.html#1` | INVÉRIFIABLE : « des millions de contrats », « plusieurs projets » anonymes ; général | **Remplacé** — notion : `msg.sender`, constructeur, modificateur | Cas réel — Rubixi, le constructeur resté public (2016) | Atzei et al. (§ 4.3, URL ci-dessus) ; https://github.com/crytic/not-so-smart-contracts/tree/master/wrong_constructor_name ; https://bitcointalk.org/index.php?topic=1400536.60 ; https://docs.soliditylang.org/en/v0.4.24/contracts.html ; date de la 0.4.22 par l'API GitHub |
| `pages/solidity/lecon-06.html#1` | VRAI (B2), un détail INEXACT : « plus de 150 M$ » (SEC : environ) ; événement | **Gardé, corrigé** : 17 juin 2016, ~12 M ether ≈ 150 M$, fonction `split` rappelée récursivement, fork du 20 juillet, Ethereum Classic | Cas réel — la réentrance de The DAO (2016) | https://www.sec.gov/litigation/investreport/34-81207.pdf ; https://blog.ethereum.org/2016/06/17/critical-update-re-dao-vulnerability ; https://ethereum.org/en/developers/docs/smart-contracts/security/ |
| `pages/solidity/lecon-07.html#1` | INEXACT : « ré-emprunté en boucle sur un solde jamais décrémenté » (post-mortem : `exitMarket()` hors du verrou, garantie récupérée avant l'enregistrement de la dette) ; « un simple ReentrancyGuard l'aurait empêchée » (le code avait un verrou) ; « alors fusionné avec Fei » non sourcé ; événement | **Gardé, corrigé** | Cas réel — la réentrance n'a pas disparu (Fuse de Rari Capital, 2022) | https://medium.com/@JackLongarzo/fuse-exploit-post-mortem-76ce18d8974 ; https://github.com/Rari-Capital/compound-protocol/pull/10 (API GitHub) |
| `pages/solidity/lecon-08.html#1` | **Doublon** CryptoKitties (foyer 15) et INEXACT : « contrat antérieur à ERC-721, que son équipe a proposée peu après » (la proposition n° 721 date de septembre 2017, avant la vague de décembre) ; événement | **Remplacé** — notion : mainnet et testnets | Cas réel — la Fusion d'Ethereum répétée sur les testnets (2022) | https://blog.ethereum.org/2022/08/24/mainnet-merge-announcement ; https://blog.ethereum.org/2022/06/21/testnet-deprecation ; https://ethereum.org/roadmap/merge/ |
| `pages/solidity/lecon-09.html#1` | VRAI en partie, mais **doublon ERC-20** et « des milliers de jetons compatibles avec MetaMask » non sourcé ; « proposé par Fabian Vogelsteller » (EIP-20 : avec Vitalik Buterin) ; produit nommé | **Remplacé** par le second sujet de l'original, rendu précis — notion : standards, OpenZeppelin | Cas réel — les jetons ERC-20 sans valeur de retour (2018) | https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca ; https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol ; https://eips.ethereum.org/EIPS/eip-20 |
| `pages/solidity/lecon-10.html#1` | INEXACT : « la majorité visant des protocoles DeFi » (82,1 %) ; « des tests adverses et du fuzzing auraient très probablement révélé ces failles » absent de la source ; méthode non dite ; chiffre révisé depuis ; événement | **Gardé, corrigé** : 3,8 Md$ au 1ᵉʳ février 2023, ramené à 3,7 Md$ en janvier 2024, calcul non détaillé par le billet, 82,1 % contre 73,3 %, 64 % par les ponts, recommandation « attaques simulées » | Cas réel — 2022, année record des piratages | https://www.chainalysis.com/blog/2022-biggest-year-ever-for-crypto-hacking/ ; https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2024/ |
| `pages/solidity/lecon-11.html#1` | VRAI mais **doublon** (gel Parity, foyer 16) ; événement | **Remplacé** — notion : proxy, collisions de slots, initialisation | Cas réel — Audius et la collision de slots de son proxy (2022) | https://blog.audius.co/posts/audius-governance-takeover-post-mortem-7-23-22 |
| `pages/solidity/lecon-12.html#1` | INEXACT : « environ 180 M$ » (Beanstalk : environ 77 M$ volés dans les réserves ; 181-182 M$ est un chiffre de presse) ; « en une seule transaction » juste ; événement | **Gardé, corrigé** : flash-loan de plus d'un milliard (Aave, Uniswap, SushiSwap), deux tiers des voix, `emergencyCommit` un jour après le dépôt, BIP-18 | Cas réel — Beanstalk, une majorité empruntée (avril 2022) | https://bean.money/blog/beanstalk-governance-exploit ; https://immunefi.com/blog/bug-fix-reviews/hack-analysis-beanstalk-governance-attack-april-2022/ |
| `pages/solidity/lecon-13.html#1` | INVÉRIFIABLE (B2) : « les grands protocoles », « des millions de dollars épargnés » ; général | **Remplacé** — notion : slots de stockage, événements contre stockage ; intertitre et titre d'encadré réécrits | Cas réel — ERC721A, le mint par lots d'Azuki (2022) | https://github.com/chiru-labs/ERC721A (README, `docs/design.md`, `contracts/ERC721A.sol`, par l'API GitHub) |
| `pages/solidity/lecon-14.html#1` | INVÉRIFIABLE : « des milliers de projets », « des milliards » non sourcés ; général | **Remplacé** — notion : interface ERC-20, transfert délégué ; intertitre et titre d'encadré réécrits | Cas réel — ERC-20, de la proposition à la faille d'approve (2015-2016) | https://eips.ethereum.org/EIPS/eip-20 ; https://github.com/ethereum/EIPs/issues/20 et commentaire 263524729 (API GitHub) ; https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/ (export texte) |
| `pages/solidity/lecon-15.html#1` | VRAI sur le fond, sans source ; « Bored Ape », vague 2021 non sourcés ; événement | **Gardé, corrigé** : chiffres de ConsenSys (requêtes ×6, 2 → 4 milliards par jour chez Infura, frais supérieurs au prix du chaton), proposition ERC-721 de Dieter Shirley (Axiom Zen) en septembre 2017 | Cas réel — CryptoKitties engorge Ethereum (2017) | https://consensys.com/blog/the-inside-story-of-the-cryptokitties-congestion-crisis ; https://eips.ethereum.org/EIPS/eip-721 ; https://github.com/ethereum/EIPs/issues/721 (API GitHub) |
| `pages/solidity/lecon-16.html#1` | VRAI (foyer du registre), chiffres arrondis (« plus de 500 000 ETH ») ; événement | **Gardé, corrigé** : 6 novembre 2017, « devops199 », `kill`, 587 portefeuilles, 513 774,16 ether ; `delegatecall` cité du code | Cas réel — le gel du multisig Parity (2017) | https://medium.com/paritytech/a-postmortem-on-the-parity-multi-sig-library-self-destruct-63daca3a4cf7 ; https://github.com/openethereum/parity-ethereum/blob/v1.7.0/js/src/contracts/snippets/enhanced-wallet.sol (API GitHub) |
| `pages/solidity/lecon-17.html#1` | VRAI mais **doublon** (The DAO, foyer 06) ; « siphonnant un tiers des fonds » juste ; événement | **Remplacé** — notion : le motif *pull payment* ; intertitre et titre d'encadré réécrits | Cas réel — King of the Ether Throne et ses paiements perdus (2016) | https://www.kingoftheether.com/postmortem.html ; https://docs.soliditylang.org/en/latest/common-patterns.html ; Atzei et al. § 4.2 |

### `crypto` (11)

| Cas | État trouvé | Action | Nouveau titre | Sources ouvertes |
|---|---|---|---|---|
| `pages/crypto/lecon-01.html#1` | INEXACT : « un budget de l'ordre de 110 000 $ sur une infrastructure louée » (l'article : estimation, au prix « spot », de la seule seconde phase si on la louait ; le calcul a tourné sur des grappes de Google ; 560 000 $ au tarif normal) ; « une faiblesse structurelle bat toujours la force brute » (généralisation) ; événement | **Gardé, corrigé** ; liste des usages vulnérables de shattered.io (2017) ; Schneier 2012 | Cas réel — SHAttered, la première collision de SHA-1 (2017) | https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html ; https://shattered.io/static/shattered.pdf (§ 1, § 6.2) ; https://web.archive.org/web/20170224000000/https://shattered.io/ ; https://shattered.io/ |
| `pages/crypto/lecon-02.html#1` | INEXACT : « beaucoup de cartes » (BGW : les cartes PCMCIA *qu'ils ont examinées*) ; « collision certaine », « quelques minutes sur un réseau chargé » mêlés ; « IV changé à chaque paquet » (recommandé, non exigé) ; « WEP officiellement abandonné en 2004 » non sourcé ; événement | **Gardé, corrigé** : 5 000 paquets / « quelques minutes de transmission », demi-journée pour un point d'accès chargé, 30 janvier puis MobiCom, clé de 128 bits d'un réseau en production, 802.11i (juin 2004) et WPA2 (septembre 2004) | Cas réel — WEP, le chiffrement du premier Wi-Fi (1997-2004) | https://csclub.uwaterloo.ca/~iagoldbe/pubs/wep-mob01.pdf ; https://web.archive.org/web/2001/http://www.isaac.cs.berkeley.edu/isaac/wep-faq.html ; https://web.cs.miami.edu/home/burt/learning/Csc524.052/docs/stubbl.pdf ; https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-97.pdf |
| `pages/crypto/lecon-03.html#1` | INEXACT (mineur) ; « au moins sept fournisseurs » (site) contre **neuf** dans l'article final ; « variantes bien plus bas » imprécis ; événement | **Gardé, corrigé** : 10 000 / 18 millions de requêtes selon l'oracle, neuf fournisseurs, signature avec la clé de facebook.com, recommandation d'abandon | Cas réel — l'oracle de Bleichenbacher, de 1998 à ROBOT (2017) | https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-bock.pdf ; https://robotattack.org/ ; https://eprint.iacr.org/2017/1189 (date de dépôt) |
| `pages/crypto/lecon-04.html#1` | INEXACT ou non sourcé : versions 3.56 et 3.60 de Sony introuvables ; « de Berlin » non sourcé ; Android 2013 : « valeurs de k répétées », « fonds dérobés » absents des sources primaires ouvertes ; événement | **Gardé, corrigé** : diapositives du 27C3 (règle du nombre unique, xkcd « Sony's ECDSA code », « SIGN THINGS ») ; Android réduit à l'avis de bitcoin.org et au billet de Google | Cas réel — PS3 Epic Fail, la signature ECDSA de Sony (2010) | https://fahrplan.events.ccc.de/congress/2010/Fahrplan/attachments/1780_27c3_console_hacking_2010.pdf ; https://media.ccc.de/v/27c3-4087-en-console_hacking_2010 ; https://xkcd.com/221/info.0.json ; https://bitcoin.org/en/alert/2013-08-11-android ; https://android-developers.googleblog.com/2013/08/some-securerandom-thoughts.html |
| `pages/crypto/lecon-05.html#1` | INEXACT : 17,9 / 25,7 / 66,1 % attribués à « un seul premier de 1024 bits » (c'est le groupe le plus courant **de chaque protocole**) ; 14,8 % « sur l'ensemble de l'espace d'adressage » (échantillon de 1 %, serveurs SMTP) ; « le partage de paramètres ne présente pas cette faiblesse » (l'article : tirent *moins* parti du précalcul) ; événement | **Gardé, corrigé** | Cas réel — Logjam, Diffie-Hellman tel qu'il est déployé (2015) | https://weakdh.org/imperfect-forward-secrecy-ccs15.pdf ; https://weakdh.org/ |
| `pages/crypto/lecon-06.html#1` | INEXACT (mineur) ; « présente dans les magasins de la plupart des navigateurs » (rapport : *plusieurs*) ; « plusieurs autorités retirées depuis » non sourcé ; CT non sourcée ; événement | **Gardé, corrigé** : 531 non exhaustif, domaines visés, 28 août, 298 140 IP dont 95 % en Iran (approximation grossière), 3 et 20 septembre ; RFC 6962 et règle de Chrome sourcées | Cas réel — DigiNotar, l'autorité de certification compromise (2011) | https://zoek.officielebekendmakingen.nl/blg-191225.pdf ; https://www.rfc-editor.org/rfc/rfc6962 ; https://groups.google.com/a/chromium.org/g/ct-policy/c/wHILiYf31DE |
| `pages/crypto/lecon-07.html#1` | Sujet réel mais **foyer ailleurs** (LinkedIn → `securite/lecon-05`) ; événement | **Remplacé** — notion : hachage rapide contre fonction lente | Cas réel — Yahoo, un fichier en MD5, l'autre en bcrypt (2013-2014) | https://www.sec.gov/Archives/edgar/data/1011006/000119312517065791/d293630d10k.htm ; https://help.yahoo.com/kb/SLN28451.html ; https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd (API GitHub) |
| `pages/crypto/lecon-08.html#1` | Sujet réel mais **foyer ailleurs** (Adobe → `securite`) ; événement | **Remplacé** — notion : chiffrement déterministe pour chercher, analyse de fréquence | Cas réel — des dossiers médicaux chiffrés lus par simple comptage (2015) | https://www.microsoft.com/en-us/research/wp-content/uploads/2017/02/edb.pdf |
| `pages/crypto/lecon-09.html#1` | Sujet réel mais **foyer ailleurs** (clé d'Uber 2016 → `iac/lecon-10`) ; événement | **Remplacé** — notion : durée de vie, « une clé, un usage », ce qu'on ne sait pas après une fuite | Cas réel — Storm-0558 et la clé de signature de 2016 (2023) | https://www.cisa.gov/sites/default/files/2025-03/CSRBReviewOfTheSummer2023MEOIntrusion508.pdf ; https://www.microsoft.com/en-us/msrc/blog/2023/09/results-of-major-technical-investigations-for-storm-0558-key-acquisition (avec la mise à jour du 12 mars 2024) |
| `pages/crypto/lecon-10.html#1` | INEXACT : la réponse « voilà ton premier indice, compile avec -DPURIFY » **n'existe pas** — les deux réponses (1ᵉʳ mai : « Not much. If it helps with debugging, I'm in favor of removing them » ; 2 mai : -DPURIFY fait taire Valgrind, « only a single line ») approuvaient la suppression ; « 294 912 clés RSA par taille » et « un administrateur en 2007 » introuvables ; « vingt mois » arrondi (19 mois et 26 jours) ; événement | **Gardé, corrigé** ; 98 301 flux (wiki Debian), remarque de Russ Cox sur le PID | Cas réel — Debian et le générateur d'aléa d'OpenSSL (2006-2008) | https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=363516 ; https://lists.debian.org/debian-security-announce/2008/msg00152.html ; https://wiki.debian.org/SSLkeys ; https://research.swtch.com/openssl |
| `pages/crypto/lecon-11.html#1` | VRAI (B2), revérifié ; deux détails INEXACTS : « déjà sous les 310 000 *alors* recommandés » (310 000 est la recommandation citée en décembre 2022, pas en 2018) ; « comptes jamais migrés » (Palant : migration *inachevée*) ; « critique publique depuis 2015 » et « liens de réinitialisation » sans source primaire ; le détail « 12 août, enregistreur de frappe » ne figure que dans un document LastPass illisible en ligne | **Gardé, corrigé** ; récit de l'intrusion ramené aux billets de LastPass (25 août, 22 décembre 2022, 1ᵉʳ mars 2023) | Cas réel — LastPass, des coffres volés et leurs itérations (2022) | https://blog.lastpass.com/posts/2022/12/notice-of-recent-security-incident ; https://blog.lastpass.com/posts/2023/03/security-incident-update-recommended-actions ; https://palant.info/2022/12/24/what-data-does-lastpass-encrypt/ ; https://palant.info/2022/12/28/lastpass-breach-the-significance-of-these-password-iterations/ ; https://palant.info/2022/12/23/lastpass-has-been-breached-what-now/ |

## Décomptes

| | solidity | crypto | total |
|---|---:|---:|---:|
| « Cas réel » | 17 | 11 | 28 |
| conformes à la règle avant → après | 0 → 17 | 0 → 11 | 0 → 28 |
| remplacés | 10 | 3 | 13 |
| gardés, corrigés à la source | 7 | 8 | 15 |
| gardés tels quels | 0 | 0 | 0 |
| renommés « Scénario » | 0 | 0 | 0 |

État trouvé (mon jugement, avant correction ; une seule catégorie par cas) :

| État trouvé | solidity | crypto | total |
|---|---|---|---:|
| VRAI, mais doublon du cours ou foyer dans un autre cours (remplacé sans autre faute relevée) | 01, 03, 11, 17 | 07, 08, 09 (non revérifiés en détail : remplacés pour le foyer) | 7 |
| INEXACT (au moins un détail faux ou sans source primaire, voir le tableau) | 02, 06, 07, 08, 09, 10, 12 | 01, 02, 03, 04, 05, 06, 10, 11 | 15 |
| INVÉRIFIABLE (récit général ou anonyme) | 04, 05, 13, 14 | — | 4 |
| VRAI, seulement sans source ni date | 15, 16 | — | 2 |
| INVENTÉ | — | — | 0 |

Nature : 24 événements, 4 généraux (solidity 04, 05, 13, 14). Les INEXACT de `crypto` 03, 06 et 11 sont mineurs
(un dénombrement, un « la plupart », une date d'une recommandation) ; le plus lourd est `crypto/lecon-10` (une
citation qui n'existe pas, deux chiffres introuvables).

## Contrôles (avant le dernier commit)

| Contrôle | Code |
|---|---|
| `node tools/verif-contenu.js --cas-reel --cours=solidity` | **0** (17 conformes sur 17) |
| `node tools/verif-contenu.js --cas-reel --cours=crypto` | **0** (11 conformes sur 11) |
| `node tools/verif-contenu.js --strict` | **0** |
| `node tools/verif-html.js` | **0** |
| `node tools/verif-domaines-interdits.js` | **0** |
| `node tools/verif-qcm-lexique.js` | **0** |
| `node tools/verif-qcm-biais.js` | **0** |
| `node tools/cas-reels/lots/lexique-diff.js D:\test-claude-b12-solidity-crypto 8c65449` | **0 écart** sur 28 pages |
| `node scratchpad/b12-solidity-crypto/typo.js` (espaces, guillemets, CR) | OK, 0 CR |
| `node tools/verif.js --rapide` | **1**, 284,3 s, 54 étapes sur 83 : 3 étapes signalées, toutes tolérées — `donnees` (invariant I18 seul : `search-index.js` périmé, + 4 024 octets, à régénérer par l'orchestrateur), `doc-ref` (1 contrôle sur 41) et `doc-rec` (« 1 439 citent la source » introuvable : le nombre de leçons qui citent la source de leur « Cas réel » a bougé avec ce lot) ; les 51 autres étapes OK, dont `qcmbiai`, `qcmlexi`, `contenu`, `exemple`, `maths` |

## Ce qui reste ouvert

- **Sources qui ne sont pas des post-mortems d'organisation** (dites ici pour la contre-relecture) :
  `solidity/lecon-07` cite un post-mortem publié sur Medium au nom de l'équipe de Rari Capital mais signé
  « Jack » (identité non confirmée ; le correctif cité est bien dans le dépôt de Rari-Capital) ;
  `solidity/lecon-12` complète le billet de Beanstalk par l'analyse d'Immunefi (plateforme de primes aux
  bogues) pour le mécanisme `emergencyCommit` ; `solidity/lecon-04` et `-05` reposent sur l'article
  universitaire d'Atzei et al. (POST 2017), le code public des contrats et, pour Rubixi, un fil bitcointalk ;
  `solidity/lecon-15` sur le récit de ConsenSys (Infura y témoigne) ; `crypto/lecon-10` cite les messages
  d'openssl-dev **à travers** l'article de Russ Cox (les archives de la liste n'ont pas été ouvertes).
- `solidity/lecon-04` : la date du blocage du jackpot de GovernMental n'est pas donnée par l'article ; le titre
  porte 2016, l'année du jeu (dépôt GitHub du 10 mars 2016) et de la prépublication de l'article.
- `crypto/lecon-04` : le passage « Sony réutilisait ce nombre » repose sur les diapositives (la règle, puis le
  dessin xkcd sous le titre « Sony's ECDSA code ») ; aucune phrase écrite ne le dit en toutes lettres.
- `crypto/lecon-11` : le détail de l'intrusion (12 août, logiciel multimédia sur l'ordinateur personnel,
  enregistreur de frappe) figure dans un document de LastPass que l'outil web n'a pas pu lire ; il a été
  retiré plutôt que cité de seconde main.
- `solidity/lecon-08` remplace CryptoKitties ; `solidity/lecon-15` le garde. Le foyer du **gel Parity** reste
  `solidity/lecon-16` (registre) ; la **The DAO** a désormais son foyer en `solidity/lecon-06`.
- Sujets à inscrire au registre `foyers.md` par l'orchestrateur : Constantinople reporté (2019),
  BeautyChain/batchOverflow (2018), Solidity 0.5.0 et la visibilité (2018), GovernMental (2016), Rubixi (2016),
  The DAO (2016, `solidity/lecon-06`), Fuse/Rari (2022), la Fusion et les testnets (2022), jetons ERC-20 sans
  valeur de retour (2018), Chainalysis 2022, Audius (2022), Beanstalk (2022), ERC721A (2022), EIP-20 et approve
  (2015-2016), CryptoKitties (2017, `solidity/lecon-15`), SHAttered (2017), WEP (2001), ROBOT (2017),
  PS3 Epic Fail (2010), Logjam (2015), DigiNotar (2011), Yahoo 2013/2014, Naveed-Kamara-Wright (2015),
  Storm-0558 (2023), Debian OpenSSL (2008), LastPass (2022).
- Index dérivés (`js/search-index.js`, `pages/etude-recherche.html`…) non régénérés, comme demandé : ils
  portent encore les anciens intertitres « Cas réel » des leçons solidity 13 à 17 et crypto 01 à 11.
