import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import courseService from "#modules/course/course.service.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();

    if (courses) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy course thành công",
        data: courses,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy courses thất bại",
    );
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await courseService.getCourse(req);

    if (course) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy course thành công",
        data: course,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy course thất bại",
    );
  }
};

export const getCurriculum = async (req, res) => {
  try {
    const curriculum = await courseService.getCurriculum(req);

    if (curriculum) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy curriculum thành công",
        data: curriculum,
      });
    }
  } catch (error) {
    console.log(error.message);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy curriculum thất bại",
    );
  }
};
