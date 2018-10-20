
var app=angular.module('issueServices',['ui.bootstrap','datatables','ngMaterial', 'ngMessages','datatables.buttons'])

app.factory('Issue',function($http){
    issueFactory = {};

    issueFactory.create = function(issueData){
        return  $http.post('/api/createIssue',issueData);
    };

    issueFactory.getAllTickets = function(){
         return  $http.get('/api/addAnIssue');
    };
	
	issueFactory.getTicketSummaryByInternalStatus = function(){
        return  $http.get('/api/getTicketSummaryByInternalStatus');
    };

    issueFactory.getTicketSummaryByMantisStatus = function(){
        return  $http.get('/api/getTicketSummaryByMantisStatus');
    };

    issueFactory.getTicketSummaryByInternalCategory = function(){
        return  $http.get('/api/getTicketSummaryByInternalCategory');
    };

    issueFactory.getTicketSummaryByMantisCategory = function(){
        return  $http.get('/api/getTicketSummaryByMantisCategory');
    };

    issueFactory.getTicketSummaryByModule = function(){
        return  $http.get('/api/getTicketSummaryByModule');
    };

    issueFactory.editTickets = function(id){
        return  $http.get('/api/editTickets/'+id);
    };

    issueFactory.updateTickets = function (ticketObject) {
        return  $http.put('/api/editTickets',ticketObject);
    }

    issueFactory.deleteTickets = function (deleteObject) {
        //console.log(id);
        return  $http.put('/api/deleteTicket',deleteObject);
    }

    issueFactory.getTicketSummaryByInternalStatusForChart = function(){
        return  $http.get('/api/getTicketSummaryByInternalStatusForChart');
    };

    issueFactory.getTicketSummaryByMantisStatusForChart = function(){
        return  $http.get('/api/getTicketSummaryByMantisStatusForChart');
    };

    issueFactory.getTicketSummaryByInternalCategoryForChart = function(){
        return  $http.get('/api/getTicketSummaryByInternalCategoryForChart');
    };

    issueFactory.getTicketSummaryByMantisCategoryForChart = function(){
        return  $http.get('/api/getTicketSummaryByMantisCategoryForChart');
    };

    issueFactory.getTicketSummaryByAssigneeForChart = function(){
        return  $http.get('/api/getTicketSummaryByAssigneeForChart');
    };

    issueFactory.getTicketSummaryByModuleForChart = function(){
        return  $http.get('/api/getTicketSummaryByModuleForChart');
    };

    issueFactory.getTicketSummaryByModuleForChartOnlyOpen = function(){
        return  $http.get('/api/getTicketSummaryByModuleForChartOnlyOpen');
    };

    issueFactory.getTicketSummaryByInternalCategoryForChartOnlyOpen = function(){
        return  $http.get('/api/getTicketSummaryByInternalCategoryForChartOnlyOpen');
    };

    issueFactory.getTicketSummaryByMantisCategoryForChartOnlyOpen = function(){
        return  $http.get('/api/getTicketSummaryByMantisCategoryForChartOnlyOpen');
    };

    issueFactory.getTicketSummaryByAssigneeForChartOnlyOpen = function(){
        return  $http.get('/api/getTicketSummaryByAssigneeForChartOnlyOpen');
    };

    issueFactory.myStatsByInternalStatusForChart = function(){
        return  $http.get('/api/myStatsByInternalStatusForChart');
    };

    issueFactory.myStatsByMantisStatusForChart = function(){
        return  $http.get('/api/myStatsByMantisStatusForChart');
    };

    issueFactory.myStatsByInternalCategoryForChart = function(){
        return  $http.get('/api/myStatsByInternalCategoryForChart');
    };

    issueFactory.myStatsByMantisCategoryForChart = function(){
        return  $http.get('/api/myStatsByMantisCategoryForChart');
    };
     issueFactory.myStatsByInternalCategoryForChartOnlyOpen = function(){
        return  $http.get('/api/myStatsByInternalCategoryForChartOnlyOpen');
    };
    issueFactory.myStatsByMantisCategoryForChartOnlyOpen = function(){
        return  $http.get('/api/myStatsByMantisCategoryForChartOnlyOpen');
    };
    
    issueFactory.myStatsByModuleForChart = function(){
        return  $http.get('/api/myStatsByModuleForChart');
    };

    issueFactory.myStatsByModuleForChartOnlyOpen = function(){
        return  $http.get('/api/myStatsByModuleForChartOnlyOpen');
    };
    issueFactory.getAllComments = function(id){
        return  $http.get('/api/getAllComments/'+id);
    };
    issueFactory.getSearchResults = function(searchObject){
        console.log(searchObject);
        return  $http.post('/api/filterSearch',searchObject);
    };

     return issueFactory;
});


app.directive('tmpl',function($compile){
    //console.log("sss");
    var directive ={};
    directive.restrict = "A";
    directive.templateUrl = "app/views/pages/management/child.html";
    directive.transclude = true;
    directive.link = function(scope,element,attrs){

    }
    return directive;
});

app.directive('expand', function () {
    function link(scope, element, attrs) {
        scope.$on('onExpandAll', function (event, args) {
            scope.expanded = args.expanded;
        });
    }
    return {
        link: link
    };
});

