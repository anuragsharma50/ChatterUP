import express from "express";
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import { dbConnect } from "./config/db.js";
import { chatModel } from "./src/schema/chat.schema.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET','POST']
    }
})

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("Connection is established");


    socket.on('join', async username => {
        console.log("username : ", username);
        socket.username = username;
        onlineUsers.push(username);

        socket.emit('new_user', `Welcome ${username}`);
        socket.broadcast.emit('new_user', `${username} join the chats`);

        // get existing msg from db
        try {
            let messages = await chatModel.find({}).sort({createdAt:1}).limit(20)
            socket.emit('load_msg', messages);
        } catch (err) {
            console.log(err);
        }

        socket.broadcast.emit("online_users",onlineUsers);
        socket.emit("online_users",onlineUsers);
    })

    socket.on("new_msg", async (msg) => {
        const chatMessage = {
            username: socket.username,
            msg: msg
        }

        const newMsg = new chatModel(chatMessage);
        await newMsg.save();

        socket.broadcast.emit("broadcast_msg",newMsg);
    })

    socket.on("typing", username => {
        socket.broadcast.emit("someone_typing",username);
    })

    socket.on("stopped_typing", username => {
        socket.broadcast.emit("someone_stopped_typing",username);
    })

    socket.on('disconnect', () => {
        console.log("Disconnected");
        socket.broadcast.emit('new_user', `${socket.username} left the chats`);
        console.log(socket.username);
        console.log(onlineUsers);
        if(onlineUsers.length > 0) {
            let index = onlineUsers.findIndex((name) => name == socket.username);
            onlineUsers.splice(index,1);
        }
        console.log(onlineUsers);
    })
})

server.listen(8500,() => {
    console.log("server is up and running on port 8500");
    dbConnect();
})
