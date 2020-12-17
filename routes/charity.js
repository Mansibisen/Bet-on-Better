const express = require("express");
const router = express.Router();
const Requirement = require("../models/Requirements");
const Donation = require("../models/Donation");

router.get("/requirements", async (req, res) => {
    try {
        let user = req.body;
        let totalRequirementsID = user.requirement;
        let value;
        let totalRequirements = [];
        if (totalRequirementsID.length > 0) {
            await totalRequirementsID.forEach(async (requirement, index) => {
                value = await Requirement.findById(requirement);
                totalRequirements.push(value);
                if (index === totalRequirementsID.length - 1) {
                    return res.status(200).json({
                        result: totalRequirements,
                    });
                }
            });
        } else {
            return res.status(200).json({ result: totalRequirements });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error : Try again later" });
    }
});
router.get("/donation", async (req, res) => {
    try {
        let user = req.body;
        let totalDonationsID = user.donation;
        let value;
        let totalDonation = [];
        if (totalDonationsID.length > 0) {
            await totalDonationsID.forEach(async (donation, index) => {
                value = await Donation.findById(donation);
                totalDonation.push(value);
                if (index === totalDonationsID.length - 1) {
                    return res.status(200).json({
                        result: totalDonation,
                    });
                }
            });
        } else {
            return res.status(200).json({ result: totalDonation });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error : Try again later" });
    }
});

module.exports = router;
