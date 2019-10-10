articlesRouter = require('express').Router();
const {
	getArticleById,
	patchArticleById,
	postCommentByArticleId,
	getCommentsForArticle,
	getAllArticles
} = require('../controllers/articles-controllers');
const { send405Error } = require('../error-handlers/handle405Errors');

articlesRouter.route('/').get(getAllArticles);

articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById)
	.all(send405Error);

articlesRouter
	.route('/:article_id/comments')
	.post(postCommentByArticleId)
	.get(getCommentsForArticle)
	.all(send405Error);

module.exports = { articlesRouter };
