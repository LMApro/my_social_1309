var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	author: String,
	usersLiked: [{type: String}],
	usersDisliked: [{type: String}],
	date: {type: Date, default: new Date()},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.virtual("points").get(function(){
	return (this.comments.length*1 + this.usersLiked.length*3 + this.usersDisliked.length*(-1));
});

PostSchema.set('toJSON', {virtuals: true});


mongoose.model('Post', PostSchema);