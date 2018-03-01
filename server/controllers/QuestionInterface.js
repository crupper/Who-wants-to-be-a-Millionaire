'use strict';
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../../resources/wwtbam_json_file.json')

module.exports = class QuestionInterface {
    constructor() {
        this.fileObj = require('../../resources/wwtbam_json_file.json')
	}
	
    loadQuestions() {
		let localData = new Array
		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) throw err;
			console.log('This is the data: ')
			// console.log(data)
			// console.log(JSON.parse(data))

			localData = JSON.parse(data);
			console.log(localData[0])
			return localData
		})
	}
	
    getAsyncQuestion(index) {
		let localData = new Array
		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) throw err;
			localData = JSON.parse(data);
			// console.log(localData[index])
			return localData[index]
		})
	}

	getSyncQuestion(index) {
		return this.fileObj[index]
	}
    
    getQuestionLength() {
		var count = Object.keys(this.fileObj).length;
		return count
	}

    getSyncAnswer(index) {
		let result = [this.fileObj[index].answer, this.getAnswerText(index)]
		return result
	}

	isAnswerCorrect(index, answer) {
		if(answer === this.getAnswerText(index)) {
			return true
		}
		else {
			return false
		}
	}

	getAnswerText(index) {
		let question = this.getSyncQuestion(index)
		if(question.answer === 'A') {
			return question.A
		} else if(question.answer === 'B') {
			return question.B
		} else if(question.answer === 'C') {
			return question.C
		} else if(question.answer === 'D') {
			return question.D
		} else {
			console.log('it broke')
			return 'bummer'
		}
	}

	hasRequiredProperties(questionObject) {
		let q = questionObject.question !== undefined
		let a = questionObject.A !== undefined
		let b = questionObject.B !== undefined
		let c = questionObject.C !== undefined
		let d = questionObject.D !== undefined
		let ans = questionObject.answer !== undefined

		return q && a && b && c && d && ans
	}

	addQuestion(questionObject) {
		let maxIndex = this.getQuestionLength()
		// return index of added question if successful
		if(this.hasRequiredProperties(questionObject)) {
			// let jsonStr = JSON.stringify(questionObject)
			this.fileObj[maxIndex] = questionObject
			let stringJSON = JSON.stringify(this.fileObj)
			fs.writeFile(filePath, stringJSON, function (err) {
				if (err) throw err;
				console.log('Question Added!');
			  });
		}
	}

	removeQuestion(index) {
		let qList = this.fileObj
		delete qList[index]

		let stringJSON = JSON.stringify(this.fileObj)

		// override file
		fs.writeFile(filePath, stringJSON, (err) => {  
			if (err) throw err;

			console.log('Removed Question!');
		});
	}
}