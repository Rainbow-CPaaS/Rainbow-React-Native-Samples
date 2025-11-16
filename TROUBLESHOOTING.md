# Rainbow SDK for React Native - Troubleshooting Guide

This guide provides solutions to common issues encountered when setting up and running the Rainbow SDK in React Native applications.

## Table of Contents
1. [Android Manifest Merge Conflict](#android-manifest-merge-conflict)
2. [Gradle Plugin Version Warning](#gradle-plugin-version-warning)
3. [Namespace Deprecation Warning](#namespace-deprecation-warning)
4. [Build Failures](#build-failures)

## Android Manifest Merge Conflict

### Error
```
Attribute application@allowBackup value=(false) from AndroidManifest.xml is also present at [com.ale:rainbowsdk:2.55.0-beta.2] AndroidManifest.xml value=(true)
```

### Solution

1. Open `android/app/src/debug/AndroidManifest.xml`
2. Update the manifest tag to include the tools namespace:
   ```xml 
   <manifest 
       xmlns:android="http://schemas.android.com/apk/res/android"
       xmlns:tools="http://schemas.android.com/tools">
   ```
3. Add `tools:replace="android:allowBackup"` to the application tag:
   ```xml
   <application
       android:allowBackup="false"
       tools:replace="android:allowBackup"
       ...>
   ```

## Gradle Plugin Version Warning

### Warning
```
WARNING: We recommend using a newer Android Gradle plugin to use compileSdk = 34
This Android Gradle plugin (7.4.2) was tested up to compileSdk = 33
```

### Solution

#### Option 1: Update Gradle Plugin (Recommended)
1. Open `android/build.gradle`
2. Update the Gradle plugin version:
   ```gradle
   dependencies {
       classpath 'com.android.tools.build:gradle:8.0.0' // or newer
       // Keep other dependencies
   }
   ```

#### Option 2: Suppress the Warning
Add to `android/gradle.properties`:
```
android.suppressUnsupportedCompileSdk=34
```

## Namespace Deprecation Warning

### Warning
```
Setting the namespace via a source AndroidManifest.xml's package attribute is deprecated.
```

### Solution
1. Open `android/app/build.gradle`
2. Add the namespace to the android block:
   ```gradle
   android {
       namespace "com.yourapp.package"  // Replace with your package name
       // ... rest of your config
   }
   ```

## Build Failures

### Common Fixes
1. **Clean and Rebuild**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

2. **Invalidate Caches** (Android Studio):
   - Go to File > Invalidate Caches / Restart...
   - Select "Invalidate and Restart"

3. **Check Environment**:
   ```bash
   npx react-native doctor
   ```

## Still Need Help?

If you're still experiencing issues:
1. Check the [Rainbow SDK Documentation](https://developers.openrainbow.com/doc/sdk/reactnative/overview)
2. Search existing [GitHub Issues](https://github.com/Rainbow-CPaaS/Rainbow-React-Native-Samples/issues)
3. Open a new issue with:
   - Full error logs
   - Steps to reproduce
   - Environment details (OS, Node.js version, etc.)
   - Screenshots if applicable

---

*Last updated: November 2025 | Rainbow RN SDK v1.12.0*
