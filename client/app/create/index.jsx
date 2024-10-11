// @ts-nocheck
import React, { View } from "react-native";
import gs from "../../assets/globalStyles";
import { primaryButton_filled } from "../../components/buttons";
import { router } from "expo-router";

const Create = () => {
  return (
    <View
      style={[gs.flex1, gs.justify_center, gs.align_center, gs.appBackground]}
    >
      {primaryButton_filled("Create New Project", page_hop("/create/details"))}
    </View>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};

export default Create;
