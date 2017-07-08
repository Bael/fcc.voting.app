var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', indexController.getIndex);

/* AUTH work*/
router.get('/login', authController.getLoginPage);

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser)

router.get('/signup', authController.getSignUpPage);

router.post('/signup', authController.signUpUser);

module.exports = router;