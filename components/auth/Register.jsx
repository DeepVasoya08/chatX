import React, { useRef, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import { Button, Input, Text } from "react-native-elements";

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          color: "white",
        }}
      >
        Let's Create Your Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus={true}
          value={name}
          onChangeText={setName}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            emailRef.focus();
          }}
        />
        <Input
          ref={(ref) => {
            emailRef = ref;
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.focus();
          }}
        />
        <Input
          ref={(ref) => {
            passwordRef = ref;
          }}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            confirmPasswordRef.focus();
          }}
        />
        <Input
          ref={(ref) => {
            confirmPasswordRef = ref;
          }}
          secureTextEntry
          placeholder="Confirm Password"
          type="password"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
          returnKeyType="done"
        />
      </View>
      <View>
        <Button
          buttonStyle={styles.button}
          raised
          title="Register"
          onPress={register}
          loading={isLoading === true ? true : false}
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
    backgroundColor: "#212121",
  },
  button: {
    width: 200,
    borderRadius: 20,
  },
  inputContainer: {
    width: 350,
  },
});
