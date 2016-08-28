var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthSchema = mongoose.Schema({
  
  userID : Schema.Types.ObjectId,
  authtoken : String,
  validity : Number
});

module.exports = mongoose.model('Auth', AuthSchema);