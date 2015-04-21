angular.module("myNetwork.config.stateProvider", ['ui.router'])
	.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "templates/home.html",
				controller: "ViewPostsCtrl",
				
				resolve: {
					postPromise: ['posts', function(posts){
						return posts.getAll();
					}]
				}
			})

			
			.state('posts', {
				url: "/posts/{id}",
				templateUrl: "templates/posts.html",
				controller: "ViewCommentsCtrl",
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts){
						return posts.get($stateParams.id);
					}]
				}
			})

			.state('login', {
				url: "/login",
				templateUrl: 'templates/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})

			.state('register', {
				url: '/register', 
				templateUrl: 'templates/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})

			.state('user', {
				url: '/users/{username}',
				templateUrl: 'templates/user.html',
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
				templateUrl: 'templates/findUser.html',
				controller: 'FindUserCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (!auth.isLoggedIn()) {
						$state.go("home");
					}
				}]

			})

			.state('listUser', {
				url: '/listUser',
				templateUrl: 'templates/listUser.html',
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
				templateUrl: 'templates/changePassword.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'auth', function($state, auth){
					if (!auth.isLoggedIn()) {
						$state.go("home");
					}
				}]
			});

		$urlRouterProvider.otherwise("home");
	}]);
