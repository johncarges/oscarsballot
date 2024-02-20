const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required']
        },
        responses: [{award: String, response: String}]
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", UserSchema)

module.exports = User