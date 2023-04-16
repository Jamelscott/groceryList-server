const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: String,
  quantity: Number,
  complete: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Item", ItemSchema);
