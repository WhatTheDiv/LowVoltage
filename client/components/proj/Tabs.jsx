import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import gs, { darkGray, gray, greenColor } from "../../assets/globalStyles";
import { setTab } from "../../store/ui_slice";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../helper/stringManip";
import { router } from "expo-router";
import { clearLoadedProject } from "../../store/projects_slice";

// [x] Bring device view, location view, and zone view into tabs
// [x] Create 'leave project' button in tabs

const Tabs = ({}) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { tabExpanded, tabSelected, viewSelected } = useSelector(
    // @ts-ignore
    (state) => state.ui
  );
  const tabNames = [
    {
      alias: "overview",
      name: "Overview",
      // @ts-ignore
      img: require("../../assets/icons/magnifying-glass.png"),
      disabled: false,
    },
    {
      alias: "materials",
      name: "Materials",
      // @ts-ignore
      img: require("../../assets/icons/material.png"),
      disabled: true,
    },
    // {
    //   alias: "create",
    //   name: "Create",
    //   // @ts-ignore
    //   img: require("../../assets/icons/zones.png"),
    //   disabled: true,
    // },
    {
      alias: "view",
      view: "zone",
      name: "Zones",
      // @ts-ignore
      img: require("../../assets/icons/zones.png"),
      disabled: false,
    },
    {
      alias: "view",
      view: "device",
      name: "Devices",
      // @ts-ignore
      img: require("../../assets/icons/device.png"),
      disabled: false,
    },
    {
      alias: "view",
      view: "location",
      name: "Locations",
      // @ts-ignore
      img: require("../../assets/icons/Location.png"),
      disabled: false,
    },
    {
      alias: "back",
      name: "Leave Project",
      // @ts-ignore
      img: require("../../assets/icons/zones.png"),
      disabled: false,
    },
  ];

  const bus = {
    tabSelected,
    tabExpanded,
    viewSelected,
    tabNames,
    dispatch,
  };

  return (
    <View style={[]}>
      {tabExpanded && render_expandedTabs(bus)}
      {!tabExpanded && render_collapsedTab(bus)}

      <View style={[gs.background_gray_a, gs.marginH10, { height: 0.5 }]} />
    </View>
  );
};

const get_isTabSelected = (tab, viewSelected, tabSelected) => {
  if (tab.alias === "view")
    return tab.view === viewSelected && tabSelected === "view";
  else {
    return tab.alias === tabSelected;
  }
};

const render_expandedTabs = ({
  tabNames,
  tabSelected,
  viewSelected,
  dispatch,
}) => {
  return tabNames.map((t, i) => {
    const isTabSelected = get_isTabSelected(t, viewSelected, tabSelected);
    return (
      <Pressable
        key={i}
        style={[
          gs.paddingV10,
          gs.paddingH20,
          gs.flex_row,
          gs.align_center,
          { opacity: t.disabled ? 0.5 : 1 },
        ]}
        disabled={t.disabled}
        onPress={() => handle_tabClick(t, dispatch)}
      >
        <Image
          source={t.img}
          style={[{ marginRight: 5, height: 20, width: 20 }]}
          tintColor={isTabSelected ? greenColor : gray}
        />
        <Text
          style={[
            isTabSelected ? gs.text_green : gs.text_gray,
            gs.text_center,
            gs.text_large,
            gs.flex1,
          ]}
        >
          {t.name}
        </Text>
      </Pressable>
    );
  });
};
const render_collapsedTab = ({
  tabNames,
  tabSelected,
  viewSelected,
  dispatch,
}) => {
  const t = tabNames.find((t) => {
    return get_isTabSelected(t, viewSelected, tabSelected);
  });
  return (
    <Pressable
      style={[gs.paddingV10, gs.paddingH20, gs.flex_row, gs.align_center]}
      onPress={() => handle_tabClick({ alias: "" }, dispatch)}
    >
      <Image
        source={t.img}
        style={[{ marginRight: 5, height: 20, width: 20 }]}
        tintColor={gray}
      />
      <Text style={[gs.text_gray, gs.text_center, gs.text_large, gs.flex1]}>
        {t.name}
      </Text>
    </Pressable>
  );
};
const handle_tabClick = ({ alias, view = undefined }, dispatch) => {
  if (!alias) dispatch(setTab({ tabExpanded: true }));
  else if (alias === "back") {
    dispatch(setTab({ tabExpanded: false, tabSelected: "overview" }));
    dispatch(clearLoadedProject());
    router.replace("/");
  } else
    dispatch(
      setTab({ tabExpanded: false, tabSelected: alias, viewSelected: view })
    );
};

export default Tabs;
