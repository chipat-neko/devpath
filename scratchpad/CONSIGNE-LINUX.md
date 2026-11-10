# Consigne d'écriture — les QCM du cours `linux` (B4, passe parallèle du 2026-11-10)

Écrite et appliquée par un seul agent, dans la copie de travail `D:\test-claude-b4\linux`
(branche `b4/linux`). Elle reprend `CONSIGNE-BASH.md` et `CONSIGNE-TESTS.md` (les deux cours les
plus proches) et les adapte au cours « Linux & administration système » : 11 leçons,
**55 questions dont 12 de bilan** (`lecon-11`). Mesures de départ archivées dans
`scratchpad/linux-depart/` (hors git) ; sondes dans `scratchpad/linux-sonde/` (dont
`etat.js`, qui simule les patchs EN MÉMOIRE sur le cours entier avant toute pose, et `dose.js`).

## ⚠️ La règle qui prime

> **UN DISTRACTEUR EST UNE PHRASE FRANÇAISE QUI ÉNONCE UNE THÈSE FAUSSE, PRÉCISE ET PLAUSIBLE.**

Piège propre à ce cours : **l'administration système est pleine de pratiques défendables**.
« Fermer SSH à Internet » se défend (VPN, bastion) ; « la configuration dans `/usr/lib` »
est vraie pour les unités systemd fournies par les paquets ; « les journaux dans `/run` » est
vrai pour un journal volatil ; « cron a pu tuer le processus » est une hypothèse légitime.
Ces quatre-là ont été écrits puis retirés à la relecture. Tiens-toi à des erreurs de FAIT ou
de DÉFINITION (ce que fait la commande, ce que désigne le mot), fausses contre la page.

## Ce qui s'exécute ici, et ce qui ne s'exécute pas

