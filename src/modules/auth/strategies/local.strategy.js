import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { checkUserAvailableSignIn, checkUserAvailableSignUp } from "#modules/auth/auth.service.js";

passport.use( "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await checkUserAvailableSignIn(email, password, req.body);

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

passport.use( "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await checkUserAvailableSignUp(username, password, req.body);

        if (!user) {
          return done(null, false, {
            message: "Con lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
