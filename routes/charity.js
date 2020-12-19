const express = require("express");
const router = express.Router();

//Database models
const Charity = require("../models/Charity");
const Requirement = require("../models/Requirements");
const Donation = require("../models/Donation");
const { isValidObjectId } = require("mongoose");
const { isLoggedIn } = require("../middlewares/fixers");
router.get("/login", function (req, res) {
    res.render("CharityLogin");
});
router.get("/requirements", isLoggedIn, async (req, res) => {
    try {
        let user = req.user;
        let totalRequirementsID = user.requirement;
        let value;
        let totalRequirements = [];
        if (totalRequirementsID.length > 0) {
            await totalRequirementsID.forEach(async (requirement, index) => {
                value = await Requirement.findById(requirement);
                totalRequirements.push(value);
                if (index === totalRequirementsID.length - 1) {
                    /*return res.status(200).json({
            result: totalRequirements,
          });*/
                    return res.render("CharityRequirement", {
                        data: totalRequirements,
                    });
                }
            });
        } else {
            //return res.status(200).json({ result: totalRequirements });

            return res.render("CharityRequirement", {
                data: totalRequirements,
            });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error : Try again later" });
    }
});

router.get("/", isLoggedIn, async (req, res) => {
    try {
        let user = req.user;
        let totalDonationsID = user.donation;
        let value;
        let totalDonation = [];
        if (totalDonationsID.length > 0) {
            await totalDonationsID.forEach(async (donation, index) => {
                value = await Donation.findById(donation);
                totalDonation.push(value);
                if (index === totalDonationsID.length - 1) {
                    /*return res.status(200).json({
            result: totalDonation,
          });*/
                    return res.render("charityDashboard", {
                        data: totalDonation,
                    });
                }
            });
        } else {
            //return res.status(200).json({ result: totalDonation });
            return res.render("charityDashboard", { data: totalDonation });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error : Try again later" });
    }
});

router.post("/requirements", async (req, res) => {
    var newItem = {
        material: req.body.material,
        quantity: req.body.quantity,
        description: req.body.quantity,
    };

    Requirement.create(newItem, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Server error : Try again later" });
        } else {
            res.status(200).json({
                message: "Requirement added",
                result: newItem,
            });
        }
    });
});

router.delete("/:id", async (req, res) => {
    await Requirement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Requirement deleted" });
});

router.put("/:id", async (req, res) => {
    let item = await Requirement.findById(req.params.id);
    item.quantity = req.body.quantity;
    item.description = req.body.description;
    try {
        item = await item.save();
        res.status(200).json({ message: "Requirement updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error : Try again later" });
    }
});

router.get("/profile/:id", async (req, res) => {
    try {
        if (isValidObjectId(req.params.id)) {
            let charityDetails = await Charity.findById(req.params.id);
            if (!charityDetails) res.status(403).json({ message: "Not Found" });
            else {
                charityDetails = { ...charityDetails._doc };
                delete charityDetails.password;
                res.status(200).json(charityDetails);
            }
        } else {
            res.status(400).json({ message: "Invalid Id" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error : Try again later" });
    }
});

module.exports = router;
