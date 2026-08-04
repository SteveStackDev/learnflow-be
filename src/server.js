import connectServer from "#server.config.js";
import connectDB from "#configs/database.js";
import connectRedis from "#configs/redis.js";
import connectSocketIO, { getIO } from "#configs/socketIO.js";
import exitHook from "async-exit-hook";
import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

connectDB()
  .then(() => {
    connectRedis();
    connectSocketIO();
    connectServer();
    exitHook((done) => {
      const chatNamespace = getIO().of("/chat");
      chatNamespace.disconnectSockets(true);
      setTimeout(() => {
        console.log("Đã ngắt kết nối toàn bộ thiết bị thành công!");
        done();
      }, 300);
    });
  })
  .catch((err) => {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Có lỗi xảy ra. Lỗi: ${err.message}`,
    );
  });
