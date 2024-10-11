// @ts-nocheck
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import gs, { orangeColor } from "../../assets/globalStyles";
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
  const projectNamesAndIds = useSelector(
    (state) => state.projects.projectNamesAndIds
  );

  const calcedSpacing = useSelector((state) => state.ui.screenHeight) * 0.05;

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <View
        style={[
          gs.flex1,
          gs.relative,
          gs.marginH10,
          { marginVertical: calcedSpacing },
        ]}
      >
        <View>
          {projectNamesAndIds.map((project, index) => {
            return (
              <View key={index} style={[{ marginTop: calcedSpacing }]}>
                {primaryButton_filled(project.name, page_project(project))}
              </View>
            );
          })}
        </View>

        <View style={[gs.absolute, { bottom: 20, right: 20 }]}>
          {secondaryButton_outlined(
            "New Project",
            page_hop("/create/details"),
            {
              round: 30,
              color: orangeColor,
            }
          )}
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
