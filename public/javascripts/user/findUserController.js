angular.module("mySocial.user.find.controller", [])
	.controller('FindUserCtrl', ['$scope', 'user', '$state', '$window', function($scope, user, $state, $window){
		$scope.users = user.users;
		$scope.messages = {};
		$scope.findUser = function(usr) {
			return user.findUser(usr).then(function(res){
				return res.data.map(function(item){
					return item.username;
				});
			});
		};

		$scope.goto = function(usr) {
			if (usr) {
				$state.go("user", {username: usr});
			} else {
				$scope.messages.error = 'Bạn chưa nhập tên người dùng cần tìm!';
			}
			
		};

		$scope.deleteUser = function(usr) {
			if ($window.confirm("Bạn có chắc chắn muốn xóa người dùng này ra khỏi hệ thống?")) {
				user.deleteUser(usr);
			}
		};

	}]);