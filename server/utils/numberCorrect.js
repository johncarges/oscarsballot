const Award = require('../models/award.model')
const User = require('../models/user.model')

module.exports = function numberCorrect(user, results) {
    
    console.log(user)
    console.log(results)

    // results[0]: {_id: (awardId), winner: (winning Nominee Id)}
    // user.responses[0]: {award: (awardId), response: (winning nominee Id)}
    // Need result._id === response.award AND result.winner === response.response
    if (user.responses.length === 0) return 0
    const correct = results.filter(result => {
        const response = user.responses.filter(response=>response.award===result._id.toString())[0]
        return response.response === result.winner
    })
    return correct.length
}