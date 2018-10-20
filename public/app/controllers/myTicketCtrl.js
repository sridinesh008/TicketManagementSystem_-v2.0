var app = angular.module('myTicketsController',['myTicketService'])

app.controller('myTicketsCtrl', function ($http,$location,$timeout,Ticket,$scope,Issue,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$compile,$mdDialog ) {

    var appData=this;

    appData.getTickets = function(){
        Ticket.getAllTickets().then(function(data){
            console.log(data);
            appData.tickets =  data.data.tickets;
            //$scope.tickets = data.data.tickets;
        });  
    };

    appData.getTickets();

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