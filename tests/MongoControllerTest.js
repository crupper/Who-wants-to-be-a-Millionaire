'use strict'

const MongoController = require('../server/controllers/MongoController.js')

// Revamped MongoController Test

// MongoController.setup() // passes
// MongoController.createUserCollection() // passes
// MongoController.insertUser('John', 'pass') // passes
// MongoController.getID('Chris').then(console.log) // passes
// console.log(MongoController.getID('Chris')._id)
// MongoController.deleteUserByUsername('Chris') // passes

// console.log('\nGet all users:')
// MongoController.getAllUsers().then(console.log) // passes

// console.log('\nGet One User')
// MongoController.getUser('Bob').then(console.log) // passes

// MongoController.addCorrectQuestionToUser('Chris', 2) // passes

// MongoController.updatePrizeMoney('Chris', 10) // passes
// MongoController.updatePrizeMoney('Bob', 12) // passes