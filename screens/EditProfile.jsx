import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import { Avatar, Button, Icon, Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Text } from "react-native";

const EditProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [transfer, setTransfer] = useState(0);
  const [test, setTest] = useState(null);

  // useEffect(() => {
  //   const unsub = firebase
  //     .firestore()
  //     .collection("userDetails")
  //     .onSnapshot((snap) =>
  //       setTest(
  //         snap.docs.map((doc) => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         }))
  //       )
  //     );
  //   return unsub;
  // }, []);

  const getImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      Alert.alert(
        "Permission Required!",
        "Permission to access library  required!"
      );
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    setImage({ uri: pickerResult.uri });
    setLoading(true);
    setTransfer(0);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const imageName = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    const task = firebase
      .storage()
      .ref("userProfile")
      .child(imageName)
      .put(blob);
    task.on("state_changed", (snap) => {
      setTransfer(Math.round(snap.bytesTransferred / snap.totalBytes) * 100);
    });
    try {
      await task.then(async (res) => {
        await res.ref.getDownloadURL().then((res) => {
          setPhotoUrl(res);
          firebase.auth().currentUser.updateProfile({
            photoURL: res,
          });
          firebase
            .firestore()
            .collection("userDetails")
            .doc(firebase.auth().currentUser.uid)
            .set({ image: res }, { merge: true });
        });
      });
      setLoading(false);
      setImage(null);
      setTransfer(0);
      Alert.alert("Profile Updated", "Profile Updated Sucessfully");
    } catch (error) {
      Alert.alert(String(error.title), String(error.message));
    }
  };

  const setProfile = () => {
    // if (image !== null) {
    //   firebase.auth().currentUser.updateProfile({
    //     photoURL: photoUrl,
    //   });
    // }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#757575" },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerTintColor: "white",
      headerTitle: "Profile",
    });
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.avatarStyle}>
        <Avatar
          rounded
          source={{
            uri: firebase.auth().currentUser.photoURL,
          }}
          size="large"
          onPress={getImage}
        >
          {loading ? (
            <View
              style={{
                display: "flex",
                marginVertical: -18,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="white" />
              <Text
                style={{
                  color: "white",
                }}
              >{`uploading: ${transfer} do not go back`}</Text>
            </View>
          ) : null}
          <Avatar.Accessory
            size={28}
            style={{ marginLeft: -10 }}
            onPress={getImage}
          />
        </Avatar>
      </View>
      <View style={styles.inputStyles}>
        <Input
          style={{ color: "white" }}
          defaultValue={firebase.auth().currentUser.displayName}
          placeholder={firebase.auth().currentUser.displayName}
          // autoFocus={true}
          value={name}
          onChangeText={(text) => setName(text)}
          leftIcon={
            <Icon
              name="user"
              type="font-awesome"
              size={28}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <Input
          style={{ color: "white" }}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          leftIcon={
            <Icon
              name="key"
              type="octicon"
              size={28}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <Input
          style={{ color: "white" }}
          secureTextEntry={true}
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmpassword}
          leftIcon={
            <Icon
              name="key"
              type="octicon"
              size={28}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          onSubmitEditing={setProfile}
        />
        <View style={{ marginTop: 10 }}>
          <Button
            disabled={!name}
            title="Update"
            buttonStyle={styles.buttonStyle}
            onPress={setProfile}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
  },
  avatarStyle: {
    alignItems: "center",
    marginVertical: 5,
  },
  inputStyles: {
    display: "flex",
    margin: 5,
    justifyContent: "center",
    marginTop: 35,
  },
  buttonStyle: {
    width: 200,
    borderRadius: 20,
    alignSelf: "center",
  },
});
