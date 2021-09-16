var mongoose = require("mongoose");
var Rating = require('./rating');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  icon: { data: Buffer, contentType: String },
});

module.exports = mongoose.model("user", userSchema);
