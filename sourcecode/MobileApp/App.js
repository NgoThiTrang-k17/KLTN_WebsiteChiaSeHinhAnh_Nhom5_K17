import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider } from "styled-components/native";
import { useFonts as useMontserrat, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { theme } from "./src/infrastructure/theme";
// import { Navigation } from "./src/infrastructure/navigation";
import { AccountNavigator } from "./src/infrastructure/navigation/account.navigator";
import { AppNavigator } from "./src/infrastructure/navigation/app.navigator";

import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [montserratLoaded] = useMontserrat({
    Montserrat_400Regular,
  });

  if (!montserratLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator/>
        </NavigationContainer>
      </ThemeProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
