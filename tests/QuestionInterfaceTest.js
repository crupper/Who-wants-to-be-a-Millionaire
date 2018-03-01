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
console.log('\nTest Add')
let exampleQ = {
    question: 'Pick A',
    A: 'This one!',
    B: 'Not Me',
    C: 'Not Me',
    D: 'Not Me',
    answer: 'A'
}
// console.log(exampleQ)
// console.log(qInterface.getQuestionLength())
// qInterface.addQuestion(exampleQ)
// console.log(qInterface.getQuestionLength())

// Test Remove
console.log('\n\nTest Remove')
// console.log(qInterface.getQuestionLength())
// qInterface.removeQuestion(547)
// console.log(qInterface.getQuestionLength())