import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import firebase from "firebase";
import RoomChats from "./RoomChats";
import PersonalChats from "./PersonalChats";

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("chats")
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
    return unsub;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${firebase.auth().currentUser.displayName}`,
      headerStyle: { backgroundColor: "black" },
      headerTitleStyle: { color: "white" },
      headerTintColor: "white",
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
            justifyContent: "space-between",
            alignItems: "center",
            width: 75,
            marginRight: 15,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("AddRoom")}>
            <Ionicons
              name="add-circle-outline"
              size={29}
              color="white"
              onMagicTap="Create Group"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut}>
            <MaterialIcons name="logout" size={25} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const signOut = () => {
    firebase.auth().signOut();
  };

  const enterChat = (id, RoomName) => {
    navigation.navigate("Chats", {
      id: id,
      RoomName: RoomName,
    });
  };

  const enterPersonalChat = (id, name) => {
    navigation.navigate("EnterPersonalChats", {
      id: id,
      name: name,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["rgba(30, 16, 24, 0.83)", "rgba(4, 2, 4, 0.94)"]}
      >
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
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
