import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const ensureAuthSocket = (socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Chưa đăng nhập / đăng ký");
  }
};
