exports.formatDates = list => {
	return list.map(article => {
		const formattedDate = new Date(article.created_at);
		const newArticles = { ...article, created_at: formattedDate };
		return newArticles;
	});
};

exports.makeRefObj = list => {
	const refObj = {};
	list.forEach(article => {
		refObj[article.title] = article.article_id;
	});
	return refObj;
};

exports.formatComments = (comments, articleRef) => {
	if (!comments.length) return [];
	return comments.map(comment => {
		const formattedDate = new Date(comment.created_at);
		const formattedComments = { ...comment, created_at: formattedDate };
		formattedComments.author = formattedComments.created_by;
		formattedComments.article_id = articleRef[comment.belongs_to];
		delete formattedComments.belongs_to;
		delete formattedComments.created_by;
		return formattedComments;
	});
};
