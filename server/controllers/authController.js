const passport = require('passport');

function getUserName(req) {
  if (req.user) { return req.user.getName(); }
    return '';
}

module.exports.getUserName = getUserName;
// Check authorization
module.exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
      {return next();}
  res.redirect('/login');
};


module.exports.getLoginPage = function (req, res, next) {
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


module.exports.logoutUser = function (req, res) {
  req.logout();
  res.redirect('/');
};

module.exports.getSignUpPage = function (req, res, next) {
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
