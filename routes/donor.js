const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const Charity = require('../models/Charity');
const Donor= require('../models/Donor');

//router.get('/donor/profile',async(req,res)=>{})

router.get('/',(req,res)=>{
    res.render('donorDash');
})

/* router.get('/profile',(req,res)=>{
    res.render('donorProfile');
}) */

router.get('/charities/all', async(req,res)=>{
    try{
        let allchar;
        allchar = await Charity.find();
        return res
                .status(200)
                .json({data: allchar});
    }
    catch(e){
        console.log(e);
        return res
            .status(500)
            .json({message: "Server error: Try again later"});
    }
})

router.get('/charities/:query', async(req,res)=>{
    try{
        let char;
        let searchText=req.params.query;
        char = await Charity.find({$or:[{userName:{ $regex: `^${searchText}`, $options: 'i' }},{requirements:{$elemMatch:{material:{ $regex: `^${searchText}`, $options: 'i' }}}}]});
        return res
                .status(200)
                .json({data: char});
    }
    catch(e){
        console.log(e);
        return res
            .status(500)
            .json({message: "Server error: Try again later"});
    }
})

router.get('/charityPage/:id', async(req,res)=>{
    try{
        let char;
        let chID=req.params.id;
        char = await Charity.findById(chID);
        console.log(char);
        return res
                .status(200)
                .render('donorCharityPage',{info: char});
    }
    catch(e){
        console.log(e);
        return res
            .status(500)
            .json({message: "Server error: Try again later"});
    }
})

router.post("/charityPage/donate", async (req, res) => {
  
    try{
        let don = req.body;
        let charID=don.DonatedTo;
        let donID=don.DonatedBy;
        let C=Charity.findById({charID});

        //let D=Donor.findById({donID});
        //let placeholder1=await Charity.findByIdAndUpdate(charID,{$push: {donation: don}});
        
        let placeholder1=await Donor.findByIdAndUpdate(donID,{$push: {donation: don}});

        let newReq=C.requirements;
        for(let i=0;i<=newReq.length;i++){
            if(newReq.material==don.material){
                if(newReq.quantity>don.quantity)
                    newReq.quantity=newReq.quantity-don.quantity;
                else
                    newReq.quantity=0;
                break;
            }
        };

        let placeholder2=await Charity.findByIdAndUpdate(charID,{requirements: newReq, $push: {donation: don}});

        return res  
                .status(200)
                .json({message: "Donation Successful"});
    }
    catch(e){
        console.log(e);
        return res
            .status(500)
            .json({message: "Server error: Try again later"});
    }
  });

router.get("/profile", async (req, res) => {
	try {
		if(isValidObjectId(req.user_id)) {
			let donorDetails = await Donor.findById(req.user_id);
			if(!donorDetails) res.status(403).json({ message: 'Not Found' });
			else {
				donorDetails = {...donorDetails._doc};
				delete donorDetails.password;
				res.status(200).render("donorProfile",{info: donorDetails});
			}
		}
		else {
			res.status(400).json({ message: "Invalid Id" });
		}
	}
	catch(err) {
		console.log(err);
		res.status(500).json({ message: "Server error: Try again later" });
	}
});


module.exports=router;