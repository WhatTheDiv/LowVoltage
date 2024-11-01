import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import gs from "../../../assets/globalStyles";

const Network = ({
  bus: {
    spacingBetweenSections: sp,
    data_overview: { networkData },
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
          gs.flex_row,
          gs.justify_between,
          gs.paddingH10,
          { paddingRight: 30, marginBottom: sectionExpanded ? 10 : 10 },
        ]}
        onPress={() => setSectionExpanded((curr) => !curr)}
      >
        <Text style={[gs.text_white, gs.text_large]} numberOfLines={1}>
          Network Requirements
        </Text>
        <Text
          style={[hasUnassigned ? gs.text_red : gs.text_green, gs.text_large]}
          numberOfLines={1}
        >
          {networkData.totalPortCount}
        </Text>
      </Pressable>
      <View style={[{ gap: sectionExpanded ? 20 : 5 }]}>
        {networkData.zoneList.map((zoneItem, i) =>
          render_zoneNetworkData(zoneItem, i, sectionExpanded)
        )}
      </View>
    </View>
  );
};

const render_zoneNetworkData = (zoneItem, i, sectionExpanded) => {
  return (
    <View key={i} style={[]}>
      <View
        style={[gs.flex_row, gs.justify_between, gs.flex_nowrap, gs.marginH30]}
      >
        <Text style={[gs.text_gray, gs.text_medium]} numberOfLines={1}>
          {zoneItem.zoneName}
        </Text>
        <Text style={[gs.text_gray, gs.text_medium]} numberOfLines={1}>
          {Object.keys(zoneItem.portCounts).reduce(
            (count, property) => (count += zoneItem.portCounts[property]),
            0
          )}
        </Text>
      </View>
      <View style={[]}>
        {sectionExpanded &&
          Object.keys(zoneItem.portCounts)
            .filter((prop) => zoneItem.portCounts[prop] > 0)
            .map((sec, index) => {
              const cleanSectionName = (name) => {
                switch (name) {
                  case "data":
                    return "Data";
                  case "poe":
                    return "PoE";
                  case "poe_p":
                    return "PoE+";
                  case "poe_pp":
                    return "PoE++";
                }
              };
              return (
                <View
                  style={[
                    gs.flex_row,
                    gs.justify_end,
                    gs.flex_nowrap,
                    { marginLeft: 50, marginRight: 30 },
                  ]}
                  key={index}
                >
                  <Text
                    style={[
                      gs.text_darkGray,
                      gs.text_medium,
                      { paddingRight: 50 },
                    ]}
                    numberOfLines={1}
                  >
                    {cleanSectionName(sec)}
                  </Text>
                  <Text
                    style={[gs.text_darkGray, gs.text_medium]}
                    numberOfLines={1}
                  >
                    {zoneItem.portCounts[sec]}
                  </Text>
                </View>
              );
            })}
      </View>
    </View>
  );
};

export default Network;
