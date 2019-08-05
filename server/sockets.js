module.exports = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log("connected")
        socket.emit('hello', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });

    return io;
};
