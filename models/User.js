var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var config = require("../config");
var Schema = mongoose.Schema;

var User = new Schema({});

User.plugin(passportLocalMongoose);

User.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    return jwt.sign({
        _id: this._id,
        username: this.username, 
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret);
};

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

User.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

module.exports =  mongoose.model('User', User);