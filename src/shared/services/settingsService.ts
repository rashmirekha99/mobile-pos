import { SQLiteDatabase } from 'react-native-sqlite-storage';

export const getSetting = async (
  db: SQLiteDatabase,
  key: string,
): Promise<string | null> => {
  const [result] = await db.executeSql(
    'SELECT value FROM settings WHERE key = ?;',
    [key],
  );
  if (result.rows.length > 0) {
    return result.rows.item(0).value;
  }
  return null;
};

export const setSetting = async (
  db: SQLiteDatabase,
  key: string,
  value: string,
): Promise<void> => {
  await db.executeSql(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);',
    [key, value],
  );
};
