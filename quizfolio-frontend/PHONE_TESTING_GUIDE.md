# 📱 QuizFolio Phone Testing Guide

## 🎯 **Current Status**
- ✅ Your TECNO phone is connected (ID: 1011825398106171)
- ✅ Backend configured for network access (192.168.1.101:5000)
- ✅ Frontend built with network IP configuration
- ❌ Java JDK required for building APK

## 🔧 **Quick Java Setup (Required)**

### **Option 1: Install Java JDK (Recommended)**
1. **Download**: https://adoptium.net/temurin/releases/
2. **Choose**: Eclipse Temurin 11 (LTS) - Windows x64 MSI
3. **Install** with default settings
4. **Restart** your terminal/PowerShell
5. **Run**: `npx cap run android --target=1011825398106171`

### **Option 2: Use Android Studio (Easier)**
Since Java setup can be tricky, use Android Studio which has built-in Java:

1. **Open Android Studio** (already installed)
2. **File** → **Open** → Navigate to: `E:\1 Orders\quizfolio\quizfolio-frontend\android`
3. **Wait for Gradle sync**
4. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
5. **Install APK** on your phone manually

## 📱 **Testing Steps**

### **Step 1: Start Backend**
```powershell
cd quizfolio-backend
node server.js
```
Backend will run on: `http://192.168.1.101:5000`

### **Step 2: Install App on Phone**

**Method A: Direct Run (if Java works)**
```powershell
cd quizfolio-frontend
npx cap run android --target=1011825398106171
```

**Method B: Build APK manually**
1. Build APK in Android Studio
2. APK location: `android\app\build\outputs\apk\debug\app-debug.apk`
3. Copy APK to phone and install

### **Step 3: Test Network Connection**

**Before testing the app**, verify network connectivity:

1. **On your phone**, open browser
2. **Visit**: `http://192.168.1.101:5000/api/send-email/status`
3. **You should see**: JSON response with email service status

## 🌐 **Network Configuration**

### **Configured API Endpoint**
- **Local IP**: `192.168.1.101:5000`
- **CORS**: Enabled for your network
- **Phone Access**: Configured

### **WiFi Requirements**
- Ensure phone and computer are on the **same WiFi network**
- Computer IP: `192.168.1.101`
- Backend Port: `5000`

## 🧪 **Testing Checklist**

### **Backend Tests**
- [ ] Backend server running
- [ ] Accessible via network IP
- [ ] Email service status working
- [ ] CORS configured for mobile

### **Frontend Tests**
- [ ] App builds successfully
- [ ] Network IP configured
- [ ] API endpoints updated
- [ ] Capacitor sync completed

### **Phone Tests**
- [ ] Phone connected via USB
- [ ] Developer options enabled
- [ ] USB debugging enabled
- [ ] Same WiFi network
- [ ] Can access backend via browser

## 🚀 **Quick Commands**

### **Build and Run**
```powershell
# Terminal 1: Start backend
cd quizfolio-backend
node server.js

# Terminal 2: Run on phone
cd quizfolio-frontend
npx cap run android --target=1011825398106171
```

### **Alternative: Manual APK Install**
```powershell
# Build app
ionic build
npx cap sync android

# Open in Android Studio
npx cap open android
# Then build APK in Android Studio
```

## 📧 **Test Email Feature**

Once app is running on phone:
1. **Open QuizFolio** app
2. **Navigate** to email test section
3. **Send test email** to: `mailtonooralam@gmail.com`
4. **Check backend logs** for email processing

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Java not found**: Install JDK 11 from adoptium.net
2. **Network connection failed**: Check WiFi and IP address
3. **CORS errors**: Restart backend after CORS config change
4. **Phone not detected**: Enable USB debugging

### **Network Tests**
```powershell
# Test if backend is accessible
curl http://192.168.1.101:5000/api/send-email/status

# Check your IP address
ipconfig | findstr IPv4
```

## 🎉 **Success Indicators**

✅ **Backend**: Console shows email service ready
✅ **Network**: Phone can access backend via browser  
✅ **App**: QuizFolio opens and loads properly
✅ **Features**: Email and quiz functions work

---

**Your QuizFolio app is configured for network testing! 📱**

**Next Step**: Install Java JDK or use Android Studio to build and run the app! 