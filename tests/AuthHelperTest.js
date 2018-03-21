'use strict'

const AuthHelper = require('../server/authentication/authHelper')
const bcrypt = require('bcrypt-nodejs')

let password = 'a'
// let hash = AuthHelper.generateHash(password)
// let hash2 = AuthHelper.generateHash('a')

// console.log(AuthHelper.testCompareSync(hash, hash2))


var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);


let a = bcrypt.compareSync("B4c0/\/", hash); // true 
let b = bcrypt.compareSync("not_bacon", hash);
console.log(a)
console.log(b)
