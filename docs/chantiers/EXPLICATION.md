# docs/chantiers/ — les plans de travail de l'autonomie

Chaque chantier est un plan en cases à cocher (`- [ ]` / `- [x]`). L'autonomie
(`.autonomie/autonomie.ps1`) prend le **premier plan de sa liste `$CHAINE` qui a encore une case
vide**, traite la première case non cochée, la coche avec un **compte rendu chiffré écrit dans le
plan**, et commite. Le plan est donc aussi le **journal détaillé** de ce qui a été fait.

**Chaque plan commence par son cadrage** : pourquoi il existe, les mesures de départ, les règles
propres au chantier. À lire avant d'y toucher.

| Plan | Sujet | État |
|---|---|---|
| CHANTIER-V4 | Suites de l'audit du 27/07 + contenu | ✅ 31/31 |
| CHANTIER-V5 | Accès rapide au contenu (recherche, palette clavier, antisèches) | ✅ 8/8 |
| CHANTIER-V6 | Questions de QCM en double | ✅ 38/38 |
| CHANTIER-V7 | Les défauts mineurs de l'audit | ✅ 20/20 |
| CHANTIER-V8 | Remonter le contenu à la médiane du site | ✅ 26/26 |
| CHANTIER-V9 | Le parcours de l'apprenant | ✅ 10/10 |
| CHANTIER-V10 | Élargir le catalogue | ✅ 11/11 |
| CHANTIER-V11 | Corriger les 73 points de l'audit V10 | ✅ 19/19 |
| CHANTIER-V12 | Les 42 points de l'inventaire du 20/08 | ✅ 31/31 |
| CHANTIER-V13 | Le contenu qui manque | ✅ 32/32 |
| CHANTIER-V14 | Faire écrire du code, et le corriger | ✅ 38/38 |
| CHANTIER-V15 | Comprendre ce qu'on ne voit pas | ✅ 32/32 |
| CHANTIER-V17 | Les garde-fous qui mentent | ✅ 80/80 |
| **CHANTIER-V16** | **Consolider ce que les quatre chantiers ont laissé derrière** | 🟠 **8/22 — plan courant** |

*(État au 2026-09-29 ; le chiffre à jour est dans `en-cours/ETAT-AUTONOMIE.md`.)*

**Pourquoi V17 passe avant V16 dans la chaîne** : le V16 réécrivait les QCM cours par cours, mais
l'index lu par la page d'examen n'était pas régénéré et le garde-fou censé le voir était vert. Le
V17 a réparé les instruments, puis la chaîne est revenue au V16.

**Le V16 fait plus de 8 000 lignes** : l'essentiel est le point **B4** (réécrire les mauvaises
réponses des QCM, cours par cours), avec un compte rendu par cours. Pour s'y retrouver, chercher
« ÉTAT DU » ou « COURS — » dans le fichier, ou lire `en-cours/EN-COURS.md` qui le résume.

**Ajouter un chantier** : créer `CHANTIER-Vxx.md` ici, puis ajouter `'docs\chantiers\CHANTIER-Vxx.md'`
à la liste `$CHAINE` de `.autonomie/autonomie.ps1` (les entrées portent leur chemin relatif).
