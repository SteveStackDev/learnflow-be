import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Badge from "#models/badge.js";

class badgeService {
  async getAllBadges() {
    try {
      const badges = await Badge.find();
      return badges;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy badges thất bại",
      );
    }
  }
}

export default new badgeService();
