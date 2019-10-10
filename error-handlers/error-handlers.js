exports.handleCustomErrors = (err, req, res, next) => {
	if (err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
	const PSQLErrorCodes = ['22P02'];
	if (PSQLErrorCodes.includes(err.code)) {
		res.status(400).send({ msg: 'bad request - invalid input' });
	} else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Server Error' });
};
