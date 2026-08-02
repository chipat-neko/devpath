# tools/assemble-course.ps1 — Assemble les fichiers lecon-NN.html d'un cours à partir
# du journal d'un workflow (rédacteur/relecteur) SANS relancer d'agents.
# - Lit journal.jsonl (résultats {metaDesc, objectives, body} indexés par agentId)
# - Retrouve le numéro de leçon et le rôle (rédaction/relecture) dans agent-<id>.jsonl
# - Préfère la version RELUE quand elle existe, sinon la rédaction
# - Reconstruit la page complète (même gabarit que wf-course2.js) et écrit en UTF-8 sans BOM
# Usage :
#   powershell -File tools/assemble-course.ps1 -WfDir "<dossier wf_...>" -SpecsFile "tools/specs/ruby.json"
param(
  [Parameter(Mandatory = $true)][string]$WfDir,
  [Parameter(Mandatory = $true)][string]$SpecsFile
)

$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)

$cfg = [System.IO.File]::ReadAllText($SpecsFile, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
$journalPath = Join-Path $WfDir "journal.jsonl"
if (-not (Test-Path $journalPath)) { throw "journal.jsonl introuvable dans $WfDir" }

# ---- 1. Collecte des résultats du journal --------------------------------
$results = @{}   # agentId -> result (objet metaDesc/objectives/body)
foreach ($line in [System.IO.File]::ReadAllLines($journalPath, [System.Text.Encoding]::UTF8)) {
  if ($line.Trim() -eq "") { continue }
  $j = $line | ConvertFrom-Json
  if ($j.type -eq "result" -and $j.result -ne $null -and $j.result.PSObject.Properties.Name -contains "body") {
    $results[$j.agentId] = $j.result
  }
}
Write-Output ("Resultats de contenu dans le journal : " + $results.Count)

# ---- 2. Identification leçon/rôle via le prompt de chaque agent -----------
# best[num] = @{ role = "redaction"|"relecture"; result = ... }
$best = @{}
foreach ($agentId in $results.Keys) {
  $af = Join-Path $WfDir ("agent-" + $agentId + ".jsonl")
  if (-not (Test-Path $af)) { continue }
  # Le prompt est au début du fichier : 30 Ko suffisent largement.
  $fs = [System.IO.File]::OpenRead($af)
  $buf = New-Object byte[] ([Math]::Min(30000, $fs.Length))
  [void]$fs.Read($buf, 0, $buf.Length); $fs.Close()
  $head = [System.Text.Encoding]::UTF8.GetString($buf)

  $role = $null; $num = $null
  if ($head -match "RELECTURE CRITIQUE") {
    $role = "relecture"
    if ($head -match "Le\\u00e7on (\d{2})" -or $head -match "Leçon (\d{2})") { $num = $Matches[1] }
  } elseif ($head -match "LE\\u00c7ON \\u00c0 R\\u00c9DIGER" -or $head -match "LEÇON À RÉDIGER") {
    $role = "redaction"
    if ($head -match "Num\\u00e9ro : (\d{2})" -or $head -match "Numéro : (\d{2})") { $num = $Matches[1] }
  }
  if ($null -eq $role -or $null -eq $num) { continue }

  if (-not $best.ContainsKey($num)) {
    $best[$num] = @{ role = $role; result = $results[$agentId] }
  } elseif ($role -eq "relecture" -and $best[$num].role -ne "relecture") {
    $best[$num] = @{ role = $role; result = $results[$agentId] }
  }
}
Write-Output ("Leçons retrouvées : " + ($best.Keys | Sort-Object) -join ", ")

# ---- 3. Gabarit de page (identique à wf-course2.js) -----------------------
$PILL = @{ debutant = "Débutant"; intermediaire = "Intermédiaire"; avance = "Avancé" }

$prismTags = (@("core") + $cfg.prismLangs | ForEach-Object {
  '    <script src="../../assets/vendor/prism/prism-' + $_ + '.min.js" defer></script>'
}) -join "`n"

$TPL = @'
<!DOCTYPE html>
<html lang="fr" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>@@TITLE@@ — Leçon @@NUM@@@@SUFFIX@@</title>
    <meta name="description" content="@@METADESC@@" />
    <link rel="icon" type="image/svg+xml" href="../../assets/img/favicon.svg" />

    <script src="../../js/theme.js"></script>

    <link rel="stylesheet" href="../../css/fonts.css" />

    <link rel="stylesheet" href="../../css/variables.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/layout.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="../../css/pages.css" />
  </head>

  <body data-course="@@DATACOURSE@@" data-lesson="lecon-@@NUM@@.html">
    <a class="skip-link" href="#contenu">Aller au contenu</a>

    <header class="site-header">
      <div class="container--wide container site-header__inner">
        <a class="brand" href="../../index.html" aria-label="Syntaxe — accueil">
          <svg class="brand__mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" rx="8" /><path d="M13 12 L9 16 L13 20" /><path d="M19 12 L23 16 L19 20" />
          </svg>
          <span>Syntaxe<span class="brand__dot" aria-hidden="true">.</span></span>
        </a>
        <button class="nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir le menu de navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <nav class="primary-nav" id="primary-nav" aria-label="Navigation principale">
          <a href="../../index.html">Accueil</a>
          <a href="../catalogue.html">Catalogue</a>
          <a href="../js/cours.html">Cours JavaScript</a>
          <a href="../../index.html#pourquoi">Notre approche</a>
        </nav>
        <div class="header-actions">
          <button class="theme-toggle" data-theme-toggle aria-label="Activer le thème sombre">
            <svg class="icon icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
            <svg class="icon icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="reading-progress" data-reading-progress aria-hidden="true"></div>

    <main id="contenu">
      <div class="container container--wide">
        <nav class="breadcrumb-nav" aria-label="Fil d'Ariane">
          <ol class="breadcrumb">
            <li><a href="../../index.html">Accueil</a></li>
            <li><a href="../catalogue.html">Catalogue</a></li>
            <li><a href="cours.html">@@BREADCRUMB@@</a></li>
            <li aria-current="page">Leçon @@NUM@@</li>
          </ol>
        </nav>

        <div class="lesson-layout">
          <aside class="lesson-rail lesson-coursenav" data-coursenav-host aria-label="Plan du cours">
            <button class="coursenav-toggle" data-coursenav-toggle aria-expanded="false">
              <span>Plan du cours</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div class="coursenav-panel"><div data-coursenav></div></div>
          </aside>

          <div class="lesson-main">
            <header class="lesson-header">
              <p class="kicker">Module @@MODNUM@@ · @@MODNAME@@ — Leçon @@NUM@@</p>
              <h1 class="lesson-header__title">@@TITLE@@</h1>
              <div class="meta-row">
                <span class="duration">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  ~@@DURATION@@ min
                </span>
                <span class="dot-sep"><span class="pill @@PILLCLASS@@">@@PILLLABEL@@</span></span>
                <span class="dot-sep">@@PREREQ@@</span>
              </div>

              <div class="objectives">
                <p class="objectives__title">À la fin de cette leçon, tu sauras</p>
                <ul>
@@OBJECTIVES@@
                </ul>
              </div>
            </header>

            <details class="toc-inline" open>
              <summary>Sommaire de la leçon</summary>
              <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
            </details>

            <article class="prose">
@@BODY@@

              <button class="btn btn--primary" data-complete-toggle aria-pressed="false">
                <span>Marquer comme terminée</span>
              </button>

              <nav class="lesson-nav" data-lesson-nav aria-label="Navigation entre leçons"></nav>
            </article>
          </div>

          <aside class="lesson-rail lesson-toc-rail" aria-label="Sommaire">
            <p class="toc__title">Sur cette page</p>
            <nav class="toc" aria-label="Sommaire de la leçon"><div data-toc></div></nav>
          </aside>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__bottom">
          <span>© <span data-year>2026</span> Syntaxe. Projet de démonstration.</span>
          <span><a href="cours.html">← Retour au programme du cours</a></span>
        </div>
      </div>
    </footer>

    <script src="../../js/data.js" defer></script>
    <script src="../../js/main.js" defer></script>
    <script src="../../js/lecon.js" defer></script>
    <script src="../../js/runner.js" defer></script>
@@PRISM@@
  </body>
</html>
'@

# ---- 4. Assemblage et écriture --------------------------------------------
if (-not (Test-Path $cfg.outDir)) { New-Item -ItemType Directory -Force -Path $cfg.outDir | Out-Null }
$written = 0; $missing = @()
foreach ($spec in $cfg.specs) {
  $num = $spec.num
  if (-not $best.ContainsKey($num)) { $missing += $num; continue }
  $r = $best[$num].result
  $objLines = ($r.objectives | ForEach-Object { "                  <li>" + $_ + "</li>" }) -join "`n"

  $html = $TPL
  $html = $html.Replace("@@OBJECTIVES@@", $objLines).Replace("@@BODY@@", $r.body)
  $html = $html.Replace("@@METADESC@@", $r.metaDesc)
  $html = $html.Replace("@@TITLE@@", $spec.title).Replace("@@NUM@@", $num)
  $html = $html.Replace("@@SUFFIX@@", $cfg.titleSuffix).Replace("@@DATACOURSE@@", $cfg.dataCourse)
  $html = $html.Replace("@@BREADCRUMB@@", $cfg.breadcrumb).Replace("@@MODNUM@@", [string]$spec.modNum)
  $html = $html.Replace("@@MODNAME@@", $spec.modName).Replace("@@DURATION@@", [string]$spec.durationMin)
  $html = $html.Replace("@@PILLCLASS@@", "pill--" + $spec.level).Replace("@@PILLLABEL@@", $PILL[$spec.level])
  $html = $html.Replace("@@PREREQ@@", $spec.prereq).Replace("@@PRISM@@", $prismTags)

  $out = Join-Path $cfg.outDir ("lecon-" + $num + ".html")
  [System.IO.File]::WriteAllText($out, $html, $utf8)
  $role = $best[$num].role
  Write-Output ("OK lecon-" + $num + ".html (" + $role + ", " + $html.Length + " car.)")
  $written++
}
Write-Output ("Écrites : " + $written + "/" + $cfg.specs.Count + ($(if ($missing.Count) { " — MANQUANTES : " + ($missing -join ", ") } else { "" })))
