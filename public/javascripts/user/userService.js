angular.module("myNetwork.user.service", [])
	.factory('user', ['$http', 'auth', function($http, auth){
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

		userService.deleteUser = function(usr) {
			var index = userService.users.map(function(item){
				return item.username;
			}).indexOf(usr.username);
			userService.users.splice(index, 1);

			return $http.delete('/users/delete/' + usr.username, null, {
				headers: {Authorization: "Bearer " + auth.getToken()}
			});
		};


		return userService;
	}]);