# Stryde SG - Quick Start Guide

## ⚠️ CRITICAL: Always Run Commands from Project Directory

**YOU MUST BE IN THE PROJECT DIRECTORY:**
```bash
cd /c/Users/timhe/Stryde-SG
```

**Verify you're in the right place:**
```bash
pwd
# Should output: /c/Users/timhe/Stryde-SG
# NOT: /c/Users/timhe
```

## Quick Start

1. **Navigate to project directory:**
   ```bash
   cd /c/Users/timhe/Stryde-SG
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npx expo start --clear
   ```

4. **Open on web:**
   - Press `w` in the terminal
   - Or open browser to `http://localhost:8081`

5. **Open on phone:**
   - Install "Expo Go" app
   - Scan the QR code in terminal

## Troubleshooting

### Blank Screen Issue - FIXED
The app now ALWAYS shows "Loading Stryde SG..." within 100ms. If you still see a blank screen:

1. Make sure you're in the project directory:
   ```bash
   cd /c/Users/timhe/Stryde-SG
   pwd  # verify
   ```

2. Pull latest changes:
   ```bash
   git pull origin copilot/build-full-working-prototype
   ```

3. Clean install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npx expo start --clear
   ```

### If expo-doctor Shows Errors

**IGNORE expo-doctor if you run it from wrong directory!**

Run from project directory:
```bash
cd /c/Users/timhe/Stryde-SG  # MUST BE HERE
npx expo-doctor
```

All dependencies are already installed. The errors you saw were because you ran it from `C:\Users\timhe` instead of the project.

### Clean Your Home Directory

If you accidentally installed packages in `C:\Users\timhe`, clean them up:
```bash
cd /c/Users/timhe
rm -rf node_modules package-lock.json
```

Then go back to project:
```bash
cd /c/Users/timhe/Stryde-SG
```

## What to Expect

1. **Within 100ms**: "Loading Stryde SG..." spinner appears
2. **Within 1-2 seconds**: Onboarding screen appears (first launch)
3. **After onboarding**: Tutorial screen
4. **After tutorial**: Main app with 5 tabs

## Key Points

- ✅ All dependencies are already installed
- ✅ `.expo/` is already in `.gitignore`
- ✅ `metro.config.js` already extends `expo/metro-config`
- ✅ Blank screen is fixed - app always renders within 100ms
- ⚠️ **ALWAYS** run commands from `/c/Users/timhe/Stryde-SG`

## Still Having Issues?

1. Verify you're in project directory: `pwd`
2. Check git branch: `git branch` (should show `copilot/build-full-working-prototype`)
3. Pull latest: `git pull origin copilot/build-full-working-prototype`
4. Clean start: `npx expo start --clear`
