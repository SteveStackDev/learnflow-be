import User from "#models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const checkUserAvailableSignIn = async (inputEmail, inputPassword, body) => {
  let user = await User.findOne({ email: inputEmail });


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

    const newUser = await User.insertOne({
      username: body.username,
      password: hashed_password,
      email: body.email,
    });

    return newUser;
  }

  return user;
};