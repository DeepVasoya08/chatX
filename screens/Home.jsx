import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import RoomChats from "./RoomChats";
import PersonalChats from "./PersonalChats";
import FloatingButton from "../custom/FloatingButton";
import PopUp from "../custom/PopUp";
import { ActivityIndicator } from "react-native";

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = firebase
      .firestore()
      .collection("roomChats")
      .onSnapshot((snap) =>
        setChats(
          snap.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("userDetails")
      .onSnapshot((snap) =>
        setUserChats(
          snap.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    setLoading(false);
    return unsub;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${firebase.auth().currentUser.displayName}`,
      headerStyle: { backgroundColor: "rgb(230, 230, 230)" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.push("EditProfile")}>
            <Avatar
              rounded
              source={{
                uri: firebase.auth().currentUser.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            width: 75,
            marginRight: 15,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <PopUp navigation={navigation} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, RoomName) => {
    navigation.push("Chats", {
      id: id,
      RoomName: RoomName,
    });
  };

  const enterPersonalChat = (id, name, image) => {
    navigation.push("EnterPersonalChats", {
      id: id,
      name: name,
      image: image,
    });
  };
  if (loading) {
    return (
      <ActivityIndicator
        color="blue"
        size={50}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      />
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <StatusBar style="dark" />
        <ScrollView style={styles.container}>
          {chats.map(({ id, data: { RoomName } }) => (
            <RoomChats
              key={id}
              id={id}
              RoomName={RoomName}
              enterChat={enterChat}
            />
          ))}
          {userChats.map(({ id, data: { name, image } }) => (
            <PersonalChats
              key={id}
              id={id}
              name={name}
              image={image}
              enterPersonalChat={enterPersonalChat}
            />
          ))}
        </ScrollView>
        {/* <FloatingButton onPress={() => navigation.navigate("AddRoom")} /> */}
      </SafeAreaView>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
