import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Problem from "#models/problem.js";
import UserProblem from "#models/userSubmission.js";
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

  async getUserProblems(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.session?.passport?.user?._id;
      const problems = await UserProblem.find({ userId });
      return problems;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }

  async saveProblem(req) {
    try {
      await UserProblem.create(req.body);
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lưu problem thất bại",
      );
    }
  }
}

export default new problemService();
