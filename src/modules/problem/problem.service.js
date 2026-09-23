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
      const problem = await Problem.find({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
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
      const problems = await UserProblem.find({
        _id: new mongoose.Types.ObjectId(req.session.passport.user.id),
      });
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
      await UserProblem.insertOne(req.body);
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy problems thất bại",
      );
    }
  }
}

export default new problemService();
