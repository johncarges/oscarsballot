const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const numberCorrect = require("../utils/numberCorrect")
const Award = require("../models/award.model")


router.post("/register", async (req, res) =>{
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({message: "Please enter all fields"})
    }
    
    // Check if username is taken
    const user = await User.findOne({username: username})

    if (user) return res.status(400).json({message: "User already exists"})

    const newUser = new User({
        username,
        password
    })

    bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if (err) throw err
            
            try {
                newUser.password = hash
                newUser.save()
    
                // Add user info to session
                const sessUser = {id:   newUser.id, username: newUser.username, responses: newUser.responses}
                req.session.user = sessUser
                req.session.save()
                res.json({message: "Succesfully Registered", sessUser})
                
            } catch (err) {
                console.log(err)
            }
        })
    })
})


router.post("/login", (req, res)=> {
    const {username, password} = req.body


    if (!username || !password) {
        return res.status(400).json({message: "Please enter all fields", body: req.body})
    }

    User.findOne({ username }).then((user)=>{
        if (!user) return res.status(400).json({message: "Invalid Credentials"})

        bcrypt.compare(password, user.password).then((isMatch)=>{
            if (!isMatch) return res.status(400).json({message: "Invalid Credentials"})

            const sessUser = {id: user.id, username: user.username, responses:user.responses}
            
            req.session.user = sessUser
            req.session.authenticated = true
            req.session.save()
            
            return res.send({message: "Logged in Successfully", user: req.session.user})
            
        })
    })


})

router.post("/logout", async (req, res) => {

    req.session.destroy()
    res.clearCookie('connect.sid')
    res.status(204).json({message: "Logged Out Successfully"})

})

router.get("/authchecker", async (req, res)=> {
    
    if (req.session.user) {
        const sessUser = await User.findById(req.session.user)
        const results = await Award.find({winner: {$ne: null}}, '_id winner').lean()
        const user = sessUser.toObject()
        user.correct = await numberCorrect(user, results)
        return res.json({message: "Successfully Authenticated", user})
    } else {
        return res.status(401).json({message: "Unauthorized"})
    }
})

module.exports = router

