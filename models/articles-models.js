const connection = require('../db/connection');

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
			return article[0];
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
			.then(comment => {
				return comment[0];
			});
	}
};

exports.selectCommentsForArticle = (article_id, { sort_by, order }) => {
	const validSortColumns = [
		'comment_id',
		'author',
		'votes',
		'created_at',
		'article_id'
	];
	if (!validSortColumns.includes(sort_by)) sort_by = 'created_at';
	return connection('comments')
		.select('*')
		.from('comments')
		.where('article_id', article_id)
		.orderBy(sort_by || 'created_at', order || 'desc')
		.then(comments => {
			return connection('articles')
				.select('*')
				.from('articles')
				.where('article_id', article_id)
				.returning('*')
				.then(res => {
					if (res.length) return comments;
					if (!comments.length) {
						return Promise.reject({
							status: 404,
							msg: `article ${article_id} does not exist`
						});
					}
					return comments;
				});
		});
};

exports.selectAllArticles = ({
	sort_by,
	order = 'desc',
	author = '',
	topic = ''
}) => {
	const validSortColumns = [
		'created_at',
		'title',
		'votes',
		'author',
		'article_id',
		'comment_count'
	];
	if (!validSortColumns.includes(sort_by)) sort_by = 'created_at';

	return connection('articles')
		.select('articles.*')
		.from('articles')
		.orderBy(sort_by || 'articles.created_at', order || 'desc')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.count('comments.article_id as comment_count')
		.modify(query => {
			if (author) query.where('articles.author', author);
			if (topic) query.where('articles.topic', topic);
		})
		.then(articles => {
			return connection('topics')
				.select('*')
				.from('topics')
				.where('topics.slug', topic)
				.returning('*')
				.then(topics => {
					if (topics.length) return articles;
					return connection('users')
						.select('*')
						.from('users')
						.where('users.username', author)
						.returning('*')
						.then(authors => {
							if (authors.length) return articles;
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
				});
		});
};
