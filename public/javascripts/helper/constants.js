angular.module("mySocial.constants", [])
	.constant('REGEXPS', {
		VALID_LINK_REQUIRED_PROTOCOL: /^((https|http|ftp)\:\/\/)([w|W]{3}\.)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?((\/[a-zA-Z0-9]*)+(\.[a-zA-Z0-9]{2,4}))?/,
		VALID_LINK_NOT_REQUIRED_PROTOCOL: /^((https|http|ftp)\:\/\/)?([w|W]{3}\.)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?((\/[a-zA-Z0-9]*)+(\.[a-zA-Z0-9]{2,4}))?/,
		VALID_USER: /^[a-zA-Z0-9_\.]{5,20}$/,
		VALID_PASSWORD: /^.{8,}$/,
		VALID_EMAIL: /^[a-zA-Z]+[\.0-9_]+@[a-z0-9]+\.[a-z]{2,4}$/
	});