// @ts-nocheck
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import gs, {
  appBackground2,
  gray,
  greenColor,
  orangeColor,
  redColor,
} from "../../assets/globalStyles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, Redirect } from "expo-router";
import { HydrateProjects } from "../../handlers/startup/Hydrate";
import {
  secondaryButton_outlined,
  primaryButton_filled,
} from "../../components/buttons";
import { resetForm } from "../../store/newProject_slice";

const Existing = () => {
  const dispatch = useDispatch();
  const allProjectNamesAndIds = useSelector(
    (state) => state.projects.allProjectNamesAndIds
  );

  const calcedSpacing = useSelector((state) => state.ui.screenHeight) * 0.05;

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <StatusBar backgroundColor={appBackground2} animated={true} />
      <View
        style={[
          gs.flex1,
          gs.relative,
          gs.marginH10,
          { marginVertical: calcedSpacing },
        ]}
      >
        <View>
          {allProjectNamesAndIds.length > 0 &&
            allProjectNamesAndIds.map((project, index) => {
              return (
                <View key={index} style={[{ marginTop: calcedSpacing }]}>
                  {primaryButton_filled(project.name, page_project(project), {
                    border: gray,
                  })}
                </View>
              );
            })}
        </View>
        {allProjectNamesAndIds.length < 1 && (
          <View style={[gs.flex1, gs.justify_center, gs.align_center]}>
            <Text style={[gs.text_large, gs.text_gray]}>
              Nothing here yet ...
            </Text>
          </View>
        )}

        <View style={[gs.absolute, { bottom: 20, right: 20 }]}>
          {secondaryButton_outlined("New Project", page_hop("/new"), {
            round: 30,
            color: greenColor,
          })}
        </View>
      </View>
    </View>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};
const page_replace = (route) => {
  return () => router.replace(route);
};
const page_project = ({ _id }) => {
  return () => {
    if (!_id) return alert("Invalid project id");

    router.push(`existing/${_id}`);
  };
};

export default Existing;
