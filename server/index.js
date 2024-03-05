const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require("connect-mongodb-session")(session)
const router = express.Router()
const User = require('./models/user.model.js')
const Award = require('./models/award.model.js')
const Group = require('./models/group.model.js')

require('dotenv').config()
// console.log(process.env.CONNECTION_STRING)

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const mongoDBStore = new MongoDBStore({
    uri: process.env.CONNECTION_STRING,
    collection: "mySessions"
})

app.set("trust proxy", 1) 

app.use(session({
    secret: process.env.SESS_SECRET,  // a secret string used to sign the session ID cookie
    resave: false,  // don't save session if unmodified
    store: mongoDBStore,
    unset: 'destroy',
    proxy: true, // 
    saveUninitialized: false,  // don't create session until something stored
    cookie: {
        sameSite: 'none',
        secure: true
    }
  }))

// New: 
var whitelist = [process.env.CLIENT, 'http://localhost:3000','https://www.thunderclient.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, methods: ["DELETE","POST", "PUT", "GET", "OPTIONS", "PATCH", "HEAD"], 
  credentials: true
}
app.use(cors(corsOptions))

// app.use(cors({origin: [process.env.CLIENT], methods: ["DELETE","POST", "PUT", "GET", "OPTIONS", "PATCH", "HEAD"], credentials: true}))


app.get('/', (req, res)=>{
    res.send('Hello from Node API')
})

app.use("/api/users", require("./routes/users.js"))
app.use("/api/ballots", require("./routes/ballots.js"))
app.use("/api/groups", require("./routes/groups.js"))
app.use("/api/awards", require("./routes/awards.js"))

const runServer = () => {
    app.listen(3009, ()=>{
        console.log('Server is running on port 3009')
    })
}

// app.post('/login', (req, res) => {
//     const {username, password} = req.body
//     console.log(req.body)
//     req.session.user = {username: username}
//     res.status(200).json({msg:username})
// })

// const checkAuth = (req, res, next) => {
//     if (req.session.user) {
//         console.log(req.session.user)
//         next()
//     } else {
//         return res.status(422).json({msg:'not logged in'})
//     }
// }

// app.get('/checkuser', checkAuth, (req, res) => {
//     console.log("/checkuser")
//     return res.status(200).json({msg: req.session.user.username})
// })


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