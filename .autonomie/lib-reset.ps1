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
# journal notait << heure inconnue >>. La date etait pourtant ecrite noir sur blanc.
#
# CE QUE FAIT CE FICHIER : il porte la lecture, en UN seul endroit, pour que
# l'epreuve (.autonomie/epreuve-reset.ps1) mesure la MEME fonction que celle qui
# tourne en production. Deux copies d'une meme regle finissent toujours par diverger.
# =============================================================================

# Lecture de l'heure de reprise annoncee par claude.exe.
#   - forme datee    : << resets Aug 11, 1am >> -> le 11 aout a 1 h (annee deduite)
#   - forme sans date: << resets 2:30pm >>      -> aujourd'hui, ou demain si l'heure
#                                                est deja passee
# Rend un DateTime local, ou $null si le texte ne dit rien de lisible.
function Get-HeureReset($texte) {
  if (-not $texte) { return $null }

  # 1. La forme DATEE, d'abord : elle est plus precise, et elle contient une heure
  #    qui ferait aussi matcher la forme courte (<< Aug 11, 1am >> contient << 1am >>).
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
      # l'annee suivante (un << Jan 2 >> lu un 28 decembre). Quelques jours de retard,
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

# UNE HEURE DE REPRISE QUI EST DEJA PASSEE NE DIFFERE PLUS RIEN (point D2).
# Les trois endroits qui replanifient la tache posent un declencheur << -Once -At
# $quand >>. Si $quand est dans le passe -- cache d'usage perime, message lu apres
# coup, horloge decalee, ou simplement une passe qui a dure plus longtemps que le
# delai calcule -- le declencheur ne reporte plus rien : la tache repart aussitot,
# c'est-a-dire exactement ce que la pause voulait empecher. On garantit donc une
# marge minimale, et on DIT quand on a du corriger : une correction silencieuse
# rendrait le journal faux sur le point qu'on cherchait justement a comprendre.
#
# Rend un objet : .Quand (DateTime, toujours au moins maintenant + marge),
#                 .Corrige ($true si la date demandee etait passee ou trop proche),
#                 .Demande (la date d'origine, pour le journal).
function Get-RepriseSure($quand, $margeMinutes) {
  if (-not $margeMinutes) { $margeMinutes = 5 }
  $plancher = (Get-Date).AddMinutes($margeMinutes)
  if (-not $quand) { return [pscustomobject]@{ Quand = $plancher; Corrige = $true; Demande = $null } }
  if ($quand -gt $plancher) { return [pscustomobject]@{ Quand = $quand; Corrige = $false; Demande = $quand } }
  return [pscustomobject]@{ Quand = $plancher; Corrige = $true; Demande = $quand }
}

# LA PAUSE DECIDEE PAR LE WRAPPER, RELUE PAR LA SURVEILLANCE (point D3).
# Le wrapper laisse deux traces quand il decide d'attendre : limite-hebdo.txt (limite
# atteinte) et pause-hebdo.txt (verrou de budget). tools/sante-autonomie.ps1 ne les
# lisait pas : toutes les heures, il voyait une tache desactivee ou un long silence,
# concluait a une panne, et reactivait avec un reveil DANS DEUX MINUTES -- defaisant
# la pause que le wrapper venait de decider, pour aller se faire refuser aussitot.
# Les deux mecanismes doivent se parler ; cette fonction est ce qu'ils se disent.
#
# Rend : .Actif ($true si une reprise annoncee est encore devant nous), .Quand, .Source.
function Get-PauseEnCours($dir) {
  $meilleure = $null; $source = ''
  foreach ($f in @('limite-hebdo.txt', 'pause-hebdo.txt')) {
    $p = Join-Path $dir $f
    if (-not (Test-Path $p)) { continue }
    try {
      # Ces fichiers sont ecrits avec Set-Content -Encoding utf8, donc AVEC un BOM
      # sous PowerShell 5.1 : sans ce nettoyage, la date ne se relit pas.
      $txt = (Get-Content $p -Raw -ErrorAction Stop) -replace ('^' + [char]0xFEFF), ''
    } catch { continue }
    # limite-hebdo.txt : << 2026-09-14 22:59 >>.
    # pause-hebdo.txt  : << 99 % le <horodatage> -- reprise 2026-09-14 22:59 >>.
    # On prend la DERNIERE date du fichier : dans les deux formes, c'est la reprise.
    $dates = [regex]::Matches($txt, '\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}')
    if ($dates.Count -eq 0) { continue }
    $d = $null
    try { $d = [datetime]::Parse(($dates[$dates.Count - 1].Value -replace 'T', ' ')) } catch { continue }
    if (-not $meilleure -or $d -gt $meilleure) { $meilleure = $d; $source = $f }
  }
  if ($meilleure -and $meilleure -gt (Get-Date)) {
    return [pscustomobject]@{ Actif = $true; Quand = $meilleure; Source = $source }
  }
  return [pscustomobject]@{ Actif = $false; Quand = $meilleure; Source = $source }
}

# UN RAPPORT NE DOIT PAS SE CONTREDIRE DANS SA PROPRE PHRASE (point D4).
# `sante-autonomie.ps1` empilait tout dans une seule liste `$repare` : quand la
# reactivation echouait, il ecrivait << **repare** : reactivation IMPOSSIBLE >> -- et,
# pire, son code de sortie devenait 0, parce qu'il testait << $repare.Count -eq 0 >>.
# Une reparation qui a echoue etait donc comptee comme une reparation. C'est le meme
# defaut qu'au point A5 : confondre << je n'ai pas pu >> avec << c'est bon >>.
#
# Rend : .Code (0 = rien a signaler ou anomalie REPAREE, 2 = anomalie NON reparee),
#        .Etat (libelle), .Reussites, .Echecs.
function Get-VerdictSante($sain, $reussites, $echecs) {
  $nR = 0; $nE = 0
  if ($reussites) { $nR = @($reussites).Count }
  if ($echecs) { $nE = @($echecs).Count }
  if ($sain) { return [pscustomobject]@{ Code = 0; Etat = 'SAIN'; Reussites = $nR; Echecs = $nE } }
  if ($nR -gt 0 -and $nE -eq 0) { return [pscustomobject]@{ Code = 0; Etat = 'ANOMALIE REPAREE'; Reussites = $nR; Echecs = $nE } }
  if ($nR -gt 0) { return [pscustomobject]@{ Code = 2; Etat = 'ANOMALIE PARTIELLEMENT REPAREE'; Reussites = $nR; Echecs = $nE } }
  return [pscustomobject]@{ Code = 2; Etat = 'ANOMALIE NON REPAREE'; Reussites = $nR; Echecs = $nE }
}

# LE PROMPT ENVOYE AU MODELE, ASSEMBLE ET RELU (point D5).
# Le wrapper substituait le plan courant par un simple .Replace('CHANTIER-V12.md', ...)
# sur tout le prompt : la phrase qui DECRIVAIT le sujet du V12 etait reecrite elle
# aussi, si bien que le modele recevait << CHANTIER-V17.md (les 42 points d'un
# inventaire independant...) >> -- la description d'un autre chantier -- puis, plus
# bas, une seconde annonce du meme plan. Deux descriptions, dont une fausse.
#
# Ici : des JETONS, qui ne peuvent pas se confondre avec du texte utile, et une
# RELECTURE. Un prompt est le seul intrant du modele : une substitution ratee ne casse
# rien de visible, elle rend seulement la consigne fausse, et personne ne le voit.

# La chaine se decrit ELLE-MEME : chaque plan porte son titre en premiere ligne et son
# avancement dans ses cases. Rien n'est recopie, donc rien ne se perime.
function Get-DescriptionChaine($proj, $chaine, $planCourant) {
  $items = @(); $n = 0
  foreach ($nom in $chaine) {
    $n++
    $chemin = Join-Path $proj $nom
    if (-not (Test-Path $chemin)) { $items += "$n. $nom (ABSENT du disque)"; continue }
    $titre = ''
    # -Encoding UTF8 OBLIGATOIRE : les plans sont en UTF-8 SANS BOM, et PowerShell 5.1
    # les lirait sinon en ANSI (1252). Mesure du 2026-09-10 : le titre partait alors
# dans le prompt sous la forme << Chantier V13 a-EUR-" le contenu qui manque >>.
    try { $titre = ((Get-Content $chemin -TotalCount 1 -Encoding UTF8 -ErrorAction Stop) -replace '^#\s*', '').Trim() } catch {}
    $faites = 0; $reste = 0
    try {
      $faites = (Select-String -Path $chemin -Pattern '^- \[x\]').Count
      $reste = (Select-String -Path $chemin -Pattern '^- \[ \]').Count
    } catch {}
    $etat = if ($reste -eq 0) { 'termine' } else { "$faites/$($faites + $reste) points, $reste a faire" }
    $marque = if ($nom -eq $planCourant) { '  <<< TON PLAN CE REVEIL' } else { '' }
    $items += "$n. $nom - $titre ($etat)$marque"
  }
  $txt = "TU TRAVAILLES SUR UNE CHAINE DE $(@($chaine).Count) CHANTIERS, traites dans l'ordre. "
  $txt += "Le wrapper te donne automatiquement le premier plan qui a encore une case a cocher : tu n'as pas a choisir. "
  $txt += "Etat mesure au lancement de ce reveil :" + [Environment]::NewLine
  $txt += ($items -join [Environment]::NewLine)
  return $txt
}

# LE VERROU ANTI-CHEVAUCHEMENT, ET LE PID RECYCLE (point D10).
# Le verrou porte le PID du wrapper : on saute le reveil tant que CE processus vit.
# Mais Windows RECYCLE les PID. Si le numero du wrapper precedent a ete repris par un
# autre powershell -- une console ouverte, un script de Noah, un outil du depot -- le
# controle voit << un powershell vivant >> et saute les reveils jusqu'au plafond de
# 6 h. L'autonomie se tait alors sans qu'aucune anomalie ne soit levee : le journal
# dit seulement << SKIP : un reveil precedent tourne encore >>, ce qui est faux.
#
# LA PARADE : le verrou porte AUSSI l'heure de demarrage du processus. Deux processus
# peuvent partager un PID ; ils ne peuvent pas avoir demarre a la meme seconde ET
# porter le meme numero. Format :
#     pid=4760
#     demarre=2026-09-10 06:24:39
# Un verrou de l'ANCIEN format (un nombre seul) reste accepte avec l'ancienne regle,
# sinon le premier reveil apres cette correction croirait le verrou mort et
# demarrerait PAR-DESSUS la passe en cours -- exactement ce qu'il faut eviter.
function Write-Verrou($lock, $processId) {
  if (-not $processId) { $processId = $PID }
  $demarre = ''
  try { $demarre = (Get-Process -Id $processId -ErrorAction Stop).StartTime.ToString('yyyy-MM-dd HH:mm:ss') } catch {}
  $lignes = @("pid=$processId")
  if ($demarre) { $lignes += "demarre=$demarre" }
  Set-Content -Path $lock -Value ($lignes -join [Environment]::NewLine) -Encoding ascii
}

# Rend .Vivant, .Pourquoi, .Pid, .AgeMinutes.
function Test-VerrouVivant($lock) {
  $res = [pscustomobject]@{ Vivant = $false; Pourquoi = 'aucun verrou'; Pid = 0; AgeMinutes = 0 }
  if (-not (Test-Path $lock)) { return $res }
  try { $res.AgeMinutes = [int]((Get-Date) - (Get-Item $lock).LastWriteTime).TotalMinutes } catch {}
  $contenu = ''
  try { $contenu = (Get-Content $lock -Raw -ErrorAction Stop).Trim() } catch { $res.Pourquoi = 'verrou illisible'; return $res }
  if (-not $contenu) { $res.Pourquoi = 'verrou vide'; return $res }

  $mPid = [regex]::Match($contenu, 'pid=(\d+)')
  $mDem = [regex]::Match($contenu, 'demarre=([0-9\- :]+)')
  if (-not $mPid.Success) {
    # ANCIEN FORMAT : un nombre seul, sans heure de demarrage.
    if ($contenu -match '^\d+$') {
      $res.Pid = [int]$contenu
      $p = Get-Process -Id $res.Pid -ErrorAction SilentlyContinue
      if ($p -and $p.ProcessName -like 'powershell*') {
        $res.Vivant = $true
        $res.Pourquoi = 'ancien format : PID vivant, heure de demarrage inconnue'
      } else { $res.Pourquoi = 'ancien format : PID mort' }
      return $res
    }
    $res.Pourquoi = 'verrou de forme inconnue'
    return $res
  }

  $res.Pid = [int]$mPid.Groups[1].Value
  $p = Get-Process -Id $res.Pid -ErrorAction SilentlyContinue
  if (-not $p) { $res.Pourquoi = "le processus $($res.Pid) n'existe plus"; return $res }
  if ($p.ProcessName -notlike 'powershell*') {
    $res.Pourquoi = "le PID $($res.Pid) est maintenant tenu par $($p.ProcessName) : numero RECYCLE"
    return $res
  }
  if ($mDem.Success) {
    $attendu = $mDem.Groups[1].Value.Trim()
    $reel = ''
    try { $reel = $p.StartTime.ToString('yyyy-MM-dd HH:mm:ss') } catch {}
    if (-not $reel) {
      $res.Vivant = $true
      $res.Pourquoi = "heure de demarrage illisible pour $($res.Pid) : on suppose la passe vivante"
      return $res
    }
    if ($reel -ne $attendu) {
      $res.Pourquoi = "PID $($res.Pid) RECYCLE : demarre a $reel, le verrou attendait $attendu"
      return $res
    }
  }
  $res.Vivant = $true
  $res.Pourquoi = "la passe $($res.Pid) tourne encore"
  return $res
}

# LA ROTATION DU JOURNAL (point D9).
# `journal.log` recevait l'INTEGRALITE de la sortie du modele et n'avait aucune
# rotation : 622 847 octets, 7 310 lignes, 762 reveils au 2026-09-10, depuis le
# 2026-07-01. Il grossit d'environ 9 Ko par jour et rien ne l'arrete.
#
# ⚠ DEUX CONTRAINTES QUI DICTENT LA FORME DE CETTE FONCTION.
# 1. `tools/sante-autonomie.ps1` cherche la DERNIERE ligne horodatee du journal pour
#    savoir depuis quand l'autonomie se tait. Une rotation qui repartirait d'un fichier
#    VIDE lui ferait lire << aucune trace >>, donc $silenceH = 999, donc une ANOMALIE
#    inventee -- et, avec -Reparer, une reactivation qui ne repare rien. On conserve
#    donc la FIN du journal dans le fichier courant.
# 2. Sous Windows, un fichier ouvert ailleurs (le piege du `tail -f`, mesure le
#    2026-08-21) ne peut etre ni renomme ni reecrit. Tout echec est donc AVALE : la
#    rotation est un confort, jamais une condition pour travailler.
#
# Rend : .Fait, .Pourquoi, .Archive, .LignesGardees, .TailleAvant.
function Invoke-RotationJournal($log, $tailleMaxOctets, $lignesGardees, $archivesMax) {
  if (-not $tailleMaxOctets) { $tailleMaxOctets = 1MB }
  if (-not $lignesGardees) { $lignesGardees = 400 }
  if (-not $archivesMax) { $archivesMax = 8 }
  $res = [pscustomobject]@{ Fait = $false; Pourquoi = ''; Archive = ''; LignesGardees = 0; TailleAvant = 0 }
  if (-not (Test-Path $log)) { $res.Pourquoi = 'aucun journal'; return $res }
  try { $res.TailleAvant = (Get-Item $log).Length } catch { $res.Pourquoi = 'journal illisible'; return $res }
  if ($res.TailleAvant -lt $tailleMaxOctets) { $res.Pourquoi = 'sous le seuil'; return $res }

  $dossier = Split-Path $log -Parent
  $base = [System.IO.Path]::GetFileNameWithoutExtension($log)
  $archive = Join-Path $dossier ($base + '-' + (Get-Date).ToString('yyyyMMdd-HHmmss') + '.log')
  try {
    $contenu = Get-Content $log -ErrorAction Stop
    $fin = $contenu | Select-Object -Last $lignesGardees
    Copy-Item -Path $log -Destination $archive -ErrorAction Stop
    $entete = '[' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') + '] ===== ROTATION : ' +
              $contenu.Count + ' lignes (' + [math]::Round($res.TailleAvant / 1KB) + ' Ko) archivees dans ' +
              (Split-Path $archive -Leaf) + ', les ' + (@($fin).Count) + ' dernieres restent ici. ====='
    Set-Content -Path $log -Value (@($entete) + @($fin)) -Encoding utf8 -ErrorAction Stop
    $res.Fait = $true
    $res.Archive = $archive
    $res.LignesGardees = @($fin).Count
    $res.Pourquoi = 'rotation effectuee'
  } catch {
    $res.Pourquoi = "rotation impossible ($_)"
    return $res
  }
  # Purge des archives les plus anciennes : le but est de ne pas grossir sans fin.
  try {
    Get-ChildItem -Path $dossier -Filter ($base + '-*.log') -File |
      Sort-Object LastWriteTime -Descending |
      Select-Object -Skip $archivesMax |
      Remove-Item -Force -ErrorAction SilentlyContinue
  } catch {}
  return $res
}

