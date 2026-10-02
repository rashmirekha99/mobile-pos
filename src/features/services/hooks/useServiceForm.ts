import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getDatabase } from '../../../shared/db/database';
import { getServiceById, insertService, updateService } from '../services/serviceService';

const useServiceForm = (serviceId?: number) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService(serviceId);
    }
  }, [serviceId]);

  const loadService = async (id: number) => {
    try {
      const db = await getDatabase();
      const service = await getServiceById(db, id);
      if (service) {
        setName(service.name);
        setPrice(service.price.toString());
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to load service:', error);
    }
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Service name is required');
      return false;
    }
    const priceNum = parseFloat(price);
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<boolean> => {
    if (!validate()) return false;
    setIsLoading(true);
    try {
      const db = await getDatabase();
      const serviceData = {
        name: name.trim(),
        price: parseFloat(price),
      };
      if (isEditing && serviceId) {
        await updateService(db, serviceId, serviceData);
      } else {
        await insertService(db, serviceData);
      }
      return true;
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save service');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name, setName,
    price, setPrice,
    isLoading, isEditing,
    handleSave,
  };
};

export default useServiceForm;
