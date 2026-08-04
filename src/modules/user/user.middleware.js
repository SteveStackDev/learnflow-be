export const validatePassword = (req, res, next) => {
  const validateAuthSchema = z
    .object({
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
        "Dữ liệu không hợp lệ",
        formattedErrors,
      ),
    );
  }

  req.body = result.data;
  next();
};
