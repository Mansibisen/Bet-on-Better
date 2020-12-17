const mongoose = require("mongoose");

const DonerSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Donor", DonerSchema);
