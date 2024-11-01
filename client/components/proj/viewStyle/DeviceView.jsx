import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import gs, {
  appBackground,
  gray,
  gray_a,
  greenColor,
  text_large,
  text_medium,
  text_xlarge,
} from "../../../assets/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { capitalizeFirstLetter } from "../../../helper/stringManip";
import Icons from "../../icons/Icons";
import { secondaryButton_outlined } from "../../buttons";
import { router } from "expo-router";

// [ ] Add unassigned device list to device view much needed

const DeviceView = ({ bus, setChangeViewHidden }) => {
  const [expandCard, setExpandCard] = useState([]);
  const [expandLocations, setExpandLocations] = useState([]);
  const [cardHeight, setCardHeight] = useState(0);
  const cards = useRef([]);

  const ui = {
    expandCard,
    setExpandCard,
    expandLocations,
    setExpandLocations,
    cards,
    cardHeight,
    setCardHeight,
  };

  useEffect(() => {
    if (cards.current.length > 0) getCardHeight(0, cards, setCardHeight);
  }, []);

  return (
    <ScrollView
      style={[gs.flex1]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical
    >
      <Pressable
        style={[
          gs.paddingV10,
          gs.flex_row,
          gs.justify_around,
          { gap: 10, marginHorizontal: "10%" },
        ]}
        onPress={() => setChangeViewHidden(false)}
      >
        <View>
          <Text style={[gs.text_gray, gs.text_center, gs.text_medium]}>
            Device Types
          </Text>
          <Text style={[gs.text_white, gs.text_center, gs.text_large]}>
            {bus.usedDevices.length}
          </Text>
        </View>
        <View>
          <Text style={[gs.text_gray, gs.text_center, gs.text_medium]}>
            Devices Added
          </Text>
          <Text style={[gs.text_white, gs.text_center, gs.text_large]}>
            {bus.devices.length}
          </Text>
        </View>
      </Pressable>
      {bus.data_DeviceView.map((deviceitem, cardIndex) => {
        return render_card(deviceitem, ui, bus, cardIndex);
      })}
      <View style={[gs.paddingH10, { marginTop: 20 }]}>
        {secondaryButton_outlined(`Add Device`, page_hop("/new/device"), {
          paddingV: 20,
          color: greenColor,
          round: 10,
        })}
      </View>
    </ScrollView>
  );
};

const render_card = (
  cardDeviceItem,
  {
    expandCard,
    setExpandCard,
    expandLocations,
    setExpandLocations,
    cards,
    cardHeight,
  },
  { deviceListObject, zoneListObject, locationListObject },
  cardIndex
) => {
  const deviceCount = cardDeviceItem.zonesHaveDeviceItem.reduce(
    (count, curr) => (count += curr.devicesInZoneCount),
    0
  );
  const cardDeviceObject = deviceListObject[cardDeviceItem.id];

  return (
    <View
      style={[styles.cardContainer]}
      ref={(el) => cards.current.push(el)}
      key={cardIndex}
    >
      <LinearGradient
        style={[styles.cardShell]}
        colors={["#020310", "#050a30"]}
        start={{ x: 0.35, y: 0.1 }}
      >
        {/* Card header */}
        <Pressable
          style={[styles.cardTitleContainer]}
          onPress={() =>
            addOrRemoveExistingFromStateList(
              cardDeviceObject._id,
              setExpandCard
            )
          }
        >
          <Icons
            type={cardDeviceObject.iconType}
            style={{
              width: 40,
              height: 40,
              color: cardDeviceObject.iconColor,
            }}
          />
          <Text style={[styles.cardTitleText]} numberOfLines={1}>
            {capitalizeFirstLetter(cardDeviceObject.name)}
          </Text>
          {/* Card Summary */}
          {!expandCard.includes(cardDeviceObject._id) && (
            <View
              style={[styles.cardSummaryContainer, { minHeight: cardHeight }]}
            >
              <Icons
                type={"text"}
                style={{
                  height: 35,
                  width: 35,
                  color: "green",
                  textSize: text_large,
                  text: deviceCount,
                }}
              />
            </View>
          )}
        </Pressable>

        {/* Expanded details */}
        {expandCard.includes(cardDeviceObject._id) && (
          <View style={[styles.cardZoneListContainer]}>
            {cardDeviceItem.zonesHaveDeviceItem.map((cardZoneItem, i) => (
              <Pressable style={[styles.cardZoneItemContainer]} key={i}>
                <View style={[styles.cardZoneHeaderContainer]}>
                  <Text style={[styles.cardZoneHeaderTextLeft]}>
                    {capitalizeFirstLetter(
                      locationListObject[
                        zoneListObject[cardZoneItem.zoneId].locationId
                      ].name
                    )}
                  </Text>
                  <Text style={[styles.cardZoneHeaderTextRight]}>
                    {cardZoneItem.devicesInZoneCount}
                  </Text>
                </View>
                {cardZoneItem.zoneHasLocationsIds.map((locationId, j) => (
                  <View style={[styles.cardLocationListContainer]} key={j}>
                    <Text style={[styles.cardLocationListText]}>
                      {capitalizeFirstLetter(
                        locationListObject[locationId].name
                      )}
                    </Text>
                  </View>
                ))}
              </Pressable>
            ))}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const getCardHeight = (i, cards, setter) => {
  cards.current[i].measure((x, y, height) => {
    setter(height);
  });
};

const addOrRemoveExistingFromStateList = (sel, setList) => {
  setList((curr) => {
    const i = curr.findIndex((item) => item === sel);

    if (i >= 0) {
      curr.splice(i, 1);
    } else curr.push(sel);

    return [...curr];
  });
};

const page_hop = (route) => {
  return () => {
    router.push(route);
  };
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cardShell: {
    borderRadius: 15,
    paddingBottom: 20,
    paddingTop: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardTitleContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardTitleText: {
    color: gray,
    fontSize: text_large,
    paddingLeft: 20,
  },
  cardSummaryContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    backgroundColor: greenColor,
    height: 20 + 20 + text_large + 8 + 10,
    // minHeight: 20 + 20 + text_large + 8,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 5,
    gap: 2,
    width: 50,
  },
  cardSummaryText: {
    fontSize: text_large,
    color: appBackground,
    fontWeight: "bold",
  },

  cardZoneListContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    gap: 30,
  },
  cardZoneItemContainer: {},
  cardZoneHeaderContainer: {
    flexDirection: "row",
  },
  cardZoneHeaderTextLeft: {
    color: gray,
    fontSize: text_large,
    flex: 1,
  },
  cardZoneHeaderTextRight: {
    color: greenColor,
    fontWeight: "bold",
    fontSize: text_large,
  },
  cardLocationListContainer: {
    paddingLeft: 20,
    paddingTop: 10,
    gap: 10,
  },
  cardLocationListText: {
    color: gray,
    fontSize: text_medium,
  },
  cardActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardActionText: {
    color: greenColor,
    fontSize: text_medium,
    fontWeight: "bold",
  },

  icon: {
    width: 20,
    height: 20,
  },
});

export default DeviceView;
