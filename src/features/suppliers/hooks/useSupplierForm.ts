import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getDatabase } from '../../../shared/db/database';
import {
  getSupplierById,
  insertSupplier,
  updateSupplier,
} from '../services/supplierService';

const useSupplierForm = (supplierId?: number) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (supplierId) {
      loadSupplier(supplierId);
    }
  }, [supplierId]);

  const loadSupplier = async (id: number) => {
    try {
      const db = await getDatabase();
      const supplier = await getSupplierById(db, id);
      if (supplier) {
        setName(supplier.name);
        setPhone(supplier.phone || '');
        setEmail(supplier.email || '');
        setAddress(supplier.address || '');
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to load supplier:', error);
    }
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Supplier name is required');
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<boolean> => {
    if (!validate()) return false;

    setIsLoading(true);
    try {
      const db = await getDatabase();
      const supplierData = {
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
      };

      if (isEditing && supplierId) {
        await updateSupplier(db, supplierId, supplierData);
      } else {
        await insertSupplier(db, supplierData);
      }
      return true;
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save supplier');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    isLoading,
    isEditing,
    handleSave,
  };
};

export default useSupplierForm;
