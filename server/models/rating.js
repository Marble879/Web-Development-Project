var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ratingSchema = new Schema({
  starRating: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  post: { type: Schema.Types.ObjectId, ref: 'posts' }
});

module.exports = mongoose.model("ratings", ratingSchema);