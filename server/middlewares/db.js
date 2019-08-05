const mongoose = require('mongoose');

module.exports.checkDBConnection = (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        next()
    } else {
        next(new Error('Database is not connected'))
    }
};
