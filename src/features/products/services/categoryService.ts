import { SQLiteDatabase } from 'react-native-sqlite-storage';

export interface ProductCategory {
  id: number;
  name: string;
  created_at: string;
}

export const getAllProductCategories = async (
  db: SQLiteDatabase,
): Promise<ProductCategory[]> => {
  const [results] = await db.executeSql(
    'SELECT * FROM product_categories ORDER BY name COLLATE NOCASE ASC',
  );
  const categories: ProductCategory[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    categories.push(results.rows.item(i));
  }
  return categories;
};

export const addProductCategory = async (
  db: SQLiteDatabase,
  name: string,
): Promise<void> => {
  await db.executeSql('INSERT INTO product_categories (name) VALUES (?)', [name.trim()]);
};

export const updateProductCategory = async (
  db: SQLiteDatabase,
  categoryId: number,
  name: string,
): Promise<void> => {
  await db.executeSql(
    'UPDATE product_categories SET name = ? WHERE id = ?',
    [name.trim(), categoryId],
  );
};

export const deleteProductCategory = async (
  db: SQLiteDatabase,
  categoryId: number,
): Promise<void> => {
  await db.executeSql('UPDATE products SET category_id = NULL WHERE category_id = ?', [categoryId]);
  await db.executeSql('DELETE FROM product_categories WHERE id = ?', [categoryId]);
};
