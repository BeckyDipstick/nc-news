const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');

const {
	handleCustomErrors,
	handlePSQLErrors,
	handleServerErrors
} = require('./error-handlers/error-handlers.js');

app.use(express.json());

app.use('/api', apiRouter);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);

module.exports = app;
