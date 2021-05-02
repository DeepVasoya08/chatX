import React, { useEffect, useState } from "react";
import { ListItem, Avatar, Icon } from "react-native-elements";
import firebase from "firebase";
import { Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PersonalChats = ({
  id,
  name,
  enterPersonalChat,
  photoURL,
  status,
  navigation,
}) => {
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
      .onSnapshot((snap) => setUserChats(snap.docs.map((doc) => doc.data())));
    setLoading(false);
  }, []);

  if (firebase.auth().currentUser.uid === id) {
    return null;
  } else {
    return (
      <ListItem
        onPress={() => enterPersonalChat({ id, name, photoURL, status })}
        key={id}
      >
        {loading ? (
          <ActivityIndicator color="gray" size="small" />
        ) : (
          <Avatar
            rounded
            source={
              !photoURL
                ? require("../assets/avatar-placeholder.png")
                : { uri: photoURL }
            }
          />
        )}
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "800", color: "black" }}>
            <Text>{loading ? "Loding..." : name}</Text>
          </ListItem.Title>
          {userChats?.[0]?.message == null && userChats?.[0]?.image == null ? (
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
              {userChats?.[0]?.message || (
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
  }
};
export default PersonalChats;
