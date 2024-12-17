# Backend Reorganization Script for SecureCenter GRC
# This script reorganizes the backend structure for better maintainability

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to write colored output
function Write-ColorOutput {
    param(
        [Parameter(Mandatory)]
        [string]$Message,
        
        [Parameter(Mandatory)]
        [string]$Color
    )
    Write-Host $Message -ForegroundColor $Color
}

# Define the root directory structure
$rootFolders = @(
    "src/api",         # API Layer - Routes and Controllers
    "src/config",      # Configuration Layer
    "src/core",        # Core Business Logic Layer
    "src/database",    # Database Layer
    "src/shared",      # Shared Utilities Layer
    "src/services",    # Business Services Layer
    "src/middleware",  # Middleware Layer
    "src/security"     # Security Layer
)

# Define the detailed folder structure with subfolders
$folderStructure = @{
    "src/api" = @{
        "controllers" = @(
            "auth",
            "organizations",
            "users",
            "systems",
            "risks",
            "compliance"
        )
        "routes" = @()
        "dto" = @(
            "auth",
            "organizations",
            "users",
            "systems",
            "risks",
            "compliance"
        )
    }
    "src/config" = @{
        "database" = @()
        "security" = @()
        "environment" = @()
    }
    "src/core" = @{
        "domain" = @(
            "organizations",
            "users",
            "systems",
            "risks",
            "compliance"
        )
        "interfaces" = @()
        "types" = @()
        "enums" = @()
    }
    "src/database" = @{
        "entities" = @(
            "organizations",
            "users",
            "systems",
            "risks",
            "compliance"
        )
        "migrations" = @()
        "repositories" = @()
        "seeders" = @()
    }
    "src/shared" = @{
        "constants" = @()
        "utils" = @()
        "interfaces" = @()
        "errors" = @()
    }
    "src/services" = @{
        "auth" = @()
        "organizations" = @()
        "users" = @()
        "systems" = @()
        "risks" = @()
        "compliance" = @()
        "audit" = @()
    }
    "src/middleware" = @{
        "authentication" = @()
        "validation" = @()
        "logging" = @()
        "error" = @()
    }
    "src/security" = @{
        "guards" = @()
        "decorators" = @()
        "strategies" = @()
    }
}

# Function to create directory structure
function Create-FolderStructure {
    param (
        [Parameter(Mandatory)]
        [string]$BasePath,
        [Parameter(Mandatory)]
        [hashtable]$Structure
    )

    foreach ($folder in $Structure.Keys) {
        $currentPath = Join-Path $BasePath $folder
        if (-not (Test-Path $currentPath)) {
            New-Item -ItemType Directory -Path $currentPath -Force | Out-Null
            Write-ColorOutput "Created directory: $currentPath" "Green"
        }

        if ($Structure[$folder] -is [hashtable]) {
            Create-FolderStructure -BasePath $currentPath -Structure $Structure[$folder]
        }
        elseif ($Structure[$folder] -is [array]) {
            foreach ($subfolder in $Structure[$folder]) {
                $subfolderPath = Join-Path $currentPath $subfolder
                if (-not (Test-Path $subfolderPath)) {
                    New-Item -ItemType Directory -Path $subfolderPath -Force | Out-Null
                    Write-ColorOutput "Created directory: $subfolderPath" "Green"
                }
            }
        }
    }
}

# Function to back up original files
function Backup-OriginalFiles {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "backup_$timestamp"
    
    Write-ColorOutput "Creating backup in $backupDir..." "Yellow"
    Copy-Item -Path "src" -Destination $backupDir -Recurse
    Write-ColorOutput "Backup completed" "Green"
}

