# =============================================================================
# Syntaxe - reveil autonome (lance par le Planificateur de taches Windows).
# Fait tourner Claude Code en HEADLESS sur d:\test-claude pour avancer le
# chantier d'enrichissement des lecons, meme en l'absence de l'utilisateur.
# Journalise, idempotent, verrou anti-chevauchement.
#
#   Voir l'avancement   : d:\test-claude\.autonomie\journal.log
#   Desactiver la tache : schtasks /Delete /TN "Syntaxe-Autonomie" /F
#   Forcer un reveil    : schtasks /Run    /TN "Syntaxe-Autonomie"
# =============================================================================
$ErrorActionPreference = 'Continue'
# Lire la sortie de claude.exe en UTF-8 (sinon les accents francais sont mojibake dans le journal).
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$OutputEncoding = [System.Text.Encoding]::UTF8
$proj   = 'd:\test-claude'
$dir    = Join-Path $proj '.autonomie'
$lock   = Join-Path $dir 'lock'
$log    = Join-Path $dir 'journal.log'
$claude = 'C:\Users\chipat\.local\bin\claude.exe'

if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
function Stamp { (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') }

# Lecture de l'heure de reprise annoncee par claude.exe. Les messages ont la forme
# exacte : You've hit your session limit - resets 2:30pm (Europe/Paris), ou bien
# resets 1am. On rend un DateTime local, reporte au lendemain si l'heure est passee.
function Get-HeureReset($texte) {
  if (-not $texte) { return $null }
  $m = [regex]::Match($texte, 'resets\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)', 'IgnoreCase')
  if (-not $m.Success) { return $null }
  $h = [int]$m.Groups[1].Value
  $min = 0
  if ($m.Groups[2].Success) { $min = [int]$m.Groups[2].Value }
  $ampm = $m.Groups[3].Value.ToLower()
  if ($ampm -eq 'pm' -and $h -ne 12) { $h = $h + 12 }
  if ($ampm -eq 'am' -and $h -eq 12) { $h = 0 }
  $d = (Get-Date).Date.AddHours($h).AddMinutes($min)
  if ($d -le (Get-Date)) { $d = $d.AddDays(1) }
  return $d
}

# Ecriture du journal a l'epreuve d'un verrou. Constate le 2026-08-21 : un simple
# tail -f ouvert sur journal.log par un outil exterieur EMPECHE Add-Content d'ecrire
# (Windows refuse l'acces, le fichier etant deja ouvert par un autre processus).
# L'erreur etant non terminante, la passe continue mais devient INVISIBLE : une heure
# de travail sans une ligne de journal. On reessaie donc, et en dernier recours on
# ecrit a cote plutot que de perdre la trace.
function Log($texte) {
  for ($i = 1; $i -le 5; $i++) {
    try { Add-Content -Path $log -Value $texte -Encoding utf8 -ErrorAction Stop; return }
    catch { Start-Sleep -Milliseconds 400 }
  }
  try { Add-Content -Path ($log + '.secours') -Value $texte -Encoding utf8 -ErrorAction Stop } catch {}
}

# Verrou anti-chevauchement. ANCIENNE VERSION : on sautait si le fichier lock avait
# moins de 90 minutes. Defaut constate le 2026-08-21 : une passe reelle a depasse
# 92 minutes, donc son verrou etait deja perime alors qu'elle tournait toujours --
# un reveil suivant aurait pu demarrer PAR-DESSUS, et deux claude.exe qui ecrivent
# dans le meme depot s'ecrasent mutuellement et cassent l'index git. Le mode
# ultracode rend le cas courant : un fan-out multi-agents dure longtemps.
# NOUVELLE VERSION : le verrou porte le PID du wrapper. On saute tant que CE
# processus vit vraiment, quelle que soit sa duree. Plafond de 6 h malgre tout,
# au cas ou un PID serait recycle par Windows sur un autre processus.
if (Test-Path $lock) {
  $age = (Get-Date) - (Get-Item $lock).LastWriteTime
  $vivant = $false
  try {
    $pidLock = (Get-Content $lock -Raw -ErrorAction Stop).Trim()
    if ($pidLock -match '^\d+$') {
      $proc = Get-Process -Id ([int]$pidLock) -ErrorAction SilentlyContinue
      if ($proc -and $proc.ProcessName -like 'powershell*') { $vivant = $true }
    } else {
      # Verrou de l'ancien format (fichier vide) : on retombe sur le delai.
      if ($age.TotalMinutes -lt 90) { $vivant = $true }
    }
  } catch {}
  if ($vivant -and $age.TotalHours -lt 6) {
    Log "[$(Stamp)] SKIP : un reveil precedent tourne encore (verrou, $([int]$age.TotalMinutes) min)."
    exit 0
  }
}
$env:Path = 'C:\Program Files\nodejs;' + $env:Path

# =============================================================================
# Fin de chantier + passe de securite (ajout 2026-07-27, demande de Noah).
# Le chantier est FINI quand les trois conditions sont vraies :
#   1. plus aucun cours -avance declare dans js/data.js (phase C bouclee) ;
#   2. le plan ENRICHISSEMENT-3.md n'a plus aucune case a cocher ;
#   3. toutes les vraies lecons ont un glossaire (les pages de redirection,
#      reconnaissables a leur meta refresh, sont exclues du test).
# Alors : une PASSE DE SECURITE (verification globale du site) est lancee ; si son
# verdict est VERT, la tache se DESACTIVE elle-meme au reveil suivant. Si le
# verdict est ROUGE, le modele corrige et on recommence, avec un maximum de
# 3 tentatives pour ne jamais boucler indefiniment.
# =============================================================================
$okFile  = Join-Path $dir 'verif-finale.ok'
$cptFile = Join-Path $dir 'verif-finale.echecs'
$rapport = Join-Path $proj 'VERIF-FINALE.md'

# CHAINE DE CHANTIERS (2026-08-21) : l'autonomie enchaine les plans dans l'ordre,
# sans intervention. Chaque plan est traite jusqu'a sa derniere case, puis on passe
# au suivant. Ajouter un chantier = ajouter son fichier a cette liste.
# V17 EST PLACE AVANT V16, ET CE N EST PAS UNE ERREUR. Le V16 reecrit les QCM cours
# par cours ; l audit du 2026-09-08 a montre que js/quiz-index.js, l index que lit la
# page d examen, n etait PAS regenere et que le garde-fou cense le detecter etait VERT.
# Chaque cours detordu restait donc devinable la ou l apprenant est evalue. Le V17
# repare les instruments, puis la chaine revient au V16 la ou il s etait arrete.
$CHAINE = @('CHANTIER-V12.md', 'CHANTIER-V13.md', 'CHANTIER-V14.md', 'CHANTIER-V15.md', 'CHANTIER-V17.md', 'CHANTIER-V16.md')

# Renvoie le premier plan de la chaine qui a encore une case a cocher, ou $null
# si tout est fini.
function Get-PlanCourant {
  foreach ($nom in $CHAINE) {
    $chemin = Join-Path $proj $nom
    if (-not (Test-Path $chemin)) { continue }
    if (Select-String -Path $chemin -Pattern '^- \[ \]' -Quiet) { return $nom }
  }
  return $null
}

function Test-ChantierFini {
  try { return ($null -eq (Get-PlanCourant)) } catch { return $false }
}

$modeVerif = $false
$arretDemande = $false   # VRAIE fin de chantier, confirmee par la passe de securite
# Ne PAS confondre avec $replanifFaite ci-dessous. Le 2026-08-27, le verrou de limite
# hebdomadaire posait $arretDemande = $true pour empecher une replanification immediate ;
# le bloc final l'a lu comme une fin de chantier, a journalise CHANTIER TERMINE et
# desactive la tache. L'autonomie est restee muette SIX JOURS avec 38 cases a faire.
# Une variable qui sert a deux choses finit par mentir sur l'une des deux.
$replanifFaite = $false  # un declencheur a deja ete pose (limite atteinte) : ne pas en reposer
if (Test-ChantierFini) {
  if (Test-Path $okFile) {
    Log "[$(Stamp)] ===== CHANTIER TERMINE : plus rien a faire et verification finale VERTE. Tache desactivee. ====="
    try { Disable-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop | Out-Null }
    catch { Log "[$(Stamp)] ATTENTION desactivation KO ($_) -- couper a la main." }
    exit 0
  }
  $echecs = 0
  if (Test-Path $cptFile) { $echecs = [int](Get-Content $cptFile -TotalCount 1) }
  if ($echecs -ge 3) {
    Log "[$(Stamp)] ===== ARRET : verification finale ROUGE 3 fois de suite. Intervention humaine requise (voir VERIF-FINALE.md). Tache desactivee. ====="
    try { Disable-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop | Out-Null } catch {}
    exit 0
  }
  $modeVerif = $true
}

# Horodatage du debut de la passe : sert a verifier que le rapport de la passe
# de securite a bien ete ECRIT PENDANT celle-ci, et non relu d'un chantier
# precedent (voir le controle de fraicheur plus bas).
# --- VERROU D'USAGE HEBDOMADAIRE (2026-08-26, demande de Noah) ---------------
# On lit l'utilisation REELLE de l'abonnement, celle qu'affiche /usage : l'endpoint
# https://api.anthropic.com/api/oauth/usage repond avec le jeton OAuth deja present
# sur la machine. Mesure du 2026-08-26 : seven_day.utilization = 75, remise a zero le
# 01/09 a 01:00. C'est le seul chiffre juste ; un budget calcule en jetons localement
# serait une fiction, les limites passees etant tombees a 2 M, 7 M puis 9 M de jetons
# sur sept jours alors que la semaine en cours en comptait 21 M sans limite.
#
# AU SEUIL, ON NE DESACTIVE PAS : on REPORTE le prochain reveil apres la remise a zero.
# Noah peut etre au travail au moment ou le seuil tombe ; l'autonomie doit repartir
# seule, sans intervention.
#
# Reglage : un pourcentage dans .autonomie/seuil-hebdo.txt (0 = verrou inactif).
$seuilHebdo = 99
try {
  $sf = Join-Path $dir 'seuil-hebdo.txt'
  if (Test-Path $sf) { $seuilHebdo = [int]((Get-Content $sf -Raw) -replace '[^0-9]','') }
} catch {}
if ($seuilHebdo -gt 0) {
  $pct = -1; $resetIso = ''
  try {
    $duo = (& node (Join-Path $proj 'tools\usage-anthropic.js') duo 2>$null | Select-Object -Last 1)
    if ($duo -match '^(-?\d+)\|(.*)$') { $pct = [int]$Matches[1]; $resetIso = $Matches[2] }
  } catch { $pct = -1 }
  if ($pct -lt 0) {
    # Jeton expire entre deux passes, ou reseau coupe. UNE LECTURE IMPOSSIBLE N'EST PAS
    # UN QUOTA EPUISE : on continue, et claude.exe rafraichira le jeton en demarrant.
    Log "[$(Stamp)] usage hebdomadaire : lecture impossible -- la passe continue."
  }
  elseif ($pct -ge $seuilHebdo) {
    $quand = $null
    if ($resetIso) { try { $quand = ([datetime]::Parse($resetIso)).ToLocalTime().AddMinutes(10) } catch {} }
    if (-not $quand) { $quand = (Get-Date).AddHours(12) }
    Log "[$(Stamp)] ===== PAUSE : usage hebdomadaire a $pct % (seuil $seuilHebdo). Reveil reporte au $($quand.ToString('yyyy-MM-dd HH:mm')), apres la remise a zero. ====="
    try {
      $tPause = New-ScheduledTaskTrigger -Once -At $quand -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName 'Syntaxe-Autonomie' -Trigger $tPause -ErrorAction Stop | Out-Null
      Set-Content -Path (Join-Path $dir 'pause-hebdo.txt') -Value "$pct % le $(Stamp) -- reprise $($quand.ToString('yyyy-MM-dd HH:mm'))" -Encoding utf8
    } catch {
      Log "[$(Stamp)] ATTENTION report KO ($_) -- desactivation par securite."
      try { & schtasks /Change /TN 'Syntaxe-Autonomie' /DISABLE | Out-Null } catch {}
    }
    if (Test-Path $lock) { Remove-Item $lock -Force -ErrorAction SilentlyContinue }
    exit 0
  }
  elseif ($pct -ge 90) { Log "[$(Stamp)] usage hebdomadaire : $pct % (seuil $seuilHebdo) -- il reste peu de marge." }
}

$debutPasse = Get-Date

New-Item -ItemType File -Path $lock -Force | Out-Null
Set-Content -Path $lock -Value $PID -Encoding ascii   # le verrou porte le PID : voir plus haut
if ($modeVerif) {
  Log "[$(Stamp)] ===== reveil autonome -- PASSE DE SECURITE (verification finale) ====="
} else {
  Log "[$(Stamp)] ===== reveil autonome ====="
}

$promptTravail = @'
Tu es lance AUTOMATIQUEMENT (tache planifiee Windows) pour faire avancer le projet Syntaxe EN AUTONOMIE, dossier d:\test-claude. Tu es NON-INTERACTIF : ne pose AUCUNE question, ne propose AUCUN questionnaire, decide et agis seul. Tout le contenu visible et les commentaires en francais, avec accents CORRECTS (jamais d'ASCII a la place d'un accent dans le contenu).

LE SITE : 83 cours, 1463 lecons, 25 parcours, 100 % file:// — aucun serveur, aucun module ES, aucun build, aucune dependance installee, que des scripts classiques. Le site est TOTALEMENT AUTONOME depuis le 2026-07-31 : Prism est servi depuis assets/vendor/prism/ et les polices depuis assets/fonts/ via css/fonts.css. Les chantiers V4 (31 points d'audit) et V5 (acces rapide au contenu : recherche compactee, palette clavier, antiseches) ont ete boucles avec un verdict de securite VERT. TU TRAVAILLES SUR UNE CHAINE DE QUATRE CHANTIERS, traites dans l'ordre : CHANTIER-V12.md (les 42 points d'un inventaire independant : outillage, donnees de l'apprenant, cahier d'erreurs, pieges indexes, navigation), puis CHANTIER-V13.md (le contenu qui manque : compilation, reseaux de neurones, systemes distribues, securite offensive, cryptographie — un MODULE par case, jamais un cours entier), puis CHANTIER-V14.md (faire ecrire du code et le corriger : moteurs d'execution locaux, exercices vraiment auto-corriges, decodeur d'erreurs, bac a sable Git), puis CHANTIER-V16.md (consolider : faire entrer dans la chaine les 24 verificateurs que personne ne lance, corriger le biais qui fait reussir 89,6 % des QCM en choisissant la reponse la plus longue, etendre la fraicheur), le tout apres CHANTIER-V15.md (comprendre ce qu'on ne voit pas : lire le code des autres, voir un programme s'executer pas a pas, les mathematiques du metier, lire la documentation en anglais, et dater ce qui perime). Le wrapper te donne automatiquement le premier plan qui a encore une case a cocher : tu n'as pas a choisir. CHAQUE PLAN PORTE SON PROPRE CADRAGE en tete — lis-le, il explique pourquoi ce chantier existe et quelles erreurs eviter.

CE QUI A FONDE CETTE CHAINE, et qui vaut pour les trois : les quatre verificateurs du site etaient VERTS quand un inventaire a trouve CINQ exemples dont la sortie annoncee etait fausse — dont une lecon sur les expressions regulieres qui affichait un commentaire true sous un test renvoyant false, visible par l'apprenant puisque runner.js pose un bouton Tester sur ces blocs. Ces cinq erreurs sont corrigees, mais LA CAUSE RESTE : aucun outil n'execute jamais un exemple. REGLE ABSOLUE : NE JAMAIS CORRIGER NI ECRIRE UN CALCUL DE TETE, LE FAIRE TOURNER. Le compte rendu de chaque case cite le chiffre obtenu par l'execution. Deuxieme regle : UN MOTIF DE REMPLACEMENT TROP LARGE CASSE CE QUI ETAIT JUSTE — un meme chiffre apparait souvent plusieurs fois dans une page pour des raisons differentes, donc rejoue le scenario complet apres correction. Troisieme regle : CERTAINS POINTS SONT DE VRAIS CHANTIERS — evalue avant de commencer, et si l'un depasse manifestement ce qu'une passe peut faire, laisse la case decochee en ecrivant ce qui bloque. Mieux vaut un point clos que trois ebauches. LE PROJET EST SOUS GIT et sauvegarde sur un depot prive : un commit par point, avec la mesure dans le message.

ULTRACODE : ce reveil tourne en mode ultracode. Le mot-cle ultracode present dans ce prompt t'ouvre l'outil Workflow (orchestration multi-agents). SERS-T'EN quand la case le merite : un audit, une revue, une recherche large, une verification adversariale, ou un fan-out sur une liste d'elements independants (des lecons, des cours, des exemples a executer). N'en lance PAS pour une correction d'une ligne, ni pour EXPLORER ou CHERCHER quelque chose : un grep coute mille fois moins cher qu'un agent. DIMENSIONNE PETIT : au plus 6 agents par workflow, et au plus 2 workflows par reveil. Le seul usage qui a prouve sa valeur est la CONTRADICTION D'UN CONTENU DEJA ECRIT -- faire relire un module par des agents charges de le demolir, ce qui a rendu 30 fautes sur un seul module. Garde le fan-out pour ca.

REGLE DE SECURITE DU FAN-OUT, elle prime sur tout le reste : les sous-agents peuvent LIRE, MESURER, EXECUTER et VERIFIER en parallele sans aucun risque. L'ECRITURE, elle, reste coordonnee : deux agents qui modifient la meme lecon en meme temps se detruisent mutuellement, et un git commit lance par deux agents a la fois casse le depot. Donc un seul agent ecrit a la fois dans un fichier donne, et TOI SEUL fais les commits. Le fan-out sert d'abord a PROUVER : faire executer les exemples, rejouer les calculs, et CONTREDIRE tes propres conclusions avant de les ecrire. C'est exactement ce qui manquait quand cinq exemples faux ont traverse quatre verificateurs verts.

1) TON PLAN DE TRAVAIL EST d:\test-claude\CHANTIER-V12.md. LIS-LE A CHAQUE REVEIL. Prends la PREMIERE case non cochee, dans l'ordre du fichier (phases A a H, dans l'ordre). Traite-la ENTIEREMENT, verifie, coche-la avec un compte rendu chiffre ecrit directement dans le plan, puis passe a la suivante si le temps le permet. Un point clos et prouve vaut mieux que trois a moitie faits.
2) AVANT DE CORRIGER, REVERIFIE. Les mesures inscrites dans le plan datent du jour ou il a ete ecrit et le site bouge a chaque passe. Reproduis la mesure toi-meme : si le point est deja regle, coche-le en le signalant, n'invente pas de travail. Si la mesure ne se reproduit pas du tout, dis-le et passe au point suivant.
3) LES QUATRE OUTILS DU PROJET, a utiliser systematiquement — ils font en quelques secondes ce qui prendrait des heures a la main, et ils ne se trompent pas : (a) node tools/verif-html.js analyse le SOURCE des 1425 lecons et detecte toute balise creee par erreur dans un bloc de code ; il DOIT rester a zero apres ton passage. (b) node tools/verif-donnees.js verifie 17 invariants de DONNEES (courses/content/durations, fichiers cites contre fichiers disque, index, doublons de QCM). (c) node tools/verif-rendu.js mesure CE QUE LE NAVIGATEUR AFFICHE : debordement horizontal, contraste du texte sur son fond effectif, repere de focus au clavier, aria, erreurs de console, requetes reseau ; sans argument il prend un echantillon de 20 pages, avec --tout --lecons il en couvre 139, et il pilote Chrome donc il prend plusieurs minutes. Lance-le des que tu touches a du CSS ou a un gabarit. (d) node tools/build-index.js regenere les index derives ; il est en mode comparaison par defaut, il faut --write pour ecrire, avec --only=quiz,flashcards,search,searchlite,antiseches.
4) INTERDIT ABSOLU : reintroduire une URL vers cdnjs.cloudflare.com, fonts.googleapis.com ou fonts.gstatic.com. Le site en compte zero. Apres toute modification de tools/, de starter/ ou d'un gabarit de page, REVERIFIE ce point : le piege s'est deja represente trois fois. Ne touche jamais au mojibake VOLONTAIRE des lecons qui enseignent l'encodage (pages/formats/lecon-06.html, pages/html/lecon-15.html, pages/r/lecon-06.html, pages/perl/lecon-13.html).
5) VERIFIE AVANT DE CONCLURE : node --check sur chaque fichier js touche ; accolades equilibrees et aucune variable var(--x) inexistante pour un css ; balises equilibrees et zero BOM pour un html ; chaque bloc data-quiz, data-exos et data-quiz-bilan reste du JSON valide. Teste le rendu avec une progression semee dans localStorage (syntaxe-progress) : plusieurs comportements, dont la pastille XP, n'apparaissent qu'a cette condition, et un test avec un localStorage vide ment. Ne laisse JAMAIS un fichier casse : corrige ou reviens en arriere.
6) EN CAS DE DOUTE REEL sur un point, ne force pas : laisse la case decochee et ecris precisement dans le plan ce qui bloque et ce qu'il faudrait decider. C'est une information utile, pas un echec.
7) Apres ton travail, mets a jour la memoire du chantier (fichier enrichissement-cron-3.md) avec ce que tu as fait. Messages BREFS.
'@

