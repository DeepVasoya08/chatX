import firebase from "firebase";
import { USER_STATE_CHANGE, CLEAR_DATA } from "../constants/index";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("something went wrong in redux->action->index.js");
        }
      });
  };
}

export function clearData() {
  return((dispatch) => {
    dispatch({type: CLEAR_DATA})
  })
}
