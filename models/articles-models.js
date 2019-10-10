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
	if (!commentToPost.author || !commentToPost.body) {
		return Promise.reject({
			status: 400,
			msg: 'Cannot post. One or more field incomplete'
		});
	} else {
		return connection('comments')
			.insert(commentToPost)
			.into('comments')
			.returning('*')
			.then(comments => {
				if (!comments.length) {
					return Promise.reject({
						status: 422,
						msg: `unable to process request, article ${article_id} does not exist`
					});
				}
				return comments[0];
			});
	}
};

exports.selectCommentsForArticle = (article_id, { sort_by, order }) => {
	return connection('comments')
		.select('*')
		.from('comments')
		.where('article_id', article_id)
		.orderBy(sort_by || 'created_at', order || 'desc')
		.then(comments => {
			if (!comments.length) {
				return Promise.reject({
					status: 404,
					msg: `article ${article_id} does not exist`
				});
			}
			return comments;
		});
};

exports.selectAllArticles = ({ sort_by, order, author, topic }) => {
	// seperate query to determine if author/topic exists
	// do this in comments by article as well
	// make a function checkExists model which checks if something is in the database or not
	// can either be done before or in then block
	return connection('articles')
		.select('*')
		.from('articles')
		.orderBy(sort_by || 'created_at', order || 'desc')
		.modify(query => {
			if (author) query.where('articles.author', author);
			if (topic) query.where('articles.topic', topic);
		})
		.then(articles => {
			if (author && !articles.length) {
				return Promise.reject({
					status: 404,
					msg: `author ${author} not found`
				});
			}
			if (topic && !articles.length) {
				return Promise.reject({
					status: 404,
					msg: `topic ${topic} not found`
				});
			}
			return articles;
		});
};

// exports.checkExists = query => {};
