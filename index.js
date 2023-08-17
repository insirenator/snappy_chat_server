import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { config } from "dotenv";
config();

import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { usersRouter, avatarsRouter, messagesRouter } from "./services/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/auth", usersRouter);
app.use("/api/avatars", avatarsRouter);
app.use("/api/messages", messagesRouter);

app.get("/logo", (req, res) => {
    res.sendFile(__dirname + "/logo.svg");
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error(err.message));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening at PORT: ${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User Added: ", userId);
        console.log({ onlineUsers });

        setTimeout(() => {
            onlineUsers.forEach((socketId, userid) => {
                if(userid !== userId){
                    socket.to(socketId).emit("active-users", [...onlineUsers.keys()].filter((id) => id !== userid));
                    console.log("active users sent to: ", userid);
                }
            })
        }, 500);

    });
    
    socket.on("remove-user", (userId) => {
        onlineUsers.delete(userId);
        console.log("User Removed: ", userId);
        console.log({ onlineUsers });

        setTimeout(() => {
            onlineUsers.forEach((socketId, userid) => {
                if(userid !== userId){
                    socket.to(socketId).emit("active-users", [...onlineUsers.keys()].filter((id) => id !== userid));
                    console.log("active users sent to: ", userid);
                }
            })
        }, 500);
    })


    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
            
        }
    });
});