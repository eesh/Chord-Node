var mongoose = require('mongoose');

var PostDetailsSchema = mongoose.Schema({
    
    postId : Schema.Types.ObjectId,
    text : String
    
});


module.exports = mongoose.model('PostDetails', PostDetialsSchema);