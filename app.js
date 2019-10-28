const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const {
	handleCustomErrors,
	handlePSQLErrors,
	handleServerErrors
} = require('./error-handlers/error-handlers.js');

app.use(express.json());

app.use(cors());

app.use('/api', apiRouter);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerErrors);
app.all('/*', (req, res, next) =>
	res.status(418).send({
		msg:
			'Coffee absolutely cannot under any circumstances be brewed here! I am a teapot!'
	})
);

module.exports = app;
