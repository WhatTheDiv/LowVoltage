import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import gs from "../../../assets/globalStyles";
import { capitalizeFirstLetter } from "../../../helper/stringManip";

const Ac = ({
  bus: {
    spacingBetweenSections: sp,
    usedDevices,
    devices,
    unassignedDeviceArr,
    unassignedLocationArr,
    data_overview: { acData, networkData },
  },
}) => {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const hasUnassigned =
    networkData.zoneList.find((zoneItem) => zoneItem.id === "unassigned") ===
    undefined
      ? false
      : true;

  return (
    <View style={[{ marginTop: sp }]}>
      <Pressable
        style={[
          gs.paddingH10,
          gs.flex_row,
          gs.justify_between,
          { marginBottom: sectionExpanded ? 10 : 0, paddingRight: 30 },
        ]}
        onPress={() => setSectionExpanded((curr) => !curr)}
      >
        <Text style={[gs.text_white, gs.text_large]} numberOfLines={1}>
          Access Control Devices
        </Text>
        <Text
          style={[hasUnassigned ? gs.text_red : gs.text_green, gs.text_large]}
          numberOfLines={1}
        >
          {acData.totalCount}
        </Text>
      </Pressable>
      {sectionExpanded &&
        acData.deviceListItems.map((item, i) => {
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
                {capitalizeFirstLetter(item.name)}
              </Text>
              <Text style={[gs.text_gray, gs.text_medium]} numberOfLines={1}>
                {item.count}
              </Text>
            </View>
          );
        })}
    </View>
  );
};

export default Ac;
