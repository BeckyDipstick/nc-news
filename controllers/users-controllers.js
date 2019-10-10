const { selectUserByUsername } = require('../models/users-models');

exports.getUserByUsername = (req, res, next) => {
	selectUserByUsername(req.params)
		.then(user => {
			res.status(200).send({ user: { user } });
		})
		.catch(next);
};
