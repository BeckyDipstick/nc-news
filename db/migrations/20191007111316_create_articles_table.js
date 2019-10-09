exports.up = function(knex) {
	return knex.schema.createTable('articles', articlesTable => {
		articlesTable.increments('article_id');
		articlesTable.string('title');
		articlesTable.text('body');
		articlesTable.integer('votes').nullable();
		articlesTable.string('author').references('users.username');
		articlesTable.timestamp('created_at');
		articlesTable.string('topic').references('topics.slug');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('articles');
};
