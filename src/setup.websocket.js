// websocket
import { createServer } from "http";
import { Server } from "socket.io";

export function setupWebSocket(app) {
  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
  });

  httpServer.listen(process.env.WEBSOCKET_PORT || 4000);
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io no inicializado");
  }

  return io;
}

export const websocket = getIO();