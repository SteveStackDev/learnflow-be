import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import chatService from "#modules/chat/chat.service.js";

export const displayChatArea = async (req, res) => {
  try {
    res.status(StatusCodes.OK).send({
      status: "success",
      message: "Truy cập nơi trò chuyện thành công",
    });
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Truy cập nơi trò chuyện thất bại",
    );
  }
};

export const createConversation = async (req, res) => {
  try {
    const conversation = await chatService.createConversation(req);
    if (conversation) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Tạo cuộc hội thoại thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Tạo cuộc hội thoại thất bại",
    );
  }
};

export const createMessage = async (req, res) => {
  try {
    const message = await chatService.createMessage(req);
    if (message) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Tạo tin nhắn thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Tạo tin nhắn thất bại",
    );
  }
};

export const getAllConversation = async (req, res) => {
  try {
    const allConversation = await chatService.getAllConversation(req);
    if (allConversation) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy cuộc hội thoại thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy cuộc hội thoại thất bại",
    );
  }
};

export const changeConversationAvatar = async (req, res) => {
  try {
    const result = await chatService.changeConversationAvatar(req);
    if (result) {
      res.status(StatusCodes.OK).send({
        status: "success",
        message: "Lấy cuộc hội thoại thành công",
      });
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lấy cuộc hội thoại thất bại",
    );
  }
};
