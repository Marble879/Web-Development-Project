var mongoose = require('mongoose');
var Rating = require('./rating');
var Schema = mongoose.Schema;
var Collection = require('./collection')

var postSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String },
    numberOfFavorites: { type: Number, default: 0 },
    tags: { type: [String] },
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    event: { type: String, required: true },
    image: { type: String, required: true },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'ratings' }]
});

postSchema.pre('remove', async function (next) {
    try {
        await Collection.updateMany({ post_id: this._id },
            { $pull: { post_id: this._id } },
            { multi: true }).exec();
        await Rating.deleteMany({ _id: { $in: this.ratings }});
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("posts", postSchema);