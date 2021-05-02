import React, { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
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
  let openEmoji = useRef();
  const senderID = firebase.auth().currentUser.uid;
  const receiverID = route.params.id.id;

  const sorted =
    senderID < receiverID ? senderID + receiverID : receiverID + senderID;

  const sendMsg = () => {
    firebase
      .firestore()
      .collection("personalChats")
      .doc(sorted)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        sender: senderID,
        reciever: receiverID,
      });
    setInput("");
  };

  useLayoutEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("personalChats")
      .doc(sorted)
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
          <Avatar
            rounded
            source={
              !route.params.id.photoURL
                ? require("../assets/avatar-placeholder.png")
                : { uri: route.params.id.photoURL }
            }
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
              {route.params.id.name}
            </Text>
            <Text
              style={{
                color: "white",
                marginLeft: 10,
                fontWeight: "200",
                fontSize: 12,
              }}
            >
              {route.params.id.status}
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
        .ref("personalChats/sharedImg")
        .child(imgName)
        .put(blob);
      await task.then(async (res) => {
        await res.ref
          .getDownloadURL()
          .then((uri) => {
            firebase
              .firestore()
              .collection("personalChats")
              .doc(sorted)
              .collection("messages")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sender: senderID,
                reciever: receiverID,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : ""}
    >
      <StatusBar style="light" />
      <ScrollView
        ref={ScrollToEnd}
        onContentSizeChange={() => {
          ScrollToEnd.current.scrollToEnd({
            animated: true,
          });
        }}
        contentContainerStyle={{ paddingTop: 15 }}
      >
        {messages.map(({ id, data }) =>
          data.sender === senderID ? (
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
                <Text style={styles.recieverText}>{data.message}</Text>
              ) : (
                <Image
                  loadingIndicatorSource={require("../assets/logo.png")}
                  style={{ width: 170, height: 300, borderRadius: 12 }}
                  source={{ uri: data.image }}
                />
              )}
            </View>
          )
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          // ref={openEmoji}
          value={input}
          onChangeText={setInput}
          placeholder="Type..."
          style={styles.textInput}
        />
        {!input ? (
          <>
            <TouchableOpacity onPress={getImage}>
              <MaterialIcons name="perm-media" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}>
              <MaterialIcons
                onPress={() => openEmoji.current.focus()}
                name="emoji-emotions"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          </>
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
    </KeyboardAvoidingView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cccccc",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
  },
  textInput: {
    height: 40,
    flex: 0.95,
    backgroundColor: "#efecec",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  sender: {
    padding: 11,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 10,
    marginRight: 5,
    maxWidth: "80%",
    position: "relative",
    marginBottom: 5,
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
    alignItems: "center",
  },
  reciever: {
    padding: 10,
    backgroundColor: "#4E342E",
    alignSelf: "flex-start",
    borderRadius: 10,
    maxWidth: "80%",
    position: "relative",
    borderTopLeftRadius: 1,
    marginLeft: 5,
    marginBottom: 5,
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
  },
});
