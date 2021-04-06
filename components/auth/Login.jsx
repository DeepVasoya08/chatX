import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  Alert,
  TextInput,
} from "react-native";
import { Button } from "react-native-elements";
import firebase from "firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  let passwordRef = useRef();

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => Alert.alert(String(err.code), String(err.message)));
    setLoading(true);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : ""}
    >
      <StatusBar style="light" />
      <Text
        style={{
          color: "black",
          fontWeight: "800",
          fontSize: 40,
          fontStyle: "italic",
          marginTop: -80,
        }}
      >
        Welcome back
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.fields}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          autoFocus={true}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => {
            passwordRef.current.focus() && passwordRef.focus();
          }}
          returnKeyType="next"
        />
        <TextInput
          ref={passwordRef}
          style={styles.fields}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
        />
      </View>
      <Button
        raised
        buttonStyle={styles.button}
        containerStyle={{ marginTop: 10 }}
        title="Login"
        onPress={signIn}
        loading={isLoading === true ? true : false}
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    width: 350,
    marginTop: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#d9d9d9",
  },
  button: {
    width: 200,
    borderRadius: 20,
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
