import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";
import { getIO } from "#configs/socketIO.js";
import jwtService from "#services/jwt.service.js";
import mailService from "#services/mail.service.js";

// GET
export const signUpGet = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Chào mừng đến trang đăng ký",
    });
  } catch (error) {
    next(error);
  }
};

export const signInGet = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Chào mừng đến trang đăng nhập",
    });
  } catch (error) {
    next(error);
  }
};

export const homeGet = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Chào mừng đến trang chủ",
    });
  } catch (error) {
    next(error);
  }
};

export const authGoogle = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Tiếp tục với Google thất bại",
      );
    }

    return res.status(StatusCodes.OK).json({
      message: "Tiếp tục với Google thành công",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const authGithub = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Tiếp tục với Github thất bại",
      );
    }

    return res.status(StatusCodes.OK).json({
      message: "Tiếp tục với Github thành công",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// POST
export const signUpPost = async (req, res, next) => {
  try {
    const token = await jwtService.generateJWT({
      id: req.user._id,
    });

    if (token) {
      await mailService.sendMail(
        req.user.email,
        "Xác thực email",
        "email.page.hbs",
        {
          userName: req.user.username,
          verifyUrl: `http://localhost:3000/api/v1/verify-email?token=${token}`,
        },
      );

      return res.status(StatusCodes.OK).json({
        message: "Đăng ký thành công",
        data: req.user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const SignInPost = async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const SignOut = async (req, res, next) => {
  try {
    const userId = req.session.passport.user.id;
    const io = getIO();

    req.logout((err) => {
      if (err) {
        return next(
          new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Đăng xuất thất bại. Lỗi: ${err.message}`,
          ),
        );
      }

      req.session.destroy((err) => {
        if (err) {
          return next(
            new ApiError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              `Xóa session thất bại. Lỗi: ${err.message}`,
            ),
          );
        }

        if (userId && io) {
          io.in(`${userId}`).disconnectSockets(true);
        }

        res.clearCookie("LearnFlow", { path: "/" });
        return res.redirect("/api/v1/auth/");
      });
    });
  } catch (error) {
    next(error);
  }
};
