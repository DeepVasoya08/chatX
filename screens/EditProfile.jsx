import React, { useLayoutEffect, useRef, useState } from "react";
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

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBody, setLoadingBody] = useState(false);
  let passwordRef = useRef();
  let ConfirmpasswordRef = useRef();
  const currentUserName = firebase.auth().currentUser.displayName;

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
    } catch (error) {
      setLoading(false);
      Alert.alert("Please Try Again", String(error.message));
    }
  };

  const setProfile = async () => {
    setLoadingBody(true);
    try {
      if (name != "") {
        firebase
          .auth()
          .currentUser.updateProfile({
            displayName: name,
          })
          .then(() => {
            firebase
              .firestore()
              .collection("userDetails")
              .doc(firebase.auth().currentUser.uid)
              .set({ name: name }, { merge: true });
            setLoadingBody(false);
          })
          .catch(
            (e) => Alert.alert("Something went wrong", String(e.message)),
            setLoadingBody(false)
          );
      }
      if (!password == "" && password === confirmpassword) {
        await firebase
          .auth()
          .currentUser.updateProfile({
            displayName: name ? name : currentUserName,
          })
          .then(() => {
            firebase
              .firestore()
              .collection("userDetails")
              .doc(firebase.auth().currentUser.uid)
              .set(name ? name : currentUserName, { merge: true });
          });
        await firebase
          .auth()
          .currentUser.updatePassword(password)
          .then(() => {
            firebase
              .firestore()
              .collection("userDetails")
              .doc(firebase.auth().currentUser.uid)
              .set({ password: password }, { merge: true });
          });
      }
    } catch (error) {
      Alert.alert("Something went wrong", String(error));
      setLoadingBody(false);
    }
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
        {loading ? (
          <ActivityIndicator
            style={{
              display: "flex",
              flex: 1,
              marginTop: 50,
            }}
            size={45}
            color="gray"
          />
        ) : (
          <Avatar
            rounded
            source={{ uri: firebase.auth().currentUser.photoURL }}
            size="large"
            onPress={getImage}
          >
            <Avatar.Accessory
              size={28}
              style={{ marginLeft: -10 }}
              onPress={getImage}
            />
          </Avatar>
        )}
      </View>
      <View style={styles.inputStyles}>
        <Input
          style={{ color: "black" }}
          defaultValue={currentUserName}
          placeholder={currentUserName}
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
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
        />
        <Input
          ref={passwordRef}
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
          onSubmitEditing={() => {
            ConfirmpasswordRef.current.focus();
          }}
        />
        <Input
          ref={ConfirmpasswordRef}
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
          returnKeyType="done"
          onSubmitEditing={setProfile}
        />
        <View style={{ marginTop: 10 }}>
          <Button
            disabled={!name && !password}
            title="Update"
            buttonStyle={styles.buttonStyle}
            onPress={setProfile}
            loading={loadingBody ? true : false}
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
