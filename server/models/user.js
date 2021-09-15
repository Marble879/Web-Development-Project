var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Collection = require('./collection')

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  icon: { data: Buffer, contentType: String },
  collections: [{ type: Schema.Types.ObjectId, ref: "collection" }]
});

userSchema.pre('remove', async function (next) {
  try {
    await Collection.remove({
      "_id": {
        $in: this.collections
      }
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("user", userSchema);