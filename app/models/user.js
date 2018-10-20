var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');

var Schema   = mongoose.Schema;

var nameValidator = [
    validate({
        validator : 'matches',
        arguments : /^([a-zA-Z]{3,30})+((\s[a-zA-Z]{3,30})+)$/,
        message   : "User name should contain first name & last name separeated by a space. Character length should be greater than 3 and less than 30."
    }),
    validate({
        validator : 'isLength',
        arguments : [3,30],
        message   : "Email should be between {ARGS[0]} and {ARGS[1]} characters."
    }),
  ]

  var eMailValidator = [
    validate({
        validator : 'isEmail',
        message   : "E-Mail ID is not valid"
    }),
    validate({
        validator : 'isLength',
        arguments : [3,50],
        message   : "Email should be between {ARGS[0]} and {ARGS[1]} characters."
    }),
  ]

  var associateIDValidator = [
    validate({
        validator : 'matches',
        arguments : /^([0-9]{6})$/,
        message   : "Associate ID can contain only numbers and character length should be 6"
    }),
  ]

  var passwordValidator = [
    validate({
        validator : 'matches',
        arguments : /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W])(?=.*?[\d]).{8,30}$/,
        message   : "Password should not have space. It must contain at least One Lowercase, One Uppercase, One Special Character & One Number. Character length should be in between 8 to 30."
    }),
  ]

var userSchema = new Schema({
    userName    : {type:String, required:true, validate: nameValidator},
    email       : {type:String, required:true, unique:true, validate: eMailValidator},
    associateID : {type:String, required:true, unique:true, validate: associateIDValidator},
    password    : {type:String, required:true, validate: passwordValidator},
    permission  : {type:String, required:true, default:"user"}
});

userSchema.pre('save', function(next) {

    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if(err) {
            return next(err)
        }else{
        user.password=hash; // Store hash in your password DB.
        next();
        }
    });
  });

  userSchema.plugin(titlize, {
    paths: ['userName']
  });

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',userSchema);

