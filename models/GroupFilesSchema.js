var mongoose = require('mongoose');

var GroupFilesSchema = mongoose.Schema({
    
    groupid : String,
    filename : String,
    mime: String,
    url : String
});


module.exports = mongoose.model('GroupFile',GroupFilesSchema);