import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { httpServer } from "#server.config.js";
import { chatSocketIO } from "#modules/chat/chat.socket.js";

let io = null;

const connectSocketIO = () => {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  console.log("Kết nối SocketIO thành công!");

  chatSocketIO();

  io.on("connection", async (socket) => {
    console.log(`Có thiết bị kết nối: ${socket.id}`);

    socket.on("disconnect", async () => {
      console.log(`Có thiết bị ngắt kết nối: ${socket.id}.`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "SocketIO chưa được khởi tạo!",
    );
  }
  return io;
};

export default connectSocketIO;
