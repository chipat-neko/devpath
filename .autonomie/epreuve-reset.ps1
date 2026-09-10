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
  @{ quoi = "les 3 replanifications passent par Get-RepriseSure"; motif = '(?s)Get-RepriseSure.*Get-RepriseSure.*Get-RepriseSure'; present = $true }
)
# Aucun New-ScheduledTaskTrigger ne doit poser une heure qui n'a pas ete filtree :
# on compte les deux, ils doivent etre en nombre egal.
$nbTrigger = ([regex]::Matches($wrapper, 'New-ScheduledTaskTrigger -Once -At')).Count
$nbGarde   = ([regex]::Matches($wrapper, 'Get-RepriseSure')).Count
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
