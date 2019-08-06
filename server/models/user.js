const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    }
});

// encrypt password before save
userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) {
        next();
    } else {
        return bcrypt.hash(user.password, 10)
            .then((hash)=> {
                user.password = hash;
                next();
            })
            .catch(() =>
                next(new Error(`Error hashing password for ${user.username}`)))
    }
});

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next({ message: `username "${doc.username}" already exists`, name: "Duplication error"});
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);