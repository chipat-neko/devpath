# tools/shot.ps1 — Capture d'écran headless via Chrome (aucun Node requis).
# Usage :
#   powershell -File tools/shot.ps1 -Url "file:///D:/test-claude/index.html" -Out "tools/shots/home.png"
#   ... -Width 1440 -Height 900           (viewport desktop, défaut)
#   ... -Width 390 -Height 844            (viewport mobile)
#   ... -Full                              (page entière, hauteur auto)
param(
  [Parameter(Mandatory = $true)][string]$Url,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Width = 1440,
  [int]$Height = 900,
  [switch]$Full
)

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" }

# Dossier de sortie
$outDir = Split-Path -Parent $Out
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }

# Profil temporaire dédié (évite « ouverture dans une session existante »)
$udd = Join-Path $env:TEMP "cr-shot-udd"
if (Test-Path $udd) { Remove-Item -Recurse -Force $udd -ErrorAction SilentlyContinue }

$mode = if ($Full) { "--headless" } else { "--headless=new" }

$args = @(
  $mode,
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--user-data-dir=$udd",
  "--window-size=$Width,$Height",
  "--virtual-time-budget=4000",
  "--screenshot=$Out",
  $Url
)

& $chrome @args | Out-Null
if (Test-Path $Out) {
  $sz = (Get-Item $Out).Length
  Write-Output "OK -> $Out ($sz octets)"
} else {
  Write-Output "ECHEC: aucune image generee pour $Url"
}
