import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import gs, {
  gray,
  greenColor,
  redColor,
  text_large,
  text_medium,
} from "../../../assets/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { capitalizeFirstLetter } from "../../../helper/stringManip";
import Icons from "../../icons/Icons";
import { secondaryButton_outlined } from "../../buttons";
import { router } from "expo-router";

const LocationView = ({ bus, setChangeViewHidden }) => {
  const [expandCard, setExpandCard] = useState([]);
  const [expandDevices, setExpandDevices] = useState([]);
  const [cardHeight, setCardHeight] = useState(0);
  const cards = useRef([]);

  const {
    data_locationView: { locationCount, zoneCount, locationItemsList },
  } = bus;

  const ui = {
    expandCard,
    setExpandCard,
    expandDevices,
    setExpandDevices,
    cards,
    cardHeight,
    setCardHeight,
  };

  useEffect(() => {
    if (cards.current.length > 0) getCardHeight(0, cards, setCardHeight);
  }, []);

  console.log({ locationItemsList });

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
            Locations
          </Text>
          <Text style={[gs.text_white, gs.text_center, gs.text_large]}>
            {locationCount}
          </Text>
        </View>
        <View>
          <Text style={[gs.text_gray, gs.text_center, gs.text_medium]}>
            Zones
          </Text>
          <Text style={[gs.text_white, gs.text_center, gs.text_large]}>
            {zoneCount}
          </Text>
        </View>
      </Pressable>
      {locationItemsList.map((locationItem, cardIndex) => {
        return render_card(locationItem, ui, bus, cardIndex);
      })}
      <View style={[gs.paddingH10, { marginTop: 20 }]}>
        {secondaryButton_outlined(`New Location`, page_hop("/new/location"), {
          paddingV: 20,
          color: greenColor,
          round: 10,
        })}
      </View>
    </ScrollView>
  );
};

