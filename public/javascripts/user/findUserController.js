angular.module("mySocial.user.find.controller", [])
	.controller('FindUserCtrl', ['$scope', 'user', function($scope, user){
		$scope.users = user.users;

		$scope.findUser = function(usr) {
			return user.findUser(usr).then(function(res){
				return res.data.map(function(item){
					return item.username;
				});
			});
		};

		$scope.goto = function(usr) {
			$state.go("user", {username: usr});
		};

		$scope.deleteUser = function(usr) {
			if ($window.confirm("Bạn có chắc chắn muốn xóa người dùng này ra khỏi hệ thống?")) {
				user.deleteUser(usr);
			}
		};

	}]);