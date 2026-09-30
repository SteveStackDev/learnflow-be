import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Roadmap from "#models/roadmap.js";
import User from "#models/user.js";

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
      const roadmaps = await User.find({ _id: new mongoose.Types.ObjectId(req.session.passport.user.id) }).populate("roadmaps");
      return roadmaps;
    } catch (error) {
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
        "Lấy roadmaps thất bại",
      );
    }
  }
}

export default new roadmapService();
