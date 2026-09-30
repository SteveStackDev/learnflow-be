export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send({
      status: "failed",
      message: "Người dùng chưa đăng ký / đăng nhập",
    });
  }
};
