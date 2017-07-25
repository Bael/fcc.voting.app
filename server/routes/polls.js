const express = require('express');
const pollsController = require('../controllers/pollsController');
const authController = require('../controllers/authController');

const router = express.Router();

/* GET polls list. */
router.get('/', authController.isAuthenticated, pollsController.getPage);

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

// get chart info
router.get('/voteresultchart/:id', pollsController.getVoteResultById);
// get chart page
router.get('/voteresult/:id', pollsController.getVoteResultPage);

/* vote by id. */
router.post('/vote/:id', pollsController.vote);

module.exports = router;
