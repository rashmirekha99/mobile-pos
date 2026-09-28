import { useEffect, useState } from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getDatabase } from '../db/database';

const useDatabase = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const database = await getDatabase();
        setDb(database);
        setIsReady(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };
    init();
  }, []);

  return { db, isReady };
};

export default useDatabase;
