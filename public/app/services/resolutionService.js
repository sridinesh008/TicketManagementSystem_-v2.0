
var app=angular.module('resolutionService',['ui.bootstrap','datatables','ngMaterial', 'ngMessages'])

app.factory('Resolution',function($http){
    resolutionFactory = {};

    resolutionFactory.add = function(resolutionData){
        return  $http.post('/api/addResolution',resolutionData);
    };

    resolutionFactory.getallResolutions = function(){
        return  $http.get('/api/getallResolutions');
    };

    resolutionFactory.getResolution = function(id){
        return  $http.get('/api/getResolution/'+id);
    };

    resolutionFactory.updateResolution = function(resolutionData){
        return  $http.put('/api/updateResolution',resolutionData);
    };

    return resolutionFactory;
});