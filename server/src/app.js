const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/notes.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/catatan', noteRoutes);

app.use(errorHandler);

module.exports = app;
