const admin = require('firebase-admin')
const key = require('./key.json')
admin.initializeApp({
  credential: admin.credential.cert(key)
});
const firestore = admin.firestore()
const itemsCollection = firestore.collection('items')

const app = require('express')()

module.exports = app