import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetGeneralSettingsScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginTop: 16,
      marginBottom: 6,
    },
    description: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_SECONDARY,
      marginBottom: 16,
    },
    pathHint: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginBottom: 6,
      fontStyle: 'italic',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: colors.INPUT_BACKGROUND,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: fonts.FONT_SIZE_16,
      color: colors.INPUT_TEXT,
      borderWidth: 1,
      borderColor: colors.INPUT_BORDER,
    },
    percentSign: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    saveButton: {
      marginTop: 28,
    },
    divider: {
      height: 1,
      backgroundColor: colors.DIVIDER,
      marginVertical: 28,
    },
    backupRow: {
      flexDirection: 'row',
      gap: 12,
    },
    backupButton: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContent: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: fonts.FONT_SIZE_18,
      fontWeight: '700',
      color: colors.TEXT_PRIMARY,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalEmpty: {
      fontSize: fonts.FONT_SIZE_14,
      color: colors.TEXT_TERTIARY,
      textAlign: 'center',
      paddingVertical: 24,
    },
    backupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.MAIN_BACKGROUND,
      borderRadius: 10,
      marginBottom: 8,
      overflow: 'hidden',
    },
    backupItemInfo: {
      flex: 1,
      padding: 14,
    },
    backupItemName: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
    },
    backupItemDate: {
      fontSize: fonts.FONT_SIZE_12,
      color: colors.TEXT_TERTIARY,
      marginTop: 2,
    },
    backupDeleteBtn: {
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    backupDeleteText: {
      fontSize: fonts.FONT_SIZE_14,
      fontWeight: '700',
      color: colors.ERROR,
    },
    modalActions: {
      marginTop: 12,
    },
    modalCloseBtn: {
      marginTop: 12,
      alignItems: 'center',
      paddingVertical: 12,
    },
    modalCloseBtnText: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_SECONDARY,
    },
  });
};

export default GetGeneralSettingsScreenStyles;
