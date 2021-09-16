var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Collection = require('./collection')
var Post = require('./post');

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  event: { type: String },
  icon: { type: String, required: true },
  collections: [{ type: Schema.Types.ObjectId, ref: "collections" }]
});

userSchema.pre('remove', async function (next) {
  try {
    await Collection.remove({
      "_id": {
        $in: this.collections
      }
    });
    await Post.updateMany({ user_id: this._id },
      { user_id: null }).exec();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("users", userSchema);