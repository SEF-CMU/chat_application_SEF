const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const userRouter = require('./routes/userRoutes');

// create users route and enable cross origin request
app.use('/api/v1/users', cors(), userRouter);

module.exports = app;
