import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Comment from "#models/comment.js";

class commentService {
  async createComment(req) {
    try {
      const newComment = await Comment.insertOne({
        authorId: new mongoose.Types.ObjectId(req.session.passport.user.id),
        content: req.body.content,
        targetType: req.body.targetType,
        parentId: req.body.parentId ? req.body.parentId : null,
      });

      if (newComment) {
        return newComment;
      }

      return;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Tạo comment thất bại",
      );
    }
  }

  async getAllComment(req) {
    try {
      const allComment = await Comment.find({
        targetId: req.body.targetId,
      }).sort({ parentId: 1 });

      if (allComment) {
        allComment.forEach((comment) => {
          if (comment.parentId === null) {
            comment.childrenComments = [];
          } else {
            const childrenComment = comment;
            allComment.find((comment) => {
              if (
                comment._id.toString() === childrenComment.parentId.toString()
              ) {
                if (comment.childrenComments) {
                  comment.childrenComments.push(childrenComment);
                } else {
                  comment.childrenComments = [];
                  comment.childrenComments.push(childrenComment);
                }
              }
            });
          }
        });

        return allComment;
      }
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy comment thất bại",
      );
    }
  }
}

export default new commentService();
