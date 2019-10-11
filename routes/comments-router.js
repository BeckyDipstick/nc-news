const {
	patchCommentById,
	deleteCommentById
} = require('../controllers/comments-controllers');
const { send405Error } = require('../error-handlers/handle405Errors');

commentsRouter = require('express').Router();

commentsRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deleteCommentById)
	.all(send405Error);

module.exports = { commentsRouter };
