import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const FloatingButton = ({ onPress }) => {
  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.TouchableOpacityStyle}
      >
        <AntDesign
          name="addusergroup"
          size={50}
          color="white"
          onPress={onPress}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  TouchableOpacityStyle: {
    backgroundColor: "#000000",
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 25,
    bottom: 55,
    borderRadius: 9,
  },

  //   FloatingButtonStyle: {
  //     resizeMode: "contain",
  //     width: 50,
  //     height: 50,
  //   },
});
