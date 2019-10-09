const {
	selectArticleById,
	updateArticleById
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
