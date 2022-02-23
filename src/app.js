const express = require("express");
const app = express();
const uuid = require("uuid").v4;

const { createServer } = require("http");
const path = require("path");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];

app.get("/", (req, res) => {
  res.redirect(`/${uuid()}`);
});
app.use(express.static("public"));

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("message", (to, msg) => {
    console.log("message: " + msg);
    let user = users.find((u) => u.id == socket.id);
    let private = users.find((u) => u.id == to);
    if (private) {
      private = true;
    }
    io.to(user.id).emit("message", { msg, user, private });
    socket.to(to).emit("message", { msg, user, private });
    // socket.broadcast.emit("chat message", msg);
  });

  socket.on("join-room", (roomId, { userName, color }) => {
    let user = { id: socket.id, userName, color };
    socket.join(roomId);
    io.to(socket.id).emit("join", users);

    // users.push({roomId,users}});
    users.push(user);
    socket.to(roomId).emit("new-participant", users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
