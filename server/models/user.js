var mongoose = require("mongoose");
var Rating = require('./rating');
var Schema = mongoose.Schema;
var bcryptjs = require('bcryptjs');
var Collection = require('./collection')
var Post = require('./post');

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  event: { type: String, required: true },
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

const users = mongoose.model("users", userSchema);
module.exports = users;

module.exports.createUser = (newUser, callback) => {
  bcryptjs.genSalt(10, (err, salt) => {
    bcryptjs.hash(newUser.password, salt, (error, hash) => {
      // Here we store the hashed password
      const newUserResource = newUser;
      newUserResource.password = hash;
      newUserResource.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  const query = { username };
  users.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};