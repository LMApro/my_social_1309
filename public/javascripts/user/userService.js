angular.module("mySocial.user.service", [])
	.factory('user', ['$http', function($http){
		var userService = {};
		userService.getUser = function(usr) {
			return $http({
				method: 'GET',
				url: '/findUser/' + usr
			});
		};

		return userService;
	}]);