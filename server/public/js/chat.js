
const socket = io.connect('http://localhost:3001');
socket.on('hello', function (data) {
    console.log(data);
    socket.emit('my other event', {my: 'data'});
});