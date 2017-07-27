const passport = require('passport');
const User = require('../models/users');

function getUserName(req) {
    if (req.user) { return req.user.getName(); }
    return '';
}

module.exports.getUserName = getUserName;
// Check authorization
module.exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
};


module.exports.getLoginPage = function(req, res, next) {
    res.render('login', {
        title: 'Login page',
        message: req.flash('loginMessage'),
        currentUser: req.user,
    });
};


module.exports.loginUser = passport.authenticate('local-login', {
    successRedirect: '/',
    successFlash: {
        message: 'welcome back',
    },
    failureRedirect: '/login',
    failureFlash: true,
});


module.exports.logoutUser = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports.getSignUpPage = function(req, res, next) {
    res.render('signup', {
        title: 'Signup page',
        message: req.flash('signupMessage'),
        currentUser: req.user,
    });
};

module.exports.signUpUser = passport.authenticate('local-signup', {
    successRedirect: '/',
    successFlash: {
        message: 'welcome newcomer!',
    },
    failureRedirect: '/signup',
    failureFlash: true,
});

module.exports.getChangePasswordPage = function(req, res, next) {
    res.render('changepassword', {
        title: 'Change password page',
        message: req.flash('message'),
        currentUser: req.user,

    });
};

module.exports.changePassword = function(req, res, next) {

    if (!req.user.local) {
        return next(new Error('Only local users should change the password!'));

    };

    const newPassword = req.body.password;

    if (!newPassword) {
        return next(new Error('Password not setted!'));

    };


    const passwordHash = new User().generateHash(newPassword);



    User.findByIdAndUpdate(req.user._id, { $set: { 'local.password': passwordHash } }, (err, changeduser) => {
        if (err) {
            req.flash('message', 'Error while changing password ' + err);
            return next(err);
        }

        if (!changeduser) {
            req.flash('message', 'User not founded');

        } else {

            req.flash('message', 'Password was changed.');
        }
        res.redirect('/profile');

    })




};