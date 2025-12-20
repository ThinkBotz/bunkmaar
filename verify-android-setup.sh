#!/bin/bash

# Verification script for Android APK setup
# This script checks if all necessary files and configurations are in place
# Note: We don't use 'set -e' because we want to continue checking all items
# even if some checks fail, to provide a complete report

echo "🔍 Verifying Android APK Setup for BunkMaar..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
checks_passed=0
checks_failed=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
        ((checks_passed++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing file: $1"
        ((checks_failed++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: $1"
        ((checks_passed++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        ((checks_failed++))
        return 1
    fi
}

# Function to check if string exists in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Content found in $1: $2"
        ((checks_passed++))
        return 0
    else
        echo -e "${RED}✗${NC} Content not found in $1: $2"
        ((checks_failed++))
        return 1
    fi
}

echo "1. Checking Capacitor configuration..."
check_file "capacitor.config.ts"
check_content "capacitor.config.ts" "com.bunkmaar.app"
check_content "capacitor.config.ts" "BunkMaar"
echo ""

echo "2. Checking Android project structure..."
check_dir "android"
check_dir "android/app"
check_dir "android/app/src"
check_dir "android/app/src/main"
echo ""

echo "3. Checking essential Android files..."
check_file "android/build.gradle"
check_file "android/app/build.gradle"
check_file "android/gradlew"
check_file "android/app/src/main/AndroidManifest.xml"
check_file "android/app/src/main/java/com/bunkmaar/app/MainActivity.java"
echo ""

echo "4. Checking package.json scripts..."
check_content "package.json" "android:build"
check_content "package.json" "android:sync"
check_content "package.json" "android:open"
echo ""

echo "5. Checking Capacitor dependencies..."
check_content "package.json" "@capacitor/core"
check_content "package.json" "@capacitor/android"
check_content "package.json" "@capacitor/cli"
echo ""

echo "6. Checking documentation..."
check_file "ANDROID_BUILD.md"
check_content "README.md" "Android"
echo ""

echo "7. Checking web build output..."
check_dir "dist"
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓${NC} Web build exists: dist/index.html"
    ((checks_passed++))
else
    echo -e "${YELLOW}⚠${NC} Web build not found - run 'npm run build' first"
fi
echo ""

echo "8. Checking Android resources..."
check_dir "android/app/src/main/res"
check_file "android/app/src/main/res/values/strings.xml"
echo ""

# Summary
echo "================================================"
echo "Summary:"
echo -e "${GREEN}Passed: $checks_passed${NC}"
if [ $checks_failed -gt 0 ]; then
    echo -e "${RED}Failed: $checks_failed${NC}"
else
    echo -e "${GREEN}Failed: 0${NC}"
fi
echo "================================================"
echo ""

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}✓ Android APK setup is complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure Android Studio and Android SDK are installed"
    echo "2. Set ANDROID_HOME environment variable"
    echo "3. Run 'npm run android:build' to build the APK"
    echo ""
    echo "For detailed instructions, see ANDROID_BUILD.md"
    exit 0
else
    echo -e "${RED}✗ Android setup has issues. Please check the errors above.${NC}"
    exit 1
fi
