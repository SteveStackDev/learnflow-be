import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import commentService from "#modules/comment/comment.service.js";

export const createComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(req);
    if (comment) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Tạo comment thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Tạo comment thất bại",
    );
  }
};

export const getAllComment = async (req, res) => {
  try {
    const allComment = await commentService.getAllComment(req);
    if (allComment) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy comment thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy comment thất bại",
    );
  }
};
