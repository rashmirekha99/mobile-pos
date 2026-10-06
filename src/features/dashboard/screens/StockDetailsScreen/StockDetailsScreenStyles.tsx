import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetStockDetailsScreenStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MAIN_BACKGROUND,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  filterItem: {
    flex: 1,
    minWidth: 0,
  },
  tableContainer: {
    minWidth: 1230,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.REPORT_HEADER,
  },
  headerCell: {
    color: colors.TEXT_WHITE,
    fontSize: fonts.FONT_SIZE_12,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.DIVIDER,
  },
  alternateRow: {
    backgroundColor: colors.REPORT_ROW_ALT,
  },
  cell: {
    color: colors.TEXT_PRIMARY,
    fontSize: fonts.FONT_SIZE_14,
  },
  productColumn: {
    width: 160,
  },
  categoryColumn: {
    width: 130,
  },
  barcodeColumn: {
    width: 150,
  },
  numberColumn: {
    width: 40,
    marginRight: 8,
    textAlign: 'center',
  },
  supplierColumn: {
    width: 145,
  },
  priceColumn: {
    width: 120,
    textAlign: 'right',
    paddingRight: 10,
  },
  qtyColumn: {
    width: 65,
    textAlign: 'center',
  },
  costColumn: {
    width: 130,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#333',
    backgroundColor: colors.REPORT_ROW_ALT,
  },
  totalCell: {
    fontSize: fonts.FONT_SIZE_14,
    fontWeight: '800',
    color: colors.TEXT_PRIMARY,
  },
  profitSummary: {
    marginTop: 16,
    backgroundColor: colors.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.BORDER,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  profitHighlight: {
    borderTopWidth: 2,
    borderTopColor: '#333',
    marginTop: 8,
    paddingTop: 10,
  },
  profitLabel: {
    fontSize: fonts.FONT_SIZE_14,
    color: colors.TEXT_SECONDARY,
  },
  profitValue: {
    fontSize: fonts.FONT_SIZE_14,
    color: colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
  profitLabelBold: {
    fontSize: fonts.FONT_SIZE_16,
    color: colors.TEXT_PRIMARY,
    fontWeight: '800',
  },
  profitValueBold: {
    fontSize: fonts.FONT_SIZE_16,
    fontWeight: '800',
  },
  message: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.TEXT_SECONDARY,
    fontSize: fonts.FONT_SIZE_14,
  },
});

export default GetStockDetailsScreenStyles;
