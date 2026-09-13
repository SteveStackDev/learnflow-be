import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import roadmapService from "#modules/roadmap/roadmap.service.js";

export const getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getAllRoadmaps();

    if (roadmaps) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy roadmaps thành công",
        data: roadmaps,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy roadmaps thất bại",
    );
  }
};
