// @ts-nocheck
import React, { Text, Pressable, StyleSheet } from "react-native";
import gs, {
  text_large,
  text_bold,
  appBackground2,
  text_medium,
  gray,
} from "../assets/globalStyles";

export const primaryButton_filled = (buttonText, pressFunc, options = {}) => {
  const rad = getRadiusStyle(options.round);
  const bgColor = getBackgroundStyle(options.color);
  const txtColor = getTextColorStyle(options.textColor);
  const border = !options.border
    ? {}
    : { borderWidth: 0.5, borderColor: options.border };

  return (
    <Pressable
      style={[
        bgColor,
        rad,
        gs.paddingH20,
        border,
        { paddingVertical: options.paddingV || 20 },
      ]}
      onPress={() => pressFunc()}
    >
      <Text style={[styles.text, gs.text_large, txtColor]}>{buttonText}</Text>
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
  const textColor = getTextColorStyle(
    options.textColor ? options.textColor : options.color
  );
  const textSize = getTextSize(options.textSize);
  const paddingH = getPaddingH(options.paddingH);

  return (
    <Pressable
      style={[
        borderColor,
        rad,
        gs.paddingH20,
        { paddingVertical: options.paddingV || 20 },
      ]}
      onPress={() => pressFunc()}
    >
      <Text style={[styles.text, textSize, textColor]}>{buttonText}</Text>
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
    color: color === undefined ? gray : color,
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
const getTextSize = (textSize) => {
  return { fontSize: textSize ? textSize : text_medium };
};

const getPaddingH = (paddingH) => {
  return { paddingHorizontal: paddingH || 20 };
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
