// @ts-nocheck
import React, { Text, Pressable, StyleSheet } from "react-native";
import gs, {
  text_large,
  text_bold,
  appBackground2,
} from "../assets/globalStyles";

export const primaryButton_filled = (buttonText, pressFunc, options = {}) => {
  const rad = getRadiusStyle(options.round);
  const bgColor = getBackgroundStyle(options.color);

  return (
    <Pressable
      style={[bgColor, rad, gs.paddingH20, gs.paddingV20]}
      onPress={() => pressFunc()}
    >
      <Text style={[styles.text, gs.text_large]}>{buttonText}</Text>
    </Pressable>
  );
};

export const secondaryButton_outlined = (
  buttonText,
  pressFunc,
  options = {}
) => {
  const rad = getRadiusStyle(options.round);
  const borderColor = getBorderStyle(options.color);
  const textColor = getTextColorStyle(options.color);

  return (
    <Pressable
      style={[
        // gs.border_orange,
        gs.flex1,
        borderColor,
        // gs.border_white,
        rad,
        gs.paddingH20,
        gs.paddingV20,
      ]}
      onPress={() => pressFunc()}
    >
      <Text style={[styles.text, gs.text_medium, textColor]}>{buttonText}</Text>
    </Pressable>
  );
};

export const tertiaryButton_noBorder = (
  buttonText,
  pressFunc,
  nothing,
  options = {}
) => {
  const textColor = getTextColorStyle(options.color);
  return (
    <Pressable
      style={[styles.rad, gs.paddingH20, gs.paddingV20]}
      onPress={() => pressFunc()}
    >
      <Text style={[styles.text, gs.text_medium, textColor]}>{buttonText}</Text>
    </Pressable>
  );
};

const getTextColorStyle = (color) => {
  return {
    color: color === undefined ? appBackground2 : color,
  };
};
const getBackgroundStyle = (color) => {
  return color === undefined
    ? { backgroundColor: appBackground2 }
    : { backgroundColor: color };
};
const getRadiusStyle = (round) => {
  return round === undefined ? styles.rad : { borderRadius: round };
};
const getBorderStyle = (color) => {
  return {
    borderWidth: 1,
    borderColor: color === undefined ? appBackground2 : color,
  };
};

const styles = StyleSheet.create({
  text: {
    fontWeight: text_bold,
    textAlign: "center",
  },
  rad: {
    borderRadius: 5,
  },
});
