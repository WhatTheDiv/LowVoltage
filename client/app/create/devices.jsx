import React, {
  View,
  Text,
  // @ts-ignore
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useState } from "react";
// @ts-ignore
import gs, {
  appBackground2,
  gray,
  gray_a,
  text_large,
  text_medium,
  text_small,
} from "../../assets/globalStyles";
import {
  primaryButton_filled,
  secondaryButton_outlined,
  // @ts-ignore
  tertiaryButton_noBorder,
} from "../../components/buttons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { render_field, createField } from "../../components/textFields";
import {
  setDevice,
  addDevice,
  clearDevice,
  // @ts-ignore
  removeDevice,
} from "../../store/newProject_slice";

const NewProject_devices = () => {
  const dispatch = useDispatch();
  const [targetedInput, setTargetedInput] = useState("");
  const [expandedDevice, setExpandedDevice] = useState("");

  const { screenHeight: height, screenWidth: width } = useSelector(
    // @ts-ignore
    (state) => state.ui
  );
  const calcSpacing = height * 0.05;

  // @ts-ignore
  const currentDevices = useSelector((state) => state.newProject.devices);

  const fields = [
    createField("newDeviceName", "Nickname", setDevice),
    createField("newDeviceManufacturer", "Manufacturer", setDevice),
    createField("newDeviceModel", "Model number", setDevice),
    createField("newDeviceCategory", "Category", setDevice),
    createField("newDeviceSubcategory", "Subcategory", setDevice),
    createField("newDevicDescription", "Description", setDevice),
    createField("newDeviceColor", "Color", setDevice),
    createField("newDevicePowerInput", "Input power", setDevice),
    createField("newDeviceUrl", "Url", setDevice),
  ];

  const bus = {
    targetedInput,
    setTargetedInput,
    useSelector,
    dispatch,
    currentDevices,
    width,
    expandedDevice,
    setExpandedDevice,
  };

  return (
    <ScrollView
      style={[gs.flex1, gs.appBackground, { paddingTop: calcSpacing }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Existing Devices */}
      {render_existingDevices(bus)}

      {/* Input fields */}
      <View style={[{ paddingBottom: calcSpacing }]}>
        {fields.map((field, i, arr) => {
          return (
            <View key={i} style={[]}>
              {render_field(field, bus, 0, {
                last: i === arr.length - 1 ? true : false,
                submit: handle_addDevice(dispatch),
              })}
            </View>
          );
        })}

        {/* Reset form button */}
        <View style={[gs.paddingH10]}>
          <Pressable
            style={[
              gs.paddingV10,
              gs.justify_center,
              // gs.border_appBackground2,
              { marginTop: 25, paddingLeft: 10, width: width * 0.3 },
            ]}
            onPress={() => {
              dispatch(clearDevice({ clear: true }));
            }}
          >
            <Text
              style={[gs.text_appBackground2, gs.text_medium, gs.text_bold]}
            >
              Clear form
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Submit and back buttons */}
      <View
        style={[
          gs.flex_row,
          gs.marginH10,
          { paddingTop: calcSpacing, paddingBottom: calcSpacing * 2, gap: 10 },
        ]}
      >
        <View style={[gs.flex1]}>
          {primaryButton_filled("Add Device", handle_addDevice(dispatch))}
        </View>
        <View style={[gs.flex1, { gap: 20 }]}>
          {secondaryButton_outlined("Back", handle_back)}
        </View>
      </View>
    </ScrollView>
  );
};

const render_existingDevices = ({
  currentDevices,
  dispatch,
  useSelector,
  width,
  expandedDevice,
  setExpandedDevice,
}) => {
  if (currentDevices.length <= 0) return <View />;

  return (
    <View style={[{ paddingBottom: 30 }]}>
      <Text style={[gs.text_white, { paddingBottom: 10, paddingLeft: 10 }]}>
        Added Devices:
      </Text>
      <View style={[]}>
        {currentDevices.map((device, i) => {
          return (
            <View key={i}>
              <View style={[gs.flex_row]}>
                <Pressable
                  style={[gs.paddingV10, gs.paddingH20]}
                  onPress={() => handle_removeDevice(device.name, dispatch)}
                >
                  <Text style={[gs.text_large, gs.text_red]}>x</Text>
                </Pressable>
                <Pressable
                  style={[gs.flex1, gs.justify_center]}
                  onPress={() =>
                    setExpandedDevice((draft) => {
                      if (device.name === draft) return "";
                      else return device.name;
                    })
                  }
                >
                  <Text
                    style={[
                      gs.text_large,
                      gs.text_gray,
                      { marginLeft: 20, flexShrink: 0 },
                    ]}
                  >
                    {device.name}
                  </Text>
                </Pressable>
              </View>
              {render_existingDevices_expanded({
                expandedDevice,
                device,
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const render_existingDevices_expanded = ({ expandedDevice, device }) => {
  if (expandedDevice !== device.name) return <View />;

  const render_row = (pair, key, d, side) => {
    if (pair.side !== side) return null;

    return (
      <View
        style={[
          gs.flex_row,
          gs.align_end,
          gs.flex1,
          gs.marginV5,
          { flexGrow: 0 },
        ]}
        key={key}
      >
        <Text
          numberOfLines={1}
          style={[
            gs.text_appBackground,
            gs.text_bold,
            gs.text_small,
            { paddingRight: 10, paddingBottom: 4 },
          ]}
        >
          {pair.display}:
        </Text>
        <View style={[gs.flex1, gs.align_end, { flexShrink: 1 }]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[gs.flex1]}
            contentContainerStyle={[]}
          >
            <Text
              numberOfLines={1}
              style={[gs.text_appBackground, gs.text_large, gs.text_bold]}
            >
              {d[pair.value]}
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  };

  const labelValuePairs = [
    { display: "Nickname", value: "name", side: "left" },
    { display: "Manufacturer", value: "manufacturer", side: "left" },
    { display: "Model Number", value: "model", side: "left" },
    { display: "Category", value: "category", side: "left" },
    { display: "Subcategory", value: "subcategory", side: "left" },

    { display: "Description", value: "description", side: "right" },
    { display: "Color", value: "color", side: "right" },
    { display: "Power Input", value: "powerInput", side: "right" },
    { display: "Url", value: "url", side: "right" },
  ];

  return (
    <View
      style={[gs.flex_row, gs.justify_around, gs.paddingV10, gs.appBackground2]}
    >
      <View style={[styles.expandedColumn]}>
        {labelValuePairs.map((pair, i) => render_row(pair, i, device, "left"))}
      </View>

      <View style={[gs.background_black, gs.marginH5, { width: 0.5 }]} />

      <View style={[styles.expandedColumn]}>
        {labelValuePairs.map((pair, i) => render_row(pair, i, device, "right"))}
      </View>
    </View>
  );
};

const handle_back = () => {
  router.back();
};
const handle_addDevice = (dispatch) => {
  return () => {
    dispatch(addDevice({}));
  };
};
const handle_removeDevice = (deviceName, dispatch) => {
  dispatch(removeDevice({ deviceName }));
};

const styles = StyleSheet.create({
  expandedText: {
    color: gray,
    fontSize: text_medium,
    marginVertical: 5,
  },
  expandedColumn: {
    // backgroundColor: gray,
    flex: 1,
    flexShrink: 1,
    paddingHorizontal: 10,
  },
});

export default NewProject_devices;
