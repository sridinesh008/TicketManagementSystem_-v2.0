var app = angular.module('mainController',['authServices','userServices'])
    
app.controller('mainCtrl', function ($location,$timeout,Auth,$rootScope,$window,$interval,$route,User,AuthToken) {
    var appData=this;
	//console.log(Auth.isLoggedIn());
	appData.loadme = false;

	appData.checkSession =  function () {
		if(Auth.isLoggedIn()){
			appData.checkingsession = true;
			var interval = $interval(function () {
				var token = $window.localStorage.getItem('token');
					if(token === null){
						$interval.cancel(interval);
					}else{
						self.parseJwt = function (token) {
							var base64Url = token.split(".")[1];
							var base64 = base64Url.replace("-","+").replace("_","/");
							return JSON.parse($window.atob(base64))
						}
						var expireTime = self.parseJwt(token);
						var currentTime =  Math.floor(Date.now() / 1000 );
						//console.log(expireTime.exp);
						//console.log(currentTime);
						var timeCheck = expireTime.exp - currentTime ;
						//console.log("timeCheck "+timeCheck);
						if(timeCheck<=300){
							//console.log("Session expired .");
							showModal(1);
							$interval.cancel(interval);
						}else{
							//console.log("Session did not expire");
						}
						
					}
			}, 2000);
		}
	}

	appData.checkSession();

	var showModal = function (option) {
		appData.choiceMade = false;
		appData.modalHeader = "";
		appData.modalBody = "";
		appData.hideButtons =  false;

		if(option === 1 ){
			appData.modalHeader = "Session Timout!";
			appData.modalBody = "Your session will expire in 5 mins.Do you wish to extend it?";
			$("#myModal").modal({backdrop: "static"});
			if(!appData.choiceMade){
		        $timeout(function(){
					if(!appData.choiceMade){
						Auth.logout();
						$location.path('/');
						$route.reload();
						hideModal();
						}
		        },300000);	
			}
		}else if(option === 2){
			//logout option will com eheer
			appData.hideButtons =  true;
			appData.modalHeader = "Logging out...";
			$("#myModal").modal({backdrop: "static"});
			$timeout(function(){
				Auth.logout();
				$location.path('/');
				$route.reload();
				hideModal();
			},2000);
		}
	}


	var showModalLoggingIn = function () {
			appData.hideButtons =  true;
			appData.modalHeader = "Logging in...";
			$("#myModal").modal({backdrop: "static"});
	}

	appData.reNewsession = function(){
		appData.choiceMade = true;
		User.renewSession(appData.associateID).then(function(data){
			if(data.data.success){
				AuthToken.setToken(data.data.token);
				appData.checkSession();
			}else{
				appData.modalBody = data.data.message;
			}
		});
		hideModal();
	}

	appData.endSession = function(){
		appData.choiceMade = true;
		hideModal();
		$timeout(function(){
			Auth.logout();
			$location.path('/');
			$route.reload();
			showModal(2);
		},1000)
	}

	var hideModal =  function(){
		$("#myModal").modal("hide");
	}

	$rootScope.$on('$routeChangeStart',function(){
		
		if(!appData.checkingsession) appData.checkSession();

		if(Auth.isLoggedIn()){
			appData.isLoggedIn =true;
			Auth.getUser().then(function(data){
				appData.username = data.data.userName;
				appData.useremail = data.data.email;
				appData.associateID = data.data.associateID;
				//console.log(appData.associateID);
				User.getPermission().then(function (data) {
					if(data.data.permission=="admin" || data.data.permission=="moderator"){
						appData.authorized = true;
					}
				});
				
				appData.loadme = true;
			});
		}
		else{
			appData.username = "";
			appData.isLoggedIn =false;
			appData.loadme = true;
		}
		if($location.hash()=='_=_') $location.hash(null);
	});
	
    this.doLogin = function(loginData){
        showModalLoggingIn();
        appData.errorMsg= false;
        Auth.login(appData.loginData).then(function(data){        
            if(data.data.success){
				showModalLoggingIn();
                $timeout(function(){
                    $location.path('/');
					appData.loginData = "";
					appData.successMsg = false;
					hideModal();
				}, 2000);
            }else{
                hideModal();
				appData.errorMsg = data.data.message;
				appData.checkSession();
            }
        });
    };
	
	appData.logout = function(){
		showModal(2);
        Auth.logout();
        $timeout(function(){
                $location.path('/');
				window.location.reload();
        },1000);		 			
	};

});


