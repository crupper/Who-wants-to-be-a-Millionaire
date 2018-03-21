// load in question when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await $.get("/questions/length", function(result) {
        $('#question-length').text(result.length)
    })
}, false);


addQuestion = function() {
    let form = document.getElementById("add-question-form");
    let q = form.elements[0].value
    let a = form.elements[1].value
    let b = form.elements[2].value
    let c = form.elements[3].value
    let d = form.elements[4].value
    let answer = form.elements[5].value

    // validations
    if(!q || !a || !b || !c ||!d || !answer) {
        console.log('problems')
    } else {
        let obj = {
            'question' : q,
            'A' : a,
            'B' : b,
            'C' : c,
            'D' : d,
            'answer' : answer
        }
        $.post('/questions/add', obj, function(responseObj) {
            console.log(responseObj)
        })
    }
    
}

removeQuestion = function() {
    console.log('removeQuestion')
    let form = document.getElementById("remove-question-form");
    let index = form.elements[0].value
    if(!index) {
        console.log('Problems: ')
    } else {
        console.log('Index is: ' + index)
        let obj = {
            'index' : index
        }
        $.post('/questions/remove', obj, function(responseObj) {
            console.log(responseObj)
        })
    }
}