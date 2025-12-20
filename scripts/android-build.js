#!/usr/bin/env node

/**
 * Cross-platform script to build the Android app
 * This script:
 * 1. Builds the web app
 * 2. Ensures Android platform exists
 * 3. Syncs web assets to Android
 * 4. Builds the Android APK
 */

import { exec } from 'child_process';
import { existsSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function run(command, description) {
  console.log(`\n▶ ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: process.cwd() });
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`✗ ${description} failed:`, error.message);
    throw error;
  }
  console.log(`✓ ${description} completed`);
}

async function main() {
  try {
    // Build web app
    await run('npm run build', 'Building web app');

    // Add Android platform if it doesn't exist
    if (!existsSync('android')) {
      await run('npx cap add android', 'Adding Android platform');
    } else {
      console.log('\n✓ Android platform already exists');
    }

    // Sync web assets to Android
    await run('npx cap sync android', 'Syncing assets to Android');

    // Build Android APK
    const gradlewCmd = process.platform === 'win32' 
      ? 'cd android && gradlew.bat assembleRelease'
      : 'cd android && ./gradlew assembleRelease';
    await run(gradlewCmd, 'Building Android APK');

    console.log('\n✓ Android build completed successfully!');
    console.log('  APK location: android/app/build/outputs/apk/release/');
  } catch (error) {
    console.error('\n✗ Build failed');
    process.exit(1);
  }
}

main();
