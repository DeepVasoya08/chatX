import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  Alert,
} from "react-native";
import { Button, Input } from "react-native-elements";
import firebase from "firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => Alert.alert(String(err.code), String(err.message)));
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <Text
        style={{
          color: "#e3f2fd",
          fontWeight: "500",
          fontSize: 40,
          fontStyle: "italic",
          marginTop: -80,
        }}
      >
        Sign In
      </Text>
      <View style={styles.inputContainer}>
        <Input
          keyboardType="email-address"
          autoFocus={true}
          autoCapitalize="none"
          autoCompleteType="email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(pass) => setPassword(pass)}
          onSubmitEditing={signIn}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
          clearButtonMode="always"
        />
      </View>
      <Button
        raised
        buttonStyle={styles.button}
        containerStyle={{ marginTop: 10 }}
        title="Login"
        onPress={signIn}
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
    backgroundColor: "#313131",
  },
  button: {
    width: 200,
    borderRadius: 20,
  },
});
