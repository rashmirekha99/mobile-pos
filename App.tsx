import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/shared/theme';
import RootStackNavigator from './src/shared/navigators/RootStackNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootStackNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
