exports.send418Error = (req, res, next) => {
	res
		.status(405)
		.send({
			msg:
				'Coffee cannot under any circumstances be brewed here!! I am a teapot!'
		});
};
