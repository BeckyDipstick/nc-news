exports.up = function(knex) {
	return knex.schema.createTable('comments', commentsTable => {
		commentsTable.increments('comment_id');
		commentsTable.string('author').references('users.username');
		commentsTable.integer('votes').nullable();
		commentsTable.timestamp('created_at');
		commentsTable.text('body');
		commentsTable.integer('article_id').references('articles.article_id');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('comments');
};
