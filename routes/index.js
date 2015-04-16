var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require("mongoose");
var jwt = require("express-jwt");

var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router
	.get('/', function(req, res, next) {
	  res.render('index');
	})

	.get('/posts', function(req, res, next){
		Post.find(function(err, posts){
			if (err) {
				return next(err); 
			}
			res.json(posts);
		});
	})

	.post('/posts', auth, function(req, res, next){
		var post = new Post(req.body);
		post.author = req.payload.username;
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
		Post.find({ author: req.params.username }, function(err, posts){
			if (err) return next(err);
			res.json(posts);
		});
	})

	.post('/posts/:post/comments', auth, function(req, res, next){
		var comment = new Comment(req.body);
		comment.post = req.post;
		comment.author = req.payload.username;
		comment.save(function(err, comment){
			if (err) return next(err);
			req.post.comments.push(comment);
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(comment);
			});
		});
	})

	.put('/posts/:post/like', auth, function(req, res, next){
		if (req.post.usersLiked.indexOf(req.payload.username) === -1) {
			req.post.usersLiked.push(req.payload.username);
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.post('/posts/:post/unlike', auth, function(req, res, next){
		var index = req.post.usersLiked.indexOf(req.payload.username);
		req.post.usersLiked.splice(index, 1);
		req.post.save(function(err, post){
			if (err) return next(err);
			res.json(req.payload.username);
		});
	})

	.put('/posts/:post/dislike', auth, function(req, res, next){
		if (req.post.usersDisliked.indexOf(req.payload.username) === -1) {
			req.post.usersDisliked.push(req.payload.username);
			req.post.save(function(err, post){
				if (err) return next(err);
				res.json(req.payload.username);
			});
		} 
		else {
			res.status(400).json({error: "You can vote only once"});
		}
	})

	.post('/posts/:post/undislike', auth, function(req, res, next){
		var index = req.post.usersDisliked.indexOf(req.payload.username);
		req.post.usersDisliked.splice(index, 1);
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
				res.json(saved);
			});
		});
	})

	.delete('/posts/:post', function(req, res, next){
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

	.post('/register', function(req, res, next){
		console.log(req.body);
		User.findOne({username: req.body.username}, function(err, user){
			if (user) {
				return res.status(400).json({ error: "Tên '" + req.body.username + "' đã có người dùng, chọn tên khác!"});
			} else {
				var user = new User();
				user.username = req.body.username;
				user.setPassword(req.body.password);

				user.save(function(err){
					if (err) return next(err);
					return res.json({token: user.generateJWT()});
				});
			}
		});
	})

	.post('/login', function(req, res, next){
		passport.authenticate('local', function(err, user, info){
			if (err) return next(err);

			if(user) {
				return res.json({token: user.generateJWT()});
			} else {
				return res.status(401).json(info);
			}
		})(req, res, next);
	})

	.post('/changePassword', function(req, res, next){
		User.findOne({username: req.body.username}, function(err, user){
			console.log(user.validPassword(req.body.currentPassword));
			if (!user.validPassword(req.body.currentPassword)) {
				return res.status(401).json({error: 'Bạn đã nhập sai password hiện tại!'});
			} else {
				user.setPassword(req.body.newPassword);
				user.save(function(err){
					if (err) return next(err);
					return res.json({token: user.generateJWT()})
				});
			}
		});
	});

module.exports = router;
