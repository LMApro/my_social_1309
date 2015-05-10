angular.module("myNetwork.config.pusherProvider", ['doowb.angular-pusher'])
	.config(['PusherServiceProvider', function(PusherServiceProvider) {
		PusherServiceProvider
			.setToken('864c814b8f54479e5d71')
			.setOptions({});
	}]);