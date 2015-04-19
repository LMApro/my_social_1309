angular.module("mySocial.auth.service", [])
	.factory('auth', ['$http', '$window', '$state', function($http, $window, $state){
		var authService = {};
		
		authService.saveToken = function(token){
			$window.localStorage['my-social-token'] = token;
		};

		authService.getToken = function(){
			return $window.localStorage['my-social-token'];
		};
		
		authService.isLoggedIn = function(){
			var token = authService.getToken();

			if (token) {
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return (payload.exp > Date.now()/1000);
			} else {
				return false;
			}
		};

		authService.currentUser = function(){
			if (authService.isLoggedIn()) {
				var token = authService.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.username;
			}
		};

		authService.isAdmin = function(){
			if (authService.isLoggedIn()) {
				var token = authService.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				
				return payload.isAdmin;
			}
		};

		authService.register = function(user) {
			return $http.post('/users/register', user).success(function(data){
				authService.saveToken(data.token);
			});
		};
		
		authService.logIn = function(user) {
			return $http.post('/users/login', user).success(function(data){
				authService.saveToken(data.token);
			});
		};

		authService.logOut = function(){
			$window.localStorage.removeItem('my-social-token');
			$state.go('home');
		};

		authService.changePassword = function(user) {
			return $http.put('/users/changePassword', user).success(function(data){
				authService.saveToken(data.token);
				// console.log(data.token);
			});
		};

		return authService;
	}]);