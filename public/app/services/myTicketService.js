
var app=angular.module('myTicketService',['ui.bootstrap','datatables','ngMaterial', 'ngMessages'])

app.factory('Ticket',function($http){
    ticketFactory = {};

    ticketFactory.getAllTickets = function(){
        return  $http.get('/api/myTickets');
   };

     return ticketFactory;
});


