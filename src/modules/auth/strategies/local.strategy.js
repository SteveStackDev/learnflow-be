import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { checkUserAvailable } from "#modules/auth/auth.service.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        // Hỗ trợ nhận diện qua identifier, email hoặc username từ body
        const identifier =
          req.body.identifier || username || req.body.email;

        const user = await checkUserAvailable(identifier, password);

        if (!user) {
          return done(null, false, {
            message: "Tên đăng nhập/email hoặc mật khẩu không chính xác",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
