import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import firebase from "firebase";

const PopUp = ({ navigation }) => {
  let _menu = null;

  const signOut = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Menu
        animationDuration={100}
        ref={(ref) => (_menu = ref)}
        button={
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ marginRight: -15 }}
            onPress={() => _menu.show()}
          >
            <Feather
              onPress={() => _menu.show()}
              name="more-vertical"
              size={28}
              color="black"
            />
          </TouchableOpacity>
        }
      >
        <MenuItem onPress={() => navigation.push("AddRoom")}>
          New group
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => navigation.push("EditProfile")}>
          Profile
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={signOut}>Logout</MenuItem>
      </Menu>
    </View>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  container: { margin: 10, flexDirection: "row", justifyContent: "flex-end" },
  textStyle: { fontSize: 25, marginTop: 16, color: "red" },
});
