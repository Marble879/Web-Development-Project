var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  event: { type: String },
  icon: { type: String, required: true }
});

module.exports = mongoose.model("users", userSchema);
