import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import useTheme from '../theme/useTheme';
import GetAppBarStyles from './AppBarStyles';

interface RightAction {
  icon: React.ReactNode;
  onPress: () => void;
}

interface AppBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  rightActions?: RightAction[];
}

const AppBar = ({
  title,
  showBackButton = true,
  onBackPress,
  rightIcon,
  onRightPress,
  rightActions,
}: AppBarProps) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = GetAppBarStyles(colors);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.APPBAR_BACKGROUND}
      />
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <View style={styles.titleRow}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  fill={colors.APPBAR_TITLE}
                />
              </Svg>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          {rightActions && rightActions.length > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {rightActions.map((action, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.rightButton}
                  onPress={action.onPress}>
                  {action.icon}
                </TouchableOpacity>
              ))}
            </View>
          ) : rightIcon ? (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}>
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      </View>
    </>
  );
};

export default AppBar;
