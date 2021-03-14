import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";

const AddRoom = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Group",
      headerStyle: { backgroundColor: "#ecf0f1" },
      headerBackTitle: "Back",
    });
  }, []);

  const createRoom = async () => {
    await firebase
      .firestore()
      .collection("chats")
      .add({
        RoomName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => Alert.alert(String(err)));
  };

  return (
    <View style={styles.container}>
      <StatusBar animated networkActivityIndicatorVisible style="dark" />
      <Input
        style={{ color: "white" }}
        placeholder="Enter Group Name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon name="group" type="antdesign" size={24} color="white" />
        }
        onSubmitEditing={createRoom}
      />
      <Button disabled={!input} onPress={createRoom} title="Create" />
    </View>
  );
};

export default AddRoom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2c3e50",
    padding: 30,
    height: "100%",
  },
});