# LE DRAPEAU DE FIN DE CHANTIER, DATE ET RATTACHE A UN ETAT (point D7).
# `.autonomie/verif-finale.ok` autorise le wrapper a DESACTIVER la tache. Il etait
# cree une fois et JAMAIS supprime : trois occurrences dans le wrapper, aucune
# suppression, et les 21 versions du fichier depuis le 2026-08-02 identiques sur ce
# point. Reproduit sur copie : drapeau vieux de 180 jours + chaine re-terminee ->
# extinction SANS passe de securite. Le risque n'a jamais ete pris en ~10 creations
# du drapeau, mais il etait arme -- et il se declenche precisement le jour ou on
# ajoute un chantier a $CHAINE, c'est-a-dire le jour ou une verification compte.
#
# Le drapeau porte donc maintenant la DATE et l'EMPREINTE de l'etat qui l'a produit :
# les plans de la chaine avec leur nombre de cases faites et restantes. Un drapeau
# dont l'empreinte ne correspond plus n'autorise plus rien.
function Get-EmpreinteChaine($proj, $chaine) {
  $morceaux = @()
  foreach ($nom in $chaine) {
    $chemin = Join-Path $proj $nom
    if (-not (Test-Path $chemin)) { $morceaux += "$nom=absent"; continue }
    $faites = 0; $reste = 0
    try {
      $faites = (Select-String -Path $chemin -Pattern '^- \[x\]').Count
      $reste = (Select-String -Path $chemin -Pattern '^- \[ \]').Count
    } catch {}
    $morceaux += "$nom=$faites/$($faites + $reste)"
  }
  return ($morceaux -join ';')
}

