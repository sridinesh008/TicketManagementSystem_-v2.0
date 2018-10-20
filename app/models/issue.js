var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var date = require('date-and-time');
var titlize  = require('mongoose-title-case');
//var now = new Date();
var moment = require('moment');


var Schema   = mongoose.Schema;

var textValidator = [
    validate({
        validator : 'matches',
        arguments: /^[a-zA-Z \-]+$/i,
        message   : "Mantis Status,MantisnCategory,Mantis Priority,Internal Status,Internal Category,Internal Priority & Assing to fields should contain only alphabets."
    }),
    validate({
        validator : 'isLength',
        arguments : [3,20],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for all Text Fields"
    }),
]

var moduleValidator = [
    validate({
        validator : 'matches',
        arguments: /^[a-zA-Z \-]+$/i,
        message   : "ModuleName should contain only alphabets."
    }),
    validate({
        validator : 'isLength',
        arguments : [3,25],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for all Text Fields"
    }),
]

/*var dateValidator = [
    validate({
        validator : 'matches',
        arguments: /^[0-9 \-]+$/i,
        message   : "Date Format is invalid"
    })
]*/

  var issueIDValidator = [
    validate({
        validator : 'isNumeric',
        message   : "Ticket ID field should have only numbers."
    }),
    validate({
        validator : 'isLength',
        arguments : [1,8],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for Ticket ID Field."
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

var issueSchema = new Schema({
    createdDate        :{type:String,required:true},
    updatedDate        :{type:String, required:true},
    mantisIssueID    : {type:String, required:true,unique:true, validate:issueIDValidator},
    mantisStatus     : {type:String, required:true, validate:textValidator},
    mantisCategory   : {type:String, required:true, validate:textValidator},
    mantisPriority   : {type:String, required:true, validate:textValidator},
    internalStatus   : {type:String, required:true, validate:textValidator},
    internalCategory : {type:String, required:true, validate:textValidator},
    internalPriority : {type:String, required:true, validate:textValidator},
    module           : {type:String, required:true, validate:moduleValidator},
    assingedTo       : {type:String, required:true, validate:associateIDValidator},
    mantisTicketSummary  : {type:String, required:true, validate:textValidator},
    active           : {type:String, required:true, default:"1"}
});

module.exports = mongoose.model('Issue',issueSchema);

