articlesRouter = require('express').Router();
const {
	getArticleById,
	patchArticleById
} = require('../controllers/articles-controllers');

// articlesRouter.use('/:article_id', getArticleById);
articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById);

module.exports = { articlesRouter };
