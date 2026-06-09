<# 
download-nssm.ps1 — helper para baixar nssm e extrair nssm.exe
Uso: powershell -ExecutionPolicy Bypass -File .\download-nssm.ps1
#>
$ErrorActionPreference = "Stop"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Tmp = Join-Path $OutDir "tmp_nssm"
New-Item -ItemType Directory -Force -Path $Tmp | Out-Null

$Url = "https://nssm.cc/release/nssm-2.24.zip"
$Zip = Join-Path $Tmp "nssm.zip"

Write-Host "Baixando nssm de $Url ..."
Invoke-WebRequest -Uri $Url -OutFile $Zip
Write-Host "Extraindo..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($Zip, $Tmp)

$found = Get-ChildItem -Path $Tmp -Recurse -Filter nssm.exe | Select-Object -First 1
if ($found) {
  Copy-Item -Path $found.FullName -Destination (Join-Path $OutDir "nssm.exe") -Force
  Write-Host "nssm.exe copiado para a pasta do projeto."
} else {
  Write-Host "nssm.exe não encontrado na extração. Verifique manualmente: $Tmp"
}
Remove-Item -Recurse -Force $Tmp
