'use-strict'

const LocalStrategy   = require('passport-local').Strategy;
const MongoController = require('../controllers/MongoController')
const AuthHelper      = require('./authHelper')
const User            = require('../model/User')

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // done(null, user.id);
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
        done(null, user);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        let requestedUser = MongoController.getUser(email)
        requestedUser.then((value) => {
            if(value !== null) {
                // user exists already
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                // add user to DB and proceed
                let hashedPassword = AuthHelper.generateHash(password)
                MongoController.insertUser(email, hashedPassword)
                let user = new User(email, hashedPassword)
                return done(null, user)
            }
        })
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { 
        
        let requestedUser = MongoController.getUser(email)
        requestedUser.then((value) => {
            if(value !== null) {
                // user exists
                if (AuthHelper.compareHash(password, value.password)) {
                    let loggedInUser = new User(email, password)
                    return done(null, loggedInUser);
                } else {
                    return done(null, false, req.flash('loginMessage', 'Wrong password'));
                }
                
            } else {
                return done(null, false, req.flash('loginMessage', 'Wrong username/password'));
            }
        })
    }));



};
