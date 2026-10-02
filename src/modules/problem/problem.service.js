import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Problem from "#models/problem.js";
import userProblem from "#models/userProblem.js";
import User from "#models/user.js";
import mongoose from "mongoose";

class problemService {
  async getAllProblems() {
    try {
      const problems = await Problem.find();
      return problems;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }

  async getUserProblems(req) {
    try {
      const userId =
        req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) return [];

      const problems = await userProblem
        .find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate("problemId")
        .sort({ createdAt: -1 });

      return problems;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }

  async getProblem(req) {
    try {
      const id = req?.params?.id || req;
      const problem = await Problem.findById(id);
      return problem;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problem thất bại",
      );
    }
  }

  async saveProblem(req) {
    try {
      const userId =
        req.body?.userId ||
        req.session?.passport?.user?.id ||
        req.user?._id ||
        req.user?.id;

      if (!userId) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Người dùng chưa đăng nhập",
        );
      }

      const problemId = req.body?.problemId;

      // 1. Tạo bản ghi kết quả nộp bài trong UserProblem
      const newSubmission = await userProblem.create({
        ...req.body,
        userId: new mongoose.Types.ObjectId(userId),
        problemId: new mongoose.Types.ObjectId(problemId),
      });

      // 2. Push problemId vào mảng problems của User (không trùng lặp)
      if (problemId) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { problems: new mongoose.Types.ObjectId(problemId) },
        });
      }

      return newSubmission;
    } catch (error) {
      console.error("Lỗi khi saveProblem:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Lưu problem thất bại: ${error.message}`,
      );
    }
  }
}

export default new problemService();