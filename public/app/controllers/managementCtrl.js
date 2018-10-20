angular.module('managementController',[])
.controller('managementCtrl',function(User, $timeout){
    var app = this;
    app.loading = true;
    app.accessDenied = true;
    app.errorMsg = false;
    app.editAccess = false;
    app.deleteAccess = false;
    
    app.limit = 2;
    function getAllUsers(){
        User.getAllUsers().then(function (data) {
            if(data.data.success){
                
                if(data.data.permission === "admin" || data.data.permission === "moderator"){
                    app.users =  data.data.users;
                    console.log(app.users);
                    app.loading = false;
                    app.accessDenied = false;
                    if(data.data.permission === "admin"){
                        app.editAccess = true;
                        app.deleteAccess = true;
                    }else if(data.data.permission === "moderator"){
                        app.editAccess = true;
                        app.deleteAccess = false;
                    }
                }else{
                    app.errorMsg = "Insufficient Permisssion";
                    app.loading = false;
                }
            }else{
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        });
    }

    getAllUsers();

    app.showMore =  function(number){
        app.moreErr = false;
        if(number>0){
                app.limit = number;
        }else{
            app.moreErr = "Please Enter a valid number"
        }
    }

    app.showAll =  function(){
        app.limit = app.users.length;
        app.moreErr = false;
    }

    app.deleteUser = function(associateID){
        User.deleteUser(associateID).then(function (data) {
            if(data.data.success){
                getAllUsers();
            }else{
                app.moreErr= data.data.message;
            }
        })
    }
});

app.controller('editCtrl',function ($scope,$routeParams,User) {
    var app = this;
    $scope.nameTab = "active";
    app.phase1 = true;

    User.getUser($routeParams.id).then(function (data) {
        console.log(data);
        
        if(data.data.success){
            $scope.newName = data.data.user.userName;
            app.currentUser= data.data.user._id;
        }else{
            app.errorMsg = data.data.message;
        }
    })

    app.namePhase =  function () {
        $scope.nameTab = "active";
        $scope.associateIDTab = "default";
        $scope.emailTab = "default";
        $scope.permissionTab = "default";
        app.phase1 = true;
        app.phase2 = false;
        app.phase3 = false;
        app.phase4 = false;
    };

    app.associateIDPhase = function () {
        $scope.nameTab = "default";
        $scope.associateIDTab = "active";
        $scope.emailTab = "default";
        $scope.permissionTab = "default";
        app.phase1 = false;
        app.phase2 = true;
        app.phase3 = false;
        app.phase4 = false;
    };
    
    app.emailPhase = function () {
        $scope.nameTab = "default";
        $scope.emailTab = "active";
        $scope.associateIDTab = "default";
        $scope.permissionTab = "default";
        app.phase1 = false;
        app.phase2 = false;
        app.phase3 = true;
        app.phase4 = false;
    };
    
    app.permissionPhase = function () {
        $scope.nameTab = "default";
        $scope.permissionTab = "active";
        $scope.associateIDTab = "default";
        $scope.emailTab = "default";
        app.phase1 = false;
        app.phase2 = false;
        app.phase3 = false;
        app.phase4 = true;
    };

    app.updateName  = function (newName,valid) {
        app.errorMsg = false;
        app.disabled = true;
        userObject = {};   
        if(valid){
            userObject._id = app.currentUser;
            userObject.userName = $scope.newName;
            User.editUser(userObject).then(function (data){
                if(data.data.success){
                    app.successMsg = data.data.message;
                    $timeout(function () {
                        app.nameForm.userName.$setPristine();
                        app.nameForm.userName.$setUntouched();
                        app.successMsg = false;
                        app.disabled = false;
                    },2000)
                }else{
                    app.errorMsg = data.data.message;
                    app.disabled = false;
                }
            });
        }else{
            app.errorMsg = "Please ensure form is filled with proper data."
        }
    };
});

