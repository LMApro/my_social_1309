var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var User = mongoose.model("User");
var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");

router
	
	.post('/register', function(req, res, next){
		User.findOne({username: req.body.username}, function(err, user){
			if (user) {
				return res.status(400).json({ error: "Tên '" + req.body.username + "' đã được sử dụng, chọn tên khác!"});
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

	.put('/changePassword', function(req, res, next){
		User.findOne({username: req.body.username}, function(err, user){
			
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
	})
	
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

		// delete comments of that user from Comment schema
		Comment.find({author: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				Comment.remove({author: req.params.username}, function(err){
					if (err) return next(err);
				});
			});
		});

		// remove comments of that user from comments array in Post schema
		Comment.find({author: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				Post.update({comments: comment._id}, {$pull: {comments: comment._id}}, {multi: true}, function(err, updated){
					if (err) return next(err);
					console.log(updated);
				});
			});
		});

		// remove user's like/dislike info
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
				Comment.update({}, {$pull: {usersLiked: req.params.username}}, {multi: true}, function(err, updated){
					if (err) return next(err);
				});
			});
		});

		Comment.find({usersDisliked: req.params.username}, function(err, comments){
			if (err) return next(err);
			comments.forEach(function(comment){
				Comment.update({}, {$pull: {usersDisliked: req.params.username}}, {multi: true}, function(err, updated){
					if (err) return next(err);
				});
			});
		});

	});

module.exports = router;
