const { connection } = require('../db/connection');

exports.selectArticleById = ({ article_id }) => {
	return connection
		.select('articles.*')
		.from('articles')
		.where('articles.article_id', article_id)
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.count('comments.article_id as comment_count')
		.then(article => {
			if (!article.length) {
				return Promise.reject({
					status: 404,
					msg: `article ${article_id} not found`
				});
			}
			return article;
		});
};

exports.updateArticleById = ({ article_id }, { inc_votes = 0 }) => {
	return connection('articles')
		.where('article_id', article_id)
		.increment('votes', inc_votes)
		.returning('*')
		.then(article => article[0]);
};
