// @ts-nocheck
import { View, Text, Platform, StyleSheet } from "react-native";
import { router, Stack, Redirect } from "expo-router";
import React, { useEffect } from "react";
import gs, {
  appBackground,
  appBackground2,
  text_xlarge,
} from "../../assets/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { appErrorMessage } from "../index";
import { resetForm } from "../../store/newProject_slice";

const NewProject_layout = () => {
  const dispatch = useDispatch();
  const hydrated = useSelector((state) => state.ui.hydrated);
  const { screenHeight: height } = useSelector((state) => state.ui);
  if (!hydrated) return <Redirect href={"/"} />;

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: appBackground2,
    },
    headerTitleAlign: "center",
  };

  useEffect(() => {
    return () => {
      dispatch(resetForm({ reset: true }));
    };
  }, []);

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <View style={[gs.flex1]}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              ...screenOptions,
              headerTitle: render_header("Create New Project"),
            }}
          />
          <Stack.Screen
            name="details"
            options={{
              ...screenOptions,
              headerTitle: render_header("Create New Project"),
            }}
          />
          <Stack.Screen
            name="zones"
            options={{
              ...screenOptions,
              headerTitle: render_header("Zones"),
            }}
          />
          <Stack.Screen
            name="devices"
            options={{
              ...screenOptions,
              headerTitle: render_header("Devices"),
            }}
          />
          <Stack.Screen
            name="materials"
            options={{
              ...screenOptions,
              headerTitle: render_header("Materials"),
            }}
          />
          <Stack.Screen
            name="confirmation"
            options={{
              ...screenOptions,
              headerTitle: render_header("Confirm"),
            }}
          />
        </Stack>
      </View>
    </View>
  );
};

const render_header = (title) => {
  return () => (
    <View style={[{ paddingBottom: 20 }]}>
      <Text style={[gs.text_xlarge]}>{title}</Text>
    </View>
  );
};

export default NewProject_layout;
