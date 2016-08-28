var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserGroupsSchema = mongoose.Schema({
    
    userID : Schema.Types.ObjectId,
    groupID : Schema.Types.ObjectId,
    creator : Boolean
    
});


module.exports = mongoose.model('UserGroup',UserGroupsSchema);