# Prompt de la PASSE DE SECURITE : lance une seule fois, quand tout est fini.
# Comme le prompt de travail : AUCUN guillemet droit (sinon la ligne de commande
# passee a claude.exe est mal decoupee et l'appel echoue).
$promptVerif = @'
Tu es lance AUTOMATIQUEMENT (tache planifiee Windows) sur le projet Syntaxe, dossier d:\test-claude. Le chantier est DETECTE COMME TERMINE : plus aucun cours -avance, toutes les lecons enrichies, plan entierement coche. Ta mission UNIQUE ce reveil est une PASSE DE SECURITE de fin de chantier : verifier tout le site de bout en bout, corriger ce qui est sans risque, puis rendre un verdict. Tu es NON-INTERACTIF : aucune question, aucun questionnaire. N'ajoute AUCUN contenu nouveau (pas de lecon, pas de cours) : ce reveil est un controle, pas une production.

0) LANCE D'ABORD LES TROIS OUTILS DU PROJET, qui font l'essentiel du travail en quelques secondes et ne se trompent pas :
   node tools/verif-html.js      (source des 1425 lecons : toute balise creee par erreur dans un bloc de code)
   node tools/verif-donnees.js   (17 invariants de donnees : courses/content/durations, liens, index, doublons de QCM)
   node tools/verif-rendu.js --tout --lecons   (CE QUE LE NAVIGATEUR AFFICHE sur 139 pages : debordement horizontal, contraste, focus clavier, aria, erreurs de console, requetes reseau)
   Les trois DOIVENT sortir en code 0. verif-rendu prend plusieurs minutes : c'est normal, il pilote Chrome. S'il signale quelque chose, reproduis la mesure avant de corriger, et corrige la CAUSE, pas le symptome.

