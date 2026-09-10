# =============================================================================
# lib-reset.ps1 - QUAND LE QUOTA SE REMET-IL A ZERO ?
#
# POURQUOI CE FICHIER EXISTE (2026-09-10, chantier V17, point D1)
# --------------------------------------------------------------
# `autonomie.ps1` lisait l'heure de reprise DANS LE TEXTE de claude.exe, et cette
# lecture ne rendait jamais qu'une heure du jour ou du lendemain :
#
#     $d = (Get-Date).Date.AddHours($h) ; if ($d -le (Get-Date)) { $d = $d.AddDays(1) }
#
# C'est exact pour une limite de SESSION (elle repart dans les heures qui suivent).
# C'est FAUX pour une limite HEBDOMADAIRE, qui peut repartir six jours plus tard.
# Mesure du 2026-09-10 : l'API annonce la remise a zero au 2026-09-14 22:59:59 UTC,
# soit QUATRE JOURS ET DEMI plus tard, quand le texte aurait fait replanifier au
# 2026-09-11 01:00. Le wrapper serait donc reparti toutes les deux heures pendant
# quatre jours pour se faire refuser aussitot.
#
# DEUXIEME DEFAUT, TROUVE EN RELISANT LE JOURNAL. Le message hebdomadaire porte
# TRES SOUVENT une date, et l'ancienne expression ne savait pas la lire. Les quatre
# formes reellement rencontrees en 726 reveils (`journal.log`) :
#
#     hit your weekly limit  . resets Aug 11, 1am (Europe/Paris)   <- 73 fois
#     hit your weekly limit  . resets 1am (Europe/Paris)           <-  8 fois
#     hit your session limit . resets 2:30pm (Europe/Paris)        <- 14 fois
#     hit your session limit . resets 5am (Europe/Paris)           <-  6 fois
#
# Sur la premiere - la plus frequente - l'ancienne fonction ne trouvait RIEN et le
# journal notait « heure inconnue ». La date etait pourtant ecrite noir sur blanc.
#
# CE QUE FAIT CE FICHIER : il porte la lecture, en UN seul endroit, pour que
# l'epreuve (.autonomie/epreuve-reset.ps1) mesure la MEME fonction que celle qui
# tourne en production. Deux copies d'une meme regle finissent toujours par diverger.
# =============================================================================

# Lecture de l'heure de reprise annoncee par claude.exe.
#   - forme datee    : « resets Aug 11, 1am » -> le 11 aout a 1 h (annee deduite)
#   - forme sans date: « resets 2:30pm »      -> aujourd'hui, ou demain si l'heure
#                                                est deja passee
# Rend un DateTime local, ou $null si le texte ne dit rien de lisible.
function Get-HeureReset($texte) {
  if (-not $texte) { return $null }

  # 1. La forme DATEE, d'abord : elle est plus precise, et elle contient une heure
  #    qui ferait aussi matcher la forme courte (« Aug 11, 1am » contient « 1am »).
  $m = [regex]::Match($texte,
    'resets\s+([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)',
    'IgnoreCase')
  if ($m.Success) {
    $mois = Get-NumeroDeMois $m.Groups[1].Value
    if ($mois) {
      $jour = [int]$m.Groups[2].Value
      $h = Convert-Heure12 ([int]$m.Groups[3].Value) $m.Groups[5].Value
      $min = 0
      if ($m.Groups[4].Success) { $min = [int]$m.Groups[4].Value }
      $an = (Get-Date).Year
      try { $d = Get-Date -Year $an -Month $mois -Day $jour -Hour $h -Minute $min -Second 0 -Millisecond 0 }
      catch { return $null }   # 31 fevrier et autres impossibilites
      # Pas d'annee dans le message : une date deja passee de plus d'un mois designe
      # l'annee suivante (un « Jan 2 » lu un 28 decembre). Quelques jours de retard,
      # eux, restent du passe : c'est a l'appelant de refuser une reprise passee.
      if ($d -lt (Get-Date).AddMonths(-1)) { $d = $d.AddYears(1) }
      return $d
    }
  }

  # 2. La forme SANS DATE : une heure seule, donc aujourd'hui ou demain.
  $m = [regex]::Match($texte, 'resets\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)', 'IgnoreCase')
  if (-not $m.Success) { return $null }
  $h = Convert-Heure12 ([int]$m.Groups[1].Value) $m.Groups[3].Value
  $min = 0
  if ($m.Groups[2].Success) { $min = [int]$m.Groups[2].Value }
  $d = (Get-Date).Date.AddHours($h).AddMinutes($min)
  if ($d -le (Get-Date)) { $d = $d.AddDays(1) }
  return $d
}

function Convert-Heure12($h, $ampm) {
  $a = ''
  if ($ampm) { $a = $ampm.ToLower() }
  if ($a -eq 'pm' -and $h -ne 12) { return $h + 12 }
  if ($a -eq 'am' -and $h -eq 12) { return 0 }
  return $h
}

function Get-NumeroDeMois($nom) {
  $n = $nom.ToLower()
  $table = @{ jan = 1; feb = 2; mar = 3; apr = 4; may = 5; jun = 6;
              jul = 7; aug = 8; sep = 9; oct = 10; nov = 11; dec = 12 }
  $cle = $n.Substring(0, [Math]::Min(3, $n.Length))
  if ($table.ContainsKey($cle)) { return $table[$cle] }
  return $null
}

# La remise a zero HEBDOMADAIRE, demandee a l'API - la seule source qui connaisse le
# JOUR. `tools/usage-anthropic.js reset` rend une date ISO (et sert un cache disque
# quand l'API refuse, cf. son en-tete). Rend $null si l'information n'est pas
# disponible : une panne reseau ne doit jamais bloquer l'autonomie.
function Get-ResetHebdoApi($proj) {
  try {
    $iso = (& node (Join-Path $proj 'tools\usage-anthropic.js') reset 2>$null | Select-Object -Last 1)
    if ($iso) { return ([datetime]::Parse($iso)).ToLocalTime() }
  } catch {}
  return $null
}

# LA DECISION, pour la limite hebdomadaire : l'API D'ABORD, le texte en repli.
# C'est l'inversion demandee par le point D1 -- le texte ne porte au mieux qu'une
# date sans annee, au pire qu'une heure sans jour.
# Rend un objet : .Quand (DateTime ou $null) et .Source ('api', 'texte', 'aucune').
function Resolve-ResetHebdo($proj, $texte) {
  $q = Get-ResetHebdoApi $proj
  if ($q) { return [pscustomobject]@{ Quand = $q; Source = 'api' } }
  $q = Get-HeureReset $texte
  if ($q) { return [pscustomobject]@{ Quand = $q; Source = 'texte' } }
  return [pscustomobject]@{ Quand = $null; Source = 'aucune' }
}
