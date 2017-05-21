let pgp = require('pg-promise')();
let connString = process.env.DATABASE_URL;
let db = pgp(connString);

function readAllPosts(req, res, next) {
	db.any('SELECT * FROM tweed WHERE tweed_id > 1 ORDER BY tweed_id DESC')
		.then(function(data) {
			res.status(200)
			.json({
				status: 'success',
				data: data
			});
		})
		.catch(function(err) {
			return next(err);
		});
}

function getPostReplies(req, res, next) {
	let targetID = parseInt(req.params.id) + 1;

	db.task(t => {
		return t.batch([
			t.one('SELECT * FROM tweed WHERE tweed_id = $1', targetID),
			t.any('SELECT * FROM tweed WHERE reply_id = $1 AND tweed_id > 1 ORDER BY tweed_timestamp DESC', targetID)
			]);
	})
	.then(data => {
			res.status(200)
			.json({
				status: 'success',
				OP: data[0],
				replies: data[1]
			});
		})
		.catch(function(err) {
			return next(err);
		});
}

function submitPost(req, res, next) {
	db.none('INSERT INTO tweed(username,tweed_content,tweed_timestamp,reply_id)' + 
		'values(${username}, ${tweed_content}, CURRENT_TIMESTAMP, 1)',
		req.body)
	.then(function() {
		res.status(200)
		.json({
          status: 'success',
          message: 'Tweed Submitted'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function submitReply(req, res, next) {
	console.log(req.body)
	let targetID = parseInt(req.params.id) + 1;

	db.none('INSERT INTO tweed(username,tweed_content,tweed_timestamp,reply_id)' + 
		'values(${username}, ${tweed_content}, CURRENT_TIMESTAMP,' + `${targetID})`,
		req.body)
	.then(function() {
		res.status(200)
		.json({
          status: 'success',
          message: 'Reply Submitted'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function deletePost(req, res, next) {
	let targetID = parseInt(req.params.id) + 1;

	db.result('DELETE FROM tweed WHERE tweed_id = $1', targetID)
	.then(function(result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed Tweed at ${result.rowCount}`
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

function editPost(req, res, next) {
	db.none('UPDATE tweed SET username = $1, tweed_content = $2 WHERE tweed_id = $3',
		[req.body.username, req.body.tweed_content, parseInt(req.body.tweed_id)])
	.then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'Tweed Updated'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
	readAllPosts: readAllPosts,
	getPostReplies: getPostReplies,
	submitPost: submitPost,
	submitReply: submitReply,
	deletePost: deletePost,
	editPost: editPost
};