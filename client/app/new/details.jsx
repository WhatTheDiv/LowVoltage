import { View, Text, TextInput, ScrollView } from "react-native";
import React from "react";
import gs, {
  gray,
  greenColor,
  text_large,
  text_medium,
} from "../../assets/globalStyles";
import { secondaryButton_outlined } from "../../components/buttons";
import {
  setCity,
  setState,
  setStreet,
  setZip,
} from "../../store/newProject_slice";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

const ProjectDetails = () => {
  const dispatch = useDispatch();

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <ScrollView style={[gs.flex1]}>
        {/* Street address */}
        <View style={[gs.marginH10, { marginTop: "12%" }]}>
          <View
            style={[
              gs.paddingH30,
              { borderBottomWidth: 1, borderBottomColor: gray },
            ]}
          >
            <TextInput
              style={[gs.text_center, gs.text_orange, gs.text_xlarge]}
              numberOfLines={1}
              onChangeText={(val) => dispatch(setStreet({ street: val }))}
              onBlur={(e) => e.target.blur()}
              selectTextOnFocus={true}
              // @ts-ignore
              value={useSelector((state) => state.newProject.street)}
              scrollEnabled={false}
            />
          </View>
          <Text style={[gs.text_gray, gs.text_medium]}>Street Address</Text>
        </View>

        {/* City */}
        <View style={[gs.marginH10, { marginTop: "12%" }]}>
          <View
            style={[
              gs.paddingH30,

              { borderBottomWidth: 1, borderBottomColor: gray },
            ]}
          >
            <TextInput
              style={[gs.text_center, gs.text_orange, gs.text_xlarge]}
              numberOfLines={1}
              onChangeText={(val) => dispatch(setCity({ city: val }))}
              onBlur={(e) => e.target.blur()}
              selectTextOnFocus={true}
              // @ts-ignore
              value={useSelector((state) => state.newProject.city)}
              scrollEnabled={false}
            />
          </View>
          <Text style={[gs.text_gray, gs.text_medium]}>City</Text>
        </View>

        {/* Zip */}
        <View style={[gs.marginH10, { marginTop: "12%" }]}>
          <View
            style={[
              gs.paddingH30,

              { borderBottomWidth: 1, borderBottomColor: gray },
            ]}
          >
            <TextInput
              style={[gs.text_center, gs.text_orange, gs.text_xlarge]}
              numberOfLines={1}
              onChangeText={(val) => dispatch(setZip({ zip: val }))}
              onBlur={(e) => e.target.blur()}
              selectTextOnFocus={true}
              // @ts-ignore
              value={useSelector((state) => state.newProject.zip)}
            />
          </View>
          <Text style={[gs.text_gray, gs.text_medium]}>Zip</Text>
        </View>

        {/* State */}
        <View style={[gs.marginH10, { marginTop: "12%" }]}>
          <View
            style={[
              gs.paddingH30,
              { borderBottomWidth: 1, borderBottomColor: gray },
            ]}
          >
            <TextInput
              style={[gs.text_center, gs.text_orange, gs.text_xlarge]}
              onChangeText={(val) => dispatch(setState({ state: val }))}
              onBlur={(e) => e.target.blur()}
              selectTextOnFocus={true}
              // @ts-ignore
              value={useSelector((state) => state.newProject.state)}
            />
          </View>
          <Text style={[gs.text_gray, gs.text_medium]}>State</Text>
        </View>
      </ScrollView>

      {/* Button */}
      <View style={[gs.width100]}>
        <View style={[gs.padding20]}>
          {secondaryButton_outlined("Finish", page_hop("new/finish"), {
            color: greenColor,
            textSize: text_large,
          })}
        </View>
      </View>
    </View>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};

export default ProjectDetails;
