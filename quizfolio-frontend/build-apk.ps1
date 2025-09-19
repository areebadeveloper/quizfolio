# QuizFolio APK Build Script
Write-Host "🚀 Building QuizFolio APK..." -ForegroundColor Green

# Build the web app
Write-Host "📱 Building Ionic app..." -ForegroundColor Yellow
ionic build

# Sync with Capacitor
Write-Host "🔄 Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android

# Navigate to Android project
Write-Host "📂 Navigating to Android project..." -ForegroundColor Yellow
cd android

# Build debug APK
Write-Host "🔨 Building debug APK..." -ForegroundColor Yellow
./gradlew assembleDebug

# Build release APK (unsigned)
Write-Host "🔨 Building release APK..." -ForegroundColor Yellow
./gradlew assembleRelease

Write-Host "✅ APK Build Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 APK Files Location:" -ForegroundColor Cyan
Write-Host "Debug APK: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host "Release APK: android\app\build\outputs\apk\release\app-release-unsigned.apk" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your QuizFolio app is ready for deployment!" -ForegroundColor Green 