import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";
import { Text } from "react-native";

const PersonalChats = ({ id, name, enterPersonalChat, image }) => {
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("personalChats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => setUserChats(snap.docs.map((doc) => doc.data())));
  }, []);

  if (firebase.auth().currentUser.uid === id) {
    return null;
  } else {
    return (
      <ListItem
        onPress={() => enterPersonalChat(id, name, image)}
        key={id}
        style={{ backgroundColor: "transparent" }}
      >
        <Avatar
          rounded
          source={{
            uri:
              image ||
              "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "800", color: "black" }}>
            {name}
          </ListItem.Title>
          {userChats?.[0]?.message == null ? (
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
              {userChats?.[0]?.message}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
      </ListItem>
    );
  }
};
export default PersonalChats;
