import User from "#models/user.js";
import otpService from "#services/otp.service.js";
import uploadService from "#services/upload.service.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwtService from "#services/jwt.service.js";
import mailService from "#services/mail.service.js";
import UserCourse from "#models/userCourse.js";
import Chapter from "#models/chapter.js";

const saltRounds = 10;

class UserService {
  async changeAvatar(req) {
    let uploadedFile = null;

    try {
      if (req.file) {
        uploadedFile = await uploadService.uploadFile(
          req.file.path,
          "LearnFlow/avatars",
          "image",
        );
      }

      const userId = req.session?.passport?.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập");

      if (!uploadedFile) {
        throw new Error("File tải lên không hợp lệ");
      }

      const userNewAvatar = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(userId),
        { avatar: { url: uploadedFile.url, urlId: uploadedFile.url_id } },
        { new: true }
      );

      return userNewAvatar;
    } catch (error) {
      if (uploadedFile?.url_id) {
        await uploadService.deleteFile(uploadedFile.url_id, "image");
      }
      throw error;
    }
  }

  async addNewFriend(req) {
    try {
      const currentUserId = req.session?.passport?.user?.id;
      const receiverId = req.body?.receiverId;

      if (!currentUserId || !receiverId) {
        throw new Error("Thiếu thông tin người dùng");
      }

      const [receiverUpdate, senderUpdate] = await Promise.all([
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(receiverId),
            "friends.userId": { $ne: new mongoose.Types.ObjectId(currentUserId) },
          },
          {
            $addToSet: {
              friends: {
                userId: new mongoose.Types.ObjectId(currentUserId),
                status: "pending",
              },
            },
          },
        ),
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(currentUserId),
            "friends.userId": { $ne: new mongoose.Types.ObjectId(receiverId) },
          },
          {
            $addToSet: {
              friends: {
                userId: new mongoose.Types.ObjectId(receiverId),
                status: "pending",
              },
            },
          },
        ),
      ]);

      return { receiverUpdate, senderUpdate };
    } catch (error) {
      console.error("Lỗi addNewFriend:", error.message);
      throw error;
    }
  }

  async replyNewFriend(req) {
    try {
      const currentUserId = req.session?.passport?.user?.id;
      const receiverId = req.body?.receiverId;

      const [receiverUpdate, senderUpdate] = await Promise.all([
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(receiverId),
            "friends.userId": new mongoose.Types.ObjectId(currentUserId),
          },
          { $set: { "friends.$.status": req.body.status } },
        ),
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(currentUserId),
            "friends.userId": new mongoose.Types.ObjectId(receiverId),
          },
          { $set: { "friends.$.status": req.body.status } },
        ),
      ]);

      return { receiverUpdate, senderUpdate };
    } catch (error) {
      console.error("Lỗi replyNewFriend:", error.message);
      throw error;
    }
  }

  async getAllFriend(req) {
    try {
      const currentUserId = req.session?.passport?.user?.id;
      const friendsList = await User.findOne(
        { _id: new mongoose.Types.ObjectId(currentUserId) },
        { friends: 1, _id: 0 },
      );

      return friendsList?.friends || [];
    } catch (error) {
      console.error("Lỗi getAllFriend:", error.message);
      throw error;
    }
  }

  async forgotPassword(req) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("Email không tồn tại trong hệ thống");
      }

      const token = jwtService.generateJWT({ id: user._id });

      if (token) {
        await mailService.sendMail(user.email, "Mã OTP Quên Mật Khẩu", "otp.page.hbs", {
          userName: user.username,
          otpCode: await otpService.generateOTP(user.email),
          expiryMinutes: "3",
        });

        return token;
      }
    } catch (error) {
      console.error("Lỗi forgotPassword:", error.message);
      throw error;
    }
  }

  async verifyOTP(req) {
    try {
      const data = await jwtService.validateJWT(req);
      if (!data?.id) throw new Error("Token không hợp lệ");

      const user = await User.findById(new mongoose.Types.ObjectId(data.id));

      if (user) {
        return await otpService.validateOTP(user.email, req.body.otp);
      }
      throw new Error("Người dùng không tồn tại");
    } catch (error) {
      console.error("Lỗi verifyOTP:", error.message);
      throw error;
    }
  }

  async changePassword(req) {
    try {
      const data = await jwtService.validateJWT(req);
      if (!data?.id) throw new Error("Token không hợp lệ");

      const user = await User.findById(new mongoose.Types.ObjectId(data.id));
      if (!user) throw new Error("Người dùng không tồn tại");

      const newPassword = req.body.newPassword || req.body.password;
      if (!newPassword) throw new Error("Mật khẩu mới không được để trống");

      const hashed_password = await bcrypt.hash(newPassword, saltRounds);
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashed_password } }
      );

      return { success: true, message: "Đổi mật khẩu thành công" };
    } catch (error) {
      console.error("Lỗi changePassword:", error.message);
      throw error;
    }
  }

  async changeUsername(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập hoặc phiên làm việc hết hạn");

      const user = await User.findById(new mongoose.Types.ObjectId(userId));
      if (!user) throw new Error("Người dùng không tồn tại");

      const newUsername = req.body?.username ? String(req.body.username).trim() : "";

      if (!newUsername) {
        throw new Error("Tên người dùng không được để trống");
      }

      if (newUsername.length < 3 || newUsername.length > 30) {
        throw new Error("Tên người dùng phải có độ dài từ 3 đến 30 ký tự");
      }

      const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
      if (!usernameRegex.test(newUsername)) {
        throw new Error("Tên người dùng chỉ được chứa chữ cái, chữ số, dấu gạch dưới (_), gạch ngang (-) hoặc dấu chấm (.)");
      }

      // Nếu username trùng với username hiện tại
      if (user.username === newUsername) {
        return {
          success: true,
          message: "Tên người dùng không thay đổi",
          username: newUsername,
        };
      }

      // Kiểm tra xem username mới đã có ai sử dụng chưa (trừ chính user này)
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${newUsername}$`, "i") },
        _id: { $ne: user._id },
      });

      if (existingUser) {
        throw new Error("Tên người dùng này đã có người sử dụng, vui lòng chọn tên khác");
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { username: newUsername } }
      );

      // Đồng bộ thông tin trong session nếu có
      if (req.session?.passport?.user) {
        req.session.passport.user.username = newUsername;
      }

      return {
        success: true,
        message: "Cập nhật tên người dùng thành công",
        username: newUsername,
      };
    } catch (error) {
      console.error("Lỗi changeUsername:", error.message);
      throw error;
    }
  }

  async resetPassword(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập hoặc phiên làm việc hết hạn");

      // Lấy user, đảm bảo lấy thêm trường password nếu schema đặt select: false
      const user = await User.findById(new mongoose.Types.ObjectId(userId)).select('+password');

      if (!user) throw new Error("Người dùng không tồn tại");

      // 1. Kiểm tra tài khoản Social Login
      if (user.googleId || user.githubId) { 
        throw new Error("Tài khoản này được đăng ký qua Google hoặc GitHub, không thể đổi mật khẩu");
      }

      const { oldPassword, newPassword } = req.body || {};

      // 2. Validate dữ liệu đầu vào trước khi truyền vào bcrypt
      if (!oldPassword || !newPassword) {
        throw new Error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới");
      }

      if (newPassword.length < 8) {
        throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự");
      }

      if (oldPassword === newPassword) {
        throw new Error("Mật khẩu mới không được trùng với mật khẩu cũ");
      }

      if (!user.password) {
        throw new Error("Tài khoản chưa thiết lập mật khẩu");
      }

      // 3. So sánh mật khẩu cũ
      const comparePasswordResult = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!comparePasswordResult) {
        throw new Error("Mật khẩu hiện tại không chính xác");
      }

      // 4. Mã hóa và lưu mật khẩu mới
      const hashed_password = await bcrypt.hash(newPassword, saltRounds);
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashed_password } }
      );

      return { success: true, message: "Cập nhật mật khẩu thành công" };
    } catch (error) {
      console.error("Lỗi resetPassword:", error.message);
      throw error;
    }
  }

  async verifyEmail(req) {
    try {
      const data = await jwtService.validateJWT(req);
      if (data?.id) {
        await User.updateOne(
          { _id: new mongoose.Types.ObjectId(data.id) },
          { $set: { accountStatus: "active" } },
        );
        return { success: true };
      }
    } catch (error) {
      console.error("Lỗi verifyEmail:", error.message);
      throw error;
    }
  }

  async deleteCourseNote(req) {
    const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
    if (!userId) throw new Error("Chưa đăng nhập");
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);
    const lessonId = new mongoose.Types.ObjectId(req.body.lessonId);
    const noteText = req.body.note;

    if (!noteText) {
      throw new Error("Nội dung ghi chú không hợp lệ");
    }

    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        courseId: courseId,
        "curriculum.lessons.lessonId": lessonId,
      },
      {
        $pull: {
          "curriculum.$[chapter].lessons.$[lesson].notes": noteText,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "chapter.lessons.lessonId": lessonId },
          { "lesson.lessonId": lessonId },
        ],
      },
    );

    let remainingNotes = [];
    if (updatedUserCourse) {
      for (const chapter of updatedUserCourse.curriculum) {
        const foundLesson = chapter.lessons.find(
          (lesson) => lesson.lessonId.toString() === lessonId.toString(),
        );
        if (foundLesson) {
          remainingNotes = foundLesson.notes;
          break;
        }
      }
    }

    return { success: true, notes: remainingNotes };
  }

  async saveCourseNote(req) {
    const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
    if (!userId) throw new Error("Chưa đăng nhập");
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);
    const lessonId = new mongoose.Types.ObjectId(req.body.lessonId);
    const noteText = req.body.note;

    if (!noteText || !noteText.trim()) {
      throw new Error("Nội dung ghi chú không được để trống");
    }

    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        courseId: courseId,
        "curriculum.lessons.lessonId": lessonId,
      },
      {
        $push: {
          "curriculum.$[chapter].lessons.$[lesson].notes": noteText.trim(),
        },
      },
      {
        new: true,
        arrayFilters: [
          { "chapter.lessons.lessonId": lessonId },
          { "lesson.lessonId": lessonId },
        ],
      },
    );

    let updatedNotes = [];
    if (updatedUserCourse) {
      for (const ch of updatedUserCourse.curriculum) {
        const foundLesson = ch.lessons.find(
          (l) => l.lessonId.toString() === lessonId.toString(),
        );
        if (foundLesson) {
          updatedNotes = foundLesson.notes;
          break;
        }
      }
    }

    return { success: true, notes: updatedNotes };
  }

  async saveCourse(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập");
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const courseId = new mongoose.Types.ObjectId(req.body.courseId);

      let userCourse = await UserCourse.findOne({ userId: userObjectId, courseId });
      if (userCourse) {
        return userCourse;
      }

      const curriculum = await Chapter.aggregate([
        { $match: { courseId: courseId } },
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
                $project: {
                  _id: 0,
                  lessonId: "$_id",
                  status: { $literal: "incompleted" },
                  progression: { $literal: 0 },
                },
              },
            ],
            as: "lessons",
          },
        },
        {
          $project: {
            _id: 0,
            chapterId: "$_id",
            lessons: 1,
          },
        },
      ]);

      await User.updateOne(
        { _id: userObjectId },
        { $addToSet: { courses: courseId } },
      );

      userCourse = await UserCourse.create({
        userId: userObjectId,
        courseId: courseId,
        curriculum: curriculum,
        progression: 0,
        lastAccessedLessonId: curriculum[0]?.lessons[0]?.lessonId || null,
      });

      return userCourse;
    } catch (error) {
      console.error("Lỗi saveCourse:", error.message);
      throw error;
    }
  }

  async updateCourseProgression(req) {
    try {
      const lessonIdStr = req.body.lessonId || req.body.id;
      if (!lessonIdStr) {
        throw new Error("Thiếu lessonId trong body");
      }

      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập");
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const lessonObjectId = new mongoose.Types.ObjectId(lessonIdStr);

      const updatedUserCourse = await UserCourse.findOneAndUpdate(
        {
          userId: userObjectId,
          "curriculum.lessons.lessonId": lessonObjectId,
        },
        {
          $set: {
            "curriculum.$[chapter].lessons.$[lesson].status": "completed",
            "curriculum.$[chapter].lessons.$[lesson].progression": 100,
            "curriculum.$[chapter].lessons.$[lesson].lastAccessedAt": new Date(),
            lastAccessedLessonId: lessonObjectId,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "chapter.lessons.lessonId": lessonObjectId },
            { "lesson.lessonId": lessonObjectId },
          ],
        },
      );

      if (!updatedUserCourse) {
        throw new Error("Không tìm thấy bài học trong chương trình của người dùng");
      }

      let totalLessons = 0;
      let completedLessons = 0;

      updatedUserCourse.curriculum.forEach((chapter) => {
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          totalLessons += chapter.lessons.length;
          completedLessons += chapter.lessons.filter(
            (lesson) => lesson.status === "completed",
          ).length;
        }
      });

      const progression =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      await UserCourse.updateOne(
        { _id: updatedUserCourse._id },
        { $set: { progression: progression } },
      );

      return {
        success: true,
        progression,
        message: "Cập nhật tiến độ thành công!",
      };
    } catch (error) {
      console.error("Lỗi updateCourseProgression:", error.message);
      throw error;
    }
  }

  async getUserCourseCurriculum(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) {
        return {
          progression: 0,
          curriculum: [],
          lastAccessedLessonId: null,
        };
      }
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const courseId = new mongoose.Types.ObjectId(req.params.courseId);

      const userCourse = await UserCourse.findOne({ userId: userObjectId, courseId });

      if (!userCourse) {
        return {
          progression: 0,
          curriculum: [],
          lastAccessedLessonId: null,
        };
      }

      return {
        progression: userCourse.progression || 0,
        curriculum: userCourse.curriculum || [],
        lastAccessedLessonId: userCourse.lastAccessedLessonId || null,
      };
    } catch (error) {
      console.error("Lỗi getUserCourseCurriculum:", error.message);
      throw error;
    }
  }

  async saveRoadmap(req) {
    try {
      const userId = req.session?.passport?.user?.id || req.user?._id || req.user?.id;
      if (!userId) throw new Error("Chưa đăng nhập");
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const roadmapId = new mongoose.Types.ObjectId(req.body.roadmapId);

      const user = await User.findById(userObjectId);
      const isAlreadySaved = user?.roadmaps?.some((id) => id.toString() === roadmapId.toString());

      if (isAlreadySaved) {
        await User.updateOne(
          { _id: userObjectId },
          { $pull: { roadmaps: roadmapId } },
        );
        return { message: "Removed roadmap from saved list", isSaved: false };
      } else {
        await User.updateOne(
          { _id: userObjectId },
          { $addToSet: { roadmaps: roadmapId } },
        );
        return { message: "Saved roadmap successfully", isSaved: true };
      }
    } catch (error) {
      console.error("Lỗi saveRoadmap:", error.message);
      throw error;
    }
  }
}

export default new UserService();