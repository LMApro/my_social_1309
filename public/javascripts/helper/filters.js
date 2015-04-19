angular.module("myNetwork.filters", [])
	.filter('link', ['REGEXPS', function(regex){
		return function(link){
			var VALID_LINK = regex.VALID_LINK_REQUIRED_PROTOCOL;
			if (VALID_LINK.test(link)) {
				return link;
			} else {
				return 'https://' + link;
			}
		};
	}]);