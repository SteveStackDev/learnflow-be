import { getIO } from "#configs/socketIO.js";
import { ensureAuthSocket } from "#middlewares/ensureAuthSocket.middleware.js";
import Conversation from "#models/conversation.js";
import Message from "#models/message.js";
import User from "#models/user.js";
import mongoose from "mongoose";
import chatService from "#modules/chat/chat.service.js";
import { $ZodCheckBigIntFormat } from "zod/v4/core";

export const chatSocketIO = () => {
  const io = getIO();
  const chatNameSpace = io.of("/chat");

  chatNameSpace.use(ensureAuthSocket);

  chatNameSpace.on("connection", async (socket) => {
    console.log("Có thiết bị kết nối: " + socket.id);

    const userId = socket.request.user._id.toString();

    if (
      userId &&
      chatService.changeUserInteractionStatusToOnline(userId) !== 0
    ) {
      socket.join(`${userId}`);

      const userOnlineStatus = await User.findByIdAndUpdate(
        socket.request.user._id,
        { interactionStatus: "online" },
        { returnDocument: "after" },
      );

      if (userOnlineStatus) {
        chatNameSpace
          .to(`${userId}`)
          .emit(
            "changeOnlineFriendsList",
            ({ usersOnline, usersOffline } =
              chatService.getAllUserInteractionStatus),
          );
      }
    } else {
      console.log(
        `Socket ${socket.id} không hợp lệ (Không tìm thấy thông tin user). Tiến hành ngắt...`,
      );
      socket.disconnect(true);
    }

    const friendslist = await User.findById(
      new mongoose.Types.ObjectId(userId),
    ).populate("friends.userId", "_id").friends;

    friendslist.forEach((friend) => {
      socket.join(`${friend.userId._id.toString()}`);
    });

    socket.on("joinConversation", async (data) => {
      if (data.roomId) {
        const conversation = await Conversation.findById({
          _id: new mongoose.Types.ObjectId(data.roomId),
        });

        if (conversation) {
          const userUnreadMessageCounts = await Conversation.findOne({
            "unreadMessageCounts.userId": new mongoose.Types.ObjectId(userId),
          });

          if (!userUnreadMessageCounts) {
            await Conversation.updateOne(
              { _id: data.roomId },
              {
                $push: {
                  unreadMessageCounts: {
                    userId: new mongoose.Types.ObjectId(userId),
                    count: 0,
                    lastReadMessageId: null,
                    lastReadAt: null,
                  },
                },
              },
            );
          }

          socket.join(data.roomId);
        }
      }
    });

    socket.on("leaveConversation", async (data) => {
      if (data.roomId && data.messageId) {
        const lastReadMessage = await Message.findById(data.messageId);

        const unreadMessageCounts = await Message.countDocuments({
          conversationId: data.roomId,
          _id: { $gt: new mongoose.Types.ObjectId(data.messageId) },
        });

        const userUnreadMessageCounts = await Conversation.findOne(
          {
            _id: new mongoose.Types.ObjectId(data.roomId),
          },
          {
            unreadMessageCounts: {
              $elemMatch: { userId: new mongoose.Types.ObjectId(userId) },
            },
          },
        );

        const previousLastReadMessage =
          userUnreadMessageCounts.unreadMessageCounts[0].lastReadMessageId?.toString();

        if (previousLastReadMessage && lastReadMessage) {
          await Message.updateMany(
            {
              _id: {
                $gte: new mongoose.Types.ObjectId(previousLastReadMessage),
                $lte: new mongoose.Types.ObjectId(lastReadMessage),
              },
              messageType: "text",
              readBy: { $ne: new mongoose.Types.ObjectId(userId) },
            },
            {
              $addToSet: {
                readBy: new mongoose.Types.ObjectId(userId),
              },
            },
          );
        } else {
          await Message.updateMany(
            {
              _id: {
                $lte: new mongoose.Types.ObjectId(lastReadMessage),
              },
              messageType: "text",
              readBy: { $ne: new mongoose.Types.ObjectId(userId) },
            },
            {
              $addToSet: {
                readBy: new mongoose.Types.ObjectId(userId),
              },
            },
          );
        }

        if (unreadMessageCounts === 0) {
          await Conversation.updateOne(
            {
              _id: new mongoose.Types.ObjectId(data.roomId),
            },
            {
              $pull: {
                unreadMessageCounts: {
                  userId: new mongoose.Types.ObjectId(userId),
                },
              },
            },
          );
        } else {
          await Conversation.updateOne(
            {
              _id: new mongoose.Types.ObjectId(data.roomId),
            },
            {
              $set: {
                unreadMessageCounts: {
                  userId: new mongoose.Types.ObjectId(userId),
                  count: unreadMessageCounts,
                  lastReadMessageId: lastReadMessage._id,
                  lastReadAt: Date.now(),
                },
              },
            },
          );
        }

        socket.leave(data.roomId);
      }
    });

    socket.on("sendMessage", async (data) => {
      if (data.roomId) {
        let { usersOnline, usersOffline } =
          chatService.getAllUserInteractionStatus();
        const io = getIO();
        const socketsInRoom = socket.adapter.rooms.get(data.roomId);
        const socketsInRoomCount = socketsInRoom.size;
        const conversation = await Conversation.findById({
          _id: new mongoose.Types.ObjectId(data.roomId),
        });
        const participantsWithCreator = [
          ...conversation.participants,
          conversation.creatorId,
        ];

        if (
          conversation &&
          socketsInRoomCount !== conversation.participants.length + 1
        ) {
          for (const [key, value] of usersOnline) {
            const usersOnlineSockets = io.of("/chat").adapter.rooms.get(key);

            const usersOnlineInRoom = participantsWithCreator.includes(
              new mongoose.Types.ObjectId(key),
            )
              ? Array.from(usersOnlineSockets).some((socketId) =>
                  socketsInRoom.has(socketId),
                )
                ? true
                : false
              : null;

            if (usersOnlineInRoom !== null && !usersOnlineInRoom) {
              const userUnreadMessageCounts = await Conversation.updateOne(
                {
                  _id: data.roomId,
                  "unreadMessageCounts.userId": new mongoose.Types.ObjectId(
                    key,
                  ),
                },
                {
                  $inc: {
                    "unreadMessageCounts.$.count": 1,
                  },
                },
              );

              if (userUnreadMessageCounts.matchedCount === 0) {
                await Conversation.updateOne(
                  { _id: data.roomId },
                  {
                    $push: {
                      unreadMessageCounts: {
                        userId: new mongoose.Types.ObjectId(key),
                        count: 0,
                        lastReadMessageId: null,
                        lastReadAt: null,
                      },
                    },
                  },
                );
              }
            }
          }

          for (const [key, value] of usersOffline) {
            const usersOfflineInRoom = participantsWithCreator.includes(
              new mongoose.Types.ObjectId(key),
            )
              ? true
              : false;

            if (!usersOfflineInRoom) {
              const userUnreadMessageCounts = await Conversation.updateOne(
                {
                  _id: data.roomId,
                  "unreadMessageCounts.userId": new mongoose.Types.ObjectId(
                    key,
                  ),
                },
                {
                  $inc: {
                    "unreadMessageCounts.$.count": 1,
                  },
                },
              );

              if (userUnreadMessageCounts.matchedCount === 0) {
                await Conversation.updateOne(
                  { _id: data.roomId },
                  {
                    $push: {
                      unreadMessageCounts: {
                        userId: new mongoose.Types.ObjectId(userId),
                        count: 0,
                        lastReadMessageId: null,
                        lastReadAt: null,
                      },
                    },
                  },
                );
              }
            }
          }
        }

        const newestMessage = await Message.find({
          conversationId: new mongoose.Types.ObjectId(data.roomId),
        })
          .sort({ createdAt: -1 })
          .limit(1);

        if (newestMessage && conversation) {
          await conversation.updateOne(
            { _id: new mongoose.Types.ObjectId(data.roomId) },
            {
              $set: {
                lastMessageContent: newestMessage.content,
                lastMessageAt: Date.now(),
                lastMessageId: newestMessage._id,
              },
            },
          );
        }

        if (data.messageId && data.messageReplyId) {
          await Message.updateOne(
            {
              _id: new mongoose.Types.ObjectId(data.messageId),
            },
            {
              $set: {
                replyTo: new mongoose.Types.ObjectId(data.messageReplyId),
              },
            },
          );
        }
      }
    });

    socket.on("markMessageAsSeen", async (data) => {
      if (data.roomId && data.messageId) {
        const lastReadMessage = await Message.findById(data.messageId);

        const unreadMessageCounts = await Message.countDocuments({
          conversationId: data.roomId,
          _id: { $gt: new mongoose.Types.ObjectId(data.messageId) },
        });

        const userUnreadMessageCounts = await Conversation.findOne(
          {
            _id: new mongoose.Types.ObjectId(data.roomId),
          },
          {
            unreadMessageCounts: {
              $elemMatch: { userId: new mongoose.Types.ObjectId(userId) },
            },
          },
        );

        const previousLastReadMessage =
          userUnreadMessageCounts.unreadMessageCounts[0].lastReadMessageId?.toString();

        if (previousLastReadMessage && lastReadMessage) {
          await Message.updateMany(
            {
              _id: {
                $gte: new mongoose.Types.ObjectId(previousLastReadMessage),
                $lte: new mongoose.Types.ObjectId(lastReadMessage),
              },
              messageType: "text",
              readBy: { $ne: new mongoose.Types.ObjectId(userId) },
            },
            {
              $addToSet: {
                readBy: new mongoose.Types.ObjectId(userId),
              },
            },
          );
        } else {
          await Message.updateMany(
            {
              _id: {
                $lte: new mongoose.Types.ObjectId(lastReadMessage),
              },
              messageType: "text",
              readBy: { $ne: new mongoose.Types.ObjectId(userId) },
            },
            {
              $addToSet: {
                readBy: new mongoose.Types.ObjectId(userId),
              },
            },
          );
        }

        if (unreadMessageCounts === 0) {
          await Conversation.updateOne(
            {
              _id: new mongoose.Types.ObjectId(data.roomId),
            },
            {
              $pull: {
                unreadMessageCounts: {
                  userId: new mongoose.Types.ObjectId(userId),
                },
              },
            },
          );
        } else {
          await Conversation.updateOne(
            {
              _id: new mongoose.Types.ObjectId(data.roomId),
            },
            {
              $set: {
                unreadMessageCounts: {
                  userId: new mongoose.Types.ObjectId(userId),
                  count: unreadMessageCounts,
                  lastReadMessageId: lastReadMessage._id,
                  lastReadAt: Date.now(),
                },
              },
            },
          );
        }
      }
    });

    socket.on("disconnect", async () => {
      if (
        chatService.changeUserInteractionStatusToOffline(
          socket.request.user._id.toString(),
        ) === 0
      ) {
        const userOfflineStatus = await User.findByIdAndUpdate(
          socket.request.user._id,
          { interactionStatus: "offline" },
          { returnDocument: "after" },
        );

        if (userOfflineStatus) {
          console.log(`Có thiết bị ngắt kết nối: ${socket.id}.`);
        }
      }
    });
  });
};
