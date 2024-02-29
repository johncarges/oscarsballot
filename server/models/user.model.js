const mongoose = require('mongoose')
const Award = require('./award.model')


const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        responses: [{
            award: {type: String, required: true}, 
            response: {type: String, required: true}
        }]
    },
    // {
    //     methods: {
    //         submitted(){
    //             return this.responses.length > 0
    //         },
    //         async numberCorrect(){
    //             const results = await Award.find({winner: {$ne: null}}, '_id winner').lean()
                
                
    //             const correct = results.filter(result => {
    //                 const response = this.responses.filter(response=>response.award===result.award)
    //                 return response.response === result.response 
    //             })
    //             return correct.length
    //         }
            
    //     }
    // },
    {
        timestamps: true,
        toObject: {virtuals: true}
    }
)

// UserSchema.virtual('submitted').get(function(){
//     return this.responses.length > 0
// })

// UserSchema.virtual('numberCorrect').get(async function(){
//     const results = await Award.find({winner: {$ne: null}}, '_id winner').lean()
    
//     const correct = results.filter(result => {
//         const response = this.responses.filter(response=>response.award===result.award)
//         return response.response === result.response 
//     })
//     return correct.length
// })

const User = mongoose.model("User", UserSchema)

module.exports = User