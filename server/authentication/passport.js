'use-strict'

const LocalStrategy     = require('passport-local').Strategy
const FacebookStrategy  = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const MongoController   = require('../controllers/MongoController')
const AuthHelper        = require('./authHelper')
const User              = require('../model/User')
// const getUser         = require('../model/User').getUser

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log('in serialized')
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user_id, done) {
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
        // console.log('in deserialized')
        // User gets lost here
        let userRequest = MongoController.getUserById(user_id)
        userRequest.then((result) => {
            done(null, result)
        })
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
                    let loggedInUser = getUser(value)
                    return done(null, loggedInUser);
                } else {
                    return done(null, false, req.flash('loginMessage', 'Wrong username/password'));
                }
                
            } else {
                return done(null, false, req.flash('loginMessage', 'Wrong username/password'));
            }
        })
        requestedUser.catch((err) => {
            console.log('Error in Passport local-login')
            console.log(err)
        })
    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            let requestedUser = MongoController.getUserFromFBID(profile.id)
            requestedUser.then((dbResult) => {
                // if user is found, log in
                if (dbResult) {
                    return done(null, dbResult)
                } else {
                    let newUser = new User()
                    // set all of the facebook information in our user model
                    newUser.username       = profile.displayName
                    newUser.displayName    = profile.displayName
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    // newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    // newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first // Gives errors

                    // save them to DB
                    let save = MongoController.insertUserObject(newUser)
                    save.then((userID) => {
                        if (userID !== null) {
                            newUser.id = userID
                            return done(null, newUser);
                        } else {
                            console.log('not successful saving new FB user')
                        }
                    })
                    save.catch((err) => {
                        console.log('error in FB save')
                    })
                }
            })
            requestedUser.catch((err) => {
                console.log('Error in requestUser FB')
            })
        });

    }));



    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            let requestedUser = MongoController.getUserFromGoogle(profile.id)
            requestedUser.then((dbResult) => {
                if (dbResult) {
                    return done(null, dbResult)
                } else {
                    let newUser = new User()
                    // set all of the relevant information
                    newUser.facebook = {}
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save them to DB
                    let save = MongoController.insertUserObject(newUser)
                    save.then((userID) => {
                        if (userID !== null) {
                            newUser.id = userID
                            return done(null, newUser);
                        } else {
                            console.log('not successful saving new FB user')
                        }
                    })
                    save.catch((err) => {
                        console.log('Error in save in google passport')
                    })
                }
            })
            requestedUser.catch((err) =>{
                console.log('Error in google passport')
            })
        });

    }));



};

function getUser(dbQuery) {
    // console.log('in dbQuery')
    let newUser = new User()
    newUser.id = dbQuery._id
    newUser._id = dbQuery._id
    newUser.facebook = dbQuery.facebook
    newUser.google = dbQuery.google
    if(typeof dbQuery.username !== "undefined") {
        newUser.username = dbQuery.username
    }
    if(typeof dbQuery.password !== "undefined") {
        newUser.password = dbQuery.password
    }
    if(typeof dbQuery.singlePrizeWinnings !== "undefined") {
        newUser.singlePrizeWinnings = dbQuery.singlePrizeWinnings
    }
    if(typeof dbQuery.totalPrizeWinnings !== "undefined") {
        newUser.totalPrizeWinnings = dbQuery.totalPrizeWinnings
    }

    // These break stuff
    if(typeof dbQuery.facebook !== "undefined") {
        User.initFB(newUser)
    }
    if(typeof dbQuery.google !== "undefined") {
        User.initG(newUser)
    }
    // console.log('New User from dbQuery')
    // console.log(newUser)
    
    return newUser
}