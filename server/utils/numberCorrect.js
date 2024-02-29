const Award = require('../models/award.model')
const User = require('../models/user.model')

module.exports = function numberCorrect(user, results) {
    
    
                
                
    const correct = results.filter(result => {
        const response = user.responses.filter(response=>response.award===result.award)
        return response.response === result.response 
    })
    return correct.length
}