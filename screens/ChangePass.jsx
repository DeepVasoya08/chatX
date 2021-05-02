import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import { Button } from "react-native-elements";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Feather } from "@expo/vector-icons";

const ChangePass = () => {
  const [Currpassword, setCurrPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    secureTextEntry: true,
    ConfirmsecureTextEntry: true,
    currPass: true,
  });
  let passwordRef = useRef();
  let ConfirmpasswordRef = useRef();

  const CurrentTogglePassword = () => {
    setData({
      ...data,
      currPass: !data.currPass,
    });
  };

  const updataTogglePassword = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const ConfirmupdataTogglePassword = () => {
    setData({
      ...data,
      ConfirmsecureTextEntry: !data.ConfirmsecureTextEntry,
    });
  };

  const user = firebase.auth().currentUser;
  const cred = firebase.auth.EmailAuthProvider.credential(
    user.email,
    Currpassword
  );

  const updatePassword = async () => {
    try {
      setLoading(true);
      if (password === confirmpassword) {
        await user
          .reauthenticateWithCredential(cred)
          .then((auth) => {
            auth.user.updatePassword(password).then(() => {
              firebase
                .firestore()
                .collection("userDetails")
                .doc(firebase.auth().currentUser.uid)
                .set({ password: password }, { merge: true });
              alert("Password successfully updated!");
              setLoading(false);
              setCurrPassword("");
              setPassword("");
              setConfirmPassword("");
            });
          })
          .catch((e) => {
            setLoading(false);
            Alert.alert("Something went wrong", String(e.message));
          });
      } else {
        setLoading(false);
        Alert.alert("Something went wrong", String(error.message));
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Something went wrong", String(error.message));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.action}>
          <Entypo name="lock" size={25} color="#05375a" />
          <TextInput
            style={styles.text_input}
            secureTextEntry={data.currPass ? true : false}
            placeholder="Password"
            onChangeText={setCurrPassword}
            value={Currpassword}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
          />
          <TouchableOpacity onPress={CurrentTogglePassword}>
            {data.currPass ? (
              <Feather name="eye-off" color="#05375a" size={20} />
            ) : (
              <Feather name="eye" color="#05375a" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Entypo name="lock" size={25} color="#05375a" />
          <TextInput
            ref={passwordRef}
            style={styles.text_input}
            secureTextEntry={data.secureTextEntry ? true : false}
            placeholder="New Password"
            onChangeText={setPassword}
            value={password}
            returnKeyType="next"
            onSubmitEditing={() => {
              ConfirmpasswordRef.current.focus();
            }}
          />
          <TouchableOpacity onPress={updataTogglePassword}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="#05375a" size={20} />
            ) : (
              <Feather name="eye" color="#05375a" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.action}>
          <Entypo name="lock" size={25} color="#05375a" />
          <TextInput
            ref={ConfirmpasswordRef}
            style={styles.text_input}
            secureTextEntry={data.ConfirmsecureTextEntry ? true : false}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmpassword}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={ConfirmupdataTogglePassword}>
            {data.ConfirmsecureTextEntry ? (
              <Feather name="eye-off" color="#05375a" size={20} />
            ) : (
              <Feather name="eye" color="#05375a" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 50 }}>
          <Button
            title="Update"
            buttonStyle={styles.buttonStyle}
            onPress={updatePassword}
            loading={loading ? true : false}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePass;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    margin: 20,
  },
  buttonStyle: {
    width: 200,
    borderRadius: 20,
    alignSelf: "center",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  text_input: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -5,
    paddingLeft: 10,
    color: "#05375a",
  },
});
