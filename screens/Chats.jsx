import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";

const Chats = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMsg = () => {
    firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input || null,
        displayName: firebase.auth().currentUser.displayName,
        email: firebase.auth().currentUser.email,
        photoURL: firebase.auth().currentUser.photoURL,
      });
    setInput("");
  };

  useLayoutEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) =>
        setMessages(
          snap.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsub;
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#757575" },
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -30,
          }}
        >
          <Avatar rounded source={require("../assets/group.jpg")} />
          <Text style={{ color: "white", marginLeft: 12, fontWeight: "700" }}>
            {route.params.RoomName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 90,
            // marginRight: 15,
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              style={{ marginRight: 20 }}
              name="video-call"
              size={27}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              style={{ marginRight: 30 }}
              name="call"
              size={27}
              color="white"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#cccccc" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === firebase.auth().currentUser.email ? (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      source={{ uri: data.photoURL }}
                      rounded
                      size={28}
                      position="absolute"
                      bottom={-17}
                      right={-5}
                      // containerStyle={{
                      //   position: "absolute",
                      //   bottom: 13,
                      //   right: -5,
                      // }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      source={{ uri: data.photoURL }}
                      rounded
                      size={30}
                      position="absolute"
                      bottom={-20}
                      // containerStyle={{
                      //   position: "absolute",
                      //   bottom: -15,
                      // }}
                    />
                    <Text style={styles.recieverText}>{data.message}</Text>
                    <Text style={styles.recieverName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.footer}
            >
              <TextInput
                value={input}
                onChangeText={(txt) => setInput(txt)}
                placeholder="Let's Go.."
                style={styles.textInput}
                onSubmitEditing={sendMsg}
              />
              <TouchableOpacity>
                <MaterialIcons name="perm-media" size={25} color="white" />
              </TouchableOpacity>
              {!input ? (
                <TouchableOpacity activeOpacity={0.5}>
                  <MaterialIcons
                    name="emoji-emotions"
                    size={25}
                    color="white"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={!input}
                  activeOpacity={0.5}
                  onPress={sendMsg}
                >
                  <MaterialIcons name="send" size={25} color="#2b86e6" />
                </TouchableOpacity>
              )}
            </KeyboardAvoidingView>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 0.9,
    backgroundColor: "#efecec",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  sender: {
    padding: 11,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 15,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderImage: {
    alignSelf: "flex-end",
    borderRadius: 15,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    borderRadius: 20,
    width: 180,
    height: 300,
  },
  reciever: {
    padding: 10,
    backgroundColor: "#4E342E",
    alignSelf: "flex-start",
    borderRadius: 15,
    maxWidth: "80%",
    position: "relative",
    borderTopLeftRadius: 1,
    marginLeft: 5,
    marginBottom: 30,
  },
  senderText: {
    color: "black",
    fontWeight: "500",
  },
  recieverText: {
    color: "white",
    fontWeight: "400",
    marginLeft: 10,
    paddingBottom: 5,
  },
  recieverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
});
