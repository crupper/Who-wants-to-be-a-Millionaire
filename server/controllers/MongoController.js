'use strict'

var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/millionaire'

module.exports.setup = function() {
	MongoClient.connect(url)
	.then((conn) => { 
		console.log('promises connection to DB')
		conn.close()
	})
	.catch(function (err) {})
}

module.exports.createUserCollection = function() {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		dbo.createCollection("users")
		conn.close()
		.then((db) => {
			console.log('Collection created in promise')
		})
		.catch((err) => {
			console.error(err)
		})
	})
	.catch((err) => {
		console.error(err)
	})
}

module.exports.insertUser = function(username, password) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		dbo.collection("users").insertOne( {"username": username, "password": password})
		conn.close()
	})
}

module.exports.getID = async function (username) {
	await MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		let query = { 'username': username }
		// Promise
		// dbo.collection("users").findOne(query).then((result) => {
		// 	console.log('In the .then')
		// 	console.log(result)
		// })
		// Callback
		dbo.collection("users").findOne(query, function(err, result) {
			console.log(result)
			console.log('Result is: ' + result._id)
			return result._id
		})

		conn.close()
	})
}

module.exports.getAllUsers = function() {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		dbo.collection("users").find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			conn.close();
			return result
		  });
	})
}

module.exports.deleteUserByUsername = function(username) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		dbo.collection("users").deleteOne( {"username": username} )
		conn.close()
	})
}

module.exports.deleteUserById = function(id) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		dbo.collection("users").deleteOne( {"_id": id} )
		conn.close()
	})
}

module.exports.addCorrectQuestionToUser = function(username, questionId) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		// need to first grab list of questions answered correctly
		// then update array and update document
		dbo.collection("users").updateOne({"username": username}, {$set: { "correctQuestions" : questionId }})
		conn.close()
	})
}

module.exports.updateTotalPrizeMoney = function(username, updatedMoney) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		// need to first grab old money

		// then update array and update document
		dbo.collection("users").updateOne({"username": username}, {$set: { "totalWinnings" : updatedMoney }})
		conn.close()
	})
}

module.exports.updateSinglePrizeAmount = function(username, winnings) {
	MongoClient.connect(url)
	.then((conn) => {
		let dbo = conn.db("millionaire");
		// need to first grab old money

		// Compare old money with winnings

		// then update document if winnings > old money
		dbo.collection("users").updateOne({"username": username}, {$set: { "singlePrizeWinnings" : winnings }})
		conn.close()
	})
}

// TODO:
// write getters for single prize amount, total prize amount