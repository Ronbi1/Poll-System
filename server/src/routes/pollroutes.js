const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');


//create poll
router.post('/', pollController.createPoll);

//get poll
router.get('/:id', pollController.getPoll);

//submit
router.post('/:id/submit', (req, res) => {
    res.status(200).json({ message: `Submit vote ${req.params.id} endpoint ready` });
});

module.exports = router;