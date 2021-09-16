var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    title: { type: String },
    thumbnail: { type: String, required: true }
});

module.exports = mongoose.model("collections", collectionSchema);