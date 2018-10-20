var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var date = require('date-and-time');
var titlize  = require('mongoose-title-case');
var moment = require('moment');


var Schema   = mongoose.Schema;

var textValidator = [
    validate({
        validator : 'isLength',
        arguments : [3,1500],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for all Text Fields"
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

var resolutionSchema = new Schema({
    createdDate      : {type:String, required:true, upsert:false,default:moment(Date.now()).format('DD-MM-YYYY hh:mm:ss')},
    updatedDate      : {type:String, required:true, upsert:false,default:moment(Date.now()).format('DD-MM-YYYY hh:mm:ss')},
    sampleTicketIDs  : {type:String, validate:textValidator},
    forWhat          : {type:String, validate:textValidator},
    createdBy        : {type:String, required:true, validate:associateIDValidator},
    updatedBy        : {type:String, required:true, validate:associateIDValidator},
    preRequisite     : {type:String, required:true, validate:textValidator},
    resolution       : {type:String, required:true, validate:textValidator},
    verifySteps      : {type:String, required:true, validate:textValidator}
});

module.exports = mongoose.model('Resolution',resolutionSchema);