1) VERIFIE ENSUITE ce que les outils ne couvrent pas, en t'appuyant sur des scripts node jetables ranges dans scratchpad :
   a) SYNTAXE : tous les fichiers de js/ passent node --check.
   b) DONNEES : chaque bloc data-quiz, data-exos et data-quiz-bilan de toutes les lecons est du JSON valide.
   c) ENCODAGE : aucun fichier du site n'a de BOM ; aucun mojibake NON volontaire (certaines lecons montrent un encodage errone EXPRES, ne pas y toucher).
   d) LIENS : chaque fichier de lecon reference dans js/data.js existe sur le disque, et chaque fichier lecon-NN.html present dans un dossier de cours est bien reference (hors pages de redirection) ; les liens relatifs des pages de cours et des lecons pointent vers des fichiers existants.
   e) INDEX : js/search-index.js a exactement une entree par lecon reelle, aucune entree pour un ancien dossier -avance, et le total est coherent avec le nombre de fichiers.
   f) DUREES : pour chaque cours, l'objet durations de data.js a autant d'entrees que le cours a de lecons (rappel : la clef du cours JS est javascript alors que son dossier est js).
   g) NIVEAUX : les 4 cours fusionnes (html, css, javascript, python) ont bien tous leurs modules porteurs d'un champ level reparti en debutant, intermediaire et expert ; plus aucun identifiant en -avance ne subsiste dans data.js, catalogue.js, cours.js, projets-data.js, flashcards-data.js, quiz-index.js, logos.js ni dans les fichiers fil-rouge.
   h) REDIRECTIONS : chaque ancienne URL de cours -avance existe encore et pointe vers une lecon qui existe vraiment.
   i) COMPTEURS AFFICHES : le nombre de cours et de lecons annonce sur l'accueil et le catalogue correspond a la realite.
