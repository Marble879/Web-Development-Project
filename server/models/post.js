var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: { type: String },
    description: { type: String },
    numberOfFavorites: {type: Number },
    tags : {type: [String]},
    image : { data: Buffer, contentType: Sting}
});

module.exports = mongoose.model("post", postSchema);