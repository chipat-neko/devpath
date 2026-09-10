# =============================================================================
# epreuve-reset.ps1 - LA LECTURE DE L'HEURE DE REPRISE, MISE A L'EPREUVE.
#
# Elle joue les QUATRE formes reellement rencontrees dans .autonomie/journal.log
# (726 reveils), plus les cas limites qui ont fait le defaut du point D1. Elle
# charge la MEME fonction que la production (.autonomie/lib-reset.ps1) : rien
# n'est recopie ici, sans quoi l'epreuve finirait par mesurer autre chose.
#
#   powershell -File .autonomie\epreuve-reset.ps1
#
# Code de sortie : 1 si un cas echoue, sinon 0.
# =============================================================================
$ErrorActionPreference = 'Continue'
. (Join-Path $PSScriptRoot 'lib-reset.ps1')

$maintenant = Get-Date
$ok = 0; $ko = 0

function Cas($titre, $texte, $attendu) {
  $script:total++
  $d = Get-HeureReset $texte
  $vu = 'null'
  if ($d) { $vu = $d.ToString('yyyy-MM-dd HH:mm') }
  if ($vu -eq $attendu) {
    Write-Host ("  OK       " + $titre + "  ->  " + $vu)
    $script:ok++
  } else {
    Write-Host ("  ECHEC    " + $titre + "  ->  " + $vu + "   (attendu " + $attendu + ")")
    $script:ko++
  }
}

Write-Host "epreuve-reset.ps1 - les 4 formes reelles du journal, et les cas limites"
Write-Host ("reference : " + $maintenant.ToString('yyyy-MM-dd HH:mm') + "`n")

# --- 1. Les quatre formes REELLES, relevees dans journal.log ------------------
$anneeCourante = $maintenant.Year
Cas "hebdo date  << resets Aug 11, 1am >>" `
    "You've hit your weekly limit . resets Aug 11, 1am (Europe/Paris)" `
    ((Get-Date -Year $anneeCourante -Month 8 -Day 11 -Hour 1 -Minute 0).ToString('yyyy-MM-dd HH:mm'))

$attendu1am = (Get-Date).Date.AddHours(1)
if ($attendu1am -le $maintenant) { $attendu1am = $attendu1am.AddDays(1) }
Cas "hebdo heure << resets 1am >>" `
    "You've hit your weekly limit . resets 1am (Europe/Paris)" `
    $attendu1am.ToString('yyyy-MM-dd HH:mm')

$attendu1430 = (Get-Date).Date.AddHours(14).AddMinutes(30)
if ($attendu1430 -le $maintenant) { $attendu1430 = $attendu1430.AddDays(1) }
Cas "session      << resets 2:30pm >>" `
    "You've hit your session limit . resets 2:30pm (Europe/Paris)" `
    $attendu1430.ToString('yyyy-MM-dd HH:mm')

$attendu5am = (Get-Date).Date.AddHours(5)
if ($attendu5am -le $maintenant) { $attendu5am = $attendu5am.AddDays(1) }
Cas "session      << resets 5am >>" `
    "You've hit your session limit . resets 5am (Europe/Paris)" `
    $attendu5am.ToString('yyyy-MM-dd HH:mm')

# --- 2. Les cas limites de la conversion 12 h --------------------------------
Cas "minuit       << resets 12am >>" "resets 12am (Europe/Paris)" `
    $(if ((Get-Date).Date -le $maintenant) { (Get-Date).Date.AddDays(1).ToString('yyyy-MM-dd HH:mm') } else { (Get-Date).Date.ToString('yyyy-MM-dd HH:mm') })
Cas "midi date    << resets Dec 3, 12pm >>" "resets Dec 3, 12pm (Europe/Paris)" `
    ((Get-Date -Year $anneeCourante -Month 12 -Day 3 -Hour 12 -Minute 0).ToString('yyyy-MM-dd HH:mm'))
