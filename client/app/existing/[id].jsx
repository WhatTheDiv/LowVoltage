import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
// @ts-ignore
// @ts-ignore
// @ts-ignore
import { router, Stack } from "expo-router";
// @ts-ignore
// @ts-ignore
// @ts-ignore
import gs, {
  appBackground2,
  f_err,
  f_hlt,
  f_hlt2,
} from "../../assets/globalStyles";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "expo-router";
// @ts-ignore
import {
  hydrateProject,
  clearLoadedProject,
  setNeedToRecalculate,
} from "../../store/projects_slice";
import { fillFetchRequest } from "../../helper/fetching";
import Tabs from "../../components/proj/Tabs";
import Overview from "../../components/proj/overview/Overview";
import ViewStyle from "../../components/proj/viewStyle/ViewStyle";
import {
  processData_deviceView,
  processData_locationView,
  processData_overview,
  processData_zoneView,
} from "../../helper/projData";

// - - - - - - - - - -                Tabs
// [ ] Bring device view, location view, and zone view into tabs
// [ ] Create 'leave project' button in tabs

// - - - - - - - - - -                Device View
// [ ] Add unassigned device list to device view much needed
// [ ] Add count next to expanded location | device > zone > locatin

// - - - - - - - - - -                Location View
// [ ] Get rid of green tab on card when no icons are available

const project = () => {
  const dispatch = useDispatch();
  const projectId = useLocalSearchParams().id;

  const [data_DeviceView, setData_deviceView] = useState([]);
  const [data_zoneView, setData_zoneView] = useState([]);
  const [data_locationView, setData_locationView] = useState({});
  const [data_overview, setData_overview] = useState({});
  const [loadingProject, setLoadingProject] = useState(false);

  const {
    // @ts-ignore
    details,
    // @ts-ignore
    _id,
    zones,
    devices,
    locations,
    // @ts-ignore
    materials,
    usedDevices,
    globalDevices,
    zoneListObject,
    deviceListObject,
    locationListObject,
    // @ts-ignore
  } = useSelector((state) => state.projects.currentProject);

  // @ts-ignore
  const tab = useSelector((state) => state.ui.tabSelected);

  const projectHydrated = useSelector(
    // @ts-ignore
    (state) => state.projects.currentProjectHydrated
  );
  const needToRecalculate = useSelector(
    // @ts-ignore
    (state) => state.projects.needToRecalculate
  );

  useEffect(() => {
    if (projectHydrated && needToRecalculate) {
      console.log("Calculating .... ");
      const data = {
        setData_zoneView,
        setData_deviceView,
        setData_overview,
        setData_locationView,
        setLoadingProject,
        devices,
        usedDevices,
        zones,
        locations,
        deviceListObject,
        locationListObject,
        zoneListObject,
        dispatch,
      };

      calculateProjectData(data);
    }
  }, [projectHydrated, needToRecalculate]);

  useEffect(() => {
    // return () => {
    //   dispatch(clearLoadedProject({}));
    // };
  }, []);

  // Exit early and Redirect to home if page has no 'projectId' or the app is not hydrated
  // @ts-ignore
  if (!projectId || !useSelector((state) => state.ui.hydrated)) {
    console.log("%cRedirect to route ", f_err);
    return <Redirect href={"/"} />;
  }

  // Catch everything until project hydrated & calculated
  if (!projectHydrated || loadingProject) {
    if (!loadingProject) {
      console.log("Setting up project ...");
      setLoadingProject(true);
      setProject(projectId, dispatch);
    }

    return (
      <View style={[gs.appBackground, gs.flex1]}>
        <Text style={[gs.text_white, gs.text_xlarge]}>
          Loading project ...{" "}
        </Text>
      </View>
    );
  }

  const bus = {
    data_DeviceView,
    data_locationView,
    data_zoneView,
    data_overview,
    globalDevices,
    usedDevices,
    devices,
    deviceListObject,
    locationListObject,
    zoneListObject,
    locations,
    zones,
    spaceBetweenSections: 30,
  };

  return (
    <View style={[gs.flex1, gs.appBackground]}>
      <Tabs />
      {tab == "overview" && <Overview bus={bus} />}
      {tab == "materials" && <Overview bus={bus} />}
      {tab == "create" && <Overview bus={bus} />}
      {tab == "view" && <ViewStyle bus={bus} />}
    </View>
  );
};

const setProject = async (id, dispatch) => {
  const _body = { projectId: id };
  // @ts-ignore
  const { result, status } = await fillFetchRequest({
    route: "/projectData",
    method: "POST",
    _body,
  });

  if (status.didFail()) return router.replace("/existing");

  const { project, simpleGlobalDevices, usedDevices } = result;
  console.log("%cProject data from server: ", f_hlt2, result);

  dispatch(hydrateProject({ project, simpleGlobalDevices, usedDevices }));
};

const calculateProjectData = ({
  setData_zoneView,
  setData_deviceView,
  setData_overview,
  setData_locationView,
  devices,
  usedDevices,
  zones,
  locations,
  deviceListObject,
  locationListObject,
  zoneListObject,
  setLoadingProject,
  dispatch,
}) => {
  const processedLocationData = processData_locationView({
    locationListObject,
    locations,
    devices,
    deviceListObject,
    zones,
    usedDevices,
    zoneListObject,
  });
  const _usedZonesArray = processData_zoneView({
    zones,
    usedDevices,
    devices,
    deviceListObject,
  });

  const _usedDevicesArray = processData_deviceView({
    usedDevices,
    zones,
    locations,
    devices,
    locationListObject,
  });
  const overviewData = processData_overview({
    devices,
    deviceListObject,
    zoneListObject,
    locationListObject,
  });

  console.log("%cProcessed data: ", f_hlt2, {
    processedLocationData,
    _usedZonesArray,
    _usedDevicesArray,
    overviewData,
  });

  setData_locationView(processedLocationData);
  setData_zoneView(_usedZonesArray);
  setData_deviceView(_usedDevicesArray);
  setData_overview(overviewData);
  setLoadingProject(false);
  dispatch(setNeedToRecalculate(false));
};

export default project;
