const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const {
	handleCustomErrors,
	handlePSQLErrors
} = require('./error-handlers/error-handlers.js');

app.use(express.json());

app.use('/api', apiRouter);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
