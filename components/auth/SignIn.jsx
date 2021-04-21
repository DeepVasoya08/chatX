import "react-native-gesture-handler";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  Alert,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import { Link } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { FontAwesome, Feather } from "@expo/vector-icons";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    secureTextEntry: true,
  });
  let passwordRef = useRef();

  const updataTogglePassword = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const signIn = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => Alert.alert(String(err.code), String(err.message)))
      .then(() => {
        setLoading(false);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome back!</Text>
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.text_footer}>Email</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            style={styles.text_input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            // autoFocus={true}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => {
              passwordRef.current.focus() && passwordRef.focus();
            }}
            returnKeyType="next"
          />
          {email ? (
            <Animatable.View animation="bounceIn" useNativeDriver={true}>
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 30 }]}>Password</Text>
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            ref={passwordRef}
            style={styles.text_input}
            placeholder="Password"
            secureTextEntry={data.secureTextEntry ? true : false}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={updataTogglePassword}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="#05375a" size={20} />
            ) : (
              <Feather name="eye" color="#05375a" size={20} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <Button
            disabled={!email || !password}
            buttonStyle={styles.button_style}
            containerStyle={{ marginTop: 10 }}
            title="Login"
            onPress={signIn}
            loading={isLoading === true ? true : false}
          />
          <Text style={{ marginTop: 30, fontSize: 16 }}>
            Don't have an Account?{" "}
            <Link
              to="/Register"
              style={{
                color: "blue",
                fontWeight: "800",
                textDecorationColor: "red",
              }}
            >
              Register here
            </Link>
          </Text>
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  button: {
    marginTop: 50,
    borderRadius: 20,
    alignItems: "center",
  },
  button_style: {
    width: 150,
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
    paddingBottom: 5,
  },
  text_input: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -5,
    paddingLeft: 10,
    color: "#05375a",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
