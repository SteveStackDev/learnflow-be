export const ensureAuth = (req, res, next) => {
  console.log("req.isAuthenticated():", req.isAuthenticated());
  console.log("req:", req);
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send({
      status: "failed",
      message: "Người dùng chưa đăng ký / đăng nhập",
    });
  }
};
