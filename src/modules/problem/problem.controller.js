import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import problemService from "#modules/problem/problem.service.js";

export const getAllProblems = async (req, res) => {
  try {
    const problems = await problemService.getAllProblems();

    if (problems) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy problems thành công",
        data: problems,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problems thất bại",
    );
  }
};

export const getProblem = async (req, res) => {
  try {
    const problems = await problemService.getProblem();

    if (problems) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy problems thành công",
        data: problems,
      });
    }
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

    if (problems) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy problems thành công",
        data: problems,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problems thất bại",
    );
  }
};

export const saveProblem = async (req, res) => {
  try {
    await problemService.saveProblem(req);

    if (problems) {
      res.status(StatusCodes.OK).send({
        status: "success",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy problems thất bại",
    );
  }
};
