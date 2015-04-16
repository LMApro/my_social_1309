angular.module("mySocial.auth.controller", [])
	.controller('AuthCtrl', ['$scope', '$state', 'auth', 'REGEXPS', function($scope, $state, auth, regex){
		$scope.user = {};
		$scope.messages = {};
      var USER_REGEX = regex.VALID_USER;
      var PASS_REGEX = regex.VALID_PASSWORD;

		$scope.register = function(){
         if (!$scope.user.username) {
         	$scope.messages.error = "Bạn chưa nhập Tên người dùng!";
         } 
         else if (!USER_REGEX.test($scope.user.username)) {
            $scope.messages.error = "Tên người dùng từ 5 đến 20 kí tự và không chứa khoảng trắng và kí tự đặc biệt!";
         } 
         else if (!$scope.user.password) {
         	$scope.messages.error = "Bạn chưa nhập mật khẩu (ít nhất 8 kí tự)!";
         } 
         else if (!PASS_REGEX.test($scope.user.password)) {
            $scope.messages.error = "Mật khẩu cần ít nhất 8 kí tự!";
         } 
         else if (!$scope.user.verifyPass) {
         	$scope.messages.error = "Bạn chưa nhập lại mật khẩu!";
         } 
         else if ($scope.user.password != $scope.user.verifyPass) {
            $scope.messages.error = "Mật khẩu chưa khớp!";
         } 
         else {
         	console.log($scope.user);
            auth
         		.register($scope.user)
         		.error(function(err){
         			$scope.messages = err;
         		})
         		.then(function(){
	         		$state.go("home");
	         	});
         }

		};
		
		$scope.logIn = function(){
			if (!$scope.user.username && !$scope.user.password) {
				$scope.messages.error = "Bạn chưa nhập tên người dùng hoặc mật khẩu!";
			} else {
				auth
					.logIn($scope.user)
					.error(function(err){
						$scope.messages = err;
					})
					.then(function(){
						$state.go('home');
					});
			}
		};

      $scope.changePassword = function(){
         $scope.user.username = auth.currentUser();
         if (!$scope.user.currentPassword || !$scope.user.newPassword || !$scope.user.verifyNewPassword) {
            $scope.messages.error = 'Bạn chưa nhập tên người dùng hoặc mật khẩu!';
         }
         else if (!PASS_REGEX.test($scope.user.newPassword)) {
            $scope.messages.error = 'Mật khẩu cần ít nhất 8 kí tự!';
         } 
         else if ($scope.user.newPassword != $scope.user.verifyNewPassword) {
            $scope.messages.error = 'Mật khẩu chưa khớp!';
         } 
         else {
            auth
               .changePassword($scope.user)
               .error(function(err){
                  $scope.messages = err;
               })
               .then(function(){
                  $scope.messages = {};
                  $scope.user = {};
                  $scope.messages.success = "Đã cập nhật mật khẩu!";
               });
         }
         
      };
	}]);