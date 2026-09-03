import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import ApiError from "#utils/ApiError.js";

export const validatePassword = (req, res, next) => {
  const validateAuthSchema = z
    .object({
      email: z.string().trim().email("Email không hợp lệ").optional(),
      oldPassword: z.string().optional(),
      password: z
        .string({ required_error: "Mật khẩu là bắt buộc" })
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(100, "Mật khẩu quá dài"),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.confirmPassword) {
          const mainPass = data.password || data.newPassword;
          return mainPass === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
      },
    );

  const result = validateAuthSchema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.reduce((acc, err) => {
      const fieldName = err.path[0];
      acc[fieldName] = err.message;
      return acc;
    }, {});

    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Dữ liệu mật khẩu không hợp lệ",
        formattedErrors,
      ),
    );
  }

  // Giữ lại các trường hợp lệ và các trường mở rộng
  req.body = { ...req.body, ...result.data };
  next();
};
