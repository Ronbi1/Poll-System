const express = require('express');
const router = express.Router();


// Create a new poll
router.post('/', (req, res) => {
    res.status(201).json({ message: 'Create poll endpoint ready' });
});

// Get poll by id
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get poll ${req.params.id} endpoint ready` });
});

//submit
router.post('/:id/submit', (req, res) => {
    res.status(200).json({ message: `Submit vote ${req.params.id} endpoint ready` });
});

module.exports = router;