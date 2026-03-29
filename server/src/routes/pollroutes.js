const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');


//get all poll
router.get('/', pollController.getAllPolls);

//create poll
router.post('/', pollController.createPoll);

//get poll
router.get('/:id', pollController.getPoll);

//submit
router.post('/:id/submit', pollController.submitVote);

module.exports = router;