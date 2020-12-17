const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Requirement", RequirementSchema);
