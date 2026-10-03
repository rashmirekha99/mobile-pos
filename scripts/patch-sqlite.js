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

// Patch VisionCamera and explicitly link the shared Android C++ runtime.
const visionCameraCmakePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-vision-camera',
  'android',
  'CMakeLists.txt',
);
if (fs.existsSync(visionCameraCmakePath)) {
  let content = fs.readFileSync(visionCameraCmakePath, 'utf8');
  const logLib = '        ${LOG_LIB}                          # <-- Logcat logger';
  if (!content.includes('        c++_shared') && content.includes(logLib)) {
    content = content.replace(logLib, `        c++_shared\n${logLib}`);
    fs.writeFileSync(visionCameraCmakePath, content, 'utf8');
    console.log('Patched react-native-vision-camera: linked c++_shared');
  }
}
// Patch react-native-screens: link the shared Android C++ runtime.
const screensCmakePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-screens',
  'android',
  'CMakeLists.txt',
);
if (fs.existsSync(screensCmakePath)) {
  let content = fs.readFileSync(screensCmakePath, 'utf8');
  if (content.includes('target_link_libraries(rnscreens') && !content.includes('    c++_shared')) {
    content = content.replace(/    android\r?\n\)/, '    android\n    c++_shared\n)');
    fs.writeFileSync(screensCmakePath, content, 'utf8');
    console.log('Patched react-native-screens: linked c++_shared');
  }
}

const labelAdapterPath = path.join(
  __dirname, '..', 'node_modules',
  'react-native-thermal-receipt-printer-image-qr',
  'android', 'src', 'main', 'java', 'com', 'pinmi', 'react', 'printer', 'adapter', 'BLEPrinterAdapter.java',
);
if (fs.existsSync(labelAdapterPath)) {
  let content = fs.readFileSync(labelAdapterPath, 'utf8');
  const center = '    private static final byte[] CENTER_ALIGN = { 0x1B, 0X61, 0X31 };';
  if (!content.includes('LEFT_ALIGN') && content.includes(center)) {
    content = content.replace(center, center + '\n    private static final byte[] LEFT_ALIGN = { 0x1B, 0x61, 0x00 };');
  }
  if (!content.includes('public void printLabelImageBase64(')) {
    const method = [
      '    public void printLabelImageBase64(final Bitmap bitmapImage, int imageWidth, int imageHeight, Callback successCallback, Callback errorCallback) {',
      '        if (bitmapImage == null) { errorCallback.invoke("image not found"); return; }',
      '        if (this.mBluetoothSocket == null) { errorCallback.invoke("bluetooth connection is not built, may be you forgot to connectPrinter"); return; }',
      '        final BluetoothSocket socket = this.mBluetoothSocket;',
      '        try {',
      '            int[][] pixels = getPixelsSlow(bitmapImage, imageWidth, imageHeight);',
      '            OutputStream printerOutputStream = socket.getOutputStream();',
      '            printerOutputStream.write(SET_LINE_SPACE_24);',
      '            printerOutputStream.write(LEFT_ALIGN);',
      '            for (int y = 0; y < pixels.length; y += 24) {',
      '                printerOutputStream.write(SELECT_BIT_IMAGE_MODE);',
      '                printerOutputStream.write(new byte[]{(byte)(0x00ff & pixels[y].length), (byte)((0xff00 & pixels[y].length) >> 8)});',
      '                for (int x = 0; x < pixels[y].length; x++) printerOutputStream.write(recollectSlice(y, x, pixels));',
      '                printerOutputStream.write(LINE_FEED);',
      '            }',
      '            printerOutputStream.write(SET_LINE_SPACE_32);',
      '            printerOutputStream.flush();',
      '            successCallback.invoke();',
      '        } catch (IOException e) {',
      '            Log.e(LOG_TAG, "failed to print label image", e);',
      '            errorCallback.invoke(e.getMessage());',
      '        }',
      '    }',
    ].join('\n');
    content = content.replace(/\n}\s*$/, '\n' + method + '\n}\n');
  }
  fs.writeFileSync(labelAdapterPath, content, 'utf8');
}
const labelModulePath = path.join(
  __dirname, '..', 'node_modules',
  'react-native-thermal-receipt-printer-image-qr',
  'android', 'src', 'main', 'java', 'com', 'pinmi', 'react', 'printer', 'RNBLEPrinterModule.java',
);
if (fs.existsSync(labelModulePath)) {
  let content = fs.readFileSync(labelModulePath, 'utf8');
  if (!content.includes('public void printLabelImageBase64(')) {
    const method = [
      '    @ReactMethod',
      '    public void printLabelImageBase64(String base64, int imageWidth, int imageHeight, Callback successCallback, Callback errorCallback) {',
      '        if (this.adapter == null) this.adapter = BLEPrinterAdapter.getInstance();',
      '        byte[] decodedString = Base64.decode(base64, Base64.DEFAULT);',
      '        Bitmap decodedBitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);',
      '        ((BLEPrinterAdapter) this.adapter).printLabelImageBase64(decodedBitmap, imageWidth, imageHeight, successCallback, errorCallback);',
      '    }',
      '',
    ].join('\n');
    const marker = '    @ReactMethod\n    public void connectPrinter(String innerAddress, Callback successCallback, Callback errorCallback) {';
    if (!content.includes(marker)) throw new Error('Printer module insertion marker not found');
    content = content.replace(marker, method + marker);
    fs.writeFileSync(labelModulePath, content, 'utf8');
  }
}


