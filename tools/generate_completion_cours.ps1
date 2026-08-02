$ErrorActionPreference = 'Stop'

$outDir = 'C:\Users\chipat\Documents\completion_cours'
$srcBase = 'D:\test-claude\pages'

if (Test-Path $outDir) {
  Remove-Item -Recurse -Force $outDir
}
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function BuildCompletionFile([string]$langDirName, [string]$outName, [string]$title) {
  $srcDir = Join-Path $srcBase $langDirName
  if (-not (Test-Path $srcDir)) { return }

  $files = Get-ChildItem -Path $srcDir -Filter 'lecon-*.html' -File -ErrorAction SilentlyContinue

  $parts = @()
  $parts += ('# ' + $title)
  $parts += ''

  foreach ($f in ($files | Sort-Object Name)) {
    $content = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue

    $parts += ('## ' + $f.BaseName)
    $parts += ''
    $parts += '```html'
    $parts += $content
    $parts += '```'
    $parts += ''
  }

  $text = $parts -join "`n"
  Set-Content -Path (Join-Path $outDir $outName) -Value $text -Encoding utf8
}

BuildCompletionFile 'html' 'completion_html.md' 'Completion HTML (local D:/test-claude/pages/html)'
BuildCompletionFile 'css'  'completion_css.md'  'Completion CSS (local D:/test-claude/pages/css)'
BuildCompletionFile 'js'   'completion_js.md'   'Completion JS (local D:/test-claude/pages/js)'

Get-ChildItem -Path $outDir | Select-Object Name,Length | Format-Table -AutoSize

