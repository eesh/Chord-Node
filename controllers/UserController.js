var mongoose = require('mongoose');
var User = require('../models/UserSchema');
var Auth = require('../functions/Authentication');
var bcrypt = require('bcrypt');
//var UserFunctions = require('../functions/UserFunctions');

exports.postCreateUser = function (req, res, err) {
    
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var regNo = req.body.regNo;
	var year = req.body.year;
	
	var newUser = { };
	newUser.name = name;
	newUser.email = email;
	newUser.password = password;
	newUser.registerNumber = regNo;
	newUser.year = year;
	
	function sendResponse(response, token) {
		if (response == null) {
			res.json({ success : false, error : 'Incorrect username or password' });
		} else {
			res.json({ success : true, token : token });
		}
	}
	
	function createUserCallback(err, user) {
		
		if (err != false) {
			
			res.json({ message : err, success : false });
		} else {
			Auth.loginUser(user.email, password, sendResponse);
		}
	};
	
	createUser(newUser, createUserCallback);  
};


exports.postAuthenticateUser = function (req, res, err) {
	
	var email = req.body.email;
	var password = req.body.password;
	
	function sendResponse(response, token) {
		if (response == null) {
			res.json({ success : false, error : 'Incorrect username or password' });
		} else {
			res.json({ success : true, token : token });
		}
	}
	
	Auth.loginUser(email, password, sendResponse);
};


exports.getUserInfo = function (req, res, err) {
	
	var token = req.headers.authtoken;
	var userid = req.params.userid;
	
	
	function sendResponse(user) {
		
		if (user == null) {
			res.json({ success : false, error : 'User doesn\'t exist' });
		} else res.json({ success : true, userDetails : user.toJSON() });
	}
	
	Auth.validateUser(token, (user) => {
		if (user == null) {
			res.json({ success : false, error : 'Unauthorized' });
		} else {
			showUserInfo(userid, sendResponse);
		}
	});
};


exports.putUpdateUser = function (req, res, err) {
	
	
};



function showUserInfo(userid, callback) {
	
	User.findOne({ id : userid }, { passwordHash : 0 }, (err, user) => {
		
		if (err != null || user == null) {
			callback(null);
		} else {
			callback(user);
		}
	});
}



function createUser(userDetails, callback) {
	
	var user = new User();
	user.email = userDetails.email;
	user.name = userDetails.name;
	user.registerNumber = userDetails.registerNumber;
	user.year = userDetails.year;
	
  bcrypt.hash(userDetails.password, 5, (err, hash) => {
    
    user.passwordHash = hash;
    user.save((err, userObject) => {
      if(err != null || userObject == null) {
        callback(true);
      } else {
        callback(false, userObject);
      }
    });
  });
}