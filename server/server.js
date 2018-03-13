'use strict';

// Initialize tools ===========================================================
const express       = require('express')
const app           = express()
const port          = process.env.PORT || 3000
const path          = require('path')
const passport      = require('passport')
const flash         = require('connect-flash')

const morgan        = require('morgan')
const cookieParser  = require('cookie-parser')
const bodyParser    = require('body-parser')
const session       = require('express-session')
// var configDB = require('./config/database.js');

// configure ==================================================================
// require('./authentication/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// app.set('views', __dirname + '/../www/')
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, '/../www/'));

// required for passport
app.use(session({ secret: 'whowantstobeamillionaire' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =====================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Server listen on port
app.listen(port, err  => {
    if(err) console.error(err.stack)
    console.log('App listening on port ' + port)
  })
// Serve static directory
app.use(express.static('www'))