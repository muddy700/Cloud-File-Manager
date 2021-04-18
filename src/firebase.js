import firebase from 'firebase';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCU3X7nZt0_F4UR4T1GeCAQzUNiS-3X_Mo",
    authDomain: "user-management-63c30.firebaseapp.com",
    projectId: "user-management-63c30",
    storageBucket: "user-management-63c30.appspot.com",
    messagingSenderId: "653725362887",
    appId: "1:653725362887:web:aaecd7f7466e7812a56ce2",
    measurementId: "G-BYHE3J6ZBZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
// const db = firebaseApp.firestore();
// export default db;
export default firebaseApp
