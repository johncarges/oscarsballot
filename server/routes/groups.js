const express = require('express')
const router = express.Router()

const Group = require('../models/group.model')
const User = require('../models/user.model')
const Award = require('../models/award.model')
const numberCorrect = require("../utils/numberCorrect")

const formatGroup = (group, results=[]) => {
    const jsonGroup = group.toJSON()
    
    jsonGroup.users.forEach(user=>{
        user.correct = numberCorrect(user, results)
    })

    return jsonGroup

}


router.get("/", async (req, res) => {
    const groups = await Group.find()
    return res.status(200).json(groups)
})


router.get("/mygroups", async (req, res) => {
    const user = await req.session.user
    
    if (!user) {
        return res.status(422).json({message: "Please log in first"})
    }
    
    const myGroups = await Group.find({users: user.id}).populate('users','username responses') //.lean()
    
    
    const results = await Award.find({winner: {$ne: null}}, '_id winner').lean()
    
    const groupObjects = myGroups.map(group=>{
        return formatGroup(group, results)
    })
    
    
    return res.status(200).json(groupObjects)
})

router.get("/findbyname", async (req, res)=> {
    const { groupName, code } = req.query
    
    if (!groupName) {
        return res.status(400).json({message: "Group Name must be included"})
    }
    
    const parsedName = groupName.replace('%20',' ')
    
    try {
        const group = await Group.findOne({name: parsedName, code: code}, '_id name code users').populate('users','username responses')
        if (!group) {
            return res.status(404).json({message: "Group not found"})
        }
        return res.status(200).json(group)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
})

router.get("/:id", async (req, res) => {
    const {id} = req.params
    const group = await Group.findById(id)

    if (!group) return res.status(404).json({message: 'Group could not be found'})

    await group.populate('users', 'username')
    return res.status(200).json(group)
})



router.post("/",  async (req, res)=> {
    const user =  await req.session.user
    
    if (!user) {
        return res.status(404).json({message: "Error: not found"})
    }
    const { groupName } = req.body

    if (!groupName) {
        return res.status(400).json({message: "Group Name must be included"})
    }

    const extGroup = await Group.findOne({name: groupName})

    if (extGroup) {
        return res.status(400).json({message: "Group name already in use"})
    }

    try {

        const codeCreator = require('../utils/createGroupCode')
        const code = codeCreator()
        
        let group = new Group({
            name: groupName,
            code: code,
            users: [user.id]
        })
    
        await group.save()
        await group.populate('users', 'username responses')
        
        
        const groupObject = await formatGroup(group)

        res.status(201).json(groupObject)

    } catch (error) {
        res.status(500).json({message:error.message})
    }

})

router.patch("/adduser/:groupId", async (req, res) => {
    const {groupId} = req.params
    
    const user = await req.session.user

    if (!user) {
        return res.status(401).json({message: "Unauthorized"})
    } 

    try {
        
        const group = await Group.findByIdAndUpdate(groupId,
            {$addToSet: {users: user.id}},
            {new: true}
        )

        if (!group) return res.status(404).json({message: 'Group could not be found'})

        await group.populate('users','username responses')

        const groupObject = await formatGroup(group)
        return res.status(200).json(groupObject)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }

})

router.delete("/:groupId", async (req,res) => {
    const {groupId} = req.params

    try {
        await Group.findByIdAndDelete(groupId)
        return res.status(204).json({})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

})


router.delete('/', async (req, res) =>{
    // DEV ONLY
    try {
        await Group.deleteMany({})
        return res.status(204).json({message: 'No Content"'})
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
})

module.exports = router