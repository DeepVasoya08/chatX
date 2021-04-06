import React, { useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Alert,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import { Button, Text } from "react-native-elements";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  let emailRef = useRef();
  let passwordRef = useRef();
  let confirmPasswordRef = useRef();

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
            .set({ email, name, password });
        })
        .catch((error) =>
          Alert.alert(String(error.code), String(error.message))
        );
    } else {
      Alert.alert("Bad Password", "Password does not match");
    }
    setLoading(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text
        h4
        style={{
          margin: -20,
          marginBottom: 50,
          fontFamily: "monospace",
          fontStyle: "italic",
          color: "black",
        }}
      >
        Let's Create Your Account
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.fields}
          placeholder="Full Name"
          autoFocus={true}
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailRef.current.focus() && emailRef.focus();
          }}
        />
        <TextInput
          ref={emailRef}
          style={styles.fields}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current.focus() && passwordRef.focus();
          }}
        />
        <TextInput
          style={styles.fields}
          ref={passwordRef}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          returnKeyType="next"
          onSubmitEditing={() => {
            confirmPasswordRef.current.focus() && confirmPasswordRef.focus();
          }}
        />
        <TextInput
          style={styles.fields}
          ref={confirmPasswordRef}
          secureTextEntry
          placeholder="Confirm Password"
          type="password"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          returnKeyType="done"
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          buttonStyle={styles.button}
          raised
          title="Register"
          onPress={register}
          loading={isLoading === true ? true : false}
          activeOpacity={0.4}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  button: {
    width: 200,
    borderRadius: 20,
  },
  inputContainer: {
    width: 350,
  },
  fields: {
    color: "black",
    backgroundColor: "#cccccc",
    borderRadius: 10,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "sans-serif-condensed",
    height: 50,
    padding: 8,
    margin: 5,
  },
});
