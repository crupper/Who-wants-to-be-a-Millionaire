'use strict'

const Router = require('express').Router;
const bodyParser = require('body-parser')
const QInterface = require('../controllers/QuestionInterface')
const qInterface = new QInterface()

const router = new Router();
module.exports = router;

// =====================================
// ADD/DELETE QUESTION PAGE ============
// =====================================
router.get('/', isLoggedIn, function(req, res) {
    res.render('questions.ejs'); 
});

router.get('/length', function(req, res) {
    let length = qInterface.getQuestionLength()
    let result = {'length':length}
    console.log('length is: ' + result)
    res.status(200).send(result)
})

router.post('/add', bodyParser.json(), function(req, res) {
    // console.log(req.body)
    const body = req.body
    if(!body || !body.question || !body.A || !body.B || !body.C || !body.D|| !body.answer) {
        res.status(400).send('Invalid Body')
    } else {
        let result = qInterface.addQuestion(body)
        res.status(200).send(result)
    }
})

router.post('/remove', bodyParser.json(), function(req, res) {
    // console.log(req.body)
    const body = req.body
    if(!body || !body.index) {
        res.status(400).send('Invalid Body')
    } else {
        let result = qInterface.removeQuestion(body.index)
        res.status(200).send(result)
    }
})


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next()

    // if they aren't redirect them to the home page
    res.redirect('/user/login')
}