import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Course from "#models/course.js";
import mongoose from "mongoose";
import Chapter from "#models/chapter.js";

class courseService {
  async getAllCourses() {
    try {
      const courses = await Course.find();
      return courses;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy courses thất bại",
      );
    }
  }

  async getCourse(req) {
    try {
      const course = await Course.findById(
        new mongoose.Types.ObjectId(req.params.id),
      );
      return course;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy course thất bại",
      );
    }
  }

  async getCurriculum(req) {
    try {
      const curriculum = await Chapter.aggregate([
        {
          $match: {
            courseId: new mongoose.Types.ObjectId(req.params.courseId),
          },
        },
        {
          $lookup: {
            from: "lessons",
            let: { chapterId: "$_id", courseId: "$courseId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$chapterId", "$$chapterId"] },
                      { $eq: ["$courseId", "$$courseId"] },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  lessonId: "$_id",
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            as: "lessons",
          },
        },
        {
          $addFields: {
            chapterId: "$_id",
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);

      return curriculum;
    } catch (error) {
      console.log(error.message);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy curriculum thất bại",
      );
    }
  }
}

export default new courseService();
