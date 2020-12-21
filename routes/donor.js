const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const Charity = require("../models/Charity");
const Donor = require("../models/Donor");
const Donation = require("../models/Donation");
const Requirement = require("../models/Requirements");
const { isLoggedIn } = require("../middlewares/fixers");
const { compare } = require("bcrypt");

//router.get('/donor/profile',async(req,res)=>{})

router.get("/", isLoggedIn, (req, res) => {
    let user = req.user;
    res.render("donorDash", { user: user });
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
        let char,reqList;
        let searchText = req.params.query;
        char = await Charity.find({
            $or: [
                { name: { $regex: `^${searchText}`, $options: "i" } },
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
        reqList=await Requirement.find({material:{$regex: `^${searchText}`, $options: "i"}})
        return res.status(200).json({ charities: char, req: reqList });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.get("/charityPage/:id", async (req, res) => {
    try {
        let char, reqList;
        let chID = req.params.id;
        let user = req.user;
        char = await Charity.findById(chID);
        reqList = await Requirement.find({charityID: chID})
        //console.log(reqList);
        return res.status(200).render("donorCharityPage", { user: user, info: char, req: reqList });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.post("/charityPage/donate", async (req, res) => {
    try {
        let don={};
        don.material=req.body.reqItem;
        don.quantity=Number(req.body.qty);
        don.description=" ";
        don.DonatedTo=req.body.DonatedTo;
        don.DonatedBy=req.user._id;
        let charID = don.DonatedTo;
        let donID = don.DonatedBy;

        let placeholder1 = await Donation.create(don);
        let donationID=''+placeholder1._id

        let placeholder2 = await Charity.findByIdAndUpdate(charID, {
            $push: { donation: donationID }
        });

        let placeholder3 = await Donor.findByIdAndUpdate(donID, {
            $push: { donation: donationID }
        });

        Requirement.findOne({charityID: don.DonatedTo, material: don.material},async(err,reqObj)=>{
            console.log(reqObj);
            let newQuantity;
            if(reqObj.quantity>don.quantity) newQuantity=reqObj.quantity-don.quantity;
            else newQuantity=0;

            let placeholder4=await Requirement.findByIdAndUpdate(reqObj._id, {$set :{quantity: newQuantity}});
            if(err) console.log(err);
        });


        return res.status(200).redirect('/donor');
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Server error: Try again later" });
    }
});

router.get("/profile", isLoggedIn, async (req, res) => {
	try {
		let user = req.user._doc;
		user = {...user};
		['donation','_id','password','date','__v'].forEach(e => delete user[e]);
		let totalData = {};
		totalData['basic'] = user;
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
