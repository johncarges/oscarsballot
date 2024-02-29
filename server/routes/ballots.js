const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

router.patch("/", async (req, res)=>{
    try {
        console.log(req.session.user)
        const { responses} = req.body
        
        console.log(responses)

        const userId = req.session.user.id
        console.log(userId)

        if  (!userId || !responses) return res.status(400).json({message: "Missing data"})
    
        const user = await User.findByIdAndUpdate(userId, {responses: responses},{
            new: true
        })
    
        console.log(user)

        if (!user) return res.status(404).json({message: "User not found"})
    
        res.status(200).json(user)
        // res.status(200).json({userId:userId, responses:responses})
    } catch (error) {
        res.status(500).json({message: error.message})
    }

})

module.exports = router