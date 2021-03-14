import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";

const RoomChats = ({ id, RoomName, enterChat }) => {
  const [chatmsg, setChatmsg] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("chats")
      .doc(id)
      .collection("message")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => setChatmsg(snap.docs.map((doc) => doc.data())));
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, RoomName)}
      key={id}
      containerStyle={{ backgroundColor: "transparent" }}
    >
      <Avatar rounded source={require("../assets/group.jpg")} />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800", color: "white" }}>
          {RoomName}
        </ListItem.Title>
        {chatmsg?.[0]?.displayName && chatmsg?.[0]?.message == "" ? (
          <ListItem.Subtitle
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "white" }}
          ></ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "white" }}
          >
            {chatmsg?.[0]?.displayName} : {chatmsg?.[0]?.message}
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default RoomChats;