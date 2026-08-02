# Insère des blocs <script type="application/json" data-*> dans les leçons.
# Usage : powershell -File insert-blocks.ps1 -Fragments <chemin> -Kind quiz|exos
# Fragments : fichier texte, sections séparées par des lignes "### dir/lecon ###",
#             chaque section contenant un tableau JSON valide.
#   - Kind quiz : attribut data-quiz, inséré AVANT "<h2>Exercices</h2>".
#   - Kind exos : attribut data-exos, inséré AVANT le premier '<div class="exercise">'.
# Idempotent (saute les fichiers ayant déjà l'attribut), écrit en UTF-8 sans BOM.
param(
  [Parameter(Mandatory=$true)][string]$Fragments,
  [Parameter(Mandatory=$true)][ValidateSet('quiz','exos')][string]$Kind
)
$ErrorActionPreference = 'Stop'
if ($Kind -eq 'quiz') { $attr = 'data-quiz'; $anchor = '<h2>Exercices</h2>' }
else                  { $attr = 'data-exos'; $anchor = '<div class="exercise">' }

$raw = [System.IO.File]::ReadAllText($Fragments) -replace "`r`n","`n"
$parts = [regex]::Split($raw, "(?m)^### (\S+) ###\n")
$enc = New-Object System.Text.UTF8Encoding($false)
$done=@(); $skip=@(); $bad=@(); $err=@()

for ($i=1; $i -lt $parts.Length; $i+=2) {
  $key = $parts[$i].Trim()
  $json = $parts[$i+1].Trim("`n")
  $path = "D:\test-claude\pages\$($key.Replace('/','\')).html"
  if (-not (Test-Path $path)) { $err += "$key (absent)"; continue }
  try { $null = $json | ConvertFrom-Json -ErrorAction Stop } catch { $bad += "$key : $($_.Exception.Message)"; continue }
  $html = [System.IO.File]::ReadAllText($path)
  if ($html -match $attr) { $skip += $key; continue }
  $idx = $html.IndexOf($anchor)
  if ($idx -lt 0) { $err += "$key (pas d'ancre)"; continue }
  $block = "<script type=`"application/json`" $attr>`n$json`n</script>`n`n"
  [System.IO.File]::WriteAllText($path, $html.Substring(0,$idx) + $block + $html.Substring($idx), $enc)
  $done += $key
}
Write-Output ("[$Kind] Inseres : {0}" -f $done.Count)
if ($skip) { Write-Output ("  Skip (deja $attr) : {0}" -f ($skip -join ', ')) }
if ($bad)  { Write-Output ("  JSON invalide : {0}" -f ($bad -join ' | ')) }
if ($err)  { Write-Output ("  Erreurs : {0}" -f ($err -join ', ')) }
