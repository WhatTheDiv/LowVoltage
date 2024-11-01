import { View, Text } from "react-native";
import React from "react";
import Cctv from "./Cctv";
import Network from "./Network";
import Unassigned from "./Unassigned";
import Ac from "./Ac";
import gs from "../../../assets/globalStyles";

const Overview = ({
  bus: { usedDevices, devices, locations, zones, data_overview },
}) => {
  const bus = {
    spacingBetweenSections: 30,
    unassignedDeviceArr: devices.filter((device) => !device.locationId),
    unassignedLocationArr: locations.filter((location) => !location.headId),
    // unassignedDeviceArr: [],
    // unassignedLocationArr: [],
    usedDevices,
    devices,
    locations,
    zones,
    data_overview,
  };

  return (
    <View>
      <Unassigned bus={bus} />
      <Cctv bus={bus} />
      <Ac bus={bus} />
      <Network bus={bus} />
    </View>
  );
};

export default Overview;
