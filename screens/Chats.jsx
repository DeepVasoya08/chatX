import React, { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";

const Chats = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  let ScrollToEnd = useRef();

  useLayoutEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("roomChats")
      .doc(route.params.id.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
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
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "white", marginLeft: 12, fontWeight: "700" }}>
              {route.params.id.RoomName}
            </Text>
            <Text
              style={{
                color: "white",
                marginLeft: 12,
                fontWeight: "600",
                fontSize: 11,
              }}
            >
              Admin: {route.params.id.admin}
            </Text>
          </View>
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

  const sendMsg = () => {
    firebase
      .firestore()
      .collection("roomChats")
      .doc(route.params.id.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: firebase.auth().currentUser.displayName,
        email: firebase.auth().currentUser.email,
        photoURL: firebase.auth().currentUser.photoURL,
      });
    setInput("");
  };

  const getImage = async () => {
    const picker = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (picker.cancelled) {
      return;
    }
    try {
      const response = await fetch(picker.uri);
      const blob = await response.blob();
      const imgName = picker.uri.substring(picker.uri.lastIndexOf("/") + 1);
      const task = firebase
        .storage()
        .ref("group/sharedImg")
        .child(imgName)
        .put(blob);
      await task.then(async (res) => {
        await res.ref
          .getDownloadURL()
          .then((uri) => {
            firebase
              .firestore()
              .collection("roomChats")
              .doc(route.params.id.id)
              .collection("messages")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                displayName: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                photoURL: firebase.auth().currentUser.photoURL,
                image: uri,
              });
          })
          .catch((err) => {
            alert(err.message);
          });
      });
    } catch (err) {
      alert("please try again!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#cccccc" }}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 15 }}
        ref={ScrollToEnd}
        onContentSizeChange={() => {
          ScrollToEnd.current.scrollToEnd({ animated: true });
        }}
      >
        {messages.map(({ id, data }) =>
          data.email === firebase.auth().currentUser.email ? (
            <View
              key={id}
              style={data.message ? styles.sender : styles.senderImg}
            >
              {data.message ? (
                <Text style={styles.senderText}>{data.message}</Text>
              ) : (
                <Image
                  loadingIndicatorSource={require("../assets/logo.png")}
                  style={{ width: 170, height: 300, borderRadius: 12 }}
                  source={{ uri: data.image }}
                />
              )}
            </View>
          ) : (
            <View
              key={id}
              style={data.message ? styles.reciever : styles.recieverImg}
            >
              {data.message ? (
                <Avatar
                  source={{ uri: data.photoURL }}
                  rounded
                  size={30}
                  position="absolute"
                  bottom={-15}
                />
              ) : (
                <Avatar
                  source={{ uri: data.photoURL }}
                  rounded
                  size={30}
                  position="absolute"
                  bottom={-15}
                  containerStyle={{ marginLeft: 5 }}
                />
              )}
              {data.message ? (
                <>
                  <Text style={styles.recieverText}>{data.message}</Text>
                  <Text style={styles.recieverText}>{data.displayName}</Text>
                </>
              ) : (
                <>
                  <Image
                    loadingIndicatorSource={require("../assets/logo.png")}
                    style={{ width: 170, height: 300, borderRadius: 12 }}
                    source={{ uri: data.image }}
                  />
                  <Text style={styles.recieverText}>{data.displayName}</Text>
                </>
              )}
            </View>
          )
        )}
      </ScrollView>
      <View
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.footer}
      >
        <TextInput
          value={input}
          onChangeText={(txt) => setInput(txt)}
          placeholder="Type..."
          style={styles.textInput}
          onSubmitEditing={sendMsg}
        />
        <TouchableOpacity onPress={getImage}>
          <MaterialIcons name="perm-media" size={25} color="white" />
        </TouchableOpacity>
        {!input ? (
          <TouchableOpacity activeOpacity={0.5}>
            <MaterialIcons name="emoji-emotions" size={25} color="white" />
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
      </View>
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
    marginRight: 5,
    marginBottom: 10,
    maxWidth: "80%",
    position: "relative",
    borderTopRightRadius: 1,
  },
  senderImg: {
    padding: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
    position: "relative",
    marginBottom: 5,
  },
  senderText: {
    color: "black",
    fontWeight: "500",
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
  recieverImg: {
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    position: "relative",
    marginBottom: 5,
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
