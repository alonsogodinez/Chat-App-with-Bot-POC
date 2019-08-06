const ObjectId = require('mongoose').Types.ObjectId;
const ChatRoom = require('../models/chatroom');

module.exports = {
    create(req, res) {
        const { name } = req.body;
        return ChatRoom.create({ name })
            .then(chatRoom => {console.log("alonso22", chatRoom)
                res.json({ chatRoom} )
            })
            .catch(err => {
                res.status(500).send({error: err.name, message: err.message})
            })
    },

    list(req, res) {
        return ChatRoom.find()
            .then(chatRooms => res.json({chatRooms}))
            .catch(err => res.status(500).send({error: err}))
    },
    getChatRoom(req, res) {
        let skip = req.query.skip || 0;
        return ChatRoom.aggregate( [ { $match : { _id : new ObjectId(req.params.id) } },
                { $unwind : "$messages" } ,
                { $sort : { 'messages.createdAt' : -1} },
                { $limit : 5 },
                { $project : {
                    'content':'$messages.content',
                    'createdAt':'$messages.createdAt',
                    'sender':'$messages.sender'}
                }])

            .then(messages => res.json({chatRoom: {messages}}))
            .catch(err => res.status(500).send({error: err}))
    },

    addMessage({_id, message}) {
        return ChatRoom.findOne({_id: new ObjectId(_id)}).then((chatRoom) => {
            chatRoom.messages.unshift(message);
            return chatRoom.save()
        })
    }

};