let question = {}


// load in question when page loads
document.addEventListener('DOMContentLoaded', async function() {
    await $.get("/getCurrentQuestion", function(resultingQuestion) {
        console.log('Question on page load:')
        console.log(question)
        question = resultingQuestion
    })
    if(typeof question.question === 'undefined') {
        loadQuestion()
    } else {
        updateUserStanding()
        loadCurrentQuestion()
    }
}, false);

loadQuestion = function() {
    console.log('in loadQuestion')
    $.get("/loadQuestion", function(string) {
        console.log('Question:')
        console.log(string)
        question = string
        $('#qID').text(question.question)
        $('#A').text(question.A)
        $('#B').text(question.B)
        $('#C').text(question.C)
        $('#D').text(question.D)
    })
}

loadCurrentQuestion = function() {
    console.log(question)
    $('#qID').text(question.question)
    $('#A').text(question.A)
    $('#B').text(question.B)
    $('#C').text(question.C)
    $('#D').text(question.D)
}

updateUserStanding = function() {
    $.get("/getUserStanding", function(standing) {
        console.log('Question:')
        console.log(standing)
        document.querySelectorAll("#level li").forEach(el => {
          el.classList.remove("active");
        });
        console.log("standing.level = " + standing.level);
        try{
          document.querySelector("#level li:nth-child(" + (15 - standing.level) + ")").classList.add("active");
        }
        catch(err) {
          document.querySelector("#level li:nth-child(" + (15 - 0) + ")").classList.add("active");
        }
        $('#player-money').text("$" + standing.money)
    })
}

checkAnswer = function(answer) {
    let isCorrect =  false
    if(answer === question.answer) {
        console.log('Correct!')
        isCorrect = true
    } else {
        console.log('Incorrect!')
    }
    let dataObj = {
        status: isCorrect
    }

    $.post('/updateUser', dataObj, function(responseObj) {
        if(responseObj.level > 15) {
            endGame()
        } else {
            // update screen
            //$('#level').text(responseObj.level)
            document.querySelectorAll("#level li").forEach(el => {
            el.classList.remove("active");
            console.log("/updateUser firing, standing = " + responseObj.level);
            });
            try{
              document.querySelector("#level li:nth-child(" + (15 - responseObj.level) + ")").classList.add("active");
            }
            catch(err) {
              document.querySelector("#level li:nth-child(" + (15 - 0) + ")").classList.add("active");
            }
            $('#player-money').text(responseObj.money)
        }
    })

    if(isCorrect) {
        loadQuestion()
    } else {
        // endBackEnd()
        endGame()
    }
}

endGame = function() {
    $.get("/endGame", function(eMoney) {
        console.log(eMoney.money)
        if(typeof eMoney.money === "undefined") {
            $('h1').text('You ended with: $'+ 0 + '!')
        } else {
            $('h1').text('You ended with: $'+ eMoney.money + '!')
        }
    })
    // Hide unwanted elements
    $('#scoreboard').hide()
    $('#play-area').hide()
}

walk = function() {
    $.get("/walk", function(wMoney) {
        if(typeof wMoney.money === "undefined") {
            $('h1').text('You walked away with: $'+ 0 + '!')
        } else {
            $('h1').text('You walked away with: $'+ wMoney.money + '!')
        }
    })
    // Hide unwanted elements
    $('#scoreboard').hide()
    $('#play-area').hide()

}

newGame = function() {
    $('h1').text('Who Wants to Be a Millionaire?')
    // Show all the elements hid during end game
    $('#walk-button').show()
    $('#level').show()
    $('#player-money').show()
    $('#level-text').show()
    $('#money-text').show()
    $('#qID').show()
    $('#A').show()
    $('#B').show()
    $('#C').show()
    $('#D').show()
    // Reset Generic Info
    $('#player-money').text('0')
    $('#level').text('0')
    // Launch new game
    $.get("/newGame", function(response) {
        console.log(response)
        loadQuestion()
    })
}
