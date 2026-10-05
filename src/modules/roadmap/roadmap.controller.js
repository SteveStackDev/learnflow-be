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

export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getUserRoadmaps(req);

    if (roadmaps) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy roadmaps của người dùng thành công",
        data: roadmaps,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy roadmaps của người dùng thất bại",
    );
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.getRoadmap(req);

    if (roadmap) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy roadmap thành công",
        data: roadmap,
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy roadmap thất bại",
    );
  }
};

export const createRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.createRoadmap(req);
    res.status(StatusCodes.CREATED).send({
      status: "success",
      message: "Tạo roadmap thành công",
      data: roadmap,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Tạo roadmap thất bại",
    );
  }
};

export const updateRoadmap = async (req, res) => {
  try {
    const result = await roadmapService.updateRoadmap(req);
    res.status(StatusCodes.OK).send({
      status: "success",
      message: "Cập nhật roadmap thành công",
      data: result,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Cập nhật roadmap thất bại: ${error.message}`,
    );
  }
};

export const deleteRoadmap = async (req, res) => {
  try {
    const result = await roadmapService.deleteRoadmap(req);
    res.status(StatusCodes.OK).send({
      status: "success",
      message: "Xóa roadmap thành công",
      data: result,
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Xóa roadmap thất bại",
    );
  }
};