const { connection } = require('../db/connection');

exports.selectUserByUsername = ({ username }) => {
	return connection
		.select('*')
		.from('users')
		.where('username', '=', username)
		.then(user => {
			if (!user.length) {
				return Promise.reject({
					status: 404,
					msg: `username ${username} does not exist`
				});
			}
			return user[0];
		});
};
