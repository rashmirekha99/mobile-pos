import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { closeDatabase, getDatabase } from '../db/database';
import { getSetting, setSetting } from './settingsService';
import { pickFile } from './filePicker';

const DB_NAME = 'mobilepos.db';
const BACKUP_FOLDER = Platform.OS === 'android'
  ? `${RNFS.DownloadDirectoryPath}/MobilePOS-Backups`
  : `${RNFS.DocumentDirectoryPath}/MobilePOS-Backups`;

const getDbPath = (): string => {
  if (Platform.OS === 'android') {
    return `${RNFS.DocumentDirectoryPath}/../databases/${DB_NAME}`;
  }
  return `${RNFS.LibraryDirectoryPath}/LocalDatabase/${DB_NAME}`;
};

const ensureBackupFolder = async () => {
  const exists = await RNFS.exists(BACKUP_FOLDER);
  if (!exists) {
    await RNFS.mkdir(BACKUP_FOLDER);
  }
};

const removeSqliteSidecars = async (dbPath: string): Promise<void> => {
  for (const suffix of ['-wal', '-shm', '-journal']) {
    const sidecarPath = `${dbPath}${suffix}`;
    if (await RNFS.exists(sidecarPath)) {
      await RNFS.unlink(sidecarPath);
    }
  }
};

const validateDatabaseFile = async (sourcePath: string): Promise<void> => {
  const stat = await RNFS.stat(sourcePath);
  if (!Number(stat.size)) {
    throw new Error('The selected backup file is empty.');
  }

  const dbPath = getDbPath();
  const validationName = `mobilepos-validation-${Date.now()}.db`;
  const validationPath = `${dbPath.substring(0, dbPath.lastIndexOf('/') + 1)}${validationName}`;
  let validationDb: SQLiteDatabase | null = null;

  try {
    await RNFS.copyFile(sourcePath, validationPath);
    validationDb = await SQLite.openDatabase({ name: validationName, location: 'default' });
    const [integrityResult] = await validationDb.executeSql('PRAGMA quick_check;');
    const integrity = integrityResult.rows.length > 0
      ? integrityResult.rows.item(0).quick_check
      : null;
    if (integrity !== 'ok') {
      throw new Error('The selected file is not a valid, readable database backup.');
    }

    const [tableResult] = await validationDb.executeSql(
      "SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name IN ('products', 'sales');",
    );
    if (tableResult.rows.item(0).count !== 2) {
      throw new Error('The selected database is missing MobilePOS data tables.');
    }
  } finally {
    if (validationDb) {
      await validationDb.close();
    }
    await removeSqliteSidecars(validationPath).catch(() => {});
    if (await RNFS.exists(validationPath)) {
      await RNFS.unlink(validationPath);
    }
  }
};

const restoreDatabaseFile = async (sourcePath: string): Promise<void> => {
  await validateDatabaseFile(sourcePath);

  const dbPath = getDbPath();
  const dbDirectory = dbPath.substring(0, dbPath.lastIndexOf('/') + 1);
  const restoreStagePath = `${dbDirectory}mobilepos-restore-${Date.now()}.db`;
  const rollbackPath = `${dbDirectory}mobilepos-rollback-${Date.now()}.db`;
  let hasRollback = false;
  let preserveRollback = false;

  await RNFS.copyFile(sourcePath, restoreStagePath);
  try {
    await closeDatabase();
    await removeSqliteSidecars(dbPath);
    if (await RNFS.exists(dbPath)) {
      await RNFS.copyFile(dbPath, rollbackPath);
      hasRollback = true;
      await RNFS.unlink(dbPath);
    }

    await RNFS.moveFile(restoreStagePath, dbPath);
    await getDatabase();
  } catch (error) {
    await closeDatabase().catch(() => {});
    if (hasRollback && await RNFS.exists(rollbackPath)) {
      try {
        if (await RNFS.exists(dbPath)) await RNFS.unlink(dbPath);
        await removeSqliteSidecars(dbPath).catch(() => {});
        await RNFS.copyFile(rollbackPath, dbPath);
        await getDatabase();
      } catch {
        preserveRollback = true;
        throw new Error(`Restore failed. Your previous database copy was preserved at ${rollbackPath}.`);
      }
    } else {
      await getDatabase().catch(() => {});
    }
    throw error;
  } finally {
    if (await RNFS.exists(restoreStagePath)) await RNFS.unlink(restoreStagePath);
    if (!preserveRollback && await RNFS.exists(rollbackPath)) await RNFS.unlink(rollbackPath);
  }
};

export interface BackupFile {
  name: string;
  path: string;
  date: string;
  size: number;
}

