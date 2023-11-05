const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studioSchema = new Schema({
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
  approved: {
    type: String,
    default: "waiting",
    required: false,
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
    required: false,
  },
});

module.exports = mongoose.model("studio", studioSchema, "studioList");
