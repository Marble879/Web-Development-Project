var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: { type: String },
    description: { type: String },
    numberOfFavorites: {type: Number },
    tags : {type: [String]},
    image : { type: String, required: true }
});

module.exports = mongoose.model("posts", postSchema,);