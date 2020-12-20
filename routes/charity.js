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
  console.log({ charitySession: req.session.passport.user });
  try {
    let user = req.user;
    console.log(user);
    let totalRequirementsID = user.requirements;
    let value;
    let totalRequirements = [];
    if (totalRequirementsID.length > 0) {
      await totalRequirementsID.forEach(async (requirement, index) => {
        value = await Requirement.findById(requirement);
        totalRequirements.push(value);
        if (index === totalRequirementsID.length - 1) {
          return res.render("CharityRequirement", {
            user: user,
            data: totalRequirements,
          });
        }
      });
      console.log("Req: ", totalRequirements);
    } else {
      return res.render("CharityRequirement", {
        user: user,
        data: totalRequirements,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error : Try again later" });
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    let totalDonationsID = user.donation;
    let value;
    let totalDonation = [];
    console.log("ids", totalDonationsID);
    if (totalDonationsID.length > 0) {
      await totalDonationsID.forEach(async (donation, index) => {
        value = await Donation.findById(donation);
        totalDonation.push(value);
        if (index === totalDonationsID.length - 1) {
         console.log(
            "from route ",
            totalDonation
          );
          return res.render("charityDashboard", {
            data: totalDonation,
          });
        }
      });
    } else {
      console.log("from route ", totalDonation);
      return res.render("charityDashboard", { user: user, data: totalDonation });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error : Try again later" });
  }
});

router.get("/requirements/add", isLoggedIn, (req, res) => {
  let type = "Add";
  let user = req.user;
  res.render("charityReqAdd", { type: type, user: user, requirement: new Requirement() });
});

router.post("/requirements", async (req, res) => {
  var newItem = {
    material: req.body.material,
    quantity: req.body.quantity,
    description: req.body.description,
  };
  let charityUser = await Charity.findById(req.user.id);

  Requirement.create(newItem, async (err, createdItem) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Server error : Try again later" });
    } else {
      charityUser.requirements.push(createdItem.id);
      charityUser = await charityUser.save();
      req.flash("success_msg", "Requirement added successfully!");
      res.redirect("/charity/requirements");
      console.log("Charity user", charityUser);
    }
  });
});

//Update requirement
router.get("/requirements/update/:id", isLoggedIn, async (req, res) => {
  const requirement = await Requirement.findById(req.params.id);
  let type = "Update";
  let user = req.user;
  res.render("charityReqAdd", {
    type: type,
    user: user,
    material: req.body.material,
    quantity: req.body.quantity,
    description: req.body.description,
    requirement: requirement,
  });
});

router.delete("/:id", async (req, res) => {
  let reqID = await Requirement.findByIdAndDelete(req.params.id);
  let charityUser = await Charity.findById(req.user.id);
  let i = charityUser.requirements.indexOf(reqID.id);
  charityUser.requirements.splice(i, 1);
  console.log(charityUser);
  charityUser = await charityUser.save();
  req.flash("error_msg", "The requirement has been removed");
  res.redirect("/charity/requirements");
});

router.put("/:id", async (req, res) => {
  let user = req.user;
  let requirement = await Requirement.findById(req.params.id);
  requirement.material = req.body.material;
  requirement.quantity = req.body.quantity;
  requirement.description = req.body.description;
  try {
    requirement = await requirement.save();
    req.flash("success_msg", "The requirement has been updated successfully");
    res.redirect("/charity/requirements");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Please fill all the details!");
    res.render("charityReqAdd", {
      type: "Update",
      user: user,
      material: req.body.material,
      quantity: req.body.quantity,
      description: req.body.description,
      requirement: requirement,
    });
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
