import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";

const AddRoom = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Room",
      headerStyle: { backgroundColor: "#ecf0f1" },
      headerBackTitle: "Back",
    });
  }, []);

  const createRoom = async () => {
    setLoading(true);
    await firebase
      .firestore()
      .collection("roomChats")
      .add({
        RoomName: input,
        admin: firebase.auth().currentUser.displayName,
        adminID: firebase.auth().currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert(
          "Something went wrong",
          "Can't connect to server, please try agian!"
        );
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar animated networkActivityIndicatorVisible style="dark" />
      <Input
        autoFocus={true}
        style={{ color: "black" }}
        placeholder="Enter Room Name"
        value={input}
        onChangeText={setInput}
        leftIcon={
          <Icon
            style={{ marginRight: 2 }}
            name="group"
            type="antdesign"
            size={24}
            color="black"
          />
        }
        onSubmitEditing={createRoom}
      />
      <Button
        disabled={!input}
        loading={loading ? true : false}
        onPress={createRoom}
        title="Create"
      />
    </View>
  );
};

export default AddRoom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
