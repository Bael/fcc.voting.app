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

/*
router.get('/auth/twitter/callback',

    passport.authenticate('twitter', {
        successRedirect: '/polls',
        failureRedirect: '/login'
    }));
*/

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/polls');
    });

/*
router.get('/auth/twitter/callback',
    (req, res, next) => {
        console.log("get callback!!! starting auth");

        return passport.authenticate('twitter', {
                failureRedirect: '/login',
                session: false
            },
            (err, user, info) => {
                console.log("got auth " + err + " " + user + " " + info);
                if (err) {
                    console.error(err);
                    res.redirect('/login');
                } else {
                    res.redirect('/polls');
                    next();
                }
            })(req, res, next);
    });
*/
router.post('/login', authController.loginUser);



router.get('/logout', authController.logoutUser);

router.get('/signup', authController.getSignUpPage);

router.post('/signup', authController.signUpUser);

module.exports = router;