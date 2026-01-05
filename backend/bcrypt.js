const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHash(password) {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

async function compareHash(password, passwordHash) {
    const result = await bcrypt.compare(password, passwordHash)
    return result
}

module.exports = { 
    generateHash, 
    compareHash 
}