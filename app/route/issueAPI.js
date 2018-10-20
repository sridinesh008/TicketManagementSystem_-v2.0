var User     = require('../models/user');
var Issue     = require('../models/issue');
var Comment     = require('../models/comments');
var jwt      = require('jsonwebtoken');
var secret   = 'tic@M@n@geR';
var moment = require('moment');

module.exports = function(router) {
        // Middleware which will check the users session
	router.use(function (req,res,next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			// verify a token symmetric
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.json({success:false,message:'Invalid token. Do login again!'});
				}else{
					req.decoded = decoded;
					next();
				}
			});

		}
		else{
			res.json({success:false,message:'No Token Provided'});
		}
	});


    router.post('/createIssue',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
               if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                    res.json({success:false,message:"Insufficient Permission"});
               }else{
                    var issue = new Issue();
                    issue.mantisIssueID =  req.body.mantisIssueID;
                    issue.mantisStatus = req.body.mantisStatus;
                    issue.mantisCategory = req.body.mantisCategory;
                    issue.mantisPriority = req.body.mantisPriority;
                    issue.internalStatus = req.body.internalStatus;
                    issue.internalCategory = req.body.internalCategory;
                    issue.internalPriority = req.body.internalPriority;
                    issue.module = req.body.module;
                    issue.assingedTo = req.body.assingedTo.associateID;
                    issue.createdDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
                    issue.updatedDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
                    issue.mantisTicketSummary = req.body.mantisTicketSummary;

                    if(issue.mantisIssueID==null || issue.mantisIssueID==""|| issue.mantisStatus==null || issue.mantisStatus=="" || issue.mantisCategory ==null || issue.mantisCategory =="" ||issue.mantisPriority ==null || issue.mantisPriority==""){
                            if(issue.internalStatus==null || issue.internalStatus==""|| issue.internalCategory==null || issue.internalCategory =="" || issue.internalPriority ==null || issue.internalPriority =="" || issue.module ==null || issue.module =="" ||issue.assingedTo == "" ||issue.assingedTo == null||issue.ticketSummary == "" ||issue.ticketSummary == null){
                                res.json({success:false,message:"Please Ensure all fields are filled with valid Data"});
                                console.log("Please Ensure all fields are filled with valid Data");
                                
                            }
                    }else{
                    issue.save(function (err) {

                        if(err){
                            if(err.errors!=null){
                                console.log(err);
                                
                            if(err.errors.mantisIssueID){
                                res.json({success:false,message:err.errors.mantisIssueID.message,field:"mantisIssueID"});
                            }else if(err.errors.mantisStatus){
                                res.json({success:false,message:err.errors.mantisStatus.message,field:"mantisStatus"});
                            }else if(err.errors.mantisCategory){
                                res.json({success:false,message:err.errors.mantisCategory.message,field:"mantisCategory"});
                            }else if(err.errors.mantisPriority){
                                res.json({success:false,message:err.errors.mantisPriority.message,field:"mantisPriority"});
                            }else if(err.errors.internalStatus){
                                res.json({success:false,message:err.errors.internalStatus.message,field:"internalStatus"});
                            }else if(err.errors.internalCategory){
                                res.json({success:false,message:err.errors.internalCategory.message,field:"internalCategory"});
                            }else if(err.errors.internalPriority){
                                res.json({success:false,message:err.errors.internalPriority.message,field:"internalPriority"});
                            }else if(err.errors.module){
                                res.json({success:false,message:err.errors.module.message,field:"module"});
                            }else if(err.errors.assingedTo){
                                res.json({success:false,message:err.errors.assingedTo.message,field:"assingedTo"});
                            }else if(err.errors.mantisTicketSummary){
                                res.json({success:false,message:err.errors.mantisTicketSummary.message,field:"mantisTicketSummary"});
                            }else{
                                res.json({success:false,message:err});
                            }
                        }else if(err){
                            if(err.code == 11000){
                                    res.json({success:false,message:"Ticket ID already exists."});
                                }
                            }else{
                                res.json({success:false,message:err});
                            }
                        }else{
                                res.json({success:true,message:"Ticket has been added successfully"});
                        }
                        }); 
                    }
               }
            }
        });
    });

    router.get('/addAnIssue',function (req,res) {
    
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                    Issue.find({"active":"1"}).select("_id mantisIssueID mantisStatus mantisCategory mantisPriority internalStatus createdDate upDatedDate internalCategory  internalPriority  module assingedTo").exec(function (err,tickets) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        res.json({success:true,tickets:tickets});
                    }
                    });
        }
    });
    });


    router.get('/myTickets',function (req,res) {
            Issue.find({"active":"1","assingedTo":req.decoded.associateID}).select("_id mantisIssueID mantisStatus mantisCategory mantisPriority internalStatus createdDate upDatedDate internalCategory  internalPriority  module assingedTo").exec(function (err,tickets) {
                if(err){
                    res.json({success:false,message:err});
                }else{
                    res.json({success:true,tickets:tickets});
                }
            });
    });

    router.get('/editTickets/:mantisIssueID',function (req,res) {
        var userToBeEdited =  req.params.mantisIssueID;
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                        }else{
                            Issue.findOne({_id: userToBeEdited}).select().exec(function(err, user){
                                    if(err){
                                        res.json({success:false,message:err});
                                    }else{
                                        res.json({success:true ,user:user});                                
                                    }
                                });
                    }           
        });
    });

    router.get('/getAllComments/:id',function (req,res) {
        var userToBeEdited =  req.params.id;
        console.log(userToBeEdited);
        
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                        }else{
                        if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                                res.json({success:false,message:"Insufficient Permission"});
                        }else{
                            Comment.find({mantisIssueID:userToBeEdited}).select().exec(function(err, comments){
                                if(err){
                                    res.json({success:false,message:err});
                                }else{
                                    res.json({success:true ,comments:comments});                                
                                }
                            });
                        }
                    }           
        });
    });

    router.put('/editTickets',function (req,res) {
        var userToBeEdited =  req.body._id;
        newMantisIssueID = req.body.mantisIssueID;
        newMantisStatus = req.body.mantisStatus;
        newMantisCategory = req.body.mantisCategory;
        newMantisPriority = req.body.mantisPriority;
        newInternalStatus = req.body.internalStatus;
        newInternalCategory = req.body.internalCategory;
        newInternalPriority = req.body.internalPriority;
        newModule = req.body.module;
        newUpdatedDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
        newMantisTicketSummary = req.body.mantisTicketSummary;
        console.log(req.body.mantisTicketSummary+"Summary");
        if(typeof req.body.assingedTo==="string"){
            newAssingedTo = req.body.assingedTo;    
        }else{
            newAssingedTo = req.body.assingedTo.associateID;
        }
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                            Issue.update({ _id: userToBeEdited }, { $set: { mantisIssueID: newMantisIssueID,mantisStatus:newMantisStatus,mantisCategory:newMantisCategory,mantisPriority:newMantisPriority,internalStatus:newInternalStatus,internalCategory:newInternalCategory,internalPriority:newInternalPriority,module:newModule,assingedTo:newAssingedTo,updatedDate:newUpdatedDate,mantisTicketSummary:newMantisTicketSummary}}, function (err) {
                                if(err){
                                    console.log(err);
                                }else{
                                    res.json({success:true,message:"User's name updated successfully"});
                                }
                            })
                    }         
        });
    });


    router.put('/deleteTicket',function (req,res) {
        console.log(req.body+"reqdeleteTicket");
        //console.log(res+"res");
        var userToBeEdited =  req.body.id;
        var activeStatus = req.body.active;
        var newUpdatedDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
        console.log(userToBeEdited+"user");
        console.log(activeStatus+"user");
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                       if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                            res.json({success:false,message:"Insufficient Permission"});
                       }else{
                           console.log("permission granted");

                            Issue.update({ mantisIssueID: userToBeEdited }, { $set: { active: activeStatus,updatedDate:newUpdatedDate}}, function (err) {
                                if(err){
                                    console.log(err);
                                }else{
                                    res.json({success:true,message:"Deleted Records successfully"});
                                }
                            })
                       }
                    }         
        });
    });
	
	/* Dinesh Changes  */
	
	router.get('/getTicketSummaryByInternalStatus',function (req,res) {
    
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                Issue.aggregate([
                    {$match:{'active':"1"}},
                    { "$group": {
                        "_id": {
                            "assingedTo": "$assingedTo",
                            "internalStatus": "$internalStatus"
                        },
                        "statusCount": { "$sum": 1 }
                    }},
                    { "$group": {
                        "_id": "$_id.assingedTo",
                        "statuses": { 
                            "$push": { 
                                "internalStatus": "$_id.internalStatus",
                                "count": "$statusCount"
                            },
                        },
                    }},{ $sort : { _id : 1 } }
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                   
                        res.json({success:true,TicketSummary:TicketSummary});
                    
                    }
                });
        }
    });
    });

    router.get('/getTicketSummaryByMantisStatus',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                Issue.aggregate([
                    {$match:{'active':"1"}},
                    { "$group": {
                        "_id": {
                            "assingedTo": "$assingedTo",
                            "mantisStatus": "$mantisStatus"
                        },
                        "statusCount": { "$sum": 1 }
                    }},
                    { "$group": {
                        "_id": "$_id.assingedTo",
                        "statuses": { 
                            "$push": { 
                                "mantisStatus": "$_id.mantisStatus",
                                "count": "$statusCount"
                            },
                        },
                    }},{ $sort : { _id : 1 } }
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        res.json({success:true,TicketSummary:TicketSummary});
                        //console.log(TicketSummary);
                    }
                });
        }
    });
    });

    router.get('/getTicketSummaryByInternalCategory',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                Issue.aggregate([
                    { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}},
                    { "$group": {
                        "_id": {
                            "assingedTo": "$assingedTo",
                            "internalCategory": "$internalCategory"
                        },
                        "Count": { "$sum": 1 }
                    }},
                    { "$group": {
                        "_id": "$_id.assingedTo",
                        "categories": { 
                            "$push": { 
                                "internalCategory": "$_id.internalCategory",
                                "count": "$Count"
                            },
                        },
                    }},{ $sort : { _id : 1 } }
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        res.json({success:true,TicketSummary:TicketSummary});
                    }
                });
        }
    });
    });

    router.get('/getTicketSummaryByMantisCategory',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                Issue.aggregate([
                    { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}}, 
                    { "$group": {
                        "_id": {
                            "assingedTo": "$assingedTo",
                            "mantisCategory": "$mantisCategory"
                        },
                        "Count": { "$sum": 1 }
                    }},
                    { "$group": {
                        "_id": "$_id.assingedTo",
                        "categories": { 
                            "$push": { 
                                "mantisCategory": "$_id.mantisCategory",
                                "count": "$Count"
                            },
                        },
                    }},{ $sort : { _id : 1 } }
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        res.json({success:true,TicketSummary:TicketSummary});
                    }
                });
        }
    });
    });
   

    router.get('/getTicketSummaryByModule',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
                Issue.aggregate([
                    { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}}, 
                    { "$group": {
                        "_id": {
                            "module": "$module",
                            "internalStatus": "$internalStatus"
                        },
                        "Count": { "$sum": 1 }
                    }},
                    { "$group": {
                        "_id": "$_id.module",
                        "statuses": { 
                            "$push": { 
                                "internalStatus": "$_id.internalStatus",
                                "count": "$Count"
                            },
                        },
                    }},{ $sort : { _id : 1 } }
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                        res.json({success:true,TicketSummary:TicketSummary});
                    }
                });
        }
    });
    });

	/* Dinesh Changes  */
    /*chart APIs*/
    router.get('/getTicketSummaryByInternalStatusForChart',function (req,res) {
                Issue.aggregate([
                    {$match:{'active':"1"}},
                    { "$group": {
                        "_id":  "$internalStatus",
                        "statusCount": { "$sum": 1 }
                    }},{$sort:{_id:1}}
                ]).exec(function (err,TicketSummary) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{                 
                        res.json({success:true,TicketSummary:TicketSummary});
                    }
                });
    });

    router.get('/getTicketSummaryByMantisStatusForChart',function (req,res) {
        Issue.aggregate([
            {$match:{'active':"1"}},
            { "$group": {
                "_id":  "$mantisStatus",
                "statusCount": { "$sum": 1 }
            }},{$sort:{_id:1}}
        ]).exec(function (err,TicketSummary) {
            if(err){
                res.json({success:false,message:err});
            }else{                 
                res.json({success:true,TicketSummary:TicketSummary});
            }
        });
});

