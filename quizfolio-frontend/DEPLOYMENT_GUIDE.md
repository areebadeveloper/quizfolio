# 🚀 QuizFolio Deployment Guide

## 📱 Building APK File

### Prerequisites
1. **Java JDK 11 or higher**
   - Download from: https://adoptium.net/
   - Install and add to PATH
   - Set JAVA_HOME environment variable

2. **Android Studio** (Already installed ✅)
3. **Node.js** (Already installed ✅)
4. **Ionic CLI** (Already installed ✅)

### Quick Setup Commands

#### 1. Install Java JDK
```powershell
# Download and install JDK from https://adoptium.net/
# Then set environment variables:
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.x-hotspot"
$env:PATH += ";$env:JAVA_HOME\bin"
```

#### 2. Build APK
```powershell
# Navigate to frontend directory
cd quizfolio-frontend

# Build the web app
ionic build

# Sync with Capacitor
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug
```

## 🌐 Backend Deployment Options

### Option 1: Render.com (Free, Easy)
1. Push your backend to GitHub
2. Connect Render.com to your GitHub repo
3. Deploy using the provided `render.yaml` configuration
4. Update frontend API URLs

### Option 2: Railway.app (Easy, $5/month)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway deploy`

### Option 3: Heroku (Easy, $7/month)
1. Install Heroku CLI
2. Create app: `heroku create quizfolio-backend`
3. Deploy: `git push heroku main`

## 📱 APK Build Locations

After successful build, APK files will be located at:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🔧 Environment Configuration

### Frontend Environment
Update `src/config/environment.ts` with your deployed backend URL:
```typescript
export const environmentProd = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api'
};
```

### Backend Environment Variables
Required environment variables for production:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_USER=geekasad@gmail.com
```

## 🚀 Quick Deploy Script

Use the provided `build-apk.ps1` script for one-command APK building:
```powershell
./build-apk.ps1
```

## 📱 Testing Your APK

### Install on Device
1. Enable "Developer Options" on your Android device
2. Enable "USB Debugging"
3. Transfer APK to device
4. Install APK
5. Test all features

### Test in Emulator
```powershell
npx cap run android
```

## 🔄 Update Process

When you make changes:
1. Update frontend code
2. Run `ionic build`
3. Run `npx cap sync android`
4. Rebuild APK: `./gradlew assembleDebug`

## 🎯 Production Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] SendGrid email service verified
- [ ] Database connection working
- [ ] Frontend built for production
- [ ] APK generated and tested
- [ ] All features working in app

## 🆘 Troubleshooting

### Common Issues
1. **Java not found**: Install JDK and set JAVA_HOME
2. **Gradle build fails**: Ensure Android SDK is properly installed
3. **Network requests fail**: Check API URLs in environment config
4. **Email not working**: Verify SendGrid configuration

### Getting Help
- Check Android Studio build logs
- Use `ionic doctor` to diagnose issues
- Verify all prerequisites are installed

---

**Your QuizFolio app is ready for deployment! 🎉** 