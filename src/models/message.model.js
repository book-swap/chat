const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = mongoose.Schema({
  from: {
    type: ObjectId
  },
  to: {
    type: ObjectId
  },
  createdAt: { type: Date, default: Date.now },
  message: {
    type: String
  }
});

module.exports = mongoose.model("Message", MessageSchema);
