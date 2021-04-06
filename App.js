import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import thunk from "redux-thunk";
import firebase from "firebase";
import rootReducer from "./redux/reducers";
import LandingScreen from "./components/auth/LandingScreen";
import { SafeAreaView, ActivityIndicator } from "react-native";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./screens/Home";
import Chats from "./screens/Chats";
import AddRoom from "./screens/AddRoom";
import RoomChats from "./screens/RoomChats";
import Main from "./components/Main";
import PersonalChats from "./screens/PersonalChats";
import EnterPersonalChats from "./screens/EnterPersonalChats";
import EditProfile from "./screens/EditProfile";

const firebaseConfig = {
  apiKey: "AIzaSyAv1k76wYdIABL-pWgN9_pR1LyjpD0D8jM",
  authDomain: "chatx-08.firebaseapp.com",
  projectId: "chatx-08",
  storageBucket: "chatx-08.appspot.com",
  messagingSenderId: "283391709120",
  appId: "1:283391709120:web:bc482dd2c20abaad240225",
  measurementId: "G-851E2QNN45",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" style={{ color: "black" }} />
        </SafeAreaView>
      );
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="LandingScreen"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerStyle: { backgroundColor: "gray" },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerStyle: { backgroundColor: "gray" },
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={Main}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="RoomChats" component={RoomChats} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="PersonalChats" component={PersonalChats} />
            <Stack.Screen
              name="EnterPersonalChats"
              component={EnterPersonalChats}
            />
            <Stack.Screen name="AddRoom" component={AddRoom} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
