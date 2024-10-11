// @ts-nocheck
import React, {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState } from "react";
import gs, {
  appBackground2,
  gray,
  orangeColor,
  text_large,
  text_medium,
} from "../../assets/globalStyles";
import {
  primaryButton_filled,
  secondaryButton_outlined,
} from "../../components/buttons";
import { Redirect, router } from "expo-router";
import {
  setProjectName,
  setStreet,
  setCity,
  setZip,
  setState,
} from "../../store/newProject_slice";
import { useDispatch, useSelector } from "react-redux";
import { createField, render_field } from "../../components/textFields";

const Details = () => {
  const dispatch = useDispatch();
  const [targetedInput, setTargetedInput] = useState("");

  const { screenHeight: height } = useSelector((state) => state.ui);
  const calcSpacing = height * 0.05;

  const fields = [
    createField("projectName", "Project name", setProjectName),
    createField("street", "Street Address", setStreet),
    createField("city", "City", setCity),
    createField("zip", "Zip", setZip),
    createField("state", "State", setState),
  ];

  const bus = {
    fields,
    useSelector,
    dispatch,
    targetedInput,
    setTargetedInput,
  };

  return (
    <ScrollView style={[gs.flex1, gs.appBackground]}>
      <View
        style={{ paddingTop: calcSpacing, paddingBottom: calcSpacing + 35 }}
      >
        {fields.map((f, index) => render_field(f, bus, index))}
      </View>

      <View style={[gs.marginH10]}>
        <View style={[gs.flex_row, gs.flex1, { gap: 10 }]}>
          {secondaryButton_outlined("Add Zone", page_hop("/create/zones"))}
          {secondaryButton_outlined(
            "Add Materials",
            page_hop("/create/materials")
          )}
          {secondaryButton_outlined("Add Devices", page_hop("/create/devices"))}
        </View>
        <View style={[gs.marginV20]}>
          {primaryButton_filled("Finish", page_hop("/create/confirmation"))}
        </View>
      </View>
    </ScrollView>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};

const styles = StyleSheet.create({
  input: {
    container: {
      flexDirection: "row",
      borderBottomColor: appBackground2,
      marginHorizontal: 10,
    },
    text: {
      color: gray,
      fontSize: text_medium,
      alignSelf: "flex-end",
      marginHorizontal: 10,
      marginBottom: 2,
    },
    inputField: {
      fontSize: text_large,
      color: orangeColor,
      textAlign: "center",
      borderWidth: 0,
      outline: "none",
      paddingRight: 10,
      // flexGrow: 1,
      flex: 1,
      paddingTop: 35,
    },
  },
});

export default Details;
