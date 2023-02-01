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
  const resObject = {
    status: 404,
    description: "This API endpoint does not exist"
  }
  res.send(JSON.stringify(resObject))
})

app.get('/CRAFT', (req, res) => {
  res.send(JSON.stringify(CraftItem(req.query.uid, req.query.recipe)))
})

app.listen(8000)

module.exports = app