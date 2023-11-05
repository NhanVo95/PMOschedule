const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventInfoSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  place: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: false,
  },
  responsible: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  fee: {
    type: String,
    default: "waiting",
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "user",
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("eventInfo", eventInfoSchema, "eventInfoList");
