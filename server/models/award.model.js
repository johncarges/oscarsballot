const mongoose = require('mongoose')

const AwardSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        nominees: {
            type: [{name: String, film: String}],
            required: true
        },
        winner: {name: String}
    },
    {timestamps: true}
)

 const Award = mongoose.model("Award", AwardSchema)

 module.exports = Award


// {
//   "name": "",
//   "nominees":[
//     {"name": "", "film": ""},
//     {"name": "", "film": ""},
//     {"name": "", "film": ""},
//     {"name": "", "film": ""},
//     {"name": "", "film": ""}],
//   "winner": null
// }