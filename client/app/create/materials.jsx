// @ts-nocheck
import React, { View, Text, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import gs, { appBackground2 } from "../../assets/globalStyles";
import {
  secondaryButton_outlined,
  tertiaryButton_noBorder,
} from "../../components/buttons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

const NewProject_materials = () => {
  const dispatch = useDispatch();

  const { screenHeight: height } = useSelector((state) => state.ui);
  const calcSpacing = height * 0.05;

  return (
    <ScrollView
      style={[gs.flex1, gs.appBackground, { paddingTop: calcSpacing }]}
    >
      <View style={[gs.flex_row, { paddingTop: calcSpacing }]}>
        <View style={[gs.flex1, { gap: 20 }]}>
          {tertiaryButton_noBorder("Skip", handle_skip, appBackground2)}
        </View>
        <View style={[gs.flex1]}>
          {secondaryButton_outlined("Add Material", handle_addMaterial)}
        </View>
      </View>
    </ScrollView>
  );
};

const handle_skip = () => {
  router.push("NewProject_devices");
};
const handle_addMaterial = (name) => {
  return () => {};
};

export default NewProject_materials;
