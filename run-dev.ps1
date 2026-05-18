$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

function Stop-DevJob {
  param([System.Management.Automation.Job] $Job)

  if ($Job -and $Job.State -eq "Running") {
    Write-Host "Stopping $($Job.Name)..."
    Stop-Job -Job $Job -ErrorAction SilentlyContinue
  }

  if ($Job) {
    Remove-Job -Job $Job -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "Starting DoGood backend on http://localhost:4000"
$backendJob = Start-Job -Name "dogood-backend" -ScriptBlock {
  param([string] $WorkingDirectory)

  Set-Location $WorkingDirectory
  & npm.cmd run dev
} -ArgumentList $backend

Write-Host "Starting DoGood frontend on http://localhost:5173"
$frontendJob = Start-Job -Name "dogood-frontend" -ScriptBlock {
  param([string] $WorkingDirectory)

  Set-Location $WorkingDirectory
  & npm.cmd run dev -- --host 0.0.0.0
} -ArgumentList $frontend

Write-Host ""
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:4000"
Write-Host "Press Ctrl+C to stop both servers."
Write-Host ""

try {
  while ($backendJob.State -eq "Running" -and $frontendJob.State -eq "Running") {
    Receive-Job -Job $backendJob, $frontendJob -ErrorAction Continue
    Start-Sleep -Seconds 1
  }

  Receive-Job -Job $backendJob, $frontendJob -ErrorAction Continue
}
finally {
  Stop-DevJob $backendJob
  Stop-DevJob $frontendJob
}
