angular.module("mySocial.auth.controller", [])
	.controller('AuthCtrl', ['$scope', '$state', 'auth', 'REGEXPS', function($scope, $state, auth, regex){
		$scope.user = {};
		$scope.messages = {};
      var USER_REGEX = regex.VALID_USER;
      var PASS_REGEX = regex.VALID_PASSWORD;

		$scope.register = function(){
         if (!$scope.user.username) {
         	$scope.messages.error = "Please provide an username contains 5 to 20 characters!";
         } 
         else if (!USER_REGEX.test($scope.user.username)) {
            $scope.messages.error = "Username must between 5 to 20 characters and not included special characters";
         } 
         else if (!$scope.user.password) {
         	$scope.messages.error = "Please provide a password (at least 8 characters)!";
         } 
         else if (!PASS_REGEX.test($scope.user.password)) {
            $scope.messages.error = "Password must have at least 8 characters!";
         } 
         else if (!$scope.user.verifyPass) {
         	$scope.messages.error = "Please confirm your password!";
         } 
         else if ($scope.user.password != $scope.user.verifyPass) {
            $scope.messages.error = "Password must match";
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
				$scope.messages.error = "Please fill out all fields!";
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
            $scope.messages.error = 'You must fill out all the fields!';
         }
         else if (!PASS_REGEX.test($scope.user.newPassword)) {
            $scope.messages.error = 'Password must have at least 8 characters!';
         } 
         else if ($scope.user.newPassword != $scope.user.verifyNewPassword) {
            $scope.messages.error = 'It looks like your passwords are not match, check again!';
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
                  $scope.messages.success = "Password updated!";
               });
         }
         
      };
	}]);