import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";
import { Text } from "react-native";
import { ActivityIndicator } from "react-native";

const PersonalChats = ({ id, name, enterPersonalChat, image }) => {
  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const senderID = firebase.auth().currentUser.uid;
  const receiverID = id;

  const sorted =
    senderID < receiverID ? senderID + receiverID : receiverID + senderID;

  useEffect(() => {
    setLoading(true);
    firebase
      .firestore()
      .collection("personalChats")
      .doc(sorted)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) =>
        // snap.forEach((docs) => {
        //   if (
        //     (docs.data().sender == senderID &&
        //       docs.data().reciever == receiverID) ||
        //     (docs.data().sender == receiverID &&
        //       docs.data().reciever == senderID)
        //   ) {
        //     return setUserChats(snap.docs.map((doc) => doc.data()));
        //   }
        // });
        setUserChats(snap.docs.map((doc) => doc.data()))
      );
    setLoading(false);
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
        {loading ? (
          <ActivityIndicator color="gray" size="small" />
        ) : (
          <Avatar
            rounded
            source={{
              uri:
                image ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
        )}
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "800", color: "black" }}>
            {loading ? "Loding..." : name}
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
              {loading ? "loading..." : userChats?.[0]?.message}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
      </ListItem>
    );
  }
};
export default PersonalChats;
