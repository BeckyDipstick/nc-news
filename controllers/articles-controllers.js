const {
	selectArticleById,
	updateArticleById,
	insertComment,
	selectCommentsForArticle,
	selectAllArticles
} = require('../models/articles-models');

exports.getArticleById = (req, res, next) => {
	selectArticleById(req.params)
		.then(article => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	updateArticleById(req.params, req.body)
		.then(updatedArticle => {
			res.status(200).send({ article: updatedArticle });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	const comment = req.body;
	insertComment(req.params, comment)
		.then(postedComment => {
			res.status(201).send({ comment: postedComment });
		})
		.catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsForArticle(article_id, req.query)
		.then(comments => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles(req.query)
		.then(articlesByAuthor => {
			res.status(200).send({ articles: articlesByAuthor });
		})
		.catch(next);
};
