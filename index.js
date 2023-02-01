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

function CraftItem(uid, recipe) {
  usersCollection.get().then(snapshot => {console.log(snapshot)})
  usersCollection.get().then(usersSnapshot => {
    recipesCollection.get().then(recipiesSnapshot => {


      const user = usersSnapshot.docs[uid]
      const craftingRecipe = recipiesSnapshot.docs[recipe]

      if(!user) {
        return({
          status: 400,
          description: "Invalid uid parameter"
        })
      }
      if(!craftingRecipe) {
        return({
          status: 400,
          description: "Invalid recipe"
        })
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
        return({
          status: 200,
          description: "Request was recieved and processed"
        })
      })
      .catch(error => {
        return({
          status: 500,
          description: `There was an internal server error    :::    ${error}`
        })
      })


    })
  })
}

app.get('/', (req, res) => {



  if(req.query.action == "CRAFT") {
    res.send(JSON.stringify(usersCollection.get())
  } else {
    res.send({
      status: 404,
      description: "Please provide a valid action"
    })
  }


})
app.listen(8000)

module.exports = app