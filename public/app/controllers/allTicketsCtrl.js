var app = angular.module('allTicketsController',['issueServices','commentServices'])

app.controller('allTicketsCtrl', function ($http,$location,$timeout,Issue,$scope,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$compile,$mdDialog,User,Comment ) {

    var appData=this;
    appData.Categories = ["Issue", "Support Request", "Enhancement Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.priorities = ["Low", "Normal", "High","Immediate"];
    appData.internalStatus = ["Assigned", "New", "Waiting For Feedback","Waiting for Review","Resolved","Closed"];
    var arr = new Array();
    

    appData.getTickets = function(){
        Issue.getAllTickets().then(function(data){
            //console.log(data);
            appData.tickets =  data.data.tickets;
            //console.log(appData.tickets);
            //console.log(appData.tickets.length);
            $scope.tickets = data.data.tickets;
            //console.log($scope.tickets);
        });  
    };

    appData.getTicketSummaryByModule = function(){
        Issue.getTicketSummaryByModule().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            appData.moduleList = [];
            for(i=0;i<appData.TicketSummary.length;i++){
                   if ((appData.moduleList.indexOf(appData.TicketSummary[i]._id))<0){
                    appData.moduleList.push(appData.TicketSummary[i]._id);    
                }
            }
            appData.moduleList.sort();       
            console.log(appData.moduleList);
        });        
    };

    

    appData.getTickets();
    appData.getTicketSummaryByModule();

    

    appData.getAllUsers = function (){
        User.getAllUsers().then(function (data) {
            if(data.data.success){
                
                appData.users =  data.data.users;
                //console.log(appData.users);
                appData.loading = false;
                appData.accessDenied = false;
                angular.forEach(appData.users, function (users) {
                    arr.push({ userName: users.userName, associateID:users.associateID});
                });
                console.log(arr);
                $scope.usersList = arr; 
            }
        });

    }
    appData.getAllUsers();
    appData.repos = arr;
    

    $scope.vm = {};
    $scope.vm.dtInstance = {};   
    $scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
				  .withOption('paging', true)
                  .withOption('searching', true)
                  .withOption('responsive', true)
                  .withOption('info', true)
                  .withButtons([
                    {
                        extend:    'copy',
                        text:      '<i class="fa fa-files-o"></i> Copy',
                        titleAttr: 'Copy'
                    },
                    {
                        extend:    'print',
                        text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excel',
                        text:      '<i class="fa fa-file-text-o"></i> Excel',
                       titleAttr: 'Excel'
                    },
                ]
              );
    
    $scope.childInfo = function(user,event){
        //console.log(user);
        //console.log(event);
        var scope = $scope.$new(true);
        scope.user = user;
        var link = angular.element(event.currentTarget);
        //console.log(link);
        var icon = link.find('.glyphicon');
        //console.log(icon);
        var tr = link.parent().parent();
        //console.log(tr);
        var table = $scope.vm.dtInstance.DataTable;
        //var table = $('#allTicketsTable').DataTable();
        //console.log(table);
        var row = table.row(tr);

        if(row.child.isShown()){
            icon.removeClass('glyphicon-minus-sign').addClass('glyphicon-plus-sign');
            row.child.hide();
            tr.removeClass('shown');
        }else{
            icon.removeClass('glyphicon-plus-sign').addClass('glyphicon-minus-sign');
            row.child($compile('<div tmpl class="clerfix"></div>')(scope)).show();
            tr.addClass('shown');
        }	
    };

    appData.expandAll = function (expanded) {
        $scope.$broadcast('onExpandAll', {expanded: expanded});
    };
    

    $scope.sort = function(keyname){
        //console.log(keyname);
        $scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };
    
    

    this.createIssue = function(issueData,valid){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
        console.log("hai");
        if(valid){
            Issue.create(appData.issueData).then(function(data){  
                if(data.data.success){
                    appData.loading=false;
                    appData.successMsg = data.data.message;
                    appData.field = data.data.field;
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            });
        }else{
            appData.loading=false;
        }
    }

    /*Changes Done For Comments */

    $scope.showCommentDisplay = function(id){
        //console.log(id);
        Issue.getAllComments(id).then(function (data) {
            //console.log(data);
            $scope.comments = data.data.comments;
            $scope.showCommentPopup();
        });
    };

    $scope.showSearchResults = function(showData){
        resultObject = {};
        appData.associateIDData = [];
        appData.ticketData = [];
        console.log(appData.selectedMantisStatusChip);
        //for(i=0;i<appData.length;i++){
            if(appData.selectedMantisStatusChip!=""){
                resultObject.selectedMantisStatusChip = appData.selectedMantisStatusChip;
            }else{
                resultObject.selectedMantisStatusChip = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
            }

            if(appData.selectedInternalStatusChip!=""){
                resultObject.selectedInternalStatusChip = appData.selectedInternalStatusChip;
            }else{
                resultObject.selectedInternalStatusChip = ["Assigned", "New", "Waiting For Feedback","Waiting for Review","Resolved","Closed"];
            }

            if(appData.selectedExternalCategoryChip!=""){
                resultObject.selectedExternalCategoryChip = appData.selectedExternalCategoryChip;
            }else{
                resultObject.selectedExternalCategoryChip = ["Issue", "Support Request", "Enhancement Request"];
            }

            if(appData.selectedInternalCategoryChip!=""){
                resultObject.selectedInternalCategoryChip = appData.selectedInternalCategoryChip;
            }else{
                resultObject.selectedInternalCategoryChip = ["Issue", "Support Request", "Enhancement Request"];
            }

            if(appData.selectedExternalPriorityChip!=""){
                resultObject.selectedExternalPriorityChip = appData.selectedExternalPriorityChip;
            }else{
                resultObject.selectedExternalPriorityChip = ["Low", "Normal", "High","Immediate"];
            }

            if(appData.selectedInternalPriorityChip!=""){
                resultObject.selectedInternalPriorityChip = appData.selectedInternalPriorityChip;
            }else{
                resultObject.selectedInternalPriorityChip = ["Low", "Normal", "High","Immediate"];
            }

            if(appData.moduleChip!=""){
                resultObject.moduleChip = appData.moduleChip;
            }else{
                resultObject.moduleChip = appData.moduleList;
            }

            if(appData.assignToChip!=""){
                resultObject.assignToChip = appData.assignToChip;
                for(i=0;i<appData.assignToChip.length;i++){
                    //console.log(appData.assignToChip[i].associateID);
                    appData.ticketData.push(appData.assignToChip[i].associateID);
                }
                //console.log(appData.ticketData);
                resultObject.assignToChip = appData.ticketData;
            }else{
                var associateValue = appData.repos;
                for(i=0;i<associateValue.length;i++){
                    appData.associateIDData = associateValue[i].associateID;
                    //console.log(appData.associateIDData);
                    appData.ticketData.push(appData.associateIDData);
                }
                //console.log(appData.ticketData);
                resultObject.assignToChip = appData.ticketData;
            }
            
            //console.log(resultObject);
            /*resultObject.selectedExternalCategoryChip = appData.selectedExternalCategoryChip;
            resultObject.moduleChip = appData.moduleChip;
            resultObject.assignToChip = appData.assignToChip;
            resultObject.selectedInternalPriorityChip = appData.selectedInternalPriorityChip;
            resultObject.selectedExternalPriorityChip = appData.selectedExternalPriorityChip;
            resultObject.selectedInternalCategoryChip = appData.selectedInternalCategoryChip;*/
        //}
        console.log(resultObject);
        
        Issue.getSearchResults(resultObject).then(function (data) {
            console.log(data.data.searchResult);
            appData.tickets = data.data.searchResult;
        });
    }

    $scope.showCommentPopup = function(ev) {
        //console.log(ev);
        $mdDialog.show({
          controller: dialogContentController,
          controllerAs: 'dialogCtrl',
          templateUrl: 'app/views/pages/toast/commentDialog.html',
            locals: {
                dataItems: $scope.comments
            },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

      

      function dialogContentController($scope,$mdDialog, dataItems) {
        var dialogCtrl = this;
    
        dialogCtrl.comments = dataItems;

        $scope.hide = function() {
            $mdDialog.hide();
        };

      }

      /*Changes Done For Comments */

    $scope.showAdvanced = function(ev) {
        //console.log(ev);
        $mdDialog.show({
          controller: DialogController,
          //templateUrl: 'app/views/pages/toast/dialog1.tmpl.html',
          template:
            '<md-dialog class="dialog_box">' +
            '<div class="col-xs-12 nomarginpadding">'+
            '<form name="commentForm" ng-submit="deleteTickets(\''+ev+'\',commentForm.$valid);" novalidate>'+
            '<md-toolbar >' +
            'Are you sure you want to delete this ticket?'+
            '</md-toolbar>'+
            '<md-dialog-content>'+
            '<textarea type="text" placeholder="Plese enter valid Comments for deleting the ticket" class="form-control" name="comments" ng-model="commentsText"/>'+
            '<p class="has-error-block"  ng-show="(commentError||commentForm.comments.$touched && commentForm.comments.$error.required) || (commentForm.$submitted && commentForm.comments.$error.required)">This field is required.</p>'+
            '</md-dialog-content>' +
            '<button type="submit" class="btn btn-primary marginLeft clear" >Delete</button>'+
            //'<div class="md-actions"> <md-button ng-click="deleteTickets(\''+ev+'\');">'+
            //'Delete'+
            //'</md-button>'+
            '<md-button ng-click="hide()">' +
            ' Close' +
            '</md-button>' +
            '  </div>' +
            '  </form>' +
            '  </div>' +
            '</md-dialog>',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

      function DialogController($scope, $mdDialog,$routeParams,Issue,Comment) {
          
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };

        $scope.deleteTickets = function(id,valid) {
            deleteObject = {};
            appData.commentData = {};
            deleteObject.id = id;
            deleteObject.active = "0";
            console.log(deleteObject);
            
            if(valid){
                
                appData.commentData.mantisIssueID =  id;
                appData.commentData.commentText = $scope.commentsText;
                if(appData.commentData.commentText==""||appData.commentData.commentText==null){
                    $scope.commentError = true
                }else{
               
                Issue.deleteTickets(deleteObject).then(function (data) {
                    //console.log(id);
                    app.successMsg = data.data.message;
                    //console.log(data);
                    if(data.data.success){
                        //console.log(appData);
                        Comment.create(appData.commentData).then(function(data1){  
                        });
                        appData.getTickets();
                        $mdDialog.hide();
                    }else{
                        app.errorMsg = data.data.message;
                    }
                });
            }
        }
        };


      }

      appData.readonly = false;
      appData.selectedItem = null;
      appData.selectedItemInternal = null;
      appData.selectedItemExternal = null;
      appData.selectedModule = null;
      appData.selectedItemInternalPriority = null;
      appData.searchText = null;
      appData.selectedUsers = null;
      appData.selectedItemExternalPriority = null;
      appData.selectedItemInternalCategory = null;
      
      

      appData.selectedMantisStatusChip = [];
      appData.selectedInternalStatusChip = [];
      appData.selectedExternalCategoryChip = [];
      appData.moduleChip = [];
      appData.assignToChip = [];
      appData.selectedInternalPriorityChip = [];
      appData.selectedExternalPriorityChip = [];
      appData.selectedInternalCategoryChip = [];
      
      
      appData.autocompleteDemoRequireMatch = true;
      appData.autocompleteDemoRequireMatchInternal = true;
      appData.autocompleteDemoRequireMatchExternal = true;
      appData.autocompleteModule = true;
      appData.autocompleteAssignTo = true;
      appData.autocompleteInternalPriority = true;
      appData.autocompleteExternalPriority = true;
      appData.autocompleteInternalCategory = true;
      
      
      
      
      appData.transformChip = transformChip;

    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
          return chip;
        }
  
        // Otherwise, create a new one
        return chip;
      }
});

var isDlgOpen;
app.controller('editTicketCtrl',function ($scope,$routeParams,Issue,User,$mdToast,$mdDialog) {
    
    var appData=this;
    appData.Categories = ["Issue", "Support Request", "Enhancement Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.priorities = ["Low", "Normal", "High","Immediate"];
    appData.internalStatus = ["Assigned", "Confirmed", "Waiting For Feedback","Resolved","Closed"];

    var arr = new Array();

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
                    //console.log(arr);
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

    appData.getAllUsers();
    appData.repos = arr;

    Issue.editTickets($routeParams.mantisIssueID).then(function (data) {
        //console.log(data);
        if(data.data.success){
            app.currentIdVal= data.data.user._id;
            $scope.newInternalPriority = data.data.user.internalPriority;
            $scope.newInternalCategory = data.data.user.internalCategory;
            $scope.newInternalStatus = data.data.user.internalStatus;
            $scope.newMantisPriority = data.data.user.mantisPriority;
            $scope.newMantisCategory = data.data.user.mantisCategory;
            $scope.newMantisStatus = data.data.user.mantisStatus;
            $scope.newMantisIssueID = data.data.user.mantisIssueID;
            $scope.newModule = data.data.user.module;
            $scope.newAssingedTo = data.data.user.assingedTo;
            $scope.mantisTicketSummary = data.data.user.mantisTicketSummary;
            //console.log($scope.newMantisStatus);
            //app.newModule= data.data.user._id;
        }else{
            app.errorMsg = data.data.message;
        }
    });

    $scope.showCustomToast = function() {
        $mdToast.show({
          hideDelay   : 3000,
          position    : 'bottom right',
          controller  : 'ToastCtrl',
          templateUrl : 'app/views/pages/toast/toast-template.html'
        });
      };    
      

    this.updateTicketModel = function(issueData,valid,ev){
        appData.errorMsg= false;
        appData.successMsg= false;
        if(valid){
            $mdDialog.show({
                controller: updateTicketCtrl,
                //templateUrl: 'app/views/pages/toast/dialog1.tmpl.html',
                template:
                '<md-dialog class="dialog_box_update">' +
                '<md-toolbar >' +
                'Comment / Message'+
                '</md-toolbar>'+
                '<md-dialog-content>'+
                '<textarea placeholder="Plese enter Comments about the update" ng-model="commentData" type="textbox" class="form-control"/>'+
                '<p class="has-error-block"  ng-show="commentError">This field is required.</p>'+
                '</md-dialog-content>' +
                '<div class="md-actions"> <button class="btn btn-primary pull-left marginLeft" ng-click="updateTicket()">'+
                'Update'+
                '</button>'+
                '<md-button class="pull-left" ng-click="hide()">' +
                ' Close' +
                '</md-button>' +
                '  </div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                locals: {
                    mantisIssueID: $scope.newMantisIssueID,
                    mantisStatus : $scope.newMantisStatus,
                    mantisCategory : $scope.newMantisCategory,
                    mantisPriority : $scope.newMantisPriority,
                    internalStatus : $scope.newInternalStatus,
                    internalCategory : $scope.newInternalCategory,
                    internalPriority : $scope.newInternalPriority,
                    module : $scope.newModule,
                    assingedTo : $scope.newAssingedTo,
                    mantisTicketSummary : $scope.mantisTicketSummary,
                },
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }else{
            appData.loading=false;
        }
    };

    function updateTicketCtrl($scope, $mdDialog,$timeout,$routeParams,Issue,Comment,mantisIssueID,mantisStatus,mantisCategory,mantisPriority,internalStatus,internalCategory,internalPriority,module,assingedTo,mantisTicketSummary) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };

        $scope.showCustomToast = function() {
            $mdToast.show({
              hideDelay   : 3000,
              position    : 'bottom right',
              controller  : 'ToastCtrl',
              templateUrl : 'app/views/pages/toast/toast-template.html'
            });
          }; 

        var appData=this;
        appData.commentData = {};
        $scope.updateTicket = function(){
            $scope.commentError= false;
            appData.loading=true;
            appData.errorMsg= false;
            appData.successMsg= false;
            console.log("hai"+mantisIssueID);
            ticketObject ={};
            //if(valid){
                //console.log("hai new"+app.currentIdVal);
                ticketObject._id = app.currentIdVal;
                ticketObject.mantisIssueID = mantisIssueID;
                ticketObject.mantisStatus = mantisStatus;
                ticketObject.mantisCategory = mantisCategory;
                ticketObject.mantisPriority = mantisPriority;
                ticketObject.internalStatus = internalStatus;
                ticketObject.internalCategory = internalCategory;
                ticketObject.internalPriority = internalPriority;
                ticketObject.module = module;
                ticketObject.assingedTo = assingedTo;
                ticketObject.mantisTicketSummary = mantisTicketSummary;
                //console.log("hai new"+$scope.newAssingedTo);
                if($scope.commentData=="" || $scope.commentData==null) {
                        $scope.commentError= true;
                }else{

                console.log(ticketObject);
                Issue.updateTickets(ticketObject).then(function(data){  
                    console.log(data);
                    if(data.data.success){
                        console.log(data);
                        appData.loading=false;
                        appData.successMsg = data.data.message;
                        appData.field = data.data.field;
                        appData.commentData.mantisIssueID =  mantisIssueID;
                        appData.commentData.assign = assingedTo;
                        appData.commentData.commentText = $scope.commentData;
                        Comment.create(appData.commentData).then(function(data1){  
                            console.log(data1);
                        });
                        //console.log(data.data.message);
                        $scope.showCustomToast();
                        $mdDialog.hide();
                        $timeout(function(){
                                window.location.reload();
                         },1500);
                    }else{
                        appData.loading=false;
                        appData.errorMsg = data.data.message;
                    }
                });
            }
        };
      }


    $scope.checkIfEnterKeyWasPressed = function($event){
        var charCode = ($event.charCode) ? $event.which : $event.keyCode;
	         if (charCode > 31 && (charCode < 48 || charCode > 57)){
	            return false;
        }
        return true;
    };

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
           // console.log( appData.ticketData);
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

    appData.getTicketSummaryByInternalStatus();
    appData.getTicketSummaryByMantisStatus();
    appData.getTicketSummaryByMantisStatus();
    appData.getTicketSummaryByMantisStatus();
    appData.getTicketSummaryByInternalCategory();
    appData.getTicketSummaryByMantisCategory();
    appData.getTicketSummaryByModule();

    /*Changes Done For Comments */

    $scope.showCommentDisplay = function(id){
        //console.log(id);
        Issue.getAllComments(id).then(function (data) {
            //console.log(data);
            $scope.comments = data.data.comments;
            $scope.showCommentPopup();
        });
    };

    $scope.showCommentPopup = function(ev) {
        //console.log(ev);
        $mdDialog.show({
          controller: dialogContentController,
          controllerAs: 'dialogCtrl',
          templateUrl: 'app/views/pages/toast/commentDialog.html',
            locals: {
                dataItems: $scope.comments
            },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

      

      function dialogContentController($scope,$mdDialog, dataItems) {
        var dialogCtrl = this;
    
        dialogCtrl.comments = dataItems;

        $scope.hide = function() {
            $mdDialog.hide();
        };

      }

      /*Changes Done For Comments */

});


  app.controller('ToastCtrl', function($scope, $mdToast, $mdDialog) {

    $scope.closeToast = function() {
      if (isDlgOpen) return;

      $mdToast
        .hide()
        .then(function() {
          isDlgOpen = false;
        });
    };

    $scope.openMoreInfo = function(e) {
      if ( isDlgOpen ) return;
      isDlgOpen = true;

      $mdDialog
        .show($mdDialog
          .alert()
          .title('More info goes here.')
          .textContent('Something witty.')
          .ariaLabel('More info')
          .ok('Got it')
          .targetEvent(e)
        )
        .then(function() {
          isDlgOpen = false;
        });
    };
  });

