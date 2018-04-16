'use-strict'

const QInterface = require('./QuestionInterface')
const MongoController = require('./MongoController')
const qInterface = new QInterface()
const moneyLevel = require('../../resources/MoneyLevels')

module.exports = class GameController {
    constructor() {
        this.currentQuestion = {}
        this.currentQIndex = 0
        this.user = {}
        this.qLevel = 0
        this.safeMoney = 0
        this.moneyLevel = 0
        this.passedQuestions = []
        this.missedQuestions = []
    }

    loadQuestion(userObj) {
        // load random question
        let maxQIndex = qInterface.getQuestionLength() -1
        let randomIndex = Math.floor(Math.random() * maxQIndex)
        // make sure user has not had it before
        if(typeof userObj.correctQuestions === "undefined") {
            userObj.correctQuestions = []
        } 
        while(userObj.correctQuestions.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * maxQIndex)
            console.log('player has seen this index. New index is: ' + randomIndex)
        }

        this.currentQIndex = randomIndex
        console.log('index is: ' + randomIndex)
        this.currentQuestion = qInterface.getSyncQuestion(randomIndex)
        return this.currentQuestion
    }

    getCurrentQuestion() {
        return this.currentQuestion
    }

    getUserStanding() {
        let moneyInfo = {
            money: getMoneyLevel(this.qLevel),
            level: this.qLevel
        }
        return moneyInfo
    }
    // checkAnswer(userAnswer) {
    //     // Not in use yet
    //     let correctAnswer = qInterface.getSyncAnswer(this.currentQIndex)
    //     console.log('Checking the answer for index: ' + this.currentQIndex)
    //     if(userAnswer === correctAnswer) {
    //         return true
    //     }
    //     return false
    // }
    incrementLevel() {
        this.qLevel++
        console.log('Advancing to level: ' + this.qLevel)
        // calculate next money levels
    }
    updateUserStanding(status, _id) {
        // take the question index and if it was right or wrong and update user info in DB
        console.log('Updating info on Q: ' + this.currentQIndex + ' since it was ' + status)
        if(status === "true") {
            this.passedQuestions.push(this.currentQIndex)
            let correctIndex = this.currentQIndex
            this.incrementLevel()
            MongoController.getUserById(_id).then((userObj) => {
                if(typeof userObj.correctQuestions === "undefined") {
                    userObj.correctQuestions = []
                }
                userObj.correctQuestions.push(correctIndex)
                MongoController.updateCorrectQuestionArray(_id, userObj.correctQuestions)
            })
        } else {
            console.log('Missed Q: ' + this.currentQIndex)
            this.missedQuestions.push(this.currentQIndex)
            MongoController.getUserById(_id).then((userObj) => {
                if(typeof userObj.incorrectQuestions === "undefined") {
                    userObj.incorrectQuestions = []
                }
                userObj.incorrectQuestions.push(this.currentQIndex)
                MongoController.updateWrongQuestionArray(_id, userObj.incorrectQuestions)
            })
        }
        let resultObj =  {'money': getMoneyLevel(this.qLevel), 'level': this.qLevel, 'method': 'post'}
        return resultObj 
    }

    endGame(hasWalked, _id) {
        // write final amounts to DB
        let gameOverMoney = 0
        if(!hasWalked) {
            // adjust final money and level
            this.qLevel = adjustMoneyLevel(this.qLevel)
            gameOverMoney = getMoneyLevel(this.qLevel)
        } else {
            gameOverMoney = getMoneyLevel(this.qLevel)
        }
        console.log(gameOverMoney)
        MongoController.updatePrizeMoney(_id, gameOverMoney).then(() => {
            console.log('DB updated endGame')
        })
        // get new questionId (done in millionaireRoutes)
        // reset qLevel and money
        this.qLevel = 0
        return {'money': gameOverMoney}
    }
}

adjustMoneyLevel = function(level) {
    let result = 0
    if(level < 5) {
        result = 0
    } else if (level < 10) {
        result = 5
    } else if (level >= 15) {
        result = 15
    } else {
        console.log('Should not be here... adjust money')
    }
    return result
}

getMoneyLevel = function(level) {
    let result = 0
    switch(level) {
        case 1:
            return moneyLevel.ONE
        case 2: 
            return moneyLevel.TWO
        case 3:
            return moneyLevel.THREE
        case 4: 
            return moneyLevel.FOUR
        case 5:
            return moneyLevel.FIVE
        case 6: 
            return moneyLevel.SIX
        case 7:
            return moneyLevel.SEVEN
        case 8: 
            return moneyLevel.EIGHT
        case 9:
            return moneyLevel.NINE
        case 10: 
            return moneyLevel.TEN
        case 11:
            return moneyLevel.ELEVEN
        case 12: 
            return moneyLevel.TWELVE
        case 13:
            return moneyLevel.THIRTEEN
        case 14: 
            return moneyLevel.FOURTEEN
        case 15:
            return moneyLevel.FIFTEEN
    }
    return result
}