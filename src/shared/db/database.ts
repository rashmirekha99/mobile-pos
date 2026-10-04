import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let dbInstance: SQLiteDatabase | null = null;

const CREATE_PRODUCTS_TABLE = `
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    price       REAL    NOT NULL,
    sku         TEXT    UNIQUE,
    barcode     TEXT    UNIQUE,
    barcode_type TEXT   DEFAULT 'CODE128',
    created_at  TEXT    DEFAULT (datetime('now','localtime'))
  );
`;

const CREATE_SALES_TABLE = `
  CREATE TABLE IF NOT EXISTS sales (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    total       REAL    NOT NULL,
    created_at  TEXT    DEFAULT (datetime('now','localtime'))
  );
`;

const CREATE_SALE_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS sale_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id     INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    quantity    INTEGER NOT NULL,
    price       REAL    NOT NULL,
    subtotal    REAL    NOT NULL,
    FOREIGN KEY (sale_id)    REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`;

const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
  CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
`;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabase({
    name: 'mobilepos.db',
    location: 'default',
  });

  await dbInstance.executeSql('PRAGMA foreign_keys = ON;');
  await dbInstance.executeSql(CREATE_PRODUCTS_TABLE);
  await dbInstance.executeSql(CREATE_SALES_TABLE);
  await dbInstance.executeSql(CREATE_SALE_ITEMS_TABLE);

  const indexStatements = CREATE_INDEXES.trim().split(';').filter(s => s.trim());
  for (const statement of indexStatements) {
    await dbInstance.executeSql(statement + ';');
  }

  await dbInstance.executeSql(
    'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);',
  );

  // Migration: add stock column if missing
  try {
    await dbInstance.executeSql(
      "ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0",
    );
  } catch (_) {
    // Column already exists
  }

  // Migration: suppliers table
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      phone       TEXT,
      email       TEXT,
      address     TEXT,
      created_at  TEXT    DEFAULT (datetime('now','localtime'))
    );
  `);

  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL COLLATE NOCASE UNIQUE,
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );
  `);

  // Migration: add buying_price and supplier_id to products
  try {
    await dbInstance.executeSql(
      "ALTER TABLE products ADD COLUMN buying_price REAL DEFAULT 0",
    );
  } catch (_) {
    // Column already exists
  }
  try {
    await dbInstance.executeSql(
      "ALTER TABLE products ADD COLUMN supplier_id INTEGER REFERENCES suppliers(id)",
    );
  } catch (_) {
    // Column already exists
  }

  // Migration: add discount column to sales
  try {
    await dbInstance.executeSql(
      "ALTER TABLE sales ADD COLUMN discount REAL NOT NULL DEFAULT 0",
    );
  } catch (_) {
    // Column already exists
  }
  try {
    await dbInstance.executeSql(
      'ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES product_categories(id)',
    );
  } catch (_) {
    // Column already exists
  }

  // Migration: record customer payment and cash change on each sale
  try {
    await dbInstance.executeSql(
      'ALTER TABLE sales ADD COLUMN received_amount REAL NOT NULL DEFAULT 0',
    );
  } catch (_) {
    // Column already exists
  }
  try {
    await dbInstance.executeSql(
      'ALTER TABLE sales ADD COLUMN change_due REAL NOT NULL DEFAULT 0',
    );
  } catch (_) {
    // Column already exists
  }

  // Migration: services table
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS services (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      price       REAL    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now','localtime'))
    );
  `);

  // Migration: service_sales table (legacy, kept for compat)
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS service_sales (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id  INTEGER NOT NULL,
      amount      REAL    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );
  `);

  // Migration: sale_service_items table (services linked to sales for unified receipts)
  await dbInstance.executeSql(`
    CREATE TABLE IF NOT EXISTS sale_service_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id     INTEGER NOT NULL,
      service_id  INTEGER NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      price       REAL    NOT NULL,
      subtotal    REAL    NOT NULL,
      FOREIGN KEY (sale_id)    REFERENCES sales(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );
  `);

  return dbInstance;
};

export const resetSalesData = async (db: SQLiteDatabase): Promise<void> => {
  await db.executeSql('DELETE FROM sale_items;');
  await db.executeSql('DELETE FROM sale_service_items;');
  await db.executeSql('DELETE FROM service_sales;');
  await db.executeSql('DELETE FROM sales;');
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
};
