# Sante de l'autonomie : diagnostic, alerte, et reparation d'un arret anormal.
#
# POURQUOI CE FICHIER. Le 2026-08-27 a 04:11, le wrapper s'est desactive en journalisant
# CHANTIER TERMINE alors qu'il restait 38 cases (une variable employee pour deux sens).
# Personne ne l'a vu pendant SIX JOURS : rien ne surveillait la coherence entre ce que le
# journal affirme et ce que les plans contiennent. Un arret silencieux ressemble
# exactement a un travail en cours.
#
#   powershell -File tools/sante-autonomie.ps1            diagnostic + ETAT-AUTONOMIE.md
#   powershell -File tools/sante-autonomie.ps1 -Reparer   idem, et reactive si anormal
#
# Un arret VOLONTAIRE (arret.ps1, ou .autonomie/arret-volontaire.txt) n'est jamais repare.

param([switch]$Reparer)

$ErrorActionPreference = 'Continue'
$proj  = 'd:\test-claude'
$dir   = Join-Path $proj '.autonomie'
$log   = Join-Path $dir 'journal.log'
$etat  = Join-Path $proj 'ETAT-AUTONOMIE.md'
$vol   = Join-Path $dir 'arret-volontaire.txt'
$tache = 'Syntaxe-Autonomie'

function Stamp { (Get-Date).ToString('yyyy-MM-dd HH:mm') }

# LA SURVEILLANCE DOIT SAVOIR CE QUE LE WRAPPER A DECIDE (point D3 du chantier V17).
# Sans cette lecture, la reparation horaire defaisait la pause : elle voyait une tache
# arretee ou un long silence, concluait a une panne, et reactivait avec un reveil DANS
# DEUX MINUTES. Les fonctions sont celles du wrapper (.autonomie/lib-reset.ps1) : une
# seule ecriture de la regle, une seule epreuve.
$libReset = Join-Path $dir 'lib-reset.ps1'
if (Test-Path $libReset) { . $libReset }
else {
  function Get-PauseEnCours($d) { return [pscustomobject]@{ Actif = $false; Quand = $null; Source = 'lib-absente' } }
  function Get-RepriseSure($q, $m) { if (-not $m) { $m = 5 }; return [pscustomobject]@{ Quand = (Get-Date).AddMinutes($m); Corrige = $true; Demande = $q } }
  function Get-VerdictSante($s, $r, $e) {
    if ($s) { return [pscustomobject]@{ Code = 0; Etat = 'SAIN'; Reussites = 0; Echecs = 0 } }
    if (@($r).Count -gt 0 -and @($e).Count -eq 0) { return [pscustomobject]@{ Code = 0; Etat = 'ANOMALIE REPAREE'; Reussites = @($r).Count; Echecs = 0 } }
    return [pscustomobject]@{ Code = 2; Etat = 'ANOMALIE NON REPAREE'; Reussites = @($r).Count; Echecs = @($e).Count }
  }
}
$pause = Get-PauseEnCours $dir

# --- ce que les plans contiennent reellement --------------------------------
# LA LISTE DES PLANS EST LUE DANS LE WRAPPER, jamais recopiee ici. Deux erreurs
# successives le 2026-09-03 l'ont impose : d'abord une liste en dur qui s'arretait au
# V15, si bien que le V16 et ses 22 cases etaient invisibles et qu'aucune anomalie
# n'aurait ete signalee ; puis une decouverte par glob, qui ramassait les anciens
# chantiers V4 a V11 que le wrapper ne traite plus -- une case oubliee dans l'un d'eux
# aurait ete presentee comme le plan courant. La seule liste qui compte est $CHAINE
# dans autonomie.ps1 : on la lit la-bas.
$plans = @()
try {
  $wrapper = Get-Content (Join-Path $dir 'autonomie.ps1') -Raw -ErrorAction Stop
  $m = [regex]::Match($wrapper, '(?m)^\$CHAINE\s*=\s*@\((.*?)\)')
  if ($m.Success) {
    $plans = @([regex]::Matches($m.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value })
  }
} catch {}
if ($plans.Count -eq 0) {
  # Le wrapper est illisible : c'est une anomalie en soi, on le dira plus bas.
  $chaineIllisible = $true
  $plans = @(Get-ChildItem -Path $proj -Filter 'CHANTIER-V*.md' -File -ErrorAction SilentlyContinue |
             Sort-Object { [int]([regex]::Match($_.Name, 'V(\d+)').Groups[1].Value) } |
             Select-Object -ExpandProperty Name | Select-Object -Last 1)
} else { $chaineIllisible = $false }

$restant = 0; $detail = @(); $courant = $null
foreach ($p in $plans) {
  $f = Join-Path $proj $p
  if (-not (Test-Path $f)) { continue }
  $faites = (Select-String -Path $f -Pattern '^- \[x\]').Count
  $reste  = (Select-String -Path $f -Pattern '^- \[ \]').Count
  $restant += $reste
  $detail += [pscustomobject]@{ plan = $p; faites = $faites; total = $faites + $reste; reste = $reste }
  if ($reste -gt 0 -and -not $courant) { $courant = $p }
}

