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
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";

const Chats = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [imageshr, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  let ScrollToEnd = useRef();
  const senderID = firebase.auth().currentUser.uid;
  const receiverID = route.params.id;

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
            source={{
              uri:
                route.params.image ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.name}
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
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (pickerResult.cancelled) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(pickerResult.uri);
      const blob = await response.blob();
      const imageName = pickerResult.uri.substring(
        pickerResult.uri.lastIndexOf("/") + 1
      );
      const task = firebase
        .storage()
        .ref("personalChats/sharedImages")
        .child(imageName)
        .put(blob);
      await task.then(async (res) => {
        await res.ref.getDownloadURL().then((res) => {
          firebase.firestore().collection("personalChats").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            receiverID: receiverID,
            senderID: senderID,
          });
        });
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Please Try Again", String(error.message));
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
            <View key={id} style={styles.sender}>
              <Text style={styles.senderText}>{data.message}</Text>
            </View>
          ) : (
            <View key={id} style={styles.reciever}>
              <Text style={styles.recieverText}>{data.message}</Text>
            </View>
          )
        )}
        {/* <Image
          style={{ width: 200, height: 250 }}
          source={require("../assets/group.jpg")}
        /> */}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
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
              <MaterialIcons name="emoji-emotions" size={25} color="white" />
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
  senderText: {
    color: "black",
    fontWeight: "500",
    alignItems: "center",
  },
  recieverText: {
    color: "white",
    fontWeight: "400",
  },
});
