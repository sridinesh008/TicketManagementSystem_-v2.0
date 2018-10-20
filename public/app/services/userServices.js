
var app=angular.module('userServices',[])

app.factory('User',function($http){
    userFactory = {};

    userFactory.create = function(userData){
       return  $http.post('/api/users',userData);
    }

    userFactory.renewSession = function (associateID) {
        return  $http.get('/api/renewToken/'+associateID);
    }

    userFactory.getPermission = function () {
        return  $http.get('/api/permission');
    }

    userFactory.getAllUsers = function () {
        return  $http.get('/api/management');
    }

    userFactory.getUser = function (id) {
        return  $http.get('/api/edit/'+id);
    }

    userFactory.editUser = function (userObject) {
        return  $http.put('/api/edit',userObject);
    }

    userFactory.deleteUser = function (associateID) {
        return  $http.delete('/api/deleteUser/'+associateID);
    }


    return userFactory;
})