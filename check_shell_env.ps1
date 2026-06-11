Write-Host '=== SHELL ==='
$PSVersionTable.PSVersion.ToString()
Write-Host ''

function Show-Command($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($null -eq $cmd) {
        "${name}: not found"
    }
    else {
        "${name}: found"
        "  Source: " + $cmd.Source
        "  Path:   " + $cmd.Path
        try { & $cmd.Source --version 2>$null } catch {}
        try { & $cmd.Source -V 2>$null } catch {}
    }
}

Show-Command 'python'
Show-Command 'python3'
Show-Command 'pip'
Show-Command 'pip3'
Show-Command 'conda'
Show-Command 'docker'
Show-Command 'kubectl'
Show-Command 'make'

Write-Host ''
Write-Host '=== PATH ==='
$env:PATH -split ';' | Select-Object -First 40
