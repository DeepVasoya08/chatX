import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ marginBottom: 10 }}>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
          buttonStyle={styles.button}
          style={{ marginTop: 5 }}
        />
      </View>
      <View>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
          buttonStyle={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    borderRadius: 20,
  },
});
