import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCfFTxi7gTEOZcxthmcQOAADR2VvaIK7a4",
    authDomain: "testapp-5dba3.firebaseapp.com",
    databaseURL: "https://testapp-5dba3.firebaseio.com",
    projectId: "testapp-5dba3",
    storageBucket: "",
    messagingSenderId: "258454746498",
    appId: "1:258454746498:web:643835814abfa09dcd8b9b",
    measurementId: "G-ZSFVZ5YSJ4"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;