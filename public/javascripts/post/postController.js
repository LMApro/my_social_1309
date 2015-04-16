angular.module("mySocial.post.controller", [])
	.controller("PostsCtrl", ["$scope", "posts", "post", 'auth', '$window', function($scope, posts, post, auth, $window){
		$scope.post = post;
		$scope.error = '';
		$scope.button = { name: 'Comment' };
		$scope.currentComment = {};
		$scope.currentUser = auth.currentUser();

		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.addComment = function(){
			if ($scope.body) {
				posts.addComment(post._id, {
					body: $scope.body,
					date: new Date()
				}).success(function(comment){
					$scope.post.comments.push(comment);
				});
				$scope.error = null;
			} else {
				$scope.error = 'You must enter some text to comment!';
			}
			$scope.body = '';
		};

		$scope.like_unlikeComment = function(post, comment) {
			var user = $scope.currentUser;
			if (comment.usersLiked.indexOf(user)) {
				posts.likeComment(post, comment);
				comment.usersLiked.push(user);
			} else {
				posts.unlikeComment(post, comment);
				var index = comment.usersLiked.indexOf(user);
				comment.usersLiked.splice(index, 1);
			}
		};

		$scope.dislike_undislikeComment = function(post, comment) {
			var user = $scope.currentUser;
			if (comment.usersDisliked.indexOf(user)) {
				posts.dislikeComment(post, comment);
				comment.usersDisliked.push(user);
			} else {
				posts.undislikeComment(post, comment);
				var index = comment.usersDisliked.indexOf(user);
				comment.usersDisliked.splice(index, 1);
			}
		};

		$scope.likeTooltipText = function(comment) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (comment.usersLiked.indexOf(user) !== -1) {
					return "Unlike";
				} else {
					return "Like";
				}
			} else {
				return "Log in to like this";
			}
		};

		$scope.dislikeTooltipText = function(comment) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (comment.usersDisliked.indexOf(user) !== -1) {
					return "Undislike";
				} else {
					return "Dislike";
				}
			} else {
				return "Log in to dislike this";
			}
		};

		$scope.deleteComment = function(post, comment) {
			if ($window.confirm("Are you sure want to delete?")) {
				posts.deleteComment(post, comment);	
			}
		};

		$scope.editComment = function(post, comment) {
			$scope.button.name = 'Save';
			$scope.body = comment.body;
			$scope.currentComment = comment;
		};

		$scope.save = function(post, comment){
			if ($scope.body) {
				posts.saveComment(post, {
					_id: $scope.currentComment._id,
					body: $scope.body,
					date: new Date()
				});
			} else {
				if ($window.confirm("Do you want to delete this comment?")) {
					posts.deleteComment(post, $scope.currentComment);
				}
			}
			$scope.button.name = 'Comment';
			$scope.body = '';
		};

		$scope.reset = function(){
			$scope.body = '';
			$scope.button.name = 'Comment';
		};
		
	}]);