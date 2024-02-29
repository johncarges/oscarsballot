const mongoose = require('mongoose')

const GroupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        code: {
            type: String,
            required: true
        },
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
)



const Group = mongoose.model("Group", GroupSchema)

module.exports = Group