const admin = require('firebase-admin')
const key = require('./key.json')
admin.initializeApp({
  credential: admin.credential.cert(key)
});

const firestore = admin.firestore()

const usersCollection = firestore.collection('users')
const itemsCollection = firestore.collection('items')
const recipesCollection = firestore.collection('recipes')

const app = require('express')()

app.get('/', (req, res) => {


  if(req.query.action == "CRAFT") {
    
    

    usersCollection.doc(req.query.uid).get().then(usersSnapshot => {
      recipesCollection.doc(req.query.recipe).get().then(recipiesSnapshot => {
  
  
        var user = usersSnapshot.data();
        var craftingRecipe = recipiesSnapshot.data();
  
        let newInventory = user.inventory;
        for(let i = 0; i < newInventory.length; i++) {
          newInventory[i] += craftingRecipe.recipe[i]
        }

        usersCollection.doc(uid).set({
          inventory: newInventory
        }, {merge: true})
        .then(response => {
          console.log(uid, recipe)
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



  } else {
    res.send({
      status: 404,
      description: "Please provide a valid action"
    })
  }


})
app.listen(8000)

module.exports = app