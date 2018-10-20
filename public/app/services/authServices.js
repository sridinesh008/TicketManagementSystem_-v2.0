var app = angular.module('authServices',[])


app.factory('Auth',function($http, AuthToken,$q){
    authFactory = {};

    authFactory.login = function(loginData){
       return  $http.post('/api/authenticate',loginData).then(function(data){
			//console.log(data.data);
			AuthToken.setToken(data.data.token);
			return data;
	   });
    };
	
	// AuthToken.isLoggedIn();
	authFactory.isLoggedIn = function(){
			
       if(AuthToken.getToken()){
			return true;
	   }
	   else{
			return false;
	   }
    };
	
	//To get the user details for profile;
	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.post('/api/me');
		}
		else{
			$q.reject({message: 'User has no Token'});
		}
	};
	
	//For logging the user out
	authFactory.logout = function(){
		AuthToken.setToken();
	};
	
    return authFactory;
})

.factory('AuthToken',function($window){
    var authTokenFactory = {};

	// AuthToken.setToken(token);
    authTokenFactory.setToken = function(token){
	   if(token){
			$window.localStorage.setItem('token',token);
	   }else{
			$window.localStorage.removeItem('token');
	   }
    };
	
	// AuthToken.getToken();
	authTokenFactory.getToken = function(){
	   return $window.localStorage.getItem('token');
    };
	
    return authTokenFactory;
})

.factory('AuthInterceptors',function(AuthToken){
		var authInterceptorFactory = {};
		authInterceptorFactory.request = function(config){
			var token = AuthToken.getToken();
			if(token) config.headers['x-access-token'] = token;
			return config;
		};
		
		return authInterceptorFactory;
});

