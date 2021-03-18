import React, { useRef, useState } from "react";
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
          autoCapitalize="none"
          autoFocus={true}
          autoCompleteType="email"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{
            color: "white",
          }}
          onSubmitEditing={() => {
            passwordRef.focus();
          }}
          returnKeyType="next"
        />
        <Input
          ref={(ref) => {
            passwordRef = ref;
          }}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(pass) => setPassword(pass)}
          style={{
            color: "white",
            fontFamily: "Roboto",
          }}
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
    backgroundColor: "#313131",
  },
  button: {
    width: 200,
    borderRadius: 20,
  },
});
