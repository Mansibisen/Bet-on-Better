const mongoose = require("mongoose");

const CharitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  donation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
  ],

  location: {
    type: Array,
    required: true,
  },
  requirements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Charity", CharitySchema);
