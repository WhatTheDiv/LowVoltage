// @ts-nocheck
import React, {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
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
  secondaryButton_outlined,
  tertiaryButton_noBorder,
} from "../../components/buttons";
import { router } from "expo-router";
import {
  setProjectName,
  setStreet,
  setCity,
  setZip,
  setState,
  removeZone,
} from "../../store/newProject_slice";
import { useDispatch, useSelector } from "react-redux";
import { render_field, createField } from "../../components/textFields";
import { addZone, setZone } from "../../store/newProject_slice";

const NewProject_zones = () => {
  const dispatch = useDispatch();
  const [targetedInput, setTargetedInput] = useState("");

  const currentZones = useSelector((state) => state.newProject.zones);

  const { screenHeight: height, screenWidth: width } = useSelector(
    (state) => state.ui
  );
  const calcSpacing = height * 0.05;

  const fields = [
    createField("newZoneName", "Zone name", setZone),
    createField("newZoneLocation", "Zone Location", setZone),
  ];

  const bus = {
    targetedInput,
    setTargetedInput,
    useSelector,
    dispatch,
    currentZones,
    width,
  };

  return (
    <ScrollView
      style={[gs.flex1, gs.appBackground, { paddingTop: calcSpacing }]}
      showsVerticalScrollIndicator={false}
    >
      {render_existingZones(bus)}

      {fields.map((field, i, arr) => {
        return (
          <View key={i} style={[]}>
            {render_field(field, bus, 0, {
              last: i === arr.length - 1 ? true : false,
              submit: handle_addZone(dispatch),
            })}
          </View>
        );
      })}

      <View
        style={[
          gs.flex_row,
          gs.marginH10,
          { paddingTop: calcSpacing, paddingBottom: calcSpacing * 2 },
        ]}
      >
        <View style={[gs.flex1]}>
          {secondaryButton_outlined("Add Zone", handle_addZone(dispatch))}
        </View>
        <View style={[gs.flex1, { gap: 20 }]}>
          {tertiaryButton_noBorder("Back", handle_back, appBackground2)}
        </View>
      </View>
    </ScrollView>
  );
};

const render_existingZones = ({ currentZones, dispatch, width }) => {
  if (currentZones.length < 1) return null;

  return (
    <View style={[{ paddingBottom: 30 }]}>
      <Text style={[gs.text_white, { paddingBottom: 10 }]}>Added zones:</Text>
      <View style={[]}>
        {currentZones.map((z, i) => (
          <View key={i} style={[gs.flex_row, gs.align_center]}>
            <Pressable
              style={[gs.paddingH20, gs.paddingV10]}
              onPress={() => handle_removeZone(z.name, dispatch)}
            >
              <Text style={[gs.text_large, gs.text_red]}>x</Text>
            </Pressable>
            <Text
              style={[
                gs.text_large,
                gs.text_gray,
                { marginLeft: 20, flexShrink: 0, width: width * 0.2 },
              ]}
            >
              {z.name}
            </Text>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
              <Text
                style={[gs.text_large, gs.text_gray, { marginLeft: 20 }]}
                numberOfLines={1}
              >
                {z.location}
              </Text>
            </ScrollView>
          </View>
        ))}
      </View>
    </View>
  );
};

const handle_back = () => {
  router.back();
};
const handle_addZone = (dispatch) => {
  return () => {
    dispatch(addZone({}));
  };
};
const handle_removeZone = (zoneName, dispatch) => {
  dispatch(removeZone({ zoneName }));
};

export default NewProject_zones;
