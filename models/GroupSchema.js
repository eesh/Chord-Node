var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = mongoose.Schema({
    
  groupID : { type : String, index : { unique : true } },
  creator : Schema.Types.ObjectId,
  groupName : String,
  faculties : [Schema.Types.ObjectId],
  members : [Schema.Types.ObjectId]
});

GroupSchema.statics.getObjectId = function getObjectId(groupid, callback) {

  this.find({ groupID : groupid }, (err, group) => {
    
    if (err || group == null) {
      callback(null);
    } else callback(group.id);
  });
};

module.exports = mongoose.model('Group', GroupSchema);