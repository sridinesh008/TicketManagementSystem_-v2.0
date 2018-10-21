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


    router.post('/createComment',function (req,res) {           
                    var comment = new Comment();
                    
                    comment.mantisIssueID =  req.body.mantisIssueID;
                    comment.createdDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
                    comment.updatedDate = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
                    comment.createdBy = req.decoded.associateID;
                    comment.commentText = req.body.commentText;
                    
                    if(comment.mantisIssueID==null || comment.mantisIssueID==""|| comment.createdBy ==null || comment.createdBy =="" ||comment.commentText ==null || comment.commentText==""){
                                res.json({success:false,message:"Please Ensure all fields are filled with valid Data"});
                    }else{
                    comment.save(function (err) {
                        console.log(err);
                        if(err){
                                if(err.errors!=null){
                                console.log(err);     
                                if(err.errors.mantisIssueID){
                                    res.json({success:false,message:err.errors.mantisIssueID.message,field:"mantisIssueID"});
                                }else if(err.errors.createdDate){
                                    res.json({success:false,message:err.errors.createdDate.message,field:"createdDate"});
                                }else if(err.errors.createdBy){
                                    res.json({success:false,message:err.errors.createdBy.message,field:"createdBy"});
                                }else if(err.errors.commentText){
                                    res.json({success:false,message:err.errors.commentText.message,field:"commentText"});
                                }else{
                                    res.json({success:false,message:err});
                                }
                            }
                        }
                        else{
                            
                            res.json({success:true,message:"Issue has been added successfully"});
                        }
                        }); 
                    }
               });
               return router;

            };