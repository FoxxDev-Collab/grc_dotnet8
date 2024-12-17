# PowerShell Script to Download and Install .NET 8 SDK

# Ensure script runs with administrator privileges
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit
}

# Detect system architecture
$arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }

# Set the direct download URL for .NET 8 SDK
$downloadUrl = "https://dotnetcli.azureedge.net/dotnet/Sdk/8.0.100/dotnet-sdk-8.0.100-win-$arch.exe"

# Define the download path
$downloadPath = "$env:TEMP\dotnet-sdk-8.0.100-win-$arch.exe"

# Download .NET 8 SDK
Write-Host "Downloading .NET 8 SDK for $arch..." -ForegroundColor Cyan
try {
    # Use System.Net.WebClient for more reliable download
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($downloadUrl, $downloadPath)
    Write-Host "Download complete." -ForegroundColor Green
}
catch {
    Write-Host "Failed to download .NET 8 SDK: $_" -ForegroundColor Red
    exit
}

# Install .NET 8 SDK
Write-Host "Installing .NET 8 SDK..." -ForegroundColor Cyan
try {
    # Use Start-Process with additional error handling
    $process = Start-Process -FilePath $downloadPath -ArgumentList "/quiet", "/norestart" -PassThru -Wait
    
    # Check process exit code
    if ($process.ExitCode -ne 0 -and $process.ExitCode -ne 3010) {
        throw "Installation failed with exit code $($process.ExitCode)"
    }
    
    Write-Host "Installation complete." -ForegroundColor Green
}
catch {
    Write-Host "Failed to install .NET 8 SDK: $_" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Your Windows version is compatible" -ForegroundColor Yellow
    Write-Host "2. You have the latest Windows updates" -ForegroundColor Yellow
    Write-Host "3. Your system meets .NET 8 requirements" -ForegroundColor Yellow
    exit
}

# Verify installation
Write-Host "Verifying .NET 8 SDK installation..." -ForegroundColor Cyan
try {
    $dotnetVersion = & dotnet --version
    if ($dotnetVersion -like "8.0.*") {
        Write-Host "Successful installation of .NET 8 SDK (Version: $dotnetVersion)" -ForegroundColor Green
    }
    else {
        Write-Host "Installation verification failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "Unable to verify .NET SDK installation" -ForegroundColor Red
}

# Clean up downloaded installer
try {
    Remove-Item $downloadPath -Force
    Write-Host "Temporary installer removed." -ForegroundColor Green
}
catch {
    Write-Host "Could not remove temporary installer" -ForegroundColor Yellow
}

Write-Host "Script completed." -ForegroundColor Green