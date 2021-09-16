var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    title: { type: String },
    event: { type: String },
    thumbnail: { type: String, required: true },
    post_id: [{ type: Schema.Types.ObjectId, ref: 'posts' }]
});

module.exports = mongoose.model("collections", collectionSchema);