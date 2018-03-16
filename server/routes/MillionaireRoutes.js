'use strict'

const Router = require('express').Router;

const router = new Router();
module.exports = router;

// =====================================
// HOME PAGE (with login links) ========
// =====================================
router.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
});