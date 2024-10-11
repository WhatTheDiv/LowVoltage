// @ts-nocheck
import React, { View, Text, Pressable } from "react-native";
import gs from "../assets/globalStyles";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../store/ui_slice";

const fallback = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.ui.errorMessage);

  return (
    <View style={[gs.justify_center, gs.flex1, gs.align_center]}>
      <Text>Something bad happend.</Text>
      <Text style={[gs.marginV5, gs.text_red]}>{errorMessage}</Text>
      <Pressable
        style={[
          gs.border_black,
          gs.border_rad10,
          gs.marginV20,
          gs.paddingV10,
          gs.paddingH20,
        ]}
        onPress={() => handle_reset(dispatch)}
      >
        <Text>Reload</Text>
      </Pressable>
    </View>
  );
};

const handle_reset = (dispatch) => {
  dispatch(clearError({}));
  router.replace("/");
};

export default fallback;
