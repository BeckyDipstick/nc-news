const {
	patchCommentById,
	deleteCommentById
} = require('../controllers/comments-controllers');

commentsRouter = require('express').Router();

commentsRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deleteCommentById);

module.exports = { commentsRouter };
