import { View, Text, TextInput } from "react-native";
import React from "react";
import gs, {
  gray,
  greenColor,
  text_large,
  text_medium,
} from "../../assets/globalStyles";
import { secondaryButton_outlined } from "../../components/buttons";
import { setProjectName } from "../../store/newProject_slice";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

const NewProject = () => {
  const dispatch = useDispatch();

  return (
    <View style={[gs.appBackground, gs.flex1, gs.justify_between]}>
      <View style={[gs.marginH10, { marginTop: "10%" }]}>
        <TextInput
          style={[
            gs.paddingV10,
            gs.text_center,
            gs.text_orange,
            gs.text_xlarge,
            { borderBottomWidth: 1, borderBottomColor: gray },
          ]}
          selectTextOnFocus={true}
          onBlur={(e) => e.target.blur()}
          onChangeText={(val) => dispatch(setProjectName({ projectName: val }))}
          // @ts-ignore
          value={useSelector((state) => state.newProject.projectName)}
        />
        <Text style={[gs.text_gray, gs.text_medium]}>Project Name</Text>
      </View>
      <View style={[gs.padding20, {}]}>
        {secondaryButton_outlined("Next", page_hop("/new/details"), {
          color: greenColor,
          textSize: text_large,
        })}
      </View>
    </View>
  );
};

const page_hop = (route) => {
  return () => router.push(route);
};

export default NewProject;
