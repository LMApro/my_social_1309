var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
/* GET users listing. */
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
	});

module.exports = router;
