import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";
import { Alert, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RoomChats = ({ id, RoomName, enterChat, admin, adminID }) => {
  const [chatmsg, setChatmsg] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("roomChats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => setChatmsg(snap.docs.map((doc) => doc.data())));
  }, []);

  const deleteRoom = () => {
    Alert.alert("Hold on!", "Are you sure? Room will be permanently deleted.", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (adminID === firebase.auth().currentUser.uid) {
            firebase.firestore().collection("roomChats").doc(id).delete();
          } else {
            Alert.alert("We'r sorry!", "Only Room admin can delete room!");
          }
        },
      },
    ]);
  };

  return (
    <ListItem
      onLongPress={deleteRoom}
      onPress={() => enterChat({ id, RoomName, admin })}
      key={id}
      style={{ backgroundColor: "white" }}
    >
      <Avatar rounded source={require("../assets/group.jpg")} />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800", color: "black" }}>
          {RoomName}
        </ListItem.Title>
        {chatmsg?.[0]?.displayName == null &&
        chatmsg?.[0]?.message == null &&
        chatmsg?.[0]?.image == null ? (
          <ListItem.Subtitle
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "black" }}
          >
            <Text style={{ color: "#ababab" }}>Start Talk..</Text>
          </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "black" }}
          >
            {chatmsg?.[0]?.displayName} :
            {chatmsg?.[0]?.message || (
              <Text style={{ color: "#ababab" }}>
                <Ionicons name="image" size={18} color="grey" />
                image
              </Text>
            )}
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default RoomChats;
