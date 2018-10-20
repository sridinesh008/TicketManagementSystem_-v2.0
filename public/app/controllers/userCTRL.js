var app = angular.module('userController',['userServices'])

app.controller('registrationCtrl', function ($http,$location,$timeout,User) {
    var appData=this;
    this.regUser = function(userData,valid){
        appData.loading=true;
        appData.errorMsg= false;

        if(valid){
            User.create(appData.userData).then(function(data){
                
                if(data.data.success){
                    appData.loading=false;
                    //appData.successMsg = data.data.message;
                    $timeout(function(){
                        $location.path('/regSuccess');
                    }, 1000);
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            })
        }else{
            appData.loading=false;
            //appData.errorMsg = "Please ensure all fields are correctly filled";
        }
    }

});