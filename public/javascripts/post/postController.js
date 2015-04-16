angular.module("mySocial.post.controller", [])
	.controller("PostsCtrl", ["$scope", "posts", "post", 'auth', '$window', function($scope, posts, post, auth, $window){
		$scope.post = post;
		$scope.error = '';
		$scope.button = { name: 'Comment' };
		$scope.currentComment = {};
		$scope.currentUser = auth.currentUser;

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
				$scope.error = 'Bạn chưa nhập nội dung bình luận!';
			}
			$scope.body = '';
		};

		$scope.like_unlikeComment = function(post, comment) {
			var user = auth.currentUser();
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
			var user = auth.currentUser();
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
					return "Bỏ thích";
				} else {
					return "Thích";
				}
			} else {
				return "Bạn cần đăng nhập!";
			}
		};

		$scope.dislikeTooltipText = function(comment) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (comment.usersDisliked.indexOf(user) !== -1) {
					return "Bỏ không thích";
				} else {
					return "Không thích";
				}
			} else {
				return "Bạn cần đăng nhập!";
			}
		};

		$scope.deleteComment = function(post, comment) {
			if ($window.confirm("Bạn có chắc chắn muốn xóa không?")) {
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
				if ($window.confirm("Bạn có chắc chắn muốn xóa không?")) {
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