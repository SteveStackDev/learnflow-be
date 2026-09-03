import User from "#models/user.js";
import bcrypt from "bcrypt";
import ApiError from "#utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const saltRounds = 10;

/**
 * Tạo tài khoản người dùng mới (Sign Up)
 */
export const createUser = async ({ username, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  // 1. Kiểm tra trùng lặp tên đăng nhập
  const existingUsername = await User.findOne({ username: normalizedUsername });
  if (existingUsername) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Tên đăng nhập đã tồn tại trong hệ thống!",
      { username: "Tên đăng nhập này đã được sử dụng" },
    );
  }

  // 2. Kiểm tra trùng lặp email
  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Địa chỉ email đã tồn tại trong hệ thống!",
      { email: "Email này đã được sử dụng" },
    );
  }

  // 3. Băm mật khẩu
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 4. Tạo người dùng mới qua Mongoose
  const newUser = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return newUser;
};

/**
 * Kiểm tra thông tin đăng nhập (Sign In)
 * Hỗ trợ đăng nhập bằng Email HOẶC Username
 */
export const checkUserAvailable = async (identifier, password) => {
  if (!identifier || !password) return null;

  const cleanIdentifier = identifier.trim();
  const isEmail = cleanIdentifier.includes("@");

  // Tìm kiếm theo email hoặc username
  const query = isEmail
    ? { email: cleanIdentifier.toLowerCase() }
    : { username: cleanIdentifier };

  const user = await User.findOne(query);
  if (!user) {
    return null;
  }

  // So khớp mật khẩu
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }

  return user;
};
