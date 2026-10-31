import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io("wss://api.rondaonlinebr.com:4001", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("conectado:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("desconectado");
    });
  }

  return socket;
}