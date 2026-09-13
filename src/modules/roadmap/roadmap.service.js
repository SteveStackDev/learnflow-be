import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Roadmap from "#models/roadmap.js";

class roadmapService {
  async getAllRoadmaps() {
    try {
      const roadmaps = await Roadmap.find();
      return roadmaps;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy roadmaps thất bại",
      );
    }
  }
}

export default new roadmapService();
