$ErrorActionPreference = 'Stop'
$nssm = "nssm.exe"
if (-not (Get-Command $nssm -ErrorAction SilentlyContinue)) {
  Write-Host "nssm.exe não encontrado no PATH. Se você instalou o serviço com outro método, remova manualmente."
  exit 1
}
$serviceName = "PandoraAgent"
Write-Host "Parando serviço..."
& $nssm stop $serviceName
Write-Host "Removendo serviço..."
& $nssm remove $serviceName confirm
Write-Host "Serviço removido."
