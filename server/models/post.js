var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String },
    numberOfFavorites: {type: Number, default: 0 },
    tags : { type: [String] },
    image : { type: String, required: true }
});

module.exports = mongoose.model("posts", postSchema);