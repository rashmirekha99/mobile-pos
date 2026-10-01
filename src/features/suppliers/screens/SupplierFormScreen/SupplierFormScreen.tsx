import React from 'react';
import { Text, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
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
import GetSupplierFormScreenStyles from './SupplierFormScreenStyles';
import useSupplierForm from '../../hooks/useSupplierForm';

const SupplierFormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SupplierForm'>>();
  const supplierId = route.params?.supplierId;

  const { colors } = useTheme();
  const styles = GetSupplierFormScreenStyles(colors);

  const {
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
  } = useSupplierForm(supplierId);

  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title={isEditing ? 'Edit Supplier' : 'Add Supplier'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Supplier Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter supplier name"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.multilineInput}
          placeholder="Enter address"
          placeholderTextColor={colors.INPUT_PLACEHOLDER}
          value={address}
          onChangeText={setAddress}
          multiline
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

export default SupplierFormScreen;
