var utils = require('../utils/jwtutils');

const authenticator = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    try {
        var payload = utils.verifyToken(token);
        req.user = payload;
    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
    next();
}

module.exports = {
    authenticator
}