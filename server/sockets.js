const socketioJwt = require('socketio-jwt');
const {addMessage} = require('./controllers/chatroom');
const {publishToBotQueue} = require("./services/MQService");
const {jwt} = require('./config');

module.exports = (server) => {
    const io = require('socket.io')(server);

    io.use(socketioJwt.authorize({
        secret: jwt.secret,
        handshake: true
    }));

    const chatIO = io
        .of('/chat')
        .on('connection', (socket) => {

            socket.on('joinChatRoom', (room) => {
                socket.join(room);
                socket.emit('connectedToChatRoom', room);
            });

            socket.on('leaveChatRoom', (room) => {
                socket.leave(room);
            });

            socket.on('emitToChatRoom', ({room, msg, sender}) => {
                const message = {
                    content: msg,
                    sender
                };
                if (msg.match(/^\/stock=/)) { //is bot command
                    publishToBotQueue(JSON.stringify({...message, room, content: msg.split('/stock=')[1]}))
                } else {
                    addMessage({_id: room, message})
                        .then(() => chatIO.to(room).emit("newMessage", message))
                }

            });
        });

    const sendChatMessage = ({room, content, sender}) => {
        console.log('alonso', {room, content, sender})
        return chatIO.to(room).emit("newMessage", {
            createdAt: Date.now(),
            content,
            sender
        })
    };

    return {
        io,
        sendChatMessage
    };
};