2) CORRIGE uniquement ce qui est simple et sur (index, durees, compteurs, liens). Si une correction est lourde ou douteuse, NE LA FAIS PAS : signale-la dans le rapport.
ULTRACODE : le mot-cle ultracode present dans ce prompt t'ouvre l'outil Workflow. Cette passe est precisement son cas d'usage : lance les controles EN PARALLELE, un agent par dimension, puis fais REFUTER chaque probleme trouve par un second agent dont la consigne est de le demolir. Un constat qui n'a pas ete reproduit n'entre pas dans le rapport. Moins de 15 agents. Les agents LISENT et MESURENT ; les corrections et les commits, c'est toi.

3) ECRIS le rapport dans d:\test-claude\VERIF-FINALE.md. Sa toute PREMIERE ligne doit etre exactement VERDICT: VERT si tous les controles sont bons apres tes corrections, sinon exactement VERDICT: ROUGE. Ensuite le detail controle par controle avec les chiffres, puis la liste des problemes restants.
4) Mets a jour la memoire du chantier (fichier enrichissement-cron-3.md) avec le resultat. Messages BREFS.
'@

# Le prompt de travail nomme CHANTIER-V12.md ; on y substitue le plan courant de
# la chaine, pour que le meme wrapper serve a tous les chantiers.
$planCourant = Get-PlanCourant
if (-not $planCourant) { $planCourant = 'CHANTIER-V12.md' }
$promptTravail = $promptTravail.Replace('CHANTIER-V12.md', $planCourant)
$prompt = if ($modeVerif) { $promptVerif } else { $promptTravail }

