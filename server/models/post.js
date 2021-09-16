var mongoose = require('mongoose');
var Rating = require('./rating');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String },
    numberOfFavorites: {type: Number, default: 0 },
    tags: { type: [String] },
    image: { type: String, required: true },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'rating' }]
});

postSchema.pre('remove', async function(next) {
    try {
      console.log(this.ratings);
      await Rating.deleteMany({
        "_id": {
          $in: this.ratings
        }
      });
      next();
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model("posts", postSchema);