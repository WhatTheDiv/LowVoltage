import { View, Text } from "react-native";
import React from "react";
import gs, {
  appBackground,
  gray,
  greenColor,
  redColor,
  text_large,
} from "../../assets/globalStyles";
import {
  primaryButton_filled,
  secondaryButton_outlined,
} from "../../components/buttons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fillFetchRequest } from "../../helper/fetching";
import { hydrateProject, syncProjectList } from "../../store/projects_slice";

const Finish = () => {
  const dispatch = useDispatch();
  const { projectName, street, city, zip, state } = useSelector(
    // @ts-ignore
    (state) => state.newProject
  );

  return (
    <View style={[gs.flex1, gs.appBackground]}>
      <View style={[gs.flex1, gs.align_center, gs.justify_center]}>
        <View>
          <Text style={[gs.text_gray, gs.text_xlarge]}>{projectName}</Text>
          <Text style={[gs.text_gray, gs.text_large]}>{street}</Text>
          <Text style={[gs.text_gray, gs.text_large]}>
            {city}
            {", "}
            {state} {zip}
          </Text>
        </View>
      </View>

      {/* Button */}
      <View style={[gs.width100, gs.flex_row, gs.paddingH20, { gap: 20 }]}>
        <View style={[gs.paddingV20, gs.flex1]}>
          {primaryButton_filled(
            "Finish",
            sendProject(
              { name: projectName, street, city, zip, state },
              dispatch
            ),
            {
              color: greenColor,
              textSize: text_large,
              textColor: appBackground,
            }
          )}
        </View>
        <View style={[gs.paddingV20]}>
          {secondaryButton_outlined("Cancel", page_hop("/"), {
            color: gray,
            textSize: text_large,
          })}
        </View>
      </View>
    </View>
  );
};

const page_hop = (route) => {
  return () => router.replace(route);
};

const sendProject = (projDetails, dispatch) => {
  console.log({ projDetails });
  return async () => {
    const { status, result } = await fillFetchRequest({
      route: "/createProject",
      method: "POST",
      _body: { projDetails },
    });

    if (status.didFail()) {
      alert(`Error sending project to server: ${status.errorMessage}`);
      status.printReport();
      return;
    }

    const { newProject, allProjectNamesAndIds } = result;
    const route = `/existing/id[${newProject._id}]`;

    console.log({ newProject, route });

    dispatch(hydrateProject({ project: newProject }));
    dispatch(syncProjectList({ allProjectNamesAndIds }));

    router.replace(route);
  };
};

export default Finish;
