const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supportSchema = new Schema({
  eventID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "eventInfo",
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
  createdBy: {
    type: Schema.Types.ObjectId,
    default: "Admin",
    required: false,
    ref: "user",
  },
  photo: {
    type: String,
    default: "none",
  },
  video: {
    type: String,
    default: "none",
  },
  livestream: {
    type: String,
    default: "none",
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "user",
  },
  reason: {
    type: String,
    default: "",
    required: false,
  },
  approvedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("support", supportSchema, "supportList");
