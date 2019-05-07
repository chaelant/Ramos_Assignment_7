const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redisConnection = require('./worker/redis_connection');

io.on('connection', function(socket){
    // io.emit('new presence', 'A user joined the room');
    console.log('a user connected');

    socket.on('form submitted', function(msg) {

        console.log('received form submission');
        console.log(msg);

        redisConnection.emit('research-request', {
            message: msg
        });
        // io.emit('response message', msg);

        redisConnection.on('research-response', (data, channel) => {
            console.log('received research response');
            // console.log(data.message);
            io.emit('response message', data.message);
        });

    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


http.listen(3000, function() {
    console.log('listening on port 3000');
});
