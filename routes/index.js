var express = require('express');
var router = express.Router();

var db = require('../db/queries');

/* GET home page. */
router.get('/', db.readAllPosts);
router.get('/reply/:id', db.getPostReplies);

router.post('/', db.submitPost);
router.post('/reply/:id', db.submitReply);

router.put('/:id', db.editPost);

router.delete('/:id', db.deletePost);

module.exports = router;