# Function to move files to their new locations
function Move-Files {
    # Move entity files
    Write-ColorOutput "Moving entity files..." "Yellow"
    if (Test-Path "src/entities") {
        Move-Item -Path "src/entities/*" -Destination "src/database/entities" -Force
    }

    # Move migrations
    Write-ColorOutput "Moving migration files..." "Yellow"
    if (Test-Path "src/migrations") {
        Move-Item -Path "src/migrations/*" -Destination "src/database/migrations" -Force
    }

    # Move seeders
    Write-ColorOutput "Moving seeder files..." "Yellow"
    if (Test-Path "src/seeders") {
        Move-Item -Path "src/seeders/*" -Destination "src/database/seeders" -Force
    }

    # Move enums
    Write-ColorOutput "Moving enum files..." "Yellow"
    if (Test-Path "src/enums") {
        Move-Item -Path "src/enums/*" -Destination "src/core/enums" -Force
    }

    # Move auth files
    Write-ColorOutput "Moving auth files..." "Yellow"
    if (Test-Path "src/auth") {
        # Move guards to security/guards
        if (Test-Path "src/auth/guards") {
            Move-Item -Path "src/auth/guards/*" -Destination "src/security/guards" -Force
        }
        # Move decorators to security/decorators
        if (Test-Path "src/auth/decorators") {
            Move-Item -Path "src/auth/decorators/*" -Destination "src/security/decorators" -Force
        }
        # Move strategies to security/strategies
        if (Test-Path "src/auth/strategies") {
            Move-Item -Path "src/auth/strategies/*" -Destination "src/security/strategies" -Force
        }
        # Move DTOs to api/dto/auth
        if (Test-Path "src/auth/dto") {
            Move-Item -Path "src/auth/dto/*" -Destination "src/api/dto/auth" -Force
        }
        # Move services
        Get-ChildItem -Path "src/auth" -Filter "*service.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/services/auth" -Force
        }
        # Move controllers
        Get-ChildItem -Path "src/auth" -Filter "*controller.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/api/controllers/auth" -Force
        }
    }

    # Move organization files
    Write-ColorOutput "Moving organization files..." "Yellow"
    if (Test-Path "src/organizations") {
        # Move DTOs
        if (Test-Path "src/organizations/dto") {
            Move-Item -Path "src/organizations/dto/*" -Destination "src/api/dto/organizations" -Force
        }
        # Move services
        Get-ChildItem -Path "src/organizations" -Filter "*service.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/services/organizations" -Force
        }
        # Move controllers
        Get-ChildItem -Path "src/organizations" -Filter "*controller.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/api/controllers/organizations" -Force
        }
    }

    # Move user files
    Write-ColorOutput "Moving user files..." "Yellow"
    if (Test-Path "src/users") {
        # Move DTOs
        if (Test-Path "src/users/dto") {
            Move-Item -Path "src/users/dto/*" -Destination "src/api/dto/users" -Force
        }
        # Move services
        Get-ChildItem -Path "src/users" -Filter "*service.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/services/users" -Force
        }
        # Move controllers
        Get-ChildItem -Path "src/users" -Filter "*controller.ts" | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "src/api/controllers/users" -Force
        }
    }

    # Move additional configuration files
    Write-ColorOutput "Moving configuration files..." "Yellow"
    if (Test-Path "src/*.config.ts") {
        Move-Item -Path "src/*.config.ts" -Destination "src/config" -Force
    }
}

# Function to update import paths
function Update-ImportPaths {
    Write-ColorOutput "Updating import paths..." "Yellow"
    
    $files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        
        # Update paths based on new structure
        $content = $content -replace '\.\.\/entities\/', '\.\.\/\.\.\/database\/entities\/'
        $content = $content -replace '\.\.\/enums\/', '\.\.\/\.\.\/core\/enums\/'
        $content = $content -replace '\.\.\/auth\/', '\.\.\/\.\.\/security\/'
        $content = $content -replace '\.\.\/migrations\/', '\.\.\/\.\.\/database\/migrations\/'
        $content = $content -replace '\.\.\/seeders\/', '\.\.\/\.\.\/database\/seeders\/'
        
        # Save updated content
        Set-Content -Path $file.FullName -Value $content
        Write-ColorOutput "Updated imports in: $($file.FullName)" "Green"
    }
}

# Main execution
try {
    Write-ColorOutput "Starting backend reorganization..." "Cyan"
    
    # Create backup
    Backup-OriginalFiles
    
    # Create new directory structure
    Write-ColorOutput "Creating new folder structure..." "Cyan"
    Create-FolderStructure -BasePath "." -Structure $folderStructure
    
    # Move files to new locations
    Write-ColorOutput "Moving files to new locations..." "Cyan"
    Move-Files
    
    # Update import paths
    Write-ColorOutput "Updating import paths..." "Cyan"
    Update-ImportPaths
    
    Write-ColorOutput "Backend reorganization completed successfully!" "Green"
} catch {
    Write-ColorOutput "An error occurred during reorganization: $_" "Red"
    Write-ColorOutput "Stack trace: $($_.ScriptStackTrace)" "Red"
    exit 1
}