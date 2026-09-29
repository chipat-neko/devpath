# =============================================================================
# build-starter-zip.ps1 — regenere starter-kit.zip depuis le dossier starter/.
# Rejouable. A relancer APRES tout changement dans starter/ (le zip est un
# livrable regenerable et se perime silencieusement sinon — cf. AUDIT A6).
# Sortie dans tools/sorties/ depuis le rangement de la racine du 2026-09-26
# (la racine ne garde que README.md, index.html, sw.js et en-cours/).
# Produit des separateurs '/' CONFORMES au format ZIP (CreateFromDirectory de
# PowerShell 5.1 met des '\' qui cassent l'extraction sur macOS/Linux).
# Lancer depuis n'importe ou : powershell -File tools\build-starter-zip.ps1
# =============================================================================
Add-Type -AssemblyName System.IO.Compression | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem | Out-Null

$root = Split-Path -Parent $PSScriptRoot          # racine = parent de tools/
$src = Join-Path $root "starter"
$sorties = Join-Path $root "tools\sorties"
if (-not (Test-Path $sorties)) { New-Item -ItemType Directory -Path $sorties | Out-Null }
$dst = Join-Path $sorties "starter-kit.zip"
if (-not (Test-Path $src)) { throw "dossier starter/ introuvable ($src)" }
if (Test-Path $dst) { [System.IO.File]::Delete((Convert-Path $dst)) }

$base = (Resolve-Path $src).Path
$fs = [System.IO.File]::Open($dst, [System.IO.FileMode]::Create)
$zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
$n = 0
foreach ($f in (Get-ChildItem -Path $src -Recurse -File | Sort-Object FullName)) {
  $rel = $f.FullName.Substring($base.Length + 1) -replace '\\', '/'
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, "starter/$rel", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  $n++
}
$zip.Dispose(); $fs.Dispose()
Write-Output "starter-kit.zip regenere : $n fichiers, $((Get-Item $dst).Length) octets"
