import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../shared/theme/types';
import { fonts } from '../../../../shared/theme';

const GetServiceListScreenStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.MAIN_BACKGROUND,
    },
    listContent: {
      padding: 16,
      paddingBottom: 100,
    },
    serviceCard: {
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
    serviceInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    serviceName: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '600',
      color: colors.TEXT_PRIMARY,
      flex: 1,
    },
    servicePrice: {
      fontSize: fonts.FONT_SIZE_16,
      fontWeight: '700',
      color: colors.PRIMARY,
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
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#010450',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      overflow: 'hidden',
    },
    fabGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
    },
    fabText: {
      fontSize: 28,
      color: '#FFFFFF',
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
      borderRadius: 8,
      overflow: 'hidden',
    },
    editButtonGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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

export default GetServiceListScreenStyles;
