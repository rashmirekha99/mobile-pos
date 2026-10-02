import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import { closeDatabase, getDatabase } from '../db/database';
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
  const backupName = `mobilepos-backup-${timestamp}.db`;
  const backupPath = `${BACKUP_FOLDER}/${backupName}`;

  await RNFS.copyFile(dbPath, backupPath);

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

  await closeDatabase();

  const dbPath = getDbPath();
  await RNFS.copyFile(backupPath, dbPath);

  await getDatabase();
};

export const deleteBackup = async (backupPath: string): Promise<void> => {
  await RNFS.unlink(backupPath);
};

export const restoreFromFilePicker = async (): Promise<void> => {
  const file = await pickFile();

  if (!file.name.endsWith('.db')) {
    throw new Error('Please select a valid .db backup file');
  }

  await closeDatabase();

  const dbPath = getDbPath();
  await RNFS.copyFile(file.path, dbPath);

  // Clean up temp file
  await RNFS.unlink(file.path).catch(() => {});

  await getDatabase();
};