# Rend .Valide, .Pourquoi, .Ecrit (date), .Empreinte (celle du drapeau).
function Test-DrapeauFin($okFile, $proj, $chaine) {
  if (-not (Test-Path $okFile)) {
    return [pscustomobject]@{ Valide = $false; Pourquoi = 'aucun drapeau'; Ecrit = $null; Empreinte = '' }
  }
  $contenu = ''
  try { $contenu = (Get-Content $okFile -Raw -ErrorAction Stop) } catch {}
  $mDate = [regex]::Match($contenu, 'date=([0-9T:\- ]+)')
  $mEmp = [regex]::Match($contenu, 'empreinte=(.+)')
  $ecrit = $null
  if ($mDate.Success) { try { $ecrit = [datetime]::Parse($mDate.Groups[1].Value.Trim()) } catch {} }
  if (-not $ecrit) { try { $ecrit = (Get-Item $okFile).LastWriteTime } catch {} }
  $emp = ''
  if ($mEmp.Success) { $emp = $mEmp.Groups[1].Value.Trim() }
  # Un drapeau de l'ancien format (fichier VIDE, cree par New-Item) ne porte aucune
  # empreinte : on ne peut pas savoir de quel etat il temoigne, donc il ne vaut rien.
  if (-not $emp) {
    return [pscustomobject]@{ Valide = $false; Pourquoi = 'drapeau sans empreinte (ancien format)'; Ecrit = $ecrit; Empreinte = '' }
  }
  $actuelle = Get-EmpreinteChaine $proj $chaine
  if ($emp -ne $actuelle) {
    return [pscustomobject]@{ Valide = $false; Pourquoi = "l'etat des plans a change depuis la verification finale"; Ecrit = $ecrit; Empreinte = $emp }
  }
  return [pscustomobject]@{ Valide = $true; Pourquoi = 'drapeau conforme a l etat courant'; Ecrit = $ecrit; Empreinte = $emp }
}

