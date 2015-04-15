var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
require('./models/Posts');
require('./models/Comments');
require('./models/Users');
mongoose.connect('mongodb://localhost/news');

var User = mongoose.model("User");
var username = 'makat33';
/*User.find({username: username}, function(err, doc){
	console.log(doc);
	return mongoose.disconnect();
});*/
var Post = mongoose.model("Post");
Post.remove({_id: "55288d6bc2f38ee811af325c"}, function(err, removed){
	console.log("removed");
	mongoose.disconnect();
});
