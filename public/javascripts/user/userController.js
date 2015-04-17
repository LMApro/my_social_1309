angular.module("mySocial.user.controller", [])
	.controller('UserCtrl', ['$scope', '$stateParams', '$state', 'auth', 'posts', '$window', 'REGEXPS', 'user', function($scope, $stateParams, $state, auth, posts, $window, regex, user){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
		$scope.posts = [];
		$scope.username = $stateParams.username;
		$scope.editing = {};
		var VALID_LINK = regex.VALID_LINK_NOT_REQUIRED_PROTOCOL;


		posts.getPostsByUser($scope.username).success(function(data){
			data.forEach(function(post){
				$scope.posts.push(post);
			});
		});


		$scope.like_unlike = function(post) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (post.usersLiked.indexOf(user) === -1) {
					posts.like(post);
					post.usersLiked.push(user);
					post.points+=2;
				} else {
					posts.unlike(post);
					var index = post.usersLiked.indexOf(user);
					post.usersLiked.splice(index, 1);
					post.points-=2;
				}
			}
		};

		$scope.dislike_undislike = function(post) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (post.usersDisliked.indexOf(user) === -1) {
					posts.dislike(post);
					post.usersDisliked.push(user);
					post.points--;
				} else {
					posts.undislike(post);
					var index = post.usersDisliked.indexOf(user);
					post.usersDisliked.splice(index, 1);
					post.points++;
				}
			}
		};

		$scope.likeTooltipText = function(post) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (post.usersLiked.indexOf(user) !== -1) {
					return "Bỏ thích";
				} else {
					return "Thích";
				}
			} else {
				return "Bạn cần đăng nhập!";
			}
		};

		$scope.dislikeTooltipText = function(post) {
			if (auth.isLoggedIn()) {
				var user = auth.currentUser();
				if (post.usersDisliked.indexOf(user) !== -1) {
					return "Bỏ không thích";
				} else {
					return "Không thích";
				}
			} else {
				return "Bạn cần đăng nhập!";
			}
		};

		$scope.edit = function(post) {
			$scope.editing.current = [post, true];
			$scope.title = $scope.editing.current[0].title;
			$scope.link = $scope.editing.current[0].link;
			$window.scrollTo(0, 0);
		};

		$scope.save = function() {
			if (!$scope.title && !$scope.link) {
				if ($window.confirm("Bạn có chắc chắn muốn xóa không?")) {
					posts.delete($scope.editing.current[0]);
					$scope.editing = {};
					$scope.error = '';
				}
			} else if (!$scope.title) {
				$scope.error = 'Bạn chưa nhập nội dung!';
			} else if ($scope.link && !VALID_LINK.test($scope.link)) {
				$scope.error = 'Link không hợp lệ!';
			} else {
				var updatedPost = {
					_id: $scope.editing.current[0]._id,
					title: $scope.title,
					link: $scope.link,
					date: new Date()
				};
				
				posts.save(updatedPost);
				var index = $scope.posts.map(function(item){
					return item._id;
				}).indexOf($scope.editing.current[0]._id);
				$scope.posts[index].title = updatedPost.title;
				$scope.posts[index].link = updatedPost.link;
				$scope.posts[index].date = updatedPost.date;
				$scope.editing = {};
				$scope.error = '';
			}
			
		};

		$scope.reset = function() {
			$scope.editing = {};
		};


		$scope.delete = function(post) {
			if ($window.confirm("Có phải bạn muốn xóa bài viết này?")) {
				posts.delete(post);
				var index = $scope.posts.map(function(item){
					return item._id;
				}).indexOf(post._id);
				$scope.posts.splice(index, 1);
			}			
		};

		$scope.getUser = function(usr) {
			return user.getUser(usr).then(function(res){
				return res.data.map(function(item){
					return item.username;
				});
			});
		};

		$scope.goto = function(usr) {
			$state.go("user", {username: usr});
		};

	}]);