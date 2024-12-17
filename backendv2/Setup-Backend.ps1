# Setup-Backend.ps1

# Welcome Message
function Show-Welcome {
    Clear-Host
    Write-Host "`n"
    Write-Host "    =========================================" -ForegroundColor Cyan
    Write-Host "    |        .NET 8 Project Generator       |" -ForegroundColor Cyan
    Write-Host "    =========================================" -ForegroundColor Cyan
    Write-Host "`n"
}

# Progress Bar Function
function Show-Progress {
    param (
        [int]$PercentComplete,
        [string]$Status
    )
    $width = 50
    $complete = [math]::Floor($width * ($PercentComplete / 100))
    $remaining = $width - $complete
    $progressBar = "[" + ("#" * $complete) + ("-" * $remaining) + "]"
    
    Write-Host "`r$progressBar $PercentComplete% - $Status" -NoNewline
    if ($PercentComplete -eq 100) {
        Write-Host ""
    }
}

# Admin Check
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Show Welcome Screen
Show-Welcome

# Get Project Name
$defaultName = "FoxxCyber"
$solutionName = Read-Host "Enter project name (default: $defaultName)"
if ([string]::IsNullOrWhiteSpace($solutionName)) {
    $solutionName = $defaultName
}
Write-Host "Using project name: $solutionName" -ForegroundColor Green

# Function to download and install .NET 8 SDK with progress bar
function Install-DotNetSDK {
    Write-Host "`nDownloading .NET 8 SDK..." -ForegroundColor Yellow
    $downloadUrl = "https://download.visualstudio.microsoft.com/download/pr/93961dfb-d1e0-49c8-9230-abcba1ebab5a/811ed1eb63d7652325727720edda26a8/dotnet-sdk-8.0.100-win-x64.exe"
    $installerPath = Join-Path $env:TEMP "dotnet-sdk-8.0.100-win-x64.exe"
    
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($downloadUrl, $installerPath)

        Write-Host "`nInstalling .NET 8 SDK..." -ForegroundColor Yellow
        Start-Process -FilePath $installerPath -ArgumentList "/quiet /norestart" -Wait
        Remove-Item $installerPath -Force

        Write-Host ".NET 8 SDK installed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to install .NET 8 SDK: $_"
        exit 1
    }
}

# Check .NET version
$needsInstall = $false
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host ".NET SDK not found. Will install .NET 8 SDK." -ForegroundColor Yellow
    $needsInstall = $true
}
else {
    $dotnetVersion = dotnet --version
    if (-not $dotnetVersion.StartsWith("8.")) {
        Write-Host "Current .NET version: $dotnetVersion" -ForegroundColor Yellow
        Write-Host "Will install .NET 8 SDK." -ForegroundColor Yellow
        $needsInstall = $true
    }
    else {
        Write-Host ".NET 8 SDK found: $dotnetVersion" -ForegroundColor Green
    }
}

if ($needsInstall) {
    Install-DotNetSDK
}

# Create solution and projects
Write-Host "`nCreating solution and projects..." -ForegroundColor Cyan

# Create solution
dotnet new sln -n $solutionName

# Create projects with progress
$projects = @(
    @{Name="Api"; Template="webapi"},
    @{Name="Core"; Template="classlib"},
    @{Name="Infrastructure"; Template="classlib"},
    @{Name="Application"; Template="classlib"},
    @{Name="Common"; Template="classlib"}
)

$totalSteps = $projects.Count
$currentStep = 0

foreach ($proj in $projects) {
    $projName = "$solutionName.$($proj.Name)"
    $currentStep++
    $percentComplete = [math]::Round(($currentStep / $totalSteps) * 100)
    Show-Progress -PercentComplete $percentComplete -Status "Creating $projName"
    
    # Create project with .NET 8 explicitly
    dotnet new $proj.Template -n $projName --framework "net8.0"
    dotnet sln add "$projName/$projName.csproj"
}

