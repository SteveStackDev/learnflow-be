import { StatusCodes } from "http-status-codes";
import commentService from "#modules/comment/comment.service.js";

export const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req);
    return res.status(StatusCodes.CREATED).json({
      message: "Tạo bình luận thành công",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComment = async (req, res, next) => {
  try {
    const allComments = await commentService.getAllComment(req);
    return res.status(StatusCodes.OK).json({
      message: "Lấy danh sách bình luận thành công",
      data: allComments,
    });
  } catch (error) {
    next(error);
  }
};
