import { View, Platform, StyleSheet, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import React, { useState } from "react";
import Store from "../store/store";
import { Provider } from "react-redux";
import gs, { appBackground } from "../assets/globalStyles";

const RootLayout = () => {
  const statusBarStyle = {
    height: Platform.OS === "android" ? 30 : 0,
    backgroundColor: useColorScheme() === "dark" ? appBackground : "white",
  };

  console.log("");
  console.log("------ App Start ------");
  console.log("");

  // [ ] fix routing when canceling 'add zone' for example, delete route stack
  // [ ] add materials, zones, devices pages functionality
  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <Provider store={Store}>
        <View style={[statusBarStyle]} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="fallback" options={{ headerShown: false }} />
          <Stack.Screen name="existing" options={{ headerShown: false }} />
          <Stack.Screen name="create" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RootLayout;
