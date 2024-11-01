import { View, Text, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import gs, { greenColor } from "../../../assets/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import LocationView from "./LocationView";
import DeviceView from "./DeviceView";
import ZoneView from "./ZoneView";

const ViewStyle = ({ bus }) => {
  const [changeViewHidden, setChangeViewHidden] = useState(true);
  // @ts-ignore
  const viewStyle = useSelector((state) => state.ui.viewSelected);

  // @ts-ignore
  const height = useSelector((state) => state.ui.screenHeight);
  // @ts-ignore
  const width = useSelector((state) => state.ui.screenWidth);
  return (
    <View style={[gs.flex1, gs.relative, gs.hidden, { paddingBottom: 20 }]}>
      {/* {!changeViewHidden && (
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={10}
          style={[
            gs.absolute,
            gs.width100,
            {
              top: 0,
              left: 0,
              height: height,
              width: width,
              zIndex: 100,
            },
          ]}
        >
          <Pressable
            style={[{ height, width, zIndex: 101 }]}
            onPress={() => {
              setChangeViewHidden(true);
            }}
          />
        </BlurView>
      )} */}
      {viewStyle === "location" && (
        <LocationView bus={bus} setChangeViewHidden={setChangeViewHidden} />
      )}
      {viewStyle === "device" && (
        <DeviceView bus={bus} setChangeViewHidden={setChangeViewHidden} />
      )}
      {viewStyle === "zone" && (
        <ZoneView bus={bus} setChangeViewHidden={setChangeViewHidden} />
      )}
    </View>
  );
};

// const render_setDisplayBubble = (
//   changeViewHidden,
//   setChangeViewHidden,
//   height,
//   setDisplaySelection
// ) => {
//   const bubbleHeight = changeViewHidden ? height * 0.07 : height * 0.6;
//   const offset_x = -bubbleHeight * 0.6;
//   const offset_y = -bubbleHeight * (changeViewHidden ? 0.4 : 0.35);
//   // const offset_y = -bubbleHeight * (changeViewHidden ? 0.4 : 0.3);

//   return (
//     <Pressable
//       style={[
//         gs.background_green,
//         gs.absolute,
//         {
//           top: 0,
//           left: 0,
//           height: bubbleHeight,
//           width: bubbleHeight,
//           borderRadius: -offset_x,
//           zIndex: 101,
//           transform: [{ translateX: offset_x }, { translateY: offset_y }],
//         },
//       ]}
//       onPress={() => changeViewHidden && setChangeViewHidden(false)}
//     >
//       {!changeViewHidden && (
//         <View
//           style={[
//             {
//               width: bubbleHeight * 0.45,
//               marginTop: -offset_y,
//               marginLeft: -offset_x,
//               gap: 20,
//             },
//           ]}
//         >
//           {["Location View", "Device View", "Zone View"].map((name, i) => (
//             <Pressable
//               key={i}
//               style={[gs.paddingV20, { paddingLeft: 20 }]}
//               onPress={() =>
//                 handle_changeDisplay(
//                   name,
//                   setDisplaySelection,
//                   setChangeViewHidden
//                 )
//               }
//             >
//               <Text style={[gs.text_xlarge, gs.text_bold]} numberOfLines={1}>
//                 {name}
//               </Text>
//             </Pressable>
//           ))}
//         </View>
//       )}
//     </Pressable>
//   );
// };

// const handle_changeDisplay = (
//   newDisplay,
//   setDisplaySelection,
//   setChangeViewHidden
// ) => {
//   // ["Location View", "Device View", "Zone View"]
//   switch (newDisplay) {
//     case "Location View":
//       setDisplaySelection("loc");
//       break;
//     case "Device View":
//       setDisplaySelection("dev");
//       break;
//     case "Zone View":
//       setDisplaySelection("zone");
//       break;
//   }
//   setChangeViewHidden(true);
// };

export default ViewStyle;
