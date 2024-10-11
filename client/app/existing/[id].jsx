// @ts-nocheck
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import gs, { appBackground2 } from "../../assets/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "expo-router";
import { hydrateProject, clearLoadedProject } from "../../store/projects_slice";
import { fillFetchRequest } from "../../helper/fetching";

const project = () => {
  const dispatch = useDispatch();
  const projectId = useLocalSearchParams().id;

  if (!projectId || !useSelector((state) => state.ui.hydrated))
    return <Redirect href={"/"} />;

  const project = useSelector((state) => state.projects.currentProject);
  const projectHydrated = useSelector(
    (state) => state.projects.currentProjectHydrated
  );

  if (!projectHydrated && projectId) setProject(projectId, dispatch);

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: appBackground2,
    },
    headerTitleAlign: "center",
    headerTitle: project.name,
  };

  useEffect(() => {
    return () => {
      dispatch(clearLoadedProject({}));
    };
  }, []);

  return (
    <View style={[gs.flex1, gs.appBackground]}>
      <Stack.Screen options={screenOptions} />
      <Text style={[gs.text_xlarge, gs.text_gray]}>ID - {project._id}</Text>
    </View>
  );
};

const setProject = async (id, dispatch) => {
  const _body = { projectId: id };
  const { result, status } = await fillFetchRequest({
    route: "/projectData",
    method: "POST",
    _body,
  });

  if (status.didFail()) return router.replace("/existing");

  const { project } = result;

  dispatch(hydrateProject({ project }));
};

export default project;
