import Notification from "#models/notification.js";
import mongoose from "mongoose";
import { getIO } from "#configs/socketIO.js";
import chatService from "#modules/chat/chat.service.js";

class NotificationService {
  async createNotification(req, res) {
    try {
      const notification = await Notification.create({
        receiverId: new mongoose.Types.ObjectId("6a5f4bc14945d81f61f18baa"),
        senderId: new mongoose.Types.ObjectId("6a5f4bbc4945d81f61f18ba9"),
        title: "Test Notification",
        content: "Test Notification 1",
        type: "friend_request",
      });

      if (notification) {
        return res.status(201).json({
          success: true,
          message: "Tạo thông báo thành công",
          notification,
        });
      }

      return;
    } catch (error) {
      console.log(error.message);
    }
  }

  async sendNotification(data) {
    try {
      const io = getIO();
      const chatNameSpace = io.of("/chat");

      const { usersOnline, usersOffline } =
        chatService.getAllUserInteractionStatus();

      if (
        usersOnline.get(`user_interaction_status_count:${data.receiverId}`) !==
        0
      ) {
        chatNameSpace.to(`${data.receiverId}`).emit("newNotification", data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new NotificationService();
