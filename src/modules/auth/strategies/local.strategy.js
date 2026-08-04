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
        const user = await checkUserAvailable(
          username,
          password,
          req.body.email,
        );

        if (!user) {
          return done(null, false, {
            message: "Tài khoản hoặc mật khẩu hoặc email không đúng",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
