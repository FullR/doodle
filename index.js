import {Server} from "http";
import {createReadStream} from "fs";
import express from "express";
import SocketIO from "socket.io";

const app = express();
const server = Server(app);
const io = SocketIO(server);
const port = 8081;
const strokes = [];
app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("stroke", (stroke) => {
    strokes.push(stroke);
    socket.broadcast.emit("stroke", stroke);
  });

  socket.emit("strokes", strokes);
});

server.listen(port, (error) => {
  if(error) {
    console.log("Failed to start:", error);
  } else {
    console.log(`Listening on port ${port}`);
  }
});
