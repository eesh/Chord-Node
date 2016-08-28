var Group = require('../models/GroupSchema');
var Auth = require('../functions/Authentication');
var Utils = require('../functions/Utils');
var User = require('../models/UserSchema');
var UserGroup = require('../models/UserGroupsSchema');

exports.postGroup = function(req, res, err) {

  var authtoken = req.headers.authtoken;
  var groupDetails = new Group();
  groupDetails.groupName = req.body.groupName;
    
  function sendResponse(group) {
    
    if (group != null) {
      res.json({ success : true, groupDetails : group.toJSON() });
    } else {
      res.json({ success : false, error : "Failed to create group" });
    }
  }
  Auth.validateUser(authtoken, (user) => {
    
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      groupDetails.creator = user.id;
      createGroup(groupDetails, sendResponse);
    }
  });
};


exports.getGroupInfo = function(req, res, err) {
  
  var groupid = req.params.groupid;
  var authtoken = req.headers.authtoken;
  
  function showGroupDetails(group) {
      
    if (group == null) {
      res.json({ success : false, error : 'Couldn\'t find group'});
    } else {
      res.json({ success : true, groupDetails : group });
    }
  }
  Auth.validateUser(authtoken, (user) => {
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      getGroupDetails(groupid, showGroupDetails);
    }
  });
}


exports.deleteGroup = function (req, res, err) {
  
  var token = req.headers.authtoken;
  var groupid = req.params.groupid;
  
  function sendResponse(group) {
    if (group == null) {
      res.json({ success : false });
    } else res.json({ success : true, error : 'Group deleted' });
  }
  Auth.validateUser(token, (user) => {
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      performDeleteGroup(groupid, sendResponse);
    }
  });
}


exports.deleteMember = function (req, res, err) {
  
  var token = req.headers.authtoken;
  var userid = req.params.userid;
  var groupid = req.params.groupid;
  function sendResponse(group) {
    if (group == null) {
      res.json({ success : false });
    } else res.json({ success : true, error : 'Member removed' });
  }
  Auth.validateUser(token, (user) => {
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      performRemoveMember(groupid, userid, sendResponse);
    }
  });
}

exports.postAddMember = function (req, res, err) {
  
  var token = req.headers.authtoken;
  var groupid = req.body.groupid;
  
  function sendResponse(done) {
    if (done == null) {
      res.json({ success : false });
    } else res.json({ success : true, error : 'Member added' });
  }
  
  Auth.validateUser(token, (user) => {
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      addMember(groupid, user.id, sendResponse);
    }
  });
}

exports.putUpdateGroup = function (req, res, err) {
  
  var token = req.headers.authtoken;
  var groupid = req.body.groupid;
  var groupDetails = JSON.parse(req.body.groupDetails);
  
  function sendResponse(done) {
    
  }
  
  Auth.validateUser(token, (user) => {
    if (user == null) {
      res.json({ success : false, error : "Unauthorized" });
    } else {
      updateGroup(groupid, groupDetails, sendResponse);
    } 
  });
}


/*
 *  Think about userid vs _id conversion
 *  add creator
 */
function createGroup(groupDetails, callback) {

  var id = Utils.uid(6);
  var group = null;
  
  function onSave(err, userGroup) {
    if (err != null || userGroup == null) {
      callback(null);
    } else {
      callback(group);
    }
  }
  
  function onSaveGroup(err, groupObject) {
    if (err != null || groupObject == null) {
      callback(null);
    } else {
      group = groupObject;
      var userGroup = new UserGroup();
      userGroup.userID = groupObject.creator;
      userGroup.groupID = groupObject.id;
      userGroup.creator = true;
      userGroup.save(onSave);
    }
  }

  Group.findOne({ groupID : id }, (err, groupObject) => {
    
    if (err != null) {
      callback(null);
    } else if (groupObject != null) {
      createGroup(groupDetails, callback);
    } else {
      groupDetails.groupID = id;
      groupDetails.members = [ groupDetails.creator ];
      groupDetails.save(onSaveGroup);
    }
  });
}


/*
 *
 */
function getGroupDetails(groupid, callback) {
  
  Group.findOne({ groupID : groupid }, (err, group) => {
    
    if (err) {
      callback(null);
    } else if (group == null) {
      callback(null);
    } else callback(group);
  });
}


/*
 *  Delete group reference from UserGroupsSchema
 */
function performDeleteGroup(groupid, callback) {
  
  Group.remove({ groupID : groupid }, (err, group) => {
    
    if (err || group == null) {
      callback(null);
    } else callback(group);
  });
}


/*
 *
 */
function performRemoveMember(groupid, userid, callback) {
  
  function removeFromUserGroups(userObjectId, groupObjectId) {
    
    UserGroup.remove({ userid : userObjectId, groupid : groupObjectId}, (err, usergroup) => {
      if (err || usergroup == null) {
        callback(null);
      } else callback(true);
    });
  }
  
  function removeFromGroup(userObjectId) {
    
    Group.findOne({ groupID : groupid }, (err, group) => {
      
      var index = group.members.indexOf(userObjectId);
      if (index != -1) {
        group.members.splice(index, 1);
      }
      group.save();
    });
    
    Group.getObjectId(groupid, (groupObjectId) => {
      if(groupObjectId == null) {
        callback(null);
      } else removeFromUserGroups(userObjectId, groupObjectId);
    }); 
  }
  User.getObjectId(userid, removeFromGroup);
}


/*
 *  Check if member is already part of group before adding.
 */
function addMember(groupid, userid, callback) {
  
  function addToUserGroup(userid, groupObjectID) {
    
      var userGroup = new UserGroup();
      console.log(userid);
      userGroup.userID = userid;
      userGroup.groupID = groupObjectID;
      userGroup.creator = false;
      userGroup.save((err, userGroup) => {
        if (err || userGroup == null) {
          callback(null);
        } else callback(true);
      });
  }
  
  Group.findOne({ groupID : groupid }, (err, group) => {
    
    if (err != null || group == null) {
      callback(null);
    } else {
      var members = group.members;
      members.push(userid);
      group.update({ members : members }, (err, group_doc) => {
        if (err != null || group_doc == null) {
          callback(null);
        } else addToUserGroup(userid, group_doc.id);
      });
    }
  });
}


/*
 * Check groupDetails
 */
function updateGroup(groupid, groupDetails,callback) {
  
  Group.findOneAndUpdate({ groupID : groupid }, { $set: groupDetails }, { new : true },(err, group) => {
    
    if (err || group == null) {
      callback(null);
    } else callback(group);
  });
}