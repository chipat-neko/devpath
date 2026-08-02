# tools/build-lessons.ps1 — Assemble les pages lecon-NN.html à partir de contenus
# rédigés À LA MAIN (aucun sous-agent, aucun workflow).
# Entrées (dans tools/content/<course>/) :
#   _course.json : { langName, dataCourse, breadcrumb, titleSuffix, prismLangs:[...],
#                    outDir, lessons:[ {num, modNum, modName, level, durationMin,
#                    title, prereq, metaDesc, objectives:[...]} ] }
#   lNN.html     : le corps HTML brut (intérieur de <article class="prose">) de la leçon NN.
# Sortie : <outDir>/lecon-NN.html (UTF-8 sans BOM), même gabarit que le reste du site.
# Usage : powershell -File tools/build-lessons.ps1 -Course powershell
param(
  [Parameter(Mandatory = $true)][string]$Course
)
$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)
$root = "D:/test-claude/tools/content/$Course"
$cfgPath = Join-Path $root "_course.json"
if (-not (Test-Path $cfgPath)) { throw "Config introuvable : $cfgPath" }
$cfg = [System.IO.File]::ReadAllText($cfgPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json

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

if (-not (Test-Path $cfg.outDir)) { New-Item -ItemType Directory -Force -Path $cfg.outDir | Out-Null }
$written = 0; $missing = @()
foreach ($l in $cfg.lessons) {
  $bodyPath = Join-Path $root ("l" + $l.num + ".html")
  if (-not (Test-Path $bodyPath)) { $missing += $l.num; continue }
  $body = [System.IO.File]::ReadAllText($bodyPath, [System.Text.Encoding]::UTF8)
  $objLines = ($l.objectives | ForEach-Object { "                  <li>" + $_ + "</li>" }) -join "`n"

  $html = $TPL
  $html = $html.Replace("@@OBJECTIVES@@", $objLines).Replace("@@BODY@@", $body)
  $html = $html.Replace("@@METADESC@@", $l.metaDesc)
  $html = $html.Replace("@@TITLE@@", $l.title).Replace("@@NUM@@", $l.num)
  $html = $html.Replace("@@SUFFIX@@", $cfg.titleSuffix).Replace("@@DATACOURSE@@", $cfg.dataCourse)
  $html = $html.Replace("@@BREADCRUMB@@", $cfg.breadcrumb).Replace("@@MODNUM@@", [string]$l.modNum)
  $html = $html.Replace("@@MODNAME@@", $l.modName).Replace("@@DURATION@@", [string]$l.durationMin)
  $html = $html.Replace("@@PILLCLASS@@", "pill--" + $l.level).Replace("@@PILLLABEL@@", $PILL[$l.level])
  $html = $html.Replace("@@PREREQ@@", $l.prereq).Replace("@@PRISM@@", $prismTags)

  $out = Join-Path $cfg.outDir ("lecon-" + $l.num + ".html")
  [System.IO.File]::WriteAllText($out, $html, $utf8)
  Write-Output ("OK lecon-" + $l.num + ".html (" + $html.Length + " car.)")
  $written++
}
Write-Output ("Construites : " + $written + "/" + $cfg.lessons.Count + ($(if ($missing.Count) { " — corps manquants : " + ($missing -join ", ") } else { "" })))
