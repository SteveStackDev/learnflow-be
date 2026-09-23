import User from "#models/user.js";
import otpService from "#services/otp.service.js";
import uploadService from "#services/upload.service.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwtService from "#services/jwt.service.js";
import mailService from "#services/mail.service.js";
import UserCourse from "#models/userCourse.js";

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

      const userId = req.session.passport.user.id;

      const userNewAvatar = await User.findById(
        new mongoose.Types.ObjectId(userId),
      ).updateOne({
        avatar: { url: uploadedFile.url, urlId: uploadedFile.url_id },
      });

      if (!userNewAvatar) {
        return;
      }

      return userNewAvatar;
    } catch (error) {
      if (uploadedFile.url_id) {
        await uploadService.deleteFile(uploadedFile.url_id, "image");
      }
      throw error;
    }
  }

  async addNewFriend(req) {
    try {
      const [receiverUpdate, senderUpdate] = await Promise.all([
        // Người được add
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(req.body.receiverId),
            "friends.userId": {
              $ne: new mongoose.Types.ObjectId(req.session.passport.user.id),
            },
          },
          {
            $addToSet: {
              friends: {
                userId: new mongoose.Types.ObjectId(
                  req.session.passport.user.id,
                ),
                status: "pending",
              },
            },
          },
        ),

        // Người add
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(req.session.passport.user.id),
            "friends.userId": {
              $ne: new mongoose.Types.ObjectId(req.body.receiverId),
            },
          },
          {
            $addToSet: {
              friends: {
                userId: new mongoose.Types.ObjectId(req.body.receiverId),
                status: "pending",
              },
            },
          },
        ),
      ]);

      if (
        receiverUpdate.modifiedCount === 1 &&
        senderUpdate.modifiedCount === 1
      ) {
        return { receiverUpdate, senderUpdate };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async replyNewFriend(req) {
    try {
      const [receiverUpdate, senderUpdate] = await Promise.all([
        // Người được reply
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(req.body.receiverId),
            "friends.userId": new mongoose.Types.ObjectId(
              req.session.passport.user.id,
            ),
          },
          {
            $set: {
              "friends.$.status": req.body.status,
            },
          },
        ),

        // Người reply
        User.updateOne(
          {
            _id: new mongoose.Types.ObjectId(req.session.passport.user.id),
            "friends.userId": new mongoose.Types.ObjectId(req.body.receiverId),
          },
          {
            $set: {
              "friends.$.status": req.body.status,
            },
          },
        ),
      ]);

      if (
        receiverUpdate.modifiedCount === 1 &&
        senderUpdate.modifiedCount === 1
      ) {
        return { receiverUpdate, senderUpdate };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllFriend(req) {
    try {
      const friendsList = await User.findOne(
        {
          _id: new mongoose.Types.ObjectId(req.session.passport.user.id),
        },
        {
          friends: 1,
          _id: 0,
        },
      );

      if (friendsList) {
        return friendsList;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async forgotPassword(req) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwtService.generateJWT({
          iđ: user._id,
        });

        if (token) {
          await mailService.sendMail(user.email, "Mã OTP", "otp.page.hbs", {
            userName: user.username,
            otpCode: await otpService.generateOTP(user.email),
            expiryMinutes: "3",
          });

          return token;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async verifyOTP(req) {
    try {
      const data = await jwtService.validateJWT(req);
      const user = await User.findById(new mongoose.Types.ObjectId(data.id));

      if (user) {
        return await otpService.validateOTP(user.email, req.body.otp);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async changePassword(req) {
    try {
      const data = await jwtService.validateJWT(req);
      const user = await User.findById(new mongoose.Types.ObjectId(data.id));

      const comparePasswordResult = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (user && comparePasswordResult) {
        const hashed_password = await bcrypt.hash(inputPassword, saltRounds);
        await User.updateOne(
          { email: req.body.email },
          {
            $set: {
              password: hashed_password,
            },
          },
        );
      }

      return;
    } catch (error) {
      console.log(error.message);
    }
  }

  async resetPassword(req) {
    const user = await User.findById(
      new mongoose.Types.ObjectId(req.session.passport.user.id),
    );

    const comparePasswordResult = await bcrypt.compare(
      req.body.oldPassword,
      user.password,
    );

    if (user && comparePasswordResult) {
      const hashed_password = await bcrypt.hash(
        req.body.newPassword,
        saltRounds,
      );
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(req.session.passport.user.id) },
        {
          $set: {
            password: hashed_password,
          },
        },
      );
    }
  }

  async verifyEmail(req) {
    const data = await jwtService.validateJWT(req);

    if (data) {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $set: {
            accountStatus: "active",
          },
        },
      );

      return;
    }
  }

  async deleteCourseNote(req) {
    const userId = new mongoose.Types.ObjectId(req.session.passport.user.id);
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);
    const lessonId = new mongoose.Types.ObjectId(req.body.lessonId);
    const noteText = req.body.note;

    if (!noteText) {
      throw new Error("Nội dung ghi chú không hợp lệ");
    }

    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        userId: userId,
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

    return {
      success: true,
      notes: remainingNotes,
    };
  }

  async saveCourseNote(req) {
    const userId = new mongoose.Types.ObjectId(req.session.passport.user.id);
    const courseId = new mongoose.Types.ObjectId(req.body.courseId);
    const lessonId = new mongoose.Types.ObjectId(req.body.lessonId);
    const noteText = req.body.note;

    if (!noteText || !noteText.trim()) {
      throw new Error("Nội dung ghi chú không được để trống");
    }

    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        userId: userId,
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
      const userId = new mongoose.Types.ObjectId(req.session.passport.user.id);
      const courseId = new mongoose.Types.ObjectId(req.body.courseId);

      let userCourse = await UserCourse.findOne({ userId, courseId });

      if (userCourse) {
        return userCourse;
      }

      const curriculum = await Chapter.aggregate([
        {
          $match: { courseId: courseId },
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
        { _id: userId },
        { $addToSet: { courses: courseId } },
      );

      userCourse = await UserCourse.create({
        userId: userId,
        courseId: courseId,
        curriculum: curriculum,
        progression: 0,
        lastAccessedLessonId: curriculum[0]?.lessons[0]?.lessonId || null,
      });

      return userCourse;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateCourseProgression(req) {
    try {
      const lessonIdStr = req.body.lessonId || req.body.id;
      if (!lessonIdStr) {
        throw new Error("Missing lessonId in request body");
      }

      const userId = new mongoose.Types.ObjectId(req.session.passport.user.id);
      const lessonObjectId = new mongoose.Types.ObjectId(lessonIdStr);

      const userCourse = await UserCourse.findOne({ userId });
      if (!userCourse) {
        throw new Error("User course not found");
      }

      const updatedUserCourse = await UserCourse.findOneAndUpdate(
        {
          userId: userId,
          "curriculum.lessons.lessonId": lessonObjectId,
        },
        {
          $set: {
            "curriculum.$[chapter].lessons.$[lesson].status": "completed",
            "curriculum.$[chapter].lessons.$[lesson].progression": 100,
            "curriculum.$[chapter].lessons.$[lesson].lastAccessedAt":
              new Date(),
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
        throw new Error("Lesson not found in user curriculum");
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
      console.log(error.message);
    }
  }

  async getUserCourseCurriculum(req) {
    try {
      const userId = new mongoose.Types.ObjectId(req.session.passport.user.id);
      const courseId = new mongoose.Types.ObjectId(req.params.courseId);

      const userCourse = await UserCourse.findOne({ userId, courseId });

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
      console.log(error.message);
    }
  }

  async saveRoadmap(req) {
    try {
      await User.updateOne(
        { _id: new mongoose.Types.ObjectId(req.session.passport.user.id) },
        {
          $addToSet: {
            roadmaps: new mongoose.Types.ObjectId(req.body.roadmapId),
          },
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new UserService();
