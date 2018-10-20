var app = angular.module('dashBoardCtrl',['issueServices'])

app.controller('dashBoardCtrl', function ($http,Issue,$scope,User,Comment,$timeout) {

    var appData=this;
    /*appData.Categories = ["Issue", "Support Request", "Enhancement Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.priorities = ["Low", "Normal", "High","Immediate"];
    appData.internalStatus = ["Assigned", "Confirmed", "Waiting For Feedback","Resolved","Closed"];*/
    appData.users ={};
    var arr = new Array();
    //$scope.heading = "Dash Board";

    appData.getAllUsers = function (){
        User.getAllUsers().then(function (data) {
            if(data.data.success){
                
                if(data.data.permission === "admin" || data.data.permission === "moderator"){
                    appData.users =  data.data.users;
                    //console.log(appData.users);
                    appData.loading = false;
                    appData.accessDenied = false;
                    angular.forEach(appData.users, function (users) {
                        arr.push({ userName: users.associateID+" - "+users.userName});
                    });
                    console.log(arr);
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
        
    appData.lebelDataGenerator = function(data){
        appData.TicketSummary =  data.data.TicketSummary;
            var labelData = [];
                for(i=0;i<appData.TicketSummary.length;i++){
                    labelData.push(appData.TicketSummary[i]._id);
                }
        return (labelData);
    }

    appData.actualDataGenerator = function(data){
        appData.TicketSummary =  data.data.TicketSummary;        
            var actualData = [];
                for(i=0;i<appData.TicketSummary.length;i++){
                    actualData.push(appData.TicketSummary[i].statusCount);
                }
        return (actualData);
    }

    appData.getTicketSummaryByInternalStatusForChart = function(chartType){
        //console.log(chartType);
        Issue.getTicketSummaryByInternalStatusForChart().then(function(data){
            var chartID = "internalStatus";
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };


    appData.getTicketSummaryByMantisStatusForChart = function(chartType){
        Issue.getTicketSummaryByMantisStatusForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisStatus";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.getTicketSummaryByAssigneeForChart = function(chartType){
        Issue.getTicketSummaryByAssigneeForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "assignee";           
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };


    appData.getTicketSummaryByInternalCategoryForChart = function(chartType){
        Issue.getTicketSummaryByInternalCategoryForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "internalCategory";      
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.getTicketSummaryByMantisCategoryForChart = function(chartType){
        Issue.getTicketSummaryByMantisCategoryForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisCategory";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.getTicketSummaryByModuleForChart = function(chartType){
        Issue.getTicketSummaryByModuleForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "module";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.getTicketSummaryByModuleForChartOnlyOpen = function(chartType){
        Issue.getTicketSummaryByModuleForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "moduleOnlyOpen";           
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };
    appData.getTicketSummaryByAssigneeForChartOnlyOpen = function(chartType){
        Issue.getTicketSummaryByAssigneeForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "assigneeOnlyOpen";           
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };


    appData.getTicketSummaryByInternalCategoryForChartOnlyOpen = function(chartType){
        Issue.getTicketSummaryByInternalCategoryForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "internalCategoryOnlyOpen";      
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.getTicketSummaryByMantisCategoryForChartOnlyOpen = function(chartType){
        Issue.getTicketSummaryByMantisCategoryForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisCategoryOnlyOpen";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    var showLoaderModal = function () {
        $("#myModal1").modal({backdrop: "static"});
    }
    var hideModal =  function(){
		$("#myModal1").modal("hide");
    }
    
    appData.loadThePage = function (){
    showLoaderModal();   
    appData.getAllUsers();
    appData.getTicketSummaryByInternalStatusForChart("bar");
    appData.getTicketSummaryByMantisStatusForChart("bar");
    appData.getTicketSummaryByAssigneeForChart("bar");
    appData.getTicketSummaryByModuleForChart("pie");
    appData.getTicketSummaryByModuleForChartOnlyOpen("pie");
    appData.getTicketSummaryByInternalCategoryForChart("horizontalBar");
    appData.getTicketSummaryByMantisCategoryForChart("horizontalBar");
    appData.getTicketSummaryByAssigneeForChartOnlyOpen("bar");
    appData.getTicketSummaryByInternalCategoryForChartOnlyOpen("horizontalBar");
    appData.getTicketSummaryByMantisCategoryForChartOnlyOpen("horizontalBar");
    //appData.getTicketSummaryByModule();
    $timeout(function(){
        hideModal();
    },1500)
    
    }

    appData.loadThePage();

    appData.renderChart = function (labelData,actualData,chartType,chartID){      
        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
        var ctx = document.getElementById(chartID);
        var config = {
			type: chartType,
			data: {
				datasets: [{
                    data :[],
                    backgroundColor: [],
                    borderColor:[],
					label: 'Count'
				}],
				labels:labelData
			},
			options: { 
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
            },  legend:false,
				responsive: true
			}
        };
        
        var colorNames = Object.keys(window.chartColors);
		
        var myChart = new Chart(ctx, config);


        function generateRandomColrs() {
                var newDataset = {
                backgroundColor: [],
                borderColor: [],
                data:actualData,
                labels:labelData,
                label: 'Count'
                };
            for (var index = 0; index < labelData.length; ++index) {
                var colorName = colorNames[index % colorNames.length];
                var newColor = window.chartColors[colorName];     
                newDataset.backgroundColor.push(newColor);
                newDataset.borderColor.push(newColor);
            }
            config.data.datasets[0]=newDataset;
            myChart.update();
        }
        generateRandomColrs();
    };

    
});