Git Bash (bash 5.3.9, MINGW64) : `ls`, `cp`, `tar` (GNU 1.35), `find`, `kill`, `df`, `du`,
`mount` (MSYS), `ssh`, `scp`, `ssh-keygen`. **Absents** : `free`, `lsblk`, `systemctl`,
`journalctl`, `crontab`, `ss`, `ip`, `ufw`, `rsync`, `dmesg`, `uptime`, `top`, `watch` ; WSL ne
fonctionne pas. Pour ceux-là : la page de manuel (man7.org, manpages.debian.org) ou le code
source, et « non exécuté » écrit en clair. **Ne présente jamais le comportement de Git Bash
comme celui de Linux sans le dire** (les permissions, notamment, n'y sont pas POSIX).

Table exécutée à la préparation (`scratchpad/linux-depart/classiques.sh` et `.out`) :

| croyance | ce que Git Bash rend |
|---|---|
| `ls -h` ou `ls -l` montrent les fichiers cachés | non ; `ls -a` les montre (`. .. .env .gitignore index.html`) |
| `cp -r projet/* dest/` copie aussi `.env` | non (l'étoile ne développe pas les noms en point) ; `cp -r projet/ dest/` oui |
| `kill` et `kill -9` se valent | un piège `TERM` s'exécute sous `kill` (« nettoyage », code 0) ; jamais sous `kill -9` (code 137) ; un `sleep` tué rend 143 / 137 |
| `tar` d'un chemin absent laisse une archive de quelques Ko | **45 octets**, code **2**, « Cannot stat: No such file or directory » |
| `find -mtime +14` garde 14 jours | il retient les fichiers de **15 jours entiers et plus** |
| `ps … \| head` montre 10 processus | l'en-tête + 9 |

Établi par la source (non exécuté) : `systemctl disable` n'arrête pas l'unité
(systemctl(1)) ; `mount -a` ignore ce qui est déjà monté (mount(8)) ; la charge compte les
tâches R **et D** (proc_loadavg(5)) ; cron place la tâche dans le HOME du compte (cronie,
`src/security.c`, `chdir(homedir)`).

## Mesures de départ (2026-11-10, `node tools/mesure-biais-qcm.js --seul=linux`)

la plus longue **94,5 %** · la plus détaillée 78,0 % · le mot technique exclusif 77,1 % ·
ponctuation forte 60,0 % · incise 59,1 % · deux-points 50,5 % · la plus dense 41,8 % ·
point-virgule 41,4 % · **45 questions sur 55 trahies par 5 indices ou plus** · rangs 52/1/0/2 ·
8 595 caractères à écrire sur 52 questions · 4 alertes de biais inverse · 3 mots fétiches
(`parce` 0/23, `service` 9/7, `fichiers` 6/7) · 13 tics de lot (deux-points médian 19/1,
point-virgule médian 13/3, glose finale 11/0, « parce que » 0/19, « moindre privilège » 4/0…) ·
lexique 44 exploitables, 46 à mettre en forme · intrus lexical DÉFAUT 31,4 % (7 questions sûres).

## Comment chaque question a été tenue

Pour chaque question, `node scratchpad/linux-sonde/etat.js lecon-NN.html qN` affiche, option
par option : longueur et rang, mots, densité, `w`, `k` et mots étrangers, `, : ;`, incises,
mots de 9+ lettres exclusifs, écho ; puis les stratégies qui tranchent et l'intrus lexical.

1. **Rang et bande** de `plan-rangs-qcm` ; aucune égalité de longueur.
2. **Même gabarit que la bonne réponse** : mêmes marques (`;`, `:`, `—`, `→`, `/`,
   parenthèse au même endroit, glose finale si elle finit en glose), même nombre de `, : ;`.
3. **`k` égal** ; si `k > 0`, **`w` égal** (compté en occurrences ; l'apostrophe colle :
   `l'arrête`, `qu'aux`, `d'administration` sont des jetons). C'est la contrainte la plus
   lourde de ce cours : le bilan de `lecon-11` exige jusqu'à `k = 6, w = 6`. Méthode : tester
   les mots candidats avec `node scratchpad/linux-sonde/voc.js lecon-NN.html --teste mot…`
   AVANT d'écrire la phrase.
4. **Mêmes porteurs de négation, d'absolu et de mot prudent** (`peut`) que la bonne réponse.
5. **Attaque** : jamais trois options sur le même mot quand la quatrième diffère.
6. **Écho** : même nombre de mots de l'énoncé (« service », « root », « machine »…).
7. **Intrus lexical** : aucun mot de 5+ lettres porté par 3 options ; chaque option garde au
   moins un mot à elle.
8. **Dosage calculé ensuite** (`dose.js dense|excl|bavard`) : basculer les écarts les plus
   petits, pas toutes les questions.

## Ce que la vague a fabriqué, et comment ça s'est fermé

- **« machine » et « système » sont devenus des mots de distracteur** (2 bonnes / 27 et
  0 / 17, ÉCARTER 28,9 % et 28,0 %) : ce sont les mots « connus de la page » les plus commodes
  pour tenir `k = 0`. Remplacés par d'autres mots déjà présents (« serveur », « logiciel »,
  « script ») dans 12 options.
- **« moindre privilège »** restait le privilège de 4 bonnes réponses : posé dans un
  distracteur de deux questions, dont une **définition fausse** (« n'accorder que les droits
  root aux équipes »).
- **La plus dense** est montée à 47,3 % (les bonnes réponses portent les mots techniques
  longs) : une dizaine de bascules calculées la ramènent à 27,3 %.

## Relecture et contre-relecture

Relire CHAQUE option comme un apprenant et comme un expert ; relire le corps, les schémas
(texte ET `aria-label`), les exercices (`scratchpad/linux-outils/exos-tous.js`,
`fuites-larges.js`, `fuites-enonces.js`). Après toute correction de corps :
`node scratchpad/linux-sonde/controle.js --ref=HEAD` — un mot qui entre dans la page ou en sort
change le `k` d'une option (trois rattrapages ici : « grande », « bloque », « session »).
Puis relire ses propres corrections : deux sur 34 étaient fautives (un absolu déplacé, une
borne trop forte).
