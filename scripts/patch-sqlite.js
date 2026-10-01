const fs = require('fs');
const path = require('path');

// Patch react-native-sqlite-storage: replace jcenter() with mavenCentral()
const sqlitePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-sqlite-storage',
  'platforms',
  'android',
  'build.gradle',
);

if (fs.existsSync(sqlitePath)) {
  let content = fs.readFileSync(sqlitePath, 'utf8');
  if (content.includes('jcenter()')) {
    content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
    fs.writeFileSync(sqlitePath, content, 'utf8');
    console.log('Patched react-native-sqlite-storage: replaced jcenter() with mavenCentral()');
  }
}

// Patch react-native-thermal-receipt-printer-image-qr: fix proguard + bump compileSdk
const thermalPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-thermal-receipt-printer-image-qr',
  'android',
  'build.gradle',
);

if (fs.existsSync(thermalPath)) {
  let content = fs.readFileSync(thermalPath, 'utf8');
  let patched = false;
  if (content.includes("proguard-android.txt'")) {
    content = content.replace(
      "getDefaultProguardFile('proguard-android.txt')",
      "getDefaultProguardFile('proguard-android-optimize.txt')",
    );
    patched = true;
  }
  if (content.includes('compileSdkVersion = 32')) {
    content = content
      .replace('compileSdkVersion = 32', 'compileSdkVersion = 34')
      .replace('buildToolsVersion = "32.0.0"', 'buildToolsVersion = "34.0.0"')
      .replace('targetSdkVersion 32', 'targetSdkVersion 34');
    patched = true;
  }
  if (patched) {
    fs.writeFileSync(thermalPath, content, 'utf8');
    console.log('Patched react-native-thermal-receipt-printer-image-qr: fixed proguard + bumped compileSdk to 34');
  }
}

// Patch react-native-print: bump compileSdkVersion from 31 to 34
const printPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-print',
  'android',
  'build.gradle',
);

if (fs.existsSync(printPath)) {
  let content = fs.readFileSync(printPath, 'utf8');
  if (content.includes('compileSdkVersion = 31')) {
    content = content
      .replace('buildToolsVersion = "31.0.0"', 'buildToolsVersion = "34.0.0"')
      .replace('compileSdkVersion = 31', 'compileSdkVersion = 34')
      .replace('targetSdkVersion 29', 'targetSdkVersion 34');
    fs.writeFileSync(printPath, content, 'utf8');
    console.log('Patched react-native-print: bumped compileSdkVersion to 34');
  }
}
