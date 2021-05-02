import React from "react";
import { View, StyleSheet } from "react-native";
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
        animationDuration={50}
        ref={(ref) => (_menu = ref)}
        button={
          <Feather
            style={{ marginRight: -13 }}
            onPress={() => _menu.show()}
            name="more-vertical"
            size={28}
            color="black"
          />
        }
      >
        <MenuItem
          ref={(ref) => (_menu = ref)}
          onPress={() => {
            navigation.navigate("AddRoom");
            _menu.hide();
          }}
        >
          New Room
        </MenuItem>
        <MenuDivider />
        <MenuItem
          ref={(ref) => (_menu = ref)}
          onPress={() => {
            navigation.navigate("EditProfile");
            _menu.hide();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          ref={(ref) => (_menu = ref)}
          onPress={() => {
            navigation.navigate("ChangePass");
            _menu.hide();
          }}
        >
          Settings
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
