import React from 'react';
import { Text, TextInput, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../../shared/navigators/RootStackParamsList';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetServiceFormScreenStyles from './ServiceFormScreenStyles';
import useServiceForm from '../../hooks/useServiceForm';

const ServiceFormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceForm'>>();
  const serviceId = route.params?.serviceId;

  const { colors } = useTheme();
  const styles = GetServiceFormScreenStyles(colors);

  const {
    name, setName,
    price, setPrice,
    isLoading, isEditing,
    handleSave,
  } = useServiceForm(serviceId);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title={isEditing ? 'Edit Service' : 'Add Service'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. A4 Print, Binding, Photocopy"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter service price"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <View style={styles.saveButton}>
          <MainButton
            title={isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            onPress={onSave}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceFormScreen;
