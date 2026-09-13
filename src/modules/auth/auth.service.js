import User from "#models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const checkUserAvailable = async (inputEmail, inputPassword, body) => {
  let user;

  if (body.username) {
    user = await User.findOne({ username: body.username });
  } else {
    user = await User.findOne({ email: inputEmail });
  }

  if (!user) {
    const hashed_password = await bcrypt.hash(inputPassword, saltRounds);

    const newUser = await User.insertOne({
      username: body.username,
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
