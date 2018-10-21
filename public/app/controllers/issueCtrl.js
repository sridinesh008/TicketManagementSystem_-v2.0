var app = angular.module('issueController',['issueServices','commentServices','ngMaterial', 'ngMessages'])

app.controller('issueCtrl', function ($http,$location,$timeout,Issue,$scope,User,Comment, $q, $log) {

    var appData=this;
    appData.Categories = ["Issue", "Support Request", "Enhancement Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.priorities = ["Low", "Normal", "High","Immediate"];
    appData.internalStatus = ["Assigned", "New", "Waiting For Feedback","Waiting for Review","Resolved","Closed"];
    appData.users ={};
    //appData.issueData.assignedTo = $scope.issue.issueData.assignedTo; 

   
    var arr = new Array();
    var arr1 = new Array();

    appData.getAllUsers = function (){
        User.getAllUsers().then(function (data) {
            if(data.data.success){
                
                if(data.data.permission === "admin" || data.data.permission === "moderator"){
                    appData.users =  data.data.users;
                    //console.log(appData.users);
                    appData.loading = false;
                    appData.accessDenied = false;
                    angular.forEach(appData.users, function (users) {
                        arr.push({ userName: users.userName, associateID:users.associateID});
                    });
    
                    $scope.usersList = arr; 
                   
                }else{
                    appData.errorMsg = "Insufficient Permisssion";
                    appData.loading = false;
                }
            }else{
                appData.errorMsg = data.data.message;
                appData.loading = false;
            }
        });

    }
        

    appData.getTicketSummaryByInternalStatus = function(){
        Issue.getTicketSummaryByInternalStatus().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
           // console.log(appData.TicketSummary);
            appData.ticketData = [];
            
            for(i=0;i<appData.TicketSummary.length;i++){
                var singleTicketData = [];
                singleTicketData.newCount = 0;
                singleTicketData.assignedCount = 0;
                singleTicketData.confirmedCount = 0;
                singleTicketData.feedbackCount = 0;
                singleTicketData.resolvedCount = 0;
                singleTicketData.closedCount = 0;
                singleTicketData.id = appData.TicketSummary[i]._id;
                //console.log(appData.users);
                for(k=0;k<appData.users.length;k++){
                if(appData.TicketSummary[i]._id == appData.users[k].associateID){
                    singleTicketData.userName = appData.users[k].userName;
                }
                }
                for(j=0;j<appData.TicketSummary[i].statuses.length;j++){
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="New"){
                       singleTicketData.newCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Assigned"){
                            singleTicketData.assignedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Waiting for Review"){
                            singleTicketData.confirmedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Waiting For Feedback"){
                            singleTicketData.feedbackCount = appData.TicketSummary[i].statuses[j].count;
                    }
                     if(appData.TicketSummary[i].statuses[j].internalStatus=="Resolved"){
                            singleTicketData.resolvedCount = appData.TicketSummary[i].statuses[j].count;
                    } if(appData.TicketSummary[i].statuses[j].internalStatus=="Closed"){
                            singleTicketData.closedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                }
               appData.ticketData.push(singleTicketData);
            }           
            //console.log( appData.ticketData);
        });  
    };


    appData.getTicketSummaryByMantisStatus = function(){
        Issue.getTicketSummaryByMantisStatus().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
           // console.log(appData.TicketSummary);
            appData.ticketDataMantis = [];
            
            for(i=0;i<appData.TicketSummary.length;i++){
                var singleTicketData = [];
                singleTicketData.newCount = 0;
                singleTicketData.assignedCount = 0;
                singleTicketData.confirmedCount = 0;
                singleTicketData.feedbackCount = 0;
                singleTicketData.resolvedCount = 0;
                singleTicketData.closedCount = 0;
                singleTicketData.id = appData.TicketSummary[i]._id;
                //console.log(appData.users);
                for(k=0;k<appData.users.length;k++){
                if(appData.TicketSummary[i]._id == appData.users[k].associateID){
                    singleTicketData.userName = appData.users[k].userName;
                }
                }
                for(j=0;j<appData.TicketSummary[i].statuses.length;j++){
                    if(appData.TicketSummary[i].statuses[j].mantisStatus=="New"){
                       singleTicketData.newCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].mantisStatus=="Assigned"){
                            singleTicketData.assignedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].mantisStatus=="Confirmed"){
                            singleTicketData.confirmedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].mantisStatus=="Feedback"){
                            singleTicketData.feedbackCount = appData.TicketSummary[i].statuses[j].count;
                    }
                     if(appData.TicketSummary[i].statuses[j].mantisStatus=="Resolved"){
                            singleTicketData.resolvedCount = appData.TicketSummary[i].statuses[j].count;
                    } if(appData.TicketSummary[i].statuses[j].mantisStatus=="Closed"){
                            singleTicketData.closedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    
                }
               appData.ticketDataMantis.push(singleTicketData);
            }           
           // console.log(appData.ticketData);
        });  
    };

    appData.getTicketSummaryByInternalCategory = function(){
        Issue.getTicketSummaryByInternalCategory().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
           // console.log(appData.TicketSummary);
            appData.internalCategoryticketData = [];
            
            for(i=0;i<appData.TicketSummary.length;i++){
                var singleTicketData = [];
                singleTicketData.issue = 0;
                singleTicketData.supportRequest = 0;
                singleTicketData.enhancementRequest = 0;
                singleTicketData.id = appData.TicketSummary[i]._id;
                //console.log(appData.users);
                for(k=0;k<appData.users.length;k++){
                if(appData.TicketSummary[i]._id == appData.users[k].associateID){
                    singleTicketData.userName = appData.users[k].userName;
                }
                }
                for(j=0;j<appData.TicketSummary[i].categories.length;j++){
                    if(appData.TicketSummary[i].categories[j].internalCategory=="Issue"){
                       singleTicketData.issue = appData.TicketSummary[i].categories[j].count;
                    }
                    if(appData.TicketSummary[i].categories[j].internalCategory=="Support Request"){
                            singleTicketData.supportRequest = appData.TicketSummary[i].categories[j].count;
                    }
                    if(appData.TicketSummary[i].categories[j].internalCategory== "Enhancement Request"){
                            singleTicketData.enhancementRequest = appData.TicketSummary[i].categories[j].count;
                    }
                }
               appData.internalCategoryticketData.push(singleTicketData);
            }           
            //console.log( appData.internalCategoryticketData);
        });  
    };

    appData.getTicketSummaryByMantisCategory = function(){
        Issue.getTicketSummaryByMantisCategory().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
           // console.log(appData.TicketSummary);
            appData.mantisCategoryticketData = [];
            
            for(i=0;i<appData.TicketSummary.length;i++){
                var singleTicketData = [];
                singleTicketData.issue = 0;
                singleTicketData.supportRequest = 0;
                singleTicketData.enhancementRequest = 0;
                singleTicketData.id = appData.TicketSummary[i]._id;
                //console.log(appData.users);
                for(k=0;k<appData.users.length;k++){
                if(appData.TicketSummary[i]._id == appData.users[k].associateID){
                    singleTicketData.userName = appData.users[k].userName;
                }
                }
                for(j=0;j<appData.TicketSummary[i].categories.length;j++){
                    if(appData.TicketSummary[i].categories[j].mantisCategory=="Issue"){
                       singleTicketData.issue = appData.TicketSummary[i].categories[j].count;
                    }
                    if(appData.TicketSummary[i].categories[j].mantisCategory=="Support Request"){
                            singleTicketData.supportRequest = appData.TicketSummary[i].categories[j].count;
                    }
                    if(appData.TicketSummary[i].categories[j].mantisCategory== "Enhancement Request"){
                            singleTicketData.enhancementRequest = appData.TicketSummary[i].categories[j].count;
                    }
                }
               appData.mantisCategoryticketData.push(singleTicketData);
            }           
            //console.log( appData.mantisCategoryticketData);
        });  
    };

    appData.getTicketSummaryByModule = function(){
        Issue.getTicketSummaryByModule().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
           console.log(appData.TicketSummary);
            appData.modulewiseticketData = [];
            appData.assingeeList = [];
            appData.moduleList = [];
            appData.countModuleWise = [];
            //console.log(appData.assingeeList);
            
            for(i=0;i<appData.TicketSummary.length;i++){
                   if ((appData.moduleList.indexOf(appData.TicketSummary[i]._id))<0){
                    appData.moduleList.push(appData.TicketSummary[i]._id);    
                }
            }

            appData.moduleList.sort();
            
            for(i=0;i<appData.TicketSummary.length;i++){
                var singleTicketData = [];
                singleTicketData.newCount = 0;
                singleTicketData.assignedCount = 0;
                singleTicketData.confirmedCount = 0;
                singleTicketData.feedbackCount = 0;
                singleTicketData.resolvedCount = 0;
                singleTicketData.closedCount = 0;
                singleTicketData.id = appData.TicketSummary[i]._id;
                //console.log(appData.users);
                for(j=0;j<appData.TicketSummary[i].statuses.length;j++){
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="New"){
                       singleTicketData.newCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Assigned"){
                            singleTicketData.assignedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Waiting for Review"){
                            singleTicketData.confirmedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                    if(appData.TicketSummary[i].statuses[j].internalStatus=="Waiting For Feedback"){
                            singleTicketData.feedbackCount = appData.TicketSummary[i].statuses[j].count;
                    }
                     if(appData.TicketSummary[i].statuses[j].internalStatus=="Resolved"){
                            singleTicketData.resolvedCount = appData.TicketSummary[i].statuses[j].count;
                    } if(appData.TicketSummary[i].statuses[j].internalStatus=="Closed"){
                            singleTicketData.closedCount = appData.TicketSummary[i].statuses[j].count;
                    }
                }
               appData.modulewiseticketData.push(singleTicketData);
            }       
           
        });        
    };


    appData.getAllUsers();
    appData.getTicketSummaryByInternalStatus();
    appData.getTicketSummaryByMantisStatus();
    appData.getTicketSummaryByInternalCategory();
    appData.getTicketSummaryByMantisCategory();
    appData.getTicketSummaryByModule();
    /* For md-autocomplete */
    appData.repos = arr;
    /* For md-autocomplete */

    appData.commentData = {};

    appData.createIssue = function(issueData,valid){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
        appData.newModuleMsg= false;
        if(valid){
            if(!appData.issueData.module){
                appData.issueData.module = appData.searchTextModule;
                appData.newModuleMsg= true;
            }
            Issue.create(appData.issueData).then(function(data){  
                if(data.data.success){
                    appData.commentData.mantisIssueID =  appData.issueData.mantisIssueID;
                    appData.commentData.assign = appData.issueData.assingedTo;
                    appData.commentData.commentText = "Ticket with ID "+appData.commentData.mantisIssueID+" has been assigned to "+appData.commentData.assign.associateID;
                    Comment.create(appData.commentData).then(function(data){  
                    });
                    appData.loading=false;
                    appData.getTicketSummaryByInternalStatus();
                    appData.getTicketSummaryByMantisStatus();
                    appData.getTicketSummaryByMantisStatus();
                    appData.getTicketSummaryByMantisStatus();
                    appData.getTicketSummaryByInternalCategory();
                    appData.getTicketSummaryByMantisCategory();
                    appData.getTicketSummaryByModule();
                    appData.successMsg = data.data.message;
                    appData.field = data.data.field;
                }else{
                    appData.loading=false;
                    appData.newModuleMsg= false;
                    appData.errorMsg = data.data.message;
                }
            });
        }else{
            appData.loading=false;
        }
        if(appData.newModuleMsg== true){
            $timeout(function(){
                appData.newModuleMsg=false;
            },2500)
        }
    };

    appData.resetForm = function(){
        appData.issueData ={};
    };
	
	appData.getTickets = function(){
        Issue.getAllTickets().then(function(data){
            //console.log(data);
            appData.tickets =  data.data.tickets;                        
            $scope.tickets = data.data.tickets;
            $scope.current_grid = 1;
            $scope.data_limit = 10;
            $scope.filter_data = appData.tickets.length;
            $scope.entire_user = appData.tickets.length;
        });  
    };
    appData.getTickets();

    $scope.sort = function(keyname){
        //console.log(keyname);
        $scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
    



   
  

   
    

  
    

    
});
