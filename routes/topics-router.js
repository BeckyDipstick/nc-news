const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controllers');
const { send405Error } = require('../error-handlers/handle405Errors');

topicsRouter
	.route('/')
	.get(getAllTopics)
	.all(send405Error);

module.exports = { topicsRouter };