const tsplAdapterPath = path.join(
  __dirname, '..', 'node_modules',
  'react-native-thermal-receipt-printer-image-qr',
  'android', 'src', 'main', 'java', 'com', 'pinmi', 'react', 'printer', 'adapter', 'BLEPrinterAdapter.java',
);
if (fs.existsSync(tsplAdapterPath)) {
  let content = fs.readFileSync(tsplAdapterPath, 'utf8');
  if (!content.includes('public void printTSPLLabelImageBase64(')) {
    if (!content.includes('import java.nio.charset.StandardCharsets;')) content = content.replace('import java.net.URL;', 'import java.net.URL;\nimport java.nio.charset.StandardCharsets;');
    if (!content.includes('import java.util.Locale;')) content = content.replace('import java.util.List;', 'import java.util.List;\nimport java.util.Locale;');
    const method = [
      '    public void printTSPLLabelImageBase64(final Bitmap source, int imageWidth, int imageHeight, double labelWidthMm, double labelHeightMm, double gapMm, int copies, Callback successCallback, Callback errorCallback) {',
      '        if (source == null) { errorCallback.invoke("image not found"); return; }',
      '        if (this.mBluetoothSocket == null) { errorCallback.invoke("bluetooth connection is not built, may be you forgot to connectPrinter"); return; }',
      '        try {',
      '            int[][] pixels = getPixelsSlow(source, imageWidth, imageHeight);',
      '            int width = pixels[0].length;',
      '            int height = pixels.length;',
      '            int bytesPerRow = (width + 7) / 8;',
      '            byte[] bitmap = new byte[bytesPerRow * height];',
      '            for (int y = 0; y < height; y++) {',
      '                for (int x = 0; x < width; x++) {',
      '                    int pixel = pixels[y][x];',
      '                    int alpha = (pixel >>> 24) & 0xff;',
      '                    int red = (pixel >> 16) & 0xff;',
      '                    int green = (pixel >> 8) & 0xff;',
      '                    int blue = pixel & 0xff;',
      '                    double luminance = (0.299 * red + 0.587 * green + 0.114 * blue) * alpha / 255.0 + 255.0 * (255 - alpha) / 255.0;',
      '                    if (luminance >= 127) bitmap[y * bytesPerRow + x / 8] |= (byte)(0x80 >> (x % 8));',
      '                }',
      '            }',
      '            String widthText = String.format(Locale.US, "%.2f", labelWidthMm);',
      '            String heightText = String.format(Locale.US, "%.2f", labelHeightMm);',
      '            String gapText = String.format(Locale.US, "%.2f", gapMm);',
      '            String header = "SIZE " + widthText + " mm," + heightText + " mm\\r\\n"',
      '                    + "GAP " + gapText + " mm,0 mm\\r\\n"',
      '                    + "CLS\\r\\n"',
      '                    + "BITMAP 10,0," + bytesPerRow + "," + height + ",0,";',
      '            OutputStream output = this.mBluetoothSocket.getOutputStream();',
      '            output.write(header.getBytes(StandardCharsets.US_ASCII));',
      '            output.write(bitmap);',
      '            output.write(("\\r\\nPRINT 1," + copies + "\\r\\n").getBytes(StandardCharsets.US_ASCII));',
      '            output.flush();',
      '            successCallback.invoke();',
      '        } catch (IOException e) {',
      '            Log.e(LOG_TAG, "failed to print TSPL label", e);',
      '            errorCallback.invoke(e.getMessage());',
      '        }',
      '    }',
    ].join('\n');
    content = content.replace(/\n}\s*$/, '\n' + method + '\n}\n');
    fs.writeFileSync(tsplAdapterPath, content, 'utf8');
  }
}
const tsplModulePath = path.join(
  __dirname, '..', 'node_modules',
  'react-native-thermal-receipt-printer-image-qr',
  'android', 'src', 'main', 'java', 'com', 'pinmi', 'react', 'printer', 'RNBLEPrinterModule.java',
);
if (fs.existsSync(tsplModulePath)) {
  let content = fs.readFileSync(tsplModulePath, 'utf8');
  if (!content.includes('public void printTSPLLabelImageBase64(')) {
    const method = [
      '    @ReactMethod',
      '    public void printTSPLLabelImageBase64(String base64, int imageWidth, int imageHeight, double labelWidthMm, double labelHeightMm, double gapMm, int copies, Callback successCallback, Callback errorCallback) {',
      '        if (this.adapter == null) this.adapter = BLEPrinterAdapter.getInstance();',
      '        byte[] decodedString = Base64.decode(base64, Base64.DEFAULT);',
      '        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);',
      '        ((BLEPrinterAdapter) this.adapter).printTSPLLabelImageBase64(bitmap, imageWidth, imageHeight, labelWidthMm, labelHeightMm, gapMm, copies, successCallback, errorCallback);',
      '    }',
      '',
    ].join('\n');
    const marker = '    @ReactMethod\n    public void connectPrinter(String innerAddress, Callback successCallback, Callback errorCallback) {';
    if (!content.includes(marker)) throw new Error('TSPL module insertion marker not found');
    content = content.replace(marker, method + marker);
    fs.writeFileSync(tsplModulePath, content, 'utf8');
  }
}
