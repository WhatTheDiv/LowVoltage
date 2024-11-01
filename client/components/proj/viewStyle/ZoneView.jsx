import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { router } from "expo-router";
import gs, {
  appBackground,
  gray,
  gray_a,
  greenColor,
  orangeColor,
  text_large,
  text_medium,
  text_xlarge,
} from "../../../assets/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { capitalizeFirstLetter } from "../../../helper/stringManip";
import Icons from "../../icons/Icons";
import { secondaryButton_outlined } from "../../buttons";

const ZoneView = ({ bus, setChangeViewHidden }) => {
  const [expandCard, setExpandCard] = useState([]);
  const [cardHeight, setCardHeight] = useState(0);
  const cards = useRef([]);

  const zoneTotalCount = bus.zones.length;

  const ui = {
    expandCard,
    setExpandCard,
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
            Zones:
          </Text>
          <Text style={[gs.text_white, gs.text_center, gs.text_large]}>
            {zoneTotalCount}
          </Text>
        </View>
      </Pressable>

      {bus.zones.map((cardZoneItem, cardIndex) => {
        return render_card(cardZoneItem, ui, bus, cardIndex);
      })}

      <View style={[gs.paddingH10, { marginTop: 20 }]}>
        {secondaryButton_outlined(`New Zone`, page_hop("/new/zone"), {
          paddingV: 20,
          color: greenColor,
          round: 10,
        })}
      </View>
    </ScrollView>
  );
};

const render_card = (
  cardZoneItem,
  { expandCard, setExpandCard, cards, cardHeight },
  { deviceListObject, locationListObject, data_zoneView },
  cardIndex
) => {
  const cardZoneViewItem = data_zoneView.find(
    (zoneViewItem) => zoneViewItem.zoneId === cardZoneItem._id
  );

  const cardLocationItem = locationListObject[cardZoneItem.locationId];

  const zoneName = cardLocationItem.name;
  const zoneDeviceCount =
    cardZoneViewItem?.usedDevicesInZoneItem?.reduce(
      (count, curr) => (count += curr.count),
      0
    ) || 0;

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
            addOrRemoveExistingFromStateList(cardZoneItem._id, setExpandCard)
          }
        >
          <Icons
            type={"z"}
            style={{
              width: 40,
              height: 40,
              color: "gray",
            }}
          />
          <Text style={[styles.cardTitleText]} numberOfLines={1}>
            {capitalizeFirstLetter(zoneName)}
          </Text>
          {/* Card Summary */}
          {!expandCard.includes(cardZoneItem._id) && (
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
                  text: zoneDeviceCount,
                }}
              />
            </View>
          )}
        </Pressable>

        {/* Expanded details */}
        {expandCard.includes(cardZoneItem._id) && zoneDeviceCount > 0 && (
          <View style={[styles.cardDeviceListContainer]}>
            {cardZoneViewItem.usedDevicesInZoneItem.map(
              (usedDeviceInZone, i) => {
                // Section Variables
                const device = deviceListObject[usedDeviceInZone.deviceId];
                const usedDeviceName = device.name;
                const usedDeviceColor = device.iconColor;
                const usedDeviceType = device.iconType;
                const usedDeviceCount = usedDeviceInZone.count;

                return (
                  <View style={[styles.cardDeviceContainer]} key={i}>
                    <Icons
                      style={{ height: 40, width: 40, color: usedDeviceColor }}
                      type={usedDeviceType}
                    />
                    <Text style={[styles.cardDeviceText]}>
                      {capitalizeFirstLetter(usedDeviceName)}
                    </Text>
                    <Icons
                      style={{
                        height: 40,
                        width: 40,
                        color: "green",
                        text: usedDeviceCount.toString(),
                        textSize: text_large,
                      }}
                      type={"text"}
                    />
                  </View>
                );
              }
            )}
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
    paddingRight: 10,
    paddingLeft: 20,
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

  cardDeviceListContainer: {
    paddingLeft: 40,
    paddingTop: 20,
    gap: 10,
  },
  cardDeviceContainer: {
    flexDirection: "row",
    paddingRight: 20,
  },
  cardDeviceText: {
    fontSize: text_large,
    paddingLeft: 20,
    color: gray,
    flex: 1,
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

export default ZoneView;
