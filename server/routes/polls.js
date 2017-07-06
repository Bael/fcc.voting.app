var express = require('express');
var router = express.Router();
const passport = require('passport');
const Poll = require('../models/polls');

const pollsController = require('../controllers/pollsController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', authController.isAuthenticated, pollsController.getList);

/* GET new poll page. */
router.get('/new', authController.isAuthenticated, pollsController.getNewInstance);

/* create new poll . */
router.post('/new', authController.isAuthenticated, pollsController.createNewPoll);

/* get poll by id. */
router.get('/:id', authController.isAuthenticated, pollsController.getById);

/* delete poll by id. */
router.delete('/:id', authController.isAuthenticated, pollsController.deleteById);

/* update poll. */
router.put('/:id', authController.isAuthenticated, pollsController.updatePoll);

module.exports = router;
