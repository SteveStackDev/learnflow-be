import User from "#models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const checkUserAvailableSignIn = async (inputEmail, inputPassword, body) => {
  let user = await User.findOne({ email: inputEmail });

  const compareEmailResult = user.email === inputEmail;

  const comparePasswordResult = await bcrypt.compare(
    inputPassword,
    user.password,
  );

  // --- IN LOG DEBUG ---
  console.log("=== DEBUG BCRYPT ===");
  console.log("1. Input Pass Raw:", JSON.stringify(inputPassword)); // Xem có bị dính khoảng trắng/dấu cách không
  console.log("2. Pass trong DB:", user.password);
  console.log("3. Do dai Pass trong DB:", user.password?.length); // CẦN ĐẢM BẢO ĐÚNG 60 KÝ TỰ!
  console.log("====================");

  console.log(inputPassword, user.password);
  console.log("comparePasswordResult:", comparePasswordResult);


  if (!comparePasswordResult || !compareEmailResult) {
    return;
  }

  return user;
};

export const checkUserAvailableSignUp = async (inputUsername, inputPassword, body) => {
  let user = await User.findOne({ username: inputUsername });


  if (!user) {
    const hashed_password = await bcrypt.hash(inputPassword, saltRounds);

    const newUser = await User.create({
      username: body.username,
      password: hashed_password,
      email: body.email,
    });

    return newUser;
  }

  return user;
};