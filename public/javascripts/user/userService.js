angular.module("mySocial.user.service", [])
	.factory('user', ['$http', function($http){
		var userService = {
			users: [],
		};
		userService.findUser = function(usr) {
			return $http({
				method: 'GET',
				url: '/users/findUser/' + usr
			});
		};

		userService.getAllUser = function() {
			return $http({
				method: 'GET',
				url: '/users/all'
			}).success(function(users){
				angular.copy(users, userService.users);
			});
		};


		return userService;
	}]);