var app = angular.module('resolutionRepo',['resolutionService'])

app.controller('resolutionRepo', function ($http,$location,$timeout,Resolution) {
    var appData=this;
    appData.resolutionData = {};
    appData.resolutionDataSet = {};

    appData.addResolution = function(resolutionData,valid){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
        if(valid){
            //console.log(appData.resolutionData);
            Resolution.add(appData.resolutionData).then(function(data){  
                if(data.data.success){
                    appData.loading=false;
                    appData.successMsg = data.data.message; 
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            });
        }else{
            appData.loading=false;
        }
    }; 

    appData.getallResolutions = function(){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
      
            //console.log(appData.resolutionData);
            Resolution.getallResolutions().then(function(data){  
                if(data.data.success){
                    appData.loading=false;
                    appData.successMsg = data.data.message;
                    appData.resolutionDataSet = data.data.resolutions;
                    console.log(appData.resolutionDataSet);
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            });
    }; 

    appData.reset = function(resolutionData,valid){
        appData.resolutionData = {};
    };

    appData.getallResolutions();
});

