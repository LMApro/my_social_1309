angular.module("mySocial.main.controller", [])
	.controller("MainCtrl", ["$scope", "$window", "posts", 'auth', 'REGEXPS', function($scope, $window, posts, auth, regex){
		
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
		$scope.posts = posts.posts;
		$scope.error = '';
		$scope.editing = {};
		var VALID_LINK = regex.VALID_LINK_NOT_REQUIRED_PROTOCOL;

		$scope.addPost = function(){
			if (!$scope.newtitle) {
				$scope.error = 'You must fill out Title or Status';
			} else if ($scope.newlink && !VALID_LINK.test($scope.newlink)) {
				$scope.error = 'Invalid link';
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

		$scope.isUpvoted = function(post) {
		   return false;
		};

		$scope.isDownvoted = function(post) {
			return false;
		};

		$scope.like = function(post) {
			posts.like(post);
		};

		$scope.dislike = function(post) {
			posts.dislike(post);
		};

		$scope.edit = function(post) {
			$scope.editing.current = [post, true];
			$scope.title = $scope.editing.current[0].title;
			$scope.link = $scope.editing.current[0].link;
			$window.scrollTo(0, 0);
		};

		/*$scope.logNewTitle = function() {
			console.log($scope.newtitle);
		};
		$scope.logTitle = function() {
			console.log($scope.title);
		};*/

		$scope.save = function(){
			
			if (!$scope.title && !$scope.link) {
				if ($window.confirm("Do you want to delete this post?")) {
					posts.delete($scope.editing.current[0]);
					$scope.editing = {};
					$scope.error = '';
				}
			} else if (!$scope.title) {
				$scope.error = 'You must fill out Title or Status';
			} else if ($scope.link && !VALID_LINK.test($scope.link)) {
				$scope.error = 'Invalid link';
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
			if ($window.confirm("Are you sure want to delete?")) {
				posts.delete(post);
			}			
		};

	}]);