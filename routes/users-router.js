const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controllers');
const { send405Error } = require('../error-handlers/handle405Errors');

usersRouter
	.route('/:username')
	.get(getUserByUsername)
	.all(send405Error);

module.exports = { usersRouter };
