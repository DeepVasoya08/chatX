import React, { useState, useRef } from "react";
import {
  View,
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import { Button } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    secureTextEntry: true,
    ConfirmsecureTextEntry: true,
  });
  let emailRef = useRef();
  let passwordRef = useRef();
  let confirmPasswordRef = useRef();

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

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const register = async () => {
    setLoading(true);
    if (password === confirmpassword) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          authUser.user.updateProfile({
            displayName: name,
            photoURL:
              "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
          });
        })
        .then(() => {
          firebase
            .firestore()
            .collection("userDetails")
            .doc(firebase.auth().currentUser.uid)
            .set({
              name,
              email,
              password,
              status: "Just Joined!",
            });
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert("Something went wrong", String(e));
        });
    } else {
      setLoading(false);
      Alert.alert("Bad Password", "Password does not match");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Sign Up</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Full Name"
            style={styles.text_input}
            autoFocus={true}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => {
              emailRef.current.focus() && emailRef.focus();
            }}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Email"
            ref={emailRef}
            style={styles.text_input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current.focus() && passwordRef.focus();
            }}
          />
          {email.match(re) != null ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Password"
            style={styles.text_input}
            ref={passwordRef}
            secureTextEntry={data.secureTextEntry ? true : false}
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus() && confirmPasswordRef.focus();
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
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            style={styles.text_input}
            ref={confirmPasswordRef}
            secureTextEntry={data.ConfirmsecureTextEntry ? true : false}
            placeholder="Confirm Password"
            type="password"
            value={confirmpassword}
            onChangeText={setConfirmPassword}
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
        <View style={styles.button}>
          <Button
            disabled={!name || !email || !password || !confirmpassword}
            title="Register"
            buttonStyle={styles.button_style}
            containerStyle={{ marginTop: 10 }}
            raised
            onPress={register}
            loading={isLoading ? true : false}
          />
        </View>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  button_style: {
    width: 200,
    borderRadius: 20,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 20,
  },
  text_input: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a",
  },
});
