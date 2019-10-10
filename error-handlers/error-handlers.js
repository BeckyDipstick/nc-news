exports.handleCustomErrors = (err, req, res, next) => {
	if (err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
	console.log(err);
	const PSQLErrorCodes = ['22P02'];
	if (PSQLErrorCodes.includes(err.code)) {
		res.status(400).send({ msg: 'bad request - invalid input' });
	} else next(err);
};

exports.send405Error = (err, req, res, next) => {
	if (err) {
		res.status(405).send({ msg: 'method not allowed' });
	}
};

exports.handleServerErrors = (err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Server Error' });
};
