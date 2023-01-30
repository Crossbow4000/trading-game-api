const firebase = require('firebase/compat/app')
require('firebase/compat/auth')

const express = require('express')
const app = express()


const firebaseConfig = {
  apiKey: "AIzaSyBXM0NEzmyzAgM02cXGnX3-skmo4GL70-8",
  authDomain: "trading--game.firebaseapp.com",
  projectId: "trading--game",
  storageBucket: "trading--game.appspot.com",
  messagingSenderId: "980050881982",
  appId: "1:980050881982:web:32247565ca0a9da18b9def",
  measurementId: "G-JR8HQZG0QV"
};
firebase.initializeApp(firebaseConfig);

app.get('/', (req, res) => {
  firebase.auth().signInWithEmailAndPassword("root@trading-game.com", "c|G@-+tP@/KEa.a\qZ$/*UY]TiJf{@!i1vU(")
  .then(userCredential => res.send(userCredential))
})

app.listen(8000, () => {

})

module.exports = app