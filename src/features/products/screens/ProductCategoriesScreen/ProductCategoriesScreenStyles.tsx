import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetProductCategoriesScreenStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MAIN_BACKGROUND,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: fonts.FONT_SIZE_18,
    fontWeight: '700',
    color: colors.TEXT_PRIMARY,
  },
  addCategoryButton: {
    backgroundColor: colors.PRIMARY_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addCategoryButtonText: {
    fontSize: fonts.FONT_SIZE_12,
    fontWeight: '700',
    color: colors.PRIMARY,
  },
  list: {
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
  categoryRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.DIVIDER,
  },
  alternateRow: {
    backgroundColor: colors.REPORT_ROW_ALT,
  },
  categoryName: {
    color: colors.TEXT_PRIMARY,
    fontSize: fonts.FONT_SIZE_16,
    fontWeight: '600',
  },
  categoryHint: {
    marginTop: 4,
    color: colors.TEXT_TERTIARY,
    fontSize: fonts.FONT_SIZE_10,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.TEXT_TERTIARY,
    fontSize: fonts.FONT_SIZE_14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.CARD_BACKGROUND,
  },
  modalTitle: {
    marginBottom: 14,
    color: colors.TEXT_PRIMARY,
    fontSize: fonts.FONT_SIZE_18,
    fontWeight: '700',
  },
  nameInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.INPUT_BORDER,
    borderRadius: 10,
    color: colors.INPUT_TEXT,
    backgroundColor: colors.INPUT_BACKGROUND,
    fontSize: fonts.FONT_SIZE_16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.MAIN_BACKGROUND,
  },
  cancelButtonText: {
    color: colors.TEXT_SECONDARY,
    fontSize: fonts.FONT_SIZE_14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.PRIMARY,
  },
  saveButtonText: {
    color: colors.TEXT_WHITE,
    fontSize: fonts.FONT_SIZE_14,
    fontWeight: '700',
  },
});

export default GetProductCategoriesScreenStyles;
