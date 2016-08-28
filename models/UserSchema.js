var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var saltRounds = 5;

var UserSchema = mongoose.Schema({
    
    name : String,
    email : { type : String, index : { unique : true } },
    passwordHash : String,
    year : Number,
    registerNumber : String
});

/*
UserSchema.statics.getObjectId = function getObjectId(userid, callback) {

  this.find({ userID : userid }, (err, user) => {
    
    if (err || user == null) {
      callback(null);
    } else callback(user.id);
  });
}*/

module.exports = mongoose.model('User', UserSchema);


