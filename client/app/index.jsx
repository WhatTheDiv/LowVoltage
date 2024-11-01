// @ts-nocheck
import {
  View,
  Text,
  Platform,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import gs, { appBackground, f_hlt2 } from "../assets/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

import {
  setColorScheme,
  setHydrated,
  setError,
  setScreenDims,
} from "../store/ui_slice";
import { syncProjectList } from "../store/projects_slice";
import { fillFetchRequest } from "../helper/fetching";
import { HydrateProjects } from "../handlers/startup/Hydrate";

const loading = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { height, width } = Dimensions.get(
    Platform.OS === "web" ? "window" : "screen"
  );

  const bus = {
    ui: {
      colorScheme,
      height,
      width,
    },
  };

  useEffect(() => {
    hydration(dispatch, bus);
  }, []);

  return (
    <View
      style={[gs.flex1, gs.appBackground, gs.justify_center, gs.align_center]}
    >
      <Text style={[gs.text_gray, gs.text_large]}>Loading app ... </Text>
    </View>
  );
};

const hydration = async (dispatch, bus) => {
  const { ui } = bus;
  const { colorScheme, height, width } = ui;

  const { status, result } = await fillFetchRequest({
    route: "/hydration",
    method: "POST",
    _body: { entityId: "876bd2ba-a6dc-496c-a26b-44a15eb3c27f" },
  });

  const { allProjectNamesAndIds } = result;
  console.log("page load did fail: ", status.didFail(), status);
  if (status.didFail()) {
    dispatch(setError({ errorMessage: `${status.errorMessage}` }));
    return router.replace("/fallback");
  }

  console.log("%cProject list from server: ", f_hlt2, allProjectNamesAndIds);

  dispatch(syncProjectList({ allProjectNamesAndIds }));
  dispatch(setColorScheme({ colorScheme }));
  dispatch(setHydrated({ hydrated: true }));
  dispatch(setScreenDims({ screenHeight: height, screenWidth: width }));

  router.replace("/existing");
  // else router.replace("/create");
};

// delete me
export const appErrorMessage = (dispatch, message) => {
  dispatch(
    setError({
      errorMessage: `Failed to hydrate ( ${message} )`,
    })
  );

  router.replace("/fallback");
};

export default loading;
