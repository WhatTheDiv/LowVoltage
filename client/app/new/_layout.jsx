import { View, Text, StatusBar } from "react-native";
import React from "react";
import gs, { appBackground2, gray } from "../../assets/globalStyles";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

const _layout = () => {
  // @ts-ignore
  const hydrated = useSelector((state) => state.ui.hydrated);
  if (!hydrated) return <Redirect href={"/"} />;

  const headerOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: appBackground2 },
    headerTitleAlign: "center",
    headerBackVisible: true,
    headerTintColor: gray,
  };

  return (
    <View style={[gs.flex1]}>
      <StatusBar backgroundColor={appBackground2} animated={true} />
      <Stack>
        <Stack.Screen
          name="index"
          // @ts-ignore
          options={{ ...headerOptions, title: "Create New Project" }}
        />
        <Stack.Screen
          name="details"
          // @ts-ignore
          options={{ ...headerOptions, title: "Project Details" }}
        />
        <Stack.Screen
          name="finish"
          // @ts-ignore
          options={{ ...headerOptions, title: "Finalize Project" }}
        />
        <Stack.Screen
          name="zone/index"
          // @ts-ignore
          options={{ ...headerOptions, title: "New Zone" }}
        />
        <Stack.Screen
          name="location/index"
          // @ts-ignore
          options={{ ...headerOptions, title: "New Location" }}
        />
        <Stack.Screen
          name="device/index"
          // @ts-ignore
          options={{ ...headerOptions, title: "New Device" }}
        />
      </Stack>
    </View>
  );
};

export default _layout;
