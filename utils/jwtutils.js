const jswt = require('jsonwebtoken');

function generateToken(user) {
    return jswt.sign({
        user_id: user.id,
        roles: user.Role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, 'TOP_SECRET');
}

function verifyToken(token) {
    return jswt.verify(token, 'TOP_SECRET');
}

module.exports = {
    generateToken,
    verifyToken
}