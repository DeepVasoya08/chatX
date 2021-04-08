import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  Alert,
  TextInput,
} from "react-native";
import { Button, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import { Link } from "@react-navigation/native";

const LandingScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  let passwordRef = useRef();

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => Alert.alert(String(err.code), String(err.message)))
      .then(() => {
        setLoading(false);
      });
    setLoading(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : ""}
      >
        <Image
          fadeDuration={200}
          source={require("../../assets/logo.png")}
          style={{
            width: 250,
            height: 250,
            marginTop: -60,
          }}
        />
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
        <Text style={{ margin: 10 }}>
          Don't have Account?{" "}
          <Link
            to="/Register"
            style={{ color: "blue", fontWeight: "800" }}
            onPress={() => navigation.push("Register")}
          >
            Register here
          </Link>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  inputContainer: {
    width: 350,
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
