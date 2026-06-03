// websocket
import { createServer } from "http";
import { Server } from "socket.io";

export let websocket = null;

export function setupWebSocket(app) {
  const httpServer = createServer(app);

  let io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join_room", (chatId) => {
      console.log(`Cliente ${socket.id} se unió al chat ${chatId}`);
      socket.join(chatId);
    });
  });

  httpServer.listen(process.env.WEBSOCKET_PORT || 4000);

  websocket = io;
}

