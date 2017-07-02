var express = require('express');
var router = express.Router();
const passport = require('passport');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , message:req.flash('message')});
});

/* AUTH work*/
router.get('/login', function(req, res, next) {
      res.render('login', {title: 'Login page',  message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                                    successFlash: { message: "welcome back" },
                                       failureRedirect: '/login',
                                       failureFlash: true }));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})


router.get('/signup', function(req, res, next) {
     res.render('signup', {title: 'Signup page',  message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', { successRedirect: '/',
                                   successFlash: { message: "welcome newcomer!" },
                                      failureRedirect: '/signup',
                                      failureFlash: true }));

module.exports = router;
