import userService from "#modules/user/user.service.js";

export const updateAvatar = async (req, res) => {
  try {
    const avatarResult = await userService.changeAvatar(req);

    return res.status(201).json({
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

// User A gửi lời mời kết bạn
// User B nhận thông báo có lời mới kết bạn
// User B chấp nhận
// User A add một bạn mới vào list
// User B add một bạn mới vào list
// Thêm một event nhận notification của từng user
export const addNewFriend = async (req, res) => {
  try {
    await userService.addNewFriend(req);

    return res.status(201).json({
      success: true,
      message: "Kết bạn thành công",
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
    await userService.replyNewFriend(req);

    return res.status(201).json({
      success: true,
      message: "Kết bạn thành công",
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
    await userService.getAllFriend(req);

    return res.status(201).json({
      success: true,
      message: "Lấy danh sách bạn bè thành công",
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
    await userService.forgotPassword(req);

    return res.status(201).json({
      success: true,
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
    await userService.verifyOTP(req);

    return res.status(201).json({
      success: true,
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
    await userService.changePassword(req);

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req);

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    await userService.verifyEmail(req);

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
