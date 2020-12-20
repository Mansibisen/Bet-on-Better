const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const Charity = require("../models/Charity");
const Donor = require("../models/Donor");
const Donation = require("../models/Donation");
const { isLoggedIn } = require("../middlewares/fixers");
const { compare } = require("bcrypt");

//router.get('/donor/profile',async(req,res)=>{})

router.get("/", isLoggedIn, (req, res) => {
	// console.log({donorSession: req.session.passport.user});
    res.render("donorDash");
});
router.get("/login", function (req, res) {
    res.render("DonorLogin");
});

router.get("/charities/all", async (req, res) => {
    try {
        let allchar;
        allchar = await Charity.find();
        return res.status(200).json({ data: allchar });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.get("/charities/:query", async (req, res) => {
    try {
        let char;
        let searchText = req.params.query;
        char = await Charity.find({
            $or: [
                { userName: { $regex: `^${searchText}`, $options: "i" } },
                {
                    requirements: {
                        $elemMatch: {
                            material: {
                                $regex: `^${searchText}`,
                                $options: "i",
                            },
                        },
                    },
                },
            ],
        });
        return res.status(200).json({ data: char });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.get("/charityPage/:id", async (req, res) => {
    try {
        let char;
        let chID = req.params.id;
        char = await Charity.findById(chID);
        console.log(char);
        return res.status(200).render("donorCharityPage", { info: char });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.post("/charityPage/donate", async (req, res) => {
    try {
        let don = req.body;
        let charID = don.DonatedTo;
        let donID = don.DonatedBy;
        let C = Charity.findById({ charID });

        //let D=Donor.findById({donID});
        //let placeholder1=await Charity.findByIdAndUpdate(charID,{$push: {donation: don}});

        let placeholder1 = await Donor.findByIdAndUpdate(donID, {
            $push: { donation: don },
        });

        let newReq = C.requirements;
        for (let i = 0; i <= newReq.length; i++) {
            if (newReq.material == don.material) {
                if (newReq.quantity > don.quantity)
                    newReq.quantity = newReq.quantity - don.quantity;
                else newReq.quantity = 0;
                break;
            }
        }

        let placeholder2 = await Charity.findByIdAndUpdate(charID, {
            requirements: newReq,
            $push: { donation: don },
        });

        return res.status(200).json({ message: "Donation Successful" });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.get("/profile", isLoggedIn, async (req, res) => {
	try {
		let totalData = {};
		totalData['basic'] = req.user;
		await Donation.find({ DonatedBy: req.user._id }, (err, detail) => {
			if(err) throw err;
			else {
				totalData['details'] = detail;
				res.locals.data = totalData;
				res.render("donorProfile");
			}
		});
	}
	catch(err){
		console.log(err);
		res.status(500).json({ message: "Server error: Try again later" });
	}
});

module.exports = router;
