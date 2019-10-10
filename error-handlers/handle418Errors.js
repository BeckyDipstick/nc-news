exports.send418Error = (req, res, next) => {
	res.status(405).send({ msg: 'I cannot brew coffee here! I am a teapot!' });
};
