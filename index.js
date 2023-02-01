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
    
    

    usersCollection.get().then(usersSnapshot => {
      recipesCollection.get().then(recipiesSnapshot => {
  
  
        var user;
        var craftingRecipe;
        
        for(let i = 0; i < usersSnapshot.docs.length; i++) {
          console.log(usersSnapshot.docs[i].data().uid, req.query.uid)
          if(usersSnapshot.docs[i].data().uid == req.query.uid) {
            user = usersSnapshot.docs[i].data()
          }
        }
        for(let i = 0; i < recipiesSnapshot.docs.length; i++) {
          if(recipiesSnapshot.docs[i].data().id == req.query.recipe) {
            craftingRecipe = recipiesSnapshot.docs[i].data()
          }
        }
        
        if(!user) {
          console.log(usersSnapshot.docs)
          res.send({
            status: 400,
            description: "Invalid uid parameter"
          })
          return false
        }
        if(!craftingRecipe) {
          console.log(recipiesSnapshot.docs)
          res.send({
            status: 400,
            description: "Invalid recipe"
          })
          return false
        }
  
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