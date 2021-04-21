import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

const Alert = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.top}>
        <Image />
      </View>
      <View style={styles.middle}></View>
      <View style={styles.bottom}></View>
    </View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    height: "25%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#404040",
    borderWidth: 2,
    borderColor: "#FFOOOO",
    borderRadius: 10,
    padding: 4,
  },
  top: {
    flex: 0.5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FF00",
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  middle: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF6600",
    textAlign: "center",
    textAlignVertical: "center",
    padding: 4,
    fontSize: 16,
    marginVertical: 2,
    color: "#FFFFFF",
  },
  bottom: {
    flex: 0.5,
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#0066FF",
    padding: 4,
    justifyContent: "space-evenly",
  },
});
