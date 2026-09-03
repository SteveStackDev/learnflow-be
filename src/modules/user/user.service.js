import User from "#models/user.js";
import otpService from "#services/otp.service.js";
import uploadService from "#services/upload.service.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwtService from "#services/jwt.service.js";
import mailService from "#services/mail.service.js";

const saltRounds = 10;

class UserService {
  async changeAvatar(req) {
    let uploadedFile = null;

    try {
      if (req.file) {
        uploadedFile = await uploadService.uploadFile(
          req.file.path,
          "FySet/avatars",
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
      const userId = req.user?._id || req.session?.passport?.user?.id;
      if (!userId) return [];

      const userDoc = await User.findById(new mongoose.Types.ObjectId(userId))
        .select("friends")
        .populate({
          path: "friends.userId",
          select:
            "username avatar name dailyStreak pomodoroStreak experiencePoints rating interactionStatus bio title",
        });

      return userDoc?.friends || [];
    } catch (error) {
      console.log("Lỗi lấy danh sách bạn bè:", error.message);
      return [];
    }
  }

  async forgotPassword(req) {
    try {
      const email = req.body?.email?.trim()?.toLowerCase();
      if (!email) return null;

      const user = await User.findOne({ email });
      if (user) {
        const token = jwtService.generateJWT({
          id: user._id.toString(),
          email: user.email,
        });

        if (token) {
          const otp = await otpService.generateOTP(user.email);
          await mailService.sendMail(user.email, "Mã OTP xác thực", "otp.page.hbs", {
            userName: user.username,
            otpCode: otp,
            expiryMinutes: "3",
          });

          return token;
        }
      }
      return null;
    } catch (error) {
      console.log("Lỗi forgotPassword:", error.message);
      return null;
    }
  }

  async verifyOTP(req) {
    try {
      const data = jwtService.validateJWT(req);
      const email =
        req.body?.email?.trim()?.toLowerCase() ||
        data?.email ||
        (data?.id ? (await User.findById(new mongoose.Types.ObjectId(data.id)))?.email : null);

      if (email && req.body?.otp) {
        return await otpService.validateOTP(email, req.body.otp);
      }
      return "Dữ liệu xác thực không hợp lệ";
    } catch (error) {
      console.log("Lỗi verifyOTP:", error.message);
      return "Lỗi kiểm tra OTP";
    }
  }

  async changePassword(req) {
    try {
      const data = jwtService.validateJWT(req);
      const email =
        req.body?.email?.trim()?.toLowerCase() ||
        data?.email ||
        (data?.id ? (await User.findById(new mongoose.Types.ObjectId(data.id)))?.email : null);
      const newPassword = req.body?.password || req.body?.newPassword;

      if (!email || !newPassword) {
        throw new Error("Email và mật khẩu mới là bắt buộc");
      }

      const hashed_password = await bcrypt.hash(newPassword, saltRounds);
      const result = await User.updateOne(
        { email },
        {
          $set: {
            password: hashed_password,
          },
        },
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.log("Lỗi changePassword:", error.message);
      throw error;
    }
  }

  async resetPassword(req) {
    const userId = req.user?._id || req.session?.passport?.user?.id;
    if (!userId) return false;

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) return false;

    const comparePasswordResult = await bcrypt.compare(
      req.body.oldPassword,
      user.password,
    );

    if (comparePasswordResult) {
      const hashed_password = await bcrypt.hash(
        req.body.newPassword,
        saltRounds,
      );
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashed_password,
          },
        },
      );
      return true;
    }
    return false;
  }

  async verifyEmail(req) {
    try {
      const data = jwtService.validateJWT(req);

      if (data && data.id) {
        const result = await User.updateOne(
          { _id: new mongoose.Types.ObjectId(data.id) },
          {
            $set: {
              accountStatus: "active",
            },
          },
        );

        return result.modifiedCount > 0;
      }
      return false;
    } catch (error) {
      console.log("Lỗi verifyEmail:", error.message);
      return false;
    }
  }
}

export default new UserService();
