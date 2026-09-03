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
    const friendsList = await userService.getAllFriend(req);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách bạn bè thành công",
      data: friendsList || [],
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
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Email không tồn tại trong hệ thống hoặc không thể gửi mã OTP!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn",
      token,
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
    const result = await userService.verifyOTP(req);

    if (result !== "OTP hợp lệ") {
      return res.status(400).json({
        success: false,
        message: result || "Mã OTP không hợp lệ hoặc đã hết hạn",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xác thực mã OTP thành công",
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
    const success = await userService.changePassword(req);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Không thể đổi mật khẩu, vui lòng kiểm tra lại thông tin!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu mới thành công",
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
    const success = await userService.resetPassword(req);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không chính xác!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
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
    const success = await userService.verifyEmail(req);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Mã xác thực không hợp lệ hoặc đã hết hạn!",
      });
    }

    if (req.method === "GET") {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientUrl}/verify-email?token=${req.query.token}&status=success`);
    }

    return res.status(200).json({
      success: true,
      message: "Kích hoạt tài khoản thành công!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
