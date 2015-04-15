angular.module("mySocial.post.controller", [])
	.controller("PostsCtrl", ["$scope", "posts", "post", 'auth', '$window', function($scope, posts, post, auth, $window){
		$scope.post = post;
		$scope.error = '';
		$scope.button = { name: 'Comment' };
		$scope.currentComment = {};

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

		$scope.likeComment = function(comment) {
			posts.likeComment(post, comment);
		};

		$scope.dislikeComment = function(comment) {
			posts.dislikeComment(post, comment);
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