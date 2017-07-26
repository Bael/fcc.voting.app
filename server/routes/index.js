const express = require('express');

const router = express.Router();

const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

const passport = require('passport');
/* GET home page. */
router.get('/', indexController.getIndex);

/* AUTH work*/
router.get('/login', authController.getLoginPage);

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

router.post('/login', authController.loginUser);



router.get('/logout', authController.logoutUser);

router.get('/signup', authController.getSignUpPage);

router.post('/signup', authController.signUpUser);

module.exports = router;