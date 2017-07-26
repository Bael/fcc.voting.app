// load passport module
let LocalStrategy = require('passport-local').Strategy;
// load up the user model
let User = require('../models/users');
const TwitterStrategy = require('passport-twitter').Strategy;
require('dotenv').config();

function generateStrategy(workerFunction) {
    return new LocalStrategy({
            // change default username and password, to email and password
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            // format to lower-case
            if (email) { email = email.toLowerCase(); }

            // asynchronous
            process.nextTick(workerFunction, req, email, password, done);
        });
}

function generateLoginStrategy() {
    return generateStrategy(localLogin);
}


function localLogin(req, email, password, done) {
    User.findOne({
        'local.email': email,
    }, (err, user) => {
        // if errors
        if (err) { return done(err); }
        // check errors and bring the messages
        if (!user) { return done(null, false, req.flash('loginMessage', 'No user found.')); }

        if (!user.validPassword(password)) { return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.')); }

        // everything ok, get user
        return done(null, user);
    });
}

function signUpUser(req, email, password, done) {
    // if the user is not already logged in:
    if (!req.user) {
        User.findOne({
            'local.email': email,
        }, (err, user) => {
            // if errors
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'Wohh! the email is already taken.'));
            }

            createUser(req.body.name, email, password, done);
        });
    } else {
        return done(null, req.user);
    }
}


function createUser(name, email, password, done) {
    // create the user
    const newUser = new User();
    // Get user name from req.body
    newUser.local.name = name;
    newUser.local.email = email;
    newUser.local.password = newUser.generateHash(password);
    // save data
    newUser.save((err) => {
        if (err) { throw err; }

        done(null, newUser);
    });
}


function generateSignUpStrategy() {
    return generateStrategy(signUpUser);
}



module.exports = function(passport) {
    // passport init setup

    // serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // Login using local strategy
    passport.use('local-login', generateLoginStrategy());

    // Signup local strategy
    passport.use('local-signup', generateSignUpStrategy());

    applyTwitterStrategy(passport);
};

function applyTwitterStrategy(passport) {
    passport.use('twitter', new TwitterStrategy({
            consumerKey: process.env.TWITTER_KEY,
            consumerSecret: process.env.TWITTER_SECRET,
            callbackURL: "http://127.0.0.1:7000/auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done) {

            User.findOne({
                'twitter.id': profile.id,
            }, (err, user) => {
                // if errors
                if (err) { return done(err); }
                if (user) {
                    return done(null, user);
                }

                createTwitterUser(profile.displayName, profile.id, done);
            });
        }
    ));
}


function createTwitterUser(name, id, done) {
    const newUser = new User();
    // Get user name from req.body
    newUser.twitter.name = name;
    newUser.twitter.id = id;

    // save data
    newUser.save((err) => {
        if (err) { throw err; }

        done(null, newUser);
    });
}