import React, { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import { getDatabase } from '../../../../shared/db/database';
import {
  addProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  ProductCategory,
  updateProductCategory,
} from '../../services/categoryService';
import GetProductCategoriesScreenStyles from './ProductCategoriesScreenStyles';

const ProductCategoriesScreen = () => {
  const { colors } = useTheme();
  const styles = GetProductCategoriesScreenStyles(colors);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const db = await getDatabase();
      setCategories(await getAllProductCategories(db));
    } catch (error) {
      console.error('Failed to load product categories:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories]),
  );

  const handleSaveCategory = async () => {
    const name = categoryName.trim();
    if (!name) {
      Alert.alert('Category Name', 'Enter a category name.');
      return;
    }
    try {
      const db = await getDatabase();
      if (editingCategoryId === null) {
        await addProductCategory(db, name);
      } else {
        await updateProductCategory(db, editingCategoryId, name);
      }
      setCategoryName('');
      setEditingCategoryId(null);
      setShowAddModal(false);
      await loadCategories();
    } catch (error: any) {
      if (String(error?.message || '').toLowerCase().includes('unique')) {
        Alert.alert('Category Exists', 'A category with this name already exists.');
      } else {
        Alert.alert('Error', error?.message || 'Failed to add category.');
      }
    }
  };

  const handleDeleteCategory = (category: ProductCategory) => {
    Alert.alert(
      'Delete Category',
      `Delete "${category.name}"? Products in this category will remain, but become uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await deleteProductCategory(db, category.id);
              await loadCategories();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete category.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Product Categories" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => {
              setEditingCategoryId(null);
              setCategoryName('');
              setShowAddModal(true);
            }}>
            <Text style={styles.addCategoryButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet. Add one to organize products.</Text>
        ) : (
          <View style={styles.list}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryRow, index % 2 === 1 && styles.alternateRow]}
                onPress={() => {
                  setEditingCategoryId(category.id);
                  setCategoryName(category.name);
                  setShowAddModal(true);
                }}
                onLongPress={() => handleDeleteCategory(category)}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryHint}>Tap to edit · Long press to delete</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingCategoryId === null ? 'Add Category' : 'Edit Category'}</Text>
            <TextInput
              style={styles.nameInput}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Category name"
              placeholderTextColor={colors.INPUT_PLACEHOLDER}
              autoFocus
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={handleSaveCategory}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setCategoryName('');
                  setShowAddModal(false);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
                <Text style={styles.saveButtonText}>{editingCategoryId === null ? 'Add' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductCategoriesScreen;
