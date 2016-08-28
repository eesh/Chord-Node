var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    
    postid : Schema.Types.ObjectId,
    userid : Schema.Types.ObjectId
    
});


module.exports = mongoose.model('Post', PostSchema);