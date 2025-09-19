# QuizFolio Java Setup Script
Write-Host "🔧 QuizFolio Java Setup for Android Development" -ForegroundColor Green
Write-Host ""

# Check if Java is already installed
Write-Host "🔍 Checking for existing Java installations..." -ForegroundColor Yellow

# Check common Java installation paths
$javaPaths = @(
    "C:\Program Files\Java",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Microsoft\jdk*",
    "C:\Program Files (x86)\Java"
)

$foundJava = $false
foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        Write-Host "Found Java installation at: $path" -ForegroundColor Green
        Get-ChildItem $path | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
        $foundJava = $true
    }
}

if (-not $foundJava) {
    Write-Host "❌ No Java installation found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 DOWNLOAD JAVA JDK:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://adoptium.net/temurin/releases/" -ForegroundColor White
    Write-Host "2. Download: Eclipse Temurin 11 (LTS) - Windows x64 MSI" -ForegroundColor White
    Write-Host "3. Install with default settings" -ForegroundColor White
    Write-Host "4. Run this script again after installation" -ForegroundColor White
    Write-Host ""
    
    # Open the download page
    $openPage = Read-Host "Open download page in browser? (y/n)"
    if ($openPage -eq 'y' -or $openPage -eq 'Y') {
        Start-Process "https://adoptium.net/temurin/releases/"
    }
    
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

# Try to find the best Java version
$javaHome = ""
foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        $jdkFolders = Get-ChildItem $path | Where-Object { $_.Name -like "*jdk*" -or $_.Name -like "*temurin*" }
        if ($jdkFolders) {
            $javaHome = $jdkFolders[0].FullName
            break
        }
    }
}

if ($javaHome) {
    Write-Host "Setting JAVA_HOME to: $javaHome" -ForegroundColor Green
    
    # Set environment variables for current session
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
    
    Write-Host ""
    Write-Host "✅ Java environment configured for current session!" -ForegroundColor Green
    Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
    
    # Test Java
    Write-Host ""
    Write-Host "🧪 Testing Java installation..." -ForegroundColor Yellow
    try {
        $javaVersion = & "$javaHome\bin\java.exe" -version 2>&1
        Write-Host "Java version output:" -ForegroundColor Green
        $javaVersion | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
        
        Write-Host ""
        Write-Host "🚀 Ready to build APK!" -ForegroundColor Green
        Write-Host "Run: npx cap run android --target=1011825398106171" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Java test failed: $_" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ Could not automatically configure Java" -ForegroundColor Red
    Write-Host "Please set JAVA_HOME manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 Your TECNO phone is ready: 1011825398106171" -ForegroundColor Cyan
Write-Host "Backend server should be running on: http://192.168.1.101:5000" -ForegroundColor Cyan 