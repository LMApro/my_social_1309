angular.module("mySocial.home.viewposts.controller", [])
	.controller("MainCtrl", ["$scope", "$window", "posts", 'auth', 'REGEXPS', function($scope, $window, posts, auth, regex){
		
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
		$scope.isAdmin = auth.isAdmin;
		$scope.posts = posts.posts;
		$scope.error = '';
		$scope.editing = {};
		$scope.currentLike = false;
		var VALID_LINK = regex.VALID_LINK_NOT_REQUIRED_PROTOCOL;

		$scope.addPost = function(){
			if (!$scope.newtitle) {
				$scope.error = 'Bạn chưa nhập nội dung!';
			} else if ($scope.newlink && !VALID_LINK.test($scope.newlink)) {
				$scope.error = 'Link không hợp lệ!';
			} else {
				//console.log("valid post");
				posts.create({
					title: $scope.newtitle,
					link: $scope.newlink,
					date: new Date()
				});
				$scope.newtitle = '';
				$scope.newlink = '';
				$scope.error = '';
			}
		};

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

		$scope.save = function(){
			
			if (!$scope.title && !$scope.link) {
				if ($window.confirm("Có phải bạn muốn xóa bài viết này?")) {
					posts.delete($scope.editing.current[0]);
					$scope.editing = {};
					$scope.error = '';
				}
			} else if (!$scope.title) {
				$scope.error = 'Bạn chưa nhập nội dung!';
			} else if ($scope.link && !VALID_LINK.test($scope.link)) {
				$scope.error = 'Link không hợp lệ!';
			} else {
				// console.log($scope.title);
				// console.log($scope.link);
				var updatedPost = {
					_id: $scope.editing.current[0]._id,
					title: $scope.title,
					link: $scope.link,
					date: new Date()
				};
				// console.log(updatedPost);
				posts.save(updatedPost);
				$scope.editing = {};
				$scope.error = '';
			}
		};
		


		$scope.reset = function(){
			$scope.editing = {};
		};

		$scope.delete = function(post) {
			if ($window.confirm("Bạn có chắc chắn muốn xóa không?")) {
				posts.delete(post);
			}			
		};



	}]);