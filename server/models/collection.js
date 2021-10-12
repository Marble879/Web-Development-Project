var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    title: { type: String, required: true },
    event: { type: String },
    thumbnail: { type: String },
    post_id: [{ type: Schema.Types.ObjectId, ref: 'posts' }]
});

module.exports = mongoose.model("collections", collectionSchema);