import Conversation from "#models/conversation.js";
import Message from "#models/message.js";
import ApiError from "#utils/ApiError.js";
import { formatArrayOfObjectIds } from "#utils/formatArrayOfObjectIds.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { getFileType } from "#utils/getFileType.js";
import uploadService from "#services/upload.service.js";
import { getIO } from "#configs/socketIO.js";
import User from "#models/user.js";

class chatService {
  async createConversation(req) {
    try {
      const io = getIO();
      const formattedParticipants = JSON.parse(req.body.participants);
      const allOneUserConversation = await Conversation.find({
        $and: [
          {
            creatorId: new mongoose.Types.ObjectId(
              req.session.passport.user.id,
            ),
          },
          {
            participants: [],
          },
        ],
      });

      if (
        allOneUserConversation &&
        allOneUserConversation.length === 1 &&
        formattedParticipants.length === 0
      ) {
        return;
      }

      const newConversation = await Conversation.insertOne({
        title: req.body.title,
        creatorId: req.session.passport.user.id,
        isGroup: formattedParticipants.length > 1 ? true : false,
        participants:
          formattedParticipants.length >= 1
            ? formatArrayOfObjectIds(formattedParticipants)
            : [],
      });

      if (newConversation) {
        io.of("/chat")
          .in(req.session.passport.user.id)
          .socketsJoin(newConversation._id.toString());

        const welcomeSystemMessage = await Message.create({
          conversationId: newConversation._id,
          senderId: new mongoose.Types.ObjectId(req.session.passport.user.id),
          messageType: "system",
          systemAction: "conversation_created",
          readBy: null,
        });

        await welcomeSystemMessage.populate("senderId", "username");

        if (formattedParticipants && formattedParticipants.length !== 0) {
          formattedParticipants.forEach((participant) => {
            io.of("/chat")
              .in(participant.toString())
              .emit(
                "addMemberToConversation",
                "Bạn vừa được thêm vào một nhóm mới",
              );
          });
        }

        // Client sẽ nhận được welcomeSystemMessage và newConversation
        // CLient sẽ if/else hoặc switch/case
        // Nếu là người tạo conversation thì render là Bạn đã tạo...
        // Những người không tạo conversation thì render là <admin_username> đã tạo...
        // Check tiếp nếu id session trùng với id member sẽ render là Bạn đã tham gia...
        // Những người khác sẽ render là <member_username> đã tham gia...

        io.of("/chat")
          .to(newConversation._id.toString())
          .emit("welcomeMessage", welcomeSystemMessage);

        return newConversation;
      }

      return;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Tạo conversation thất bại",
      );
    }
  }

  async createMessage(req) {
    try {
      let attachments = [];

      const conversationIdResult = await Conversation.findById(
        new mongoose.Types.ObjectId(req.body.conversationId),
      );

      if (!req.body.conversationId && !conversationIdResult) {
        return;
      }

      if (req.files && req.files.length > 0) {
        const attachmentsResult = await Promise.all(
          req.files.map(async (file) => {
            const detectedType = getFileType(file.mimetype);
            const resourceType = detectedType === "file" ? "raw" : detectedType;

            const urlResult = await uploadService.uploadFile(
              file.path,
              "LearnFlow/attachments",
              resourceType,
              file.originalname,
            );

            if (urlResult) {
              return {
                fileName: file.originalname,
                fileType: detectedType,
                url: urlResult.url,
                urlId: urlResult.url_id,
              };
            }
            return null;
          }),
        );

        attachments = attachmentsResult.filter(
          (attachment) => attachment !== null,
        );
      }

      const newMessage = await Message.insertOne({
        conversationId: conversationIdResult,
        content: req.body.content,
        senderId: req.session.passport.user.id,
        attachments,
      });

      if (newMessage) {
        return newMessage;
      }

      return;
    } catch (error) {
      console.log(error.message);
      if (attachments && attachments.length > 0) {
        await Promise.all(
          attachments.map((attachment) =>
            uploadService.deleteFile(
              attachment.urlId,
              attachment.fileType === "file" ? "raw" : attachment.fileType,
            ),
          ),
        );

        attachments = [];
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Tạo message thất bại",
      );
    }
  }

  async getAllConversation(req) {
    try {
      const allConversation = await Conversation.find({
        $or: [
          {
            creatorId: new mongoose.Types.ObjectId(
              req.session.passport.user.id,
            ),
          },
          {
            participants: new mongoose.Types.ObjectId(
              req.session.passport.user.id,
            ),
          },
        ],
      });

      return allConversation;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Lấy conversation thất bại",
      );
    }
  }

  async changeConversationAvatar(req) {
    let uploadedFile = null;

    try {
      if (req.file) {
        uploadedFile = await uploadService.uploadFile(
          req.file.path,
          "LearnFlow/avatars",
          "image",
        );
      }

      const user = await User.findById(
        new mongoose.Types.ObjectId(req.session.passport.user.id),
      );

      const conversationNewAvatar = await Conversation.updateOne(
        { _id: new mongoose.Types.ObjectId(req.roomId) },
        {
          $set: {
            avatar: {
              url: uploadedFile.url,
              urlId: uploadedFile.url_id,
            },
          },
        },
      );

      if (!conversationNewAvatar) {
        return;
      }

      if (user) {
        io.of("/chat")
          .to(req.roomId)
          .emit(
            "updateConversationAvatar",
            `${user.username} vừa thay đổi ảnh đại diện của nhóm`,
          );
      }

      return conversationNewAvatar;
    } catch (error) {
      if (uploadedFile.url_id) {
        await uploadService.deleteFile(uploadedFile.url_id, "image");
      }
      throw error;
    }
  }
}

export default new chatService();