const render_card = (
  locationItem,
  {
    expandCard,
    setExpandCard,
    expandDevices,
    setExpandDevices,
    cards,
    cardHeight,
  },
  { deviceListObject, devices, spaceBetweenSections },
  cardIndex
) => {
  const {
    isZoneHead,
    zoneHeadName,
    zoneHeadId,
    locationName,
    locationId,
    deviceListIds,
  } = locationItem;

  return (
    <View
      style={[styles.cardContainer]}
      key={cardIndex}
      ref={(el) => cards.current.push(el)}
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
              locationItem.locationId,
              setExpandCard,
              deviceListIds,
              setExpandDevices
            )
          }
        >
          <Text style={[styles.cardTitleText]} numberOfLines={1}>
            {capitalizeFirstLetter(locationName)}
          </Text>
          {/* Card Summary */}
          {!expandCard.includes(locationId) && (
            <View
              style={[
                styles.cardSummaryContainer,
                {
                  minHeight: cardHeight,
                },
              ]}
            >
              {!isZoneHead && zoneHeadId && (
                <Icons
                  style={{ height: 30, width: 30, color: "green" }}
                  type={"z"}
                />
              )}
              {isZoneHead && (
                <Icons
                  style={{ height: 30, width: 30, color: "orange" }}
                  type={"st"}
                />
              )}
              {deviceListIds.length >= 1 && (
                <Icons
                  style={{ height: 30, width: 30, color: "green" }}
                  type={"dev"}
                />
              )}
            </View>
          )}
        </Pressable>

        {/* Expanded details */}
        {expandCard.includes(locationId) && (
          <View>
            {/* Zone section  */}
            {!isZoneHead && (
              <View style={[styles.cardZoneContainer]}>
                <Icons
                  type={"z"}
                  style={{ height: 40, width: 40, color: "green" }}
                />
                <Text style={[styles.cardZoneText]} numberOfLines={1}>
                  {capitalizeFirstLetter(zoneHeadName)}
                </Text>
              </View>
            )}

            {/* device list section */}
            {deviceListIds.length >= 1 && (
              <View style={[styles.deviceListContainer]}>
                {deviceListIds.map((deviceId) => {
                  const deviceObj =
                    deviceListObject[
                      devices.find((d) => d._id === deviceId)._deviceId
                    ];
                  console.log({ deviceObj, deviceListIds, deviceListObject });
                  return (
                    <View style={[styles.deviceContainer]} key={deviceId}>
                      {/*  Device Header */}
                      <Pressable
                        style={[styles.deviceHeaderContainer]}
                        onPress={() =>
                          addOrRemoveExistingFromStateList(
                            deviceId,
                            setExpandDevices
                          )
                        }
                      >
                        <Icons
                          type={deviceObj.iconType}
                          style={{
                            height: 40,
                            width: 40,
                            color: deviceObj.iconColor,
                          }}
                        />
                        <Text style={[styles.deviceHeaderText]}>
                          {capitalizeFirstLetter(deviceObj.name)}
                        </Text>
                      </Pressable>

                      {/* Device details */}
                      {expandDevices.includes(deviceId) && (
                        <View style={[styles.deviceBodyContainer]}>
                          {Object.keys(deviceObj)
                            .filter((key) => filter_deviceProps(deviceObj, key))
                            .map((deviceProp, i) => (
                              <View
                                style={[styles.deviceBodyLineContainer]}
                                key={i}
                              >
                                <Text style={[styles.deviceLineFirst]}>
                                  {capitalizeFirstLetter(
                                    howToShowProp(deviceProp)
                                  )}
                                </Text>
                                <Text
                                  style={[styles.deviceLineSecond]}
                                  selectable={true}
                                >
                                  {capitalizeFirstLetter(
                                    howToShowPropValue(
                                      deviceObj[deviceProp],
                                      deviceProp
                                    )
                                  )}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Location Actions section */}
            <View
              style={[
                styles.cardActionsContainer,
                { paddingTop: spaceBetweenSections },
              ]}
            >
              <Pressable style={[styles.cardActionButton]}>
                <Text style={[styles.cardActionText]}>Edit</Text>
              </Pressable>
              <Pressable style={[styles.cardActionButton]}>
                <Text style={[styles.cardActionText, { color: redColor }]}>
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const filter_deviceProps = (device, prop) => {
  const dontShow = ["_id", "iconType", "iconColor", "name"];

  if (dontShow.find((p) => p === prop)) return false;
  else if (device[prop] === "" || device[prop] === undefined) return false;
  else return true;
};

const getCardHeight = (i, cards, setter) => {
  cards.current[i].measure((x, y, height) => {
    setter(height);
  });
};

const howToShowProp = (prop) => {
  if (prop === "powerInput") return "Power Input";
  else return prop;
};
const howToShowPropValue = (value, prop) => {
  if (prop === "networked") {
    return value ? "true" : "false";
  } else if (prop === "category" && value === "ac") return "Access Control";
  else if (prop === "category" && value === "cctv") return "Camera";
  else if (prop === "url") return "¢" + value;
  else return value;
};

const addOrRemoveExistingFromStateList = (sel, setList, dl = [], setDl) => {
  setList((curr) => {
    const i = curr.findIndex((item) => item === sel);

    if (i >= 0) {
      curr.splice(i, 1);
      if (dl.length >= 1) {
        // remove dl list from state
        setDl((currDl) => {
          return currDl.filter((curr_d) => !dl.includes(curr_d));
        });
      }
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardTitleText: {
    color: gray,
    fontSize: text_large,
  },
  cardSummaryContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    backgroundColor: greenColor,
    height: 20 + 20 + text_large + 8,
    // minHeight: 20 + 20 + text_large + 8,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 5,
    gap: 2,
    width: 50,
  },
  cardZoneContainer: {
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardZoneText: {
    paddingLeft: 20,
    fontSize: text_large,
    color: gray,
    flex: 1,
  },
  deviceListContainer: {
    paddingHorizontal: 10,
    gap: 10,
    paddingTop: 20,
  },
  deviceContainer: {},
  deviceHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 10,
  },
  deviceHeaderText: {
    flex: 1,
    color: gray,
    fontSize: text_large,
    paddingLeft: 20,
  },
  deviceBodyContainer: {
    // backgroundColor: gray_a,

    paddingTop: 10,
    paddingBottom: 20,
    gap: 5,
    paddingHorizontal: 10,
  },
  deviceBodyLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "hsla(0,0%,0%,0)",
  },
  deviceLineFirst: {
    fontSize: text_medium,
    color: gray,
  },
  deviceLineSecond: {
    fontSize: text_medium,
    color: gray,
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

export default LocationView;
