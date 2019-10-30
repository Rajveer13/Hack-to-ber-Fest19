var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];


server.listen(process.env.port || 3000);
console.log("server is listening...");

app.get('/',function(_req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
  });
  

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets disconnected", connections.length);
    });

    socket.on('send message', function(data){
            io.sockets.emit('new message', {msg:data, user: socket.username});
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit('get users', users);
    }
});