'use strict'

let mongo = require('mongodb')
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

module.exports.insertUserObject = async function(user) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	// let query = { 'username': username }

	const dbQuery = await dbo.collection("users").insertOne(user)
	connection.close()
	return dbQuery._id
}

module.exports.getID = async function (username) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { 'username': username }
	// Promise
	const dbQuery = await dbo.collection("users").findOne(query)
	// console.log(dbQuery)
	connection.close()
	return dbQuery._id

	// return await dbo.collection("users").findOne(query).then(() => {
	// 	connection.close()
	// })
}

module.exports.getUser = async function(username) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { 'username': username }
	const dbQuery = await dbo.collection("users").findOne(query)
	connection.close()
	return dbQuery
}

module.exports.getUserFromFBID = async function(id) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { 'facebook.id': id }
	const dbQuery = await dbo.collection("users").findOne(query)
	connection.close()
	return dbQuery
}

module.exports.getUserFromGoogle = async function(id) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { 'google.id': id }
	const dbQuery = await dbo.collection("users").findOne(query)
	connection.close()
	return dbQuery
}

module.exports.getUserById = async function(id) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let o_id = new mongo.ObjectID(id)
	let query = { '_id': o_id }
	const dbQuery = await dbo.collection("users").findOne(query)
	connection.close()
	return dbQuery
}

module.exports.getAllUsers = async function() {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	const dbQuery = await dbo.collection("users").find({}).toArray()
	connection.close()
	return dbQuery
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

module.exports.addCorrectQuestionToUser = async function(_id, questionId) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let o_id = new mongo.ObjectID(_id)
	let query = { '_id': o_id }
	const dbQuery = await dbo.collection("users").findOne(query)
	let correctQuestions = dbQuery.correctQuestions
	let correctUpdatedQuestions = [].concat(correctQuestions)
	correctUpdatedQuestions.push(questionId)
	correctUpdatedQuestions = correctUpdatedQuestions.filter(function(n){ return n != undefined })
	console.log('write to DB')
	console.log(correctUpdatedQuestions)
	const updateUser = await dbo.collection("users").updateOne({query}, {$set: { "correctQuestions" : correctUpdatedQuestions }})
	connection.close()
}

// module.exports.simpleCorrectQuestionUpdate = async function(_id, questionId) 

module.exports.updateUsersCorrectQuestions = async function(username, correctQuestions) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { 'username': username }
	const dbQuery = await dbo.collection("users").findOne(query)
	const updateUser = await dbo.collection("users").updateOne({"username": username}, {$set: { "correctQuestions" : correctQuestions }})
	connection.close()
}

module.exports.updateCorrectQuestionArray = async function(_id, cArray) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { '_id': _id }
	const updateUser = await dbo.collection("users").updateOne(query, {$set: { "correctQuestions" : cArray }})
	connection.close()
}

module.exports.updateWrongQuestionArray = async function(_id, wArray) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	let query = { '_id': _id }
	const updateUser = await dbo.collection("users").updateOne(query, {$set: { "incorrectQuestions" : wArray }})
	connection.close()
}

module.exports.updatePrizeMoney = async function(_id, updatedMoney) {
	const connection = await MongoClient.connect(url)
	let dbo = await connection.db("millionaire");
	// need to first grab user and get old money
	let query = { '_id': _id }
	const dbQuery = await dbo.collection("users").findOne(query)
	let oldPrizeMoney = dbQuery.totalPrizeWinnings
	let singlePrize = dbQuery.singlePrizeWinnings
	if(typeof dbQuery.totalPrizeWinnings === "undefined") {
		oldPrizeMoney = 0
	}
	if(typeof dbQuery.singlePrizeWinnings === "undefined") {
		singlePrize = 0
	}
	// then update money and update document
	let totalPrizeMoney = oldPrizeMoney + updatedMoney
	await dbo.collection("users").updateOne(query, {$set: { "totalPrizeWinnings" : totalPrizeMoney }})
	// check if updatedMoney is greatest money yet
	if(updatedMoney > singlePrize) {
		await dbo.collection("users").updateOne(query, {$set: { "singlePrizeWinnings" : updatedMoney }})
	}
	
	connection.close()
}