Write-Host "`nCreating test projects..." -ForegroundColor Cyan

# Create test projects
$testProjects = @("Api", "Core", "Infrastructure", "Application")
$totalSteps = $testProjects.Count
$currentStep = 0

foreach ($proj in $testProjects) {
    $testProjName = "$solutionName.$proj.Tests"
    $currentStep++
    $percentComplete = [math]::Round(($currentStep / $totalSteps) * 100)
    Show-Progress -PercentComplete $percentComplete -Status "Creating $testProjName"
    
    dotnet new xunit -n $testProjName --framework "net8.0"
    dotnet sln add "$testProjName/$testProjName.csproj"
}

Write-Host "`nAdding project references..." -ForegroundColor Cyan

# Add project references
dotnet add "$solutionName.Api/$solutionName.Api.csproj" reference "$solutionName.Application/$solutionName.Application.csproj"
dotnet add "$solutionName.Application/$solutionName.Application.csproj" reference "$solutionName.Core/$solutionName.Core.csproj"
dotnet add "$solutionName.Infrastructure/$solutionName.Infrastructure.csproj" reference "$solutionName.Core/$solutionName.Core.csproj"
dotnet add "$solutionName.Api/$solutionName.Api.csproj" reference "$solutionName.Infrastructure/$solutionName.Infrastructure.csproj"

Write-Host "`nInstalling NuGet packages..." -ForegroundColor Cyan

# Package installation with progress tracking
$allPackages = @{
    "Api" = @(
        "Microsoft.EntityFrameworkCore.Design",
        "Swashbuckle.AspNetCore",
        "Microsoft.AspNetCore.Authentication.JwtBearer",
        "Serilog.AspNetCore",
        "AutoMapper.Extensions.Microsoft.DependencyInjection"
    )
    "Infrastructure" = @(
        "Microsoft.EntityFrameworkCore.SqlServer",
        "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
        "Microsoft.EntityFrameworkCore.Tools"
    )
    "Application" = @(
        "AutoMapper",
        "FluentValidation",
        "MediatR",
        "Microsoft.Extensions.DependencyInjection"
    )
}

$totalPackages = ($allPackages.Values | Measure-Object -Property Count -Sum).Sum
$currentPackage = 0

foreach ($project in $allPackages.Keys) {
    foreach ($package in $allPackages[$project]) {
        $currentPackage++
        $percentComplete = [math]::Round(($currentPackage / $totalPackages) * 100)
        Show-Progress -PercentComplete $percentComplete -Status "Installing $package"
        
        dotnet add "$solutionName.$project/$solutionName.$project.csproj" package $package
    }
}

Write-Host "`nCreating directory structure..." -ForegroundColor Cyan

# Create directories with progress
$directories = @(
    "$solutionName.Core/Entities",
    "$solutionName.Core/Interfaces/Repositories",
    "$solutionName.Core/Interfaces/Services",
    "$solutionName.Core/Services",
    "$solutionName.Infrastructure/Data/Configurations",
    "$solutionName.Infrastructure/Data/Repositories",
    "$solutionName.Infrastructure/Identity",
    "$solutionName.Infrastructure/Services",
    "$solutionName.Application/DTOs",
    "$solutionName.Application/Mapping",
    "$solutionName.Application/Validation",
    "$solutionName.Application/Services",
    "$solutionName.Common/Constants",
    "$solutionName.Common/Enums",
    "$solutionName.Common/Extensions",
    "$solutionName.Api/Controllers"
)

$totalDirs = $directories.Count
$currentDir = 0

foreach ($dir in $directories) {
    $currentDir++
    $percentComplete = [math]::Round(($currentDir / $totalDirs) * 100)
    Show-Progress -PercentComplete $percentComplete -Status "Creating $dir"
    
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Solution created at ./$solutionName.sln" -ForegroundColor Yellow
Write-Host "`nHappy coding!`n" -ForegroundColor Cyan