import "dotenv/config";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import User from "#models/user.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET_ID,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.local`;

        const hashed_password = await bcrypt.hash(profile.id, saltRounds);

        user = await User.insertOne({
          githubId: profile.id,
          email: email,
          password: hashed_password,
          username: profile.displayName || profile.username,
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
