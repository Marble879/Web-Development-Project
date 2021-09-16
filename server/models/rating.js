var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ratingSchema = new Schema({
  starRating: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  post: { type: Schema.Types.ObjectId, ref: 'posts' }
});

module.exports = mongoose.model("rating", ratingSchema);