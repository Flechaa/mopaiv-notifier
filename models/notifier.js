const mongoose = require("mongoose");

const notifierSchema = mongoose.Schema({
  id: Number,
  name: String,
  thumbnail: String,
  price: Number,
  exclusive: Boolean
});

module.exports = mongoose.model("notify", notifierSchema);
