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
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const EditProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need media library permissions set profile!");
        }
      }
    })();
  }, []);

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
    setImage({ uri: pickerResult.uri });
    setLoading(true);
    try {
      const response = await fetch(pickerResult.uri);
      const blob = await response.blob();
      const imageName = pickerResult.uri.substring(
        pickerResult.uri.lastIndexOf("/") + 1
      );
      const task = firebase
        .storage()
        .ref("userProfile")
        .child(imageName)
        .put(blob);
      await task.then(async (res) => {
        await res.ref.getDownloadURL().then((res) => {
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
      Alert.alert("Profile Updated", "Profile Updated Sucessfully");
    } catch (error) {
      Alert.alert("Please Try Again", String(error.message));
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
      headerStyle: { backgroundColor: "rgb(230, 230, 230)" },
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTintColor: "black",
      headerTitle: "Profile",
    });
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <View style={styles.avatarStyle}>
        <Avatar
          rounded
          source={{
            uri: firebase.auth().currentUser.photoURL,
          }}
          size="large"
          onPress={getImage}
        >
          {loading && <ActivityIndicator size="large" color="black" />}
          <Avatar.Accessory
            size={28}
            style={{ marginLeft: -10 }}
            onPress={getImage}
          />
        </Avatar>
      </View>
      <View style={styles.inputStyles}>
        <Input
          style={{ color: "black" }}
          defaultValue={firebase.auth().currentUser.displayName}
          placeholder={firebase.auth().currentUser.displayName}
          // autoFocus={true}
          value={name}
          onChangeText={setName}
          leftIcon={
            <Icon
              name="user"
              type="font-awesome"
              size={28}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <Input
          style={{ color: "black" }}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          leftIcon={
            <Icon
              name="key"
              type="octicon"
              size={28}
              color="black"
              style={{ marginRight: 10 }}
            />
          }
          returnKeyType="next"
        />
        <Input
          style={{ color: "black" }}
          secureTextEntry={true}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmpassword}
          leftIcon={
            <Icon
              name="key"
              type="octicon"
              size={28}
              color="black"
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
    backgroundColor: "white",
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
