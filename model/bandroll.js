const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bandrollSchema = new Schema({
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
  file: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("bandroll", bandrollSchema, "bandrollList");
