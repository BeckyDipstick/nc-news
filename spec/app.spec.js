process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-sorted'));
const connection = require('../db/connection');

describe('/api', () => {
	beforeEach(() => connection.seed.run());
	after(() => connection.destroy());
	// describe('GET/api', () => {
	// 	it('returns a JSON object detailing all available end points and queries permitted on each route', () => {
	// 		return request(app)
	// 			.get('/api')
	// 			.expect(200)
	// 			.expect({ body })
	// 			.to.be.an('object');
	// 	});
	// });
	describe('DELETE/api', () => {
		it('sends a status code 405 and an error message when in invalid method is used', () => {
			return request(app)
				.delete('/api')
				.expect(405)
				.then(({ body }) => {
					expect(body.msg).to.equal('method not allowed');
				});
		});
	});
	describe('/*', () => {
		it('returns 418 status code and an error message when an invalid route is used', () => {
			return request(app)
				.get('/invalid')
				.expect(418)
				.then(({ body }) => {
					expect(body.msg).to.equal(
						'Coffee absolutely cannot under any circumstances be brewed here! I am a teapot!'
					);
				});
		});
		// it('returns a 404 status code and an error message when an invalid route is given', () => {
		// 	return request(app)
		// 		.get('/corgi')
		// 		.expect(404)
		// 		.then(({ body }) => {
		// 			expect(body.msg).to.equal('Route not found');
		// 		});
		// });
	});
	describe('/topics', () => {
		it('GET / 200: returns an array of topic objects', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics[0]).to.have.keys('slug', 'description');
				});
		});
		it('returns a status code 405 and an error message when given an invalid method', () => {
			return request(app)
				.delete('/api/topics')
				.expect(405)
				.then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
		});
	});
	describe('/users/', () => {
		it('GET /:username 200, returns an array containing a user object matching the username', () => {
			return request(app)
				.get('/api/users/butter_bridge')
				.expect(200)
				.then(({ body: { user } }) => {
					expect(user).to.have.keys('username', 'avatar_url', 'name');
				});
		});
		it('GET /:invalid_username, returns a 404: user not found error when passed an invalid username', () => {
			return request(app)
				.get('/api/users/invalid_user')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('username invalid_user does not exist');
				});
		});
		it('PATCH/:username returns a status code 405 and an errir message when a patch request is sent to a username', () => {
			return request(app)
				.patch('/api/users/icellusedkars')
				.send({ username: 'icellusedkars2019' })
				.expect(405)
				.then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
		});
	});
	describe('/articles', () => {
		it('GET/:articles/1: 200: returns an array containing an article object matching the aricle_id', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body }) => {
					expect(body.article).to.contain.keys(
						'author',
						'title',
						'article_id',
						'body',
						'topic',
						'created_at',
						'votes'
					);
				});
		});
		it('returns the articles with a comment count key', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body }) => {
					expect(body.article).to.contain.keys('comment_count');
					expect(body.article.comment_count).to.equal('13');
				});
		});
		it('GET/api/articles/2 responds with a status code 200 and the article object the votes key should have a value of 0', () => {
			return request(app)
				.get('/api/articles/2')
				.expect(200)
				.then(({ body }) => {
					expect(body.article.votes).to.equal(0);
				});
		});
		it('returns the array sorted by date as a default', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).to.be.sortedBy('created_at', { descending: true });
				});
		});
		it('accepts a query for the articles to be sorted in a specific order', () => {
			return request(app)
				.get('/api/articles?order=asc')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).to.be.sortedBy('created_at', { ascending: true });
				});
		});
		it('GET/api/articles returns all the articles with a comment count key', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles[0]).to.contain.keys('comment_count');
				});
		});
		it('should accept a query to sort a specific column', () => {
			return request(app)
				.get('/api/articles?sort_by=article_id')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).to.be.sortedBy('article_id', { descending: true });
				});
		});
		it('when given an invalid column to sort, returns a status code 200 and the articles sorted by their default column', () => {
			return request(app)
				.get('/api/articles?sort_by=corgi&order=desc')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).to.be.sortedBy('created_at', { descending: true });
				});
		});
		it('should accepts a query to sort a specific column in ascending order', () => {
			return request(app)
				.get('/api/articles?sort_by=article_id&order=asc')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).to.be.sortedBy('article_id', { ascending: true });
				});
		});

		it('accepts a query to return all the articles by username', () => {
			return request(app)
				.get('/api/articles?author=butter_bridge')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles[0].author).to.equal('butter_bridge');
					expect(articles[0]).to.contain.keys(
						'author',
						'title',
						'article_id',
						'body',
						'topic',
						'created_at',
						'votes'
					);
				});
		});
		it('returns a status code 200 and an empty array when given an author which is valid but has no articles', () => {
			return request(app)
				.get('/api/articles?author=lurker')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles.length).to.equal(0);
					expect(articles).to.be.an('array');
				});
		});
		it('returns a status code 200 and an empty array when given a topic which is valid but has no articles', () => {
			return request(app)
				.get('/api/articles?topic=paper')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles.length).to.equal(0);
					expect(articles).to.be.an('array');
				});
		});
		it('returns a 404 status code and an error message when given an author query which does not exist', () => {
			return request(app)
				.get('/api/articles/?author=corgi_brigade')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('author corgi_brigade not found');
				});
		});
		it('accpets a query to return all the articles by a topic', () => {
			return request(app)
				.get('/api/articles?topic=mitch')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles[0].topic).to.equal('mitch');
				});
		});
		it('returns a 404 status code and an error message when given a topic query which does not exist', () => {
			return request(app)
				.get('/api/articles/?topic=corgi_brigade')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('topic corgi_brigade not found');
				});
		});
		it('GET/articles/101: returns a 404 status code and an error message when given an article ID which does not exist', () => {
			return request(app)
				.get('/api/articles/101')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('article 101 not found');
				});
		});
		it('GET/articles/article_name: returns a 400 status code and an error message when given an invalid id type', () => {
			return request(app)
				.get('/api/articles/article_name')
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).to.equal('bad request - invalid input');
				});
		});
		it('PATCH/articles/:article_id/ 200 returns an  article object with the votes incremented', () => {
			return request(app)
				.patch('/api/articles/1')
				.send({ inc_votes: 1 })
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).to.equal(101);
					expect(article).to.contain.keys(
						'author',
						'title',
						'article_id',
						'body',
						'topic',
						'created_at',
						'votes'
					);
				});
		});
		it('returns an article object with the number of votes decremented', () => {
			return request(app)
				.patch('/api/articles/1')
				.send({ inc_votes: -1 })
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article.votes).to.equal(99);
					expect(article).to.contain.keys(
						'author',
						'title',
						'article_id',
						'body',
						'topic',
						'created_at',
						'votes'
					);
				});
		});
		it('PATCH/articles/101: returns a 404 status code and an error message when given an article ID which does not exist', () => {
			return request(app)
				.get('/api/articles/101')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('article 101 not found');
				});
		});
		it('POST/articles/:article_id/comments responds with a 201 status code and an object containig the posted comment', () => {
			return request(app)
				.post('/api/articles/1/comments')
				.send({
					username: 'lurker',
					body: 'corgis'
				})
				.expect(201)
				.then(({ body: { comment } }) => {
					expect(comment.body).to.equal('corgis');
					expect(comment).to.contain.keys(
						'comment_id',
						'author',
						'votes',
						'created_at',
						'body',
						'article_id'
					);
				});
		});
		it('POST/articles/:article_id/comments - returns a status code 400 and an error message when the request does not contain the required keys', () => {
			return request(app)
				.post('/api/articles/1/comments')
				.send({ username: 'lurker' })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).to.equal(
						'Cannot post. One or more field incomplete'
					);
				});
		});
		it('POST/articles/1000/comments returns a status code 422 and an error message when passed an id in the correct format which does not exist', () => {
			return request(app)
				.post('/api/articles/1000/comments')
				.send({ username: 'lurker', body: 'corgi' })
				.expect(422)
				.then(({ body }) => {
					expect(body.msg).to.equal('unable to process request');
				});
		});
		it('GET/articles/:article_id/comments: 200 - returns an array of comments for the given article,', () => {
			return request(app)
				.get('/api/articles/1/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments[0]).to.contain.keys(
						'comment_id',
						'votes',
						'created_at',
						'author',
						'body'
					);
				});
		});
		it('returns a status code 200 and an empty array when passed an article id which is valid but has no comments associated with it', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments.length).to.equal(0);
					expect(comments).to.be.an('array');
				});
		});
		it('sorts the comments by created_at in descending order as default', () => {
			return request(app)
				.get('/api/articles/1/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).to.be.sortedBy('created_at', { descending: true });
				});
		});
		it('accepts a query to sort the comments in a specified order', () => {
			return request(app)
				.get('/api/articles/1/comments?order=asc')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).to.be.sortedBy('created_at', { ascending: true });
				});
		});
		it('allows comments to be sorted by a specified column, in a specified order', () => {
			return request(app)
				.get('/api/articles/1/comments?sort_by=votes&order=asc')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).to.be.sortedBy('votes', { ascending: true });
				});
		});
		it('when an invalid sort column is provided it returns status code 200 and the comments sorted by the defaul column and order', () => {
			return request(app)
				.get('/api/articles/1/comments?sort_by=corgi&order=asc')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).to.be.sortedBy('created_at', { ascending: true });
				});
		});
		it('returns a status code 404 and an error message when passed an id which does not exist', () => {
			return request(app)
				.get('/api/articles/1000/comments')
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).to.equal('article 1000 does not exist');
				});
		});
		it('DELETE/articles/:article_id returns a status code 405 and an invalid method error message', () => {
			return request(app)
				.delete('/api/articles/1')
				.expect(405)
				.then(({ body: { msg } }) => {
					expect(msg).to.equal('method not allowed');
				});
		});
	});
	describe('/comments', () => {
		describe('comments/:comment_id', () => {
			it('PATCH comments/:comment_id: 200, returns an array of comment objects matching the comment_id', () => {
				return request(app)
					.patch('/api/comments/1')
					.send({ inc_votes: 1 })
					.expect(200)
					.then(({ body: { comment } }) => {
						expect(comment.votes).to.equal(17);
						expect(comment).to.contain.keys(
							'comment_id',
							'author',
							'votes',
							'created_at',
							'body',
							'article_id'
						);
					});
			});
			it('when sent a body with no inc_votes returns status code 200 and the unchanged comment', () => {
				return request(app)
					.patch('/api/comments/1')
					.expect(200)
					.then(({ body: { comment } }) => {
						expect(comment.votes).to.equal(16);
					});
			});
			it('returns a comment object with the number of votes decremented', () => {
				return request(app)
					.patch('/api/comments/1')
					.send({ inc_votes: -1 })
					.expect(200)
					.then(({ body: { comment } }) => {
						expect(comment.votes).to.equal(15);
						expect(comment).to.contain.keys(
							'comment_id',
							'author',
							'votes',
							'created_at',
							'body',
							'article_id'
						);
					});
			});
			it('PATCH/comments/non_existent_id: returns a 404 status code and an error message when given an article ID which does not exist', () => {
				return request(app)
					.patch('/api/comments/1001')
					.send({ inc_votes: 1 })
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).to.equal('comment 1001 not found');
					});
			});
			it('PATCH/comments/not_a_valid_input: returns a 400 status code and an error message when given an invalid id type', () => {
				return request(app)
					.patch('/api/comments/not_a_valid_input')
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).to.equal('bad request - invalid input');
					});
			});
			it('DELETE/comments/:comment_id returns a status code 204 when a comment has successfully been deleted', () => {
				return request(app)
					.delete('/api/comments/1')
					.expect(204);
			});
			it('DELETE/comments/1020 returns with a 404 status code and an error message when given an id which does not exist', () => {
				return request(app)
					.delete('/api/comments/1020')
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).to.equal('comment 1020 does not exist');
					});
			});
			it('DELETE/comments/invalid_input_type returns a 400 status code and an error mesaage when given an id of the wrong type', () => {
				return request(app)
					.delete('/api/comments/invalid_type')
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).to.equal('bad request - invalid input');
					});
			});
		});
	});
});
