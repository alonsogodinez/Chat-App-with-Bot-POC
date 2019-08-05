const mongoose = require('mongoose');
const { mongo: { user, pass, db, host, port } } = require('../config');

module.exports.getMongoURI = () => {
    console.log(`mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`)
    return `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`
};

module.exports.setDBListeners = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log("connected successfully")
    });
};