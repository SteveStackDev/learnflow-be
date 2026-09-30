import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Roadmap from "#models/roadmap.js";
import User from "#models/user.js";
import mongoose from "mongoose"; // <-- Đã bổ sung import mongoose

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

  async getUserRoadmaps(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) return [];

      const user = await User.findById(new mongoose.Types.ObjectId(userId)).populate("roadmaps");
      return user?.roadmaps || [];
    } catch (error) {
      console.error("Lỗi getUserRoadmaps:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy roadmaps thất bại",
      );
    }
  }

  async getRoadmap(req) {
    try {
      const roadmap = await Roadmap.findOne({ slug: req.params.slug }).populate(
        "recommendedCourses",
      );
      return roadmap;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy roadmap thất bại",
      );
    }
  }
}

export default new roadmapService();