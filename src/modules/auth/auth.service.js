import User from "#models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const checkUserAvailable = async (
  inputUsername,
  inputPassword,
  inputEmail,
) => {
  const user = await User.findOne({ username: inputUsername });

  if (!user) {
    const hashed_password = await bcrypt.hash(inputPassword, saltRounds);

    const newUser = await User.insertOne({
      username: inputUsername,
      password: hashed_password,
      email: inputEmail,
    });

    return newUser;
  }

  const compareEmailResult = user.email === inputEmail;

  const comparePasswordResult = await bcrypt.compare(
    inputPassword,
    user.password,
  );

  if (!comparePasswordResult || !compareEmailResult) {
    return;
  }

  return user;
};
