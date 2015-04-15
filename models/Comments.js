var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	usersLiked: [{type: String}],
	usersDisliked: [{type: String}],
	date: {type: Date, default: new Date()},
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});


mongoose.model('Comment', CommentSchema);