import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceListScreenStyles from './ServiceListScreenStyles';
import { Service } from '../../../../shared/types';
import { getDatabase } from '../../../../shared/db/database';
import { getAllServices, deleteService } from '../../services/serviceService';
import { formatCurrency } from '../../../../shared/utils/format';

const GRADIENT_COLORS = ['#02078A', '#010450', '#01022E'];
const GRADIENT_LOCATIONS = [0, 0.55, 1];

const ServiceListScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = GetServiceListScreenStyles(colors);
  const [services, setServices] = useState<Service[]>([]);

  const loadServices = useCallback(async () => {
    try {
      const db = await getDatabase();
      const data = await getAllServices(db);
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [loadServices]),
  );

  const handleDelete = (service: Service) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${service.name}"? All related sales records will also be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              await deleteService(db, service.id);
              loadServices();
            } catch {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ServiceForm', { serviceId: item.id })}>
          <LinearGradient
            colors={GRADIENT_COLORS}
            locations={GRADIENT_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.editButtonGradient}
          />
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
      <AppBar title="Services" />
      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No services added yet</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ServiceForm')}>
        <LinearGradient
          colors={GRADIENT_COLORS}
          locations={GRADIENT_LOCATIONS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        />
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ServiceListScreen;
