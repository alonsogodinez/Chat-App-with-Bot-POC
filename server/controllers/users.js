const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwt: { secret : JWT_SECRET} } = require('../config')

module.exports = {
    add(req, res) {
        const { username, password } = req.body;
        const user = new User({ username, password });
        return user.save()
            .then( user => res.json({ user: { username: user.username } }))
            .catch(err => {
                res.status(500).send({ error: err.name, ...err.errors, message: err.message})
            })
    },

    list(req, res) {
        return User.find()
            .then(users => res.json({users}))
            .catch(err => res.status(500).send({ error: err}))
    },
    login(req, res) {

        const { username, password } = req.body;

        User.findOne({username})
            .then((user) => {
                return bcrypt.compare(password, user.password)
            })
            .then(match => {
                if (match) {
                    const payload = { username };
                    const options = { expiresIn: 86400 };
                    const token = jwt.sign(payload, JWT_SECRET, options);

                    res.status(200)
                        .cookie('token', token, { maxAge: 86400 })
                        .send({ token })
                } else {
                    res.status(401).send({ error: 'Authentication error', message: "The username or password is incorrect" })
                }

            })
            .catch(err => res.status(500).send({ error: err}))
    },
    logout(req, res) {
        res.clearCookie("token");
        res.sendStatus(200);
    }

};