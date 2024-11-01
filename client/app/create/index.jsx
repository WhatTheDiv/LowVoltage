// @ts-nocheck
import React, { View } from "react-native";
import gs, { gray, greenColor, orangeColor } from "../../assets/globalStyles";
import {
  primaryButton_filled,
  secondaryButton_outlined,
} from "../../components/buttons";
import { router } from "expo-router";

const Create = () => {
  return (
    <View style={[gs.flex1, gs.justify_center, gs.appBackground]}>
      <View style={[gs.marginH20]}>
        {primaryButton_filled("New Project", page_hop("/create/details"), {
          color: greenColor,
          round: 20,
        })}
      </View>
    </View>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};

export default Create;
