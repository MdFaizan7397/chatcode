const path = require('path');
const http = require('http');
const express = require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const { userJoin, getCurrentUser, userLeave,getRoomUsers } = require('./utils/Users');
const app=express();
const server=http.createServer(app)
const io =socketio(server);
app.use(express.static(path.join(__dirname,'public')));
const botName='ChatCord Bot';
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(botName,'Welcome to ChatCord'));
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    });

    //send users and room info
    
    

    
    socket.on('disconnects',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
        }
        
    });

    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
        //io.emit('message',msg);
    });
});
const PORT=3000 || process.env.PORT;
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
