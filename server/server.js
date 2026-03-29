require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pollRoutes = require('./src/routes/pollRoutes');
app.use('/api/polls', pollRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});