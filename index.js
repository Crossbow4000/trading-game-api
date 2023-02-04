const admin = require('firebase-admin')
const key = require('./key.json')
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(key),
  databaseURL: "https://ultimate-tag-29669-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore()
const auth = admin.auth()

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

  } else {
    res.send({
      status: 404,
      description: "Please provide a valid action"
    })
  }


})
app.listen(8000)

module.exports = app