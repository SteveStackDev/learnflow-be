import User from "#models/user.js";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export const checkUserAvailableSignIn = async (inputEmail, inputPassword, body) => {
  let user = await User.findOne({ email: inputEmail });

  const compareEmailResult = user.email === inputEmail;

  const comparePasswordResult = bcrypt.compareSync(
    inputPassword,
    user.password,
  );

    const hashed_password = await bcrypt.hash(inputPassword, saltRounds);
    const testSelf = await bcrypt.compare(inputPassword, hashed_password);
    console.log("Test Hash & Compare tai cho:", testSelf);

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