const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

router.patch("/", async (req, res)=>{
    try {
        
        const { responses} = req.body
        
        
        const userId = req.session.user.id
        
        if  (!userId || !responses) return res.status(400).json({message: "Missing data"})
    
        const user = await User.findByIdAndUpdate(userId, {responses: responses},{
            new: true
        })
    

        if (!user) return res.status(404).json({message: "User not found"})
    
        req.session.user = {id: user.id, username: user.username, responses: user.responses}
        req.session.save()
        console.log(req.session.user)

        res.status(200).json(user)
        // res.status(200).json({userId:userId, responses:responses})
    } catch (error) {
        res.status(500).json({message: error.message})
    }

})

module.exports = router