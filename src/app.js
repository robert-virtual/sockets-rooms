const express = require("express");
const app = express();
const uuid = require("uuid").v4;
const port = process.env.PORT || 3000;
const { createServer } = require("http");
const path = require("path");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let rooms = [
  {
    id: "",
    users: [],
  },
];

app.get("/", (req, res) => {
  res.redirect(`/${uuid()}`);
});
app.use(express.static("public"));

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join-room", (roomId, { userName, color }) => {
    let user = { id: socket.id, userName, color };
    socket.join(roomId);
    let room = rooms.find((r) => r.id == roomId);
    if (!room) {
      room = {
        id: roomId,
        users: [],
      };
      rooms.push(room);
    }
    room.users.push(user);
    io.to(socket.id).emit("join", room.users);

    // users.push({roomId,users}});
    socket.to(roomId).emit("new-participant", room.users);
    socket.on("message", (to, msg) => {
      console.log("message: " + msg);
      let user = room.users.find((u) => u.id == socket.id);
      let private = room.users.find((u) => u.id == to);
      if (private) {
        private = true;
      }
      io.to(user.id).emit("message", { msg, user, private });
      socket.to(to).emit("message", { msg, user, private });
      // socket.broadcast.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      room.users = room.users.filter((u) => u.id != socket.id);
      if (room.users.length == 0) {
        rooms = rooms.filter((r) => r.id != room.id);
      }
      console.log("user disconnected");
    });
  });
});

server.listen(port, () => {
  console.log("listening on *:", port);
});
