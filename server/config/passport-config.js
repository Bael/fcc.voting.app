// load passport module
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = require('../models/users');

function generateStrategy(workerFunction) {
    return new LocalStrategy({
            // change default username and password, to email and password
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            // format to lower-case
            if (email)
                email = email.toLowerCase();

            // asynchronous
            process.nextTick(workerFunction, req, email, password, done);
        })
}

function generateLoginStrategy() {
    return generateStrategy(localLogin);
};


function localLogin(req, email, password, done) {
    User.findOne({
        'local.email': email
    }, function (err, user) {
        // if errors
        if (err)
            return done(err);
        // check errors and bring the messages
        if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.'));

        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));

        // everything ok, get user
        return done(null, user);
    });
}

function generateSignUpStrategy() {
    return generateStrategy(signUpUser);
}


function signUpUser(req, email, password, done) {
    // if the user is not already logged in:
    if (!req.user) {
        User.findOne({
            'local.email': email
        }, signUpOnFoundUserCallback);
    } else {
        return done(null, req.user);
    }
}


function signUpOnFoundUserCallback(err, user) {
    // if errors
    if (err)
        return done(err);
    // check email
    if (user) {
        return done(null, false, req.flash('signupMessage', 'Wohh! the email is already taken.'));
    } else {
        // create the user
        var newUser = new User();
        // Get user name from req.body
        newUser.local.name = req.body.name;
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        // save data
        newUser.save(function (err) {
            if (err)
                throw err;
            return done(null, newUser);
        });
    }
}

module.exports = function (passport) {
    // passport init setup

    // serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // Login using local strategy
    passport.use('local-login', generateLoginStrategy());

    // Signup local strategy
    passport.use('local-signup', generateSignUpStrategy());
};