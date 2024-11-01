// @ts-nocheck
import React, {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import gs, { gray, orangeColor, text_large } from "../../assets/globalStyles";
import {
  secondaryButton_outlined,
  tertiaryButton_noBorder,
} from "../../components/buttons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { primaryButton_filled } from "../../components/buttons";
import { fillFetchRequest } from "../../helper/fetching";
import { hydrateProject, syncProjectList } from "../../store/projects_slice";

const NewProject_finish = () => {
  console.log("Confirmation");
  const dispatch = useDispatch();
  const calcedSpacing = useSelector((state) => state.ui.screenHeight) * 0.05;
  const {
    projectName,
    street,
    city,
    zip,
    state,
    zones,
    deviceLocations,
    devices,
    materials,
  } = useSelector((state) => state.newProject);

  const bus = {
    project: {
      projectName,
      street,
      city,
      zip,
      state,
      zones,
      deviceLocations,
      devices,
      materials,
    },
  };

  return (
    <ScrollView style={[gs.appBackground]} showsVerticalScrollIndicator={false}>
      {/* Name and address */}
      <View style={[{ paddingVertical: calcedSpacing, paddingLeft: 10 }]}>
        <Text style={[styles.categoryHeader, { paddingBottom: 10 }]}>
          Details:
        </Text>
        <View style={[gs.align_center]}>
          <View style={[{ gap: 10 }]}>
            <Text style={[styles.text]}>{projectName}</Text>
            <Text style={[styles.text]}>{street}</Text>
            <Text style={[styles.text]}>{`${city} ${state}, ${zip}`}</Text>
          </View>
        </View>
      </View>

      {/* Zones */}
      {zones.length > 0 && (
        <View style={[{ paddingVertical: calcedSpacing, paddingLeft: 10 }]}>
          <Text style={[styles.categoryHeader, { paddingBottom: 10 }]}>
            Zones:
          </Text>
          {zones.map((zone, index) => (
            <View style={[gs.flex_row, gs.justify_around]} key={index}>
              <Text style={[styles.text]}>{zone.location}</Text>
              <Text style={[styles.text]}>{zone.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Devices */}
      {devices.length > 0 && (
        <View style={[{ paddingVertical: calcedSpacing, paddingLeft: 10 }]}>
          <Text style={[styles.categoryHeader, { paddingBottom: 10 }]}>
            Devices:
          </Text>
          {devices.map((device, index) => (
            <View style={[gs.flex_row, gs.justify_around]} key={index}>
              <Text style={[styles.text]}>{device.category}</Text>
              <Text style={[styles.text]}>{device.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Materials */}
      {materials.length > 0 && (
        <View style={[{ paddingVertical: calcedSpacing, paddingLeft: 10 }]}>
          <Text style={[styles.categoryHeader, { paddingBottom: 10 }]}>
            Materials:
          </Text>
          {materials.map((material, index) => (
            <View style={[gs.flex_row, gs.justify_around]} key={index}>
              <Text style={[styles.text]}>{material.name}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={[gs.flex1]}>
        <View style={[gs.paddingH10]}>
          {primaryButton_filled("Finish", finalize(bus.project, dispatch))}
        </View>
      </View>
    </ScrollView>
  );
};

const finalize = (project, dispatch) => {
  return async () => {
    const { status, result } = await fillFetchRequest({
      route: "/createProject",
      method: "POST",
      _body: { newProject: project },
    });

    if (status.didFail())
      return alert(`Failed to add project => ${status.getErrorMessage()}`);

    console.log("New project created! ", result.project);

    dispatch(
      syncProjectList({ projectNamesAndIds: result.projectNamesAndIds })
    );
    dispatch(hydrateProject({ project: result.project }));

    router.replace(`/existing/${result.project._id}`);
  };
};

const styles = StyleSheet.create({
  text: {
    color: gray,
    fontSize: text_large,
  },
  categoryHeader: {
    color: "white",
  },
});

export default NewProject_finish;
