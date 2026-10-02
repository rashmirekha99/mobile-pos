import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../../../shared/components/AppBar';
import MainButton from '../../../../shared/components/MainButton';
import useTheme from '../../../../shared/theme/useTheme';
import GetGeneralSettingsScreenStyles from './GeneralSettingsScreenStyles';
import { useSettingsStore } from '../../../../shared/store/settingsStore';
import { getDatabase } from '../../../../shared/db/database';
import { getSetting, setSetting } from '../../../../shared/services/settingsService';
import {
  backupDatabase,
  shareBackup,
  getBackupList,
  restoreFromBackup,
  restoreFromFilePicker,
  deleteBackup,
  BackupFile,
} from '../../../../shared/services/backupService';

const GeneralSettingsScreen = () => {
  const { colors } = useTheme();
  const styles = GetGeneralSettingsScreenStyles(colors);
  const { profitMargin, setProfitMargin } = useSettingsStore();
  const [marginInput, setMarginInput] = useState(profitMargin.toString());
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [showBackupList, setShowBackupList] = useState(false);
  const [backups, setBackups] = useState<BackupFile[]>([]);

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

  const loadBackups = useCallback(async () => {
    try {
      const list = await getBackupList();
      setBackups(list);
    } catch {}
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

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const path = await backupDatabase();
      Alert.alert('Backup Created', 'Your data has been backed up.', [
        { text: 'OK' },
        {
          text: 'Share',
          onPress: async () => {
            try {
              await shareBackup(path);
            } catch (e: any) {
              if (e?.message !== 'User did not share') {
                Alert.alert('Share Failed', e?.message || 'Could not share backup');
              }
            }
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Backup Failed', error?.message || 'Could not create backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const openRestoreList = async () => {
    await loadBackups();
    setShowBackupList(true);
  };

  const handleRestore = (backup: BackupFile) => {
    Alert.alert(
      'Restore Backup',
      `This will replace ALL current data with:\n\n${backup.name}\n(${backup.date})\n\nThis cannot be undone. Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setShowBackupList(false);
            setRestoreLoading(true);
            try {
              await restoreFromBackup(backup.path);
              Alert.alert(
                'Restored',
                'Data restored successfully. Please restart the app for all changes to take effect.',
              );
            } catch (error: any) {
              Alert.alert('Restore Failed', error?.message || 'Could not restore backup');
            } finally {
              setRestoreLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleBrowseFile = () => {
    setShowBackupList(false);
    Alert.alert(
      'Restore from File',
      'This will replace ALL current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Browse',
          onPress: async () => {
            setRestoreLoading(true);
            try {
              await restoreFromFilePicker();
              Alert.alert(
                'Restored',
                'Data restored successfully. Please restart the app for all changes to take effect.',
              );
            } catch (error: any) {
              if (error?.message !== 'User cancelled file picker' && error?.code !== 'CANCELLED') {
                Alert.alert('Restore Failed', error?.message || 'Could not restore backup');
              }
            } finally {
              setRestoreLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleDeleteBackup = (backup: BackupFile) => {
    Alert.alert('Delete Backup', `Delete "${backup.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBackup(backup.path);
            await loadBackups();
          } catch {
            Alert.alert('Error', 'Failed to delete backup');
          }
        },
      },
    ]);
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

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Backup & Restore</Text>
        <Text style={styles.description}>
          Create a backup of all your data. You can share it to Google Drive, email, etc. Restore
          anytime from saved backups.
        </Text>
        <Text style={styles.pathHint}>
          Backups are saved to: Download/MobilePOS-Backups/
        </Text>
        <Text style={styles.pathHint}>
          To restore from another device, copy the .db file to the above folder.
        </Text>

        <View style={styles.backupRow}>
          <View style={styles.backupButton}>
            <MainButton
              title={backupLoading ? 'Creating...' : 'Backup Now'}
              onPress={handleBackup}
              disabled={backupLoading}
            />
          </View>
          <View style={styles.backupButton}>
            <MainButton
              title={restoreLoading ? 'Restoring...' : 'Restore'}
              onPress={openRestoreList}
              disabled={restoreLoading}
              outline
            />
          </View>
        </View>
        {(backupLoading || restoreLoading) && (
          <ActivityIndicator style={{ marginTop: 12 }} color={colors.PRIMARY} />
        )}
      </ScrollView>

      <Modal
        visible={showBackupList}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBackupList(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBackupList(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Backup to Restore</Text>
            {backups.length === 0 ? (
              <Text style={styles.modalEmpty}>
                No backups found. Create one first using "Backup Now".
              </Text>
            ) : (
              <FlatList
                data={backups}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                  <View style={styles.backupItem}>
                    <TouchableOpacity
                      style={styles.backupItemInfo}
                      onPress={() => handleRestore(item)}>
                      <Text style={styles.backupItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.backupItemDate}>
                        {item.date} · {item.size} KB
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.backupDeleteBtn}
                      onPress={() => handleDeleteBackup(item)}>
                      <Text style={styles.backupDeleteText}>X</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
            <View style={styles.modalActions}>
              <MainButton title="Browse File" onPress={handleBrowseFile} />
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowBackupList(false)}>
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default GeneralSettingsScreen;
