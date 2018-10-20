var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var date = require('date-and-time');
var titlize  = require('mongoose-title-case');
var moment = require('moment');


var Schema   = mongoose.Schema;

var textValidator = [
    validate({
        validator : 'isLength',
        arguments : [3,250],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for all Text Fields"
    }), 
]


  var issueIDValidator = [
    validate({
        validator : 'isNumeric',
        message   : "Issue ID field should have only numbers."
    }),
    validate({
        validator : 'isLength',
        arguments : [1,8],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for Issue ID Field."
    }),
  ]

  var associateIDValidator = [
    validate({
        validator : 'isNumeric',
        message   : "Assign To Field should have only numbers."
    }),
    validate({
        validator : 'isLength',
        arguments : [6],
        message   : "Length should be {ARGS[0]} characters for Assign To Field."
    }),
  ]

var commentSchema = new Schema({
    createdDate        :{type:String, required:true},
    updatedDate        :{type:String, required:true},
    mantisIssueID    : {type:String, required:true,validate:issueIDValidator},
    createdBy       : {type:String, required:true, validate:associateIDValidator},
    commentText           : {type:String, required:true, validate:textValidator}
});

module.exports = mongoose.model('Comment',commentSchema);

