var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");

router

	.get('/findUser/:user', function(req, res, next){
		User.find({username: new RegExp(req.params.user)}, function(err, users){
			if (err) return next(err);
			res.json(users);
		});
	})

	.get('/getUser/:user', function(req, res, next){
		User.findOne({username: req.params.user}, function(err, user){
			if (err) return next(err);
			res.json(user);
		});
	})

	.get('/all', function(req, res, next){
		User.find({}, function(err, users){
			if (err) return next(err);
			// console.log(users);
			res.json(users);
		});
	})

	.delete('/delete/:username', function(req, res, next){
		// delete user from User schema
		User.remove({username: req.params.username}, function(err){
			if (err) return next(err);
			res.json(req.params.username);
		});

		// delete posts of that user and comments of that post from Post schema
		Post.find({author: req.params.username}, function(err, posts){
			if (err) return next(err);
			posts.forEach(function(post){
				post.comments.forEach(function(comment){
					Comment.remove({_id: comment}, function(err){
						if (err) return next(err);
					});
				});

				Post.remove({_id: post._id}, function(err){
					if (err) return next(err);
				});
			});
		});

		Comment.find({author: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				Post.update({comments: comment._id}, {$pull: {comments: comment._id}}, {multi: true}, function(err, updated){
					if (err) return next(err);
					console.log(updated);
				});
			});
		});

		Post.find({usersLiked: req.params.username}, function(err, posts){
			if (err) return next(err);
			posts.forEach(function(post){
				Post.update({}, {$pull: {usersLiked: req.params.username}}, {multi: true}, function(err, updated){
					if (err) return next(err);
				});
			});
		});

		Post.find({usersDisliked: req.params.username}, function(err, posts){
			if (err) return next(err);
			posts.forEach(function(post){
				Post.update({}, {$pull: {usersDisliked: req.params.username}}, {multi: true}, function(err, updated){
					if (err) return next(err);
				});
			});
		});

		Comment.find({usersLiked: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				var index = comment.usersLiked.indexOf(req.params.username);
				comment.usersLiked.splice(index, 1);
				comment.save();
			});
		});

		Comment.find({usersDisliked: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				var index = comment.usersDisliked.indexOf(req.params.username);
				comment.usersLiked.splice(index, 1);
				comment.save();
			});
		});

		Comment.find({author: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				Comment.remove({author: req.params.username}, function(err){
					if (err) return next(err);
				});
			});
		});
		
	});

module.exports = router;
