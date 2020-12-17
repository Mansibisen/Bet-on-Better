const express = require("express");
const router = express.Router();
const Charity = require('../models/Charity');


router.get('/charities/all', async(req,res)=>{
    try{
        let allchar;
        allchar = await Charity.find({});
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
        char = await Charity.find({$or:[{userName:{ $regex: `^${searchText}`, $options: 'i' }},{userName:{ $regex: `^${searchText}`, $options: 'i' }}]});
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

module.exports=router;