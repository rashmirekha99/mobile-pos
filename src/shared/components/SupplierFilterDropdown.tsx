import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Supplier } from '../types';
import useTheme from '../theme/useTheme';
import { fonts } from '../theme';
import { ThemeColors } from '../theme/types';

interface SupplierFilterDropdownProps {
  suppliers: Supplier[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const SupplierFilterDropdown = ({
  suppliers,
  selectedId,
  onSelect,
}: SupplierFilterDropdownProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [visible, setVisible] = useState(false);

  const selected = suppliers.find((s) => s.id === selectedId);

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}>
        <Text
          style={[
            styles.dropdownText,
            !selected && styles.dropdownPlaceholder,
          ]}>
          {selected ? selected.name : 'All Suppliers'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Supplier</Text>
            <TouchableOpacity
              style={[
                styles.modalOption,
                selectedId === null && styles.modalOptionActive,
              ]}
              onPress={() => {
                onSelect(null);
                setVisible(false);
              }}>
              <Text
                style={[
                  styles.modalOptionText,
                  selectedId === null && styles.modalOptionTextActive,
                ]}>
                All Suppliers
              </Text>
            </TouchableOpacity>
            <FlatList
              data={suppliers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    selectedId === item.id && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    onSelect(item.id);
                    setVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedId === item.id && styles.modalOptionTextActive,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
      marginBottom: 16,
    },
    dropdownText: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.INPUT_TEXT,
      flex: 1,
    },
    dropdownPlaceholder: {
      color: colors.INPUT_PLACEHOLDER,
    },
    dropdownArrow: {
      fontSize: fonts.FONT_SIZE_10,
      color: colors.TEXT_SECONDARY,
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    modalContent: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxHeight: 400,
    },
    modalTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 12,
    },
    modalOption: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 4,
    },
    modalOptionActive: {
      backgroundColor: colors.PRIMARY_LIGHT,
    },
    modalOptionText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_PRIMARY,
    },
    modalOptionTextActive: {
      color: colors.PRIMARY,
      fontWeight: '600',
    },
  });

export default SupplierFilterDropdown;
