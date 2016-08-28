var Auth = require('../models/AuthSchema');
var User = require('../models/UserSchema');
var bcrypt = require('bcrypt');
var Utils = require('../functions/Utils');

var salt_rounds = 5;

exports.validateUser = function(token, callback) {
  
  function returnUser(err, authObject) {
    
    var userid = authObject.userID;

    User.findById(userid, (err, user) => {
      
      if (err != null || user == null) {
        callback(null);
      } else {

        callback(user);
      }
    });
  }
  
  Auth.findOne({ authtoken : token }, (err, authObject) => {
    
    console.log(token);
    if (err != null || authObject == null) {
      
      callback(null);
    } else {
      
      var milliseconds = (new Date).getTime();
      if (authObject.validity <= milliseconds) {
        
        callback(null);
      } else {
        
        authObject.validity = milliseconds + 259200*1000;
        authObject.save(returnUser); 
      }
    }
  });
};


exports.loginUser = function (email, password, callback) {
  
  var time = (new Date).getTime();
  var user = null;
  
  function manageAuthToken(user) {
    
    Auth.findOne({ userID : user.id }, (err, auth) => {
      
      if (err || auth == null) {
        createToken(user);
      } else {
        if (auth.validity + 86400*1000 < time) {
          auth.remove();
          createToken(user);
        } else {
          callback(true, auth.authtoken);
        }
      }
    });
  }
  
  function onCompare(err, result) {
    if (err != null || result == false) {
      callback(null);
    } else {
      manageAuthToken(user);
    }
  }
  
  function createToken(user) {
    var token = Utils.uid(128);
    Auth.findOne({ authtoken : token }, (err, result) => {
      if(err || result != null) {
        createToken(user);
      } else {
        var auth = new Auth();
        auth.userID = user.id;
        auth.authtoken = token;
        auth.validity = (new Date).getTime() + (86400 * 3)*1000;
        auth.save();
        callback(true, token);
      }
    });
  }
  User.findOne({ email : email }, { passwordHash : 1 }, (err, userObject) => {
    if(err != null || userObject == null) {
      callback(null);
    } else {
      user = userObject;
      bcrypt.compare( password, user.passwordHash, onCompare);
    }
  });
};