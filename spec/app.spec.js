process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const { expect } = require('chai');
const { connection } = require('../db/connection');

describe('/api', () => {
	beforeEach(() => connection.seed.run());
	after(() => connection.destroy());
	describe('/topics', () => {
		it('GET / 200: returns an array of topic objects', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics[0]).to.have.keys('slug', 'description');
				});
		});
	});
	describe('/users/', () => {
		it('GET /:username 200, returns an array containing a user object matching the username', () => {
			return request(app)
				.get('/api/users/lurker')
				.expect(200)
				.then(({ body: { user } }) => {
					expect(user[0]).to.have.keys('username', 'avatar_url', 'name');
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
	});
	describe('/articles', () => {
		it('GET/:articles/1: 200: returns an array containing an article object matching the aricle_id', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article[0]).to.contain.keys(
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
				.then(({ body: { article } }) => {
					expect(article[0]).to.contain.keys('comment_count');
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
		it('POST/articles/:article_id/comments responds with a 201 status code and an object containig the posted comment', () => {
			return request(app)
				.post('/api/articles/1/comments')
				.send({});
		});
	});
});
