const express = require('express');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

const router = express.Router();
/* GET home page. */
router.get('/', authController.isAuthenticated, profileController.getProfile);


module.exports = router;
