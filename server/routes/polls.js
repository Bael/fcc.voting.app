const express = require('express');
const pollsController = require('../controllers/pollsController');
const authController = require('../controllers/authController');

const router = express.Router();

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
router.post('/:id', authController.isAuthenticated, pollsController.updatePoll);

/* get poll for vote by id. */
router.get('/vote/:id', pollsController.getForVoteById);

router.post('/voteresult/:id', pollsController.getVoteResultById);

/* get poll for vote by id. */
router.post('/vote/:id', pollsController.vote);

module.exports = router;
