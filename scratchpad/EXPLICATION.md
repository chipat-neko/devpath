# scratchpad/ — le brouillon des agents

Les scripts jetables, sondes et fichiers intermédiaires écrits pendant les passes de l'autonomie
(plusieurs gigaoctets). **Ce dossier est ignoré par git**, sauf les fichiers suivants, qui sont du
**savoir** et non du brouillon :

| Versionné | Ce que c'est |
|---|---|
| `CONSIGNE-<cours>.md` | La consigne d'écriture donnée aux agents pour réécrire les QCM d'un cours (point B4 du chantier V16). Chaque nouvelle consigne se construit à partir des précédentes : elles portent les règles payées cours après cours. |
| `REGLE-*.md` | Les règles générales du chantier B4 (par exemple l'intrus lexical). |
| `EXPLICATION.md` | Ce fichier. |

Quelques dossiers de travail du cours en cours (`vue-sonde/`, `vue-ecriture-*/`, `vue-relecture/`)
contiennent les outils et les rapports que la prochaine passe réutilise : ils existent sur le disque
même s'ils ne sont pas tous versionnés. Le plan (`docs/chantiers/CHANTIER-V16.md`) cite ceux qui
comptent.

⚠️ Un lot d'écriture laissé ici sans commit **ne survit à rien** (une coupure de session, un
`git checkout`) : les réécritures appliquées aux leçons se commitent tout de suite.

Règle de fonctionnement : chaque agent écrit dans **son propre** sous-dossier ; deux agents qui
partagent un dossier temporaire s'écrasent mutuellement.
