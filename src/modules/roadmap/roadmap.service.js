import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Roadmap from "#models/roadmap.js";
import User from "#models/user.js";
import mongoose from "mongoose";

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

  async createRoadmap(req) {
    try {
      const data = req.body || req;
      
      const generatedSlug = (data.slug?.trim() || data.title?.trim()?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""))?.toLowerCase();

      const roadmapData = {
        title: data.title?.trim(),
        slug: generatedSlug,
        duration: Number(data.duration) || 1,
        description: data.description?.trim() || "Chưa có mô tả lộ trình",
        thumbnail: data.thumbnail?.trim() || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        level: ["beginner", "intermediate", "advanced"].includes(data.level) ? data.level : "beginner",
        tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean) : [],
        labels: Array.isArray(data.labels) ? data.labels.map((l) => String(l).trim()).filter(Boolean) : [],
        roadmap: Array.isArray(data.roadmap)
          ? data.roadmap.map((s, idx) => ({
              stepNumber: s.stepNumber || idx + 1,
              stepName: s.stepName?.trim() || `Bước ${idx + 1}`,
              stepDescription: s.stepDescription?.trim() || "Mô tả chi tiết bước học",
              tags: Array.isArray(s.tags)
                ? s.tags.map((t) => String(t).trim()).filter(Boolean)
                : typeof s.tags === "string"
                ? s.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [],
              status: ["completed", "incompleted", "in_progress"].includes(s.status) ? s.status : "incompleted",
              stepAttachedCourses: Array.isArray(s.stepAttachedCourses)
                ? s.stepAttachedCourses.filter((cId) => mongoose.isValidObjectId(cId))
                : [],
            }))
          : [],
        recommendedCourses: Array.isArray(data.recommendedCourses)
          ? data.recommendedCourses.filter((cId) => mongoose.isValidObjectId(cId))
          : [],
        recommendedProblems: Array.isArray(data.recommendedProblems)
          ? data.recommendedProblems.filter((pId) => mongoose.isValidObjectId(pId))
          : [],
      };

      const newRoadmap = new Roadmap(roadmapData);
      await newRoadmap.save();
      return newRoadmap;
    } catch (error) {
      console.error("Lỗi createRoadmap:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Tạo roadmap thất bại: ${error.message}`,
      );
    }
  }

  async updateRoadmap(req) {
    try {
      const id = req.params?.id || req.body?.id || req.body?._id || req.params?.slug;
      const data = req.body || req;
      
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.slug !== undefined) updateData.slug = data.slug.trim().toLowerCase();
      if (data.duration !== undefined) updateData.duration = Number(data.duration) || 1;
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail.trim();
      if (data.level !== undefined) {
        updateData.level = ["beginner", "intermediate", "advanced"].includes(data.level) ? data.level : "beginner";
      }
      if (data.tags !== undefined) {
        updateData.tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean) : [];
      }
      if (data.labels !== undefined) {
        updateData.labels = Array.isArray(data.labels) ? data.labels.map((l) => String(l).trim()).filter(Boolean) : [];
      }
      
      if (data.roadmap !== undefined && Array.isArray(data.roadmap)) {
        updateData.roadmap = data.roadmap.map((s, idx) => ({
          stepNumber: s.stepNumber || idx + 1,
          stepName: s.stepName?.trim() || `Bước ${idx + 1}`,
          stepDescription: s.stepDescription?.trim() || "Mô tả chi tiết bước học",
          tags: Array.isArray(s.tags)
            ? s.tags.map((t) => String(t).trim()).filter(Boolean)
            : typeof s.tags === "string"
            ? s.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          status: ["completed", "incompleted", "in_progress"].includes(s.status) ? s.status : "incompleted",
          stepAttachedCourses: Array.isArray(s.stepAttachedCourses)
            ? s.stepAttachedCourses.filter((cId) => mongoose.isValidObjectId(cId))
            : [],
        }));
      }

      if (data.recommendedCourses !== undefined) {
        updateData.recommendedCourses = Array.isArray(data.recommendedCourses)
          ? data.recommendedCourses.filter((cId) => mongoose.isValidObjectId(cId))
          : [];
      }

      if (data.recommendedProblems !== undefined) {
        updateData.recommendedProblems = Array.isArray(data.recommendedProblems)
          ? data.recommendedProblems.filter((pId) => mongoose.isValidObjectId(pId))
          : [];
      }

      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { _id: id }, { slug: id }] }
        : { $or: [{ _id: id }, { slug: id }] };
      const updated = await Roadmap.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });
      return updated;
    } catch (error) {
      console.error("Lỗi updateRoadmap:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cập nhật roadmap thất bại: ${error.message}`,
      );
    }
  }

  async deleteRoadmap(req) {
    try {
      const roadmapId = new mongoose.Types.ObjectId(req.params.id);
      await Roadmap.findByIdAndDelete(roadmapId);
      return { message: "Roadmap deleted successfully" };
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Xóa roadmap thất bại",
      );
    }
  }
}

export default new roadmapService();