const jwt = require('jsonwebtoken');
const { jwt: { secret : SECRET} } = require('../config');

module.exports.isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const options = { expiresIn: '2d' };
        try {
            req.decoded = jwt.verify(token, SECRET, options);;
            next();
        } catch (err) {
            next(new Error(err));
        }
    } else {
        if(req.method.toLowerCase() === "GET"){
            res.redirect('/login');
        } else {
            res.sendStatus(401)
        }

    }

};



