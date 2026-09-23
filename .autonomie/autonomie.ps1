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

# Lecture de l'heure de reprise annoncee par claude.exe : Get-HeureReset,
# Get-ResetHebdoApi et Resolve-ResetHebdo vivent dans .autonomie/lib-reset.ps1,
# pour que .autonomie/epreuve-reset.ps1 mette a l'epreuve LA MEME fonction que
# celle qui tourne ici (point D1 du chantier V17). L'ancienne version, ecrite a
# cet endroit, ne savait rendre qu'une heure du jour ou du lendemain -- exact pour
# une limite de session, faux de QUATRE JOURS pour une limite hebdomadaire -- et
# elle ne savait pas lire la forme datee << resets Aug 11, 1am >>, pourtant la
# plus frequente du journal (73 occurrences sur 726 reveils).
$libReset = Join-Path $dir 'lib-reset.ps1'
if (Test-Path $libReset) { . $libReset }
else {
  # Sans la lib, le wrapper doit continuer : une autonomie qui s'arrete parce qu'un
  # fichier annexe manque est pire que le defaut qu'il corrigeait. On retombe alors
  # sur le comportement le plus prudent : aucune heure lue, donc report par defaut.
  function Get-HeureReset($texte) { return $null }
  function Get-ResetHebdoApi($p) { return $null }
  function Resolve-ResetHebdo($p, $t) { return [pscustomobject]@{ Quand = $null; Source = 'lib-absente' } }
  function Get-RepriseSure($q, $m) { if (-not $m) { $m = 5 }; $pl = (Get-Date).AddMinutes($m); if ($q -and $q -gt $pl) { return [pscustomobject]@{ Quand = $q; Corrige = $false; Demande = $q } }; return [pscustomobject]@{ Quand = $pl; Corrige = $true; Demande = $q } }
  function Get-PauseEnCours($d) { return [pscustomobject]@{ Actif = $false; Quand = $null; Source = 'lib-absente' } }
  # Sans la lib, le prompt part avec ses jetons NON substitues : on le dit tres fort
  # plutot que d'envoyer une consigne qui nomme un plan inexistant.
  function Complete-Prompt($texte, $mes) {
    return [pscustomobject]@{ Texte = [regex]::Replace($texte, '@@[A-Z_0-9]+@@', '(chiffre non mesure)')
                              Alertes = @('lib-reset.ps1 ABSENTE : jetons neutralises') }
  }
  function Get-MesuresSite($p) { return $null }
  # Sans la lib, aucun drapeau n'est valide : on refait une passe de securite plutot
  # que d'eteindre l'autonomie sur la foi d'un fichier qu'on ne sait pas relire.
  function Test-DrapeauFin($f, $p, $c) { return [pscustomobject]@{ Valide = $false; Pourquoi = 'lib-reset.ps1 absente'; Ecrit = (Get-Date); Empreinte = '' } }
  # Sans la lib, on retombe sur l'ancienne regle du verrou : PID vivant + nom du
  # processus. Moins sur, mais il vaut mieux sauter un reveil que d'en lancer deux.
  function Test-VerrouVivant($lock) {
    $r = [pscustomobject]@{ Vivant = $false; Pourquoi = 'lib absente, regle simplifiee'; Pid = 0; AgeMinutes = 0 }
    try { $r.AgeMinutes = [int]((Get-Date) - (Get-Item $lock).LastWriteTime).TotalMinutes } catch {}
    try {
      $c = (Get-Content $lock -Raw -ErrorAction Stop).Trim()
      $m = [regex]::Match($c, '(\d+)')
      if ($m.Success) {
        $r.Pid = [int]$m.Groups[1].Value
        $p = Get-Process -Id $r.Pid -ErrorAction SilentlyContinue
        if ($p -and $p.ProcessName -like 'powershell*') { $r.Vivant = $true }
      }
    } catch {}
    return $r
  }
  function Write-Verrou($lock, $processId) { Set-Content -Path $lock -Value ("pid=$processId") -Encoding ascii }
  function Write-DrapeauFin($f, $p, $c) { Set-Content -Path $f -Value ('date=' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')) -Encoding ascii }
  function Build-PromptTravail($modele, $proj, $chaine, $plan, $mes) {
    $t = $modele.Replace('@@PLAN@@', $plan).Replace('@@CHAINE@@', 'chaine : ' + ($chaine -join ', '))
    return [pscustomobject]@{ Texte = [regex]::Replace($t, '@@[A-Z_0-9]+@@', '(chiffre non mesure)')
                              Alertes = @('lib-reset.ps1 ABSENTE : prompt assemble en mode degrade') }
  }
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
# L'ARRET VOLONTAIRE EST LU AU DEMARRAGE (point D8 du chantier V17).
# Le wrapper ne consultait .autonomie/arret-volontaire.txt qu'a la toute fin, pour un
# message. Un lancement manuel (schtasks /Run) repartait donc malgre l'arret : mesure
# dans le journal, << ARRET MANUEL >> le 2026-09-08 a 19:08:59 et << reveil autonome >>
# a 19:09:08 -- NEUF SECONDES apres (et un autre cas 49 minutes apres, a 19:01:59).
# arret.ps1 pose ce marqueur precisement pour que rien ne redemarre ; le supprimer est
# ce qui autorise la reprise. Drapeau explicite pour passer outre :
#   $env:SYNTAXE_MALGRE_ARRET = '1'  (une seule execution, jamais persistant)
# ROTATION DU JOURNAL (point D9), avant tout le reste : il grossissait sans fin
# (622 Ko, 7 310 lignes, 762 reveils au 2026-09-10). Les 400 dernieres lignes restent
# en place -- sans quoi tools/sante-autonomie.ps1, qui cherche la derniere trace
# horodatee, lirait << aucune trace >> et inventerait une anomalie.
if (Get-Command Invoke-RotationJournal -ErrorAction SilentlyContinue) {
  $rot = Invoke-RotationJournal $log 1MB 400 8
  if ($rot.Fait) { Log "[$(Stamp)] journal archive : $(Split-Path $rot.Archive -Leaf) ($([math]::Round($rot.TailleAvant / 1KB)) Ko), $($rot.LignesGardees) lignes conservees." }
  elseif ($rot.Pourquoi -like 'rotation impossible*') { Log "[$(Stamp)] ATTENTION $($rot.Pourquoi) -- le journal continue de grossir." }
}

$marqueurArret = Join-Path $dir 'arret-volontaire.txt'
if (Test-Path $marqueurArret) {
  $quoi = ''
  try { $quoi = ((Get-Content $marqueurArret -Raw -ErrorAction Stop) -replace '\s+', ' ').Trim() } catch {}
  if ($env:SYNTAXE_MALGRE_ARRET -eq '1') {
    Log "[$(Stamp)] arret volontaire en place ($quoi) mais SYNTAXE_MALGRE_ARRET=1 : la passe demarre quand meme."
  } else {
    Log "[$(Stamp)] SKIP : arret volontaire en place ($quoi). Retirer .autonomie/arret-volontaire.txt pour reprendre."
    exit 0
  }
}

if (Test-Path $lock) {
  # Le verrou porte le PID ET l'heure de demarrage du processus (point D10) : Windows
  # RECYCLE les PID, et un numero repris par un autre powershell faisait sauter les
  # reveils jusqu'au plafond de 6 h, en journalisant << un reveil precedent tourne
  # encore >> -- ce qui etait faux. Voir Test-VerrouVivant dans lib-reset.ps1.
  $v = Test-VerrouVivant $lock
  if ($v.Vivant -and $v.AgeMinutes -lt 360) {
    Log "[$(Stamp)] SKIP : un reveil precedent tourne encore (verrou, $($v.AgeMinutes) min, $($v.Pourquoi))."
    exit 0
  }
  if (-not $v.Vivant -and $v.Pourquoi -like '*RECYCLE*') {
    Log "[$(Stamp)] verrou perime : $($v.Pourquoi). La passe demarre."
  }
}
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
# Plafond d'attente des taches de fond (Workflow) en fin de tour -- correctif du
# 2026-09-23. Verifie dans le binaire (fonction Tm/Rm) : ce compte a rebours ne
# demarre QUE quand l'agent a fini de produire et attend passivement la fin d'un
# Workflow encore actif -- jamais sur la duree totale de la passe. Le defaut de
# claude.exe est 600000 ms (10 min) ; un Workflow de cette autonomie a deja mis
# 82 min a repondre (passe pandas, 2 workflows), et une passe s'est terminee
# sans rien produire faute d'avoir attendu assez longtemps. Marge large au-dessus
# du pire cas connu, choisie avec Noah.
$env:CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS = '7200000'

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
  # LE DRAPEAU DOIT TEMOIGNER DE L'ETAT COURANT, PAS D'UN ETAT QUELCONQUE (point D7).
  # Il n'etait jamais supprime : un drapeau vieux de six mois eteignait l'autonomie
  # SANS passe de securite des que la chaine se re-terminait -- typiquement apres
  # l'ajout d'un chantier, c'est-a-dire quand une verification compte le plus.
  $drapeau = Test-DrapeauFin $okFile $proj $CHAINE
  if ($drapeau.Valide) {
    Log "[$(Stamp)] ===== CHANTIER TERMINE : plus rien a faire et verification finale VERTE du $($drapeau.Ecrit.ToString('yyyy-MM-dd HH:mm')). Tache desactivee. ====="
    try { Disable-ScheduledTask -TaskName 'Syntaxe-Autonomie' -ErrorAction Stop | Out-Null }
    catch { Log "[$(Stamp)] ATTENTION desactivation KO ($_) -- couper a la main." }
    exit 0
  }
  if (Test-Path $okFile) {
    Log "[$(Stamp)] drapeau de fin IGNORE ($($drapeau.Pourquoi)) -- une passe de securite va etre relancee."
    Remove-Item $okFile -Force -ErrorAction SilentlyContinue
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
elseif (Test-Path $okFile) {
  # Il reste des cases : un drapeau de fin qui traine ici ne peut etre que celui d'un
  # chantier precedent. On le retire tout de suite plutot que d'attendre qu'il serve
  # une seule fois, au pire moment (point D7).
  Log "[$(Stamp)] drapeau de fin retire : le chantier a de nouveau des cases a cocher."
  Remove-Item $okFile -Force -ErrorAction SilentlyContinue
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
    # Une reprise DEJA PASSEE ne differe plus rien : le declencheur repartirait
    # aussitot, ce que la pause voulait justement empecher (point D2).
    $sure = Get-RepriseSure $quand 10
    if ($sure.Corrige) {
      Log "[$(Stamp)] reprise demandee $(if ($sure.Demande) { $sure.Demande.ToString('yyyy-MM-dd HH:mm') } else { 'aucune' }) DEJA PASSEE ou trop proche -- reportee a $($sure.Quand.ToString('yyyy-MM-dd HH:mm'))."
    }
    $quand = $sure.Quand
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
Write-Verrou $lock $PID   # PID + heure de demarrage : voir Test-VerrouVivant (point D10)
if ($modeVerif) {
  Log "[$(Stamp)] ===== reveil autonome -- PASSE DE SECURITE (verification finale) ====="
} else {
  Log "[$(Stamp)] ===== reveil autonome ====="
}

$promptTravail = @'
Tu es lance AUTOMATIQUEMENT (tache planifiee Windows) pour faire avancer le projet Syntaxe EN AUTONOMIE, dossier d:\test-claude. Tu es NON-INTERACTIF : ne pose AUCUNE question, ne propose AUCUN questionnaire, decide et agis seul. Tout le contenu visible et les commentaires en francais, avec accents CORRECTS (jamais d'ASCII a la place d'un accent dans le contenu).

LE SITE : @@N_COURS@@ cours, @@N_LECONS@@ lecons, @@N_PARCOURS@@ parcours, @@N_LANGAGES@@ langages, 100 % file:// -- aucun serveur, aucun module ES, aucun build, aucune dependance installee, que des scripts classiques. Le site est TOTALEMENT AUTONOME depuis le 2026-07-31 : Prism est servi depuis assets/vendor/prism/ et les polices depuis assets/fonts/ via css/fonts.css. Les chantiers V4 (31 points d'audit) et V5 (acces rapide au contenu : recherche compactee, palette clavier, antiseches) ont ete boucles avec un verdict de securite VERT. @@CHAINE@@

CHAQUE PLAN PORTE SON PROPRE CADRAGE en tete -- lis-le, il explique pourquoi ce chantier existe et quelles erreurs eviter.

CE QUI A FONDE CETTE CHAINE, et qui vaut pour les trois : les quatre verificateurs du site etaient VERTS quand un inventaire a trouve CINQ exemples dont la sortie annoncee etait fausse -- dont une lecon sur les expressions regulieres qui affichait un commentaire true sous un test renvoyant false, visible par l'apprenant puisque runner.js pose un bouton Tester sur ces blocs. Ces cinq erreurs sont corrigees, mais LA CAUSE RESTE : aucun outil n'execute jamais un exemple. REGLE ABSOLUE : NE JAMAIS CORRIGER NI ECRIRE UN CALCUL DE TETE, LE FAIRE TOURNER. Le compte rendu de chaque case cite le chiffre obtenu par l'execution. Deuxieme regle : UN MOTIF DE REMPLACEMENT TROP LARGE CASSE CE QUI ETAIT JUSTE -- un meme chiffre apparait souvent plusieurs fois dans une page pour des raisons differentes, donc rejoue le scenario complet apres correction. Troisieme regle : CERTAINS POINTS SONT DE VRAIS CHANTIERS -- evalue avant de commencer, et si l'un depasse manifestement ce qu'une passe peut faire, laisse la case decochee en ecrivant ce qui bloque. Mieux vaut un point clos que trois ebauches. LE PROJET EST SOUS GIT et sauvegarde sur un depot prive : un commit par point, avec la mesure dans le message.

ULTRACODE : ce reveil tourne en mode ultracode. Le mot-cle ultracode present dans ce prompt t'ouvre l'outil Workflow (orchestration multi-agents). SERS-T'EN quand la case le merite : un audit, une revue, une recherche large, une verification adversariale, ou un fan-out sur une liste d'elements independants (des lecons, des cours, des exemples a executer). N'en lance PAS pour une correction d'une ligne, ni pour EXPLORER ou CHERCHER quelque chose : un grep coute mille fois moins cher qu'un agent. DIMENSIONNE PETIT : au plus 6 agents par workflow, et au plus 2 workflows par reveil. Le seul usage qui a prouve sa valeur est la CONTRADICTION D'UN CONTENU DEJA ECRIT -- faire relire un module par des agents charges de le demolir, ce qui a rendu 30 fautes sur un seul module. Garde le fan-out pour ca. Un Workflow lance TOURNE EN TACHE DE FOND et te notifie a la fin -- ATTENDS la notification, NE SONDE PAS toi-meme son avancement. Mesure du 2026-09-15 : une passe a lance git status toutes les 3 secondes pendant 81 minutes en attendant un Workflow (921 appels), et cela a represente 41 pour cent du cout total lu de cette passe -- un tour de sondage repaie a chaque fois la relecture de tout le contexte accumule. Si tu dois vraiment continuer autre chose pendant qu'un Workflow tourne, fais un travail utile en parallele ; sinon attends, tout simplement.

REGLE DE SECURITE DU FAN-OUT, elle prime sur tout le reste : les sous-agents peuvent LIRE, MESURER, EXECUTER et VERIFIER en parallele sans aucun risque. L'ECRITURE, elle, reste coordonnee : deux agents qui modifient la meme lecon en meme temps se detruisent mutuellement, et un git commit lance par deux agents a la fois casse le depot. Donc un seul agent ecrit a la fois dans un fichier donne, et TOI SEUL fais les commits. Le fan-out sert d'abord a PROUVER : faire executer les exemples, rejouer les calculs, et CONTREDIRE tes propres conclusions avant de les ecrire. C'est exactement ce qui manquait quand cinq exemples faux ont traverse quatre verificateurs verts.

1) TON PLAN DE TRAVAIL EST d:\test-claude\@@PLAN@@. LIS-LE A CHAQUE REVEIL. Prends la PREMIERE case non cochee, dans l'ordre du fichier (phases A a H, dans l'ordre). Traite-la ENTIEREMENT, verifie, coche-la avec un compte rendu chiffre ecrit directement dans le plan, puis passe a la suivante si le temps le permet. Un point clos et prouve vaut mieux que trois a moitie faits.
2) AVANT DE CORRIGER, REVERIFIE. Les mesures inscrites dans le plan datent du jour ou il a ete ecrit et le site bouge a chaque passe. Reproduis la mesure toi-meme : si le point est deja regle, coche-le en le signalant, n'invente pas de travail. Si la mesure ne se reproduit pas du tout, dis-le et passe au point suivant.
3) LES QUATRE OUTILS DU PROJET, a utiliser systematiquement -- ils font en quelques secondes ce qui prendrait des heures a la main, et ils ne se trompent pas : (a) node tools/verif-html.js analyse le SOURCE des @@N_LECONS_FICHIERS@@ pages de lecon (redirections comprises) et detecte toute balise creee par erreur dans un bloc de code ; il DOIT rester a zero apres ton passage. (b) node tools/verif-donnees.js verifie @@N_INVARIANTS@@ invariants de DONNEES (courses/content/durations, fichiers cites contre fichiers disque, index, doublons de QCM). (c) node tools/verif-rendu.js mesure CE QUE LE NAVIGATEUR AFFICHE : debordement horizontal, contraste du texte sur son fond effectif, repere de focus au clavier, aria, erreurs de console, requetes reseau ; sans argument il couvre TOUTES LES FORMES du site (accueil, pages transverses, chaque cours.html, une lecon par cours : plusieurs centaines de pages, plusieurs minutes) ; --echantillon en prend 20, --pages=a.html,b.html cible ce que tu veux. Lance-le des que tu touches a du CSS ou a un gabarit. (d) node tools/build-index.js regenere les index derives ; il est en mode comparaison par defaut, il faut --write pour ecrire, avec --only=quiz,flashcards,search,searchlite,antiseches.
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
   node tools/verif-html.js      (source des @@N_LECONS_FICHIERS@@ pages de lecon : toute balise creee par erreur dans un bloc de code)
   node tools/verif-donnees.js   (@@N_INVARIANTS@@ invariants de donnees : courses/content/durations, liens, index, doublons de QCM)
   node tools/verif-rendu.js --tout --lecons   (CE QUE LE NAVIGATEUR AFFICHE, toutes les formes du site : debordement horizontal, contraste, focus clavier, aria, erreurs de console, requetes reseau)
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

# SUBSTITUTION PAR JETONS, ET RELECTURE AVANT ENVOI (point D5).
# L'ancienne ligne etait : $promptTravail.Replace('CHANTIER-V12.md', $planCourant).
# Elle remplacait TOUTES les occurrences, y compris celle qui DECRIVAIT le sujet du
# V12 : le modele recevait le plan courant affuble de la description d'un autre
# chantier, puis une seconde annonce du meme plan quelques lignes plus bas. Les
# jetons @@PLAN@@ et @@CHAINE@@ ne peuvent pas se confondre avec du texte utile.
# L'assemblage ET sa relecture vivent dans lib-reset.ps1, donc l'epreuve
# (.autonomie/epreuve-reset.ps1) travaille sur le MEME code et sur le MEME modele de
# prompt, extrait de ce fichier-ci.
$planCourant = Get-PlanCourant
if (-not $planCourant) { $planCourant = $CHAINE[$CHAINE.Count - 1] }
# LES CHIFFRES DU SITE SONT MESURES, PLUS ECRITS A LA MAIN (point D6) : le prompt
# annoncait << 83 cours, 1463 lecons >> pour 90 et 1540, et decrivait les outils avec
# des chiffres tout aussi vieux. 60 ms de mesure valent mieux qu'une image fausse.
$mesuresSite = Get-MesuresSite $proj
$assemble = Build-PromptTravail $promptTravail $proj $CHAINE $planCourant $mesuresSite
$promptTravail = $assemble.Texte
# Le prompt de la passe de securite cite les memes outils, donc les memes chiffres.
$assembleV = Complete-Prompt $promptVerif $mesuresSite
$promptVerif = $assembleV.Texte
foreach ($alerte in @($assemble.Alertes) + @($assembleV.Alertes)) { Log "[$(Stamp)] ATTENTION PROMPT : $alerte" }
Log "[$(Stamp)] prompt : $($promptTravail.Length) caracteres, plan courant $planCourant, $($CHAINE.Count) chantiers decrits, $(if ($mesuresSite) { "$($mesuresSite.N_COURS) cours / $($mesuresSite.N_LECONS) lecons mesures" } else { 'chiffres NON mesures' }), $(@($assemble.Alertes).Count + @($assembleV.Alertes).Count) alerte(s)."
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
    # L'API D'ABORD, LE TEXTE EN REPLI (point D1, inverse le 2026-09-10). L'ancien
    # ordre demandait au TEXTE une information qu'il ne porte pas : le JOUR de la
    # remise a zero hebdomadaire. Mesure du 2026-09-10 : le texte disait 2026-09-11
    # 01:00, l'API 2026-09-15 00:59 -- 96 heures d'ecart, soit quatre jours de
    # reveils toutes les deux heures pour se faire refuser aussitot.
    $res = Resolve-ResetHebdo $proj $sortie
    $quand = $res.Quand
    # Le fichier limite-hebdo.txt ne recoit que la DATE (il peut etre relu par un
    # outil) ; la provenance ne va qu'au journal, ou elle sert a comprendre apres coup.
    $txt = if ($quand) { $quand.ToString('yyyy-MM-dd HH:mm') } else { 'heure inconnue' }
    Log "[$(Stamp)] ===== LIMITE HEBDOMADAIRE ATTEINTE. Reveil reporte a $txt (source : $($res.Source)), pas de nouvelle tentative d ici la. ====="
    try {
      $reprise = if ($quand) { $quand.AddMinutes(10) } else { (Get-Date).AddHours(12) }
      # Meme garde qu'au verrou de budget (point D2) : l'heure lue -- par l'API comme
      # par le texte -- peut deja etre passee, et un declencheur passe ne reporte rien.
      $sureLim = Get-RepriseSure $reprise 10
      if ($sureLim.Corrige) {
        Log "[$(Stamp)] reprise hebdomadaire $($reprise.ToString('yyyy-MM-dd HH:mm')) DEJA PASSEE ou trop proche -- reportee a $($sureLim.Quand.ToString('yyyy-MM-dd HH:mm'))."
      }
      $reprise = $sureLim.Quand
      $tLim = New-ScheduledTaskTrigger -Once -At $reprise -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName 'Syntaxe-Autonomie' -Trigger $tLim -ErrorAction Stop | Out-Null
    } catch { try { & schtasks /Change /TN 'Syntaxe-Autonomie' /DISABLE | Out-Null } catch {} }
    try { Set-Content -Path (Join-Path $dir 'limite-hebdo.txt') -Value $txt -Encoding utf8 } catch {}
    # $replanifFaite, PAS $arretDemande. Corrige le 2026-09-08 apres un audit : la
    # correction du 2026-09-02 avait cree la variable, reecrit le bloc final et annonce
    # << trois cas TESTES >> -- mais laisse CETTE ligne intacte. J avais teste une
    # simulation des trois branches, jamais le code reel : $replanifFaite n etait
    # affectee NULLE PART. La panne est donc retombee a l identique le 2026-09-07 a
    # 03:59:57, ou le journal a ecrit << CHANTIER TERMINE : verification finale VERTE >>
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
      # Le drapeau porte sa date ET l'empreinte de l'etat verifie (point D7) : un
      # fichier vide ne dit pas DE QUOI il temoigne.
      Write-DrapeauFin $okFile $proj $CHAINE
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
      # Point D2. Ici le cas est le plus courant des trois : la limite de session a ete
      # lue AU DEBUT de la passe, et la passe a pu durer plus longtemps que le delai
      # annonce -- l'heure de reprise est alors derriere nous quand on replanifie.
      $sureNext = Get-RepriseSure $next 2
      if ($sureNext.Corrige) {
        Log "[$(Stamp)] reprise $($next.ToString('yyyy-MM-dd HH:mm')) DEJA PASSEE ou trop proche -- reportee a $($sureNext.Quand.ToString('yyyy-MM-dd HH:mm'))."
        $motif = $motif + ', recalee car deja passee'
      }
      $next = $sureNext.Quand
      $tOnce = New-ScheduledTaskTrigger -Once -At $next -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName 'Syntaxe-Autonomie' -Trigger $tOnce -ErrorAction Stop | Out-Null
      # POSER UN DECLENCHEUR NE SUFFIT PAS : si la tache est DESACTIVEE, rien ne se
      # produira. Constate le 2026-09-06 : le journal annoncait << prochain reveil
      # planifie ~09:31 >> et aucun reveil n a eu lieu, la tache ayant ete arretee la
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
