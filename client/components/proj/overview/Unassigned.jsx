import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import gs from "../../../assets/globalStyles";

// Needs { _id, name } in form of array for both

const Unassigned = ({
  bus: {
    spacingBetweenSections: sp,
    unassignedDeviceArr,
    unassignedLocationArr,
    usedDevices,
    devices,
    locations,
    zones,
  },
}) => {
  const [devicesExpanded, setDevicesExpanded] = useState(true);
  const [locationExpanded, setLocationExpanded] = useState(true);

  return (
    <View style={[{ paddingTop: sp, gap: sp }]}>
      {render_unassigned({
        displayHeader: "Unassigned Devices",
        unassignedArray: unassignedDeviceArr,
        sectionExpanded: devicesExpanded,
        setSectionExpanded: setDevicesExpanded,
        allOfType: usedDevices,
        idOfTargetProperty: "_deviceId",
        showBreakdownCount: true,
      })}
      {render_unassigned({
        displayHeader: "Unassigned Locations",
        unassignedArray: unassignedLocationArr,
        sectionExpanded: locationExpanded,
        setSectionExpanded: setLocationExpanded,
        allOfType: locations,
        idOfTargetProperty: "_id",
        showBreakdownCount: false,
      })}
    </View>
  );
};

const render_unassigned = ({
  displayHeader,
  unassignedArray,
  sectionExpanded,
  setSectionExpanded,
  allOfType,
  idOfTargetProperty,
  showBreakdownCount,
}) => {
  // exit early if nothing in array
  const len = unassignedArray.length;
  if (len <= 0) return null;

  // otherwise, get count of how many unique items
  const processed = {};

  unassignedArray.forEach((item) => {
    const id = item[idOfTargetProperty];
    if (processed[id] === undefined) {
      processed[id] = {
        name: allOfType.find((d) => d._id === id).name,
        count: 1,
      };
    } else processed[id].count += 1;
  });

  // take the list of unique ID's
  const listOfTallys = Object.keys(processed);

  return (
    <View>
      <Pressable
        style={[
          gs.paddingH10,
          gs.flex_row,
          gs.justify_between,
          { marginBottom: sectionExpanded ? 10 : 0 },
        ]}
        onPress={() => setSectionExpanded((curr) => !curr)}
      >
        <Text style={[gs.text_white, gs.text_large]} numberOfLines={1}>
          {displayHeader}
        </Text>
        <Text
          style={[gs.text_red, gs.text_large, { paddingRight: 20 }]}
          numberOfLines={1}
        >
          {len}
        </Text>
      </Pressable>
      {sectionExpanded &&
        listOfTallys.map((id, i) => {
          return (
            <View
              key={i}
              style={[
                gs.flex_row,
                gs.flex_nowrap,
                gs.justify_between,
                gs.marginH30,
              ]}
            >
              <Text style={[gs.text_gray, gs.text_medium]} numberOfLines={1}>
                {processed[id].name}
              </Text>
              {showBreakdownCount && (
                <Text style={[gs.text_gray, gs.text_medium]} numberOfLines={1}>
                  {processed[id].count}
                </Text>
              )}
            </View>
          );
        })}
    </View>
  );
};

export default Unassigned;
