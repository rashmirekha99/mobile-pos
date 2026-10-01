import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetSupplierListScreenStyles from './SupplierListScreenStyles';
import { Supplier } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getAllSuppliers, deleteSupplier } from '../../services/supplierService';

const SupplierListScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetSupplierListScreenStyles(colors);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const loadSuppliers = useCallback(async () => {
    try {
      const db = await getDatabase();
      const data = await getAllSuppliers(db);
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSuppliers();
    }, [loadSuppliers]),
  );

  const handleDelete = (supplier: Supplier) => {
    Alert.alert(
      'Delete Supplier',
      `Are you sure you want to delete "${supplier.name}"? Products linked to this supplier will be unlinked.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await deleteSupplier(db, supplier.id);
              loadSuppliers();
            } catch {
              Alert.alert('Error', 'Failed to delete supplier');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Supplier }) => (
    <View style={styles.supplierCard}>
      <Text style={styles.supplierName}>{item.name}</Text>
      {item.phone && <Text style={styles.supplierDetail}>{item.phone}</Text>}
      {item.email && <Text style={styles.supplierDetail}>{item.email}</Text>}
      {item.address && <Text style={styles.supplierDetail}>{item.address}</Text>}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('SupplierForm', { supplierId: item.id })}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="Suppliers" />
      {suppliers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No suppliers added yet</Text>
        </View>
      ) : (
        <FlatList
          data={suppliers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SupplierForm')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SupplierListScreen;
