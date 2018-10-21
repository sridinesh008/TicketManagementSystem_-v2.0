
var User     = require('../models/user');
var jwt      = require('jsonwebtoken');
var secret   = 'tic@M@n@geR';

module.exports = function(router) {

    //URL localhost:9090/api/users
    //For Registration Route Function
    router.post('/users',function (req,res) {
    var user = new User();
    user.userName =  req.body.userName;
    user.password = req.body.password;
    user.email = req.body.email;
    user.associateID = req.body.associateID;
    if(user.userName==null || user.userName==""|| user.email==null || user.email=="" || user.password==null || user.password=="" ||user.associateID==null || user.associateID==""){
            res.json({success:false,message:"Please Ensure all fields are filled with valid Data"});
    }else{
    user.save(function (err) {
        if(err){
            if(err.errors!=null){
            if(err.errors.userName){
                res.json({success:false,message:err.errors.userName.message});
                //res.send("user not added bcoz -->"+err) 
            }else if(err.errors.email){
                res.json({success:false,message:err.errors.email.message});
            }else if(err.errors.associateID){
                res.json({success:false,message:err.errors.associateID.message});
            }else if(err.errors.password){
                res.json({success:false,message:err.errors.password.message});
            }else{
                res.json({success:false,message:err});
            }
        }else if(err){
            if(err.code == 11000){
                if(err.errmsg[71]=="e"){
                    res.json({success:false,message:"E-Mail ID already exists."});
                }else if(err.errmsg[71]=="a"){
                    res.json({success:false,message:"Associate ID already exists."});
                }else{
                    res.json({success:false,message:err});
                }
            }else{
                res.json({success:false,message:err});
            }
            }
        } else{
            res.json({success:true,message:"Perfect! Your Registration is successful!!!"});
        }
    });
}
});

    //For Login Route Function
    router.post('/authenticate',function (req,res) {
        User.findOne({associateID:req.body.associateID}).select('associateID userName email password').exec(function (err,user) {
            if (err) {
                res.send(err);
            }
            else{
            if(req.body.password==null || req.body.password=="" ||req.body.associateID==null || req.body.associateID==""){
                res.json({success:false,message:"Please Enter both the associate ID  & Password"})
            }else{
            if(!user){
                res.json({success:false,message:"Oops! Your ID does not exist"})
            }else{
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.json({success:false,message:"Oops! Password you have entered is wrong."})
                }else{
					var token = jwt.sign({ associateID:user.associateID, userName: user.userName, email:user.email },secret,{ expiresIn: '24h' });
					res.json({success:true,message:"User Authentication is successful",token: token});
                }
            }
        }
    }
        })
    });
    
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
	
	router.post('/me',function (req,res) {
        	res.send(req.decoded);
    });
    
    router.get('/renewToken/:associateID',function (req,res) {
        User.findOne({ associateID : req.params.associateID }).select().exec(function (err,user) {
            if(err){
                res.json({success:false,message:err})
            }else{
                var newToken = jwt.sign({ associateID:user.associateID,  userName: user.userName, email:user.email },secret,{ expiresIn: '24h' });
                res.json({success:true,message:"User Authentication is successful",token: newToken});
            }
            
        });
    });

    router.get('/permission',function (req,res) {
        
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,user) {
            if(err){
                res.json({success:false,message:err})
            }else{
                res.json({success:true,permission:user.permission});
            }             
        });
    });

    router.get('/management',function (req,res) {
        User.find({}).select("userName associateID email").exec(function (err,users) {
            if(err){
                res.json({success:false,message:err})
            }
            else{
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                       if(mainUser.permission === "admin" || mainUser.permission === "moderator"){
                        res.json({success:true,users:users,permission:mainUser.permission});
                       }else{
                            res.json({success:false,message:"Insufficient Permission"});
                       }
                    }  
                });
            }          
        });
    });

    router.delete('/deleteUser/:associateID',function (req,res) {
        var userToBeDeleted =  req.params.associateID;
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                       if(mainUser.permission != "admin"){
                            res.json({success:false,message:"Insufficient Permission"});
                       }else{
                        User.findOneAndRemove({associateID: userToBeDeleted}).exec(function(err, user){
                            if(err){
                                res.json({success:false,message:err});
                            }else{
                                res.json({success:true});
                            }
                        });
                       }
                    }           
        });
    });

    router.get('/edit/:id',function (req,res) {
        var userToBeEdited =  req.params.id;
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                        }else{
                        if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                                res.json({success:false,message:"Insufficient Permission"});
                        }else{
                                User.findOne({_id: userToBeEdited}).select().exec(function(err, user){
                                    if(err){
                                        res.json({success:false,message:err});
                                    }else{
                                        res.json({success:true ,user:user});                                
                                    }
                                });
                            }
                    }           
        });
    });


    var username = "";
    var newEmail = "";
    var newPermission = "";
    var newAssociateID = ""
    router.put('/edit',function (req,res) {
        var userToBeEdited =  req.body._id;
        if (req.body.userName){
            newName = req.body.userName;
        } 
        if (req.body.associateID){
            newAssociateID = req.body.associateID;
        } 
        if (req.body.email){
            newEmail = req.body.email;
        } 
        if (req.body.permission){
            newPermission = req.body.permission;
        } 
                User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
                    if(err){
                        res.json({success:false,message:err});
                    }else{
                       if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                            res.json({success:false,message:"Insufficient Permission"});
                       }else{                           
                           if(newName){
                            User.update({ _id: userToBeEdited }, { $set: { userName: newName}}, function (err) {
                                if(err){
                                    console.log(err);
                                }else{
                                    res.json({success:true,message:"User's name updated successfully"});
                                }
                            })

                           
                        }
                       }
                    }         
        });
    });

return router;
}

