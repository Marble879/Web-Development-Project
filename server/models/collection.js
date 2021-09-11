var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    title: { type: String },
    thumbnail: { data: Buffer, contentType: String }
});

module.exports = mongoose.model("collection", collectionSchema);