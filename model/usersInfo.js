const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  unitName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    default: "Admin",
    required: false,
  },
  createdOn: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("userInfo", userInfoSchema, "userInfoList");
