require('dotenv').config()

const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const messageFormat = require("./utils/messageFormat");
const {
  joinUser,
  getCurrentUser,
  leaveUser,
  roomUsers,
} = require("./utils/users");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const appName = "Alumni";

app.use(express.static(path.join(__dirname, "public")));

// setting up socket-connection
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // getting user details and inserting user into a users array
    console.log(room);
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    // emitting to the user
    socket.emit("message", messageFormat(appName, "welcome to the chat"));

    // emitting to the other room members
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormat(appName, `${username} has joined the chat`)
      );

    // getting user messages
    socket.on("chat-message", (m) => {
      io.to(user.room).emit("message", messageFormat(user.username, m));
    });

    // room users info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: roomUsers(room)
    });

    // when user disconnects
    socket.on("disconnect", () => {
      const user = leaveUser(socket.id);
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          messageFormat(appName, `${username} has left the chat`)
        );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: roomUsers(room),
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("this is the homepage");
  res.sendFile("index");
});

const PORT =  3001

server.listen(PORT, () => {
  console.log(`server is running on ${PORT} `);

});
