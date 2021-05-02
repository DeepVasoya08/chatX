import React, { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  TextInput,
  useWindowDimensions,
  Linking,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome,
  Feather,
  MaterialIcons,
  Zocial,
  Ionicons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Animatable from "react-native-animatable";

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBody, setLoadingBody] = useState(false);
  const [selected, setSelected] = useState("");
  let openKeyboard = useRef();
  const currentUserName = firebase.auth().currentUser.displayName;
  const windowWidth = Math.round(useWindowDimensions().width);
  const windowHeight = Math.round(useWindowDimensions().height);

  const openGithub = async () => {
    try {
      await Linking.openURL("https://github.com/DeepVasoya08");
    } catch (error) {
      Alert.alert("Something went wrong", String(error.message));
    }
  };

  const openLinkedin = async () => {
    try {
      await Linking.openURL(
        "https://www.linkedin.com/in/deep-vasoya-ba88131aa/"
      );
    } catch (error) {
      Alert.alert("Something went wrong", String(error.message));
    }
  };
  const openWhatsapp = async () => {
    if (Platform.OS === "web") {
      await Linking.openURL(
        "https://whatsapp08d.web.app/rooms/bF8aweIok60NVgfrQ5FR"
      );
    } else {
      alert("open in desktop for better experience");
    }
  };
  const openFacebook = async () => {
    if (Platform.OS === "web") {
      await Linking.openURL("https://facebookclone00.web.app/");
    } else {
      alert("open in desktop for better experience");
    }
  };

  const getImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
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
            .set({ photoURL: res }, { merge: true });
        });
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Please Try Again", String(error.message));
    }
  };

  const changeName = async () => {
    setLoadingBody(true);
    try {
      if (name != "") {
        await firebase
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
            setName("");
          });
      } else {
        Alert.alert(
          "Something went wrong",
          "can't connect to server, please check your connnection!"
        );
        setLoadingBody(false);
      }
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "can't connect to server, please check your connnection!"
      );
      setLoadingBody(false);
    }
  };

  const updateStatus = async () => {
    setLoadingBody(true);
    try {
      if (selected) {
        await firebase
          .firestore()
          .collection("userDetails")
          .doc(firebase.auth().currentUser.uid)
          .set({ status: selected }, { merge: true })
          .then(() => {
            setTimeout(() => {
              setLoadingBody(false);
            }, 1000);
          })
          .catch(() => {
            setLoadingBody(false);
            Alert.alert(
              "Something went wrong",
              "can't connect to server, please check your connnection!"
            );
          });
      } else {
        Alert.alert(
          "Something went wrong",
          "can't connect to server, please check your connnection!"
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Something went wrong", String(error.message));
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
      behavior={Platform.OS === "ios" ? "padding" : ""}
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
            color="blue"
          />
        ) : (
          <Avatar
            rounded
            source={{ uri: firebase.auth().currentUser.photoURL }}
            size={150}
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 50,
          paddingTop: 30,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => openKeyboard.current.focus() && openKeyboard.focus()}
        >
          <View style={{ marginRight: 15 }}>
            <FontAwesome name="user-circle-o" color="#05375a" size={20} />
          </View>
          <View>
            <Text style={{ fontWeight: "600", fontSize: 17 }}>Name</Text>
            <TextInput
              ref={openKeyboard}
              placeholder={currentUserName}
              value={name}
              onChangeText={setName}
            />
          </View>
        </TouchableOpacity>
        {!name ? (
          <View style={{ marginLeft: windowWidth / 2 }}>
            <FontAwesome name="pencil" size={20} color="black" />
          </View>
        ) : !loadingBody ? (
          <TouchableOpacity onPress={changeName}>
            <Animatable.View
              animation="flipInY"
              duration={200}
              style={{ marginLeft: windowWidth / 2 }}
            >
              <Ionicons
                name="checkmark-done-circle"
                size={30}
                color="#4cd806"
              />
            </Animatable.View>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            style={{ marginLeft: windowWidth / 2 }}
            size="small"
            color="blue"
          />
        )}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 50,
          paddingTop: 20,
        }}
      >
        <View style={{ marginRight: 10 }}>
          <Zocial name="statusnet" size={25} color="#05375a" />
        </View>
        <View>
          <Text style={{ fontWeight: "600", fontSize: 17 }}>
            Mood: {selected}
          </Text>
          <Picker
            style={{ minWidth: 110 }}
            mode="dialog"
            selectedValue={selected}
            onValueChange={(itemValue, itemIndex) => setSelected(itemValue)}
          >
            <Picker.Item label="Select" />
            <Picker.Item label="Sad" value="Sad😥" />
            <Picker.Item label="Happy" value="Happy🙂" />
            <Picker.Item label="Chilling" value="Chilling😉" />
            <Picker.Item label="Busy" value="Busy⌚" />
            <Picker.Item label="Sleepy" value="Sleepy😪" />
          </Picker>
        </View>
        {selected ? (
          <TouchableOpacity onPress={updateStatus}>
            <Animatable.View
              animation="lightSpeedIn"
              style={{ marginLeft: windowWidth / 4 }}
            >
              <Ionicons
                name="checkmark-done-circle"
                size={35}
                color="#4cd806"
              />
            </Animatable.View>
          </TouchableOpacity>
        ) : loadingBody ? (
          <ActivityIndicator
            style={{ marginLeft: windowWidth / 3 }}
            size="small"
            color="blue"
          />
        ) : null}
      </View>
      <TouchableOpacity onPress={() => navigation.push("ChangePass")}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 50,
            paddingTop: 20,
            paddingBottom: 10,
          }}
        >
          <View style={{ marginRight: 10 }}>
            <Feather name="settings" color="#05375a" size={24} />
          </View>
          <View>
            <Text style={{ fontWeight: "600", fontSize: 17 }}>Settings</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => firebase.auth().signOut()}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 50,
            paddingTop: 20,
          }}
        >
          <View style={{ marginRight: 10 }}>
            <MaterialIcons name="logout" size={24} color="#05375a" />
          </View>
          <View>
            <Text style={{ fontWeight: "600", fontSize: 17 }}>Logout</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: windowHeight / 10,
        }}
      >
        <View>
          <Text
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Visit Me:
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={openGithub}
            onLongPress={() =>
              ToastAndroid.showWithGravity(
                "Github",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            }
          >
            <AntDesign name="github" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={openLinkedin}
            onLongPress={() =>
              ToastAndroid.showWithGravity(
                "Linkedin",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            }
          >
            <AntDesign name="linkedin-square" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={openWhatsapp}
            onLongPress={() =>
              ToastAndroid.showWithGravity(
                "Whatsapp clone",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            }
          >
            <FontAwesome5 name="whatsapp-square" size={29} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={openFacebook}
            onLongPress={() =>
              ToastAndroid.showWithGravity(
                "Facebook clone",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              )
            }
          >
            <AntDesign name="facebook-square" size={28} color="black" />
          </TouchableOpacity>
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
    marginVertical: 3,
  },
  inputStyles: {
    display: "flex",
    flex: 1,
  },
});
