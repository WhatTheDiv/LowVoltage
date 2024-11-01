// @ts-nocheck
import { View, Text, Image } from "react-native";
import React from "react";
import gs, {
  greenColor,
  orangeColor,
  redColor,
} from "../../assets/globalStyles";

const Icons = ({
  type,
  style: { height, width, color, text = "", textSize = 10 },
}) => {
  const getIconFromType = (t) => {
    switch (t) {
      case "dc":
        return require("../../assets/icons/dome-camera.png");
      case "dl":
        return require("../../assets/icons/door-lock.png");
      case "z":
        return require("../../assets/icons/zones.png");
      case "dev":
        return require("../../assets/icons/device.png");
      case "st":
        return require("../../assets/icons/star.png");
      default:
        return require("../../assets/icons/dome-camera.png");
    }
  };
  const getColor = (c) => {
    switch (c) {
      case "green":
        return greenColor;
      case "red":
        return redColor;
      case "orange":
        return orangeColor;
      case "blue":
        return "blue";
      default:
        return c;
    }
  };
  const iconInContainer = 0.7;

  return (
    <View
      style={[
        gs.appBackground,
        gs.justify_center,
        gs.align_center,
        {
          borderRadius: width / 2,
          width: width,
          height: height,
        },
      ]}
    >
      {type === "text" && (
        <Text
          style={[
            { fontSize: textSize, color: getColor(color), fontWeight: "bold" },
          ]}
        >
          {text}
        </Text>
      )}
      {type !== "text" && (
        <Image
          source={getIconFromType(type)}
          style={{
            height: height * iconInContainer,
            width: width * iconInContainer,
          }}
          tintColor={getColor(color)}
        />
      )}
    </View>
  );
};

export default Icons;
