const firebase = require('firebase/compat/app')
require('firebase/compat/auth')
const admin = require('firebase-admin')
const key = require('./key.json')
const { v4 } = require('uuid');
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: "https://ultimate-tag-29669-default-rtdb.firebaseio.com"
})
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBXM0NEzmyzAgM02cXGnX3-skmo4GL70-8",
  authDomain: "trading--game.firebaseapp.com",
  projectId: "trading--game",
  storageBucket: "trading--game.appspot.com",
  messagingSenderId: "980050881982",
  appId: "1:980050881982:web:32247565ca0a9da18b9def",
  measurementId: "G-JR8HQZG0QV"
})

const firestore = admin.firestore()
const auth = firebase.auth()

const usersCollection = firestore.collection('users')
const itemsCollection = firestore.collection('items')
const recipesCollection = firestore.collection('recipes')

const app = require('express')()


app.get('/', (req, res) => {
  if(req.query.action == "CRAFT") {
    if(!req.query.uid) {
      console.log(req.query)
      res.send({
        status: 400,
        description: "Please provide a valid uid parameter"
      })
      return false
    }
    if(!req.query.recipe) {
      console.log(req.query)
      res.send({
        status: 400,
        description: "Please provide a valid recipe parameter"
      })
      return false
    }

    usersCollection.doc(req.query.uid).get().then(usersSnapshot => {
      if(usersSnapshot.data().key != req.query.key) {
        res.send({
          status: 401,
          description: "You are unauthorized to make this action"
        })
        return false
      }

      recipesCollection.doc(req.query.recipe).get().then(recipiesSnapshot => {
  
  
        var user = usersSnapshot.data();
        var craftingRecipe = recipiesSnapshot.data();

        let newInventory = user.inventory;
        for(let i = 0; i < newInventory.length; i++) {
          if(craftingRecipe.recipe[i] < 0) {
            if(Math.abs(craftingRecipe.recipe[i]) > newInventory[i]) {
              res.send({
                status: 500,
                description: "The user did not have enough of a certain material to complete the recipe"
              })
              return false
            }
          }
          newInventory[i] += craftingRecipe.recipe[i]
        }

        usersCollection.doc(req.query.uid).set({
          inventory: newInventory
        }, {merge: true})
        .then(response => {
          res.send({
            status: 200,
            description: "Request was recieved and processed"
          })
          return true
        })
        .catch(error => {
          res.send({
            status: 500,
            description: `There was an internal server error    :::    ${error}`
          })
          return false
        })
  
  
      })
    })

  } else if(req.query.action == 'CREATEUSER') {

    if(!req.query.email) {
      res.send({
        status: 400,
        description: "Please provide a valid email parameter"
      })
      return false
    } else if(!req.query.password) {
      res.send({
        status: 400,
        description: "Please provide a valid password parameter"
      })
      return false
    } else if(!req.query.username) {
      res.send({
        status: 400,
        description: "Please provide a valid username parameter"
      })
      return false
    }

    auth.createUserWithEmailAndPassword(req.query.email, req.query.password)
    .then(userRecord => {
      usersCollection.doc(String(userRecord.user.uid)).set({
        username: req.query.username,
        inventory: [0, 1, 1],
        wallet: 0,
        uid: userRecord.user.uid,
        key: v4()
      })
      .then(response => {
        res.send({
          status: 200,
          description: "Request was recieved and processed"
        })
      })
    })

  } else if(req.query.action == 'REFRESH') {
    itemsCollection.get().then(itemsSnapshot => {
      // const i = itemsSnapshot.docs.length - 1
      // usersCollection.get().then(usersSnapshot => {
      //   usersSnapshot.docs.forEach((user, j) => {
      //     if(!user?.inventory.length == itemsSnapshot.docs.length) {
      //       let newInventory = user.inventory
      //       newInventory[i] = 0
      //       usersCollection.doc(user.uid).set({
      //         inventory: newInventory
      //       }, {merge: true})
      //     }
      //   })
      // })
      // recipesCollection.get().then(recipesSnapshot => {
      //   recipesSnapshot.docs.forEach((recipe, j) => {
      //     if(!recipe?.recipe.length == itemsSnapshot.docs.length) {
      //       let newRecipe = recipe.recipe
      //       newRecipe[i] = 0
      //       recipesCollection.doc(recipe.id).set({
      //         recipe: newRecipe
      //       }, {merge: true})
      //     }
      //   })
      // })
    })
} else {
    res.send({
      status: 404,
      description: "Please provide a valid action"
    })
  }


})
app.listen(8000)

module.exports = app