Cas "date+minutes << resets Sep 1, 11:50pm >>" "resets Sep 1, 11:50pm (Europe/Paris)" `
    ((Get-Date -Year $anneeCourante -Month 9 -Day 1 -Hour 23 -Minute 50).ToString('yyyy-MM-dd HH:mm'))
Cas "mois entier  << resets August 11, 1am >>" "resets August 11, 1am" `
    ((Get-Date -Year $anneeCourante -Month 8 -Day 11 -Hour 1 -Minute 0).ToString('yyyy-MM-dd HH:mm'))
Cas "rien a lire  (message sans heure)" "You've hit your weekly limit" "null"
Cas "texte vide" "" "null"

# --- 3. LE DEFAUT DU POINT D1, mesure : le texte ne peut pas dire le JOUR ------
Write-Host "`n--- la decision hebdomadaire : l'API d'abord, le texte en repli ---"
$script:total++
$proj = Split-Path -Parent $PSScriptRoot
$texteSansDate = "You've hit your weekly limit . resets 1am (Europe/Paris)"
$parTexte = Get-HeureReset $texteSansDate
$parApi = Get-ResetHebdoApi $proj
$decision = Resolve-ResetHebdo $proj $texteSansDate

if (-not $parApi) {
  Write-Host "  NON MESURE  l'API n'a rien rendu (jeton, reseau) : la comparaison ne peut pas se faire"
  Write-Host ("              le texte seul aurait dit : " + $parTexte.ToString('yyyy-MM-dd HH:mm'))
  if ($decision.Source -eq 'texte') { Write-Host "  OK          le repli sur le texte a bien joue"; $script:ok++ }
  else { Write-Host "  ECHEC       aucune source, alors que le texte etait lisible"; $script:ko++ }
} else {
  $ecart = [math]::Round(($parApi - $parTexte).TotalHours, 1)
  Write-Host ("  le texte dit  : " + $parTexte.ToString('yyyy-MM-dd HH:mm'))
  Write-Host ("  l'API dit     : " + $parApi.ToString('yyyy-MM-dd HH:mm') + "   (ecart " + $ecart + " h)")
  Write-Host ("  decision      : " + $decision.Quand.ToString('yyyy-MM-dd HH:mm') + "  (source " + $decision.Source + ")")
  if ($decision.Source -eq 'api' -and $decision.Quand -eq $parApi) {
    Write-Host "  OK          la decision suit l'API, pas le texte"
    $script:ok++
  } else {
    Write-Host "  ECHEC       la decision ne suit pas l'API"
    $script:ko++
  }
}

# --- 3 bis. LA GARDE DU POINT D2 : une reprise passee ne differe rien ---------
Write-Host "`n--- une heure de reprise deja passee (point D2) ---"
function CasReprise($titre, $quand, $marge, $doitCorriger, $attenduPlancher) {
  $r = Get-RepriseSure $quand $marge
  $futur = $r.Quand -gt (Get-Date)
  $bon = ($r.Corrige -eq $doitCorriger) -and $futur
  if ($bon -and $attenduPlancher) { $bon = [math]::Abs(((Get-Date).AddMinutes($marge) - $r.Quand).TotalSeconds) -lt 5 }
  if ($bon) { Write-Host ("  OK       " + $titre + "  ->  " + $r.Quand.ToString('yyyy-MM-dd HH:mm') + "  (corrige=" + $r.Corrige + ")"); $script:ok++ }
  else { Write-Host ("  ECHEC    " + $titre + "  ->  " + $r.Quand + "  corrige=" + $r.Corrige + " futur=" + $futur); $script:ko++ }
}
CasReprise "reprise d'hier"            (Get-Date).AddDays(-1)      10 $true  $true
CasReprise "reprise il y a 30 s"       (Get-Date).AddSeconds(-30)  10 $true  $true
CasReprise "reprise dans 1 min < marge 10" (Get-Date).AddMinutes(1) 10 $true  $true
CasReprise "reprise nulle"             $null                       10 $true  $true
CasReprise "reprise dans 4 jours"      (Get-Date).AddDays(4)       10 $false $false
CasReprise "reprise dans 20 min"       (Get-Date).AddMinutes(20)   10 $false $false