export const backupDatabase = async (): Promise<string> => {
  const dbPath = getDbPath();
  const exists = await RNFS.exists(dbPath);
  if (!exists) {
    throw new Error('Database file not found');
  }

  await ensureBackupFolder();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `mobilepos-backup-${timestamp}-${Date.now()}.db`;
  const backupPath = `${BACKUP_FOLDER}/${backupName}`;
  const temporaryPath = `${backupPath}.creating`;

  await closeDatabase();
  try {
    await RNFS.copyFile(dbPath, temporaryPath);
    await validateDatabaseFile(temporaryPath);
    await RNFS.moveFile(temporaryPath, backupPath);
  } catch (error) {
    if (await RNFS.exists(temporaryPath)) await RNFS.unlink(temporaryPath);
    throw error;
  } finally {
    await getDatabase();
  }

  return backupPath;
};

export const shareBackup = async (backupPath: string): Promise<void> => {
  await Share.open({
    url: `file://${backupPath}`,
    type: 'application/octet-stream',
    title: 'Save POS Backup',
  });
};

const toBackupFile = (f: RNFS.ReadDirItem): BackupFile => ({
  name: f.name,
  path: f.path,
  date: f.mtime
    ? f.mtime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown',
  size: Math.round((f.size || 0) / 1024),
});

export const getBackupList = async (): Promise<BackupFile[]> => {
  await ensureBackupFolder();

  const allFiles: BackupFile[] = [];
  const seenPaths = new Set<string>();

  // Scan the dedicated backup folder
  try {
    const files = await RNFS.readDir(BACKUP_FOLDER);
    for (const f of files) {
      if (f.name.endsWith('.db') && !f.isDirectory()) {
        allFiles.push(toBackupFile(f));
        seenPaths.add(f.path);
      }
    }
  } catch {}

  // Also scan Downloads root for any .db backup files
  if (Platform.OS === 'android') {
    try {
      const dlFiles = await RNFS.readDir(RNFS.DownloadDirectoryPath);
      for (const f of dlFiles) {
        if (
          f.name.startsWith('mobilepos-backup') &&
          f.name.endsWith('.db') &&
          !f.isDirectory() &&
          !seenPaths.has(f.path)
        ) {
          allFiles.push(toBackupFile(f));
        }
      }
    } catch {}
  }

  return allFiles.sort((a, b) => {
    // Sort by name descending (newest timestamp first)
    return b.name.localeCompare(a.name);
  });
};

export const restoreFromBackup = async (backupPath: string): Promise<void> => {
  const exists = await RNFS.exists(backupPath);
  if (!exists) {
    throw new Error('Backup file not found');
  }

  await restoreDatabaseFile(backupPath);
};

export const deleteBackup = async (backupPath: string): Promise<void> => {
  await RNFS.unlink(backupPath);
};

const AUTO_BACKUP_PREFIX = 'mobilepos-auto-backup-';
const MAX_AUTO_BACKUPS = 7;

const cleanOldAutoBackups = async (): Promise<void> => {
  try {
    await ensureBackupFolder();
    const files = await RNFS.readDir(BACKUP_FOLDER);
    const autoBackups = files
      .filter(f => f.name.startsWith(AUTO_BACKUP_PREFIX) && f.name.endsWith('.db') && !f.isDirectory())
      .sort((a, b) => b.name.localeCompare(a.name));

    for (let i = MAX_AUTO_BACKUPS; i < autoBackups.length; i++) {
      await RNFS.unlink(autoBackups[i].path).catch(() => {});
    }
  } catch {}
};

export const autoBackupIfNeeded = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    const lastAutoBackup = await getSetting(db, 'last_auto_backup_date');
    const today = new Date().toISOString().slice(0, 10);

    if (lastAutoBackup === today) return;

    const dbPath = getDbPath();
    const exists = await RNFS.exists(dbPath);
    if (!exists) return;

    await ensureBackupFolder();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupName = `${AUTO_BACKUP_PREFIX}${timestamp}.db`;
    const backupPath = `${BACKUP_FOLDER}/${backupName}`;
    const temporaryPath = `${backupPath}.creating`;

    await closeDatabase();
    try {
      await RNFS.copyFile(dbPath, temporaryPath);
      await RNFS.moveFile(temporaryPath, backupPath);
    } catch (error) {
      if (await RNFS.exists(temporaryPath)) await RNFS.unlink(temporaryPath);
      throw error;
    } finally {
      await getDatabase();
    }

    const db2 = await getDatabase();
    await setSetting(db2, 'last_auto_backup_date', today);
    await cleanOldAutoBackups();
  } catch (error) {
    console.warn('Auto-backup failed:', error);
  }
};

export const restoreFromFilePicker = async (): Promise<void> => {
  const file = await pickFile();

  try {
    if (!file.name.toLowerCase().endsWith('.db')) {
      throw new Error('Please select a valid .db backup file');
    }
    await restoreDatabaseFile(file.path);
  } finally {
    // The native picker copies the chosen file to cache for JS access.
    await RNFS.unlink(file.path).catch(() => {});
  }
};
