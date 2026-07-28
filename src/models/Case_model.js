const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      required: true,
    },
    tagColor: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    raised: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: true,
    },
    donors: {
      type: Number,
      default: 0,
    },
    days: {
      type: Number,
      required: true,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: true,
    },
    initial: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
