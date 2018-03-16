'use strict'

module.exports = class User {
    constructor(username, password) {
        this._id
        this.username = username
        this.password = password
        this.singlePrizeWinnings = 0
        this.totalPrizeWinnings = 0
        this.google = {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        }
        this.facebook = {
            id           : '',
            token        : '',
            email        : '',
            name         : ''
        }
        if(this.username === null) {
            this.username = ''
        }
        if(this.password === null) {
            this.password = ''
        }
    }

}

module.exports.initFB = function(user) {
    return user.facebook = {
        id           : '',
        token        : '',
        email        : '',
        name         : ''
    }
}

module.exports.initG = function(user) {
    return user.google = {
        id           : '',
        token        : '',
        email        : '',
        name         : ''
    }
}