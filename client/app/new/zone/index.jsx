import { View, Text, TextInput } from "react-native";
import React from "react";
import gs, { gray, greenColor, text_large } from "../../../assets/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { setZone } from "../../../store/newProject_slice";
import { secondaryButton_outlined } from "../../../components/buttons";
import { router } from "expo-router";
import { fillFetchRequest } from "../../../helper/fetching";
import { hydrateProject } from "../../../store/projects_slice";

const newZone = () => {
  const dispatch = useDispatch();

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <View style={[gs.flex1]}>
        {/* Zone name */}
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
              onChangeText={(newZoneName) => dispatch(setZone({ newZoneName }))}
              selectTextOnFocus={true}
              onBlur={(e) => e.target.blur()}
              // @ts-ignore
              value={useSelector((state) => state.newProject.newZoneName)}
            />
          </View>
          <Text style={[gs.text_gray, gs.text_medium]}>Name</Text>
        </View>
      </View>

      {/* Button */}
      <View style={[gs.width100]}>
        <View style={[gs.padding20]}>
          {secondaryButton_outlined("Finish", handle_finish(dispatch), {
            color: greenColor,
            textSize: text_large,
          })}
        </View>
      </View>
    </View>
  );
};

const handle_finish = (dispatch) => {
  const { newZoneName, newZoneLocation_id } = useSelector(
    // @ts-ignore
    (state) => state.newProject
  );
  // @ts-ignore
  const projectId = useSelector((state) => state.projects.currentProject._id);

  return async () => {
    const { status, result } = await fillFetchRequest({
      route: "/updateProject",
      method: "POST",
      _body: {
        projectId,
        newZone: { name: newZoneName, locationId: newZoneLocation_id },
      },
    });

    if (status.didFail()) {
      alert(`Error - ${status.errorMessage}`);
      status.printReport();
      return;
    }

    console.log({ result, status });

    const { project, simpleGlobalDevices, usedDevices } = result;
    dispatch(hydrateProject({ project, simpleGlobalDevices, usedDevices }));
    router.back();
  };
};

export default newZone;
