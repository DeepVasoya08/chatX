import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const LandingScreen = ({ navigation }) => {
  return (
    <LinearGradient
      style={styles.container}
      colors={["rgba(30, 16, 24, 0.83)", "rgba(4, 2, 4, 0.94)"]}
    >
      <StatusBar style="light" />
      <SafeAreaView>
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
    </LinearGradient>
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
    color: "red",
  },
});
