import mongoose from "mongoose";
import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Comment from "#models/comment.js";

class CommentService {
  async createComment(req) {
    try {
      const authorId =
        req.user?._id ||
        (req.session?.passport?.user?.id
          ? new mongoose.Types.ObjectId(req.session.passport.user.id)
          : null);

      if (!authorId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Vui lòng đăng nhập để bình luận");
      }

      const { content, targetType, targetId, parentId } = req.body;

      if (!content || !targetType || !targetId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Nội dung, loại đối tượng và mã đối tượng là bắt buộc!",
        );
      }

      const newComment = await Comment.create({
        authorId,
        content: content.trim(),
        targetType,
        targetId: new mongoose.Types.ObjectId(targetId),
        parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
      });

      // Populate thông tin người tạo bình luận
      const populatedComment = await Comment.findById(newComment._id).populate(
        "authorId",
        "username avatar email name",
      );

      return populatedComment || newComment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Tạo bình luận thất bại: ${error.message}`,
      );
    }
  }

  async getAllComment(req) {
    try {
      const targetId = req.query?.targetId || req.body?.targetId;
      const targetType = req.query?.targetType || req.body?.targetType;

      const query = {};
      if (targetId) {
        query.targetId = new mongoose.Types.ObjectId(targetId);
      }
      if (targetType) {
        query.targetType = targetType;
      }

      const allComments = await Comment.find(query)
        .populate("authorId", "username avatar email name")
        .sort({ createdAt: -1 });

      return allComments;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Lấy danh sách bình luận thất bại: ${error.message}`,
      );
    }
  }
}

export default new CommentService();
