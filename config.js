import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyBo9y-3Sc4ggQaK6sLC4OVxE90yu2lnBow",
    authDomain: "book-santa-9cc4b.firebaseapp.com",
    databaseURL: "https://book-santa-9cc4b.firebaseio.com",
    projectId: "book-santa-9cc4b",
    storageBucket: "book-santa-9cc4b.appspot.com",
    messagingSenderId: "86013580987",
    appId: "1:86013580987:web:a29b115695b0b6bb02bb9e"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();