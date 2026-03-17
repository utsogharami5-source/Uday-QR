# Uday QR

A premium, high-resolution QR code scanner and generator Progressive Web Application (PWA) built specifically to marry native Android capabilities with sleek iOS-minimal design principles.

## 🌟 Features

- **High-Resolution Scanning**: Requests optimal 1080p camera feeds so QR codes are detected instantly without zoom distortion or pixelation. Full edge-to-edge camera viewport using `object-cover`.
- **Beautiful iOS-Minimal UI**: Every screen is meticulously crafted with frosted-glass effects (`backdrop-blur`), subtle shadows, and segmented controls for both Light and Dark modes.
- **Smart Generator**: Instantly generate high-quality QR codes for URLs, Wi-Fi networks, Contacts, and raw text.
- **Persistent Activity History**: Uses `dexie` (IndexedDB) to save all your scanned and generated QR codes locally.
- **Auto-Update System**: Custom built-in checker that pings this repository's `version.json` file on launch and prompts the user with a sleek download toast if a newer version is available!

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (with native dark mode support)
- **Routing**: React Router DOM
- **Native Bridge**: Capacitor (Android)
- **Scanning Engine**: Html5-Qrcode
- **Database**: Dexie.js 

## 🚀 Building for Android

Prerequisites:
- Node.js & npm
- Android Studio (with SDKs)
- Java JDK

```bash
# 1. Install dependencies
npm install

# 2. Build the web assets and sync to Capacitor
npm run build:android

# 3. Compile the debug APK (Windows)
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
cd app/android
gradlew.bat assembleDebug
```
The APK will be available in `app/android/app/build/outputs/apk/debug/`.

## 📦 Releasing an Update

Because of the built-in auto-updater, pushing a new version to your users is extremely simple:

1. Bump the `version` inside `app/package.json`.
2. Re-run the Android build to generate the new APK.
3. Upload the APK to GitHub Releases in this repository.
4. Update the `app/public/version.json` file in this repository with the new version number and the direct `download/url` to the APK. 

The next time users open their app, they will automatically be prompted to update!
