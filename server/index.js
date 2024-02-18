import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http"; // Add this line to import http module
import { Server } from "socket.io";
import cors from "cors";

// Import Routes
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";

const app = express();
dotenv.config(); // get config for mongoDB



const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        throw err;
    });
};

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/server/users", userRoutes);
app.use("/server/auth", authRoutes);
app.use("/server/tweets", tweetRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  


    server.listen(8000, () => {
        connect();
        console.log("SERVER IS RUNNING, PORT 8000");
    });
