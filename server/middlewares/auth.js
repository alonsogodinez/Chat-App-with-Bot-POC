const jwt = require('jsonwebtoken');
const { jwt: { secret : SECRET} } = require('../config');

module.exports.isAuthenticated = (req, res, next) => {
    function clearTokenAndNext(err) {
        res.clearCookie("token");
        next(err);
    }

    const isAPICall = req.baseUrl.match(/^\/api\/v/);

    const authorizationHeader = req.headers.authorization;

    const token =  isAPICall ? authorizationHeader && authorizationHeader.split(' ')[1] : req.cookies.token;

    if (!token) {
        isAPICall ? res.sendStatus(401) : res.redirect('/login');
    } else {
        const options = { expiresIn: 86400 };
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                return clearTokenAndNext(err);
            }
            if (decodedToken.exp <= Date.now() / 1000) {
                return clearTokenAndNext(new Error('Token has expired'));
            }

            req.decoded = jwt.verify(token, SECRET, options);
            next();
        });

    }



};



