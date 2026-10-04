import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from '../theme/useTheme';
import { fonts } from '../theme';
import { ThemeColors } from '../theme/types';

interface CategoryOption {
  id: number;
  name: string;
}

interface CategoryFilterDropdownProps {
  categories: CategoryOption[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryFilterDropdown = ({ categories, selectedId, onSelect }: CategoryFilterDropdownProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [visible, setVisible] = useState(false);
  const selected = categories.find(category => category.id === selectedId);

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setVisible(true)}>
        <Text style={[styles.dropdownText, !selected && styles.dropdownPlaceholder]} numberOfLines={1}>
          {selected?.name || 'All Categories'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <TouchableOpacity
              style={[styles.modalOption, selectedId === null && styles.modalOptionActive]}
              onPress={() => { onSelect(null); setVisible(false); }}>
              <Text style={[styles.modalOptionText, selectedId === null && styles.modalOptionTextActive]}>
                All Categories
              </Text>
            </TouchableOpacity>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalOption, selectedId === item.id && styles.modalOptionActive]}
                  onPress={() => { onSelect(item.id); setVisible(false); }}>
                  <Text style={[styles.modalOptionText, selectedId === item.id && styles.modalOptionTextActive]}>
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

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.INPUT_BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.INPUT_BORDER,
    marginBottom: 16,
  },
  dropdownText: {
    flex: 1,
    fontSize: fonts.FONT_SIZE_14,
    color: colors.INPUT_TEXT,
  },
  dropdownPlaceholder: {
    color: colors.INPUT_PLACEHOLDER,
  },
  dropdownArrow: {
    marginLeft: 6,
    fontSize: fonts.FONT_SIZE_10,
    color: colors.TEXT_SECONDARY,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    maxHeight: 400,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.CARD_BACKGROUND,
  },
  modalTitle: {
    marginBottom: 12,
    fontSize: fonts.FONT_SIZE_18,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },
  modalOption: {
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
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

export default CategoryFilterDropdown;
