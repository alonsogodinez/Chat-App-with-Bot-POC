const socketioJwt = require('socketio-jwt');
const { addMessage } = require('./controllers/chatroom');
const { publishToBotQueue } = require("./services/MQService");
const { jwt } = require('./config');


module.exports = (server) => {
    const io = require('socket.io')(server);

    io.use(socketioJwt.authorize({
        secret: jwt.secret,
        handshake: true
    }));

    const chat = io
        .of('/chat')
        .on('connection', (socket) => {

            socket.on('joinChatRoom', (room) => {
                socket.join(room);
                socket.emit('connectedToChatRoom', room);
            });

            socket.on('leaveChatRoom', (room) => {
                socket.leave(room);
            });

            socket.on('emitToChatRoom', ({ room, msg, sender}) => {
                const message = {
                    content: msg,
                    sender
                };
                if (msg.match(/^\/stock=/)) { //is bot command
                    publishToBotQueue(msg.split('/stock=')[1])
                        .then((response) => chat.to(room).emit("newMessage", {
                            createdAt: Date.now(),
                            content: response,
                            sender
                        }))
                } else {
                    addMessage({ _id: room, message })
                        .then(() => chat.to(room).emit("newMessage", message))
                }

            });
        });

    return io;
};
