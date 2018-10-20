
var app=angular.module('commentServices',['ui.bootstrap','datatables','ngMaterial', 'ngMessages'])

app.factory('Comment',function($http){
    commentFactory = {};

    commentFactory.create = function(commentData){
        return  $http.post('/api/createComment',commentData);
    };

    return commentFactory;
});