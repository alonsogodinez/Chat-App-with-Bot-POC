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
            .then(()=> {
                user.password = hash;
                next();
            })
            .catch(() => next(new Error(`Error hashing password for ${user.name}`)))
    }
});

module.exports = mongoose.model('User', userSchema);