function Write-DrapeauFin($okFile, $proj, $chaine) {
  $lignes = @(
    'date=' + (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'),
    'empreinte=' + (Get-EmpreinteChaine $proj $chaine)
  )
  Set-Content -Path $okFile -Value ($lignes -join [Environment]::NewLine) -Encoding ascii
}

# LES CHIFFRES DU SITE, MESURES AU LANCEMENT (point D6).
# Le prompt annoncait << 83 cours, 1463 lecons >> quand le site en comptait 90 et
# 1540, et decrivait les outils avec des chiffres tout aussi vieux (1425 lecons pour
# 1629 fichiers, 17 invariants pour 26, 20 pages de rendu pour 256). Un chiffre faux
# dans une consigne ne casse rien : il fait seulement travailler le modele sur une
# image fausse du site. tools/mesures-prompt.js les rend en 60 ms.
# Rend un hashtable, ou $null si la mesure n'a pas abouti -- auquel cas les jetons
# seront neutralises et l'alerte le dira.
# Substitue les mesures, NEUTRALISE ce qui reste, et rend les alertes. Un jeton non
# substitue ne doit jamais partir tel quel : le modele lirait << @@N_COURS@@ cours >>.
function Complete-Prompt($texte, $mesures) {
  $t = $texte
  $alertes = @()
  if ($mesures) {
    foreach ($k in @($mesures.Keys)) { $t = $t.Replace('@@' + $k + '@@', [string]$mesures[$k]) }
  } else {
    $alertes += 'aucune mesure du site disponible (tools/mesures-prompt.js) : chiffres neutralises'
  }
  $restants = [regex]::Matches($t, '@@[A-Z_0-9]+@@')
  if ($restants.Count -gt 0) {
    $noms = ($restants | ForEach-Object { $_.Value } | Select-Object -Unique) -join ', '
    $alertes += "jeton(s) non substitue(s) : $noms"
    $t = [regex]::Replace($t, '@@[A-Z_0-9]+@@', '(chiffre non mesure)')
  }
  return [pscustomobject]@{ Texte = $t; Alertes = $alertes }
}

function Get-MesuresSite($proj) {
  try {
    $json = (& node (Join-Path $proj 'tools\mesures-prompt.js') 2>$null | Select-Object -Last 1)
    if (-not $json) { return $null }
    $o = $json | ConvertFrom-Json
    $h = @{}
    foreach ($p in $o.PSObject.Properties) { $h[$p.Name] = $p.Value }
    if ($h.Count -eq 0) { return $null }
    return $h
  } catch { return $null }
}

# Assemble le prompt et le RELIT. Rend .Texte et .Alertes (liste, vide si tout va bien).
function Build-PromptTravail($modele, $proj, $chaine, $planCourant, $mesures) {
  $t = $modele
  $t = $t.Replace('@@CHAINE@@', (Get-DescriptionChaine $proj $chaine $planCourant))
  $t = $t.Replace('@@PLAN@@', $planCourant)
  $r = Complete-Prompt $t $mesures
  $t = $r.Texte
  $alertes = @($r.Alertes)
  if ($t -notmatch [regex]::Escape($planCourant)) {
    $alertes += "le plan courant ($planCourant) n'apparait pas dans le prompt"
  }
  # Le point 1 doit nommer LE plan courant, et pas un autre de la chaine : c'est
  # exactement la phrase que l'ancienne substitution rendait contradictoire.
  $m1 = [regex]::Match($t, 'TON PLAN DE TRAVAIL EST [^\s]*?(CHANTIER-V\d+\.md)')
  if (-not $m1.Success) { $alertes += 'la phrase << TON PLAN DE TRAVAIL EST >> est introuvable' }
  elseif ($m1.Groups[1].Value -ne $planCourant) {
    $alertes += "le point 1 annonce $($m1.Groups[1].Value) alors que le plan courant est $planCourant"
  }
  # LE MOJIBAKE, mesure le 2026-09-10 sur le prompt REELLEMENT recu par le modele :
  # le wrapper etait en UTF-8 SANS BOM, PowerShell 5.1 le lisait donc en ANSI (1252),
  # et les six tirets cadratins du prompt arrivaient sous la forme << a-EUR-" >>.
  # Un francais correct n'ecrit jamais un 0xC3 ou un 0xE2 suivi d'un autre caractere
  # non-ASCII : c'est la signature exacte d'un UTF-8 relu en 1252.
  # Motif ecrit PAR CODES DE CARACTERE, jamais en litteral : ce fichier-ci est lui
  # aussi lu par PowerShell, et un litteral accentue y subirait le meme sort.
  $suite = '[' + [char]0x80 + '-' + [char]0xBF + ']'
  $sigMoji = [string][char]0xC3 + $suite + '|' + [string][char]0xE2 + $suite
  $moji = [regex]::Matches($t, $sigMoji)
  if ($moji.Count -gt 0) {
    $alertes += "$($moji.Count) signature(s) de MOJIBAKE dans le prompt (UTF-8 relu en 1252)"
  }
  return [pscustomobject]@{ Texte = $t; Alertes = $alertes }
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
