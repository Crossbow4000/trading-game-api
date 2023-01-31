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
  recipesCollection.get().then(recipiesSnapshot => {
    const recipies = recipiesSnapshot.docs
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
  var resObject = {
    status: 200,
    description: "The request was recieved and succesfully proccessed"
  }
  res.send(JSON.stringify(resObject))
})

app.listen(8000)

module.exports = app