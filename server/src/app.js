const express = require('express');
const cors = require('cors');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/polls', pollRoutes);

//health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

module.exports = app;