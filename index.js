import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { error } from "./middleware/error.js";
import auth from "./routes/auth.js";
import chats from "./routes/chats.js";
import messages from "./routes/messages.js";
import anonys from "./routes/anonys.js";
import users from "./routes/users.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/chats", chats);
app.use("/api/messages", messages);
app.use("/api/anonys", anonys);
app.use(error);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Listening on posrt ${port}...`)
);

mongoose
  .set("strictQuery", false)
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(`Could't connected to MongoDB... ${err}`));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("add-user", (user) => {
    if (!activeUsers.find((u) => u._id === user._id)) {
      activeUsers.push({ ...user, socketId: socket.id });
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
});
