// Creates 6-letter random code for new groups

function randomCharCode() {
    return Math.floor(Math.random() * 26) + 97
}

module.exports = function createGroupCode() {

    let outputArray = Array.from({length: 6}, ()=>String.fromCharCode(randomCharCode()))
    return outputArray.join('')
}

