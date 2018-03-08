'use strict'

const MongoController = require('../server/controllers/MongoController.js')

// Revamped MongoController Test

// MongoController.setup() // passes
// MongoController.createUserCollection() // passes
// MongoController.insertUser('John', 'pass') // passes
// console.log(MongoController.getID('chris')) // Cannot return the Id
// MongoController.deleteUserByUsername('Chris') // passes

let list = MongoController.getAllUsers() // Cannot return the list
console.log(list)

// MongoController.addCorrectQuestionToUser('Chris', 4) // can do simplified