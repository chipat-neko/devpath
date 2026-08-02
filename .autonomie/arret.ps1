# =============================================================================
# Syntaxe - ARRET de l'autonomie (a lancer TOI-MEME quand tu veux reprendre la main).
# =============================================================================
# Effet :
#   1) desactive la tache planifiee "Syntaxe-Autonomie" (plus aucun nouveau reveil) ;
#   2) stoppe un reveil autonome EN COURS, en ciblant UNIQUEMENT le claude lance par
#      CETTE tache (via une phrase unique de sa consigne) - JAMAIS ta session
#      interactive, NI le reveil d'un autre projet (ex : Amalia) ;
#   3) nettoie le verrou.
#
# Lancer : clic droit sur ce fichier > "Executer avec PowerShell"
#          ou en terminal :  powershell -ExecutionPolicy Bypass -File "d:\test-claude\.autonomie\arret.ps1"
#
# REPRENDRE plus tard :  schtasks /Change /TN "Syntaxe-Autonomie" /ENABLE
# SUPPRIMER pour de bon : schtasks /Delete /TN "Syntaxe-Autonomie" /F
# =============================================================================
$ErrorActionPreference = 'Continue'
$task = 'Syntaxe-Autonomie'
$log  = 'd:\test-claude\.autonomie\journal.log'
$lock = 'd:\test-claude\.autonomie\lock'
$stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')

Write-Host "Arret de l'autonomie de Syntaxe..." -ForegroundColor Yellow

# 1) Desactiver la tache (reversible via /ENABLE).
try { Start-Process -FilePath 'schtasks' -ArgumentList '/Change','/TN',$task,'/DISABLE' -NoNewWindow -Wait -ErrorAction Stop } catch {}
if ($LASTEXITCODE -eq 0) { Write-Host "Tache '$task' DESACTIVEE (aucun nouveau reveil)." -ForegroundColor Green }
else { Write-Host "Tache '$task' introuvable ou deja desactivee." -ForegroundColor DarkYellow }

# 2) Stopper un reveil EN COURS, en ne ciblant QUE le claude de CE projet.
#    Le marqueur est une phrase presente UNIQUEMENT dans la consigne de Syntaxe
#    (le reveil d'Amalia porte "projet Amalia EN AUTONOMIE" et ne sera pas touche).
$marqueur = 'projet Syntaxe EN AUTONOMIE'
$procs = Get-CimInstance Win32_Process -Filter "Name = 'claude.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -and ($_.CommandLine -like "*$marqueur*") }
if ($procs) {
  foreach ($p in $procs) {
    try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop; Write-Host "Reveil autonome en cours STOPPE (PID $($p.ProcessId))." -ForegroundColor Green } catch {}
  }
} else {
  Write-Host "Aucun reveil autonome en cours." -ForegroundColor DarkGray
}

# 3) Nettoyer le verrou.
if (Test-Path $lock) { Remove-Item $lock -Force -ErrorAction SilentlyContinue }
try { Add-Content $log "[$stamp] ===== ARRET MANUEL (arret.ps1) =====" } catch {}

Write-Host ""
Write-Host "Autonomie ARRETEE." -ForegroundColor Cyan
Write-Host "Reprendre : schtasks /Change /TN `"$task`" /ENABLE" -ForegroundColor Cyan