try {
  Set-Location $proj
  # Modele + effort EPINGLES (choix utilisateur, 2026-08-21) : Opus 5, effort max, pour du
  # travail non surveille. --dangerously-skip-permissions = agir sans prompt.
  # Le mot-cle ultracode est dans le prompt : il ouvre l'outil Workflow (multi-agents).
  # Il n'existe PAS de drapeau CLI equivalent ; le declencheur est le mot dans le texte.
  # SUFFIXE [1m] OBLIGATOIRE, ne pas l'enlever : le binaire epingle est en 2.1.168
  # (8 juin) et ne connait pas claude-opus-5 -- zero occurrence dans le fichier, contre
  # 42 dans la version 2.1.238. Sa table de fenetre de contexte n'accorde le million de
  # jetons qu'a claude-opus-4-7 et claude-opus-4-8, codes en dur ; tout autre nom retombe
  # a 200 000. Or sur les 390 passes deja journalisees, 125 ont depasse 200 000 jetons
  # (pic mesure : 608 342) : sans ce suffixe, une passe sur trois se ferait compacter en
  # plein milieu d'une case, juste avant d'ecrire son compte rendu chiffre. Le suffixe est
  # retire du nom avant l'appel a l'API, donc il ne change pas le modele appele : teste,
  # exit 0. Quand le binaire sera mis a jour, le suffixe restera valide (opus 5 y est natif 1M).
  # RETRY : les echecs sont surtout des coupures API transitoires (ex 529 Overloaded).
  # On reessaie UNE fois apres 30s. Le reveil est idempotent (une lecon deja enrichie,
  # reperable a son glossaire, n'est jamais refaite), donc relancer est sans risque.
  $sortie = ''; $code = 1
  for ($try = 1; $try -le 2 -and $code -ne 0; $try++) {
    if ($try -gt 1) {
      Log "[$(Stamp)] echec (exit $code) -- nouvelle tentative ($try/2) dans 30s..."
      Start-Sleep -Seconds 30
    }
    $sortie = (& $claude -p $prompt --model 'claude-opus-5[1m]' --effort high --dangerously-skip-permissions 2>&1 | Out-String)
    $code = $LASTEXITCODE
  }
  # Reparation du mojibake : sous le Planificateur (aucune console), [Console]::OutputEncoding
  # ne s'applique pas, donc PowerShell decode la sortie UTF-8 de claude en ANSI (1252). On
  # detecte la signature (octet de tete 0xC2/0xC3 suivi d'une continuation 0x80-0xBF) et on
  # repare en re-encodant 1252 -> octets -> UTF-8. Si la sortie est deja correcte, on n'y touche pas.
  $estMojibake = $false
  for ($i = 0; $i -lt $sortie.Length - 1; $i++) {
    $a = [int]$sortie[$i]; $b = [int]$sortie[$i + 1]
    if (($a -eq 0xC2 -or $a -eq 0xC3) -and $b -ge 0x80 -and $b -le 0xBF) { $estMojibake = $true; break }
  }
  if ($estMojibake) {
    try { $sortie = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::GetEncoding(1252).GetBytes($sortie)) } catch {}
  }
  Log $sortie

  # --- VERROUS D'USAGE, lus dans la sortie de claude.exe -----------------------
  # Les deux messages sont textuels et stables : You've hit your weekly limit et
  # You've hit your session limit, tous deux suivis de l'heure de reprise.
  $resetSession = $null
  if ($sortie -match "hit your weekly limit") {
    # LIMITE HEBDOMADAIRE : on arrete TOUT. Sans ce controle, la tache se reveillait
    # toutes les 2 h pour echouer aussitot, ce qui ne sert qu'a brasser du vide.
    $quand = Get-HeureReset $sortie
    if (-not $quand) {
      # Le message ne portait pas d'heure lisible (constate le 2026-08-27 : la reprise
      # a ete notee heure inconnue). L'API, elle, donne la date exacte de remise a zero.
      try {
        $iso = (& node (Join-Path $proj 'tools\usage-anthropic.js') reset 2>$null | Select-Object -Last 1)
        if ($iso) { $quand = ([datetime]::Parse($iso)).ToLocalTime() }
      } catch {}
    }
    $txt = if ($quand) { $quand.ToString('yyyy-MM-dd HH:mm') } else { 'heure inconnue' }
    Log "[$(Stamp)] ===== LIMITE HEBDOMADAIRE ATTEINTE. Reveil reporte a $txt, pas de nouvelle tentative d ici la. ====="
    try {
      $reprise = if ($quand) { $quand.AddMinutes(10) } else { (Get-Date).AddHours(12) }
      $tLim = New-ScheduledTaskTrigger -Once -At $reprise -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName 'Syntaxe-Autonomie' -Trigger $tLim -ErrorAction Stop | Out-Null
    } catch { try { & schtasks /Change /TN 'Syntaxe-Autonomie' /DISABLE | Out-Null } catch {} }
    try { Set-Content -Path (Join-Path $dir 'limite-hebdo.txt') -Value $txt -Encoding utf8 } catch {}
    # $replanifFaite, PAS $arretDemande. Corrige le 2026-09-08 apres un audit : la
    # correction du 2026-09-02 avait cree la variable, reecrit le bloc final et annonce
    # « trois cas TESTES » -- mais laisse CETTE ligne intacte. J avais teste une
    # simulation des trois branches, jamais le code reel : $replanifFaite n etait
    # affectee NULLE PART. La panne est donc retombee a l identique le 2026-09-07 a
    # 03:59:57, ou le journal a ecrit « CHANTIER TERMINE : verification finale VERTE »
    # sur un chantier a 8/22, sans qu aucune verification n ait tourne. Une reparation
    # declaree verte sans avoir ete executee est exactement le defaut que ce projet
    # combat -- ici commis sur le garde-fou lui-meme.
    $replanifFaite = $true
  }
  elseif ($sortie -match "hit your session limit") {
    # LIMITE DE SESSION : inutile de reessayer avant l'heure dite. On reporte le
    # prochain reveil a la reprise plutot que dans 5 minutes.
    $resetSession = Get-HeureReset $sortie
    if ($resetSession) { Log "[$(Stamp)] limite de session : prochain reveil reporte a $($resetSession.ToString('HH:mm')), pas dans 5 min." }
  }

  # --- Releve de consommation, pour le verrou de budget ------------------------
  try { & node (Join-Path $proj 'tools\conso-hebdo.js') enregistrer $debutPasse.ToString('o') 2>$null | Out-Null } catch {}
  Log "[$(Stamp)] ===== fin (exit $code) ====="

  # --- Ligne BILAN lisible : on compte le nombre REEL de lecons enrichies = fichiers
  # pages/<cours>/lecon-*.html contenant un glossaire (class glossary), marqueur pose par
  # le modele sur CHAQUE lecon enrichie. Plus fiable que les cases du plan (qui sont par
  # cours et semblent stagner alors que les lecons avancent). ---
  $statut = if ($code -eq 0) { 'OK' } else { 'ECHEC' }
  $faits = '?'; $total = '?'
  try {
    $plan = Join-Path $proj $planCourant
    $coches = (Select-String -Path $plan -Pattern '^- \[x\]').Count
    $restants = (Select-String -Path $plan -Pattern '^- \[ \]').Count
    $faits = $coches; $total = $coches + $restants
  } catch {}
  Log "[$(Stamp)] BILAN [$statut] -- $faits/$total points de $planCourant"

  # --- Verdict de la passe de securite ---------------------------------------
  # Le modele ecrit VERDICT: VERT ou VERDICT: ROUGE en 1re ligne de VERIF-FINALE.md.
  if ($modeVerif) {
    $verdict = 'ABSENT'
    if (Test-Path $rapport) {
      # FRAICHEUR D'ABORD (correctif 2026-08-12) : sans ce controle, le wrapper
      # lisait la 1re ligne du rapport SANS verifier qu'il venait d'etre ecrit.
      # Constate sur le chantier V8 : la passe n'avait pas reecrit le rapport, le
      # wrapper a relu un VERDICT: VERT vieux de NEUF JOURS et s'est eteint en
      # croyant avoir verifie. Un verdict perime est pire que pas de verdict :
      # il eteint le seul garde-fou. On exige donc que le fichier ait ete ecrit
      # APRES le debut de cette passe.
      $ecritPendantLaPasse = (Get-Item $rapport).LastWriteTime -ge $debutPasse
      if (-not $ecritPendantLaPasse) {
        $verdict = 'PERIME'
        Log "[$(Stamp)] VERIFICATION FINALE : rapport PERIME (ecrit le $((Get-Item $rapport).LastWriteTime.ToString('yyyy-MM-dd HH:mm')), passe demarree a $($debutPasse.ToString('HH:mm'))) -- verdict ignore."
      } else {
        $tete = (Get-Content $rapport -TotalCount 1 -Encoding utf8)
        if ($tete -match 'VERDICT\s*:\s*VERT') { $verdict = 'VERT' }
        elseif ($tete -match 'VERDICT\s*:\s*ROUGE') { $verdict = 'ROUGE' }
      }
    }
    if ($verdict -eq 'VERT' -and $code -eq 0) {
      New-Item -ItemType File -Path $okFile -Force | Out-Null
      Remove-Item $cptFile -Force -ErrorAction SilentlyContinue
      $arretDemande = $true
    } else {
      $n = 0
      if (Test-Path $cptFile) { $n = [int](Get-Content $cptFile -TotalCount 1) }
      $n = $n + 1
      Set-Content -Path $cptFile -Value $n -Encoding ascii
      Log "[$(Stamp)] VERIFICATION FINALE : $verdict (tentative $n/3) -- voir VERIF-FINALE.md, un nouveau reveil va corriger."
    }
  }
} catch {
  Log "[$(Stamp)] ERREUR wrapper : $_"
} finally {
  Remove-Item $lock -Force -ErrorAction SilentlyContinue
  if ($replanifFaite) {
    # Un declencheur a deja ete pose (limite d usage) : ne rien faire de plus, et
    # surtout NE PAS desactiver -- la tache doit repartir seule apres la remise a zero.
    Log "[$(Stamp)] reveil deja replanifie (limite d usage) -- la tache reste ACTIVE."
  }
  elseif ($arretDemande) {
    # Fin de chantier confirmee par la passe de securite : on coupe ici, sans
    # replanifier, plutot que de gaspiller un reveil de plus.
    Log "[$(Stamp)] ===== CHANTIER TERMINE : verification finale VERTE. Tache desactivee, aucun reveil replanifie. ====="
    try { Disable-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop | Out-Null }
    catch { Log "[$(Stamp)] ATTENTION desactivation KO ($_) -- couper a la main." }
  }
  # Auto-replanification -- SAUF si la fin de chantier vient d'etre confirmee.
  # (Pas de return ici : PowerShell interdit de sortir d'un bloc finally.)
  # Choix Noah 2026-07-17, delai reduit a 5 min le 2026-07-23 apres
  # passage au forfait Max X20) : le PROCHAIN reveil se lance 5 min APRES la fin de CETTE
  # passe (au lieu d'un horaire fixe a :30). Filets de securite :
  #   - repetition toutes les 2h sur le meme trigger : si la chaine casse (ex. crash avant
  #     d'arriver ici), un reveil repart dans 2h max ;
  #   - StartWhenAvailable (dans les Settings) : rattrape le declenchement manque apres un
  #     reboot / une veille des que la machine est dispo.
  # (Pas de trigger AtStartup : il exige l'elevation admin, indisponible en contexte non-eleve.)
  # Le verrou anti-chevauchement empeche tout double-run. Settings (WakeToRun...) preserves.
  elseif (-not $arretDemande) {
    try {
      $next = if ($resetSession) { $resetSession.AddMinutes(2) } else { (Get-Date).AddMinutes(5) }
      $motif = if ($resetSession) { 'a la reprise annoncee par la limite de session' } else { '5 min apres la fin' }
      $tOnce = New-ScheduledTaskTrigger -Once -At $next -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName 'Syntaxe-Autonomie' -Trigger $tOnce -ErrorAction Stop | Out-Null
      # POSER UN DECLENCHEUR NE SUFFIT PAS : si la tache est DESACTIVEE, rien ne se
      # produira. Constate le 2026-09-06 : le journal annoncait « prochain reveil
      # planifie ~09:31 » et aucun reveil n a eu lieu, la tache ayant ete arretee la
      # veille. Un journal qui affirme ce qu il n a pas verifie est pire qu un journal
      # muet. On verifie donc, et on dit la verite.
      $tacheActive = $true
      try { $tacheActive = [bool](Get-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop).Settings.Enabled } catch {}
      if ($tacheActive) {
        Log "[$(Stamp)] prochain reveil planifie ~$($next.ToString('HH:mm')) ($motif)"
      } elseif (Test-Path (Join-Path $dir 'arret-volontaire.txt')) {
        Log "[$(Stamp)] ATTENTION : declencheur pose a $($next.ToString('HH:mm')) mais la tache est DESACTIVEE avec un arret volontaire -- AUCUN REVEIL N AURA LIEU. Retirer .autonomie/arret-volontaire.txt puis reactiver la tache."
      } else {
        try {
          Enable-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop | Out-Null
          Log "[$(Stamp)] tache trouvee DESACTIVEE sans arret demande -- REACTIVEE. Prochain reveil ~$($next.ToString('HH:mm')) ($motif)"
        } catch {
          Log "[$(Stamp)] ATTENTION : tache DESACTIVEE et reactivation impossible ($_) -- aucun reveil n aura lieu."
        }
      }
    } catch {
      Log "[$(Stamp)] ATTENTION replanification KO ($_) -- le filet 2h prend le relais."
    }
  }
}
