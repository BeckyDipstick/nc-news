exports.send405Error = (req, res, next) => {
	res.status(405).send({ msg: 'method not allowed' });
};