# --- etat reel de la tache et de la derniere passe ---------------------------
# ATTENTION : $t.State vaut Running tant qu'une instance tourne, MEME si la tache est
# desactivee -- verifie le 2026-09-02. Se fier a State rendait ce controle aveugle au
# cas le plus grave, celui du 27 aout : une passe qui travaille alors que la tache est
# deja coupee, donc plus rien apres elle. La verite est dans Settings.Enabled.
$etatTache = 'INTROUVABLE'; $prochain = $null; $activee = $null
try {
  $t = Get-ScheduledTask -TaskName $tache -ErrorAction Stop
  $etatTache = [string]$t.State
  $activee = [bool]$t.Settings.Enabled
  $prochain = ($t | Get-ScheduledTaskInfo).NextRunTime
} catch {}
$enCours = @(Get-Process claude -ErrorAction SilentlyContinue |
             Where-Object { $_.Path -eq 'C:\Users\chipat\.local\bin\claude.exe' }).Count

$dernier = $null; $derniereLigne = ''
try {
  $l = Select-String -Path $log -Pattern '^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]' | Select-Object -Last 1
  if ($l) {
    $derniereLigne = $l.Line
    $dernier = [datetime]::ParseExact($l.Matches[0].Groups[1].Value, 'yyyy-MM-dd HH:mm:ss', $null)
  }
} catch {}
$silenceH = if ($dernier) { [math]::Round(((Get-Date) - $dernier).TotalHours, 1) } else { 999 }

# --- usage de l'abonnement ---------------------------------------------------
$pct = -1
try { $pct = [int](& node (Join-Path $proj 'tools\usage-anthropic.js') pct 2>$null | Select-Object -Last 1) } catch {}

# --- diagnostic --------------------------------------------------------------
$volontaire = Test-Path $vol
$anomalies = @()
if (-not $volontaire) {
  if ($activee -eq $false -and $restant -gt 0) {
    $anomalies += "la tache est DESACTIVEE alors qu il reste $restant cases a faire"
    if ($enCours -gt 0) { $anomalies += 'une passe travaille encore, mais rien ne repartira apres elle' }
  }
  # Le silence n'est une anomalie que si RIEN n'est prevu. Sans cette condition, une
  # relance declenche un faux positif immediat : la tache vient d'etre reactivee, son
  # reveil est dans trois minutes, et la derniere trace date d'avant l'arret -- constate
  # le 2026-09-05. Un controle qui crie apres une action normale finit par etre ignore.
  $reveilProche = ($prochain -ne $null -and $prochain -le (Get-Date).AddHours(1))
  # UNE PAUSE DECIDEE PAR LE WRAPPER N'EST PAS UN SILENCE ANORMAL (point D3). Une limite
  # hebdomadaire peut faire attendre quatre jours (mesure du point D1) : sans cette
  # condition, la surveillance criait a la panne toutes les heures pendant ce temps.
  if ($activee -eq $true -and $enCours -eq 0 -and $silenceH -ge 4 -and -not $reveilProche -and -not $pause.Actif) {
    $anomalies += "aucune trace depuis $silenceH h alors que la tache est active et qu aucun reveil n est proche"
  }
  if ($etatTache -eq 'INTROUVABLE') { $anomalies += 'la tache planifiee a disparu' }
  if ($chaineIllisible) { $anomalies += 'la liste $CHAINE est illisible dans autonomie.ps1 : le controle travaille a l aveugle' }
}
$sain = ($anomalies.Count -eq 0)

# --- reparation --------------------------------------------------------------
# DEUX LISTES, PAS UNE (point D4) : ce qui a REELLEMENT ete repare, et ce qui a
# ECHOUE. L'ancienne version empilait les deux, ecrivait << **repare** : reactivation
# IMPOSSIBLE >> et sortait en 0 -- une reparation ratee comptait comme une reparation.
$repare = @()
$echecsRep = @()
if ($Reparer -and -not $sain -and -not $volontaire) {
  if ($activee -eq $false -and $restant -gt 0) {
    try {
      # LA REPARATION NE DEFAIT PLUS LA PAUSE (point D3). Elle reactivait toujours avec
      # un reveil dans 2 minutes, y compris quand le wrapper venait de decider d'attendre
      # la remise a zero du quota : le reveil repartait pour se faire refuser aussitot, et
      # le cycle recommencait toutes les heures. Quand une pause est en cours, on
      # reactive quand meme -- une tache desactivee ne repart jamais seule -- mais on pose
      # le reveil A L'HEURE DE REPRISE.
      if ($pause.Actif) {
        $quandRep = (Get-RepriseSure $pause.Quand.AddMinutes(10) 10).Quand
        $motifRep = "reveil pose a la reprise annoncee ($($quandRep.ToString('yyyy-MM-dd HH:mm')), $($pause.Source))"
      } else {
        $quandRep = (Get-Date).AddMinutes(2)
        $motifRep = 'reveil dans 2 min'
      }
      $trig = New-ScheduledTaskTrigger -Once -At $quandRep -RepetitionInterval (New-TimeSpan -Hours 2)
      Set-ScheduledTask -TaskName $tache -Trigger $trig -ErrorAction Stop | Out-Null
      Enable-ScheduledTask -TaskName $tache -ErrorAction Stop | Out-Null
      $repare += "tache reactivee, $motifRep"
      $activee = $true
      try { Add-Content $log "[$(Stamp):00] ===== REPARATION : tache reactivee ($restant cases restantes, arret non demande) -- $motifRep. =====" -Encoding utf8 } catch {}
      $etatTache = 'Ready'
    } catch {
      $echecsRep += "reactivation IMPOSSIBLE : $_"
      try { Add-Content $log "[$(Stamp):00] ===== REPARATION IMPOSSIBLE : $_ =====" -Encoding utf8 } catch {}
    }
  }
}

