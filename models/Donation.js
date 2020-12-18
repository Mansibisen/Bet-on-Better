const mongoose = require("mongoose");

const DonationtSchema = new mongoose.Schema({
  DonatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  DonatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Charity",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  material: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Donation", DonationtSchema);
