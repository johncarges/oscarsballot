const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const User = require('./models/user.model.js')
const Award = require('./models/award.model.js')

require('dotenv').config()
// console.log(process.env.CONNECTION_STRING)

const app = express()
app.use(express.json())
app.use(cors())

const runServer = () => {
    app.listen(3009, ()=>{
        console.log('Server is running on port 3009')
    })
}

app.get('/', (req, res)=>{
    res.send('Hello from Node API')
})

app.get('/api/users', async (req, res) =>{
    try {
        const users = await User.find({},'username _id')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.post('/api/users', async (req,res)=>{
    try {
        const user = await User.create(req.body)
        res.status(201)
        res.json(user)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

app.get('/api/users/:id', async (req, res)=>{
    try {
        const { id } = req.params
        const user = await User.findById(id, 'username _id')
        
        res.status(200).json(user)


    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put('/api/users/:id', async (req, res)=>{
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body)

        if (!user) {
            return res.status(404).json({message: 'User not found'})
        }

        const updatedUser = await User.findById(id, 'username _id')
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        res.status(204)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.get('/api/awards', async (req, res) => {
    try {
        const awards = await Award.find({}, 'name nominees winner')
        res.status(200).json(awards)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/api/awards', async (req, res) => {
    try {
        const award = await Award.create(req.body)
        res.status(201)
        res.json(award)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>{
        console.log('Connected to Database!')
        runServer()
    })
    .catch((err)=>{console.log(err)})