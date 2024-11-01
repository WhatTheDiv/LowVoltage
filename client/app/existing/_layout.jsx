// @ts-nocheck
import { View, Text, Platform, StyleSheet } from "react-native";
import { Redirect, router, Stack } from "expo-router";
import React, { useEffect } from "react";
import gs, { appBackground, appBackground2 } from "../../assets/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { appErrorMessage } from "../index";
import { IsHydrated } from "../../handlers/startup/Hydrate";
import { secondaryButton_outlined } from "../../components/buttons";
import { setError } from "../../store/ui_slice";

const ExistingProject_layout = () => {
  const dispatch = useDispatch();
  const hydrated = useSelector((state) => state.ui.hydrated);
  if (!hydrated) return <Redirect href={"/"} />;

  return (
    <View style={[gs.flex1, gs.relative]}>
      <View
        style={[
          gs.appBackground2,
          { paddingTop: Platform.OS === "android" ? 35 : 0 },
        ]}
      />
      <View style={[gs.flex1]}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
};

export default ExistingProject_layout;
