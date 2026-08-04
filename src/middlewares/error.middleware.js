import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    console.log("Đã bắt được lỗi ApiError: ");
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
      stack: err.stack,
    });
  } else {
    console.log("Đã bắt được lỗi hệ thống khác: ", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      stack: err.stack,
    });
  }
};
