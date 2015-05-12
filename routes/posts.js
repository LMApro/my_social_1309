var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var jwt = require("express-jwt");
var Pusher = require("pusher");
var pusher = new Pusher({
  appId: '119528',
  key: '864c814b8f54479e5d71',
  secret: 'dc371e33b3978e31b883'
});

var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router
	.get('/', function(req, res, next) {
	  res.render('index');
	})

	.get('/posts', function(req, res, next){

		Post.find({}).sort('-date').exec(function(err, posts){
			if (err) {
				return next(err); 
			}
			res.json(posts);
		});
	})

	.post('/posts', auth, function(req, res, next){
		var post = new Post(req.body);
		post.author = req.payload.username;
		pusher.trigger("posts", "addPost", post);
		post.save(function(err, post){
			if (err) {
				return next(err);
			}
			res.json(post);
		});
	})

	.param('post', function(req, res, next, id){
		var query = Post.findById(id);

		query.exec(function(err, post){
			if (err) return next(err);
			if (!post) {
				return next(new Error("Can't find post"));
			}
			req.post = post;
			return next();
		});
	})

	.param('comment', function(req, res, next, id){
		var query = Comment.findById(id);

		query.exec(function(err, comment){
			if (err) return next(err);
			if (!comment) {
				return next(new Error("Can't find comment"));
			}
			req.comment = comment;
			return next();
		});
	})

	.get('/posts/:post', function(req, res, next){
		req.post.populate('comments', function(err, post){
			if (err) return next(err);
			res.json(req.post);
		});
	})

	.get('/posts/user/:username', function(req, res, next){
		Post.find({ author: req.params.username }).sort('-date').exec(function(err, posts){
			if (err) return next(err);
			res.json(posts);
		});
	})

	.post('/posts/:post/comments', auth, function(req, res, next){
		var comment = new Comment(req.body);
		comment.post = req.post;
		comment.author = req.payload.username;
		pusher.trigger("comments", "addComment", comment);
		comment.save(function(err, comment){
			if (err) return next(err);
			req.post.comments.splice(0, 0, comment);
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(comment);
			});
		});
	})

	.put('/posts/:post/like', auth, function(req, res, next){
		
		if (req.post.usersLiked.indexOf(req.payload.username) === -1) {
			req.post.usersLiked.push(req.payload.username);
			pusher.trigger("posts", "likePost", { post: req.post, username: req.payload.username });
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.put('/posts/:post/unlike', auth, function(req, res, next){
		var index = req.post.usersLiked.indexOf(req.payload.username);
		req.post.usersLiked.splice(index, 1);
		pusher.trigger("posts", "unlikePost", { post: req.post, username: req.payload.username });
		req.post.save(function(err, post){
			if (err) return next(err);
			res.json(req.payload.username);
		});
	})

	.put('/posts/:post/dislike', auth, function(req, res, next){
		if (req.post.usersDisliked.indexOf(req.payload.username) === -1) {
			req.post.usersDisliked.push(req.payload.username);
			pusher.trigger("posts", "dislikePost", { post: req.post, username: req.payload.username });
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.put('/posts/:post/undislike', auth, function(req, res, next){
		var index = req.post.usersDisliked.indexOf(req.payload.username);
		req.post.usersDisliked.splice(index, 1);
		pusher.trigger("posts", "undislikePost", { post: req.post, username: req.payload.username });
		req.post.save(function(err, post){
			if (err) return next(err);
			res.json(req.payload.username);
		});
	})

	.put('/posts/:post/save', auth, function(req, res, next){
		Post.findOne({_id: req.body._id}, function(err, post){
			post.title = req.body.title;
			post.link = req.body.link;
			post.date = req.body.date;

			post.save(function(err, saved){
				if (err) return next(err);
				pusher.trigger("posts", "savePost", saved);
				res.json(saved);
			});
		});
	})

	.put('/posts/:post/comments/:comment/like', auth, function(req, res, next){
		if (req.comment.usersLiked.indexOf(req.payload.username) === -1) {
			req.comment.usersLiked.push(req.payload.username);

			req.comment.save(function(err, comment){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.put('/posts/:post/comments/:comment/unlike', auth, function(req, res, next){
		var index = req.comment.usersLiked.indexOf(req.payload.username);
		req.comment.usersLiked.splice(index, 1);
		req.comment.save(function(err, comment){
			if (err) return next(err);
			res.json(req.payload.username);
		});
	})

	.put('/posts/:post/comments/:comment/dislike', auth, function(req, res, next){
		if (req.comment.usersDisliked.indexOf(req.payload.username) === -1) {
			req.comment.usersDisliked.push(req.payload.username);
			req.comment.save(function(err, comment){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.put('/posts/:post/comments/:comment/undislike', auth, function(req, res, next){
		var index = req.comment.usersDisliked.indexOf(req.payload.username);
		req.comment.usersDisliked.splice(index, 1);
		req.comment.save(function(err, comment){
			if (err) return next(err);
			res.json(req.payload.username);
		});
	})

	.put('/posts/:post/comments/:comment/save', auth, function(req, res, next){
		Comment.findOne({_id: req.body._id}, function(err, comment){
			comment.body = req.body.body;
			comment.date = req.body.date;
			comment.save(function(err, saved){
				if (err) return next(err);
				pusher.trigger("comments", "saveComment", saved);
				res.json(saved);
			});
		});
	})

	.delete('/posts/:post', function(req, res, next){
		pusher.trigger("posts", "deletePost", {post: req.params.post});
		// remove post from database
		Post.remove({_id: req.params.post}, function(err){
			if (err) return next(err);
			res.json(req.post);
		});

		// remove comments of the post from database
		var comments = req.post.comments;
		comments.forEach(function(comment){
			Comment.remove({_id: comment}, function(err){
				if (err) return next(err);
			});
		});


	})

	.delete('/posts/:post/comments/:comment', function(req, res, next){
		pusher.trigger("comments", "deleteComment", {post: req.params.post, comment: req.params.comment});
		
		Comment.remove({_id: req.params.comment}, function(err){
			if (err) return next(err);
			res.json(req.comment);
		});

		Post.findById(req.params.post, function(err, post){
			if (err) return next(err);
			var commentIndex = post.comments.indexOf(req.params.comment);
			post.comments.splice(commentIndex, 1);
			post.save(function(err){
				if (err) return next(err);
			});
		});

		
	})

	;

module.exports = router;
