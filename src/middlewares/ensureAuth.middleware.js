export const ensureAuth = (req, res, next) => {
  console.log("req.isAuthenticated():", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send({
      status: "failed",
      message: "Người dùng chưa đăng ký / đăng nhập",
    });
  }
};
