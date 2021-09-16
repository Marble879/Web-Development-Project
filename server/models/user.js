var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Post = require('./post');

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  event: { type: String },
  icon: { type: String, required: true }
});

userSchema.pre('remove', function(next) {
  Post.updateMany({user_id: this._id},
    {user_id: null}).exec();
  next();
});

module.exports = mongoose.model("users", userSchema);
