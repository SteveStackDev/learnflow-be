import userService from "#modules/user/user.service.js";

export const updateAvatar = async (req, res) => {
  try {
    const avatarResult = await userService.changeAvatar(req);

    return res.status(200).json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công",
      data: avatarResult,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addNewFriend = async (req, res) => {
  try {
    const result = await userService.addNewFriend(req);

    return res.status(200).json({
      success: true,
      message: "Gửi lời mời kết bạn thành công",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const replyNewFriend = async (req, res) => {
  try {
    const result = await userService.replyNewFriend(req);

    return res.status(200).json({
      success: true,
      message: "Phản hồi kết bạn thành công",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllFriend = async (req, res) => {
  try {
    const friends = await userService.getAllFriend(req);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bạn bè thành công",
      data: friends, // FIX: Đã trả data danh sách bạn bè
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const token = await userService.forgotPassword(req);

    return res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi về email",
      token, // FIX: Trả về token cho FE
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const isValid = await userService.verifyOTP(req);

    return res.status(200).json({
      success: true,
      data: isValid,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = await userService.changePassword(req);

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const changeUsername = async (req, res) => {
  try {
    const result = await userService.changeUsername(req);

    return res.status(200).json({
      success: true,
      message: result?.message || "Đổi tên người dùng thành công",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await userService.resetPassword(req);

    return res.status(200).json({
      success: true,
      message: result?.message || "Cập nhật mật khẩu thành công",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const result = await userService.verifyEmail(req);

    return res.status(200).json({
      success: true,
      message: "Xác thực email thành công",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const saveCourse = async (req, res) => {
  try {
    const data = await userService.saveCourse(req);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCourseProgression = async (req, res) => {
  try {
    const data = await userService.updateCourseProgression(req);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserCourseCurriculum = async (req, res) => {
  try {
    const data = await userService.getUserCourseCurriculum(req);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveCourseNote = async (req, res) => {
  try {
    const data = await userService.saveCourseNote(req);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCourseNote = async (req, res) => {
  try {
    const data = await userService.deleteCourseNote(req);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveRoadmap = async (req, res) => {
  try {
    const result = await userService.saveRoadmap(req);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};