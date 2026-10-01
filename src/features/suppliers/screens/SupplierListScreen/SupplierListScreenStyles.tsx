import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetSupplierListScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    listContent: {
      padding: 16,
      paddingBottom: 100,
    },
    supplierCard: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    supplierName: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      marginBottom: 4,
    },
    supplierDetail: {
      fontSize: fonts.FONT_SIZE_13,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyText: {
      fontSize: fonts.FONT_SIZE_16,
      color: colors.TEXT_TERTIARY,
      marginTop: 8,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 80,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.SHADOW,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    fabText: {
      fontSize: 28,
      color: colors.TEXT_WHITE,
      fontWeight: '400',
      marginTop: -2,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      gap: 12,
    },
    editButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: colors.PRIMARY,
      borderRadius: 8,
    },
    editButtonText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
    deleteButton: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: colors.ERROR,
      borderRadius: 8,
    },
    deleteButtonText: {
      fontSize: fonts.FONT_SIZE_12,
      fontWeight: '600',
      color: colors.TEXT_WHITE,
    },
  });
};

export default GetSupplierListScreenStyles;
