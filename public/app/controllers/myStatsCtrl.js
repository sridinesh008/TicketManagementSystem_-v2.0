var app = angular.module('myStatsCtrl',['issueServices'])

app.controller('myStatsCtrl', function ($http,Issue,$scope,User,Comment,$timeout) {

    var appData=this;
     appData.users ={};
    var arr = new Array();
        
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

    appData.myStatsByInternalStatusForChart = function(chartType){
        Issue.myStatsByInternalStatusForChart().then(function(data){
            var chartID = "internalStatus";
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByModuleForChart = function(chartType){
        Issue.myStatsByModuleForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "module";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByModuleForChartOnlyOpen = function(chartType){
        Issue.myStatsByModuleForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            console.log(appData.TicketSummary);
            
            var chartID = "moduleOnlyOpen";           
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByMantisStatusForChart = function(chartType){
        Issue.myStatsByMantisStatusForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisStatus";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByInternalCategoryForChart = function(chartType){
        Issue.myStatsByInternalCategoryForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "internalCategory";      
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByMantisCategoryForChart = function(chartType){
        Issue.myStatsByMantisCategoryForChart().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisCategory";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByInternalCategoryForChartOnlyOpen = function(chartType){
        Issue.myStatsByInternalCategoryForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "internalCategoryOnlyOpen";      
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    appData.myStatsByMantisCategoryForChartOnlyOpen = function(chartType){
        Issue.myStatsByMantisCategoryForChartOnlyOpen().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            var chartID = "mantisCategoryOnlyOpen";        
            labelData = appData.lebelDataGenerator(data);
            actualData = appData.actualDataGenerator(data);
            appData.renderChart(labelData,actualData,chartType,chartID);
        });  
    };

    var showLoaderModal = function () {
        $("#myModal2").modal({backdrop: "static"});
    }
    var hideModal =  function(){
		$("#myModal2").modal("hide");
    }
    
    appData.loadThePage = function (){
    showLoaderModal();   
    appData.myStatsByInternalStatusForChart("bar");
    appData.myStatsByMantisStatusForChart("bar");
    appData.myStatsByInternalCategoryForChart("horizontalBar");
    appData.myStatsByMantisCategoryForChart("horizontalBar");
    appData.myStatsByInternalCategoryForChartOnlyOpen("horizontalBar");
    appData.myStatsByMantisCategoryForChartOnlyOpen("horizontalBar");
    appData.myStatsByModuleForChart("pie");
    appData.myStatsByModuleForChartOnlyOpen("pie");
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