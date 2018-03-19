'use strict'

const Router = require('express').Router;
const bodyParser = require('body-parser')
const QInterface = require('../controllers/QuestionInterface')
const GController = require('../controllers/GameController')
const qInterface = new QInterface()
var gController = new GController()

const router = new Router();
module.exports = router;

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
});

// =====================================
// Game PAGE ===========================
// =====================================
router.get('/game', isLoggedIn, function(req, res) {
    res.render('game.ejs');
})

router.get('/loadQuestion', isLoggedIn, async function(req, res) {
    // let q2 = qInterface.getSyncQuestion(2)
    // gController.currentQIndex = 2
    let response = await gController.loadQuestion()
    // console.log('response in route is: ' + response)
    res.status(200)
    res.send(response)
})

router.get('/getCurrentQuestion', isLoggedIn, async function(req, res) {
    let response = await gController.getCurrentQuestion()
    console.log('current q:')
    console.log(response)
    res.status(200).send(response)
})

router.get('/userAnswer/:guess', isLoggedIn, function(req, res) {
    let userAnswer = req.params.userAnswer
    let result = gController.checkAnswer(userAnswer)
    console.log('Result is: ' + result)
    console.log(req.params)
    res.status(200).send(result)
})

router.post('/updateUser', bodyParser.json(), function(req, res) {
    const body = req.body
    if(!body || !body.index || !body.status) {
        res.status(400).send('Invalid Body')
    } else {
        let result = gController.updateUserStanding(body.index, body.status)
        // console.log('in updateUser')
        // console.log(result)
        res.status(200).send(result)
    }
})

router.get('/getUserStanding', isLoggedIn, async function(req, res) {
    const standing = await gController.getUserStanding()
    res.status(200).send(standing)
})

router.get('/endGame', isLoggedIn, function(req, res) {
    let money = gController.endGame(false)
    res.status(200).send(money)
})

router.get('/walk', isLoggedIn, async function(req, res) {
    let money = gController.endGame(true)
    res.status(200).send(money)
})

router.get('/newGame', isLoggedIn, function(req, res) {
    gController = new GController()
    res.status(200).send('New Game Started!')
})



function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next()

    // if they aren't redirect them to the home page
    res.redirect('/user/login')
}