angular.module("mySocial.user.controller", [])
	.controller('UserCtrl', ['$scope', '$stateParams', 'auth', 'posts', '$window', 'REGEXPS', function($scope, $stateParams, auth, posts, $window, regex){
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
			// $window.scrollTo(0, 0);
		};

		$scope.save = function() {
			// console.log("saved");
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
			if ($window.confirm("Are you sure want to delete?")) {
				posts.delete(post);
				var index = $scope.posts.map(function(item){
					return item._id;
				}).indexOf(post._id);
				$scope.posts.splice(index, 1);
			}			
		};

	}]);