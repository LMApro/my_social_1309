angular.module("myNetwork.post.service", [])
	.factory("posts", ["$http", "auth", "Pusher", function($http, auth, Pusher){
		var postService = {
			posts: []
		};

		Pusher.subscribe("posts", "addPost", function(post){
			postService.posts.splice(0, 0, post);
		});

		Pusher.subscribe("posts", "deletePost", function(data){
			var index = postService.getAllPostIds().indexOf(data.post);
			postService.posts.splice(index, 1);
		});

		postService.getAll = function() {
			return $http.get('/posts').success(function(data){
				angular.copy(data, postService.posts);
			});
		};

		postService.getPostsByUser = function(username) {
			return $http.get('/posts/user/' + username).then(function(response){
				return response.data;
			});
		};

		postService.getAllPostIds = function() {
			return postService.posts.map(function(item){
				return item._id;
			});
		};

		postService.create = function(post){
			return $http.post('/posts', post, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			})/*.success(function(data){
				postService.posts.splice(0, 0, data);
			})*/;
		};

		postService.get = function(id) {
			return $http.get('/posts/' + id).then(function(res){
				return res.data;
			});
		};

		postService.addComment = function(id, comment) {
			return $http.post('/posts/' + id + '/comments', comment, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.like = function(post) {
			return $http.put('/posts/' + post._id + '/like', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			})
			/*.success(function(data){
				post.usersLiked.push(data);
			})*/
			;
		};

		postService.unlike = function(post) {
			return $http.put('/posts/' + post._id + '/unlike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			})
			/*.success(function(data){
				var index = post.usersLiked.indexOf(data);
				post.usersLiked.splice(index, 1);
			})*/
			;
		};

		postService.dislike = function(post) {
			return $http.put('/posts/' + post._id + '/dislike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.undislike = function(post) {
			return $http.put('/posts/' + post._id + '/undislike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.save = function(post) {
			return $http.put('/posts/' + post._id + '/save', post, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			}).success(function(post){
				var postIndex = postService.getAllPostIds().indexOf(post._id);
				postService.posts[postIndex] = post;
			})
		};

		postService.saveComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/save', comment, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			}).success(function(comment){
				var postIndex = postService.getAllPostIds().indexOf(post._id);
				var commentIndex = post.comments.map(function(item){
					return item._id;
				}).indexOf(comment._id);
				post.comments[commentIndex] = comment;
			});
		};

		postService.delete = function(post) {
			// var index = postService.posts.indexOf(post);
			// postService.posts.splice(index, 1);

			return $http.delete('/posts/' + post._id, null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.deleteComment = function(post,comment) {
			var postIndex = postService.getAllPostIds().indexOf(post._id);
			var commentIndex = post.comments.indexOf(comment);
			post.comments.splice(commentIndex, 1);
			postService.posts[postIndex] = post;
			return $http.delete('/posts/' + post._id + '/comments/' + comment._id, null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.likeComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/like', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.unlikeComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/unlike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.dislikeComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/dislike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		postService.undislikeComment = function(post, comment) {
			return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/undislike', null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};

		return postService;
	}])
	;