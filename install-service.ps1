<# 
install-service.ps1
Instala o agent.js como serviço do Windows usando o utilitário nssm (recomendado).
Uso: executar em PowerShell com permissão de Administrador:
powershell -ExecutionPolicy Bypass -File .\install-service.ps1
#>

$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$NodePath = (Get-Command node).Source
if (-not $NodePath) {
  Write-Error "Node.js não encontrado no PATH. Instale Node.js 18+"
  exit 1
}

$nssm = "nssm.exe"
if (-not (Get-Command $nssm -ErrorAction SilentlyContinue)) {
  Write-Host "nssm.exe não está disponível no PATH. Por favor baixe nssm e coloque nssm.exe na pasta do projeto ou PATH."
  exit 1
}

$serviceName = "PandoraAgent"
$agentScript = Join-Path $ProjectRoot "agent.js"
$workingDir = $ProjectRoot

Write-Host "Instalando serviço $serviceName..."
& $nssm install $serviceName $NodePath $agentScript
& $nssm set $serviceName AppDirectory $workingDir
& $nssm set $serviceName Start SERVICE_AUTO_START
& $nssm start $serviceName

Write-Host "Serviço instalado e iniciado. Use 'nssm remove PandoraAgent confirm' para remover."
