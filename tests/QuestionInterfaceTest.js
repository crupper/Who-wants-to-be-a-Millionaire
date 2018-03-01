const QuestionInterfaceClass = require('../server/controllers/QuestionInterface.js')

let qInterface = new QuestionInterfaceClass()

// qInterface.loadQuestions()


// test getQuestion
let answerB = 'speed up'
let testResult = qInterface.getAsyncQuestion(0)
console.log('Sync Get Question')
let result = qInterface.getSyncQuestion(0)
console.log(result.B)
if(answerB === result.B) {
    console.log('Test Passed')
}
else {
    console.log('test failed')
    console.log(answerB + ' !== ' + result)
}


// test get number of Questions
console.log('\nGetQuestionLength')
console.log(qInterface.getQuestionLength())



// test getAnswer
console.log('TEST GET ANSWER')
let answer = 'potato'
let testAnswer = qInterface.getSyncAnswer(1)
if(testAnswer[1] === answer) {
    console.log('Test Passed')
}
else {
    console.log('test failed')
}



// Test Add

// Test Remove