'use strict'

const bcrypt = require('bcrypt-nodejs');

// generating a hash
module.exports.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
module.exports.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports.compareHash = function(password, hash) {
    return bcrypt.compareSync(password, hash)
}