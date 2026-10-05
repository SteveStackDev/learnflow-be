import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import Course from "#models/course.js";
import Chapter from "#models/chapter.js";
import Lesson from "#models/lesson.js";
import userCourse from "#models/userCourse.js";
import mongoose from "mongoose";

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

  async getUserCourses(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) return [];
      const courses = await userCourse.find({ userId: new mongoose.Types.ObjectId(userId) }).populate("courseId");
      return courses;
    } catch (error) {
      console.error("Lỗi getUserCourses:", error);
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
          $sort: { order: 1 },
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
                $sort: { order: 1 },
              },
              {
                $addFields: {
                  lessonId: "$_id",
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
      ]);

      return curriculum;
    } catch (error) {
      console.error("Lỗi getCurriculum:", error.message);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy curriculum thất bại",
      );
    }
  }

  async deleteCourse(req) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.id);
      await Course.findByIdAndDelete(courseId);
      await Chapter.deleteMany({ courseId });
      await Lesson.deleteMany({ courseId });
      await userCourse.deleteMany({ courseId });
      return { message: "Course deleted successfully" };
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Xóa course thất bại",
      );
    }
  }

  async createCourse(req) {
    try {
      const data = req.body || req;
      
      const generatedSlug = (data.slug?.trim() || data.title?.trim()?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""))?.toLowerCase();

      const courseData = {
        title: data.title?.trim(),
        slug: generatedSlug,
        description: data.description?.trim() || "Chưa có mô tả khóa học",
        thumbnail: data.thumbnail?.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        promoVideoUrl: data.promoVideoUrl?.trim() || "https://www.youtube.com",
        benefits: Array.isArray(data.benefits) && data.benefits.filter(Boolean).length > 0
          ? data.benefits.filter(Boolean)
          : ["Nắm vững kiến thức chuyên sâu và thực chiến"],
        requirements: Array.isArray(data.requirements) && data.requirements.filter(Boolean).length > 0
          ? data.requirements.filter(Boolean)
          : ["Không yêu cầu kiến thức nền tảng trước"],
        category: data.category?.trim() || "Lập trình Web",
        tags: Array.isArray(data.tags) && data.tags.filter(Boolean).length > 0
          ? data.tags.filter(Boolean)
          : ["course", "programming"],
        price: data.isFree ? 0 : (Number(data.price) || 0),
        salePrice: data.isFree ? 0 : (Number(data.salePrice) || 0),
        stats: {
          lessons: Number(data.stats?.lessons ?? data.lessonsCount ?? 0),
          duration: Number(data.stats?.duration ?? data.durationHours ?? 0),
          learners: Number(data.stats?.learners ?? 0),
          rating: Number(data.stats?.rating ?? 5.0),
          reviews: Number(data.stats?.reviews ?? 0),
        },
        level: ["beginner", "intermediate", "advanced"].includes(data.level) ? data.level : "beginner",
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        isFree: Boolean(data.isFree),
      };

      const newCourse = new Course(courseData);
      await newCourse.save();

      // Lưu các Chương (Chapters) và Bài học nhỏ (Lessons) nếu được gửi kèm
      if (Array.isArray(data.chapters) && data.chapters.length > 0) {
        let totalLessonsCount = 0;
        let totalDurationMinutes = 0;

        for (let cIdx = 0; cIdx < data.chapters.length; cIdx++) {
          const ch = data.chapters[cIdx];
          const newChapter = new Chapter({
            courseId: newCourse._id,
            title: ch.title?.trim() || `Chương ${cIdx + 1}`,
            order: ch.order || cIdx + 1,
            isPublished: ch.isPublished !== undefined ? ch.isPublished : true,
            isPreview: ch.isPreview || false,
          });
          await newChapter.save();

          if (Array.isArray(ch.lessons) && ch.lessons.length > 0) {
            for (let lIdx = 0; lIdx < ch.lessons.length; lIdx++) {
              const ls = ch.lessons[lIdx];
              const dur = Number(ls.duration) || 0;
              const newLesson = new Lesson({
                courseId: newCourse._id,
                chapterId: newChapter._id,
                title: ls.title?.trim() || `Bài học ${lIdx + 1}`,
                description: ls.description?.trim() || "",
                thumbnail: ls.thumbnail?.trim() || newCourse.thumbnail,
                order: ls.order || lIdx + 1,
                videoUrl: ls.videoUrl?.trim() || "",
                duration: dur,
                isPreview: ls.isPreview || false,
                isPublished: ls.isPublished !== undefined ? ls.isPublished : true,
              });
              await newLesson.save();
              totalLessonsCount++;
              totalDurationMinutes += dur;
            }
          }
        }

        if (totalLessonsCount > 0) {
          newCourse.stats.lessons = totalLessonsCount;
          if (totalDurationMinutes > 0) {
            newCourse.stats.duration = Math.max(1, Math.round(totalDurationMinutes / 60));
          }
          await newCourse.save();
        }
      }

      return newCourse;
    } catch (error) {
      console.error("Lỗi createCourse:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Tạo course thất bại: ${error.message}`,
      );
    }
  }

  async updateCourse(req) {
    try {
      const id = req.params?.id || req.body?.id || req.body?._id;
      const data = req.body || req;
      
      const updateData = {};
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.slug !== undefined) updateData.slug = data.slug.trim().toLowerCase();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail.trim();
      if (data.promoVideoUrl !== undefined) updateData.promoVideoUrl = data.promoVideoUrl.trim();
      if (data.benefits !== undefined) {
        updateData.benefits = Array.isArray(data.benefits)
          ? data.benefits.map((b) => String(b).trim()).filter(Boolean)
          : [String(data.benefits).trim()];
        if (updateData.benefits.length === 0) updateData.benefits = ["Nắm vững kiến thức chuyên sâu"];
      }
      if (data.requirements !== undefined) {
        updateData.requirements = Array.isArray(data.requirements)
          ? data.requirements.map((r) => String(r).trim()).filter(Boolean)
          : [String(data.requirements).trim()];
        if (updateData.requirements.length === 0) updateData.requirements = ["Không yêu cầu kiến thức trước"];
      }
      if (data.category !== undefined) updateData.category = data.category.trim();
      if (data.tags !== undefined) {
        updateData.tags = Array.isArray(data.tags)
          ? data.tags.map((t) => String(t).trim()).filter(Boolean)
          : [String(data.tags).trim()];
        if (updateData.tags.length === 0) updateData.tags = ["course"];
      }
      if (data.price !== undefined) updateData.price = data.isFree ? 0 : Number(data.price) || 0;
      if (data.salePrice !== undefined) updateData.salePrice = data.isFree ? 0 : Number(data.salePrice) || 0;
      if (data.level !== undefined) {
        updateData.level = ["beginner", "intermediate", "advanced"].includes(data.level) ? data.level : "beginner";
      }
      if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
      if (data.isFree !== undefined) updateData.isFree = Boolean(data.isFree);
      
      if (data.stats || data.lessonsCount !== undefined || data.durationHours !== undefined) {
        updateData.stats = {
          lessons: Number(data.stats?.lessons ?? data.lessonsCount ?? 0),
          duration: Number(data.stats?.duration ?? data.durationHours ?? 0),
          learners: Number(data.stats?.learners ?? 0),
          rating: Number(data.stats?.rating ?? 5.0),
          reviews: Number(data.stats?.reviews ?? 0),
        };
      }

      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { _id: id }] }
        : { _id: id };
      const updated = await Course.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });

      // Nếu có cập nhật danh sách Chương & Bài học nhỏ
      if (updated && Array.isArray(data.chapters)) {
        const courseObjectId = updated._id;
        await Chapter.deleteMany({ courseId: courseObjectId });
        await Lesson.deleteMany({ courseId: courseObjectId });

        let totalLessonsCount = 0;
        let totalDurationMinutes = 0;

        for (let cIdx = 0; cIdx < data.chapters.length; cIdx++) {
          const ch = data.chapters[cIdx];
          const newChapter = new Chapter({
            courseId: courseObjectId,
            title: ch.title?.trim() || `Chương ${cIdx + 1}`,
            order: ch.order || cIdx + 1,
            isPublished: ch.isPublished !== undefined ? ch.isPublished : true,
            isPreview: ch.isPreview || false,
          });
          await newChapter.save();

          if (Array.isArray(ch.lessons) && ch.lessons.length > 0) {
            for (let lIdx = 0; lIdx < ch.lessons.length; lIdx++) {
              const ls = ch.lessons[lIdx];
              const dur = Number(ls.duration) || 0;
              const newLesson = new Lesson({
                courseId: courseObjectId,
                chapterId: newChapter._id,
                title: ls.title?.trim() || `Bài học ${lIdx + 1}`,
                description: ls.description?.trim() || "",
                thumbnail: ls.thumbnail?.trim() || updated.thumbnail,
                order: ls.order || lIdx + 1,
                videoUrl: ls.videoUrl?.trim() || "",
                duration: dur,
                isPreview: ls.isPreview || false,
                isPublished: ls.isPublished !== undefined ? ls.isPublished : true,
              });
              await newLesson.save();
              totalLessonsCount++;
              totalDurationMinutes += dur;
            }
          }
        }

        if (totalLessonsCount > 0) {
          updated.stats.lessons = totalLessonsCount;
          if (totalDurationMinutes > 0) {
            updated.stats.duration = Math.max(1, Math.round(totalDurationMinutes / 60));
          }
          await updated.save();
        }
      }

      return updated;
    } catch (error) {
      console.error("Lỗi updateCourse:", error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cập nhật course thất bại: ${error.message}`,
      );
    }
  }
}

export default new courseService();