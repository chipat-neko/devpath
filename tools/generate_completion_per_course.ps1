$ErrorActionPreference='Stop'

$outDir = 'C:\Users\chipat\Documents\resultat_agent'
$srcBase = 'D:\test-claude\pages'

if(Test-Path $outDir){
  Remove-Item -Recurse -Force $outDir
}
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function BuildFromDir([string]$srcDir, [string]$outFile, [string]$title){
  if(-not (Test-Path $srcDir)){ return }
  $files = Get-ChildItem -Path $srcDir -Filter 'lecon-*.html' -File -ErrorAction SilentlyContinue
  if(-not $files){ return }

  $parts = @()
  $parts += ('# ' + $title)
  $parts += ''

  foreach($f in ($files | Sort-Object Name)){
    $content = Get-Content -Path $f.FullName -Raw -ErrorAction SilentlyContinue
    $parts += ('## ' + $f.BaseName)
    $parts += ''
    $parts += '```html'
    $parts += $content
    $parts += '```'
    $parts += ''
  }

  $text = $parts -join "`n"
  Set-Content -Path $outFile -Value $text -Encoding utf8
}

$dirs = Get-ChildItem -Path $srcBase -Directory -ErrorAction SilentlyContinue
foreach($d in ($dirs | Sort-Object Name)){
  $name = $d.Name
  $dstLangDir = Join-Path $outDir $name
  New-Item -ItemType Directory -Force -Path $dstLangDir | Out-Null

  $sub = Get-ChildItem -Path $d.FullName -Directory -ErrorAction SilentlyContinue

  if($sub -and $sub.Count -gt 0){
    $hasSub = $false
    foreach($sd in $sub){
      if($sd.Name -in @('html','css','js','assets')){
        $hasSub = $true
        $title = ('Completion ' + $name + ' / ' + $sd.Name)
        BuildFromDir $sd.FullName (Join-Path $dstLangDir ($sd.Name+'.md')) $title
      }
    }

    if(-not $hasSub){
      $title = ('Completion ' + $name)
      BuildFromDir $d.FullName (Join-Path $dstLangDir 'all.md') $title
    }
  } else {
    $title = ('Completion ' + $name)
    BuildFromDir $d.FullName (Join-Path $dstLangDir 'all.md') $title
  }
}

Set-Content -Path (Join-Path $outDir 'README_generated.txt') -Value ('Generated at ' + (Get-Date)) -Encoding utf8

Get-ChildItem -Path $outDir | Select-Object Name,Mode,Length | Format-Table -AutoSize