# --- le rapport, ecrit la ou Noah peut le voir de son telephone --------------
$lignes = @()
$lignes += '# Etat de l''autonomie'
$lignes += ''
$lignes += "Releve du **$(Stamp)**. Ce fichier est reecrit a chaque controle : s'il est vieux, c'est que le controle ne tourne plus."
$lignes += ''
$verdict = Get-VerdictSante $sain $repare $echecsRep
$lignes += '## ' + $verdict.Etat
$lignes += ''
foreach ($a in $anomalies) { $lignes += "- $a" }
foreach ($r in $repare)    { $lignes += "- **repare** : $r" }
foreach ($e in $echecsRep) { $lignes += "- **NON REPARE** : $e" }
if ($volontaire) { $lignes += '- arret VOLONTAIRE en place (.autonomie/arret-volontaire.txt) : aucune reparation.' }
if ($sain -and -not $volontaire) { $lignes += 'Rien a signaler.' }
$lignes += ''
$lignes += '| | |'
$lignes += '|---|---|'
$lignes += "| tache | $(if ($activee -eq $false) { 'DESACTIVEE' } elseif ($activee) { 'active' } else { $etatTache }) |"
$lignes += "| passe en cours | $(if ($enCours -gt 0) { 'oui' } else { 'non' }) |"
$lignes += "| prochain reveil | $(if ($prochain) { $prochain } else { 'aucun' }) |"
$lignes += "| derniere trace | $(if ($dernier) { $dernier.ToString('yyyy-MM-dd HH:mm') + "  (il y a $silenceH h)" } else { 'aucune' }) |"
$lignes += "| usage hebdomadaire | $(if ($pct -ge 0) { "$pct %" } else { 'illisible' }) |"
# Dire qu'une pause est en cours evite de lire un silence comme une panne (point D3).
$lignes += "| pause decidee | $(if ($pause.Actif) { 'OUI, reprise ' + $pause.Quand.ToString('yyyy-MM-dd HH:mm') + ' (' + $pause.Source + ')' } else { 'aucune' }) |"
$lignes += "| cases restantes | **$restant** |"
$lignes += "| plan courant | $(if ($courant) { $courant } else { 'aucun -- tous les plans sont coches' }) |"
$lignes += ''
$lignes += '| chantier | avancement | reste |'
$lignes += '|---|---:|---:|'
foreach ($d in $detail) { $lignes += "| $($d.plan) | $($d.faites)/$($d.total) | $(if ($d.reste -eq 0) { 'termine' } else { $d.reste }) |" }
$lignes += ''
$lignes += ('Derniere ligne du journal : ' + [char]96 + $derniereLigne + [char]96)
Set-Content -Path $etat -Value ($lignes -join "`r`n") -Encoding utf8

# --- sortie console ----------------------------------------------------------
if ($volontaire) { Write-Host "  ARRET VOLONTAIRE -- $restant cases restantes, aucune reparation (retirer .autonomie/arret-volontaire.txt pour reprendre)" -ForegroundColor Yellow }
elseif ($sain) { Write-Host "  SAIN -- $restant cases restantes, tache $(if ($activee) { 'active' } else { $etatTache })" }
else {
  Write-Host ("  " + $verdict.Etat + " :") -ForegroundColor Red
  foreach ($a in $anomalies) { Write-Host "    - $a" -ForegroundColor Red }
  foreach ($r in $repare)    { Write-Host "    - repare : $r" -ForegroundColor Green }
  foreach ($e in $echecsRep) { Write-Host "    - NON REPARE : $e" -ForegroundColor Red }
}
# Le code de sortie suit le MEME verdict que le rapport (point D4) : une reparation
# qui a echoue ne peut plus rendre 0.
exit $verdict.Code
