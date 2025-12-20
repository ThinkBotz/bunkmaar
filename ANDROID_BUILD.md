# Building Android APK for BunkMaar

This guide explains how to build the Android APK application for BunkMaar.

## What's Included

The Android APK setup includes:

- ✅ **Capacitor Integration** - Bridges web app to native Android
- ✅ **Complete Android Project** - Full Android Studio project in `/android` directory
- ✅ **NPM Build Scripts** - Convenient commands for building APKs
- ✅ **App Configuration** - Properly configured with:
  - App ID: `com.bunkmaar.app`
  - App Name: `BunkMaar`
  - Package: `com.bunkmaar.app`
- ✅ **Gradle Build System** - Standard Android build tools
- ✅ **PWA Assets** - All web assets automatically synced to Android
- ✅ **Default Icons & Splash Screens** - Ready-to-customize resources

## Prerequisites

Before building the Android app, ensure you have:

1. **Node.js** (v16 or higher)
2. **Android Studio** with Android SDK installed
3. **Java Development Kit (JDK)** 11 or higher
4. **Android SDK** with the following components:
   - Android SDK Platform 33 or higher
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

### Setting up Android Studio

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio and go to **Tools > SDK Manager**
3. Install the required SDK components mentioned above
4. Set the `ANDROID_HOME` environment variable:
   ```bash
   # On Linux/macOS (add to ~/.bashrc or ~/.zshrc)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   
   # On Windows (set in System Environment Variables)
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

## Building the APK

### Method 1: Using NPM Scripts (Recommended)

#### Debug APK (for testing)
```bash
npm run android:build
```

This will:
1. Build the web application (`npm run build`)
2. Sync web assets to Android project (`npx cap sync android`)
3. Build a debug APK using Gradle

The generated APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK (for distribution)
```bash
npm run android:build:release
```

**Note:** For release builds, you'll need to sign the APK with a keystore. See the "Signing the APK" section below.

The generated APK will be located at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Method 2: Manual Build Steps

1. **Build the web application:**
   ```bash
   npm run build
   ```

2. **Sync web assets to Android:**
   ```bash
   npx cap sync android
   ```

3. **Build the APK using Gradle:**
   ```bash
   cd android
   ./gradlew assembleDebug    # For debug build
   # or
   ./gradlew assembleRelease  # For release build
   cd ..
   ```

## Opening the Project in Android Studio

To open and build the project in Android Studio:

```bash
npm run android:open
```

This will open the Android project in Android Studio, where you can:
- Build and run the app on an emulator or physical device
- Debug the application
- Customize native Android features
- Generate signed APKs through the Build menu

## Signing the APK for Release

To distribute your app, you need to sign the release APK:

### 1. Create a Keystore

```bash
keytool -genkey -v -keystore bunkmaar-release.keystore -alias bunkmaar -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts to set a password and enter your information.

### 2. Configure Signing in Gradle

Edit `android/app/build.gradle` and add:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../bunkmaar-release.keystore")
            storePassword "your-keystore-password"
            keyAlias "bunkmaar"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

**Security Note:** Never commit your keystore file or passwords to version control!

### 3. Build Signed APK

```bash
npm run android:build:release
```

The signed APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Installing the APK

### On Android Emulator or Device via USB

```bash
npm run android:run
```

### Manual Installation

1. Transfer the APK file to your Android device
2. Enable "Install from Unknown Sources" in device settings
3. Open the APK file on your device to install

## Troubleshooting

### Gradle Build Fails

- Ensure you have the correct Android SDK installed
- Check that `ANDROID_HOME` is set correctly
- Try cleaning the build: `cd android && ./gradlew clean`

### Sync Issues

If web assets aren't syncing properly:
```bash
npx cap sync android --force
```

### App Crashes on Startup

- Check that the web build completed successfully
- Verify that all assets are in `android/app/src/main/assets/public`
- Check Android Logcat for error messages

## Project Structure

```
bunkmaar/
├── android/                      # Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/   # Web assets (auto-generated)
│   │   │   ├── java/            # Native Android code
│   │   │   └── res/             # Android resources
│   │   └── build.gradle         # App-level build configuration
│   └── build.gradle             # Project-level build configuration
├── capacitor.config.ts          # Capacitor configuration
└── dist/                        # Web build output (synced to Android)
```

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run android:sync` | Sync web assets to Android project |
| `npm run android:open` | Open project in Android Studio |
| `npm run android:build` | Build debug APK |
| `npm run android:build:release` | Build release APK |
| `npm run android:run` | Build and run on device/emulator |

---

**Happy Building! 🚀**
