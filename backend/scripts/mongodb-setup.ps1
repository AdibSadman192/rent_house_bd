# MongoDB Setup and Diagnostic Script

# Ensure running with admin privileges
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))  
{  
    Write-Error "Please run this script as Administrator"
    exit
}

# MongoDB Configuration
$mongoVersion = "8.0"
$mongoPath = "C:\Program Files\MongoDB\Server\$mongoVersion"
$dataPath = "C:\data\db"

# Create data directory if not exists
if (!(Test-Path -Path $dataPath)) {
    New-Item -ItemType Directory -Force -Path $dataPath
}

# Set MongoDB environment variables
[Environment]::SetEnvironmentVariable("MONGODB_HOME", $mongoPath, "Machine")
$env:Path += ";$mongoPath\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "Machine")

# Diagnostic Information
Write-Host "MongoDB Diagnostic Information:" -ForegroundColor Green
Write-Host "MongoDB Version: $mongoVersion" -ForegroundColor Cyan
Write-Host "MongoDB Path: $mongoPath" -ForegroundColor Cyan
Write-Host "Data Directory: $dataPath" -ForegroundColor Cyan

# Check MongoDB Installation
try {
    $mongoVersion = & "$mongoPath\bin\mongod.exe" --version
    Write-Host "MongoDB Installation Verified" -ForegroundColor Green
} catch {
    Write-Host "MongoDB Installation Not Found" -ForegroundColor Red
    exit
}

# Configure MongoDB Service
& "$mongoPath\bin\mongod.exe" --config "$mongoPath\bin\mongod.cfg" --install --dbpath $dataPath

# Start MongoDB Service
try {
    Start-Service MongoDB
    Write-Host "MongoDB Service Started Successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to Start MongoDB Service" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

# Verify Connection
try {
    $result = & "$mongoPath\bin\mongo.exe" --eval "db.runCommand({connectionStatus: 1})"
    Write-Host "MongoDB Connection Test Successful" -ForegroundColor Green
} catch {
    Write-Host "MongoDB Connection Test Failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

Write-Host "MongoDB Setup Complete" -ForegroundColor Green
