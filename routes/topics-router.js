const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controllers');

topicsRouter.use('/', getAllTopics);

module.exports = { topicsRouter };