router.get('/getTicketSummaryByInternalCategoryForChart',function (req,res) {
    Issue.aggregate([
        {$match:{'active':"1"}},
        { "$group": {
            "_id":  "$internalCategory",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByMantisCategoryForChart',function (req,res) {
    Issue.aggregate([
        {$match:{'active':"1"}},
        { "$group": {
            "_id":  "$mantisCategory",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByAssigneeForChart',function (req,res) {
    Issue.aggregate([
        {$match:{'active':"1"}},
        { "$group": {
            "_id":  "$assingedTo",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByModuleForChart',function (req,res) {
    Issue.aggregate([
        {$match:{'active':"1"}},
        { "$group": {
            "_id":  "$module",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});


router.get('/getTicketSummaryByModuleForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}},
        { "$group": {
            "_id":  "$module",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByInternalCategoryForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}},
        { "$group": {
            "_id":  "$internalCategory",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByMantisCategoryForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}},
        { "$group": {
            "_id":  "$mantisCategory",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/getTicketSummaryByAssigneeForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}]}},
        { "$group": {
            "_id":  "$assingedTo",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/myStatsByInternalStatusForChart',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"}, {assingedTo:req.decoded.associateID }]}},
        { "$group": {
            "_id":  "$internalStatus",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});

router.get('/myStatsByMantisStatusForChart',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"}, {assingedTo:req.decoded.associateID }]}},
        { "$group": {
            "_id":  "$mantisStatus",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
        ]).exec(function (err,TicketSummary) {
            if(err){
                res.json({success:false,message:err});
            }else{                 
                res.json({success:true,TicketSummary:TicketSummary});
            }
    });
});

router.get('/myStatsByInternalCategoryForChart',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"}, {assingedTo:req.decoded.associateID }]}},
        { "$group": {
        "_id":  "$internalCategory",
        "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
        ]).exec(function (err,TicketSummary) {
            if(err){
            res.json({success:false,message:err});
            }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
            }
    });
});

router.get('/myStatsByMantisCategoryForChart',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"}, {assingedTo:req.decoded.associateID }]}},
            { "$group": {
            "_id":  "$mantisCategory",
            "statusCount": { "$sum": 1 }
            }},{$sort:{_id:1}}
                ]).exec(function (err,TicketSummary) {
                if(err){
                res.json({success:false,message:err});
                }else{                 
                res.json({success:true,TicketSummary:TicketSummary});
                }
    });
});


router.get('/myStatsByInternalCategoryForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match: { $and : [{"active":"1"}, { internalStatus: { $nin: ['Resolved','Closed'] } }, { assingedTo :  req.decoded.associateID  } ] } },
        { "$group": {
        "_id":  "$internalCategory",
        "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
        ]).exec(function (err,TicketSummary) {
            if(err){
            res.json({success:false,message:err});
            }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
            }
    });
});

router.get('/myStatsByMantisCategoryForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match: { $and : [ {"active":"1"},{ internalStatus: { $nin: ['Resolved','Closed'] } }, { assingedTo :  req.decoded.associateID  } ] } },
            { "$group": {
                "_id":  "$mantisCategory",
                "statusCount": { "$sum": 1 }
                }},{$sort:{_id:1}}
                ]).exec(function (err,TicketSummary) {
                    if(err){
                    res.json({success:false,message:err});
                    }else{                 
                    res.json({success:true,TicketSummary:TicketSummary});
            }
        });
});

router.get('/myStatsByModuleForChart',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"}, { assingedTo :  req.decoded.associateID  }]}},
        { "$group": {
            "_id":  "$module",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});


router.get('/myStatsByModuleForChartOnlyOpen',function (req,res) {
    Issue.aggregate([
        { $match:{ $and : [{"active":"1"},{ internalStatus : {$nin:['Resolved','Closed']}}, { assingedTo :  req.decoded.associateID  }]}},
        { "$group": {
            "_id":  "$module",
            "statusCount": { "$sum": 1 }
        }},{$sort:{_id:1}}
    ]).exec(function (err,TicketSummary) {
        if(err){
            res.json({success:false,message:err});
        }else{                 
            res.json({success:true,TicketSummary:TicketSummary});
        }
    });
});


router.post('/filterSearch',function (req,res) {
    //console.log(req.body.selectedInternalStatusChip+"This is res");
    var selectedInternalStatusChip = req.body.selectedInternalStatusChip;
    var selectedMantisStatusChip = req.body.selectedMantisStatusChip;
    var selectedExternalCategoryChip = req.body.selectedExternalCategoryChip;
    var selectedInternalCategoryChip = req.body.selectedInternalCategoryChip;
    var selectedExternalPriorityChip = req.body.selectedExternalPriorityChip;
    var selectedInternalPriorityChip = req.body.selectedInternalPriorityChip;
    var moduleChip = req.body.moduleChip;
    var assignToChip = req.body.assignToChip;
    //console.log(selectedMantisStatusChip);
    //console.log(selectedInternalStatusChip);
    //console.log(selectedExternalCategoryChip);
    //console.log(selectedInternalCategoryChip);
    //console.log(selectedExternalPriorityChip);
    //console.log(selectedInternalPriorityChip);
    //console.log(moduleChip);
    //console.log(assignToChip);
    
    Issue.find(
        {$and : [{"active":"1"},{ internalStatus: { $in: selectedInternalStatusChip  } },{ mantisStatus :  { $in: selectedMantisStatusChip }  },{ mantisCategory :  { $in: selectedExternalCategoryChip }  },{ internalCategory :  { $in: selectedInternalCategoryChip }  },{ mantisPriority :  { $in: selectedExternalPriorityChip }  },{ internalPriority :  { $in: selectedInternalPriorityChip }  },{ module :  { $in: moduleChip }  },{ assingedTo :  { $in: assignToChip }  } ] }).select().exec(function (err,searchResult) {
            if(err){
            res.json({success:false,message:err});
            console.log(err);
            }else{ 
                console.log(searchResult+"result");      
                 res.json({success:true,searchResult:searchResult});
            }
    });
});

    return router;
}