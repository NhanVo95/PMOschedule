const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    default: "false",
    require: false,
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "userInfo",
  },
});

module.exports = mongoose.model("user", userSchema, "userList");
