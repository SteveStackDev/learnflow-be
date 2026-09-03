import passport from "passport";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";

/**
 * Passport Local Strategy Middleware cho đăng nhập
 */
export const localStrategy = (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      const message =
        info?.message || "Tên đăng nhập/email hoặc mật khẩu không chính xác";
      return next(new ApiError(StatusCodes.UNAUTHORIZED, message));
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      next();
    });
  })(req, res, next);
};

/**
 * Middleware kiểm tra dữ liệu Đăng Ký (Sign Up)
 */
export const validateSignUp = (req, res, next) => {
  const validateSignUpSchema = z
    .object({
      username: z
        .string({ required_error: "Tên đăng nhập là bắt buộc" })
        .trim()
        .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
        .max(30, "Tên đăng nhập không được vượt quá 30 ký tự")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (_)",
        ),

      email: z
        .string({ required_error: "Email là bắt buộc" })
        .trim()
        .lowercase()
        .email("Email không đúng định dạng (Ví dụ: example@domain.com)")
        .max(255, "Email quá dài"),

      password: z
        .string({ required_error: "Mật khẩu là bắt buộc" })
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(100, "Mật khẩu quá dài")
        .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa")
        .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
        .regex(
          /[^a-zA-Z0-9]/,
          "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&...)",
        ),

      confirmPassword: z.string({
        required_error: "Xác nhận mật khẩu là bắt buộc",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    });

  const result = validateSignUpSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.reduce((acc, err) => {
      const fieldName = err.path[0];
      acc[fieldName] = err.message;
      return acc;
    }, {});

    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Dữ liệu đăng ký không hợp lệ",
        formattedErrors,
      ),
    );
  }

  req.body = result.data;
  next();
};

/**
 * Middleware kiểm tra dữ liệu Đăng Nhập (Sign In)
 * Chỉ yêu cầu Email HOẶC Username cùng với Mật khẩu
 */
export const validateSignIn = (req, res, next) => {
  const validateSignInSchema = z
    .object({
      identifier: z.string().trim().optional(),
      username: z.string().trim().optional(),
      email: z.string().trim().optional(),
      password: z
        .string({ required_error: "Mật khẩu là bắt buộc" })
        .min(1, "Vui lòng nhập mật khẩu"),
    })
    .refine(
      (data) => Boolean(data.identifier || data.username || data.email),
      {
        message: "Vui lòng nhập Email hoặc Tên đăng nhập",
        path: ["identifier"],
      },
    );

  const result = validateSignInSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.reduce((acc, err) => {
      const fieldName = err.path[0];
      acc[fieldName] = err.message;
      return acc;
    }, {});

    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Thông tin đăng nhập không hợp lệ",
        formattedErrors,
      ),
    );
  }

  // Chuẩn hóa trường username để passport LocalStrategy đọc được
  const cleanData = result.data;
  if (!cleanData.username) {
    cleanData.username = cleanData.identifier || cleanData.email;
  }

  req.body = cleanData;
  next();
};

// Giữ lại alias để tránh lỗi tương thích nếu có import cũ
export const validateAuth = validateSignUp;
