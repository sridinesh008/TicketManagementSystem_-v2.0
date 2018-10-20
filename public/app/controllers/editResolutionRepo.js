var app = angular.module('resolutionRepoCtrl',['resolutionService'])
app.controller('resolutionRepoCtrl', function ($http,$location,$timeout,Resolution,$routeParams) {
    var appData=this;
    appData.resolutionData = {};
    appData.resolutionDataSet = {};
    appData.oldResolutionData ;

    appData.updateResolution = function(resolutionData,valid){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
        if(valid){
            //console.log(appData.resolutionData);
            Resolution.updateResolution(appData.resolutionData).then(function(data){  
                if(data.data.success){
                    appData.loading=false;
                    appData.successMsg = data.data.message+"Redirecting to Resolution Repo page in few moments...";                    
                    $timeout(function(){
                        $location.path('/resolutionRepo');
                        },3000);
                }else{
                    appData.loading=false;
                    appData.errorMsgs = data.data.message;
                }
            });
        }else{
            appData.loading=false;
        }
    }; 

    appData.getResolution = function(id){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
      
            //console.log(appData.resolutionData);
            Resolution.getResolution(id).then(function(data){  
                if(data.data.success){
                    console.log(data);
                    
                    appData.loading=false;
                    appData.successMsg = data.data.message;
                    appData.resolutionData = data.data.resolution;
                    appData.oldResolutionData = appData.resolutionData ;
                    console.log(appData.resolutionData);
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            });
    }; 

    

    appData.getResolution($routeParams._id);
});
