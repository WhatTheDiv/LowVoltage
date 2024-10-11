// @ts-nocheck
import React, {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import gs, {
  appBackground2,
  gray,
  orangeColor,
  text_medium,
  text_large,
} from "../assets/globalStyles";

export const render_field = (
  field,
  { targetedInput, setTargetedInput, useSelector, dispatch },
  key = 0,
  options = {}
) => {
  const storeValue = useSelector((state) => state.newProject[field.name]);

  return (
    <View
      style={[
        styles.input.container,
        { borderBottomWidth: targetedInput === field.name ? 1 : 0 },
      ]}
      key={key}
    >
      <Text
        style={[styles.input.text, { flexWrap: "nowrap", width: 120 }]}
        numberOfLines={1}
      >
        {field.display}
      </Text>
      <TextInput
        style={[styles.input.inputField]}
        value={storeValue}
        onChangeText={(text) => {
          dispatch(field.store({ [field.name]: text }));
        }}
        keyboardType={field.name === "zip" ? "numeric" : "default"}
        onFocus={() => setTargetedInput(field.name)}
        onBlur={() => setTargetedInput("")}
        numberOfLines={1}
        returnKeyType={options.last ? "go" : "next"}
        onSubmitEditing={options.last && options.submit}
      />
    </View>
  );
};

export const createField = (storeProperty, displayedAs, storeAction) => {
  return { name: storeProperty, display: displayedAs, store: storeAction };
};

const styles = StyleSheet.create({
  input: {
    container: {
      flexDirection: "row",
      borderBottomColor: appBackground2,
      marginHorizontal: 10,
    },
    text: {
      color: gray,
      fontSize: text_medium,
      alignSelf: "flex-end",
      marginHorizontal: 10,
      marginBottom: 2,
    },
    inputField: {
      fontSize: text_large,
      color: orangeColor,
      textAlign: "center",
      borderWidth: 0,
      outline: "none",
      paddingRight: 10,
      flexShrink: 0,
      // flexGrow: 1,
      width: "100%",
      flex: 1,
      paddingTop: 35,
    },
  },
});
