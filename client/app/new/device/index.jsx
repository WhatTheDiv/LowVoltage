import { View, Text, TextInput } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import gs, {
  appBackground,
  appBackground2,
  gray,
  greenColor,
  orangeColor,
  text_large,
  text_medium,
  text_xlarge,
} from "../../../assets/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setZone } from "../../../store/newProject_slice";
import { secondaryButton_outlined } from "../../../components/buttons";
import { router } from "expo-router";
import { fillFetchRequest } from "../../../helper/fetching";
import { hydrateProject } from "../../../store/projects_slice";
import { SelectList } from "react-native-dropdown-select-list";
import { selectList_devices, selectList_zones } from "../../../helper/projData";

const newDevice = () => {
  const dispatch = useDispatch();
  const [selectedDevice, setSelectedDevice] = useState("");
  const { globalDevices } = useSelector(
    // @ts-ignore
    (state) => state.projects.currentProject
  );

  const dropdownRef = useRef(null);
  const [dropdownDims, setDropdownDims] = useState({ height: 0, width: 0 });
  const deviceData = [
    { key: 1, value: "one" },
    { key: 2, value: "two" },
    { key: 3, value: "three" },
    { key: 4, value: "four" },
    { key: 5, value: "five" },
    { key: 6, value: "six" },
    { key: 7, value: "seven" },
  ];
  // const deviceData = selectList_devices(globalDevices);

  console.log({ deviceData });

  useEffect(() => {
    if (dropdownRef.current)
      // @ts-ignore
      dropdownRef.current.measure((x, y, width, height) => {
        setDropdownDims({ width, height });
      });
  }, []);

  return (
    <View style={[gs.appBackground, gs.flex1]}>
      <View style={[gs.flex1]}>
        {/* Select Device */}
        <View style={[gs.marginH10, { marginTop: "12%" }]}>
          <View
            style={[
              gs.paddingH30,
              { borderBottomWidth: 1, borderBottomColor: gray },
            ]}
          >
            <View
              ref={dropdownRef}
              style={[
                gs.relative,
                {
                  height: text_xlarge * 1.25,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0)",
                },
              ]}
            >
              <View
                style={[
                  gs.absolute,
                  {
                    top: 0,
                    width: dropdownDims.width,
                    zIndex: 0,
                  },
                ]}
              >
                <SelectList
                  setSelected={(key) => {
                    setSelectedDevice(key);
                  }}
                  defaultOption={deviceData[0]}
                  data={deviceData}
                  save="key"
                  arrowicon={<View />}
                  boxStyles={{
                    width: dropdownDims.width,
                    height: dropdownDims.height,
                    borderWidth: 0,
                    padding: 0,
                    margin: 0,
                    justifyContent: "center",
                    position: "relative",
                  }}
                  inputStyles={{
                    position: "absolute",
                    top: 0,

                    fontSize: text_xlarge,
                    color: !selectedDevice ? gray : orangeColor,
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                  }}
                  dropdownStyles={{
                    borderWidth: 1,
                    borderColor: "red",
                    padding: 0,
                    margin: 0,
                    backgroundColor: appBackground2,
                  }}
                  dropdownTextStyles={{
                    textAlign: "center",
                    fontSize: text_large,
                    color: gray,
                    padding: 10,
                    margin: 0,
                  }}
                  dropdownItemStyles={{ padding: 0, margin: 0 }}
                  searchicon={<View />}
                  search={false}
                />
              </View>
            </View>
          </View>
          <Text
            style={[
              gs.text_gray,
              gs.text_medium,
              gs.absolute,
              { bottom: 0 - text_medium - 4, zIndex: -1 },
            ]}
          >
            Add Device
          </Text>
        </View>
      </View>

      {/* Button */}
      <View style={[gs.width100]}>
        <View style={[gs.padding20]}>
          {secondaryButton_outlined(
            "Create",
            handle_finish(dispatch, selectedDevice),
            {
              color: greenColor,
              textSize: text_large,
            }
          )}
        </View>
      </View>
    </View>
  );
};

const handle_finish = (dispatch, selectedDevice) => {
  // @ts-ignore
  const projectId = useSelector((state) => state.projects.currentProject._id);

  return async () => {
    const { status, result } = await fillFetchRequest({
      route: "/updateProject",
      method: "POST",
      _body: {
        projectId,
        addDevice: { deviceId: selectedDevice, locationId: "" },
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

export default newDevice;
