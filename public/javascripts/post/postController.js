angular.module("myNetwork.post.viewcomments.controller", [])
	.controller("ViewCommentsCtrl", ["$scope", "posts", "post", 'auth', '$window', 'Pusher', function($scope, posts, post, auth, $window, Pusher){
		$scope.post = post;
		$scope.error = '';
		$scope.button = { name: 'Comment' };
		$scope.currentComment = {};
		$scope.currentUser = auth.currentUser;
		$scope.currentPage = 1;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.isAdmin = auth.isAdmin;

		Pusher.subscribe("comments", "addComment", function(comment){
			$scope.post.comments.splice(0, 0, comment);
		});

		Pusher.subscribe("comments", "saveComment", function(comment){
			var commentIndex = $scope.post.comments.map(function(item){
				return item._id;
			}).indexOf(comment._id);
			$scope.post.comments[commentIndex] = comment;
		});

		Pusher.subscribe("comments", "deleteComment", function(data){
			var index = $scope.post.comments.map(function(item){
				return item._id;
			}).indexOf(data.comment);
			$scope.post.comments.splice(index, 1);
		});

		$scope.addComment = function(){
			if ($scope.body) {
				posts.addComment(post._id, {
					body: $scope.body,
					date: new Date()
				});
				
				$scope.error = null;
			} else {
				$scope.error = 'Bạn chưa nhập nội dung bình luận!';
			}
			$scope.body = '';
		};

		$scope.like_unlikeComment = function(post, comment) {
			var user = auth.currentUser();
			if (comment.usersLiked.indexOf(user) === -1) {
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
			if (comment.usersDisliked.indexOf(user) === -1) {
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
				return "Đăng nhập để thích bình luận!";
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
				return "Đăng nhập để không thích bình luận!";
			}
		};

		$scope.deleteComment = function(post, comment) {
			if ($window.confirm("Bạn có chắc chắn muốn xóa không?")) {
				// console.log("Before delete:");
				// console.log(post);
				posts.deleteComment(post, comment);	

			}
		};

		$scope.editComment = function(post, comment) {
			$scope.button.name = 'Save';
			$scope.body = comment.body;
			$scope.currentComment = comment;
			
			var heightStr = angular.element(document.body.scrollHeight).toString();
			var height = parseInt(heightStr.substr(1, heightStr.length - 2));
			$window.scrollTo(0, height);
			document.querySelector('#commentInput').select();
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

		$scope.moveToTop = function() {
			$window.scrollTo(0, 0);
		};
		
	}]);