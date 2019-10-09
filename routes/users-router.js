const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controllers');

usersRouter.use('/:username', getUserByUsername);

module.exports = { usersRouter };
