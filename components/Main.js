import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, clearData } from "../redux/actions/index";
import { SafeAreaView } from "react-native";

const Main = ({ navigation }) => {
  useEffect(() => {
    fetchUser();
    clearData();
    navigation.replace("Home");
  }, []);
  return <SafeAreaView></SafeAreaView>;
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUser, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
