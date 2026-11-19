# Consigne d'écriture — les QCM du cours `reseaux` (V18, case C3)

Préparée le 2026-11-19 dans la copie de travail `D:\test-claude-c3-reseaux` (branche
`v18/c3-reseaux`, partie de `8d163bf`). Un seul agent fait tous les rôles (mesure, preuve,
écriture, dosage, relecture, contre-relecture), sans relecteur indépendant : l'orchestrateur en
lancera un après coup (`tools/qcm-lots/consigne-contre-relecture.md`).

Mesures de départ archivées dans `scratchpad/c3-reseaux/depart/` (hors git) ; sondes dans
`scratchpad/c3-reseaux/sonde/` : `controle.js`, `pose.js`, `simule.js`, `essai2.js` (copiés de
`vue-sonde`, repointés sur `pages/reseaux/`, `controle.js` à vide : 0 indicateur déplacé), plus
trois sondes neuves : `aplat.js` (les QCM à plat), `texte.js` (le corps d'une leçon en texte) et
**`atelier.js`** (un lot de patchs appliqué EN MÉMOIRE ; pour chaque question, tout ce qui désigne
une option : rang visé et bande 70-130 %, les 44 stratégies CHARGÉES depuis
`tools/mesure-biais-qcm.js`, `k`/`w`/conforme copiés de `mesure-lexique-qcm.js`, l'intrus DÉFAUT /
EXCÈS copié de `mesure-mot-question.js`, les formes de `mesure-tics-lot.js`). Rangs visés figés dans
`sonde/cibles.json` (ceux de `plan-rangs-qcm`, plus `lecon-06` q2 au rang 0 et `lecon-11` q7 au
rang 1, les deux questions que l'outil ne planifie pas) : **13 / 13 / 13 / 13**.

Le cours : « Réseaux », 11 leçons, **52 questions** (8 de bilan dans `lecon-11`) — modèle en
couches et encapsulation (`01`), IP, masque, passerelle, routage (`02`), TCP / UDP / ports (`03`),
DNS (`04`), HTTP / TLS / HTTP/3 (`05`), trajet d'une requête et diagnostic (`06`), CIDR (`07`),
MAC / ARP / DHCP (`08`), Wi-Fi (`09`), NAT et pare-feu (`10`), VPN et bilan (`11`).

## 1. Mesures de départ (sur `8d163bf`, avant toute écriture)

`node tools/mesure-biais-qcm.js --seul=reseaux` :

| indice | réussite | couverture | rendement |
|---|---:|---:|---:|
| **la plus longue** | **92,9 %** | 98,1 % | 94,1 % |
| la plus détaillée | 77,6 % | 69,2 % | **100,0 %** |
| la seule avec une PONCTUATION FORTE / RESTREINDRE | 61,1 / 61,5 % | 48,1 % | **100,0 %** |
| le mot technique exclusif | 61,4 % | 53,8 % | 78,6 % |
| RESTREINDRE aux deux-points | 51,4 % | 34,6 % | **100,0 %** |
| l'incise entre parenthèses | 45,2 % | 26,9 % | **100,0 %** |
| RESTREINDRE à la parenthèse | 44,2 % | 25,0 % | **100,0 %** |
| l'écho de la question | 38,5 % | 26,9 % | 71,4 % |
| ECARTER la moins bavarde | 38,5 % | 3,8 % | 50,0 % |
| la seule avec un point-virgule | 36,5 % | 15,4 % | **100,0 %** |
| ECARTER la plus courte | 34,3 % | — | — |
| la MAJUSCULE d'emphase | 33,2 % | 13,5 % | 85,7 % |
| la seule qui nie | 32,7 % | 25,0 % | 46,2 % |
| la plus prudente | 30,8 % | 7,7 % | **100,0 %** |

**36 questions sur 52 (69,2 %)** trahies par 5 indices ou plus. Rangs **49 / 3 / 0 / 0**, cible
**13 / 13 / 13 / 13** ; `plan-rangs-qcm reseaux` demande **7 855 caractères** sur 50 questions.
Biais inverse (`mesure-biais-inverse --toutes reseaux`) : **4 alertes** (rangs 2, 3 et 4, « la
moins bavarde » : 0,0 % en directe). Lexique (`mesure-lexique-qcm --liste=reseaux`) : **45
exploitables, 22 retournées, 48 à mettre en forme** ; **32 bonnes réponses sur 52 portent au moins
un mot de 6+ lettres absent de leur page** (la règle du `w` s'applique à elles). Intrus lexical
(`mesure-mot-question reseaux --liste`) : DÉFAUT 28,8 %, **5 questions sûres**. Point interne : 0.

### Les dix tics de lot (`node tools/mesure-tics-lot.js reseaux --exemples`)

| tic | bonnes / distr. | tranchées | rendement | gain au cours |
|---|---|---:|---:|---:|
| **deux-points médian** | **19 / 1** | 18 | **100,0 %** | **51,0 %** |
| **point-virgule médian** | **8 / 0** | 8 | **100,0 %** | **36,5 %** |
| glose finale entre parenthèses | 4 / 0 | 4 | 100,0 % | 30,8 % |
| restrictif « ne … que » | 4 / 0 | 4 | 100,0 % | 30,8 % |
| quatre segments à virgules | 5 / 2 | 5 | 80,0 % | 30,3 % |
| « à une » | 4 / 1 | 5 | 80,0 % | 30,3 % |
| « parce que » | 1 / **15** | 4 | 75,0 % | 28,8 % |
| « une adresse » | 4 / 2 | 4 | 75,0 % | 28,8 % |
| verbe conjugué en fin d'option | 16 / 35 | 21 | 33,3 % | 28,4 % |
| « la connexion » | 4 / 5 | 9 | 44,4 % | 28,4 % |

Le gabarit des bonnes réponses est « réponse : explication » (19 fois) ou « réponse ; conséquence »
(8 fois) : **les trois distracteurs prennent le MÊME gabarit**, avec un contenu qui énonce une
erreur — jamais une queue de phrase de remplissage.

### Les mots fétiches (`node tools/mesure-mot-fetiche.js reseaux`) : 6 alertes

`adresse` (12 bonnes / 12 distr., RESTREINDRE 35,3 %), `machine` (7 / 6), `serveur` (6 / 5),
`connexion` (6 / 6), `réseau` (7 / 10), `chaque` (4 / 4) : ce sont des mots de BONNE réponse —
**les poser dans les distracteurs des questions où la bonne réponse les porte** (deux ou trois
distracteurs, jamais un seul : l'intrus lexical). `parce` (2 / **19**) est un mot de DISTRACTEUR :
ne commencer un distracteur par « Parce que » que là où la bonne réponse commence ainsi
(`lecon-11` q6 et q11).

## 2. Ce qui a été prouvé AVANT d'écrire

Exécuté sous Python 3.14.5 (`ipaddress`) et Node 26.13.1 (`net`, `dns`), dans
`scratchpad/c3-reseaux/preuves/` (`adresses.py`, `tcp.js`, `dns.js`, `wifi.py` et leurs `.out`).

| affirmation | ce que l'exécution rend |
|---|---|
| plages privées 10/8, 172.16/12, 192.168/16 ; 8.8.8.8 publique (`02`) | `is_private` vrai pour les trois, faux pour 8.8.8.8 et 172.32.0.1 ; 172.16.0.0/12 va de 172.16.0.0 à 172.31.255.255 |
| `/24` = 255.255.255.0, `/16` = 255.255.0.0 (`02`) | vrai, vrai |
| `/26` : 6 bits machine, 64 adresses, 62 utilisables (`07` q1) | réseau 192.168.1.0/26, masque 255.255.255.192, 64 et 62 |
| `/24` : 254 machines (`07` q2, `11` q9) | 256 adresses, 254 `hosts()`, réseau .0, diffusion .255 ; 2^(32-24) − 2 = 254 |
| le 2ᵉ des quatre `/26` de 192.168.1.0/24 (`07` q3) | `.0/26, .64/26, .128/26, .192/26` ; `192.168.1.4/26` et `.25/26` ne sont PAS des réseaux (« has host bits set ») |
| `0.0.0.0/0` couvre tout (`07` q4) | 4 294 967 296 adresses, 8.8.8.8 et 192.168.1.10 dedans |
| 169.254.14.7 : adresse de secours (`08` q4) | `is_link_local` vrai (RFC 3927) |
| « connexion refusée » = machine atteinte, rien n'écoute ; filtrage = délai (`10` q4) | port fermé : `ECONNREFUSED` en 3 ms ; service : connexion en 1 ms ; 192.0.2.1 (RFC 5737) : aucune réponse en 5 000 ms |
| A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, NS (`04` q4) | `example.com` A → deux IPv4, AAAA → deux IPv6 ; `www.github.com` CNAME → `github.com` ; `gmail.com` MX → 5 serveurs ; `com` NS → 13 serveurs `gtld-servers.net` |
| canaux 1, 6, 11 sans chevauchement en 2,4 GHz (`09` q2) | à 22 MHz de large, 1-6-11 est le SEUL triplet dans 1..11, mais 2-7-12 et 3-8-13 existent dans 1..13 (Europe) ; à 20 MHz, 1-5-9-13 |
| −75 dBm, −50 dBm (`09` q3) | 3,16·10⁻⁸ mW et 10⁻⁵ mW : 316 fois moins de puissance |

Le reste se juge par la norme : TCP et sa poignée de main en trois segments (RFC 9293 §3.5),
UDP sans connexion ni renvoi (RFC 768), DNS (RFC 1034 / 1035), HTTP/3 sur QUIC sur UDP
(RFC 9114 §1, RFC 9000), TLS intégré à QUIC (RFC 9001), connexions HTTP/1.1 persistantes par
défaut (RFC 9112 §9.3), NAT (RFC 3022), ARP (RFC 826), DHCP et ses options masque / routeur / DNS
(RFC 2131, RFC 2132 §3.3, §3.5, §3.8).

## 3. ⚠️ LE PIÈGE PROPRE À CE COURS : LA SIMPLIFICATION DU COURS CONTRE LA NORME

Le cours simplifie (c'est son rôle) : un distracteur doit être faux **contre le cours ET contre la
norme**, sinon il est discutable. À NE PAS écrire :
- « une IP privée n'est pas unique » (vrai, la leçon 2 le dit), « une IP privée n'est pas une
  protection » (vrai) ;
- « UDP peut porter du chiffré » (vrai : QUIC) ; « le DNS passe aussi par TCP » (vrai pour les
  grandes réponses) ; « HTTP/3 n'utilise pas TCP » (vrai) ;
- « un pare-feu peut provoquer un refus de connexion » (vrai s'il REJETTE ; il donne un délai s'il
  JETTE) ;
- « la MAC est fixée en usine » (vrai à l'origine, mais une MAC se change et se randomise) ;
- « TCP est plus lent » (le cours dit « un peu plus lent ») ;
- « le résolveur garde la réponse en cache » (vrai).

Erreurs nettes, prouvées ou normées, utilisables : confondre couche lien / Internet / transport /
application ; TCP et UDP (connexion, ordre, renvoi) ; IP et MAC ; ARP, DHCP et DNS ; public et
privé ; masque et passerelle ; nombre de bits du préfixe et nombre de machines ; adresse de réseau
et de diffusion ; TTL DNS et TTL IP ; A, AAAA, CNAME, MX ; résolveur et serveur faisant autorité ;
chiffrement et honnêteté du site (le cadenas) ; HTTP/2 et HTTP/3 ; NAT et pare-feu ; refus
immédiat et délai dépassé ; tunnel complet et partagé ; VPN et anonymat ; débit radio et débit
réel ; dBm négatif (plus proche de zéro = meilleur).

## 4. Ce que chaque question doit tenir (vérifié par `node scratchpad/c3-reseaux/sonde/atelier.js`)

1. **Rang** de la bonne réponse = `cibles.json`, sans ex æquo avec elle ; distracteurs dans 70-130 %
   de sa longueur ; le **rang en mots** suit à peu près celui en caractères ; la bonne réponse n'est
   ni toujours la plus dense, ni toujours la moins bavarde (dosé au niveau du cours).
2. **Marques — les quatre ou aucune** : `;`, `:`, parenthèse (même NOMBRE d'incises de 4+ signes),
   tiret (`—`, `–`, ` - `, « c'est-à-dire »), barre oblique (⚠️ `TCP/IP`, `HTTP/3`, `/24`,
   `IPv4 / IPv6` en portent une), guillemets « », flèche (`→`, `->`), point interne (un point suivi
   d'une espace et d'une majuscule : « ex. 192… » n'en est pas un, « ex. Le… » en est un), virgule
   décimale (`2,4 GHz` en porte une !). **Même nombre de `, : ;`** dans les quatre.
3. **Absolus, négations, prudents** (`toujours`, `jamais`, `uniquement`, `seulement`, `aucun`, `rien` ;
   `ne`, `pas`, `non`, `n'`, `ni` ; `peut`, `permet`, `souvent`, `selon`, `notamment`,
   `généralement`) : quatre porteurs ou aucun.
4. **Écho** : même nombre de mots de l'énoncé (4+ lettres) dans les quatre. **Attaque** : jamais
   trois options qui commencent par le même mot et une quatrième autrement (`Parce que` et
   `Parce qu'` sont DEUX attaques).
5. **MAJUSCULE d'emphase** : même nombre partout. Mesuré par `sonde/majuscules.js` (qui passe
   par la stratégie elle-même) : COMPTENT comme emphase `MAC`, `DHCP`, `QUIC`, `TLD`, `SYN`, `ACK`,
   `SYN-ACK`, `CNAME`, `MX`, `TXT`, `NS`, `RSSI`, `WPA3`, `SSID`, `LAN`, `FAI`, `BGP`, `OSI`, `PC`,
   `ADSL`, `DNSSEC`, `IETF` ; sont des sigles neutres `ARP`, `NAT`, `VPN`, `AAAA`, `ICMP`, `CIDR`,
   `TTL`, `SMTP`, `TCP`, `UDP`, `IP`, `DNS`, `TLS`, `HTTP(S)`, `SSH`, `URL`, `RFC`, et `IPv4`,
   `Wi-Fi`, `GHz`, `dBm`, `DoH` (casse mêlée). Une bonne réponse qui dit « DHCP » ou « MAC » impose
   une capitale d'emphase à chaque distracteur.
6. **Mots de 9+ lettres** : chaque option en porte le même nombre d'exclusifs (souvent zéro) — le
   plus simple est de reprendre ceux de la bonne réponse dans les distracteurs.
7. **Lexique** : `k` (mots de 6+ lettres absents de la page, en occurrences) égal dans les quatre ;
   si `k > 0`, `w` (mots de 6+ lettres) égal aussi. L'apostrophe colle (`l'adresse` est un jeton de
   9 signes).
8. **Intrus lexical** (mots de 5+ lettres) : chaque option a au moins un mot propre ; aucun mot porté
   par exactement trois options.
9. **Tics de forme** : 0, 2 ou 4 porteurs (`:`, `;`, glose finale, « ne … que », « car / parce que »,
   « alors / ensuite / puis », « ce / cette / ces », « est / sont / reste… », quatre segments à
   virgules, « , et »).
10. **Mots fétiches** : poser `adresse`, `machine`, `serveur`, `connexion`, `réseau`, `chaque` dans
    des distracteurs ; retirer `parce` des distracteurs.

Et par-dessus tout : **un distracteur est une phrase française qui énonce une thèse fausse, précise
et plausible** ; on doit pouvoir dire en une phrase pourquoi elle est fausse. Aucune queue de
phrase de remplissage, aucun aveu final (« … et le réseau s'effondre »), aucune thèse vraie dans
une autre version ou un cas limite. **Si une contrainte de forme oblige à écrire une phrase
bancale, c'est la contrainte qui cède.**

## 5. Ordre de travail

Lots `01-03`, `04-06`, `07-09`, `10-11` ; patchs au format de `pose.js`
(`scratchpad/c3-reseaux/lots/lNN.json`), diagnostiqués par `atelier.js <patchs> --f=…`, posés par
`pose.js --ecrire`, commit après chaque lot. Puis mesure du cours entier (`mesure-biais-qcm
--seul=reseaux`, `mesure-biais-inverse --toutes reseaux`, `mesure-lexique-qcm --liste=reseaux`,
`mesure-mot-fetiche reseaux`, `mesure-tics-lot reseaux`, `mesure-mot-question reseaux --liste`,
`mesure-biais-qcm --lots=3`), dosage calculé, relecture par contradiction (QCM ET corps),
contre-relecture des corrections, mesure finale.
