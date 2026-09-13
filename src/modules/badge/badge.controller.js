import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import badgeService from "#modules/badge/badge.service.js";

export const getAllBadges = async (req, res) => {
  try {
    const badges = await badgeService.getAllBadges();

    if (badges) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy badges thành công",
        data: badges,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy badges thất bại",
    );
  }
};
