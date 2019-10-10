const {
	updateCommentById,
	removeCommentById
} = require('../models/comments-models');

exports.patchCommentById = (req, res, next) => {
	updateCommentById(req.params, req.body)
		.then(updatedComment => {
			res.status(200).send({ comment: updatedComment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};
