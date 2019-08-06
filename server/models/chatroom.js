const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    name: 'string',
    messages: [{
        sender: 'string',
        content: 'string',
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});



module.exports = mongoose.model('ChatRoom', chatRoomSchema);