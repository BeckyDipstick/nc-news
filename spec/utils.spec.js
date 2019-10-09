const { expect } = require('chai');
const {
	formatDates,
	makeRefObj,
	formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
	it('returns an empty array when passed an empty array', () => {
		const input = [];
		const actual = formatDates(input);
		const expected = [];
		expect(actual).to.deep.equal(expected);
		expect(actual).to.not.equal(input);
	});
	it('when passed an array containing one article object, returns an array with the timestamp re-formatted', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		const actual = formatDates(input);
		expect(actual[0].created_at).to.deep.equal(new Date(input[0].created_at));
	});
	it('returns an array with an article object containing all the keys and the timestamp in the appropriate format', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		const actual = formatDates(input);
		expect(actual[0]).to.have.keys(
			'title',
			'topic',
			'author',
			'body',
			'created_at',
			'votes'
		);
	});
	it('when passed an array containing multiple article objects, returns the articles with the timestamp in appropriate format', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			},
			{
				title: 'Sony Vaio; or, The Laptop',
				topic: 'mitch',
				author: 'icellusedkars',
				body:
					'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
				created_at: 1416140514171
			},
			{
				title: 'Eight pug gifs that remind me of mitch',
				topic: 'mitch',
				author: 'icellusedkars',
				body: 'some gifs',
				created_at: 1289996514171
			}
		];
		const actual = formatDates(input);
		expect(actual).to.not.equal(input);
		expect(actual[0].created_at).to.deep.equal(new Date(input[0].created_at));
		expect(actual[0]).to.have.keys(
			'title',
			'topic',
			'author',
			'body',
			'created_at',
			'votes'
		);
	});
	it('should not mutate the original data', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100
			}
		];
		const actual = formatDates(input);
		expect(actual[0].created_at).to.deep.equal(new Date(input[0].created_at));
		expect(input[0]).to.deep.equal({
			title: 'Living in the shadow of a great man',
			topic: 'mitch',
			author: 'butter_bridge',
			body: 'I find this existence challenging',
			created_at: 1542284514171,
			votes: 100
		});
	});
});

describe('makeRefObj', () => {
	it('returns an empty object when passed an empty array', () => {
		const input = [];
		const actual = makeRefObj(input);
		const expected = {};
		expect(actual).to.deep.equal(expected);
	});
	it('returns an object with article title as the key and article id as the value', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100,
				article_id: 1
			}
		];
		const actual = makeRefObj(input);
		const expected = { 'Living in the shadow of a great man': 1 };
		expect(actual).to.deep.equal(expected);
	});
	it('returns an object containing multiple key value pairs when passed an array containing multiple article objects', () => {
		const input = [
			{
				title: 'Living in the shadow of a great man',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100,
				article_id: 1
			},
			{
				title: 'Corgis!',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100,
				article_id: 2
			},
			{
				title: 'Unicorns',
				topic: 'mitch',
				author: 'butter_bridge',
				body: 'I find this existence challenging',
				created_at: 1542284514171,
				votes: 100,
				article_id: 3
			}
		];
		const actual = makeRefObj(input);
		const expected = {
			'Living in the shadow of a great man': 1,
			'Corgis!': 2,
			Unicorns: 3
		};
		expect(actual).to.deep.equal(expected);
	});
});

describe('formatComments', () => {
	it('returns an empty array when passed an empty array', () => {
		const input = [];
		const actual = formatComments(input);
		const expected = [];
		expect(actual).to.deep.equal(expected);
		expect(actual).to.not.equal(input);
	});
	it('returns an array containing an article object with the created_by key as author', () => {
		const input = [
			{
				belongs_to: 'High Altitude Cooking',
				created_by: 'tickle122'
			}
		];
		const reference = { 'High Altitude Cooking': 1 };
		const actual = formatComments(input, reference);
		const expected = [
			{
				article_id: 1,
				author: 'tickle122'
			}
		];
		expect(actual).to.deep.equal(expected);
	});
});
