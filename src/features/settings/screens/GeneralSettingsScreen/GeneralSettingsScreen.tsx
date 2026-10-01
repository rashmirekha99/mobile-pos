import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetGeneralSettingsScreenStyles from './GeneralSettingsScreenStyles';
import { useSettingsStore } from '../../../../shared/store/settingsStore';
import { getDatabase } from '../../../../shared/db/database';
import { getSetting, setSetting } from '../../../../shared/services/settingsService';

const GeneralSettingsScreen = () => {
  const { colors } = useTheme();
  const styles = GetGeneralSettingsScreenStyles(colors);
  const { profitMargin, setProfitMargin } = useSettingsStore();
  const [marginInput, setMarginInput] = useState(profitMargin.toString());

  useEffect(() => {
    const loadMargin = async () => {
      try {
        const db = await getDatabase();
        const saved = await getSetting(db, 'profit_margin');
        if (saved) {
          const val = parseFloat(saved);
          if (!isNaN(val) && val >= 0) {
            setProfitMargin(val);
            setMarginInput(val.toString());
          }
        }
      } catch {}
    };
    loadMargin();
  }, []);

  const handleSave = async () => {
    const val = parseFloat(marginInput);
    if (isNaN(val) || val < 0) {
      Alert.alert('Validation', 'Please enter a valid percentage (0 or above)');
      return;
    }
    try {
      const db = await getDatabase();
      await setSetting(db, 'profit_margin', val.toString());
      setProfitMargin(val);
      Alert.alert('Saved', `Profit margin set to ${val}%`);
    } catch {
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AppBar title="General Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Profit Margin</Text>
        <Text style={styles.description}>
          This percentage is used to auto-calculate selling price from buying price.
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="30"
            placeholderTextColor={colors.INPUT_PLACEHOLDER}
            value={marginInput}
            onChangeText={setMarginInput}
            keyboardType="decimal-pad"
          />
          <Text style={styles.percentSign}>%</Text>
        </View>
        <View style={styles.saveButton}>
          <MainButton title="Save" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralSettingsScreen;
