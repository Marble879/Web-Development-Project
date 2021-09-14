var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    title: { type: String },
    thumbnail: { data: Buffer, contentType: String },
    user_id: { type: Schema.Types.ObjectId, ref: "user" }
});

module.exports = mongoose.model("collection", collectionSchema);