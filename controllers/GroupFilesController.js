var mongoose = require('mongoose');
var Auth = require('../functions/Authentication');
var aws = require('aws-sdk');
var GroupFile = require('../models/GroupFileSchema');
exports.addFile = function (req, res, err) {
  
  var authtoken = req.headers.authtoken;
  var group = req.body.groupid;
  var filename = req.body.filename;
  var mime = req.body.mime;
  var groupFile = new GroupFile();
  groupFile.
  
  Auth.validateUser(authtoken, (user) => {
    
    if (user == null) {
      res.json({success : false, error : 'Unauthorized'});
    } else {
      prepareFileUplaod();
    }
  });
};