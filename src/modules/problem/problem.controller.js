import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import problemService from "#modules/problem/problem.service.js";

export const getAllProblems = async (req, res) => {
  try {
    const problems = await problemService.getAllProblems();

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "Lấy problems thành công",
      data: problems,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problems thất bại",
    );
  }
};

export const getUserProblems = async (req, res) => {
  try {
    const problems = await problemService.getUserProblems(req);

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "Lấy problems thành công",
      data: problems,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problems thất bại",
    );
  }
};

export const getProblem = async (req, res) => {
  try {
    const problem = await problemService.getProblem(req);

    if (!problem) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: "error",
        message: "Không tìm thấy bài tập",
      });
    }

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "Lấy problem thành công",
      data: problem,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problem thất bại",
    );
  }
};

export const saveProblem = async (req, res) => {
  try {
    const result = await problemService.saveProblem(req);

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "Lưu problem thành công",
      data: result,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lưu problem thất bại",
    );
  }
};