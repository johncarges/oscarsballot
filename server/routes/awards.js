const express = require('express')
const router = express.Router()

const Award = require("../models/award.model")

router.get("/winners", async (req,res)=>{
    //DEV ONLY
    const awards = await Award.find({winner: {$ne: null}}, 'name nominees winner').lean()
    const response = awards.map(award => {
        return {
            name: award.name,
            winner: award.nominees.filter(nominee=>nominee._id.equals(award.winner))
        }
    })

    return res.status(200).json(response)
})

router.patch("/addwinners", async (req, res)=>{
    try {

        // winners = {awardId: nomineeId ... }
        const {winners} = req.body
        console.log(winners)

        if (!req.session.user || !winners) return res.status(400).json({message: 'Missing Data'})

        Object.keys(winners).forEach(async awardId => {
            const award = await Award.findByIdAndUpdate(awardId, {winner: winners[awardId]}, {new: true})
            console.log(award)
        })

        // res.status(200).json({message: "succesfully updated"})

    } catch (err) {
        res.status(400).json(err)
    }
})


router.patch("/resetwinners", async (req, res) =>{
    // DEV ONLY
    try {
        await Award.updateMany({winner: {$ne: null}},{$set: {winner: null}})
        res.status(200).json({message: 'Reset Successful'})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
    
})

module.exports = router