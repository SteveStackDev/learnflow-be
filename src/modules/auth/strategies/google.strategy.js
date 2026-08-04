import "dotenv/config";
import passport from "passport";
import User from "#models/user.js";
import bcrypt from "bcrypt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const saltRounds = 10;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const hashed_password = await bcrypt.hash(profile.id, saltRounds);

        user = await User.create({
          googleId: profile.id,
          password: hashed_password,
          email: profile.emails[0].value,
          username: profile.displayName,
          avatar: profile.photos[0]?.value,
          accessToken,
          refreshToken,
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

export default passport;
