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
import gs, { appBackground } from "../assets/globalStyles";
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
      <Text>Loading page</Text>
    </View>
  );
};

const hydration = async (dispatch, bus) => {
  const { ui } = bus;
  const { colorScheme, height, width } = ui;

  const { status, result } = await fillFetchRequest({
    route: "/hydration",
    method: "GET",
  });

  const { projectNamesAndIds } = result;

  if (status.didFail()) {
    dispatch(setError({ errorMessage: `Failed to hydrate ( ${message} )` }));
    return router.replace("/fallback");
  }

  dispatch(syncProjectList({ projectNamesAndIds }));
  dispatch(setColorScheme({ colorScheme }));
  dispatch(setHydrated({ hydrated: true }));
  dispatch(setScreenDims({ screenHeight: height, screenWidth: width }));

  if (projectNamesAndIds.length >= 1) router.replace("/existing");
  else router.replace("/create");
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