# --- 3 ter. LA PAUSE RELUE PAR LA SURVEILLANCE (point D3) ---------------------
# Les fichiers sont fabriques dans un dossier temporaire : la vraie tache planifiee
# n'est JAMAIS touchee par cette epreuve.
Write-Host "`n--- ce que la surveillance lit de la pause du wrapper (point D3) ---"
$tmpDir = Join-Path $env:TEMP ('epreuve-pause-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null
function CasPause($titre, $limite, $pauseTxt, $attenduActif, $attenduQuand) {
  Get-ChildItem $tmpDir -File | Remove-Item -Force -ErrorAction SilentlyContinue
  if ($limite) { Set-Content -Path (Join-Path $tmpDir 'limite-hebdo.txt') -Value $limite -Encoding utf8 }
  if ($pauseTxt) { Set-Content -Path (Join-Path $tmpDir 'pause-hebdo.txt') -Value $pauseTxt -Encoding utf8 }
  $p = Get-PauseEnCours $tmpDir
  $vuQuand = 'null'
  if ($p.Quand) { $vuQuand = $p.Quand.ToString('yyyy-MM-dd HH:mm') }
  $bon = ($p.Actif -eq $attenduActif)
  if ($bon -and $attenduQuand) { $bon = ($vuQuand -eq $attenduQuand) }
  if ($bon) { Write-Host ("  OK       " + $titre + "  ->  actif=" + $p.Actif + " quand=" + $vuQuand + " (" + $p.Source + ")"); $script:ok++ }
  else { Write-Host ("  ECHEC    " + $titre + "  ->  actif=" + $p.Actif + " quand=" + $vuQuand + "   (attendu actif=" + $attenduActif + " quand=" + $attenduQuand + ")"); $script:ko++ }
}
$futur = (Get-Date).AddDays(4).ToString('yyyy-MM-dd HH:mm')
$loin  = (Get-Date).AddDays(6).ToString('yyyy-MM-dd HH:mm')
CasPause "limite-hebdo a une date FUTURE"  $futur $null $true  $futur
CasPause "limite-hebdo a une date PASSEE"  '2026-01-02 01:00' $null $false '2026-01-02 01:00'
CasPause "pause-hebdo : on prend la REPRISE, pas l'horodatage" `
         $null ("99 % le 2026-01-02 03:04:05 -- reprise " + $futur) $true $futur
CasPause "les deux fichiers : la reprise la plus lointaine gagne" `
         $futur ("100 % le 2026-01-02 03:04:05 -- reprise " + $loin) $true $loin
CasPause "aucun fichier" $null $null $false $null
Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue

# --- 3 quater. LE VERDICT DE SANTE (point D4) ---------------------------------
# Le defaut : une reparation qui a ECHOUE etait comptee comme une reparation, dans
# le texte du rapport (<< **repare** : reactivation IMPOSSIBLE >>) comme dans le code
# de sortie (0). Les six combinaisons sont jouees.
Write-Host "`n--- le verdict de sante : reparer, ou avoir essaye (point D4) ---"
function CasVerdict($titre, $sain, $reussites, $echecs, $codeAttendu, $etatAttendu) {
  $v = Get-VerdictSante $sain $reussites $echecs
  if ($v.Code -eq $codeAttendu -and $v.Etat -eq $etatAttendu) {
    Write-Host ("  OK       " + $titre + "  ->  code " + $v.Code + " / " + $v.Etat); $script:ok++
  } else {
    Write-Host ("  ECHEC    " + $titre + "  ->  code " + $v.Code + " / " + $v.Etat + "   (attendu " + $codeAttendu + " / " + $etatAttendu + ")"); $script:ko++
  }
}
CasVerdict "tout va bien"                        $true  @()            @()                       0 'SAIN'
CasVerdict "anomalie, reparation reussie"        $false @('reactivee') @()                       0 'ANOMALIE REPAREE'
CasVerdict "anomalie, REPARATION IMPOSSIBLE"     $false @()            @('IMPOSSIBLE : refus')   2 'ANOMALIE NON REPAREE'
CasVerdict "anomalie, rien de tente"             $false @()            @()                       2 'ANOMALIE NON REPAREE'
CasVerdict "une reussie ET une echouee"          $false @('reactivee') @('trigger KO')           2 'ANOMALIE PARTIELLEMENT REPAREE'
CasVerdict "sain malgre un echec residuel"       $true  @()            @('vieux message')        0 'SAIN'

# --- 3 quinquies. LE PROMPT REELLEMENT ENVOYE (point D5) ----------------------
# Le MODELE de prompt est extrait du wrapper de production, et assemble par la
# fonction de production : ni l'un ni l'autre n'est recopie ici.
Write-Host "`n--- le prompt assemble, relu avant envoi (point D5) ---"
$proj2 = Split-Path -Parent $PSScriptRoot
$srcWrapper = Get-Content (Join-Path $PSScriptRoot 'autonomie.ps1') -Raw
$mChaine = [regex]::Match($srcWrapper, "(?ms)^\`$CHAINE\s*=\s*@\((.*?)\)\s*$")
$chaine = @([regex]::Matches($mChaine.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value })
$mModele = [regex]::Match($srcWrapper, "(?ms)^\`$promptTravail = @'\r?\n(.*?)\r?\n'@")
if (-not $mModele.Success -or $chaine.Count -eq 0) {
  Write-Host "  ECHEC    le modele de prompt ou la chaine sont introuvables dans autonomie.ps1"; $script:ko++
} else {
  $modele = $mModele.Groups[1].Value
  # le plan courant, calcule comme le wrapper le fait
  $planCourant = $null
  foreach ($n in $chaine) {
    $f = Join-Path $proj2 $n
    if ((Test-Path $f) -and (Select-String -Path $f -Pattern '^- \[ \]' -Quiet)) { $planCourant = $n; break }
  }
  if (-not $planCourant) { $planCourant = $chaine[$chaine.Count - 1] }

  $mesuresSite = Get-MesuresSite $proj2
  $r = Build-PromptTravail $modele $proj2 $chaine $planCourant $mesuresSite
  Write-Host ("  plan courant : " + $planCourant + "  -  prompt : " + $r.Texte.Length + " caracteres  -  alertes : " + @($r.Alertes).Count)
  foreach ($a in $r.Alertes) { Write-Host ("     ! " + $a) }

  $script:ok += 0
  $verifs = @(
    @{ quoi = "aucun jeton @@...@@ ne subsiste"; ok = (-not [regex]::IsMatch($r.Texte, '@@[A-Z_0-9]+@@')) },
    @{ quoi = "le point 1 nomme le plan courant"; ok = ($r.Texte -match ('TON PLAN DE TRAVAIL EST [^\s]*' + [regex]::Escape($planCourant))) },
    @{ quoi = "aucune alerte de relecture"; ok = (@($r.Alertes).Count -eq 0) },
    @{ quoi = "les $($chaine.Count) chantiers sont decrits, chacun une fois"; ok = (($chaine | ForEach-Object { ([regex]::Matches($r.Texte, [regex]::Escape($_))).Count }) -contains 1) },
    @{ quoi = "le plan courant est MARQUE dans la liste"; ok = ($r.Texte -match ([regex]::Escape($planCourant) + '[^\r\n]*TON PLAN CE REVEIL')) },
    @{ quoi = "plus aucune description figee (<< QUATRE CHANTIERS >>)"; ok = ($r.Texte -notmatch 'CHAINE DE QUATRE CHANTIERS') },
    @{ quoi = "les chiffres du site sont MESURES (point D6)"; ok = ($mesuresSite -ne $null -and $mesuresSite.N_COURS -gt 0) },
    @{ quoi = "le prompt annonce le nombre de cours mesure"; ok = ($mesuresSite -and $r.Texte -match ("LE SITE : $($mesuresSite.N_COURS) cours")) },
    @{ quoi = "le prompt annonce le nombre de lecons mesure"; ok = ($mesuresSite -and $r.Texte -match ("$($mesuresSite.N_LECONS) lecons")) },
    @{ quoi = "plus aucun des anciens chiffres ecrits a la main"; ok = ($r.Texte -notmatch '83 cours|1463 lecons|1425 lecons|17 invariants de DONNEES|echantillon de 20 pages') }
  )
  foreach ($v in $verifs) {
    $script:total++
    if ($v.ok) { Write-Host ("  OK       " + $v.quoi); $script:ok++ } else { Write-Host ("  ECHEC    " + $v.quoi); $script:ko++ }
  }

  # L'EPREUVE PAR INJECTION : on retire un jeton du modele, la relecture doit crier.
  $script:total++
  $casse = $modele.Replace('@@PLAN@@', 'CHANTIER-V12.md')
  $r2 = Build-PromptTravail $casse $proj2 $chaine $planCourant $mesuresSite
  $vu = @($r2.Alertes | Where-Object { $_ -match 'point 1 annonce' }).Count -gt 0
  if ($vu) { Write-Host ("  OK       injection : un point 1 qui nomme un AUTRE plan est vu  ->  " + $r2.Alertes[0]); $script:ok++ }
  else { Write-Host "  ECHEC    injection : un point 1 qui nomme un autre plan passe inapercu"; $script:ko++ }

  # Le MOJIBAKE : le prompt en portait SIX (les tirets cadratins du wrapper, lu en
  # ANSI par PowerShell 5.1). Verifie sur le prompt reel, puis injecte.
  $script:total++
  $suiteM = '[' + [char]0x80 + '-' + [char]0xBF + ']'
  $nbMoji = ([regex]::Matches($r.Texte, [string][char]0xC3 + $suiteM + '|' + [string][char]0xE2 + $suiteM)).Count
  if ($nbMoji -eq 0) { Write-Host "  OK       aucune signature de mojibake dans le prompt reel"; $script:ok++ }
  else { Write-Host ("  ECHEC    " + $nbMoji + " signature(s) de mojibake dans le prompt reel"); $script:ko++ }

  $script:total++
  $casseM = $modele + "`nsignature : " + [char]0xE2 + [char]0x82 + [char]0xAC
  $rM = Build-PromptTravail $casseM $proj2 $chaine $planCourant $mesuresSite
  if (@($rM.Alertes | Where-Object { $_ -match 'MOJIBAKE' }).Count -gt 0) {
    Write-Host ("  OK       injection : du mojibake est vu  ->  " + ($rM.Alertes -join ' / ')); $script:ok++
  } else { Write-Host "  ECHEC    injection : du mojibake passe inapercu"; $script:ko++ }

  $script:total++
  $casse2 = $modele + "`nreste : @@INCONNU@@"
  $r3 = Build-PromptTravail $casse2 $proj2 $chaine $planCourant $mesuresSite
  if (@($r3.Alertes | Where-Object { $_ -match 'non substitue' }).Count -gt 0) {
    Write-Host ("  OK       injection : un jeton oublie est vu  ->  " + ($r3.Alertes -join ' / ')); $script:ok++
  } else { Write-Host "  ECHEC    injection : un jeton oublie passe inapercu"; $script:ko++ }
}

# --- 3 sexies. LE DRAPEAU DE FIN DE CHANTIER (point D7) -----------------------
# Le drapeau autorise le wrapper a DESACTIVER la tache : on l'eprouve sur un fichier
# temporaire, jamais sur celui de production.
Write-Host "`n--- le drapeau de fin, date et rattache a un etat (point D7) ---"
$proj3 = Split-Path -Parent $PSScriptRoot
$srcW = Get-Content (Join-Path $PSScriptRoot 'autonomie.ps1') -Raw
$mC3 = [regex]::Match($srcW, "(?ms)^\`$CHAINE\s*=\s*@\((.*?)\)\s*$")
$chaine3 = @([regex]::Matches($mC3.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value })
$tmpOk = Join-Path $env:TEMP ('drapeau-' + [guid]::NewGuid().ToString('N').Substring(0, 8) + '.ok')

function CasDrapeau($titre, $contenu, $attendu) {
  $script:total++
  if ($null -eq $contenu) { Remove-Item $tmpOk -Force -ErrorAction SilentlyContinue }
  else { Set-Content -Path $tmpOk -Value $contenu -Encoding ascii }
  $d = Test-DrapeauFin $tmpOk $proj3 $chaine3
  if ($d.Valide -eq $attendu) { Write-Host ("  OK       " + $titre + "  ->  valide=" + $d.Valide + " (" + $d.Pourquoi + ")"); $script:ok++ }
  else { Write-Host ("  ECHEC    " + $titre + "  ->  valide=" + $d.Valide + " (" + $d.Pourquoi + "), attendu " + $attendu); $script:ko++ }
}

$empActuelle = Get-EmpreinteChaine $proj3 $chaine3
CasDrapeau "aucun drapeau" $null $false
CasDrapeau "drapeau VIDE (ancien format, celui d'avant D7)" "" $false
CasDrapeau "drapeau d'un AUTRE etat (un plan de plus a faire)" `
  ("date=2026-01-02 03:04:05" + [Environment]::NewLine + "empreinte=" + ($empActuelle -replace '/\d+', '/999')) $false
CasDrapeau "drapeau conforme a l'etat courant" `
  ("date=" + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + [Environment]::NewLine + "empreinte=" + $empActuelle) $true

# Ecrit par la fonction de production, il doit se relire lui-meme.
$script:total++
Write-DrapeauFin $tmpOk $proj3 $chaine3
$d = Test-DrapeauFin $tmpOk $proj3 $chaine3
if ($d.Valide) { Write-Host ("  OK       ecrit par Write-DrapeauFin, relu valide (ecrit le " + $d.Ecrit.ToString('yyyy-MM-dd HH:mm') + ")"); $script:ok++ }
else { Write-Host ("  ECHEC    ecrit par Write-DrapeauFin mais relu invalide : " + $d.Pourquoi); $script:ko++ }
Remove-Item $tmpOk -Force -ErrorAction SilentlyContinue

# --- 4. LE BRANCHEMENT, lu dans le wrapper REEL -------------------------------
# Une lib juste dont personne ne se sert ne corrige rien : on verifie sur le
# fichier de production qu'il la charge, qu'il passe par la decision, et que
# l'ancienne implementation n'y dort plus.
Write-Host "`n--- le branchement dans .autonomie/autonomie.ps1 ---"
$wrapper = Get-Content (Join-Path $PSScriptRoot 'autonomie.ps1') -Raw
$controles = @(
  @{ quoi = "il charge lib-reset.ps1";                    motif = "Join-Path \`$dir 'lib-reset\.ps1'"; present = $true },
  @{ quoi = "la branche hebdo passe par Resolve-ResetHebdo"; motif = 'Resolve-ResetHebdo \$proj \$sortie'; present = $true },
  @{ quoi = "il n'appelle plus usage-anthropic.js en direct"; motif = "usage-anthropic\.js'\) reset"; present = $false },
  @{ quoi = "l'ancienne lecture d'heure n'y dort plus";   motif = 'Date\.AddHours\(\$h\)\.AddMinutes\(\$min\)'; present = $false },
  @{ quoi = "les 3 replanifications passent par Get-RepriseSure"; motif = '(?s)Get-RepriseSure.*Get-RepriseSure.*Get-RepriseSure'; present = $true },
  @{ quoi = "le drapeau de fin est juge, pas seulement teste"; motif = 'Test-DrapeauFin \$okFile'; present = $true },
  @{ quoi = "un drapeau perime est SUPPRIME"; motif = 'Remove-Item \$okFile'; present = $true },
  @{ quoi = "le drapeau n'est plus un fichier vide"; motif = 'New-Item -ItemType File -Path \$okFile'; present = $false }
)
# Aucun New-ScheduledTaskTrigger ne doit poser une heure qui n'a pas ete filtree :
# on compte les deux, ils doivent etre en nombre egal.
$sante = Get-Content (Join-Path (Split-Path -Parent $PSScriptRoot) 'tools\sante-autonomie.ps1') -Raw
$controlesSante = @(
  @{ quoi = "sante-autonomie charge lib-reset.ps1";              motif = "Join-Path \`$dir 'lib-reset\.ps1'"; present = $true },
  @{ quoi = "une pause en cours n'est plus un silence anormal";  motif = '-not \$pause\.Actif'; present = $true },
  @{ quoi = "la reparation ne pose plus 2 min quand une pause court"; motif = 'if \(\$pause\.Actif\)'; present = $true },
  @{ quoi = "le rapport dit si une pause est en cours";          motif = 'pause decidee'; present = $true },
  @{ quoi = "les echecs de reparation ont leur propre liste";    motif = '\$echecsRep'; present = $true },
  @{ quoi = "un echec n'est plus annonce comme << repare >>";    motif = 'repare \+= "reactivation IMPOSSIBLE'; present = $false },
  @{ quoi = "le code de sortie suit le verdict";                 motif = 'exit \$verdict\.Code'; present = $true },
  @{ quoi = "l'ancien test sur \$repare.Count a disparu";         motif = '\$repare\.Count -eq 0'; present = $false }
)
foreach ($c in $controlesSante) {
  $script:total++
  $vu = [regex]::IsMatch($sante, $c.motif)
  if ($vu -eq $c.present) { Write-Host ("  OK       " + $c.quoi); $script:ok++ }
  else { Write-Host ("  ECHEC    " + $c.quoi); $script:ko++ }
}

$nbTrigger = ([regex]::Matches($wrapper, 'New-ScheduledTaskTrigger -Once -At')).Count
# On compte les APPELS, pas la definition de repli (<< function Get-RepriseSure >>)
# qui existe pour le cas ou la lib manquerait.
$nbGarde   = ([regex]::Matches($wrapper, '(?<!function )Get-RepriseSure')).Count
$script:total++
if ($nbTrigger -eq $nbGarde -and $nbTrigger -ge 3) {
  Write-Host ("  OK       " + $nbTrigger + " declencheur(s) pose(s), " + $nbGarde + " passage(s) par la garde")
  $script:ok++
} else {
  Write-Host ("  ECHEC    " + $nbTrigger + " declencheur(s) pour seulement " + $nbGarde + " garde(s)")
  $script:ko++
}
foreach ($c in $controles) {
  $vu = [regex]::IsMatch($wrapper, $c.motif)
  if ($vu -eq $c.present) { Write-Host ("  OK       " + $c.quoi); $script:ok++ }
  else { Write-Host ("  ECHEC    " + $c.quoi + "  (motif " + $(if ($vu) { "trouve" } else { "absent" }) + ")"); $script:ko++ }
}

Write-Host ("`n=== " + $ok + " cas conformes, " + $ko + " en echec ===")
if ($ko -gt 0) { exit 1 }
exit 0
