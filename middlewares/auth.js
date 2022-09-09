var utils = require('../utils/jwtutils');

const authenticator = (req, res, next) => {
    console.log('inside middleware');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(req);
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