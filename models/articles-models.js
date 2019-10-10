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
		.then(article => {
			if (!article.length) {
				return Promise.reject({
					status: 404,
					msg: `article ${article_id} not found`
				});
			}
			return article[0];
		});
};

exports.insertComment = ({ article_id }, comment) => {
	const commentToPost = {
		author: comment.username,
		body: comment.body,
		article_id
	};
	return connection('comments')
		.insert(commentToPost)
		.into('comments')
		.returning('*')
		.then(comment => comment[0]);
};

exports.selectCommentsForArticle = ({ article_id }) => {
	return connection('comments')
		.select('*')
		.from('comments')
		.where('article_id', article_id);
};

exports.selectAllArticles = ({ sort_by, order, author }) => {
	return connection('articles')
		.select('*')
		.from('articles')
		.orderBy(sort_by || 'created_at', order || 'desc')
		.modify(query => {
			if (author) query.where('articles.author', author);
			// if (topic) query.where('articles.topic', topic);
		})
		.then(article => {
			if (author && !article.length) {
				return Promise.reject({
					status: 404,
					msg: `author ${author} not found`
				});
			}
			return article;
		});
};
