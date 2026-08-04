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
                senderId: new mongoose.Types.ObjectId(
                  req.session.passport.user.id,
                ),
                receiverId: new mongoose.Types.ObjectId(req.body.receiverId),
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
                senderId: new mongoose.Types.ObjectId(
                  req.session.passport.user.id,
                ),
                receiverId: new mongoose.Types.ObjectId(req.body.receiverId),
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
}

export default new UserService();
