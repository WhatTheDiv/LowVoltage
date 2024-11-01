// @ts-nocheck
import React, { View, Text, Pressable } from "react-native";
import gs from "../assets/globalStyles";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../store/ui_slice";

const fallback = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.ui.errorMessage);
  const spacing = 40;
  const errorHeaders = [
    "Yikes ...",
    "Oh no ...",
    "Oh jeeze ...",
    "Oops ...",
    "Um ...",
    "Woops ...",
    "Oh boy ...",
    "Ffs ...",
  ];

  return (
    <View
      style={[gs.justify_center, gs.flex1, gs.align_center, gs.appBackground]}
    >
      <Text style={[gs.text_gray, gs.text_large, { marginBottom: spacing }]}>
        {errorHeaders[Math.floor(Math.random() * errorHeaders.length)]}
      </Text>
      <Text style={[gs.text_red, gs.text_medium, { marginBottom: spacing }]}>
        {errorMessage}
      </Text>
      <Pressable
        style={[gs.border_gray, gs.border_rad10, gs.paddingV10, gs.paddingH20]}
        onPress={() => handle_reset(dispatch)}
      >
        <Text style={[gs.text_gray, gs.text_large]}>Reload</Text>
      </Pressable>
    </View>
  );
};

const handle_reset = (dispatch) => {
  dispatch(clearError({}));
  router.replace("/");
};

export default fallback;
