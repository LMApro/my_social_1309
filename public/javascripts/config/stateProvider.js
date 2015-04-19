angular.module("myNetwork.config.stateProvider", ['ui.router'])
	.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "/home.html",
				controller: "ViewPostsCtrl",
				resolve: {
					postPromise: ['posts', function(posts){
						return posts.getAll();
					}]
				}
			})

			.state('posts', {
				url: "/posts/{id}",
				templateUrl: "/posts.html",
				controller: "ViewCommentsCtrl",
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts){
						return posts.get($stateParams.id);
					}]
				}
			})

			.state('login', {
				url: "/login",
				templateUrl: '/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})

			.state('register', {
				url: '/register', 
				templateUrl: '/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})

			.state('user', {
				url: '/users/{username}',
				templateUrl: '/user.html',
				controller: 'ViewUserPostsCtrl',
				onEnter: ["$state", '$stateParams', function($state, $stateParams){
					if (!$stateParams.username) {
						$state.go("home");
					}
				}],
				resolve: {
					userPosts: ['posts', '$stateParams', function(posts, $stateParams){
						return posts.getPostsByUser($stateParams.username);
					}]
				}
			})

			.state('findUser', {
				url: '/findUser',
				templateUrl: '/findUser.html',
				controller: 'FindUserCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (!auth.isLoggedIn()) {
						$state.go("home");
					}
				}]

			})

			.state('listUser', {
				url: '/listUser',
				templateUrl: '/listUser.html',
				controller: 'FindUserCtrl',
				resolve: {
					userPromise: ['user', function(user){
						return user.getAllUser();
					}]
				},
				onEnter: ['$state', 'auth', function($state, auth){
					if ( !auth.isLoggedIn() || (auth.isLoggedIn() && !auth.isAdmin()) ) {
						$state.go("home");
					}
				}]
			})

			.state('changePassword', {
				url: '/changePassword',
				templateUrl: '/changePassword.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (!auth.isLoggedIn()) {
						$state.go("home");
					}
				}]
			});

		$urlRouterProvider.otherwise("home");
	}]);
